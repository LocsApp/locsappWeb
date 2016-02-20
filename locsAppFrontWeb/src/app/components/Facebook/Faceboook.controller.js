/**
 * Created by sylflo on 2/20/16.
 */

(function () {

  /* With API
  * {'username': 'tutulutu', 'access_token': 'CAACEdEose0cBALACdjsETh89HbFCYZC148bwyFPsZBpcOx6fwUAU7VLi1gpP700XTyBoE6CWOi1sNvUeixWfApbOzf3U9BQaUJdq1QfpqTghRtxJ0ZCAVUWiM1rLpkTtkMLMrMssT1u770h59E42BzI5CfktxV0RoddN8vAM3Kmx24sBVpFNZANETa1Sz1hS6Cc0nIZCzkEa3ap3y7qNl', 'code': '1011661268854723'}
new_user  socialogin  <allauth.socialaccount.models.SocialLogin object at 0x7f3348295320>

  *
  * */

  'use strict';

  angular.module('Facebook')
    .controller('FacebookController', FacebookController);

  /** @ngInject */
  function FacebookController($scope, $log, ezfb, UsersService, $mdDialog) {

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
          .save({"access_token": res.authResponse.accessToken,
            "code": "1011675122186671"/*,
            "username": "tutulutu"*/})
          .$promise
          .then(vm.userLoggedinSuccess, vm.userLoggedinFailure);
          //updateLoginStatus(updateApiMe);
        }
      }, {scope: 'email,user_likes'});
    };

    vm.userLoggedinSuccess = function (data) {
      $log.log("Succes ", data);
    };

     vm.userLoggedinFailure = function (data) {
      $log.log("Failure ", data);
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
