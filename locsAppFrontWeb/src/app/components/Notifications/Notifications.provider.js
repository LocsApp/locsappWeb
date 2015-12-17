(function () {
    'use strict';

    angular
        .module('LocsappServices')
        .factory('NotificationsService', NotificationsService);

    /** @ngInject */
    function NotificationsService($resource, $log) {

        var listeners = {};
        var notifications = {"notifications" : []};

        var service = {
            addListener : addListener,
            getListeners : getListeners,
            stimulateListener : stimulateListener,
            getNotifications : getNotifications
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
                    .query({})
                    .$promise
                    .then(function (data) {
                         notifications["notifications"] = data.notifications;
                    },
                    function (data) {
                        $log.log("Error !");
                        $log.log(data);
                    });
            }
        }

        function getNotifications() {
            return (notifications["notifications"]);
        }
    }
})();