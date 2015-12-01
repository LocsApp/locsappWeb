(function() {
  'use strict';

  angular
    .module('LocsappControllers')
    .controller('RegisterController', RegisterController);

  /** @ngInject */
  function RegisterController($scope, UsersService, toastr, $log) {
    var vm = this;

    vm.submit = function() {
		UsersService
			.register
			.save({"username" : $scope.username, "password1" : $scope.password, "password2" : $scope.password, "email" : $scope.email})
			.$promise
			.then(vm.userRegisteredSuccess, vm.userRegisteredFailure);
    }

	vm.userRegisteredSuccess = function () {
		toastr.success('Congratulations on registrating to Locsapp! Now please check your email to confirm your email address :)', 'One last Step !');
	};

	vm.userRegisteredFailure = function (data) {
		$log.log(data);
		var errorMsg = "This is odd...";
		if (data.data.username[0].indexOf("taken") > -1)
			errorMsg = "The username is already taken...";
		if (data.data.email[0].indexOf("already") > -1)
			errorMsg = "The email is already taken...";
		toastr.error('Seems like something went wrong with your registration :( ' + errorMsg, 'Woops...');
	};

  }
})();
