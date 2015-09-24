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
        ]);


    angular.module(NAME_PROJECT + 'Routes', ['ngRoute']);
  //  angular.module('locsAppConfig', []);

})();