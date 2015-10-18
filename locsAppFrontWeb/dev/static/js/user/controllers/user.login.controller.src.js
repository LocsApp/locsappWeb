(function () {
   	'use strict';

	angular.module(NAME_PROJECT + 'UserControllers')
       	.controller('LoginController', LoginController);

    LoginController.$inject = ['$scope', 'User', '$sessionStorage'];

    function LoginController($scope, User, $sessionStorage) {
    	$scope.login = function() {

    		User.login($scope.user_login_credentials).then(loginSuccessFn, loginErrorFn);

            function loginSuccessFn(data, status, headers, config) {
                console.debug("Success");
                console.log(data);
                $sessionStorage.token = data.data["key"];
                console.log($sessionStorage);
            }

            function loginErrorFn(data, status, headers, config) {
                console.log(data);
                console.error('Failure register error');
            }
    	};
    }

})();