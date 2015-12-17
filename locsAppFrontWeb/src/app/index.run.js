(function() {
  'use strict';

  angular
	.module('locsapp')
	.run(runBlock);

  /** @ngInject */
  function runBlock($http, Permission, UsersService, NotificationsService, $q, $sessionStorage, $localStorage, $log, toastr, $rootScope, $state, URL_API) {
	//Automatize send of Csrf token
	$http.defaults.xsrfHeaderName = 'X-CSRFToken';
	$http.defaults.xsrfCookieName = 'csrftoken';

	//ui-router keep url on child on multiple levels nested views and redirect to the default child
	var rootScopeOnStateChangeStart = $rootScope.$on('$stateChangeStart', function(evt, to, params) {
      if (to.redirectTo) {
        evt.preventDefault();
        $state.go(to.redirectTo, params)
      }
    });

	//Destruction and memory release of the rootScopeOnStateChangeStart
	$rootScope.$on('$destroy', rootScopeOnStateChangeStart);


	//Checks if the user has infos in storage and if so, gets notifications on angular init
	if ($localStorage.key && $localStorage.id)
	{
		if (Object.getOwnPropertyNames(NotificationsService.getListeners()).length == 0)
			NotificationsService.addListener("user", URL_API + "api/v1/notifications/" + $localStorage.id);
	}
	else if ($sessionStorage.key && $sessionStorage.id)
	{
		if (Object.getOwnPropertyNames(NotificationsService.getListeners()).length == 0)
			NotificationsService.addListener("user", URL_API + "api/v1/notifications/" + $sessionStorage.id);
		$log.log("HELLO")
	}

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

		function profileError(data) {
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
			$log.log(data);
			$log.log("out");
			deferred.resolve();
		}

		return (deferred.promise);
	});
  }

})();
