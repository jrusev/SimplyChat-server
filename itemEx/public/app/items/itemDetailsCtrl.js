/* global app */

'use strict';

app.controller('ItemDetailsCtrl', function ($scope, $routeParams, $location, itemsData) {
    $scope.currentItemId = $routeParams.id;
    
    itemsData.getById($scope.currentItemId)
        .then(function (data) {
        $scope.item = data;
    });
    
    $scope.goToSendMessagePage = function () {
        $location.path('/send-message/' + $scope.item.owner.username);
    }
});