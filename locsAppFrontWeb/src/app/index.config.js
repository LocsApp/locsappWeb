(function() {
  'use strict';

angular
	.module('locsapp')
	.factory('TokenAuthInterceptor', TokenAuthInterceptor);
  
  TokenAuthInterceptor.$inject = ['$sessionStorage', '$localStorage', '$q'];

  function TokenAuthInterceptor($sessionStorage, $localStorage, $q) {
	return {
		request: function(config) {
			config.headers = config.headers || {};
			if ($localStorage.key)
				config.headers.Authorization = 'Token ' + $localStorage.key;
			else if ($sessionStorage.key)
				config.headers.Authorization = 'Token ' + $sessionStorage.key;
			return config || $q.when(config);
		},
		response: function(response) {
			return response || $q.when(response);
		}
	};
  }

  angular
	.module('locsapp')
	.config(config);

  /** @ngInject */
  function config($logProvider, toastrConfig, $locationProvider, $httpProvider, $resourceProvider, cfpLoadingBarProvider) {
	// Enable log
	$logProvider.debugEnabled(true);

	// Set options third-party lib
	toastrConfig.allowHtml = true;
	toastrConfig.timeOut = 3000;
	toastrConfig.positionClass = 'toast-top-right';

	//Configuring of html5 routes
	$locationProvider.html5Mode(true);
	$locationProvider.hashPrefix('!');

	//CSRF token sending automation
	$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
	$httpProvider.defaults.xsrfCookieName = 'csrftoken';
	$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

	//Call of TokenAuthInterceptor for Authorization header sending automation
	$httpProvider.interceptors.push('TokenAuthInterceptor');

	//Prevent resource from stripping the / on requests (Django stuff)
	$resourceProvider.defaults.stripTrailingSlashes = false;

	//Sets the angular-loading-bar settings
	cfpLoadingBarProvider.selector = '#loading-bar-container';
	cfpLoadingBarProvider.includeSpinner = false;

  }

})();
