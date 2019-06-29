//All control operations or functions are described here
'use strict';
var AWS = require('aws-sdk');
var fs = require('fs');
var s3 = new AWS.S3();
exports.helloWorld = function(req, res) {
   res.send(process.env.G);
};

exports.createFatherFolder = function(req,res){
   var params = { 
      Bucket: process.env.BUCKET, 
      Key: req.body.companyCode+"/"
   };
   s3.putObject(params, function(err, data) {
      if (err){
         console.log(err, err.stack);
         res.json(err.stack);
      } 
      else{
         console.log(data);
         res.json(data);
      }     
   });
}
exports.putDocumentFolder = function(req,res){
   var params = {
      Body:fs.readFileSync(req.files.document.path), 
      Bucket: process.env.BUCKET, 
      Key: req.fields.fileName
   };
   s3.upload(params, function(err, data) {
      if (err){
         console.log(err, err.stack);
         res.json(err.stack);
      } 
      else{
         console.log(data);
         res.json(data);
      }     
   });
}
exports.getDocumentFolder = function(req,res){
   var params = {
      Bucket: process.env.BUCKET, 
      Key: req.params.path,
      VersionId: req.params.versionId
   };
   res.attachment(req.params.path);
   var fileStream = s3.getObject(params, function(err, data) {
      if (err){
         console.log(err, err.stack); 
      } 
      else{
         console.log(data);
      }
   }).createReadStream();
   fileStream.pipe(res);           
}