(function() {
'use strict';

	angular.module('LocsappControllers')
		.controller('VerifyEmailController', VerifyEmailController);

	/** @ngInject */
	function VerifyEmailController($state, $stateParams, $sessionStorage, $localStorage, $log, toastr, UsersService)
	{
		var vm = this;

		vm.VerifyEmailSuccess = function () {
			toastr.success("Your email has been verified!", "Email Successfully verified");
			$state.go("main.homepage");
		};

		vm.VerifyEmailFailure = function () {
			toastr.error("We couldn't verify your email..." , 'Woops...');
		};

		UsersService
			.verify_email
			.get({key : $stateParams.key})
			.$promise
			.then(vm.VerifyEmailSuccess, vm.VerifyEmailFailure);
	}

})();