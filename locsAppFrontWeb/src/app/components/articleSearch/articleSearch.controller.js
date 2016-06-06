(function() {
	'use strict';

	angular
		.module('LocsappControllers')
		.controller('ArticleSearchController', ArticleSearchController);

	/** @ngInject */
	function ArticleSearchController(ArticleService, $log, toastr, URL_API, $state, ScopesService)
	{
		$log.log(URL_API);
		var vm = this;

		/*Filters vars*/
		vm.categories = ScopesService.get("static_collections").base_categories;
		vm.subCategories = ScopesService.get("static_collections").sub_categories;
		vm.genders = ScopesService.get("static_collections").genders;
		vm.sizes = ScopesService.get("static_collections").sizes;
		vm.clothe_colors = ScopesService.get("static_collections").clothe_colors;
		vm.clothe_states = ScopesService.get("static_collections").clothe_states;
		vm.brands = [{_id: "56cb3ef2b2bc57ab2908e6b2", name: "Home made"}];
		vm.payment_methods = ScopesService.get("static_collections").payment_methods;
		vm.filters = {};

		/*Option vars*/
		vm.url_api = URL_API;
		vm.sortingOptions = ["title", "price"];
		vm.sortOption = "";
		vm.searchOnlyInTitle = true;
		vm.filtersTable = ["base_category", "sub_category", "brand", "gender", "size", "color", "article_state", "payment_methods"];
		vm.filtersToggle = {};

		/*Pagination vars*/
		vm.totalItems = 0;
		vm.search = {"_pagination" : {
					"page_number": 1,
					"items_per_page" : 8
					},
					"_order" : []};

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

		vm.manageSortOptions = function(option)
		{
			var existingOption = false;

			for (var x = 0; x < vm.search._order.length; x++)
			{
				if (vm.search._order[x].field_name == option)
				{
					if (vm.search._order[x].order == "DESC")
					{
						var index = vm.search._order.indexOf(vm.search._order[x]);
						if (index > -1)
							vm.search._order.splice(index, 1);
						else
							$log.log("Error while removing an object in the sort order array")
					}
					else if (vm.search._order[x].order == "ASC")
						vm.search._order[x].order = "DESC"
					existingOption = true;
				}
			}
			if (!existingOption)
				vm.search._order.push({"order": "ASC", "field_name" : option})
			ArticleService
				.searchArticles
				.save(vm.search)
				.$promise
				.then(vm.getArticles, vm.failedGetArticles);
			$log.log(vm.search._order);
		}

		/*Search bar*/
		vm.searchTitle = function (keywords) {
			vm.search._pagination.page_number = 1;
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
			if (!vm.filtersToggle[id])
				vm.filtersToggle[id] = false;
			vm.filtersToggle[id] = !vm.filtersToggle[id];
			if (vm.filtersToggle[id])
			{
				if (!vm.search[vm.filtersTable[elem]])
					vm.search[vm.filtersTable[elem]] = [id];
				else
					vm.search[vm.filtersTable[elem]].push(id);
			}
			else if (!vm.filtersToggle[id])
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