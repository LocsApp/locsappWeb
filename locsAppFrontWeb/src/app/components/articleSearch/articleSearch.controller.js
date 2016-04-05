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

		/*Pagination*/
		vm.currentPage = 1;
	}

})();