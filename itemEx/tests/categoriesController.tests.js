var server = require('../server');
var http = require('./lib/http');

describe('Categories API', function () {
    
    before(function (done) {
        http.createServer(server, done);
    });
    
    it('GET /api/categories should return status code 200', function (done) {
        http.request()
            .get('/api/categories')
            .expect(200, done);
    });

    it('Get /api/categories/:id should return 400 when invalid', function (done) {
        http.request()
            .get('/api/categories/invalid')
            .expect(400, done);
    });
});