var express         = require('express');
var path            = require('path');
var passport        = require('passport');
var config          = require('./libs/config');
var log             = require('./libs/log')(module);
var oauth2          = require('./libs/oauth2');
var articles        = require('./libs/controllers/articlesController');
var app = express();

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(passport.initialize());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, "public")));

require('./libs/auth');

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
app.all('/api/articles/*', passport.authenticate('bearer', { session: false }))
    .get('/api/articles', articles.getAllArticles)
    .get('/api/articles/:id', articles.getArticleById)
    .post('/api/articles', articles.createArticle)
    .put('/api/articles/:id', articles.updateArticle)
    .delete('/api/articles/:id', articles.deleteArticle);

// Auth
app.post('/oauth/token', oauth2.token);

app.get('/api/userInfo',
    passport.authenticate('bearer', { session: false }),
        function(req, res) {
            var user = req.user;
            // req.authInfo is set using the `info` argument supplied by
            // `BearerStrategy`.  It is typically used to indicate scope of the token,
            // and used in access control checks.  For illustrative purposes, this
            // example simply returns the scope in the response.
            // res.json({ user_id: req.user.userId, name: req.user.username, scope: req.authInfo.scope })
            res.send({ user: {userId: user.userId, username: user.username, messages: user.messages}, scope: req.authInfo.scope });
        }
);

app.get('/ErrorExample', function(req, res, next){
    next(new Error('Random error!'));
});

app.listen(config.get('port'), function(){
    log.info('Express server listening on port ' + config.get('port'));
});