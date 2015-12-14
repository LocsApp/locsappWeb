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
		.state('main.verify-email', {
			url: 'verify-email/:key',
			parent: 'main',
			controller: 'VerifyEmailController',
			controllerAs: 'verifyEmail'
		})
		.state('main.password-reset', {
			url: 'password-reset/:uid/:token',
			parent: 'main',
			templateUrl: 'app/templates/passwordReset/passwordReset.html',
			controller: 'PasswordResetController',
			controllerAs: 'passwordReset',
			data: {
				permissions: {
					only: ['guest'],
					redirectTo: 'main.homepage'
				}
			}
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
		.state('main.logout', {
			url: 'logout',
			parent: 'main',
			controller: 'LogoutController',
			controllerAs: 'logout',
			data: {
				permissions: {
					except: ['guest'],
					redirectTo: 'main.homepage'
				}
			}
		})
		.state('main.user_profile', {
			url: 'profile',
			parent: 'main',
			controller: 'ProfileController',
			controllerAs: 'profile',
			templateUrl : 'app/templates/userProfile/user_profile.html',
			data: {
				permissions: {
					except: ['guest'],
					redirectTo: 'main.homepage'
				}
			}
		})
		.state('main.profile_management', {
			url: 'profile-parameters',
			parent: 'main',
			controller: 'ProfileParamsController',
			controllerAs: 'profileParams',
			redirectTo: 'main.profile_management.default',
			templateUrl : 'app/templates/userProfileParameters/user_profile_parameters.html',
			data: {
				permissions: {
					except: ['guest'],
					redirectTo: 'main.homepage'
				}
			}
		})
		.state('main.profile_management.default', {
			url: '/informations',
			templateUrl : 'app/templates/userProfileParameters/Menu_Tabs/user_profile_parameters_informations.html',
			data: {
				permissions: {
					except: ['guest'],
					redirectTo: 'main.homepage'
				}
			}
		})
		.state('main.profile_management.emails', {
			url: '/emails',
			templateUrl : 'app/templates/userProfileParameters/Menu_Tabs/user_profile_parameters_emails.html',
			data: {
				permissions: {
					except: ['guest'],
					redirectTo: 'main.homepage'
				}
			}
		})
		.state('main.profile_management.change_password', {
			url: '/change-password',
			parent: 'main.profile_management',
			templateUrl : 'app/templates/userProfileParameters/Menu_Tabs/user_profile_parameters_change_password.html',
			data: {
				permissions: {
					except: ['guest'],
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
