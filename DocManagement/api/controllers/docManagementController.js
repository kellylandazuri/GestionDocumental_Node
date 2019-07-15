//All control operations or functions are described here
'use strict';
var AWS = require('aws-sdk'),
    fs = require('fs'),
    model = require('../models/docManagementModel'),
    path = require('path'),
    mime = require('mime');
var s3 = new AWS.S3();
exports.helloWorld = function(req, res) {
    res.send(process.env.G);
};

exports.createFatherFolder = function(req, res) {
    var params = {
        Bucket: process.env.BUCKET,
        Key: req.body.companyId + "/"
    };
    s3.putObject(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            res.json(err.stack);
        } else {
            console.log(data);
            var dbData = req.body;
            dbData.DOCUMENTPATH = dbData.CLIENT_COMPANYID + "/";
            dbData.CURRENT_VERSIONID = data.VersionId;
            dbData.NAME = dbData.CLIENT_COMPANYID;
            dbData.ACCESS_DATE = (new Date()).toISOString();
            dbData.MODIFICATION_DATE = (new Date()).toISOString();
            dbData.CREATION_DATE = (new Date()).toISOString();
            model.putDocumentFolderToDB(dbData, function(errDynamo, dataDynamo) {
                if (err) {
                    res.json(errDynamo.stack);
                } else {
                    res.json(dataDynamo);
                }
            });
        }
    });
}
exports.putDocumentFolder = function(req, res) {
    if (req.files.document != null) {
        console.log(req);
        var params = {
            Body: fs.readFileSync(req.files.document.path),
            Bucket: process.env.BUCKET,
            Key: req.fields.DOCUMENTPATH
        };
        s3.upload(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);
                res.json(err.stack);
            } else {
                console.log(data);
                var dbData = req.fields;
                dbData.CURRENT_VERSIONID = data.VersionId;
                if (dbData.ACTION_HISTORY == undefined)
                    dbData.ACTION_HISTORY = [{ "USERID": req.params.userid, "ACTION": "CREATED", "ACTION_DATE": (new Date()).toISOString() }];
                else
                    dbData.ACTION_HISTORY.push({ "USERID": req.params.userid, "ACTION": "UPDATED", "ACTION_DATE": (new Date()).toISOString() });
                model.putDocumentFolderToDB(dbData, function(errDynamo, dataDynamo) {
                    if (err) {
                        res.json(errDynamo.stack);
                    } else {
                        res.json(dataDynamo);
                    }
                });
            }
        });
    } else {
        console.log(req);
        model.putDocumentFolderToDB(req.fields, function(errDynamo, dataDynamo) {
            if (errDynamo) {
                res.json(errDynamo.stack);
            } else {
                res.json(dataDynamo);
            }
        });
    }
}
exports.getDocumentFolder = function(req, res) {
    model.getDocumentFolderFromDB(req.params.path, function(errDynamo, dataDynamo) {
        if (errDynamo) {
            res.send(errDynamo);
        } else {
            console.log(dataDynamo.Item);
            if (dataDynamo.Item.INFO != undefined) {
                var filePath = path.join(__dirname, 'downloads', dataDynamo.Item.INFO.NAME);
                var file = fs.createWriteStream(filePath);
                var params = {
                    Bucket: process.env.BUCKET,
                    Key: dataDynamo.Item.INFO.PATH,
                    VersionId: dataDynamo.Item.INFO.CURRENT_VERSIONID
                };
                res.attachment(dataDynamo.Item.INFO.NAME);
                var fileStream = s3.getObject(params).
                on('httpData', function(chunk) {
                    file.write(chunk);
                }).
                on('httpDone', function() {
                    console.log("inside httpDone");
                    file.end();
                    var dbData = dataDynamo.Item.INFO;
                    dbData.DOCUMENTPATH = dbData.PATH;
                    dbData.ACCESS_DATE = (new Date()).toISOString();
                    dbData.ACTION_HISTORY.push({ "USERID": req.params.userid, "ACTION": "DOWNLOADED", "ACTION_DATE": (new Date()).toISOString() });
                    model.putDocumentFolderToDB(dbData, function(errPut, dataPut) {
                        if (errPut) {
                            console.log(errPut.stack);
                        } else {
                            console.log(dataPut);
                        }
                    });
                }).
                send(function() {
                    console.log("inside send");
                    res.setHeader('Content-disposition', 'attachment; filename=' + dataDynamo.Item.INFO.NAME);
                    res.setHeader('Content-type', mime.getType(filePath));
                    res.setHeader('Transfer-Encoding', 'chunked');
                    var filestream = fs.createReadStream(filePath);
                    filestream.pipe(res);
                });
            } else {
                res.send("");
            }
        }
    })
}
exports.getDocumentFolderVersions = function(req, res) {
    var params = {
        Bucket: process.env.BUCKET,
        Prefix: req.params.path
    };
    s3.listObjectVersions(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            res.json(err.stack);
        } else {
            console.log(data);
            res.json(data);
        }
    });
}
exports.deleteDocumentFolder = function(req, res) {
    var params = {
        Bucket: process.env.BUCKET,
        Key: req.params.path
    };
    s3.deleteObject(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            res.json(err.stack);
        } else {
            console.log(data);
            model.deteleDocumentFolderFromDB(req.params.path, function(errDynamo, dataDynamo) {
                if (errDynamo) {
                    res.json(errDynamo.stack)
                } else {
                    res.json(data);
                }
            });
        }
    });
    res.attachment(req.params.path);
}

exports.putRemoveDocumentFolder = function(req, res) {
    var params = {
        Body: fs.readFileSync(req.files.document.path),
        Bucket: process.env.BUCKET,
        Key: req.fields.fileName
    };
    model.deleteDocumentFolder(req.params.path, "INV", function(errDynamo, dataDynamo) {
        if (errDynamo) {
            res.json(errDynamo.stack);
        } else {
            res.json(dataDynamo);
        }
    });

}
exports.getDocumentFolderByCompany = function(req, res) {
    var params = {
        Bucket: process.env.BUCKET,
        Key: req.params.path
    };
    model.getDocumentFolderByCompany(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            res.json(err.stack);
        } else {
            console.log(data);
            res.json(data);
        }
    });
}
exports.getDocumentFolderByState = function(req, res) {
    var params = {
        Bucket: process.env.BUCKET,
        Key: req.params.path
    };
    model.getDocumentFolderByState(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            res.json(err.stack);
        } else {
            console.log(data);
            res.json(data);
        }
    });
}