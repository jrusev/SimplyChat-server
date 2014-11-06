'use strict';

var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
    development: {
        rootPath: rootPath,
        db: 'mongodb://localhost/item-exchange',
        port: process.env.PORT || 3030
    },
    production: {
        rootPath: rootPath,
        db: 'admin:123456q@ds039950.mongolab.com:39950/itemex',
        port: process.env.PORT || 3030
    }
};