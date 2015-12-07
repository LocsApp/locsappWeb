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

		/*Parses the strings addresses in living_address and billing_address to JSON objects*/
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

		/*Success callback of profile_check update*/
		vm.GetInfosPutUserSuccess = function(data) {
			vm.user = data;
			vm.parseAddressToJson();
			toastr.success("The field has been correctly updated", "Success");
		};

		/*Success callback of profile_check get*/
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

		/*Success callback of change_password*/
		vm.ChangePasswordSuccess = function(data) {
			$log.log(data);
			toastr.success(data.success, "Success");
		};

		/*Failure callback of change_password*/
		vm.ChangePasswordFailure = function(data) {
			var error = "This is odd...";
			$log.log(data);
			if (data.data.old_password)
				error = "The old password typed in is invalid."
			else if (data.data.new_password1)
				error = data.data.new_password1;
			else if (data.data.new_password2)
				error = data.data.new_password2;
			toastr.error(error, "Woops...");
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
			var data = {};
			data[field_name] = field;
			UsersService
				.profile_check
				.update(data)
				.$promise
				.then(vm.GetInfosPutUserSuccess, vm.GetInfosUserFailure);
		};

		/*Changed state to stateName, here child state of user profile parameters*/
		vm.goToParamPage = function(stateName, tabNumber) {
			for (var i=0; i < vm.tabSelected.length; i++)
				vm.tabSelected[i] = false;
			vm.tabSelected[tabNumber] = true;
			$state.go(stateName);
		};

		/*Sets the primary email of the user to the email given in parameter*/
		vm.setEmailAsPrimary = function(new_email)
		{
			UsersService
			.set_primary_email
			.save({'email' : new_email})
			.$promise
			.then(vm.GetInfosPutUserSuccess, vm.GetInfosUserFailure);
		}

		/*Changed the password of the user*/
		vm.change_password = function()
		{
			UsersService
				.change_password
				.save({old_password : vm.old_password, new_password1 : vm.new_password1, new_password2 : vm.new_password2})
				.$promise
				.then(vm.ChangePasswordSuccess, vm.ChangePasswordFailure);			
		}

		/*
		** Dialogs Definitions
		*/
		/*Add an email dialog*/
		vm.addEmailDialog = function(event) {
			$mdDialog.show({
				controller : vm.addEmailController,
				controllerAs : 'addEmail',
				templateUrl: 'app/templates/dialogTemplates/addEmail.tmpl.html',
				locals : {user : vm.user},
				bindToController: true,
				parent: angular.element($document.body),
				targetEvent: event,
				clickOutsideToClose:true
			}).then(function(data) { vm.user = data });	
		};

		/*Add an address dialog*/
		vm.addAddressDialog = function(event, type) {
			$mdDialog.show({
				controller : vm.addAddressController,
				controllerAs : 'addAddress',
				templateUrl: 'app/templates/dialogTemplates/addAddress.tmpl.html',
				locals : {user : vm.user, type : type, states : $scope.states},
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

		/*Add a delete address dialog*/
		vm.deleteAddressDialog = function(event, address, type) {
			$mdDialog.show({
				controller : vm.deleteAddressController,
				controllerAs : 'deleteAddress',
				templateUrl: 'app/templates/dialogTemplates/deleteAddress.tmpl.html',
				locals : {user_id: vm.user.id, address : address, type: type},
				bindToController: true,
				parent: angular.element($document.body),
				targetEvent: event,
				clickOutsideToClose:true
			}).then(function(data) {  
				if (data==false)
					return;
				else
					vm.user = data });
		};

		/*
		** Dialogs Controllers
		*/
		/*addEmailDialog controller*/
		vm.addEmailController = function($mdDialog) {
			var vm = this;

			/*initialize vars*/
			vm.loader = false;

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

			/*Success callback for profile_check*/
			vm.GetUserInfosSuccess = function(data) {
				vm.user = data;
				vm.parseAddressToJson();
				vm.hide();
			}

			/*Failure callback for profile_check*/
			vm.GetUserInfosFailure = function() {
				toastr.error("This is odd...", "Woops...");
			}

			/*Success callback for add_secondary_email*/
			vm.GetAddSecondaryEmailSuccess = function(data) {
				toastr.success(data.message, "Success");
				UsersService
					.profile_check
					.get({})
					.$promise
					.then(vm.GetUserInfosSuccess, vm.GetUserInfosFailure);			
			}

			/*Failure callback for add_secondary_email*/
			vm.GetAddSecondaryEmailFailure = function(data) {
				toastr.error(data.error, "Woops...");
			}		

			/*Submits the form data from the dialog to the API*/
			vm.submit = function() {
				vm.loader = true;
				UsersService
				.add_secondary_email
				.save({"new_email" : vm.email})
				.$promise
				.then(vm.GetAddSecondaryEmailSuccess, vm.GetAddSecondaryEmailFailure)
			}

			/*Hide callback for $mdDialog*/
			vm.hide = function() {

				$mdDialog.hide(vm.user);
			};						
		}

		/*addAddressDialog Controller*/
		vm.addAddressController = function($mdDialog) {
			var vm = this;

			/*initialize vars*/
			vm.add_to_other = false;
			vm.count = 0;

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

			/*Success callback of the ressource callback*/
			vm.GetAddressUserSuccess = function(data) {
				vm.user = data;
				vm.parseAddressToJson();
				$log.log(vm.user)
				if (vm.add_to_other && vm.count == 1)
					toastr.success("The new addresses have been successfully added.", "Success");
				else if (vm.type == 0 && vm.count == 0)
					toastr.success("The new living address has been successfully added.", "Success");
				else if (vm.type == 1 && vm.count == 0)
					toastr.success("The new billing address has been successfully added.", "Success");
				if (!vm.add_to_other)
					vm.hide();
				else
				{
					if (vm.count != 0)
					{
						vm.hide();
						return ;
					}
					$log.log("In it "+ vm.count);
					vm.count++;
					var dataAddress = [];

					var address = {
						first_name : vm.first_name,
						last_name : vm.last_name,
						address : vm.address,
						postal_code : vm.postal_code,
						city : vm.city
					};
					dataAddress.push(vm.alias);
					dataAddress.push(address);
					var data_send = {};
					data_send = {"user_id" : vm.user.id, "billing_address" : dataAddress};
					UsersService
						.billing_addresses
						.save(data_send)
						.$promise
						.then(vm.GetAddressUserSuccess, vm.GetAddressUserFailure);
				}
			};

			/*Failure callback of the ressource callback*/
			vm.GetAddressUserFailure = function(data) {
				$log.log(data);
				toastr.error(data.data.Error, "Woops...");
				if (vm.count == 1)
					vm.hide();
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
				var data_send = {};
				/* type == 0 living_address || vm.add_to_other == type0 && type1 */
				if (vm.type == 0 || vm.add_to_other && vm.count == 0)
				{
					data_send = {"user_id" : vm.user.id, "living_address" : data};
					UsersService
						.living_addresses
						.save(data_send)
						.$promise
						.then(vm.GetAddressUserSuccess, vm.GetAddressUserFailure);
				}
				/* type == 1 billing_address */
				else if (vm.type == 1 && vm.count == 0)
				{
					data_send = {"user_id" : vm.user.id, "billing_address" : data};
					UsersService
						.billing_addresses
						.save(data_send)
						.$promise
						.then(vm.GetAddressUserSuccess, vm.GetAddressUserFailure);
				}

			};

			/*Hide callback for $mdDialog*/
			vm.hide = function() {

				$mdDialog.hide(vm.user);
			};
		};

		/*showAddressDialog Controller*/
		vm.showAddressController = function($mdDialog) {
			var vm = this;

			vm.hide = function() {
				$mdDialog.hide();
			};
		};

		/*deleteAddressDialog Controller*/
		vm.deleteAddressController = function($mdDialog) {
			var vm = this;

			/*init vars*/
			vm.not_accepted = true;

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

			/*Success callback of the ressource callback*/
			vm.GetAddressUserSuccess = function(data) {
				$log.log(data);
				vm.user = data;
				vm.parseAddressToJson();
				toastr.success("The address has been successfully deleted.", "Success");
				vm.hide();
			};

			/*Failure callback of the ressource callback*/
			vm.GetAddressUserFailure = function(data) {
				$log.log(data);
				toastr.error("This is odd...", "Woops...");
			};

			/*The user clicked on the Yes button*/
			vm.accepted = function() {
				var data_send = {};

				vm.not_accepted = false;
				/* type == 0 living_address */
				if (vm.type == 0)
				{
					data_send = {"user_id" : vm.user_id, "living_address" : vm.address};
					UsersService
					.living_addresses_delete
					.save(data_send)
					.$promise
					.then(vm.GetAddressUserSuccess, vm.GetAddressUserFailure);
				}
				/* type == 1 billing_address */
				else if (vm.type == 1)
				{
					data_send = {"user_id" : vm.user_id, "billing_address" : vm.address};
					UsersService
						.billing_addresses_delete
						.save(data_send)
						.$promise
						.then(vm.GetAddressUserSuccess, vm.GetAddressUserFailure);
				}
			};

			/*Hide callback for $mdDialog*/
			vm.hide = function() {
				if (vm.not_accepted)
					$mdDialog.hide(false);
				$mdDialog.hide(vm.user);
			};
		};
	}

})();
