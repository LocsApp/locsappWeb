(function(){

  'use strict';

  angular
    .module('LocsappServices')
    .factory('ArticleServices', ArticleServices);

  /** @ngInject */
  function ArticleServices($log, $resource, URL_API, $sessionStorage, $localStorage) {

    var service = {

      getArticle: $resource(URL_API + 'api/v1/rest-auth/registration/'),
      is_authenticated : is_authenticated
    };

    return service;

        function is_authenticated() {
            return ($sessionStorage.key || $localStorage.key) ? true : false;
        }
  }

})();
