/**
 * Created by sylflo on 7/10/15.
 */

(function () {

    'use strict';

    /* Module creation */
    angular.module(NAME_PROJECT + 'Routes', ['ngRoute', 'ui.router', 'permission']);

    /* Instanciation of module  NAME_PROJECT + 'Routes'. Binding the config  ui-router function to the module */
    angular.module(NAME_PROJECT + 'Routes')
        .config(configUirouter);

    /* Instanciation of module  NAME_PROJECT + 'Routes'. Binding the config for html5mode function to the module */
    angular.module(NAME_PROJECT + 'Routes')
        .config(configHTML5mode);

    /* Injection of the needed vars for ui-router */
    configUirouter.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

    /* Configuration of ui-router */
    function configUirouter($stateProvider, $urlRouterProvider, $locationProvider) {

        //Redirects to /home otherwise
        $urlRouterProvider.otherwise( function($injector) {
            var $state = $injector.get("$state");
            $state.go('home');
        });

        $stateProvider
        //parent home view
        .state('home', {
            url: '/home',
            templateUrl: '/prod/static/templates/home-user.html',
            data : {
                permissions: {
                    except : ['guest'],
                    redirectTo: 'home-guest'
                }
            }
        })

        //child guest home view
        .state('home-guest', {
            url: '/home',
            templateUrl: '/prod/static/templates/home-guest.html',
        })

        //user registration view
        .state('registration', {
            url: '/register',
            templateUrl: '/prod/static/templates/register.html',
            controller : 'RegisterController'
        })

        //user sign-in view
        .state('sign-in', {
            url: '/sign-in',
            templateUrl: '/prod/static/templates/sign-in.html',
            controller : 'LoginController'
        })

        //user sign-in view
        .state('logout', {
            url: '/logout',
            templateUrl: '/prod/static/templates/home-user.html',
            controller : 'LogoutController'
        })
    }

    /* Injection of the needed vars for html5mode */
    configHTML5mode.$inject = ['$locationProvider'];

    /* Configuration of html5mode */
    function configHTML5mode($locationProvider) {
        $locationProvider.html5Mode(true);
    }

})();