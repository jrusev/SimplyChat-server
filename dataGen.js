var log                 = require('./server/log')(module);
var mongoose            = require('./server/mongoose').mongoose;
var UserModel           = require('./server/models').User;
var ClientModel         = require('./server/models').Client;
var MessageModel        = require('./server/models').Message;
var AccessTokenModel    = require('./server/models').AccessToken;
var RefreshTokenModel   = require('./server/models').RefreshToken;


var faker               = require('Faker');

MessageModel.remove({}, function(err) {
    if(err) return log.error(err);
    log.info('Old messages deleted!');
});

UserModel.remove({}, function(err) {
    var user = new UserModel({
        username: "admin",
        password: "admin",
        firstName: "Jivko",
        lastName: "Rusev",
        city: "Sofia",
        //imageUrl: faker.Image.UIFaces.avatar()
    });
    user.save(function(err, user) {
        if(err) return log.error(err);
        else log.info("New user - %s:%s",user.username,user.password);
    });

    for(i=0; i<4; i++) {
        var firstName = faker.random.first_name();
        var lastName = faker.random.last_name();
        var username = firstName.toLowerCase()[0] + lastName.toLowerCase();
        
        var user = new UserModel({ 
            username: username,
//            password: faker.Lorem.words(1)[0],
            password: username,
            firstName: firstName,
            lastName: lastName,
            city: faker.Address.city(),
            imageUrl: faker.Image.UIFaces.avatar()
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