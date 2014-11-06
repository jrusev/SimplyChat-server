/* global app, angular */

'use strict';

app.controller('ProfileCtrl', function ($scope, $location, identity, itemsData, notifier) {

    $scope.user = identity.currentUser;
    $scope.currentPage = 0;
    $scope.numPerPage = 10;
    $scope.maxSize = 5;
    $scope.user.filteredItems = [];

    itemsData.getByUserId(identity.currentUser._id)
        .then(function (items) {
            $scope.user.items = items;
            $scope.currentPage++;
        }, function (error) {
            notifier.error('Unable to load items from server: ' + error.message || error);
        });

    $scope.numPages = function () {
        return Math.ceil($scope.user.items.length / $scope.numPerPage);
    };

    $scope.$watch('currentPage + numPerPage', function () {
        var begin = ($scope.currentPage - 1) * $scope.numPerPage;
        var end = begin + $scope.numPerPage;
        $scope.user.filteredItems = $scope.user.items.slice(begin, end);
    });
});