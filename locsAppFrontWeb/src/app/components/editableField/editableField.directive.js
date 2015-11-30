(function() {
  'use strict';

  angular
	.module('LocsappDirectives')
	.directive('editableField', editableField);

	function editableField()
	{
		var directive = {};

		directive.restrict = 'E';
		directive.template = '<span ng-if="!field" class="user_profile_parameters_no_info">{{ }} No given info</span><span><ng-md-icon icon="mode_edit" class="user_profile_parameters_edit_mode"></ng-md-icon></span>'
		directive.scope = {
			field : "=field"
		};

		return directive;
	}

})();