(function () {
  'use strict';

  angular
    .module('LocsappControllers')
    .controller('NavBarController', NavBarController);

  /** @ngInject */
  function NavBarController(NotificationsService, $state, $log, $scope, $mdSidenav,
                            $rootScope, $timeout, $location, MenuService) {

    var vm = this;

     //functions for menu-link and menu-toggle
        vm.isOpen = isOpen;
        vm.toggleOpen = toggleOpen;
        vm.autoFocusContent = false;
        vm.menu = MenuService;

        vm.status = {
          isFirstOpen: true,
          isFirstDisabled: false
        };


        function isOpen(section) {
          return MenuService.isSectionSelected(section);
        }

        function toggleOpen(section) {
          MenuService.toggleSelectSection(section);
        }

    /* Side Nav Menu */

    vm.toggleLeft = buildToggler('left');
    vm.toggleRight = buildToggler('right');

    function buildToggler(componentId) {
      return function () {
        $log.log("buildToggler + ", componentId);

        $mdSidenav(componentId).toggle();
      }
    }

    /*  vm.icon = 'menu';

     vm.close = function () {
     $mdSidenav('right').close()
     .then(function () {
     $log.debug("close RIGHT is done");
     });
     };*/

    /* End side nav menu

     /* DropDownMenu */

    vm.openMenuArticle = function ($mdOpenMenu, ev) {
      $mdOpenMenu(ev);
    };

    vm.openMenuQuestions = function ($mdOpenMenu, ev) {
      $mdOpenMenu(ev);
    };

    vm.openMenuFavorites = function ($mdOpenMenu, ev) {
      $mdOpenMenu(ev);
    };

    vm.openMenuAccount = function ($mdOpenMenu, ev) {
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
    /*vm.toggleRight = buildToggler('right');
     vm.isOpenRight = function () {
     return $mdSidenav('right').isOpen();
     };*/


    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */

    /*function buildToggler(navID) {
     return function () {
     $mdSidenav(navID)
     .toggle()
     .then(function () {
     $log.debug("toggle " + navID + " is done");
     });
     }
     }*/


    /* End test Sidenav */


  }
})();
