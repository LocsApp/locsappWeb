(function() {
  'use strict';

  angular
	.module('LocsappControllers')
	.controller('ProfileParamsController', ProfileParamsController);

  /** @ngInject */
  function ProfileParamsController($scope, $log, ScopesService, UsersService, toastr, $state, $mdDialog, $document) {
		var vm = this;

		/*vars initilization*/
		vm.user = ScopesService.get("user_infos");
		vm.tabSelected = [false, false, false, false, false, false];
		vm.stateNameToTabDef = ["main.profile_management.default",
		"main.profile_management.emails",
		"main.profile_management.change_password"];
		vm.tabSelected[vm.stateNameToTabDef.map(function(x) {return x;}).indexOf($state.current.name)] = true;

		/*Parses the strings address in living_address and billing_address to JSON objects*/
		vm.parseAddressToJson = function () {
			var i = 0;
			var temp = null;

			if (vm.user.living_address != null)
			{
				for(i=0; i < vm.user.living_address.length; i++)
				{
					temp = angular.fromJson(vm.user.living_address[i][1]);
					vm.user.living_address[i][1] = temp;
				}
			}
			if (vm.user.billing_address != null)
			{
				for(i=0; i < vm.user.billing_address.length; i++)
				{
					temp = angular.fromJson(vm.user.billing_address[i][1]);
					vm.user.billing_address[i][1] = temp;
				}
			}
		};

		/*Success callback of profile_check*/
		vm.GetInfosUserSuccess = function(data) {
			$log.log(data);
			vm.user = data;
			vm.parseAddressToJson();
		};

		/*Failure callback of profile_check*/
		vm.GetInfosUserFailure = function(data) {
			$log.log(data);
			toastr.error("This is odd...", "Woops...");
		};

		//If the user comes doesn't come from the profile page, retrieves the infos
		if(!vm.user)
			UsersService
			.profile_check
			.get({})
			.$promise
			.then(vm.GetInfosUserSuccess, vm.GetInfosUserFailure);
		else
			vm.parseAddressToJson();

		/*Sends the new field to update the user informations*/
		vm.updateFieldUser = function(field, field_name) {
			$log.log(field);
			$log.log("Field name = "+field_name);
		};

		/*Changed state to stateName, here child state of user profile parameters*/
		vm.goToParamPage = function(stateName, tabNumber) {
			for (var i=0; i < vm.tabSelected.length; i++)
				vm.tabSelected[i] = false;
			vm.tabSelected[tabNumber] = true;
			$state.go(stateName);
		};

		/*
		** Dialogs Definitions
		*/
		/*Add a living address dialog*/
		vm.addLivingAddressDialog = function(event) {
			$mdDialog.show({
				controller : vm.addLivingAddressController,
				controllerAs : 'addLivingAddress',
				templateUrl: 'app/templates/dialogTemplates/addLivingAddress.tmpl.html',
				locals : {user : vm.user, parseAddressToJson : vm.parseAddressToJson},
				bindToController: true,
				parent: angular.element($document.body),
				targetEvent: event,
				clickOutsideToClose:true
			}).then(function(data) { vm.user = data });
		};

		/*Add a show address dialog*/
		vm.showAddressDialog = function(event, address) {
			$mdDialog.show({
				controller : vm.showAddressController,
				controllerAs : 'showAddress',
				templateUrl: 'app/templates/dialogTemplates/showAddress.tmpl.html',
				locals : {address : address},
				bindToController: true,
				parent: angular.element($document.body),
				targetEvent: event,
				clickOutsideToClose:true
			});
		};

		/*
		** Dialogs Controllers
		*/
		/*addLivingAddressDialog Controller*/
		vm.addLivingAddressController = function($mdDialog) {
			var vm = this;

			/*Success callback of living_address*/
			vm.GetLivingAddressUserSuccess = function(data) {
				$log.log(data);
				vm.user = data;
				vm.parseAddressToJson();
				toastr.success("The new living address has been successfully added.", "Success");
				vm.hide();
			};

			/*Failure callback of living_address*/
			vm.GetLivingAddressFailure = function(data) {
				$log.log(data);
				toastr.error("This is odd...", "Woops...");
			};

			/*Submits the form data from the dialog to the API*/
			vm.submit = function() {
				var data = [];

				var address = {
					first_name : vm.first_name,
					last_name : vm.last_name,
					address : vm.address,
					postal_code : vm.postal_code,
					city : vm.city
				};
				data.push(vm.alias);
				data.push(address);
				var data_send = {"user_id" : vm.user.id, "living_address" : data};
				UsersService
				.living_addresses
				.save(data_send)
				.$promise
				.then(vm.GetLivingAddressUserSuccess, vm.GetLivingAddressFailure);
			}

			vm.hide = function() {
				$mdDialog.hide(vm.user);
			}
		};

		/*showAddressDialog Controller*/
		vm.showAddressController = function($mdDialog) {
			var vm = this;

			vm.hide = function() {
				$mdDialog.hide();
			}
		}
	}

})();
