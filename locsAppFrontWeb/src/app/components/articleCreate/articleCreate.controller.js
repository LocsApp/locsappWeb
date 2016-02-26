(function() {
  'use strict';

  angular
	.module('LocsappControllers')
	.controller('ArticleCreateController', ArticleCreateController);

  /** @ngInject */
  function ArticleCreateController($log, ArticleService, toastr, $scope, $timeout) {
	var vm = this;

	//steps vars
	vm.value = 0;
	vm.stepsNames = ["squared_one", "squared_two", "squared_three", "squared_four", "squared_five", "squared_six"];
	vm.stepsComplete = [1, 1, 1, 1, 1, 1];
	vm.progressBars = [0, 0, 0, 0, 0, 0]
	vm.stepFocus = 0;

	//article vars
	vm.categories = null;
	vm.subCategories = null;
	vm.genders = null;
	vm.sizes = null;
	vm.clothe_colors = null;
	vm.clothe_states = null;
	vm.payment_methods = null;
	vm.description = null;
	vm.brands = [{_id:"56cb3ef2b2bc57ab2908e6b2" ,name:"Home made"}]

	//user chose
	vm.article = {
		"base_category" : ""
	};

	//Validates and changes to the next step
	vm.nextStep = function(focus)
	{
		vm.stepsComplete[focus] = 1;
		vm.progressBars[focus - 1] = 100;
		$timeout(function() {
			vm.stepFocus = focus;
		}, 100);
	}

	//Static collection retrieval
	vm.failedRetrieval = function(data)
	{
		$log.log(data);
		toastr.error("We couldn't retrieve some informations..." , 'Woops...');
	}

	vm.getClotheStates = function(data)
	{
		vm.clothe_states = data.clothe_states;
	}

	vm.getClotheColors = function(data)
	{
		vm.clothe_colors = data.clothe_colors;
		ArticleService
		.getClotheStates
		.get()
		.$promise
		.then(vm.getClotheStates, vm.failedRetrieval);
	}

	vm.getSizes = function(data)
	{
		vm.sizes = data.sizes;
		ArticleService
		.getClotheColors
		.get()
		.$promise
		.then(vm.getClotheColors, vm.failedRetrieval);
	}

	vm.getGenders = function(data)
	{
		vm.genders = data.genders;
		ArticleService
		.getSizes
		.get()
		.$promise
		.then(vm.getSizes, vm.failedRetrieval);		
	}

	vm.getSubCategories = function(data)
	{
		vm.subCategories = data.sub_categories;
		ArticleService
		.getGenders
		.get()
		.$promise
		.then(vm.getGenders, vm.failedRetrieval);		
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