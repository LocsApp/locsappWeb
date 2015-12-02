(function() {
  'use strict';

  angular
    .module('LocsappControllers')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController($scope, UsersService, toastr, $sessionStorage, $localStorage, $state, $log) {
    var vm = this;

    /*Log in the user*/
    vm.submit = function() {
		UsersService
			.login
			.save({"username" : $scope.username, "password" : $scope.password})
			.$promise
			.then(vm.userLoggedinSuccess, vm.userLoggedinFailure);
    }

    /*Success callback for login*/
	vm.userLoggedinSuccess = function (data) {
		$log.log(data);
		if ($scope.remember_me == true)
			$localStorage.key = data["key"];
		else
			$sessionStorage.key = data["key"];
		$state.go("main.homepage");
	};

	/*Success callback for login*/
	vm.userLoggedinFailure = function (data) {
		$log.log(data.data);
		if (data.data)
		{
			if (data.data.non_field_errors)
			{
				if (data.data.non_field_errors[0].indexOf("not verified") > -1)
					toastr.error("Please verify your email." , 'Woops...');
				else
					toastr.error("We couldn't log you in with these infos..." , 'Woops...');
			}
		}
		else
			toastr.error("The server isn't answering...", "Woops...");
	};

  }
})();
