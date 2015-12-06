(function() {
  'use strict';

  angular
	.module('LocsappDirectives')
	.directive('editableField', editableField);

	/** @ngInject */
	function editableField($log)
	{
		var directive = {};

		directive.restrict = 'EA';
		directive.templateUrl = 'app/components/editableField/editableField.tmpl.html';
		directive.link =  function(scope) {
			//Prevent calling the watch multiple times
			scope.first = 0;

			/* Watches for the changement in field, to update correctly the field given by the parent */
			scope.changeOfField = function() {
				/*When scope.field is changed, calls the validation callback*/
				scope.$watch('field', function(newValue , oldValue) {
					if (newValue != oldValue || scope.first == 0)
					{
						scope.validation();
						scope.first = 1;
					}
				});
			}

			/*Sets the edition mode*/
			scope.changeEdition = function () {
				scope.edition = !scope.edition;
			};

			/*Sets scope.field back to its backup value*/
			scope.fallbackField = function () {
				scope.field = scope.field_backup;
			};
			
			/*Sets scope.field to its new value as well as scope.field_backup*/
			scope.updateBackupField = function (field) {
				scope.field = field;
				scope.field_backup = scope.field;
				if (scope.first == 0)
					scope.changeOfField();
			};
		}
		directive.scope = {
			field : "=field",
			field_backup : "=field",
			loaded : "=loaded",
			edition: "=edition",
			validation: '&validation'
		};

		return directive;
	}

})();