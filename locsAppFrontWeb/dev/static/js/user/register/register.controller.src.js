/**
 * Created by sylflo on 9/18/15.
 */
(function () {

    'use strict';

    angular.module(NAME_PROJECT + 'UserController')
        .controller('UserRegisterController',  UserRegisterController);

    UserRegisterController.$inject = ['$scope', 'User'];

    function  UserRegisterController($scope, User) {

        $scope.test42 = function() {
          console.log("test42");
        };


        $scope.register = function () {

            console.log("Register controller");

           /* User.register($scope.first_name, $scope.last_name, $scope.username, $scope.birthday, $scope.password,
                $scope.confirm_password, $scope.phone_number, $scope.email, $scope.confirm_email)
                .then(UserSuccessFn, UserErrorFn);

            function UserSuccessFn(data, status, headers, config) {
                console.log("good")
            }

            function UserErrorFn(data, status, headers, config) {
                console.error('Epic failure');
            }
*/

        };
       /* $scope.username*/
    }


})();

