var express = require('express');
var path = require('path');

// var  = require('./');
// var  = require('./');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require("dotenv").config();

// app.use('/', );
// app.use('/users', );

// Middleware de error 
app.use(function(err, req, res, next) {

  let message = err.message;
  let error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({"message": message, "error": error});
});

module.exports = app;
