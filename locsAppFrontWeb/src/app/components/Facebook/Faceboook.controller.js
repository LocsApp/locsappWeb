/**
 * Created by sylflo on 2/20/16.
 */

// Log after adding the username

(function () {

  'use strict';

  angular
    .module('Facebook')
    .controller('FacebookController', FacebookController);

  /** @ngInject */
  function FacebookController($scope, $log, ezfb, UsersService, $mdDialog, $document, toastr, $resource, URL_API, $state, $sessionStorage, $localStorage) {

    var vm = this;

    //  updateLoginStatus(updateApiMe);

    vm.login = function () {
      /**
       * Calling FB.login with required permissions specified
       * https://developers.facebook.com/docs/reference/javascript/FB.login/v2.0
       */
      vm.callApiFacebook(vm.userFacebookLoggedinSuccess, vm.userFacebookLoggedinFailure);
    };

    vm.userFacebookLoggedinSuccess = function (data) {
      vm.token = data.key;
      $log.log("username = ", vm.username);


      //vm.changeUsernameDialog();
    };

    vm.userFacebookLoggedinFailure = function (data) {
      $log.log("Failure ", data);
    };


    /* Dialog for set an username */
    /** @ngInject */
    vm.changeUsernameDialog = function (event) {
      $mdDialog.show({
        controller: vm.ChangeUsernameController,
        controllerAs: 'addUsername',
        templateUrl: 'app/templates/dialogTemplates/addUsername.tmpl.html',
        locals: {token: vm.token},
        bindToController: true,
        parent: angular.element($document.body),
        clickOutsideToClose: false,
        targetEvent: event
      }).then(function (data) {
        vm.user = data
      });
    };


    /*
     ** Dialogs Controllers
     */
    /*changeUsernameDialog controller*/
    /** @ngInject */
    vm.ChangeUsernameController = function () {
      var vm = this;

      /*initialize vars*/
      vm.loader = false;


      /*Submits the form data from the dialog to the API*/
      vm.submit = function () {
        vm.loader = true;


      };


    };

    /*End ChangeUsernameController */

  }

})();
