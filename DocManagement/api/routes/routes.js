//All routes are described here
'use strict';
module.exports = function(app) {
    var formidable = require('express-formidable');
    var controller = require('../controllers/docManagementController');
    var auth = require('../auth/auth');
    // todoList Routes
    app.route('/holaMundo')
        .get(auth.isAuthenticated, controller.helloWorld);
    app.route('/documentfolder/:path/:userid')
        .get(controller.getDocumentFolder)
        .delete(controller.deleteDocumentFolder);
    app.route('/documentfolderversion/:path/:userid')
        .get(controller.getDocumentFolderVersions);
    app.route('/documentfolder/:userid')
        .post(controller.createFatherFolder)
        .put(formidable(),controller.putDocumentFolder);
    app.route('/documentfolder/company/:companyId')
        .get(controller.getDocumentFolderByCompany);
    app.route('/documentfolder/:companyId/state/:state')
        .get(controller.getDocumentFolderByState);
    app.route("/documentfolder/remove/:path/state/:state")
        .put(controller.putRemoveDocumentFolder);
    app.route("/documentfolderPermission/:path")
        .get(controller.getPermissionsByDocumentFolder)
        .put(controller.putPermissionsByDocumentFolder);
    app.route("/documentfolder/:path/versionActive/:versionId")
        .put(controller.activateVersion);
};