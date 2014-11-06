var express         = require('express');
var path            = require('path');
var passport        = require('passport');
var config          = require('./server/config');
var log             = require('./server/log')(module);
var oauth2          = require('./server/oauth2');
var articles        = require('./server/controllers/articlesController');
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
app.delete('/api/articles/:id', passport.authenticate('bearer', { session: false }), articles.deleteArticle);;

// Auth
app.post('/oauth/token', oauth2.token);

app.get('/api/userInfo', passport.authenticate('bearer', { session: false }), function(req, res) {    
    var user = req.user;
    // req.authInfo is set using the `info` argument supplied by
    // `BearerStrategy`.  It is typically used to indicate scope of the token,
    // and used in access control checks.  For illustrative purposes, this
    // example simply returns the scope in the response.
    res.send({ 
            user: {
                userId: user.userId,
                username: user.username,
                messages: user.messages
            },
            scope: req.authInfo.scope 
        });
});

app.get('/ErrorExample', function(req, res, next){
    next(new Error('Random error!'));
});

app.listen(config.get('port'), function(){
    log.info('Express server listening on port ' + config.get('port'));
});