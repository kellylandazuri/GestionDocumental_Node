'use strict'
//This will depend on how DynamoDB is used
var AWS2 = require("aws-sdk");
AWS2.config.update({
    region: "us-east-1"
});
var docClient = new AWS2.DynamoDB.DocumentClient(new AWS2.Endpoint("https://dynamodb.us-east-1.amazonaws.com"));

var table = process.env.DYNAMOTABLE;

exports.putDocumentFolderToDB = function(data, callback) {
    var params = {
        TableName: table,
        Item: {
            "DOCUMENTPATH": data.documentpath,
            "INFO": {
                "PATH": data.documentpath,
                "CURRENT_VERSIONID": data.versionId,
                "CLIENT_COMPANYID": data.companyId,
                "USERID": data.userId,
                "NAME": data.name,
                "ACCESS_DATE": data.accessDate, //FOR DOWNLOADS
                "MODIFICATION_DATE": data.modificationDate, //FOR UPDATES AND DELETES
                "CREATION_DATE": data.creationDate,
                "DELETED_DATE": data.deletedDate,
                "SIZE": data.size, //SIZE IN BYTES AND ONLY FOR DOCUMENTS
                "FORMAT": data.format,
                "STATE": data.state,
                "TYPE": data.type, //COULD BE DOCUMENT OR A FOLDER
                "PATH_FATHER": data.pathFather,
                "ACTION_HISTORY": data.actions
            }
        }
    }
    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            callback(err, null);
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
            callback(null, data);
        }
    });
}


exports.getDocumentFolderByBussines = function(data, callback) {
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

exports.getPermissionsByDocumentFolder = function(name, callback) {
    var params = {
        TableName: table,
        ProjectionExpression: "PERMISSIONS",
        KeyConditionExpression: "path=:name ",
        ExpressionAttributeValues: {
            "name": name
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

exports.deleteDocumentFolder = function(name, state, callback) {
    var params = {
        TableName: table,
        Key: {
            path: name
        },
        UpdateExpression: "set STATE = :state",
        ExpressionAttributeValues: {
            ":state": state
        },
        ReturnValues: "UPDATED_NEW"
    };
    docClient.update(params, callback);
}