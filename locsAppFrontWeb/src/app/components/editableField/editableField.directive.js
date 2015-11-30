(function() {
  'use strict';

  angular
	.module('LocsappDirectives')
	.directive('editableField', editableField);

	function editableField()
	{
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = 'app/components/editableField/editableField.tmpl.html';
		directive.scope = {
			field : "=field"
		};

		return directive;
	}

})();