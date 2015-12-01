(function() {
  'use strict';

  angular
	.module('LocsappControllers')
	.controller('ProfileParamsController', ProfileParamsController);

  /** @ngInject */
  function ProfileParamsController($scope, $log, ScopesService, UsersService, toastr) {
		var vm = this;

		vm.first_name_edition = false;
		/*vars initilization*/
		vm.user = ScopesService.get("user_infos");

		/*Success callback of profile_check*/
		vm.GetInfosUserSuccess = function(data) {
			$log.log(data);
			vm.user = data;
		}

		/*Failure callback of profile_check*/
		vm.GetInfosUserFailure = function(data) {
			$log.log(data);
			toastr.error("This is odd...", "Woops...");
		}

		//If the user comes doesn't come from the profile page, retrieves the infos
		if(!vm.user)
			UsersService
			.profile_check
			.get({})
			.$promise
			.then(vm.GetInfosUserSuccess, vm.GetInfosUserFailure);

		/*Sends the new field to update the user informations*/
		vm.updateFieldUser = function(field, field_name) {
			$log.log(field);
			$log.log("Field name = "+field_name);
		};
	}

})();
