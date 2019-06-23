//All routes are described here
'use strict';
module.exports = function(app) {
    var controller = require('../controllers/docManagementController');
    // todoList Routes
    app.route('/holaMundo')
      .get(controller.helloWorld);
};