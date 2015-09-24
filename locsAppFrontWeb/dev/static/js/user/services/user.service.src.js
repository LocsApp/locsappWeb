(function () {

    'use strict';

    angular
        .module(NAME_PROJECT + 'UserServices')
        .factory('User', User);
    User.$inject = ['$http'];

    function User($http) {

        var User = {
            register: register,
            login: login,
            getUser: getUser
        };



        function register(username) {
            return $http.post('/', {
                username: username
            });
        }

        function login(username, password) {
            return $http.post('/login', {
                username: username,
                password: password
            })
        }

        function getUser(username) {
            return $http.get('/user' + username);
        }


        return User;


    }


})();