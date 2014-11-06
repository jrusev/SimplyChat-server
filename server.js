var express         = require('express');
var path            = require('path');
var passport        = require('passport');
var config          = require('./server/config');
var log             = require('./server/log')(module);
var oauth2          = require('./server/oauth2');
var articles        = require('./server/controllers/articlesController');
var messages        = require('./server/controllers/messagesController');
var users           = require('./server/controllers/usersController');
var app = express();

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(passport.initialize());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, "public")));

require('./server/auth');

app.use(function(req, res, next){
    res.status(404);
    log.debug('Not found URL: %s',req.url);
    res.send({ error: 'Not found' });
    return;
});

app.use(function(err, req, res, next){
    res.status(err.status || 500);
    log.error('Internal error(%d): %s',res.statusCode,err.message);
    res.send({ error: err.message });
    return;
});

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
app.post('/api/messages/send/:username', passport.authenticate('bearer', { session: false }), messages.sendMessage);

// Auth
app.post('/oauth/token', oauth2.token);

// Users
app.get('/api/userInfo', passport.authenticate('bearer', { session: false }), users.userInfo);
app.get('/api/users', passport.authenticate('bearer', { session: false }), users.getAllUsers);

app.get('/ErrorExample', function(req, res, next){
    next(new Error('Random error!'));
});

app.listen(config.get('port'), function(){
    log.info('Express server listening on port ' + config.get('port'));
});