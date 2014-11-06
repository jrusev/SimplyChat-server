/* global app */

'use strict';

app.controller('ItemsAdminController', function($scope, ItemsResource, adminData, notifier, identity) {


    $scope.request = {
        page: 1
    };

    function filter(request) {
        ItemsResource.query(request)
            .$promise
            .then(function(items) {
                $scope.items = items;
            });
    }

    filter($scope.request);

    $scope.filter = filter;
});