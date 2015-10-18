(function () {
   	'use strict';

	angular.module(NAME_PROJECT + 'UserControllers')
       	.controller('LogoutController', LogoutController);

    LogoutController.$inject = ['$scope', 'User', '$sessionStorage', '$state'];

    function LogoutController($scope, User, $sessionStorage, $state) {
        User.logout().then(logoutSuccessFn, logoutErrorFn);

        function logoutSuccessFn(data, status, headers, config) {
            console.debug("Success");
            console.log(data);
            delete $sessionStorage.token;
            $state.go("home");
        }

        function logoutErrorFn(data, status, headers, config) {
            console.debug("Error");
            console.log(data);
        }

    }

})();