/**
 * Created by sylflo on 9/17/15.
 */
(function () {

    'use strict';

    console.log("LocsAppRROUTES");

    angular.module(NAME_PROJECT + 'Routes')
        .config(config);

    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider

            .when('/register', {
                //controller: 'RegistController',
                //controllerAs: 'RegisterCtrl',
                templateUrl: '/prod/static/templates/register.html'
            })

           /* .when('/login', {
                //controller: 'LoginController',
                //controllerAs: 'LoginCtrl',
                templateUrl: '/static/templates/login.html'
            })

            .when('/user-profile', {
                //controller: 'UserProfileController',
                //controllerAs: 'UserProfilCtrl',
                templateUrl: '/static/templates/user-profile.html'
            })*/

            .otherwise('/');
    }


})();