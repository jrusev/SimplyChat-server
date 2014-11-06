/* global app */

'use strict';

app.controller('SignUpCtrl', function ($scope, $location, auth, notifier) {
    $scope.signup = function (user, singUpForm) {
        if (singUpForm.$valid) {

            if (user.password === user.confirmPassword) {

                auth.signup(user).then(function () {
                    notifier.success('Registration successful!');
                    $location.path('/');
                }, function (reason) {
                    if (reason) {
                        notifier.error('Error creating account: ' + reason);
                    }
                    else {
                        notifier.error("The request is invalid. (Check your connectivity)");
                    }
                });
            }
            else {
                notifier.error('Password and confirm password must be the same!');
            }
        }
        else {
            notifier.error('First name, Last name, Username and password are required fields.');
        }
    };
});