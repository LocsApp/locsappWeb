(function () {

  'use strict';

  angular
    .module('LocsappControllers')
    .controller('HistoryArticleController', HistoryArticleController);

  /** @ngInject */
  function HistoryArticleController($log, HistoryService, URL_API) {
    var vm = this;

    vm.articlesClient = true;
    vm.articlesRenter = true;

    vm.url_api = URL_API;

    vm.GetArticlesClientSuccess = function (data) {
      $log.log(data);
      vm.articlesClient = data.article_demands;
    };

    vm.GetArticlesRenterSuccess = function (data) {
      $log.log(data);
      vm.articlesRenter = data.article_demands;
    };

    vm.GetArticlesFailure = function (data) {
      $log.log(data);
    };


    HistoryService
    .getArticlesForClients
    .get()
    .$promise
    .then(vm.GetArticlesClientSuccess,  vm.GetArticlesFailure);

    HistoryService
    .getArticlesForRenters
    .get()
    .$promise
    .then(vm.GetArticlesRenterSuccess,  vm.GetArticlesFailure);
  }

})();
