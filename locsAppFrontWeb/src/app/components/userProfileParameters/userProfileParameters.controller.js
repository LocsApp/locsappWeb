/**
 * Created by sylflo on 3/25/16.
 */

(function () {

  'use strict';

  angular
    .module('LocsappControllers')
    .controller('ProfileParamsController', ProfileParamsController);

  /** @ngInject */
  function ProfileParamsController($scope, $log, ScopesService, toastr, UsersService, $mdDialog,
                                   $document) {

    var vm = this;
    vm.limitAdress = 5;
    vm.genderError = false;
    var init_logo_url = "";

    /*vars initilization*/
    vm.user = ScopesService.get("user_infos");
    if (vm.user) {
      vm.current_user_email = vm.user.email;
      vm.user.email_repeat = "";
      vm.user.registered_date = vm.user.registered_date.substring(0, 10);
      init_logo_url = vm.user.logo_url;
      vm.user.last_activity_date = vm.user.last_activity_date.split('T')[0].replace(/-/g, '/');
      //$log.log("user last activity date", vm.user.last_activity_date);
      vm.user.registered_date = vm.user.registered_date.substring(0, 10).replace(/-/g, '/');

    }
    $log.log("vm.user = ", vm.user);

    vm.parseAddressToJson = function () {
      var i = 0;
      var temp = null;

      if (vm.user.living_address != null) {
        for (i = 0; i < vm.user.living_address.length; i++) {
          temp = angular.fromJson(vm.user.living_address[i][1]);
          vm.user.living_address[i][1] = temp;
        }
      }
      if (vm.user.billing_address != null) {
        for (i = 0; i < vm.user.billing_address.length; i++) {
          temp = angular.fromJson(vm.user.billing_address[i][1]);
          vm.user.billing_address[i][1] = temp;
        }
      }
    };


    /*Success callback of profile_check get*/
    vm.GetInfosUserSuccess = function (data) {
      $log.log(data);
      vm.user = data;
      init_logo_url = vm.user.logo_url;
      vm.user.registered_date = vm.user.registered_date.substring(0, 10).replace(/-/g, '/');
      vm.user.last_activity_date = vm.user.last_activity_date.split('T')[0].replace(/-/g, '/');
      vm.current_user_email = vm.user.email;
      vm.user.email_repeat = "";
      vm.parseAddressToJson();

      $log.log(vm.user.living_address);
      $log.log(vm.user.billing_address);



    };

    vm.GetInfosPutUserSuccess = function (data) {
      $log.log("it is workgin", data);
      vm.user = data;
      vm.user.registered_date = vm.user.registered_date.substring(0, 10);
      vm.user.email_repeat = vm.user.email;
      toastr.success("The profile has been successfully modified.", "Success");
      vm.parseAddressToJson();
    };

    /*Failure callback of profile_check*/
    vm.GetInfosUserFailure = function (data) {
      $log.log(data);
      toastr.error("This is odd...", "Woops...");
    };


    vm.uploadImageSuccess = function (data) {
      toastr.success("Success", "Your avatar has been changed");
      $log.log("uploadImageSuccess = ", data);
    };

    vm.uploadImageFailure = function (data) {
      toastr.error(data.error, "Couldn't upload a picture");
      $log.error("uploadImageFailure = ", data);
    };

    /*
     We watch the variable for the profile picture so we upload it directly the user does not
     need to click on a submit button
     */

    $scope.$watch('profileParams.user.logo_url', function (new_fieldcontainer, old_fieldcontainer) {
      if (typeof old_fieldcontainer === 'undefined' || init_logo_url == vm.user.logo_url) return;

      if (new_fieldcontainer != null) {
        UsersService
          .uploadPicture(vm.user.logo_url)
          .then(vm.uploadImageSuccess, vm.uploadImageFailure);
      }
    });


    if (!vm.user)
      UsersService
        .profile_check
        .get()
        .$promise
        .then(vm.GetInfosUserSuccess, vm.GetInfosUserFailure);
    else
      vm.parseAddressToJson();


    vm.submit = function () {

      $log.log("sumbit profile");
      if (vm.user.gender != "Man" && vm.user.gender != "Woman") {
        vm.genderError = true;
      }
      else {
        vm.genderError = false;
        $log.log("everyting is cool");
        UsersService
          .modify_profile
          .update({
            secondary_emails: [],
            first_name: vm.user.first_name,
            last_name: vm.user.last_name,
            gender: vm.user.gender,
            birthdate: vm.user.birthdate,
            phone: vm.user.phone
          })
          .$promise
          .then(vm.GetInfosPutUserSuccess, vm.GetInfosUserFailure);
      }


    };

    vm.ChangeEmailSuccess = function (data) {
      toastr.success("Please check your email", "Success...");
      $log.log("Succes = ", data);
    };

    vm.ChangeEmailFailure = function (data) {
      toastr.error("Error changing your email", "Error...");
      $log.log("err = ", data);
    };


    vm.submitChangeEmail = function () {

      $log.log("email = ", vm.user.email);
      if (vm.current_user_email == vm.user.email) {
        toastr.error("You already using this email address", "Error...");
      }

      UsersService
        .set_primary_email
        .save({
          email: vm.user.email
        })
        .$promise
        .then(vm.ChangeEmailSuccess, vm.ChangeEmailFailure)

    };


    /*Success callback of change_password*/
    vm.ChangePasswordSuccess = function (data) {
      $log.log("Success changin password");
      $log.log(data);
      toastr.success(data.success, "Success");
      /* vm.old_password = "";
       vm.new_password = "";
       vm.confirm_new_password = "";*/
    };

    /*Failure callback of change_password*/
    vm.ChangePasswordFailure = function (data) {
      var error = "This is odd...";
      $log.log(data);
      if (data.data.old_password)
        error = "The old password typed in is invalid.";
      else if (data.data.new_password1)
        error = data.data.new_password1;
      else if (data.data.new_password2)
        error = data.data.new_password2;
      toastr.error(error, "Woops...");
    };

    vm.submitPassword = function () {

      UsersService
        .change_password
        .save({
          "old_password": vm.old_password, "new_password1": vm.new_password,
          "new_password2": vm.confirm_new_password
        })
        .$promise
        .then(vm.ChangePasswordSuccess, vm.ChangePasswordFailure);
    };


    /*Add an address dialog*/
    /** @ngInject */
    vm.addAddressDialog = function (event, type) {
      $mdDialog.show({
        controller: vm.addAddressController,
        controllerAs: 'addAddress',
        templateUrl: 'app/templates/dialogTemplates/addAddress.tmpl.html',
        locals: {
          user: vm.user, type: type, states: $scope.states,
          first_name: vm.user.first_name, last_name: vm.user.last_name
        },
        bindToController: true,
        parent: angular.element($document.body),
        targetEvent: event,
        clickOutsideToClose: true
      }).then(function (data) {
        vm.user = data
      });
    };


    /*Edit an address dialog*/
    /** @ngInject */
    vm.editAddressDialog = function (event, address, type) {
      $mdDialog.show({
        controller: vm.editAddressController,
        controllerAs: 'editAddress',
        templateUrl: 'app/templates/dialogTemplates/editAddress.tmpl.html',
        locals: {user_id: vm.user.id, type: type, address: address},
        bindToController: true,
        parent: angular.element($document.body),
        targetEvent: event,
        clickOutsideToClose: true
      }).then(function (data) {
        vm.user = data
      });
    };

    /*Delete an address dialog*/
    /** @ngInject */
    vm.deleteAddressDialog = function (event, address, type) {
      $mdDialog.show({
        controller: vm.deleteAddressController,
        controllerAs: 'deleteAddress',
        templateUrl: 'app/templates/dialogTemplates/deleteAddress.tmpl.html',
        locals: {user_id: vm.user.id, address: address, type: type},
        bindToController: true,
        parent: angular.element($document.body),
        targetEvent: event,
        clickOutsideToClose: true
      }).then(function (data) {
        if (data == false)
          return;
        else
          vm.user = data
      });
    };

    /*addAddressDialog Controller*/
    /** @ngInject */
    vm.editAddressController = function ($mdDialog) {
      var vm = this;

      /*console.log("vm = ", vm.address);
       /!*initialize vars*!/
       vm.add_to_other = false;
       vm.count = 0;

       /!*Parses the strings address in living_address and billing_address to JSON objects*!/
       vm.parseAddressToJson = function () {
       var i = 0;
       var temp = null;

       if (vm.user.living_address != null) {
       for (i = 0; i < vm.user.living_address.length; i++) {
       temp = angular.fromJson(vm.user.living_address[i][1]);
       vm.user.living_address[i][1] = temp;
       }
       }
       if (vm.user.billing_address != null) {
       for (i = 0; i < vm.user.billing_address.length; i++) {
       temp = angular.fromJson(vm.user.billing_address[i][1]);
       vm.user.billing_address[i][1] = temp;
       }
       }
       };

       /!*Success callback of the ressource callback*!/
       vm.GetAddressUserSuccess = function (data) {
       vm.user = data;
       vm.parseAddressToJson();
       $log.log(vm.user);
       if (vm.add_to_other && vm.count == 1)
       toastr.success("The new addresses have been successfully added.", "Success");
       else if (vm.type == 0 && vm.count == 0)
       toastr.success("The new living address has been successfully added.", "Success");
       else if (vm.type == 1 && vm.count == 0)
       toastr.success("The new billing address has been successfully added.", "Success");
       if (!vm.add_to_other)
       vm.hide();
       else {
       if (vm.count != 0) {
       vm.hide();
       return;
       }
       $log.log("In it " + vm.count);
       vm.count++;
       var dataAddress = [];

       var address = {
       first_name: vm.first_name,
       last_name: vm.last_name,
       address: vm.address,
       postal_code: vm.postal_code,
       city: vm.city
       };
       dataAddress.push(vm.alias);
       dataAddress.push(address);
       var data_send = {};
       data_send = {"user_id": vm.user.id, "billing_address": dataAddress};
       UsersService
       .billing_addresses
       .save(data_send)
       .$promise
       .then(vm.GetAddressUserSuccess, vm.GetAddressUserFailure);
       }
       };

       /!*Failure callback of the ressource callback*!/
       vm.GetAddressUserFailure = function (data) {
       $log.log(data);
       toastr.error(data.data.Error, "Woops...");
       if (vm.count == 1)
       vm.hide();
       };

       /!*Submits the form data from the dialog to the API*!/
       vm.submit = function () {
       var data = [];

       var address = {
       first_name: vm.first_name,
       last_name: vm.last_name,
       address: vm.address,
       postal_code: vm.postal_code,
       city: vm.city
       };
       data.push(vm.alias);
       data.push(address);
       var data_send = {};
       /!* type == 0 living_address || vm.add_to_other == type0 && type1 *!/
       if (vm.type == 0 || vm.add_to_other && vm.count == 0) {
       data_send = {"user_id": vm.user.id, "living_address": data};
       UsersService
       .living_addresses
       .save(data_send)
       .$promise
       .then(vm.GetAddressUserSuccess, vm.GetAddressUserFailure);
       }
       /!* type == 1 billing_address *!/
       else if (vm.type == 1 && vm.count == 0) {
       data_send = {"user_id": vm.user.id, "billing_address": data};
       UsersService
       .billing_addresses
       .save(data_send)
       .$promise
       .then(vm.GetAddressUserSuccess, vm.GetAddressUserFailure);
       }

       };
       */
      /*Hide callback for $mdDialog*/
      vm.hide = function () {

        $mdDialog.hide(vm.user);
      };
    };


    /*addAddressDialog Controller*/
    /** @ngInject */
    vm.addAddressController = function ($mdDialog) {
      var vm = this;

      /*initialize vars*/
      vm.add_to_other = false;
      vm.count = 0;

      /*Parses the strings address in living_address and billing_address to JSON objects*/
      vm.parseAddressToJson = function () {
        var i = 0;
        var temp = null;

        if (vm.user.living_address != null) {
          for (i = 0; i < vm.user.living_address.length; i++) {
            temp = angular.fromJson(vm.user.living_address[i][1]);
            vm.user.living_address[i][1] = temp;
          }
        }
        if (vm.user.billing_address != null) {
          for (i = 0; i < vm.user.billing_address.length; i++) {
            temp = angular.fromJson(vm.user.billing_address[i][1]);
            vm.user.billing_address[i][1] = temp;
          }
        }
      };

      /*Success callback of the ressource callback*/
      vm.GetAddressUserSuccess = function (data) {
        vm.user = data;
        vm.parseAddressToJson();
        $log.log(vm.user);
        if (vm.add_to_other && vm.count == 1)
          toastr.success("The new addresses have been successfully added.", "Success");
        else if (vm.type == 0 && vm.count == 0)
          toastr.success("The new living address has been successfully added.", "Success");
        else if (vm.type == 1 && vm.count == 0)
          toastr.success("The new billing address has been successfully added.", "Success");
        if (!vm.add_to_other)
          vm.hide();
        else {
          if (vm.count != 0) {
            vm.hide();
            return;
          }
          $log.log("In it " + vm.count);
          vm.count++;
          var dataAddress = [];

          var address = {
            first_name: vm.first_name,
            last_name: vm.last_name,
            address: vm.address,
            postal_code: vm.postal_code,
            city: vm.city
          };
          dataAddress.push(vm.alias);
          dataAddress.push(address);
          var data_send = {};
          data_send = {"user_id": vm.user.id, "billing_address": dataAddress};
          UsersService
            .billing_addresses
            .save(data_send)
            .$promise
            .then(vm.GetAddressUserSuccess, vm.GetAddressUserFailure);
        }
      };

      /*Failure callback of the ressource callback*/
      vm.GetAddressUserFailure = function (data) {
        $log.log(data);
        toastr.error(data.data.Error, "Woops...");
        if (vm.count == 1)
          vm.hide();
      };

      /*Submits the form data from the dialog to the API*/
      vm.submit = function () {
        var data = [];

        var address = {
          first_name: vm.first_name,
          last_name: vm.last_name,
          address: vm.address,
          postal_code: vm.postal_code,
          city: vm.city
        };
        data.push(vm.alias);
        data.push(address);
        var data_send = {};
        /* type == 0 living_address || vm.add_to_other == type0 && type1 */
        if (vm.type == 0 || vm.add_to_other && vm.count == 0) {
          data_send = {"user_id": vm.user.id, "living_address": data};
          UsersService
            .living_addresses
            .save(data_send)
            .$promise
            .then(vm.GetAddressUserSuccess, vm.GetAddressUserFailure);
        }
        /* type == 1 billing_address */
        else if (vm.type == 1 && vm.count == 0) {
          data_send = {"user_id": vm.user.id, "billing_address": data};
          UsersService
            .billing_addresses
            .save(data_send)
            .$promise
            .then(vm.GetAddressUserSuccess, vm.GetAddressUserFailure);
        }

      };

      /*Hide callback for $mdDialog*/
      vm.hide = function () {

        $mdDialog.hide(vm.user);
      };
    };

    /*deleteAddressDialog Controller*/
    /** @ngInject */
    vm.deleteAddressController = function ($mdDialog) {
      var vm = this;

      /*init vars*/
      vm.not_accepted = true;

      /*Parses the strings address in living_address and billing_address to JSON objects*/
      vm.parseAddressToJson = function () {
        var i = 0;
        var temp = null;

        if (vm.user.living_address != null) {
          for (i = 0; i < vm.user.living_address.length; i++) {
            temp = angular.fromJson(vm.user.living_address[i][1]);
            vm.user.living_address[i][1] = temp;
          }
        }
        if (vm.user.billing_address != null) {
          for (i = 0; i < vm.user.billing_address.length; i++) {
            temp = angular.fromJson(vm.user.billing_address[i][1]);
            vm.user.billing_address[i][1] = temp;
          }
        }
      };

      /*Success callback of the ressource callback*/
      vm.GetAddressUserSuccess = function (data) {
        $log.log(data);
        vm.user = data;
        vm.parseAddressToJson();
        toastr.success("The address has been successfully deleted.", "Success");
        vm.hide();
      };

      /*Failure callback of the ressource callback*/
      vm.GetAddressUserFailure = function (data) {
        $log.log(data);
        toastr.error("This is odd...", "Woops...");
      };

      /*The user clicked on the Yes button*/
      vm.accepted = function () {
        var data_send = {};

        vm.not_accepted = false;
        /* type == 0 living_address */

        if (vm.type == 0) {
          data_send = {"user_id": vm.user_id, "living_address": vm.address};
          $log.log("Delete adress = ", data_send);
          $log.log("TYpe = ", vm.type);
          UsersService
            .living_addresses_delete
            .save(data_send)
            .$promise
            .then(vm.GetAddressUserSuccess, vm.GetAddressUserFailure);
        }
        /* type == 1 billing_address */
        else if (vm.type == 1) {
          data_send = {"user_id": vm.user_id, "billing_address": vm.address};
          UsersService
            .billing_addresses_delete
            .save(data_send)
            .$promise
            .then(vm.GetAddressUserSuccess, vm.GetAddressUserFailure);
        }
      };

      /*Hide callback for $mdDialog*/
      vm.hide = function () {
        if (vm.not_accepted)
          $mdDialog.hide(false);
        $mdDialog.hide(vm.user);
      };
    };

  }

})();
