(function () {

  'use strict';

  angular
    .module('LocsappServices')
    .factory('HistoryService', HistoryService);

  /** @ngInject */
  function HistoryService($log, $resource, URL_API) {

    var service = {
        getMarksForClients: $resource(URL_API + 'api/v1/history/notations-as-client/'),
        getMarksForRenters: $resource(URL_API + 'api/v1/history/notations-as-renter/'),
        getArticlesForClients: $resource(URL_API + 'api/v1/history/articles-as-client/'),
        getArticlesForRenters: $resource(URL_API + 'api/v1/history/notations-as-renter/')
    };

    return service;

  }
  })();
