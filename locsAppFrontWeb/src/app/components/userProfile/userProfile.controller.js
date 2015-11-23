(function() {
  'use strict';

  angular
	.module('LocsappControllers')
	.controller('ProfileController', ProfileController);

  /** @ngInject */
  function ProfileController($scope, $log, UsersService) {
	var vm = this;

	/*vars initilization*/
	vm.user = {};

	/*Success callback of profile_check*/
	vm.GetInfosUserSuccess = function(data) {
		$log.log(data);
		vm.user = data;
	}

	/*vm.user initializer*/
	UsersService
	.profile_check
	.get({})
	.$promise
	.then(vm.GetInfosUserSuccess, vm.GetInfosUserFailure);
  }
})();
