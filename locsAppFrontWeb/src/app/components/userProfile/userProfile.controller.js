(function() {
  'use strict';

  angular
	.module('LocsappControllers')
	.controller('ProfileController', ProfileController);

  /** @ngInject */
  function ProfileController($scope, $log, UsersService, ScopesService, $state) {
	var vm = this;

	/*vars initilization*/
	vm.user = {};

	/*Success callback of profile_check*/
	vm.GetInfosUserSuccess = function(data) {
		$log.log(data);
		vm.user = data;
	}

	vm.goToParameters = function() {
		ScopesService
		.set("user_infos", vm.user);
		$state.go("main.profile_management")
	}

	/*vm.user initializer*/
	UsersService
	.profile_check
	.get({})
	.$promise
	.then(vm.GetInfosUserSuccess, vm.GetInfosUserFailure);
  }
})();
