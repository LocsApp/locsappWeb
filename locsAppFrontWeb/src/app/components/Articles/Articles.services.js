(function(){

  'use strict';

  angular
    .module('LocsappServices')
    .factory('ArticleServices', ArticleServices);

  /** @ngInject */
  function ArticleServices($log, $resource, URL_API, $sessionStorage, $localStorage) {

    var service = {


      is_authenticated : is_authenticated
    };

    return service;

        function is_authenticated() {
            return ($sessionStorage.key || $localStorage.key) ? true : false;
        }
  }

})();
