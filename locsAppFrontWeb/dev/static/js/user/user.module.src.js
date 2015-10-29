/**
 * Created by sylflo on 9/24/15.
 */

(function () {

    'use strict';

    angular.module(NAME_PROJECT + 'User', [
        NAME_PROJECT + 'UserControllers',
        NAME_PROJECT + 'UserServices'
    ]);

    angular.module(NAME_PROJECT + 'UserControllers', ['ngStorage']);
    angular.module(NAME_PROJECT + 'UserServices', ['ngCookies']);

})();