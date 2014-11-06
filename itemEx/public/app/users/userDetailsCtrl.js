/* global app, angular */

'use strict';

app.controller('UserDetailsCtrl', function ($scope, $routeParams, usersData, itemsData, notifier) {
    
    $scope.currentUserId = $routeParams.id;
    $scope.currentPage = 0;
    $scope.numPerPage = 10;
    $scope.maxSize = 5;
    $scope.user = {};
    $scope.user.items = [];


    usersData.getById($scope.currentUserId).then(
        function (user) {
            $scope.user = user;

            itemsData.getByUserId($scope.currentUserId).then(
                function (items) {
                    $scope.user.items = items;
                }, 
                function (error) {
                    notifier.error('Unable to load items from server: ' + error.message || error);
                }
            );
        }, 
        function (error) {
        notifier.error('Unable to load user from server: ' + error.message || error);
        }
    );

    $scope.numPages = function () {
        return Math.ceil(($scope.user.items.length || 10) / $scope.numPerPage);
    };

    $scope.$watch('currentPage + numPerPage', function () {
        var begin = ($scope.currentPage - 1) * $scope.numPerPage;
        var end = begin + $scope.numPerPage;
        $scope.user.filteredItems = $scope.user.items.slice(begin, end);
    });
});