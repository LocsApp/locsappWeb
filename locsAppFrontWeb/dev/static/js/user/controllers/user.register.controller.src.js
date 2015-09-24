(function () {
    'use strict';

    angular.module('locsAppUserControllers')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$scope', 'User'];

    function RegisterController($scope, User) {

        User.register($scope.username).then(registerSuccessFn, registerErrorFn);

        function registerSuccessFn(data, status, headers, config) {
            console.debug("Success");
        }

        function registerErrorFn(data, status, headers, config) {
            console.error('Failure register error');
        }
    }

})();