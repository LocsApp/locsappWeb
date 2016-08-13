(function(){

  'use strict';

   angular
    .module('LocsappControllers')
    .controller('LoginDialogController', LoginDialogController);

  /** @ngInject */
  function LoginDialogController($log, UsersService, $scope, $localStorage, $sessionStorage, $state, toastr,
  ScopesService, message, name_state_to_redirect, params_value_state, params_key_state, $mdDialog) {

    var vm = this;
    vm.message = message;
    vm.name_state_to_redirect = name_state_to_redirect;
    vm.params_value_state = params_value_state;
    vm.params_key_state = params_key_state;

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

      var obj = {};
      obj[vm.params_key_state] = vm.params_value_state;
      $state.go(vm.name_state_to_redirect, obj);

      $localStorage.current_user = data;
      $log.log($localStorage);
      ScopesService.set("current_user", data);

      toastr.success("You are logged into LocsApp", "Success");
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
