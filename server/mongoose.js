'use strict';

var mongoose    = require('mongoose');
var log         = require('./log')(module);
var config      = require('./config');

var dbUrl = process.env.NODE_ENV ? config.get('production:db') : config.get('development:db');
mongoose.connect(dbUrl);
var db = mongoose.connection;

db.on('error', function (err) {
    log.error('connection error:', err.message);
});
db.once('open', function callback () {
    log.info("Connected to DB at " + dbUrl);
});

// init models
require('./models');

// seed db

module.exports.mongoose = mongoose;
