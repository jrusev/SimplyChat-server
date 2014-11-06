/* global app */

'use strict';

app.factory('ItemsResource', function($resource) {
    var ItemsResource = $resource('/api/items');


    return ItemsResource;
});