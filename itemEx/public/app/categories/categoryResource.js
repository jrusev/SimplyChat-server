'use strict';

app.factory('CategoryResource', ['$resource', '$http', '$q', function ($resource, $http, $q) {
    var CategoryResource = $resource('/api/categories');
    //$resource('/api/categories', {}, {'query': {method: 'GET', isArray: false}}); 
    
    var cachedCategories;
    
    return {
        get: function () {
            if (!cachedCategories) {
                cachedCategories = CategoryResource.query();
            }
            
            return cachedCategories;
        },
        getByName: function (name) {
            var deferred = $q.defer();
            
            $http.get('/api/items?category=' + name)
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (err, status) {
                    deferred.reject(err);
                });
            
            return deferred.promise;
        }
    };
}]);