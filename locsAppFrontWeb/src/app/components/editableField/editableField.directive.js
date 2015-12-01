(function() {
  'use strict';

  angular
	.module('LocsappDirectives')
	.directive('editableField', editableField);

	/** @ngInject */
	function editableField()
	{
		var directive = {};

		directive.restrict = 'EA';
		directive.templateUrl = 'app/components/editableField/editableField.tmpl.html';
		directive.link =  function(scope) {

			/*When scope.field is changed, calls the validation callback*/
			scope.$watch('field', function(newValue) {
				if (newValue)
					scope.validation();
			});

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