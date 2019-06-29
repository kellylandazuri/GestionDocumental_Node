const dotenv = require('dotenv');
dotenv.config();

var express = require('express'),
  app = express(),
  port = process.env.PORT,
  bodyParser = require('body-parser'),
  formidable = require('express-formidable');
  


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit:'5000mb'}));//Needs to be analized
app.use(formidable());

var routes = require('./api/routes/routes'); //importing route
routes(app); //register the route

app.listen(port);


console.log('Server is running in port: ' + port);