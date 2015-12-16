(function() {
  'use strict';

  angular
	.module('LocsappControllers')
	.controller('NavBarController', NavBarController);

  /** @ngInject */
  function NavBarController() {
	var vm = this;

	/*Opens the notifications menu*/
	vm.openNotificationsMenu = function($mdOpenMenu, event) {
		$mdOpenMenu(event);
	};
  }
})();
