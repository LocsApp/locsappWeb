/**
 * Created by sylflo on 2/20/16.
 */

// Log after adding the username

(function () {

  'use strict';

  angular
    .module('Facebook')
    .controller('FacebookRegisterController', FacebookRegisterController);

  /** @ngInject */
  function FacebookRegisterController($scope, $log, ezfb, UsersService, $mdDialog, $document, toastr, $resource, URL_API, $state, $sessionStorage, $localStorage) {

    //Ask an username que quand on register sinon on log direct et en back on verifie l'existence de l'utilisateur

    var vm = this;


    $log.log("register");

    vm.register = function () {
      ezfb.login(function (res) {

        if (res.authResponse) {
          $log.log("Loggin ok ", res.authResponse.accessToken);


        }
      }, {scope: 'email,user_likes,user_birthday'});
    };

    /*End ChangeUsernameController */


    /* */

  }

})();
