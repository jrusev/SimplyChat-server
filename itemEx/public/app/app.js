/* global angular, toastr */

'use strict';

var app = angular.module('app', ['ngResource', 'ngRoute', 'ui.bootstrap']).value('toastr', toastr);

app.config(function($routeProvider, $locationProvider) {

    var routeUserChecks = {
        adminRole: {
            authenticate: function(auth) {
                return auth.isAuthorizedForRole('admin');
            }
        },
        authenticated: {
            authenticate: function(auth) {
                return auth.isAuthenticated();
            }
        }
    };

    $routeProvider
        .when('/', {
            templateUrl: '/partials/main/home',
            controller: 'MainCtrl'
        })
        .when('/items/create', {
            templateUrl: '/partials/items/item-create',
            controller: 'ItemCreateCtrl',
            resolve: routeUserChecks.authenticated
        })
        .when('/login', {
            templateUrl: '/partials/account/login',
            controller: 'LoginCtrl'
        })
        .when('/items', {
            templateUrl: '/partials/items/items-list',
            controller: 'ItemsListCtrl'
        })
        .when('/items/:id/edit', {
            templateUrl: '/partials/items/item-update',
            controller: 'ItemUpdateCtrl',
            resolve: routeUserChecks.authenticated
        })
        .when('/items/:id', {
            templateUrl: '/partials/items/item-details',
            controller: 'ItemDetailsCtrl'
        })
        .when('/users/:id', {
            templateUrl: '/partials/users/user-details',
            controller: 'UserDetailsCtrl'
        })
        .when('/inbox', {
            templateUrl: '/partials/messages/inbox',
            controller: 'InboxCtrl',
            resolve: routeUserChecks.authenticated
        })
        .when('/send-message/:username', {
            templateUrl: '/partials/messages/send-message-form',
            controller: 'SendMessageCtrl',
            resolve:routeUserChecks.authenticated
        })
        .when('/signup', {
            templateUrl: '/partials/account/signup',
            controller: 'SignUpCtrl'
        })
        .when('/profile', {
            templateUrl: '/partials/account/profile',
            controller: 'ProfileCtrl',
            resolve: routeUserChecks.authenticated
        })
        .when('/settings',{
            templateUrl: '/partials/account/user-settings',
            controller: 'UserSettingsCtrl',
            resolve: routeUserChecks.authenticated
        })
        .when('/admin/users', {
            templateUrl: '/partials/admin/users-list',
            controller: 'UserListCtrl',
            resolve: routeUserChecks.adminRole
        })
        .when('/admin/items', {
            templateUrl: '/partials/admin/items-list',
            controller: 'ItemsAdminController',
            resolve: routeUserChecks.adminRole
        })
        .when('/categories/:name', {
            templateUrl: '/partials/categories/category-details',
            controller: 'CategoriesCtrl'
        });
});

app.run(function($rootScope, $window, notifier) {
    $rootScope.$on('$routeChangeError', function(ev, current, previous, rejection) {
        if (rejection === 'not authorized') {
            notifier.error('You are not authorized!');
            $window.history.back();
        }
    });
});
