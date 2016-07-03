(function() {
'use strict';

	angular.module('LocsappControllers')
		.controller('VerifyEmailController', VerifyEmailController);

	/** @ngInject */
	function VerifyEmailController($state, $stateParams, $log, toastr, $http, URL_API)
	{
		var vm = this;

		vm.VerifyEmailSuccess = function () {
			toastr.success("Your email has been verified!", "Email Successfully verified");
			$state.go("main.homepage");
		};

		vm.VerifyEmailFailure = function (data) {
			$log.log("BEGIN EMAIL DATA ERROR")
			$log.log(data);
			$log.log("END EMAIL DATA ERROR")
			toastr.error("We couldn't verify your email..." , 'Woops...');
		};

		$http
			.get(URL_API + 'api/v1/verify-email/'+ $stateParams.key + '/')
			.then(vm.VerifyEmailFailure, vm.VerifyEmailSuccess);
	}

})();
