'use strict';

var log         = require('../log')(module);
var User        = require('../models').User;
var Message     = require('../models').Message;

module.exports = {
    getInbox : function (req, res, next) {
        // GET /api/messages/inbox
        var currentUser = req.user;
        Message.find({ 'to': currentUser._id })
            .populate('from to', 'username firstName lastName imageUrl')
            .exec(function (err, messages) {
                if (err) {
                    res.send(err);
                    return log('Messages could not be loaded: ' + err);
                }

                res.send(messages);            
                // Mark as read after sent
                messages.forEach(function (m) {
                    m.isRead = true;
                    m.save();
                });
            });
    },
    getSent : function (req, res, next) {
        // GET /api/messages/inbox
        var currentUser = req.user;
        Message.find({ 'from': currentUser._id })
            .populate('from to', 'username firstName lastName imageUrl')
            .exec(function (err, messages) {
                if (err) {
                    res.send(err);
                    return log('Messages could not be loaded: ' + err);
                }
                // DO NOT MARK AS READ !!!
                res.send(messages);
            });
    },
    getAllWithUser : function (req, res, next) {
        // GET /api/messages/withUser/:username
        var currentUser = req.user;
        User.findOne({ username: req.params.username }).exec(function (err, otherUser) {
            if (otherUser) {
                
                if (otherUser._id.equals(currentUser._id)) {
                    return res.status(404).send({message: 'You cannot have messages from yourself!'});                    
                }
                
                Message.find({ 
                        $or: 
                        [
                         { $and:[ {'from': currentUser._id}, {'to': otherUser._id} ] },
                         { $and:[ {'from': otherUser._id}, {'to': currentUser._id} ] }
                        ]
                    })
                    .populate('from to', 'username firstName lastName imageUrl')
                    .exec(function (err, messages) {
                        if (err) {
                            res.send(err);
                            return log('Messages could not be loaded: ' + err);
                        }
                        
                        console.log(messages);
                        res.send({messages:messages});            
                        // Mark as read after sent
                        messages.forEach(function (m) {
                            if (!m.isRead && m.to._id.equals(currentUser._id)) {
                                m.isRead = true;
                                m.save();
                            }
                        });
                    });
                
            } else {
                res.status(404).send('Other user not found!');
            }
        });
    },
    getMessageById: function (req, res, next) {
        // GET /api/messages/:id
        var currentUser = req.user;
        Message.findOne(
            { 
                $and: 
                [
                 {_id: req.params.id},
                 { $or:[ {'from': currentUser._id}, {'to': currentUser._id} ] }
                ]
            })
            .populate('from to', 'username firstName lastName imageUrl')
            .exec(function (err, message) {
                if (err) {
                    res.send(err);
                    return log('Message could not be loaded: ' + err);
                }
            
                if (message) {
                    res.send(message);
                    // Mark as read
                    if (!message.isRead && message.to.username == currentUser.username) {
                        message.isRead = true;
                        message.save();
                    }
                } else {
                    res.status(404).send('Message not found!');
                }
            });
    },
    sendMessage: function (req, res, next) {
        // POST api/messages/send/:username
        var sender = req.user;
        User.findOne({ username: req.params.username }).exec(function (err, receiver) {
            if (receiver) {
                
                if (receiver._id.equals(sender._id)) {
                    return res.status(404).send({message: 'You cannot send message to your self!'});                    
                }
                
                var newMessage = new Message({
                    title: req.body.title,
                    content: req.body.content,
                    date: new Date(),
                    from: sender._id,
                    to: receiver._id,
                    isRead: false
                });

                newMessage.save(function (err) {
                    if (err) {
                        res.status(400).send(err);
                        return log('Error in saving message' + err);
                    }

                    res.send(newMessage);
                    
                    // Send push notification for new message to the receiver
                });
                
                receiver.messages.push(newMessage);
                receiver.save(); 
            } else {
                res.status(404).send('User not found!');
            }
        });
    }
}