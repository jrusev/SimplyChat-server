/* global app */

'use strict';

app.controller('SendMessageCtrl', 
    function SendMessageCtrl($scope, $routeParams, $location, messagesData, notifier) {
    
    $scope.sendMessage = function (message, sendMessageForm) {

        if (sendMessageForm.$valid) {
            messagesData.sendMessage($routeParams.username, message)
            .then(
            function (success) {
                notifier.success("Message sent successfully!");
                $location.path('/inbox');
            },
            function (error) {
                notifier.error(error.message);
            });
        }
        else {
            notifier.error('Please fill all required fields');
        }
    };
});