(function(){

  'use strict';

  angular
    .module('LocsappServices')
    .factory('ArticleService', ArticleService);

  /** @ngInject */
  function ArticleService($log, $resource, URL_API, $sessionStorage, $localStorage) {

    var service = {

      getArticle: $resource(URL_API + 'api/v1/articles/get/:id/', {id: "@article_id"}),
      getCategories: $resource(URL_API + 'api/v1/static-collections/base-categories/'),
      getSubCategories: $resource(URL_API + 'api/v1/static-collections/sub-categories/'),
      is_authenticated : is_authenticated
    };

    return service;

        function is_authenticated() {
            return ($sessionStorage.key || $localStorage.key) ? true : false;
        }
  }

})();
