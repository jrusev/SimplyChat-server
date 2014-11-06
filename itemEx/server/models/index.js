'use strict';

var UserModel = require('../models/user'),
    MessageModel = require('../models/message');

module.exports = {
    User : UserModel,
    Message: MessageModel
};