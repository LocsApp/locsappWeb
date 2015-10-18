(function () {
   	'use strict';

	angular.module(NAME_PROJECT + 'UserControllers')
       	.controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$scope', 'User'];

    function ProfileController($scope, User) {
    	$scope.getUserInfos = function() {
    		User.profile().then(registerSuccessFn, registerErrorFn);

    		function registerSuccessFn(data, status, headers, config) {
                console.debug("Success");
                console.log(data);
            }

            function registerErrorFn(data, status, headers, config) {
                console.log(data);
                console.error('Failure register error');
            }
    	};
    }

})();