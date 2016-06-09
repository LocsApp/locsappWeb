(function () {

  'use strict';

  angular
    .module('LocsappControllers')
    .controller('ArticleRequestsController', ArticleRequestsController);

  /** @ngInject */
  function ArticleRequestsController($log, ArticleService, toastr, ScopesService, URL_API) {
    var vm = this;

    vm.demands = true;
    vm.demandsAsRenting = true;

    vm.url_api = URL_API;

    vm.GetDemandsSuccess = function (data) {
      $log.log(data);
      vm.demands = data.article_demands;
    };

    vm.GetDemandsFailure = function (data) {
      $log.log(data);
    };

    vm.GetDemandsRentingSuccess = function (data) {
      $log.log(data);
      vm.demandsAsRenting = data.article_demands;
    };

    vm.GetDemandsRentingFailure = function (data) {
      $log.log(data);
    };

    vm.refuseDemand = function (index)
    {
      ArticleService
      .refuseDemand
      .save({"id_demand": vm.demands[index]._id})
      .$promise
      .then(function(data)
      {
        toastr.success(data.message, "Success!");
        vm.demands.splice(index, 1);
      },
      function(data)
      {
        toastr.error(data.data.Error, "Woops...");
        $log.log(data);
      })
    }

    ArticleService
    .demands
    .get()
    .$promise
    .then(vm.GetDemandsSuccess, vm.GetDemandsFailure);

    ArticleService
    .demandsAsRenting
    .get()
    .$promise
    .then(vm.GetDemandsRentingSuccess, vm.GetDemandsRentingFailure);
  }

 })();