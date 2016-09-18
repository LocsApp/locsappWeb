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
      vm.nb_items_client = data.nb_page * vm.page_size;
      vm.nb_page_client = data.nb_page;
    };

    vm.GetArticlesRenterSuccess = function (data) {
      $log.log("GetArticlesRenterSuccess", data);
      vm.articlesRenter = data.articles_as_renter;
      vm.nb_items_renter = data.nb_page * vm.page_size;
      vm.nb_page_renter = data.nb_page;
    };

    vm.GetArticlesFailure = function (data) {
      $log.log(data);
    };


    HistoryService
      .getArticlesForClients
      .get(({id_page: vm.current_page_client}))
      .$promise
      .then(vm.GetArticlesClientSuccess, vm.GetArticlesFailure);

       /* Action Pagination Client */

    vm.goToPageClient = function (currentPage) {

      vm.animatePagination = 'animate-pagination';
      //$log.log("currentPage = ", currentPage);
      HistoryService
        .getMarksForClients
        .get({id_page: currentPage})
        .$promise
        .then(vm.GetArticlesClientSuccess, vm.GetArticlesFailure);
    };

    vm.prevOrNextPageClient = function (idPage) {

      vm.animatePagination = 'animate-pagination';
      vm.current_page_client = idPage;
      HistoryService
        .getMarksForClients
        .get({id_page: idPage})
        .$promise
        .then(vm.GetArticlesClientSuccess, vm.GetArticlesFailure);

    };

    /* End Action Pagination Client */


    HistoryService
      .getArticlesForRenters
      .get(({id_page: vm.current_page_renter}))
      .$promise
      .then(vm.GetArticlesRenterSuccess, vm.GetArticlesFailure);


      /* Action Pagination Renter */
     vm.goToPageRenter = function (currentPage) {

      vm.animatePagination = 'animate-pagination';
      //$log.log("currentPage = ", currentPage);
      HistoryService
        .getMarksForRenters
        .get({id_page: currentPage})
        .$promise
        .then(vm.GetArticlesRenterSuccess, vm.GetArticlesFailure);
    };

    vm.prevOrNextPageRenter = function (idPage) {

      vm.animatePagination = 'animate-pagination';
      vm.current_page_renter = idPage;
      HistoryService
        .getMarksForRenters
        .get({id_page: idPage})
        .$promise
        .then(vm.GetArticlesRenterSuccess, vm.GetArticlesFailure);

    };

    /* End Action Pagination Renter */
  }

})();
