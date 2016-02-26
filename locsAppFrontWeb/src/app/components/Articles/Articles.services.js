(function(){

  'use strict';

  angular
    .module('LocsappServices')
    .factory('ArticleService', ArticleService);

  /** @ngInject */
  function ArticleService($log, $resource, URL_API, $sessionStorage, $localStorage) {

    var service = {
      getCategories: $resource(URL_API + 'api/v1/static-collections/base-categories/'),
      getArticle: $resource(URL_API + 'api/v1/articles/get/:id/', {id: "@user_id"}),
      is_authenticated : is_authenticated
    };

    return service;

        function is_authenticated() {
            return ($sessionStorage.key || $localStorage.key) ? true : false;
        }
  }

})();
