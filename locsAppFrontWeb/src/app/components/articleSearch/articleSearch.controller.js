(function() {
	'use strict';

	angular
		.module('LocsappControllers')
		.controller('ArticleSearchController', ArticleSearchController);

	/** @ngInject */
	function ArticleSearchController(ArticleService, $log, toastr, URL_API, $state)
	{
		$log.log(URL_API);
		var vm = this;

		/*Filters vars*/
		vm.categories = null;
		vm.subCategories = null;
		vm.genders = null;
		vm.sizes = null;
		vm.clothe_colors = null;
		vm.clothe_states = null;
		vm.brands = [{_id: "56cb3ef2b2bc57ab2908e6b2", name: "Home made"}];
		vm.payment_methods = null;
		vm.filters = {};

		/*Option vars*/
		vm.url_api = URL_API;
		vm.sortingOptions = ["title", "price"];
		vm.sortOption = "";
		vm.searchOnlyInTitle = true;
		vm.filtersTable = ["base_category"];
		vm.filtersToggle = [false];

		/*Pagination vars*/
		vm.totalItems = 0;
		vm.search = {"_pagination" : {
					"page_number": 1,
					"items_per_page" : 8
		}};

		/*Articles vars*/
		vm.articles = {};

		/*Pagination functions*/
		vm.onArrowClick = function (number)
		{
			vm.search._pagination.page_number += number;
		}

		/*Articles functions*/
		vm.goToArticlePage = function (id) {
			$log.log($state.go("main.articleShow", {"id" : id}));
		}

		/*Search bar*/
		vm.searchTitle = function (keywords) {
			vm.search.page_number = 1;
			vm.search.title = keywords;
			if (!vm.searchOnlyInTitle)
				vm.search.description = keywords;
			else
			{
				if (vm.search.description)
					delete vm.search.description;
			}
			$log.log(vm.search);
			ArticleService
			.searchArticles
			.save(vm.search)
			.$promise
			.then(vm.getArticles, vm.failedGetArticles);
		}

		/*Filters checkboxes*/
		vm.toggleFilter = function(elem, id)
		{
			vm.filtersToggle[elem] = !vm.filtersToggle[elem];
			if (vm.filtersToggle[elem])
			{
				if (!vm.search[vm.filtersTable[elem]])
					vm.search[vm.filtersTable[elem]] = [id];
				else
					vm.search[vm.filtersTable[elem]].push(id);
			}
			else if (!vm.filtersToggle[elem])
			{
				if (vm.search[vm.filtersTable[elem]].length == 1)
					delete vm.search[vm.filtersTable[elem]];
				else
					vm.search[vm.filtersTable[elem]].splice(vm.search[vm.filtersTable[elem]].indexOf(id));
			}
			$log.log(vm.search);
			ArticleService
			.searchArticles
			.save(vm.search)
			.$promise
			.then(vm.getArticles, vm.failedGetArticles);
		}

		//Static collection retrieval
		vm.failedRetrieval = function (data) {
			$log.log(data);
			toastr.error("We couldn't retrieve some informations...", 'Woops...');
		};


		vm.getPaymentMethods = function (data) {
			vm.payment_methods = data.payment_methods;
		};

		vm.getClotheStates = function (data) {
			vm.clothe_states = data.clothe_states;

			//And now we'll get payment
			ArticleService
			.getPaymentMethods
			.get()
			.$promise
			.then(vm.getPaymentMethods, vm.failedRetrieval);
		};

		vm.getClotheColors = function (data) {
			vm.clothe_colors = data.clothe_colors;
			ArticleService
			.getClotheStates
			.get()
			.$promise
			.then(vm.getClotheStates, vm.failedRetrieval);
		};

		vm.getSizes = function (data) {
			vm.sizes = data.sizes;
			ArticleService
			.getClotheColors
			.get()
			.$promise
			.then(vm.getClotheColors, vm.failedRetrieval);
		};

		vm.getGenders = function (data) {
			vm.genders = data.genders;
			ArticleService
			.getSizes
			.get()
			.$promise
			.then(vm.getSizes, vm.failedRetrieval);
		};

		vm.getSubCategories = function (data) {
		vm.subCategories = data.sub_categories;
		ArticleService
			.getGenders
			.get()
			.$promise
			.then(vm.getGenders, vm.failedRetrieval);
		};

		vm.getCategories = function (data) {
		vm.categories = data.base_categories;
		ArticleService
			.getSubCategories
			.get()
			.$promise
			.then(vm.getSubCategories, vm.failedRetrieval);
		};

		ArticleService
		.getCategories
		.get()
		.$promise
		.then(vm.getCategories, vm.failedRetrieval);
		//End of Static collection retrieval

		vm.failedGetArticles = function(data)
		{
			toastr.error("Failed to retrieve the articles", "Woops...");
			$log.log(data);
		}

		vm.getArticles = function(data)
		{
			$log.log(data);
			vm.articles = data;
			vm.totalItems = data.metadatas.total_items;
		}

		ArticleService
		.searchArticles
		.save(vm.search)
		.$promise
		.then(vm.getArticles, vm.failedGetArticles);
	}

})();