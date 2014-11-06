var log                 = require('./server/log')(module);
var mongoose            = require('./server/mongoose').mongoose;
var UserModel           = require('./server/mongoose').UserModel;
var ClientModel         = require('./server/mongoose').ClientModel;
var MessageModel        = require('./server/mongoose').MessageModel;
var AccessTokenModel    = require('./server/mongoose').AccessTokenModel;
var RefreshTokenModel   = require('./server/mongoose').RefreshTokenModel;


var faker               = require('Faker');

MessageModel.remove({}, function(err) {
    if(err) return log.error(err);
    log.info('Old messages deleted!');
});

UserModel.remove({}, function(err) {
    var user = new UserModel({
        username: "admin",
        password: "admin",
        firstName: faker.random.first_name(),
        lastName: faker.random.last_name()
    });
    user.save(function(err, user) {
        if(err) return log.error(err);
        else log.info("New user - %s:%s",user.username,user.password);
    });

    for(i=0; i<4; i++) {
        var user = new UserModel({ 
            username: faker.random.first_name().toLowerCase(),
            password: faker.Lorem.words(1)[0],
            firstName: faker.random.first_name(),
            lastName: faker.random.last_name()
        });
        user.save(function(err, user) {
            if(err) return log.error(err);
            else log.info("New user - %s:%s",user.username,user.password);
        });
    }
});

ClientModel.remove({}, function(err) {
    var client = new ClientModel({ name: "OurService iOS client v1", clientId: "mobileV1", clientSecret:"abc123456" });
    client.save(function(err, client) {
        if(err) return log.error(err);
        else log.info("New client - %s:%s",client.clientId,client.clientSecret);
    });
});
AccessTokenModel.remove({}, function (err) {
    if (err) return log.error(err);
});
RefreshTokenModel.remove({}, function (err) {
    if (err) return log.error(err);
});

setTimeout(function() {
    mongoose.disconnect();
}, 3000);