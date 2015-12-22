(function() {
  'use strict';

  angular
	.module('LocsappControllers')
	.controller('NavBarController', NavBarController);

  /** @ngInject */
  function NavBarController(NotificationsService, $state, $log) {
	var vm = this;

	/*Notifications of the user*/
	vm.notifications = NotificationsService.getNotifications;
	
	/*Opens the notifications menu*/
	vm.openNotificationsMenu = function($mdOpenMenu, event) {
		$mdOpenMenu(event);
	};

	/*Goes to the state parameter*/
	vm.goToState = function(state_name) {
		$state.go(state_name);
	};

	/*Sets the notification to read true*/
	vm.notificationRead = function(notification) {
		NotificationsService.notificationRead(notification);
	};
  }
})();
