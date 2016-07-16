(function () {
    'use strict';

    angular
        .module('LocsappServices')
        .factory('ScopesService', ScopesService);

    /** @ngInject */
    function ScopesService() {

        var shared_vars = {};

        var service = {
            set : set,
            get : get
        };

        return service;

        function set(scope_name, scope) {
            shared_vars[scope_name] = scope;
        }

        function get(scope_name) {
            return (shared_vars[scope_name]);
        }
    }
})();