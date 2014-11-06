var server = require('../server');
var http = require('./lib/http');

describe('Items API', function () {
    
    before(function (done) {
        http.createServer(server, done);
    });
    
    it('GET /api/items should return status code 200', function (done) {
        http.request()
            .get('/api/items')
            .expect(200, done);
    });
    
    it('Get /api/items/:id should return 200 when valid', function (done) {
        http.request()
            .get('/api/items/5437035afe502710311ec81d')
            .expect(200, done);
    });

    it('Get /api/items/:id should return 400 when invalid', function (done) {
        http.request()
            .get('/api/items/invalid')
            .expect(400, done);
    });
    
    it('Post /api/items should return 401 when unauthorized', function (done) {
        http.request()
            .post('/api/items')
            .set('Content-Type', 'application/json')
            .write(JSON.stringify({ title: 'test-item', category: 'Category' }))
            .expect(401, done);
    });
});