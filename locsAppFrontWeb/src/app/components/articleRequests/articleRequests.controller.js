(function () {

  'use strict';

  angular
    .module('LocsappControllers')
    .controller('ArticleRequestsController', ArticleRequestsController);

  /** @ngInject */
  function ArticleRequestsController($log, ArticleService, toastr, ScopesService, URL_API) {
    var vm = this;

    vm.demands = [];

    vm.url_api = URL_API;

    vm.GetDemandsSuccess = function (data) {
      $log.log(data);
      vm.demands = data.article_demands;
    };

    vm.GetDemandsFailure = function (data) {
      $log.log(data);
    };

    ArticleService
    .demands
    .get()
    .$promise
    .then(vm.GetDemandsSuccess, vm.GetDemandsFailure);
  }

 })();