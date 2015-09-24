/**
 * Created by sylflo on 9/24/15.
 */
(function(){


    'use strict';


    angular.module('locsAppConfig')
        .config(config);

    config.$inject = ['$locationProvider'];

    function config($locationProvider) {
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
    }

})();