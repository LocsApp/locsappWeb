(function () {
  'use strict';

  angular
    .module('LocsappControllers')
    .controller('PublicProfileController', PublicProfileController);

  /** @ngInject */
  function PublicProfileController($scope, $log, UsersService, ScopesService, $state, toastr) {
    var vm = this;

    /*vars initilization*/
    vm.user = {};

    /*Success callback of profile_check*/
    vm.GetInfosUserSuccess = function (data) {
      $log.log(data);
      vm.user = data;
      vm.user.registered_date = vm.user.registered_date.substring(0, 10);

      //On affichaga de la plus recente a pla plus ancienne ca sera envoye par le backend

    };

    /*Failure callback of profile_check*/
    vm.GetInfosUserFailure = function (data) {
      $log.log(data);
      toastr.error("This is odd...", "Woops...");
    };

    /*Adds a new scope to share, and goes to profile_management*/
    vm.goToParameters = function () {
      ScopesService
        .set("user_infos", vm.user);
      $state.go("main.profile_management")
    };

    /*vm.user initializer*/
    UsersService
      .profile_check
      .get({})
      .$promise
      .then(vm.GetInfosUserSuccess, vm.GetInfosUserFailure);
  }
})();
