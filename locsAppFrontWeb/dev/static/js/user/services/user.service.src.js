(function () {

    'use strict';

    angular
        .module(NAME_PROJECT + 'UserServices')
        .factory('User', User);
    User.$inject = ['$http'];

    function User($http) {

        var User = {
            register: register
        };


        function register(username) {
            return $http.get('/', {
                username: username
            });
        }

        return User;


    }


})();