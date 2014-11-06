'use strict';
/* global app */

app.controller('CategoriesCtrl',
    function CategoriesCtrl($scope, $rootScope, $routeParams, CategoryResource, itemsData, identity) {
        $scope.title = $routeParams.name;
        $scope.categories = CategoryResource.get();
        $scope.currentPage = 1;
        $scope.numPerPage = 12;
        $scope.maxSize = 5;
        $scope.identity = identity;

        var filters = {
            orderBy: '-published',
            query: $rootScope.searchQuery || '',
            page: $scope.currentPage
        };

        $scope.filters = filters;

        itemsData.getCount()
            .then(function (count) {
                //$scope.itemsCount = parseInt(count);
            });

        $scope.numPages = function () {
            return Math.ceil($scope.itemsCount / $scope.numPerPage);
        };

        $scope.$watch('currentPage', function (newValue) {
            if (newValue !== 0) {
                findItems();
            }
        });

        $scope.findItems = findItems;

        function findItems() {
            $scope.filters.page = $scope.currentPage;
            $scope.filters.category = $routeParams.name;

            console.log(filters);
            itemsData.getItems($scope.filters)
                .then(function (data) {
                    $scope.items = data;
                });
        }
});
