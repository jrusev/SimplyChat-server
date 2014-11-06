/* global app */

'use strict';

app.controller('UserListCtrl', function($scope, UsersResource, adminData, notifier, identity) {


    $scope.request = {
        page: 1
    };

    function filter(request) {
       UsersResource.query(request).$promise
            .then(function(users) {
                $scope.users = users;
            });
    }

    filter($scope.request);

    $scope.filter = filter;

    $scope.deleteUser = function(id){

        if(id !== identity.currentUser._id) {
            adminData.deleteUser(id)
                .then(function (success) {
                    notifier.success(success.message || success);
                    filter($scope.request);
                }, function (error) {
                    notifier.error(error.message || error);
                }
            );
        }
        else{
            notifier.error('Cannot delete current user');
        }
    };

    $scope.makeAdmin = function(id){
        adminData.makeAdmin(id)
            .then(function(success){
                notifier.success(success.message || success);
                filter($scope.request);
            },function(error){
                notifier.error(error.message || error);
            }
        );
    };

});