(function() {
  'use strict';

  angular
	.module('locsapp')
	.run(runBlock);

  /** @ngInject */
  function runBlock($http, Permission, UsersService, $q, $sessionStorage, $localStorage, $log) {
	//Automatize send of Csrf token
	$http.defaults.xsrfHeaderName = 'X-CSRFToken';
	$http.defaults.xsrfCookieName = 'csrftoken';

	//Defining of guest role for permissions
	Permission.defineRole("guest", function () {
		var deferred = $q.defer();

		UsersService
			.profile_check
			.get({})
			.$promise
			.then(profileSuccess, profileError);

		function profileSuccess(data) {
			$log.log("in");
			deferred.reject();
		}

		function profileError() {
			$log.log("out");
			deferred.resolve();
		}

		return (deferred.promise);
	});
  }

})();
