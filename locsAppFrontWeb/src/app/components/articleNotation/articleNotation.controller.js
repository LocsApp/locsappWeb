(function () {

  'use strict';

  angular
    .module('LocsappControllers')
    .controller('ArticleNotationController', ArticleNotationController);

  /** @ngInject */
  function ArticleNotationController($log, ArticleService, toastr, ScopesService, URL_API) {
    var vm = this;

    vm.notationsClient = true;
    vm.notationsRenter = true;

    vm.url_api = URL_API;

    vm.GetNotationsClientSuccess = function (data) {
      $log.log(data);
      vm.notationsClient = data.article_demands;
    };

    vm.GetNotationsRenterSuccess = function (data) {
      $log.log(data);
      vm.notationsRenter = data.article_demands;
    };

    vm.GetNotationFailure = function (data) {
      $log.log(data);
    };

    ArticleService
    .getPendingMarksForClients
    .get()
    .$promise
    .then(vm.GetNotationsClientSuccess,  vm.GetNotationFailure);

    ArticleService
    .getPendingMarksForRenters
    .get()
    .$promise
    .then(vm.GetNotationsRenterSuccess,  vm.GetNotationFailure);
  }

})();