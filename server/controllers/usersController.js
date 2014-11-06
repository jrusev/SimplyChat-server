var log             = require('../log')(module);
var User    = require('../mongoose').UserModel;

var userInfo = function(req, res) {    
    var user = req.user;
    // req.authInfo is set using the `info` argument supplied by `BearerStrategy`.
    // It is typically used to indicate scope of the token, and used in access control checks. 
    res.send({ 
            user: {
                userId: user.userId,
                username: user.username,
                messages: user.messages
            },
            scope: req.authInfo.scope 
        });
};

var getAllUsers = function(req, res) {
    return User.find(function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
};

module.exports = {
    userInfo: userInfo,
    getAllUsers: getAllUsers
}
