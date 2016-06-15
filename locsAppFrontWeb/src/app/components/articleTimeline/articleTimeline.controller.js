(function () {

  'use strict';

  angular
    .module('LocsappControllers')
    .controller('ArticleTimelinesController', ArticleTimelinesController);

  /** @ngInject */
  function ArticleTimelinesController($log, ArticleService, toastr, ScopesService) {
    var vm = this;

    vm.demands = true;
    vm.demandsAsRenting = true;

    vm.GetDemandsSuccess = function (data) {
      $log.log(data);
      vm.demands = data.article_demands;
    };

    vm.GetDemandsFailure = function (data) {
      $log.log(data);
    };

    vm.GetDemandsRentingSuccess = function (data) {
      $log.log("renting")
      $log.log(data);
      vm.demandsAsRenting = data.article_demands;
    };

    vm.GetDemandsRentingFailure = function (data) {
      $log.log(data);
    };

    ArticleService
    .currentTimelines
    .get()
    .$promise
    .then(vm.GetDemandsSuccess, vm.GetDemandsFailure);

    ArticleService
    .currentTimelinesAsRenting
    .get()
    .$promise
    .then(vm.GetDemandsRentingSuccess, vm.GetDemandsRentingFailure);

  }

 })();