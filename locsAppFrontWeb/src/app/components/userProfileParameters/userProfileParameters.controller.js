/**
 * Created by sylflo on 3/25/16.
 */

(function () {

  'use strict';

  angular
    .module('LocsappControllers')
    .controller('ProfileParamsController', ProfileParamsController);

  /** @ngInject */
  function ProfileParamsController($scope, $log, ScopesService, toastr, UsersService) {

    var vm = this;


    /*vars initilization*/
    vm.user = ScopesService.get("user_infos");
    if (vm.user) {
      vm.user.email_repeat = vm.user.email;
      vm.user.registered_date = vm.user.registered_date.substring(0, 10);
    }
    $log.log("vm.user = ", vm.user);


    /*Success callback of profile_check get*/
    vm.GetInfosUserSuccess = function (data) {
      $log.log(data);
      vm.user = data;
      vm.user.registered_date = vm.user.registered_date.substring(0, 10);
      vm.user.email_repeat = vm.user.email;
      vm.parseAddressToJson();

      vm.user.nb_mark_as_renter = 50;
      vm.user.nb_mark_as_seller = 40;
      vm.user.global_notation_renter = [true, true, true, true, false];
      vm.user.global_notation_seller = 5;
      vm.user.notation_renter = [
        {
          "author_id": "dgdsgdshfs8787",
          "author_username": "toto",
          "title_article": "Veste rouge taille 42",
          "id_article": "56cb41c0421aa91298799892",
          "mark": [true, true, true, true, true],
          "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        },

        {
          "author_id": "dgdsgdshfs8787",
          "author_username": "toto",
          "title_article": "Veste rouge taille 42",
          "id_article": "56cb41c0421aa91298799892",
          "mark": [true, true, true, false, false],
          "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        }
      ];
    };

    vm.GetInfosPutUserSuccess = function (data) {
      $log.log(data);
      vm.user = data;
      vm.user.registered_date = vm.user.registered_date.substring(0, 10);
      vm.user.email_repeat = vm.user.email;
      //vm.parseAddressToJson();
    };

    /*Failure callback of profile_check*/
    vm.GetInfosUserFailure = function (data) {
      $log.log(data);
      toastr.error("This is odd...", "Woops...");
    };


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


    if (!vm.user)
      UsersService
        .profile_check
        .get()
        .$promise
        .then(vm.GetInfosUserSuccess, vm.GetInfosUserFailure);
    else
      vm.parseAddressToJson();


    vm.submit = function () {

      $log.log("Submit");

      UsersService
        .modify_profile
        .update({
          secondary_emails: [],
          first_name: vm.user.first_name,
          last_name: vm.user.last_name,
          gender: vm.user.gender,
          birthdate: vm.user.birthdate,
          phone: vm.user.phone,
          living_address: [],
          billing_address: []
        })
        .$promise
        .then(vm.GetInfosPutUserSuccess, vm.GetInfosUserFailure);
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
    }


  }

})();
