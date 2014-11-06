'use strict';

app.directive('itemsGrid', function ($filter) {
    return {
        restrict: 'A',
        templateUrl: '/partials/directives/items-grid',
        scope: {
            items: '=',
            user: '=',
            num: '='
        },
        replace: true
    }
})