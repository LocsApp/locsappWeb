/**
 * Created by sylflo on 9/24/15.
 */

(function () {

    'use strict';

    angular.module(NAME_PROJECT,
        [
            NAME_PROJECT + 'Routes',
           // 'locsAppConfig',
            NAME_PROJECT + 'User',
        ])

        .run(run);

    run.$inject = ['$http', '$rootScope'];

    function run($http) {

        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName = 'csrftoken';
    };

   ///  angular.module('locsAppConfig', []);

})();