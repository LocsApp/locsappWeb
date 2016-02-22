/**
 * Created by sylflo on 2/20/16.
 */

// Log after adding the username

(function () {

  'use strict';

  angular.module('Facebook')
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


      $resource(URL_API + 'api/v1/rest-auth/user/', {}, {
        get: {
          method: "GET",
          isArray: false,
          headers: {'Authorization': 'Token ' + vm.token}
        }
      }).get()
        .$promise
        .then(vm.checkUsernameExistSuccess, vm.checkUsernameExistFailure);

      //vm.changeUsernameDialog();
    };

    vm.checkUsernameExistSuccess = function (data) {
      $log.log("TEST SUccess", data);
      if (data.username) {

        vm.callApiFacebook(vm.userLoggedinSuccess, vm.userLoggedinFailure);

      }
      else {
        vm.changeUsernameDialog();
      }

    };

    vm.checkUsernameExistFailure = function (data) {
      $log.log("Test FAILURE");
      //On a forcement un user associe (on a cree des qu on log avec Facebook) donc on lance la dialogue pour change l username
      vm.changeUsernameDialog();

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


      /*Failure callback of the ressource callback*/
      vm.ChangeUsernameFailure = function (data) {
        $log.log(data);
        if (data.data.detail)
          toastr.error(data.data.detail, "Woops...");
        else
          toastr.error(data.data.message, "Woops...");
        vm.loader = false;
      };

      /*Success callback of the ressource callback*/
      vm.ChangeUsernameSuccess = function (data) {
        $log.log(data);
        toastr.success(data.message, "Success");
        vm.loader = false;
        $mdDialog.hide();

         ezfb.login(function (res) {
        /**
         * no manual $scope.$apply, I got that handled
         */
        if (res.authResponse) {
          $log.log("Loggin changeUsername ok ", res.authResponse.accessToken);
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
      }, {scope: 'email,user_likes,user_birthday'});



      };


      /*Submits the form data from the dialog to the API*/
      vm.submit = function () {
        vm.loader = true;


        $resource(URL_API + 'api/v1/auth/change-username/', {}, {
          post: {
            method: "POST",
            isArray: false,
            headers: {'Authorization': 'Token ' + vm.token}
          }
        }).post({"username": vm.username})
          .$promise
          .then(vm.ChangeUsernameSuccess, vm.ChangeUsernameFailure);

        //  UsersService.change_username.post({"username": vm.username, "token": $scope.token})

      };

       /*Success callback for login*/
    vm.userLoggedinSuccess = function (data) {
      $log.log("USERLOGGEINDSUCCESS ", data);
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

    /*Failure callback for login*/
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

    /*Success callback for profile_check*/
    vm.userProfileGetSuccess = function (data) {
      if ($scope.remember_me == true)
        $localStorage.id = data["id"];
      else
        $sessionStorage.id = data["id"];
      $state.go("main.homepage");
    };

    vm.userProfileGetFailure = function () {
      toastr.error("An error occured while retrieving your data...", "Woops...")
    };


    };

/*End ChangeUsernameController */


    /*Success callback for login*/
    vm.userLoggedinSuccess = function (data) {
      $log.log("USERLOGGEINDSUCCESS ", data);
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

    /*Failure callback for login*/
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

    /*Success callback for profile_check*/
    vm.userProfileGetSuccess = function (data) {
      if ($scope.remember_me == true)
        $localStorage.id = data["id"];
      else
        $sessionStorage.id = data["id"];
      $state.go("main.homepage");
    };

    vm.userProfileGetFailure = function () {
      toastr.error("An error occured while retrieving your data...", "Woops...")
    };


    vm.callApiFacebook = function (FnSuccess, FnFailure) {
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
            .then(FnSuccess, FnFailure);
          //updateLoginStatus(updateApiMe);
        }
      }, {scope: 'email,user_likes,user_birthday'});
    }


  }

})();
