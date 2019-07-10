//All control operations or functions are described here
'use strict';
var AWS = require('aws-sdk'),
    fs = require('fs'),
    model = require('../models/docManagementModel');
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
            dbData.documentpath = dbData.companyId + "/";
            dbData.versionId = data.VersionId;
            dbData.name = dbData.companyId;
            dbData.accessDate = (new Date()).toISOString();
            dbData.modificationDate = (new Date()).toISOString();
            dbData.creationDate = (new Date()).toISOString();
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
    var params = {
        Body: fs.readFileSync(req.files.document.path),
        Bucket: process.env.BUCKET,
        Key: req.fields.fileName
    };
    s3.upload(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            res.json(err.stack);
        } else {
            console.log(data);
            res.json(data);
        }
    });
}
exports.getDocumentFolder = function(req, res) {
    var params = {
        Bucket: process.env.BUCKET,
        Key: req.params.path,
        VersionId: req.params.versionId
    };
    res.attachment(req.params.path);
    var fileStream = s3.getObject(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
        } else {
            console.log(data);
        }
    }).createReadStream();
    fileStream.pipe(res);
}

exports.putRemoveDocumentFolder = function(req, res) {
    var params = {
        Body: fs.readFileSync(req.files.document.path),
        Bucket: process.env.BUCKET,
        Key: req.fields.fileName
    };

}