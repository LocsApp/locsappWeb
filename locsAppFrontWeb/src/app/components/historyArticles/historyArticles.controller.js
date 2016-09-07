(function () {

  'use strict';

  angular
    .module('LocsappControllers')
    .controller('HistoryArticleController', HistoryArticleController);

  /** @ngInject */
  function HistoryArticleController($log, HistoryService, URL_API) {
    var vm = this;

    vm.current_page_client = 1;
    vm.current_page_renter = 1;
    vm.page_size = 10; // We use the same variable for the both


    vm.articlesClient = true;
    vm.articlesRenter = true;

    vm.url_api = URL_API;

    vm.GetArticlesClientSuccess = function (data) {
      $log.log("GetArticlesClientSuccess", data);
      vm.articlesClient = data.articles_as_client;
    };

    vm.GetArticlesRenterSuccess = function (data) {
      $log.log("GetArticlesRenterSuccess", data);
      vm.articlesRenter = data.articles_as_renter;
    };

    vm.GetArticlesFailure = function (data) {
      $log.log(data);
    };


    HistoryService
      .getArticlesForClients
      .get(({id_page: vm.current_page_client}))
      .$promise
      .then(vm.GetArticlesClientSuccess, vm.GetArticlesFailure);

    HistoryService
      .getArticlesForRenters
      .get(({id_page: vm.current_page_renter}))
      .$promise
      .then(vm.GetArticlesRenterSuccess, vm.GetArticlesFailure);
  }

})();
