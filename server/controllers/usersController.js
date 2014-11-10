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
    register: function(req, res) {
        var user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password: req.body.password,
            location: req.body.location,
            imageUrl: req.body.imageUrl
        });

        user.save(function (err) {
            if (!err) {
                log.info("User created");
                return res.send({ 
                    userId: user.userId,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    imageUrl: user.imageUrl,
                    city: user.city
                });
            } else {
                console.log(err);
                if(err.name == 'ValidationError') {
                    res.statusCode = 400;
                    res.send({ error: 'Validation error' });
                } else {
                    res.statusCode = 500;
                    res.send({ error: 'Server error' });
                }
                log.error('Internal error(%d): %s',res.statusCode,err.message);
            }
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
    },
    getContacts: function(req, res) {
        return User.find({ username: { $ne: req.user.username } }, function (err, users) {
            if (err) {
                res.statusCode = 500;
                log.error('Internal error(%d): %s',res.statusCode,err.message);
                return res.send({ error: 'Server error' });
            }           

            return res.send({ users: users});
        });
    }
}
