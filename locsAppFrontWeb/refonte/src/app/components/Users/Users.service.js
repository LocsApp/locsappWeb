(function () {
    'use strict';

    angular
        .module('NourritureServices')
        .factory('UsersService', UsersService);

    /** @ngInject */
    function UsersService($log, Upload, URL_API) {

        var service = {
        };

        return service;
    }
})();