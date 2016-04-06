(function() {
	'use strict';

	angular
		.module('LocsappControllers')
		.controller('ArticleSearchController', ArticleSearchController);

	/** @ngInject */
	function ArticleSearchController()
	{
		var vm = this;

		/*Option vars*/
		vm.sortingOptions = ["title", "price"];
		vm.sortOption = "";

		/*Pagination vars*/
		vm.totalItems = 1000;
		vm.search = {"_pagination" : {
					"page_number": 1,
					"items_per_page" : 10
		}};

		/*Pagination functions*/
		vm.onArrowClick = function (number)
		{
			vm.search._pagination.page_number += number;
		}
	}

})();