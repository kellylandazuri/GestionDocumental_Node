'use strict'
//This will depend on how DynamoDB is used
var AWS2 = require("aws-sdk");
AWS2.config.update({
    region: "us-east-1"
});
var docClient = new AWS2.DynamoDB.DocumentClient(new AWS2.Endpoint("https://dynamodb.us-east-1.amazonaws.com"));

var table = process.env.DYNAMOTABLE;

exports.getDocumentFolderFromDB = function(key, callback) {
    var params = {
        TableName: table,
        Key: {
            "DOCUMENTPATH": key,
        }
    };
    docClient.get(params, function(err, dataDynamo) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            callback(err, null);
        } else {
            console.log("GetItem succeeded:", JSON.stringify(dataDynamo, null, 2));
            callback(null, dataDynamo);
        }
    });
}

exports.putDocumentFolderToDB = function(data, callback) {
    var params = {
        TableName: table,
        Item: {
            "DOCUMENTPATH": data.DOCUMENTPATH,
            "INFO": {
                "PATH": data.DOCUMENTPATH,
                "CURRENT_VERSIONID": data.CURRENT_VERSIONID,
                "CLIENT_COMPANYID": data.CLIENT_COMPANYID,
                "USERID": data.USERID,
                "NAME": data.NAME,
                "ACCESS_DATE": data.ACCESS_DATE, //FOR DOWNLOADS
                "MODIFICATION_DATE": data.MODIFICATION_DATE, //FOR UPDATES AND DELETES
                "CREATION_DATE": data.CREATION_DATE,
                "DELETED_DATE": data.DELETED_DATE,
                "SIZE": data.SIZE, //SIZE IN BYTES AND ONLY FOR DOCUMENTS
                "FORMAT": data.FORMAT,
                "STATE": data.STATE,
                "TYPE": data.TYPE, //COULD BE DOCUMENT OR A FOLDER
                "PATH_FATHER": data.PATH_FATHER,
                "ACTION_HISTORY": data.ACTION_HISTORY
            }
        }
    }
    docClient.put(params, function(err, dataDynamo) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            callback(err, null);
        } else {
            console.log("Added item:", JSON.stringify(dataDynamo, null, 2));
            callback(null, dataDynamo);
        }
    });

}

exports.deteleDocumentFolderFromDB = function(key, callback) {
    var params = {
        TableName: table,
        Key: {
            "DOCUMENTPATH": key,
        }
    };
    docClient.delete(params, function(err, data) {
        if (err) {
            console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
            callback(err, null);
        } else {
            console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
            callback(null, data);
        }
    });
}


exports.getDocumentFolderByCompany = function(data, callback) {
    var params = {
        TableName: table,
        KeyConditionExpression: "companyId = :bs",
        ExpressionAttributeValues: {
            ":bs": data.companyId
        }
    }
    docClient.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
            data.Items.forEach(function(item) {
                console.log(" -", item.NAME + ": " + item.state);
            });
        }
    });
}
exports.getDocumentFolderByState = function(data, callback) {
    var params = {
        TableName: table,
        KeyConditionExpression: "companyId = :bs and  state = :st ",
        ExpressionAttributeValues: {
            ":bs": data.companyId,
            ":st": data.state
        }
    }
    docClient.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
            data.Items.forEach(function(item) {
                console.log(" -", item.NAME + ": " + item.state);
            });
        }
    });
}

exports.getPermissionsByDocumentFolder = function(key, callback) {
    var params = {
        TableName: table,
        ProjectionExpression: "PERMISSIONS",
        KeyConditionExpression: "DOCUMENTPATH=:key ",
        ExpressionAttributeValues: {
            "key": key
        }
    }
    docClient.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
        }
    });
}

exports.deleteDocumentFolder = function(key, state, callback) {
    var params = {
        TableName: table,
        Key: {
            "DOCUMENTPATH": key,
        },
        UpdateExpression: "set STATE = :state",
        ExpressionAttributeValues: {
            ":state": state
        },
        ReturnValues: "UPDATED_NEW"
    };
    docClient.update(params, callback);
}
exports.updatePermissionsByDocumentFolder = function(key, permList, callback) {
    var params = {
        TableName: table,
        Key: {
            "DOCUMENTPATH": key,
        },
        UpdateExpression: "set PERMISSIONS = :permList",
        ExpressionAttributeValues: {
            ":permList": permList
        },
        ReturnValues: "UPDATED_NEW"
    };
    docClient.update(params, callback);
}
exports.updatePermissionsByDocumentFolder = function(key, permList, callback) {
    var params = {
        TableName: table,
        Key: {
            "DOCUMENTPATH": key,
        },
        UpdateExpression: "set PERMISSIONS = :permList",
        ExpressionAttributeValues: {
            ":permList": permList
        },
        ReturnValues: "UPDATED_NEW"
    };
    docClient.update(params, callback);
}

exports.activateVersion = function(key, versionId, callback) {
    var params = {
        TableName: table,
        Key: {
            "DOCUMENTPATH": key,
        },
        UpdateExpression: "set CURRENT_VERSIONID = :versionId",
        ExpressionAttributeValues: {
            ":versionId": versionId
        },
        ReturnValues: "UPDATED"
    };
    docClient.update(params, callback);
}