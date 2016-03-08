/**
 * Created by sylflo on 2/20/16.
 */

// Log after adding the username

(function () {

  'use strict';

  angular
    .module('Facebook')
    .controller('FacebookLoginController', FacebookLoginController);

  /** @ngInject */
  function FacebookLoginController($scope, $log, ezfb, UsersService, toastr, $state, $sessionStorage) {

    $log.log("LOG IN WITH FACEBOOK");
    /* We directly use ezfb to have the access token and send it to the API */
    var vm = this;

    vm.userProfileGetSuccess = function (data) {
      $sessionStorage.id = data["id"];
      $state.go("main.homepage");
    };

    vm.userProfileGetFailure = function () {
      toastr.error("An error occured while retrieving your data...", "Woops...")
    };

    vm.FaceBookLoginSuccessFn = function (data) {
      toastr.success('Congratulations on login to Locsapp!');
      $sessionStorage.key = data["key"];
      UsersService
        .profile_check
        .get({})
        .$promise
        .then(vm.userProfileGetSuccess, vm.userProfileGetFailure);
    };

    vm.FaceBookLoginErrorFn = function (data) {
      $log.log("DATA = ", data);
      if (data.status === 401) {
        $state.go('main.register');
        toastr.error('Please register before login');
      }
    };


    vm.login = function () {
      ezfb.login(function (res) {

        if (res.authResponse) {
          $log.log("Loggin ok ", res.authResponse.accessToken);
          UsersService
            .facebook_login
            .save({"facebook_token": res.authResponse.accessToken})
            .$promise
            .then(vm.FaceBookLoginSuccessFn, vm.FaceBookLoginErrorFn);


        }
      }, {scope: 'email, user_birthday'});

    }
  }

})();
