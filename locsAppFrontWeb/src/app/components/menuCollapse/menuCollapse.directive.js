(function() {
  'use strict';

  angular
	.module('LocsappDirectives')
	.directive('menuCollapse', menuCollapse);

	function menuCollapse()
	{
		var directive = {};

		directive.restrict = 'EA';
		directive.transclude =  true;
		directive.templateUrl = 'app/components/menuCollapse/menuCollapse.tmpl.html';

		directive.link =  function(scope) {

			scope.isCollapsed = false;

			scope.changeCollapse = function () {
				scope.isCollapsed = !scope.isCollapsed;
			};
		};

		directive.scope = {
			title: "@title",
			titleClass: "@titleClass",
			bodyClass: "@bodyClass",
			animation: "@bodyAnimation"
		};

		return directive;
	}

})();
