'use strict';

var auth = require('./auth'),
    controllers = require('../controllers');

module.exports = function (app) {
    
    // Users
    app.route('/api/users')
        .get(controllers.users.getAllUsers)
        .post(controllers.users.createUser)
        .put(auth.isAuthenticated, controllers.users.updateUser);

    app.get('/api/users/:id/items', controllers.items.getByUserId);

    app.route('/api/users/:id')
        .get(controllers.users.getById)
        .post( auth.isInRole('admin'), controllers.users.updateByAdmin)
        .delete( auth.isInRole('admin'), controllers.users.deleteUser)
        .put( auth.isInRole('admin'), controllers.users.makeAdmin);

    app.post('/login', auth.login);
    app.post('/logout', auth.logout);
    
    // Items
    app.route('/api/items')
        .get(controllers.items.getAllItems)
        .post(auth.isAuthenticated, controllers.items.createItem)
        .put(controllers.items.getItemsCount);
    
    app.route('/api/items/:id')
        .get(controllers.items.getItemById)
        .delete(auth.isAuthenticated, controllers.items.deleteItem)
        .put(auth.isAuthenticated, controllers.items.updateItem);
    
    //Categories
    app.get('/api/categories', controllers.categories.getAllCategories);
    app.get('/api/categories/:id', controllers.categories.getCategoryById);
    app.post('/api/categories', controllers.categories.createCategory);
    
    //Messages
    app.all('/api/messages/*', auth.isAuthenticated)
        .get('/api/messages/inbox', controllers.messages.getInbox)
        .get('/api/messages/sent', controllers.messages.getSent)
        .get('/api/messages/:id', controllers.messages.getMessageById)
        .post('/api/messages/send/:username', controllers.messages.sendMessage);
    
    app.get('/partials/:partialArea/:partialName', function (req, res) {
        res.render('../../public/app/' + req.params.partialArea + '/' + req.params.partialName);
    });

    app.get('/api/*', function (req, res) {
        res.render('index');
        res.status(404);
        res.end();
    });
    
    app.get('*', function (req, res) {
        res.render('index', { currentUser: req.user });
    });
};