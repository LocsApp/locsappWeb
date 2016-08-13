(function(){

  'use strict';

   angular
    .module('LocsappControllers')
    .controller('LoginDialogController', LoginDialogController);

  /** @ngInject */
  function LoginDialogController($log, UsersService, $scope, $localStorage, $sessionStorage, $state, toastr,
  ScopesService, message, redirect_url, $mdDialog) {

    var vm = this;
    vm.message = message;
    vm.redirect_url = redirect_url;

     /*Log in the user*/
    vm.submit = function () {
      UsersService
        .login
        .save({"username": $scope.username, "password": $scope.password})
        .$promise
        .then(vm.userLoggedinSuccess, vm.userLoggedinFailure);
    };

    /*Success callback for profile_check*/
    vm.userProfileGetSuccess = function (data) {
      if ($scope.remember_me == true)
        $localStorage.id = data["id"];
      else
        $sessionStorage.id = data["id"];
      $state.go("main.homepage");
      $localStorage.current_user = data;
      $log.log($localStorage);
      ScopesService.set("current_user", data);
      $mdDialog.hide();
    };

    vm.userProfileGetFailure = function () {
      toastr.error("An error occured while retrieving your data...", "Woops...")
    };

    /*Success callback for login*/
    vm.userLoggedinSuccess = function (data) {
      $log.log(data);
      if ($scope.remember_me == true)
        $localStorage.key = data["key"];
      else
        $sessionStorage.key = data["key"];
      UsersService
        .profile_check
        .get({})
        .$promise
        .then(vm.userProfileGetSuccess, vm.userProfileGetFailure);
    };

    /*Success callback for login*/
    vm.userLoggedinFailure = function (data) {
      $log.log(data.data);
      if (data.data) {
        if (data.data.non_field_errors) {
          if (data.data.non_field_errors[0].indexOf("not verified") > -1)
            toastr.error("Please verify your email.", 'Woops...');
          else
            toastr.error("We couldn't log you in with these infos...", 'Woops...');
        }
      }
      else
        toastr.error("The server isn't answering...", "Woops...");
    };

    vm.goToRegister = function() {
       $mdDialog.hide();
        $state.go("main.register");
    }

  }

})();
