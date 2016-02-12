(function() {
  'use strict';

  angular
	.module('LocsappControllers')
	.controller('LoginController', LoginController);


  /** @ngInject */
  function LoginController($scope, UsersService, toastr, $sessionStorage, $localStorage, $state, $log, $mdDialog, $document) {
	var vm = this;

	/*Log in the user*/
	vm.submit = function() {
		UsersService
			.login
			.save({"username" : $scope.username, "password" : $scope.password})
			.$promise
			.then(vm.userLoggedinSuccess, vm.userLoggedinFailure);
	}

	/*Success callback for profile_check*/
	vm.userProfileGetSuccess = function(data) {
		if ($scope.remember_me == true)
			$localStorage.id = data["id"];
		else
			$sessionStorage.id = data["id"];
	$state.go("main.homepage");
	}

	vm.userProfileGetFailure = function() {
		toastr.error("An error occured while retrieving your data...", "Woops...")
	}

	/*Success callback for login*/
	vm.userLoggedinSuccess = function (data) {
		$log.log(data);
		if ($scope.remember_me == true)
			$localStorage.key = data["key"];
		else
			$sessionStorage.key = data["key"];
		UsersService
		.profile_check
		.get({})
		.$promise
		.then(vm.userProfileGetSuccess, vm.userProfileGetFailure);
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

	/*Creates a dialog to ask for a password reset*/
	/** @ngInject */
	vm.forgotPasswordDialog = function (event) {
		$mdDialog.show({
			controller : vm.forgotPasswordController,
			controllerAs : 'forgotPassword',
			templateUrl: 'app/templates/dialogTemplates/forgotPassword.tmpl.html',
			parent: angular.element($document.body),
			targetEvent: event,
			clickOutsideToClose:true
		});
	};

	/*Controller for forgotPasswordDialog*/
	/** @ngInject */
	vm.forgotPasswordController = function ($mdDialog) {
		var vm = this;

		/*vars init*/
		vm.loader = false;

		/*password_reset success callback*/
		vm.resetPasswordSuccess = function (data) {
			toastr.success(data.success, "Success!");
			vm.loader = false;
			vm.hide();
		}

		/*password_reset success callback*/
		vm.resetPasswordFailure = function (data) {
			$log.log(data);
			toastr.error(data.data.email[0], "Woops...");
			vm.loader = false;
			vm.hide();
		}	

		/*Submits the email to the password change endpoint*/
		vm.submit = function () {
			$log.log("innit");
			vm.loader = true;
			UsersService
				.password_reset
				.save({"email" : vm.email})
				.$promise
				.then(vm.resetPasswordSuccess, vm.resetPasswordFailure);
		};

		vm.hide = function () {
			$mdDialog.hide();
		};
	};

  }
})();
