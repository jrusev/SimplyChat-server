/* global app */

'use strict';

app.factory('adminData', function($http, $q){

    var usersUrl = 'api/users/';

    var deleteUser = function(id){
        var deferred = $q.defer();

        $http.delete(usersUrl + id)
            .success(function(response){
                deferred.resolve(response);
            })
            .error(function(error){
                deferred.reject(error);
            });

        return deferred.promise;
    };

    var makeAdmin = function(id){
        var deferred = $q.defer();

        $http.put(usersUrl + id)
            .success(function(response){
                deferred.resolve(response);
            })
            .error(function(error){
                deferred.reject(error);
            });

        return deferred.promise;
    };

    return {
        deleteUser: deleteUser,
        makeAdmin: makeAdmin
    };
});