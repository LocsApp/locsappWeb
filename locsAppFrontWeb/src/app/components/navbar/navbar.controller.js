(function() {
  'use strict';

  angular
	.module('LocsappControllers')
	.controller('NavBarController', NavBarController);

  /** @ngInject */
  function NavBarController(NotificationsService) {
	var vm = this;

	/*Notifications of the user*/
	vm.notifications = NotificationsService.getNotifications;
	
	/*Opens the notifications menu*/
	vm.openNotificationsMenu = function($mdOpenMenu, event) {
		$mdOpenMenu(event);
	};
  }
})();
