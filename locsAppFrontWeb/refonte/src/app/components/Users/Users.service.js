(function () {
    'use strict';

    angular
        .module('LocsappServices')
        .factory('UsersService', UsersService);

    /** @ngInject */
    function UsersService($log, $resource, URL_API) {

        var service = {
            register : $resource(URL_API + 'api/v1/rest-auth/registration/'),
            login : $resource(URL_API + 'api/v1/rest-auth/login/')
        };

        return service;
    }
})();