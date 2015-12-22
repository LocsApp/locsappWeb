(function () {
    'use strict';

    angular
        .module('LocsappServices')
        .factory('NotificationsService', NotificationsService);

    /** @ngInject */
    function NotificationsService($resource, $log, URL_API) {

        var listeners = {};
        var notifications = {"notifications" : []};

        var service = {
            addListener : addListener,
            getListeners : getListeners,
            stimulateListener : stimulateListener,
            getNotifications : getNotifications,
            notificationRead : notificationRead
        };

        return service;

        function addListener(listener_name, url) {
            listeners[listener_name] = url;
        }

        function getListeners() {
            return (listeners);
        }

        function stimulateListener(name_listener) {
            if (listeners != {})
            {
                $resource(listeners[name_listener])
                    .get({})
                    .$promise
                    .then(function (data) {
                         notifications["notifications"] = data.notifications;
                         notifications["metadatas"] = data.metadatas;
                         $log.log(notifications);
                    },
                    function (data) {
                        $log.log("Error !");
                        $log.log(data);
                    });
            }
        }

        function getNotifications() {
            return (notifications);
        }

        function notificationRead(notification) {
            if (notification.read == true)
                return (false);
             $resource(URL_API +  'api/v1/notifications/'+ notification._id + '/', null, {'update' : {method: 'PUT'}})
                .update({"read" : true})
                .$promise
                .then(function () {
                    stimulateListener("user");
                },
                function (data) {
                    $log.log("Error !");
                    $log.log(data);
                });       
        }
    }
})();