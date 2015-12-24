(function() {
  'use strict';

  angular
	.module('LocsappControllers')
	.controller('NavBarController', NavBarController);

  /** @ngInject */
  function NavBarController(NotificationsService, $state, $log) {
	var vm = this;

	/* Init vars */
	vm.loader = false;

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

	/*"Deletes" the notifications*/
	vm.notificationDelete = function(notification) {
		NotificationsService.notificationDelete(notification);
	};

	vm.scrollBottom = function(scrollTop, scrollHeight) {
		if (scrollTop == scrollHeight && !vm.loader)
			$log.log(scrollHeight);
			//vm.loader = true;
	}
  }
})();
