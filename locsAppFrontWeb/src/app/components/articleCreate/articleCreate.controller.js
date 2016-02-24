(function() {
  'use strict';

  angular
	.module('LocsappControllers')
	.controller('ArticleCreateController', ArticleCreateController);

  /** @ngInject */
  function ArticleCreateController($log) {
	var vm = this;

	vm.value = 0;
	vm.stepsComplete = [100, 0, 0, 0, 0, 0, 0];
	vm.stepsNames = ["squared_one", "squared_two", "squared_three", "squared_four", "squared_five", "squared_six"];
  }
})();