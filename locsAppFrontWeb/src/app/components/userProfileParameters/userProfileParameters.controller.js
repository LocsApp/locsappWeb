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
          first_name: "first name42",
          last_name: "Last nane",
          gender: "male",
          birthdate: "2015/05/02",
          phone: "0553076911",
          living_address: [],
          billing_address: []
        })
        .$promise
        .then(vm.GetInfosPutUserSuccess, vm.GetInfosUserFailure);
    };


  }

})();
