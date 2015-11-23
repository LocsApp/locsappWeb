(function() {
  'use strict';

  angular
    .module('LocsappControllers')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController($scope, UsersService, toastr, $sessionStorage, $localStorage, $state, $log) {
    var vm = this;

    vm.submit = function() {
		UsersService
			.login
			.save({"username" : $scope.username, "password" : $scope.password})
			.$promise
			.then(vm.userLoggedinSuccess, vm.userLoggedinFailure);
    }

	vm.userLoggedinSuccess = function (data) {
		$log.log(data);
		if ($scope.remember_me == true)
			$localStorage.key = data["key"];
		else
			$sessionStorage.key = data["key"];
		$state.go("main.homepage");
	};

	vm.userLoggedinFailure = function (data) {
		$log.log(data.data);
		if (data.data.non_field_errors)
			if (data.data.non_field_errors[0].indexOf("not verified"))
				toastr.error("Please verify your email." , 'Woops...');
			else
				toastr.error("We couldn't log you in with these infos..." , 'Woops...');
	};

  }
})();
