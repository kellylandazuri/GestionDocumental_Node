//All routes are described here
'use strict';
module.exports = function(app) {
    var controller = require('../controllers/docManagementController');
    var auth = require('../auth/auth');
    // todoList Routes
    app.route('/holaMundo')
      .get(controller.helloWorld);
    app.route('/documentfolder/:path/:versionId')
      .get(controller.getDocumentFolder);
    app.route('/documentfolder')
      .post(controller.createFatherFolder)
      .put(controller.putDocumentFolder);
};