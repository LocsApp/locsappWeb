/**
 * Created by sylflo on 2/20/16.
 */

(function () {

  'use strict';

  angular.module('Facebook')
    .controller('FacebookController', FacebookController);

  /** @ngInject */
  function FacebookController($scope, $log, ezfb, UsersService, $mdDialog, $document, toastr, $resource, URL_API) {

    var vm = this;

    updateLoginStatus(updateApiMe);

    vm.login = function () {
      /**
       * Calling FB.login with required permissions specified
       * https://developers.facebook.com/docs/reference/javascript/FB.login/v2.0
       */
      ezfb.login(function (res) {
        /**
         * no manual $scope.$apply, I got that handled
         */
        if (res.authResponse) {
          $log.log("Loggin ok ", res.authResponse.accessToken);
          UsersService
            .facebook
            .save({
              "access_token": res.authResponse.accessToken,
              "code": "1011675122186671"
            })
            .$promise
            .then(vm.userLoggedinSuccess, vm.userLoggedinFailure);
          //updateLoginStatus(updateApiMe);
        }
      }, {scope: 'email,user_likes'});
    };

    vm.userLoggedinSuccess = function (data) {
      vm.token = data.key;
      vm.changeUsernameDialog();
    };

    vm.userLoggedinFailure = function (data) {
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


      /*Failure callback of the ressource callback*/
      vm.ChangeUsernameFailure = function (data) {
        $log.log(data);
        toastr.error(data.data.Error, "Woops...");
        vm.loader = false;
      };

      /*Success callback of the ressource callback*/
      vm.ChangeUsernameSuccess = function (data) {
        $log.log(data);
        toastr.success("You've got a new username", "Woops...");
        vm.loader = false;

      };


      /*Submits the form data from the dialog to the API*/
      vm.submit = function () {
        vm.loader = true;



        $resource(URL_API + 'api/v1/auth/change-username/', {}, {post: {
            method: "POST",
            isArray: false,
            headers: {'Authorization': 'Token ' + vm.token}}
        }).post({"username": vm.username})
          .$promise
          .then(vm.ChangeUsernameSuccess, vm.ChangeUsernameFailure);

        //  UsersService.change_username.post({"username": vm.username, "token": $scope.token})

      };


    };


    vm.logout = function () {
      /**
       * Calling FB.logout
       * https://developers.facebook.com/docs/reference/javascript/FB.logout
       */
      ezfb.logout(function () {
        updateLoginStatus(updateApiMe);
      });
    };


    /**
     * Update loginStatus result
     */
    function updateLoginStatus(more) {
      ezfb.getLoginStatus(function (res) {
        vm.loginStatus = res;

        (more || angular.noop)();
      });
    }

    /**
     * Update api('/me') result
     */
    function updateApiMe() {
      ezfb.api('/me?fields=id,name,birthday', function (res) {
        vm.apiMe = res;
      });
    }
  }

})();
