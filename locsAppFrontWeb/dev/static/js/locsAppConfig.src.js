/**
 * Created by sylflo on 9/17/15.
 */
(function () {


    'use strict';


    angular.module(NAME_PROJECT + 'Config')
        .config(config);

    config.$inject = ['$locationProvider'];

    function config($locationProvider) {
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
    }

})();