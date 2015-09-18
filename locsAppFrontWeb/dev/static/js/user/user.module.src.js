/**
 * Created by sylflo on 9/18/15.
 */
(function () {

    'use strict';

    angular.module(NAME_PROJECT + 'User',
        [
            NAME_PROJECT + 'UserController',
            NAME_PROJECT + 'UserServices'
        ]);

    angular.module(NAME_PROJECT + 'UserController', []);
    angular.module(NAME_PROJECT + 'UserServices', []);

})();
