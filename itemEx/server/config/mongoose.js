'use strict';

var mongoose = require('mongoose'),
    Models = require('../models');

module.exports = function (config) {
    mongoose.connect(config.db);
    var db = mongoose.connection;

    db.once('open', function (err) {
        if (err) {
            console.log('Database could not be opened: ' + err);
            return;
        }

        console.log('Database up and running...');
    });

    db.on('error', function (err) {
        console.log('Database error: ' + err);
    });
    
    Models.Message.init();
    Models.User.init();    
    Models.User.seedInitialUsers(function (err) {
        Models.Item.seedInitialItems(function (err) {
            addOwnersToItems();
        });        
    });
    
    function addOwnersToItems() {
        mongoose.model('Item').find(function (err, items) {
            
            console.log('There are '+ items.length + ' items.');
            mongoose.model('User').find({roles: { $ne: 'admin' }}, function (err, users) {
                
                console.log('There are '+ users.length + ' users.');
                items.forEach(function (item) { 
                    var i = Math.floor(Math.random() * users.length);
                    var randomUser = users[i];
                    item.owner = randomUser._id;
                    item.save();
                    console.log(randomUser.username + ' has ' + item.title);
                });
            });
        });       
    }
};