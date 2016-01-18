(function() {
  'use strict';

  angular
	.module('LocsappControllers')
	.controller('NavBarController', NavBarController);

  /** @ngInject */
  function NavBarController(NotificationsService, $state, $log) {
	var vm = this;

	/* Init vars */
	vm.loader = NotificationsService.fetchingNotifications;
	vm.page_notifications = 1;

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

	/*Sets all the notifications to read true*/
	vm.notificationReadAll = function() {
		NotificationsService.notificationReadAll("user");
		for (var i = 0; i < vm.notifications().length; i++)
			vm.notifications()[i].read = true;
	};	

	/*"Deletes" the notifications*/
	vm.notificationDelete = function(notification) {
		NotificationsService.notificationDelete(notification);
	};

	/*Loads more notifications when scroll is at the bottom*/
	vm.lazyLoadNotifications = function(scrollTop, scrollHeight) {
		if (scrollTop == scrollHeight && !vm.loader())
		{
			NotificationsService.appendNewNotifications("user");
			$log.log(scrollHeight);
		}
	}
  }
})();
