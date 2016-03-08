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
  function FacebookLoginController($scope, $log, ezfb, UsersService, $mdDialog, $document, toastr, $resource, URL_API, $state, $sessionStorage, $localStorage) {

    $log.log("LOG IN WITH FACEBOOK");
    /* We directly use ezfb to have the access token and send it to the API */
    var vm = this;


    vm.login = function () {
      ezfb.login(function (res) {

        if (res.authResponse) {
          $log.log("Loggin ok ", res.authResponse.accessToken);


        }
      }, {scope: 'email, user_birthday'});

    }
  }

})();
