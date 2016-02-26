(function() {
  'use strict';

  angular
	.module('LocsappControllers')
	.controller('ArticleCreateController', ArticleCreateController);

  /** @ngInject */
  function ArticleCreateController($log, ArticleService, toastr) {
	var vm = this;

	//steps vars
	vm.value = 0;
	vm.stepsNames = ["squared_one", "squared_two", "squared_three", "squared_four", "squared_five", "squared_six"];
	vm.stepsComplete = [1, 0, 0, 0, 0, 0];
	vm.progressBars = [0, 0, 0, 0, 0, 0]
	vm.stepFocus = 1;

	//article vars
	vm.categories = null;
	vm.subCategories = null;

	//user chose
	vm.article = {
		"base_category" : ""
	};

	//Static collection retrieval
	vm.failedRetrieval = function(data)
	{
		$log.log(data);
		toastr.error("We couldn't retrieve some informations..." , 'Woops...');
	}

	vm.getSubCategories = function(data)
	{
		vm.subCategories = data.sub_categories;
	}

	vm.getCategories = function(data)
	{
		vm.categories = data.base_categories;
		ArticleService
		.getSubCategories
		.get()
		.$promise
		.then(vm.getSubCategories, vm.failedRetrieval);
	}

	ArticleService
	.getCategories
	.get()
	.$promise
	.then(vm.getCategories, vm.failedRetrieval);
	//End of Static collection retrieval
  }
})();