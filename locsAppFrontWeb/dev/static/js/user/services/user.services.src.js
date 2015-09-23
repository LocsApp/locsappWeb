/**
 * Created by sylflo on 9/18/15.
 */
(function(){

    'use strict';


    angular.module(NAME_PROJECT + 'UserServices')
        .factory('User', User);

    User.$inject = ['$http'];

    function User($http) {
        var User = {
            register:register
        };

        return User;

        function register(first_name, last_name, username, birthday, password, confirm_password, phone_number, email
        , confirm_email) {
            return $http.post('/api/register/', {
                first_name: first_name,
                last_name: last_name,
                username: username,
                birthday: birthday,
                password: password,
                confirm_password: confirm_password,
                phone_number: phone_number,
                email: email,
                confirm_email: confirm_email
            });
        }
    }

})();