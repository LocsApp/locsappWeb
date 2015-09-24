/**
 * Created by sylflo on 7/10/15.
 */

(function () {

    'use strict';

    angular.module('locsAppRoutes')
        .config(config);

    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider

            .when('/register', {
                controller: 'RegisterController',
                // controllerAs: 'vm',
                templateUrl: '/prod/static/templates/register.html'
            })


            .otherwise('/');
    }


})();