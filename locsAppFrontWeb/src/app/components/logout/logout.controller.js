(function() {
'use strict';

	angular.module('LocsappControllers')
		.controller('LogoutController', LogoutController);

	/** @ngInject */
	function LogoutController($state, $sessionStorage, $localStorage, $log, toastr, UsersService)
	{
		var vm = this;

		vm.userLoggedoutSuccess = function () {
			var temp_static_collections = $localStorage.static_collections;
			$localStorage.$reset();
			$sessionStorage.$reset();
			$localStorage.temp_static_collections = temp_static_collections;
			toastr.success("You logged out securely.", "Successful Log Out");
			$state.go("main.homepage");
		};

		vm.userLoggedoutFailure = function () {
			toastr.error("We couldn't log you out..." , 'Woops...');
		};

		UsersService
			.logout
			.save()
			.$promise
			.then(vm.userLoggedoutSuccess, vm.userLoggedoutFailure);
	}

})();