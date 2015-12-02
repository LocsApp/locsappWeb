(function() {
  'use strict';

  angular
	.module('locsapp')
	.controller('MainController', MainController);

  /** @ngInject */
  function MainController(UsersService) {
	var vm = this;

	vm.is_authenticated = UsersService.is_authenticated;
  }
})();
