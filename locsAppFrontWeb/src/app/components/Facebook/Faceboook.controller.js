/**
 * Created by sylflo on 2/20/16.
 */

(function () {

  'use strict';

  angular.module('Facebook')
    .controller('FacebookController', FacebookController);

  /** @ngInject */
  function FacebookController($scope, $log, ezfb) {

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
          $log.log("Loggin ok ", res.authResponse);
          updateLoginStatus(updateApiMe);
        }
      }, {scope: 'email,user_likes'});
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

    vm.share = function () {
      ezfb.ui(
        {
          method: 'feed',
          name: 'angular-easyfb API demo',
          picture: 'http://plnkr.co/img/plunker.png',
          link: 'http://plnkr.co/edit/qclqht?p=preview',
          description: 'angular-easyfb is an AngularJS module wrapping Facebook SDK.' +
          ' Facebook integration in AngularJS made easy!' +
          ' Please try it and feel free to give feedbacks.'
        }/*,
        function (res) {
          // res: FB.ui response
        }*/
      );
    };

    /**
     * For generating better looking JSON results
     */
    /*var autoToJSON = ['loginStatus', 'apiMe'];
    angular.forEach(autoToJSON, function (varName) {
      $scope.$watch(varName, function (val) {
        vm[varName + 'JSON'] = JSON.stringify(val, null, 2);
      }, true);
    });*/

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
      ezfb.api('/me', function (res) {
        vm.apiMe = res;
      });
    }
  }

})();
