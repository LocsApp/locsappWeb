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


    /* Dialog for set an username */
    /** @ngInject */
    vm.askUsernameDialog = function (event) {
      $mdDialog.show({
        controller: vm.askUsernameController,
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


    vm.register = function () {

      //First we ask for the username we launch a dialog box
      vm.askUsernameDialog();

    };

    vm.askUsernameController = function () {

      var vm = this;
      vm.loader = false;

      /* Result of the call to the API when register the new user */
      vm.FaceBookRegisterSuccessFn = function (data) {
        console.log("SUCEES data " + data);
        toastr.success('Congratulations on registrating to Locsapp!');

      };

      vm.FaceBookRegisterErrorFn = function (data) {
        $log.log("ERROR data " + data.data.message);
        toastr.error('Seems like something went wrong with your registration :( ' + data.data.message, 'Woops...');
      };

      /* Submit the dialog form that ask a username */
      vm.submit = function () {

        /* Login to facebook to get an access token of the facebook user*/
        ezfb.login(function (res) {

          /* If we get an access token we call our API and register a new user */
          if (res.authResponse) {
            $log.log("Loggin ok ", res.authResponse.accessToken);
            //Des qu'on a le token on envoie la requete a l'API avec l'username
            //Penser a faire une fonction en back pour verifier si un user existe ou non envoie d'envoyer la requete complete moins penible pour l user

            UsersService
              .facebook_register
              .save({"facebook_token": res.authResponse.accessToken, "username": vm.username})
              .$promise
              .then(vm.FaceBookRegisterSuccessFn, vm.FaceBookRegisterErrorFn);

          }
        }, {scope: 'email,user_likes,user_birthday'});

      };


    };


  }

})();
