'use strict';

var passport        = require('passport');
var log             = require('./log')(module);
var oauth2          = require('./oauth2');
var articles        = require('./controllers/articlesController');
var messages        = require('./controllers/messagesController');
var users           = require('./controllers/usersController');

module.exports = function (app) {
    
    app.get('/api', passport.authenticate('bearer', { session: false }), function (req, res) {
        res.send('API is running');
    });

    // Articles
    app.get('/api/articles', passport.authenticate('bearer', { session: false }), articles.getAllArticles);
    app.get('/api/articles/:id', passport.authenticate('bearer', { session: false }), articles.getArticleById);
    app.post('/api/articles', passport.authenticate('bearer', { session: false }), articles.createArticle);
    app.put('/api/articles/:id', passport.authenticate('bearer', { session: false }), articles.updateArticle);
    app.delete('/api/articles/:id', passport.authenticate('bearer', { session: false }), articles.deleteArticle);

    //Messages
    app.get('/api/messages/inbox', passport.authenticate('bearer', { session: false }), messages.getInbox);
    app.get('/api/messages/sent', passport.authenticate('bearer', { session: false }), messages.getSent);
    app.get('/api/messages/:id', passport.authenticate('bearer', { session: false }), messages.getMessageById);
    app.get('/api/messages/withUser/:username', passport.authenticate('bearer', { session: false }), messages.getAllWithUser);
    app.post('/api/messages/send/:username', passport.authenticate('bearer', { session: false }), messages.sendMessage);

    // Auth
    app.post('/auth/token', oauth2.token); // login 
    app.post('/auth/logout', function (req, res, next) { 
        req.logout(); // does not work!
        res.send({ message: 'Successful logout.' });
    });   
    
    // Users
    app.get('/api/users/currentUser', passport.authenticate('bearer', { session: false }), users.currentUser);
    app.get('/api/users/byUsername:username', passport.authenticate('bearer', { session: false }), users.byUsername);
    app.get('/api/users', passport.authenticate('bearer', { session: false }), users.getAllUsers);

    app.get('/ErrorExample', function(req, res, next){
        next(new Error('Random error!'));
    });
};