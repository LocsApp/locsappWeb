(function() {
'use strict';

	angular.module('LocsappControllers')
		.controller('PasswordResetController', PasswordResetController);

	/** @ngInject */
	function PasswordResetController($state, $stateParams, $log, toastr, UsersService)
	{
		var vm = this;

		/*Success Callback for password_reset_confirm*/
		vm.passwordResetConfirmSuccess = function (data) {
			toastr.success(data.success + " You can now login with your new password", "Success!");
			$state.go("main.login");
		};

		/*Failure Callback for password_reset_confirm*/
		vm.passwordResetConfirmFailure = function (data) {
			if (data.data.new_password1)
				toastr.error(data.data.new_password1, "Woops...");
			else if (data.data.new_password2)
				toastr.error(data.new_password1, "Woops...");
			else if (data.data.uid)
				toastr.error(data.data.uid[0] + ' uid', "Woops...");
			else if (data.data.token)
				toastr.error(data.data.token[0] + ' token', "Woops...");
			else if (data.data.detail)
				toastr.error(data.data.detail, "Woops...");
		};

		/*The user submits the new passwords with the uid and token*/
		vm.submit = function () {
			UsersService
				.password_reset_confirm
				.save({"new_password1" : vm.new_password1, "new_password2" : vm.new_password2, "uid" : $stateParams.uid, "token" : $stateParams.token})
				.$promise
				.then(vm.passwordResetConfirmSuccess, vm.passwordResetConfirmFailure);
		}
	}

})();