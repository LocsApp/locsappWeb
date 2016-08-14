(function () {
  'use strict';

  angular
    .module('LocsappServices')
    .factory('ScopesService', ScopesService);

  /** @ngInject */
  function ScopesService() {

    var shared_vars = {};

    var service = {
      set: set,
      get: get,
      remove: remove
    };

    return service;

    function remove(scope_name) {
      delete shared_vars[scope_name];
    }

    function set(scope_name, scope) {
      shared_vars[scope_name] = scope;
    }

    function get(scope_name) {
      return (shared_vars[scope_name]);
    }
  }
})();
