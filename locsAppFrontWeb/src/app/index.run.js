(function() {
  'use strict';

  angular
	.module('locsapp')
	.run(runBlock);

  /** @ngInject */
  function runBlock($http, Permission, UsersService, $q, $sessionStorage, $localStorage, $log, toastr) {
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

		function profileSuccess() {
			$log.log("in");
			deferred.reject();
		}

		function profileError() {
			if ($localStorage.key)
			{
				toastr.error("The server disconnected you.", "Please login again");
				delete $localStorage.key
			}
			if ($sessionStorage.key)
			{
				toastr.error("The server disconnected you.", "Please login again");
				delete $sessionStorage.key
			}
			$log.log("out");
			deferred.resolve();
		}

		return (deferred.promise);
	});
  }

})();
