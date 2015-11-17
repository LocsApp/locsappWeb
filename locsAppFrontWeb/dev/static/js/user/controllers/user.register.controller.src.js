(function () {
    'use strict';

    angular.module(NAME_PROJECT + 'UserControllers')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$scope', 'User', '$state'];

    function RegisterController($scope, User, $state) {

        $scope.register = function () {

            User.register($scope.user_register).then(registerSuccessFn, registerErrorFn);

            function registerSuccessFn(data, status, headers, config) {
                console.debug("Success");
                $state.go("home");
            }

            function registerErrorFn(data, status, headers, config) {
                console.log(data);
                console.error('Failure register error');
            }
        };

    }

})();