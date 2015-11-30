(function() {
  'use strict';

  angular
	.module('LocsappDirectives')
	.directive('editableField', editableField);

	/** @ngInject */
	function editableField($parse)
	{
		var directive = {};

		directive.restrict = 'EA';
		directive.templateUrl = 'app/components/editableField/editableField.tmpl.html';
		directive.link =  function(scope) {

			scope.$watch('field', function(newValue) {
				if (newValue)
					scope.validation({field: scope.field});
			});

			scope.changeEdition = function () {
				scope.edition = !scope.edition;
			};

			scope.fallbackField = function () {
				scope.field = scope.field_backup;
			};

			scope.updateBackupField = function (field) {
				scope.field = field;
				scope.field_backup = scope.field;
			};
		}
		directive.scope = {
			field : "=field",
			field_backup : "=field",
			edition: "=edition",
			validation: '&validation'
		};

		return directive;
	}

})();