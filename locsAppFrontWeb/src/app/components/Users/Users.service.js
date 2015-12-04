(function () {
    'use strict';

    angular
        .module('LocsappServices')
        .factory('UsersService', UsersService);

    /** @ngInject */
    function UsersService($log, $resource, URL_API, $sessionStorage, $localStorage) {

        var service = {
            register : $resource(URL_API + 'api/v1/rest-auth/registration/'),
            login : $resource(URL_API + 'api/v1/rest-auth/login/'),
            logout : $resource(URL_API + 'api/v1/rest-auth/logout/'),
            profile_check : $resource(URL_API +  'api/v1/rest-auth/user/'),
            living_addresses : $resource(URL_API + 'api/v1/user/:id/living_addresses/', {id : "@user_id"}),
            living_addresses_delete : $resource(URL_API + 'api/v1/user/:id/living_addresses/delete/', {id : "@user_id"}),
            is_authenticated : is_authenticated
        };

        return service;

        function is_authenticated() {
            return ($sessionStorage.key || $localStorage.key) ? true : false;
        }
    }
})();