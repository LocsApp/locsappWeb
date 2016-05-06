(function () {
  'use strict';

  angular
    .module('LocsappControllers')
    .controller('NavBarController', NavBarController)
    .controller('LeftCtrl', LeftCtrl)
    .controller('RightCtrl', RightCtrl);

  /** @ngInject */
  function LeftCtrl($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
        });
    };
  }

  /** @ngInject */
  function RightCtrl($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('right').close()
        .then(function () {
          $log.debug("close RIGHT is done");
        });
    };
  }

  /** @ngInject */
  function NavBarController(NotificationsService, $state, $log, $scope, $mdSidenav, $timeout) {
    var vm = this;

    /* DropDownMenu */

    var originatorArticleEv;
    this.openMenuArticle = function ($mdOpenMenu, ev) {
      originatorArticleEv = ev;
      $mdOpenMenu(ev);
    };

    var originatorQuestionsEv;
    this.openMenuQuestions = function ($mdOpenMenu, ev) {
      originatorQuestionsEv = ev;
      $mdOpenMenu(ev);
    };

    var originatorFavoritesEv;
    this.openMenuFavorites = function ($mdOpenMenu, ev) {
      originatorFavoritesEv = ev;
      $mdOpenMenu(ev);
    };

    var originatorAccountEv;
    this.openMenuAccount = function ($mdOpenMenu, ev) {
      originatorAccountEv = ev;
      $mdOpenMenu(ev);
    };

    /* DropDownMenu */


    /* Init vars */
    vm.loader = NotificationsService.fetchingNotifications;
    vm.page_notifications = 1;

    /*Notifications of the user*/
    vm.notifications = NotificationsService.getNotifications;

    /*Opens the notifications menu*/
    vm.openNotificationsMenu = function ($mdOpenMenu, event) {
      $mdOpenMenu(event);
    };

    var originatorEv;
    vm.openMenu = function ($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

    /*Goes to the state parameter*/
    vm.goToState = function (state_name) {
      $state.go(state_name);
    };

    /*Sets the notification to read true*/
    vm.notificationRead = function (notification) {
      NotificationsService.notificationRead(notification);
    };

    /*Sets all the notifications to read true*/
    vm.notificationReadAll = function () {
      NotificationsService.notificationReadAll("user");
    };

    /*"Deletes" the notifications*/
    vm.notificationDelete = function (notification) {
      NotificationsService.notificationDelete(notification);
    };

    /*"Deletes" all the notifications*/
    vm.notificationDeleteAll = function () {
      NotificationsService.notificationDeleteAll("user");
    };

    /*Loads more notifications when scroll is at the bottom*/
    vm.lazyLoadNotifications = function (scrollTop, scrollHeight) {
      if (scrollTop == scrollHeight && !vm.loader()) {
        NotificationsService.appendNewNotifications("user");
        $log.log(scrollHeight);
      }
    };


    /* Test Sidenav */
    $scope.toggleLeft = buildDelayedToggler('left');
    $scope.toggleRight = buildToggler('right');
    $scope.isOpenRight = function () {
      return $mdSidenav('right').isOpen();
    };

    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
      var timer;
      return function debounced() {
        var context = $scope,
          args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function () {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }

    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
      return debounce(function () {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }

    function buildToggler(navID) {
      return function () {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }
    }


    /* End test Sidenav */


  }
})();
