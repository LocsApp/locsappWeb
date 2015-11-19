(function() {
  'use strict';

  angular
	.module('locsapp')
	.config(config);

  /** @ngInject */
  function config($logProvider, toastrConfig, $locationProvider, $httpProvider, $resourceProvider) {
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

	//Prevent resource from stripping the / on requests (Django stuff)
	$resourceProvider.defaults.stripTrailingSlashes = false;
  }

})();
