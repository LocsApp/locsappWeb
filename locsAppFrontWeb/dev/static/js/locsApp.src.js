/**
 * Created by sylflo on 9/24/15.
 */

(function () {

    'use strict';

    angular.module(NAME_PROJECT,
        [
            NAME_PROJECT + 'Routes',
            NAME_PROJECT + 'User',
            'permission'
        ])

        .run(run);

    run.$inject = ['$http', 'Permission', 'User', '$q'];

    function run($http, Permission, User, $q) {

        //Automatize send of Csrf token
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName = 'csrftoken';

        Permission.defineRole("guest", function(stateParams) {
            var deferred = $q.defer();

            User.profile().then(profileSuccess, profileError);

            function profileSuccess(data, status, headers, config) {
                console.log("in");
                if (!data.role)
                    deferred.resolve();
                else
                    deferred.reject();
            }

            function profileError(data, status, headers, config) {
                console.log("out")
                deferred.reject();
            }
            return (deferred.promise);
        });

    };

})();