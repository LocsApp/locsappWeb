/**
 * Created by sylflo on 9/24/15.
 */

(function () {

    'use strict';

    angular.module(NAME_PROJECT,
        [
            //'locsAppConfig',
            NAME_PROJECT + 'Routes',
            NAME_PROJECT + 'User',
        ])

        .run(run);

    run.$inject = ['$http', '$rootScope'];

    function run($http) {

        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName = 'csrftoken';
        
    };


    angular.module(NAME_PROJECT + 'Routes', ['ngRoute']);
    //  angular.module('locsAppConfig', []);

})();