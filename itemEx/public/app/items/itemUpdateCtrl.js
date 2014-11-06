'use strict';

app.controller('ItemUpdateCtrl', function ($scope, $routeParams, $location, itemsData, CategoryResource, notifier) {
    
    $scope.currentItemId = $routeParams.id;
    $scope.categories = CategoryResource.get();

    itemsData.getById($scope.currentItemId).then(function (data) {
        $scope.item = data;

        if (data.imageUrl) {
            $scope.currentImg = 'images/' + data.imageUrl;
        } else {
            $scope.currentImg = 'images/default.jpg';
        }
    });
    
    $scope.update = function () {
        
        itemsData.update($scope.currentItemId, $scope.item).then(
            function (success) {
                notifier.success("Offer updated successfully!");
                $location.path('/profile');
            },
            function (error) {
                notifier.error(error.message);
            }
        );
    };
});