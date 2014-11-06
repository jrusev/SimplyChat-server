/* global app */

'use strict';

app.controller('InboxCtrl', function InboxCtrl($scope, messagesData, notifier, identity) {

    $scope.user = identity.currentUser;

    messagesData.getInbox()
        .then(function (messages) {
            $scope.messages = messages;
        }, function(error){
            notifier.error(error.message || error || "Unable to get inbox messages");
        });

    messagesData.getSendByMe()
        .then(function (messages) {
            $scope.messagesByMe = messages;
        }, function(error){
            notifier.error(error.message || error || "Unable to get inbox messages");
        });
});