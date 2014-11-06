'use strict';

app.factory('itemsData', function ($http, $q) {
    
    var getItemFormData = function (item) {
        var formData = new FormData();
        formData.append('title', item.title);
        formData.append('description', item.description);
        formData.append('price', item.price);
        formData.append('category', item.category);
        formData.append('image', item.image);

        return formData;
    };
    
    var getItemsCount = function () {
        var deferred = $q.defer();
        
        $http.put('/api/items')
            .success(function (count) {
                deferred.resolve(count);
            })
            .error(function (error) {
                deferred.reject(error);
            });
        
        return deferred.promise;
    };

    var createItem = function (newItem) {
        var deferred = $q.defer();

        var formData = getItemFormData(newItem);
        
        $http.post('/api/items', formData, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }
            )
            .success(function (item) {
                deferred.resolve(item);
            })
            .error(function (error) {
                deferred.reject(error);
            });
        
        return deferred.promise;
    };
    
    var updateItem = function (id, updatedItem) {
        var deferred = $q.defer();
        
        var formData = getItemFormData(updatedItem);
        
        $http.put('/api/items/' + id, formData, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }
            )
            .success(function (item) {
                deferred.resolve(item);
            })
            .error(function (error) {
                deferred.reject(error);
            });
        
        return deferred.promise;
    };

    var getItems = function(filters) {
        var deferred = $q.defer();

        var query = filters.query ? '&title=' + filters.query : '';
        var page = filters.page ? '&page=' + filters.page : '';
        var orderBy = filters.orderBy ? '&orderBy=' + filters.orderBy : '';
        var category = filters.category ? '&category=' + filters.category : '';
        var isFeatured = filters.isFeatured ? '&featured=' + filters.isFeatured : '';
        
        $http.get('/api/items?' + page + query + orderBy + category + isFeatured)
            .success(function (items) {
            deferred.resolve(items);
        })
            .error(function (error) {
            deferred.reject(error);
        });
        
        return deferred.promise;        
    };
    
    var getById = function(id) {
        var deferred = $q.defer();        
        
        $http.get('/api/items/' + id)
            .success(function (items) {
            deferred.resolve(items);
        })
            .error(function (error) {
            deferred.reject(error);
        });
        
        return deferred.promise;        
    };

    var getByUserId = function(id){
        var deferred = $q.defer();

        $http.get('/api/users/' + id + '/items')
            .success(function(items){
                deferred.resolve(items);
            })
            .error(function(error){
                deferred.reject(error);
            });

        return deferred.promise;
    };
    
    return {
        create: createItem,
        update: updateItem,
        getItems: getItems,
        getById: getById,
        getByUserId: getByUserId,
        getCount: getItemsCount
    };
});