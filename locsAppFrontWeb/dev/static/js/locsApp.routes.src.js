/**
 * Created by sylflo on 7/10/15.
 */

(function () {

    'use strict';

    /* Module creation */
    angular.module(NAME_PROJECT + 'Routes', ['ngRoute', 'ui.router']);

    /* Instanciation of module  NAME_PROJECT + 'Routes'. Binding the config function to the module*/
    angular.module(NAME_PROJECT + 'Routes')
        .config(config);

    /* Injection of the needed vars for ui-router */
    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    /* Configuration of ui-router */
    function config($stateProvider, $urlRouterProvider) {
        //Redirects to /home otherwise
        $urlRouterProvider.otherwise('/home');

        $stateProvider
        //home partial view
        .state('home', {
            url: '/home',
            templateUrl: '/prod/static/templates/partial-home.html'
        })
    }


})();