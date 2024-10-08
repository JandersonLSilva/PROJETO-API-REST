var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')
const jwt = require("jsonwebtoken")

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require("dotenv").config();


// Middleware de error 
app.use(function(err, req, res, next) {

  let message = err.message;
  let error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({"message": message, "error": error});
});

module.exports = app;
