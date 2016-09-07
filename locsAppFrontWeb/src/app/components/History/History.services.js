(function () {

  'use strict';

  angular
    .module('LocsappServices')
    .factory('HistoryService', HistoryService);

  /** @ngInject */
  function HistoryService($log, $resource, URL_API) {

    var service = {
      getMarksForClients: $resource(URL_API + 'api/v1/history/notations-as-client:id_page/',
        {id_page: "id_page"}),
      getMarksForRenters: $resource(URL_API + 'api/v1/history/notations-as-renter/',
        {id_page: "id_page"}),

      getArticlesForClients: $resource(URL_API + 'api/v1/history/articles-as-client/'),
      getArticlesForRenters: $resource(URL_API + 'api/v1/history/articles-as-renter/'),

      getNotationsAsClient: $resource(URL_API + 'api/v1/history/notations-as-client-pagination/:id_user/:id_page/',
        {id_user: "id_user", id_page: "id_page"}),
      getNotationsAsRenter: $resource(URL_API + 'api/v1/history/notations-as-renter-pagination/:id_user/:id_page/',
        {id_user: "id_user", id_page: "id_page"})
    };

    return service;

  }
})();
