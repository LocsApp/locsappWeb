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



        function register(user) {
            console.log(user);
            return $http.post('/', {
                username: user.username,
                email : user.email,
                first_name : user.first_name,
                last_name : user.last_name,
                password1 : user.password1,
                password2 : user.password2,
                living_address : user.living_address,
                billing_address : user.billing_address,
                phone : user.phone,
                logo_url : '/kek/',
                is_active : false
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