"use strict";
var express = require('express')
var app = express();
var server = require('http').Server(app);
var env = process.env;

server.listen(process.env.PORT || process.env.port || process.env.OPENSHIFT_NODEJS_PORT || 8080, process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0', function() {
  console.log('Listening on');
	console.log(this.address().port);
  console.log(this.address());
})

app.use(express.static('public'));
app.use(express.static('node_modules'));
