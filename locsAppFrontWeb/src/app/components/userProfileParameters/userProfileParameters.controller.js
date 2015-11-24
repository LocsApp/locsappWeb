(function() {
  'use strict';

  angular
	.module('LocsappControllers')
	.controller('ProfileParamsController', ProfileParamsController);

  /** @ngInject */
  function ProfileParamsController($scope, $log, ScopesService) {
		var vm = this;

		/*vars initilization*/
		vm.user = ScopesService.get("user_infos");

		$log.log(vm.user);
	}

})();
