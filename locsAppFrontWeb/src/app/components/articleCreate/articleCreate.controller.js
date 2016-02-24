(function() {
  'use strict';

  angular
	.module('LocsappControllers')
	.controller('ArticleCreateController', ArticleCreateController);

  /** @ngInject */
  function ArticleCreateController($log) {
	var vm = this;

	vm.value = 0;
	vm.stepTwoComplete = 0;
  }
})();