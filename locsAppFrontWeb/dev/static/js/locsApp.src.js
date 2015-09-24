/**
 * Created by sylflo on 9/24/15.
 */

(function () {

    'use strict';

    angular.module('locsApp',
        [
            //'locsAppConfig',
            'locsAppRoutes',
            'locsAppUser',
        ]);


    angular.module('locsAppRoutes', ['ngRoute']);
  //  angular.module('locsAppConfig', []);

})();