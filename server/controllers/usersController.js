var log     = require('../log')(module);
var User    = require('../models').User;

module.exports = {
    currentUser: function(req, res) {    
        var user = req.user;
        // req.authInfo is set using the `info` argument supplied by `BearerStrategy`.
        // It is typically used to indicate scope of the token, and used in access control checks. 
        // e.g. req.authInfo.scope 
        console.log(user);
        res.send({ 
            userId: user.userId,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
            city: user.city
        });
    },
    byUsername: function(req, res) {
        User.findOne({ username: req.params.username }).exec(function (err, user) {
            if (user) {
                res.send(user);
            } else {
                console.log('User not found!');
                res.status(404).send({error:'User not found!'});
            }
        });
    },
    getAllUsers: function(req, res) {
        return User.find(function (err, users) {
            if (!err) {
                return res.send({ users: users});
            } else {
                res.statusCode = 500;
                log.error('Internal error(%d): %s',res.statusCode,err.message);
                return res.send({ error: 'Server error' });
            }
        });
    }
}
