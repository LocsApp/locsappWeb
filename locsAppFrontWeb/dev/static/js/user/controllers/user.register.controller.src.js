(function () {
    'use strict';

    angular.module(NAME_PROJECT + 'UserControllers')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$scope', 'User'];

    function RegisterController($scope, User) {

        $scope.register = function () {

            User.register($scope.user_register).then(registerSuccessFn, registerErrorFn);

            function registerSuccessFn(data, status, headers, config) {
                console.debug("Success");
            }

            function registerErrorFn(data, status, headers, config) {
                console.error('Failure register error');
            }
        };

    }

})();