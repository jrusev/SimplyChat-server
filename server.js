var express         = require('express');
var path            = require('path');
var passport        = require('passport');
var config          = require('./server/config');
var log             = require('./server/log')(module);
var app = express();

console.log('process.env.NODE_ENV = ' + process.env.NODE_ENV);

require('./server/mongoose');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(passport.initialize());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, "public")));

require('./server/passport-config');

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

// Configure routes
require('./server/routes')(app);

var port = process.env.PORT || 1337;
app.listen(port, function(){
    log.info('Express server listening on port ' + port);
});