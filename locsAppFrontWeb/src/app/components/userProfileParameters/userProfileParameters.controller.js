(function() {
  'use strict';

  angular
	.module('LocsappControllers')
	.controller('ProfileParamsController', ProfileParamsController);

  /** @ngInject */
  function ProfileParamsController($scope, $log, ScopesService, UsersService, toastr, $state) {
		var vm = this;

		vm.first_name_edition = false;
		/*vars initilization*/
		vm.user = ScopesService.get("user_infos");
		vm.tabSelected = [false, false, false, false, false, false];
		vm.stateNameToTabDef = ["main.profile_management.default",
		"main.profile_management.emails",
		"main.profile_management.change_password"];
		vm.tabSelected[vm.stateNameToTabDef.map(function(x) {return x;}).indexOf($state.current.name)] = true;

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

		/*Changed state to stateName, here child state of user profile parameters*/
		vm.goToParamPage = function(stateName, tabNumber)
		{
			for (var i=0; i < vm.tabSelected.length; i++)
				vm.tabSelected[i] = false;
			vm.tabSelected[tabNumber] = true;
			$state.go(stateName);
		};
	}

})();
