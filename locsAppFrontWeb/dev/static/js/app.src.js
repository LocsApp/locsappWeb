/**
 * Created by sylflo on 9/17/15.
 */
(function () {

    'use strict';

    angular.module(NAME_PROJECT, [
        NAME_PROJECT + 'Routes',
        //NAME_PROJECT + 'Config',
        NAME_PROJECT + 'User'
        ])
        .run(run);

    run.$inject = ['$http'];
    function run($http) {
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName = 'csrftoken';
    }

    angular.module(NAME_PROJECT + 'Routes', ['ngRoute']);
    angular.module(NAME_PROJECT + 'Config', []);
    angular.module(NAME_PROJECT + 'User', []);


})();
