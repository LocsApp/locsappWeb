(function () {
    'use strict';

    angular
        .module('LocsappServices')
        .factory('NotificationsService', NotificationsService);

    /** @ngInject */
    function NotificationsService($resource, $log, URL_API) {

        var listeners = {};
        var notifications = {"notifications" : []};
        var number_items = {items : 6, page : 1, loader : false};

        var service = {
            addListener : addListener,
            getListeners : getListeners,
            stimulateListener : stimulateListener,
            appendNewNotifications : appendNewNotifications,
            getNotifications : getNotifications,
            notificationRead : notificationRead,
            notificationReadAll : notificationReadAll,
            notificationDelete : notificationDelete,
            fetchingNotifications : fetchingNotifications
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
                number_items.page = 1;
                $resource(listeners[name_listener])
                    .save({"page" : 1, "number_items" : number_items.items})
                    .$promise
                    .then(function (data) {
                         notifications["notifications"] = data.notifications;
                         notifications["metadatas"] = data.metadatas;
                    },
                    function (data) {
                        $log.log("Error !");
                        $log.log(data);
                    });
            }
        }

        function appendNewNotifications(name_listener) {
            if (listeners != {})
            {
                if ((number_items.page - 1) * number_items > notifications["metadatas"].total)
                    return (false);
                number_items.page += 1;
                number_items.loader = true;
                $resource(listeners[name_listener])
                    .save({"page" : number_items.page, "number_items" : number_items.items})
                    .$promise
                    .then(function (data) {
                         for (var i = 0; i < data.notifications.length; i++)
                            notifications["notifications"].push(data.notifications[i]);
                         notifications["metadatas"] = data.metadatas;
                         number_items.loader = false;
                    },
                    function (data) {
                        $log.log("Error !");
                        $log.log(data);
                        number_items.loader = false;
                    });
                return (true);
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
                    notification.read = true;
                    notifications.metadatas.new -=1;
                },
                function (data) {
                    $log.log("Error !");
                    $log.log(data);
                });       
        }

        function notificationReadAll(name_listener) {
            $resource(listeners[name_listener] + "read-all/")
            .get()
            .$promise
            .then(function() {
                $log.log("Success !");
                for (var i = 0; i < notifications["notifications"].length; i++)
                    notifications["notifications"][i].read = true;
                notifications["metadatas"].new = 0;
            },
            function(data) {
                $log.log("Error !");
                $log.log(data);               
            })
        }

        function notificationDelete(notification) {
            if (notification.visible == false)
                return (false);
             $resource(URL_API +  'api/v1/notifications/'+ notification._id + '/', null, {'update' : {method: 'PUT'}})
                .update({"visible" : false})
                .$promise
                .then(function () {
                    notification.visible = false;
                    if (notification.read == false)
                        notifications.metadatas.new -= 1;
                    notifications.metadatas.total -= 1;
                },
                function (data) {
                    $log.log("Error !");
                    $log.log(data);
                });       
        }

        function fetchingNotifications() {
            return (number_items.loader);
        }
    }
})();