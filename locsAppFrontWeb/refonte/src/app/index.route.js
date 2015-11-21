(function() {
  'use strict';

  angular
	.module('locsapp')
	.config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('main', {
			abstract : true,
			url: '/',
			templateUrl: 'app/main/main.html',
			controller: 'MainController',
			controllerAs: 'main'
		})
		.state('main.homepage', {
			url: '',
			parent: 'main',
			templateUrl: 'app/templates/home/home.html'
		})
		.state('main.login', {
			url: 'login',
			parent: 'main',
			templateUrl: 'app/templates/login/login.html',
			controller: 'LoginController',
			controllerAs: 'login',
            data: {
                permissions: {
                  only: ['guest'],
                  redirectTo: 'main.homepage'
                }
            }
		})
		.state('main.register', {
			url: 'register',
			parent: 'main',
			templateUrl: 'app/templates/register/register.html',
			controller: 'RegisterController',
			controllerAs: 'register',
            data: {
                permissions: {
                  only: ['guest'],
                  redirectTo: 'main.homepage'
                }
            }
		});

	$urlRouterProvider.otherwise(function($injector) {
		var $state = $injector.get("$state");
		$state.go('main.homepage');
	});
  }

})();
