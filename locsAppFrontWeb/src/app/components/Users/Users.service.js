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
            profile_check : $resource(URL_API +  'api/v1/rest-auth/user/', null, {'update' : {method: 'PUT'}}),
            change_password : $resource(URL_API +  'api/v1/rest-auth/password/change/'),
            living_addresses : $resource(URL_API + 'api/v1/user/:id/living_addresses/', {id : "@user_id"}),
            living_addresses_delete : $resource(URL_API + 'api/v1/user/:id/living_addresses/delete/', {id : "@user_id"}),
            billing_addresses : $resource(URL_API + 'api/v1/user/:id/billing_addresses/', {id : "@user_id"}),
            billing_addresses_delete : $resource(URL_API + 'api/v1/user/:id/billing_addresses/delete/', {id : "@user_id"}),
            add_secondary_email : $resource(URL_API +  'api/v1/user/add-email/'),
            set_primary_email : $resource(URL_API +  'api/v1/user/set-primary-email/'),
            delete_email : $resource(URL_API +  'api/v1/user/delete-email/'),
            is_authenticated : is_authenticated
        };

        return service;

        function is_authenticated() {
            return ($sessionStorage.key || $localStorage.key) ? true : false;
        }
    }
})();