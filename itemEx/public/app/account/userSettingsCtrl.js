/* global app, angular */

'use strict';

app.controller('UserSettingsCtrl', function ($scope, $location, auth, usersData, identity, notifier) {

    $scope.user = {
        username: identity.currentUser.username,
        firstName: identity.currentUser.firstName,
        lastName: identity.currentUser.lastName,
        phone: identity.currentUser.phone,
        city: identity.currentUser.city,
        imageUrl: identity.currentUser.imageUrl
    };

    $scope.submit = function (updatedUser) {
        usersData.update(updatedUser).then(function () {
            notifier.success('Updated successfully!');
            auth.logout();
            $location.path('/login');
        }, function (err) {
            notifier.error(err.message);
        });
    };
});