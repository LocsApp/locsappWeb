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
      $log.log("renting")
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

    vm.acceptDemand = function(index)
    {
      ArticleService
      .acceptDemand
      .save({"id_demand": vm.demands[index]._id})
      .$promise
      .then(function(data)
      {
        $log.log(data)
        var article_id= vm.demands[index].id_article;
        toastr.success(data.message, "Success!");
        for(var x=0; x < vm.demands.length; x++)
        {
          if (vm.demands[x].id_article == article_id)
            vm.demandsAsRenting.splice(x, 1);
        }
      },
      function(data)
      {
        toastr.error(data.data.Error, "Woops...");
        $log.log(data);
      })
    }

    vm.retractDemand = function (index)
    {
      ArticleService
      .retractDemand
      .save({"id_demand": vm.demandsAsRenting[index]._id})
      .$promise
      .then(function(data)
      {
        toastr.success(data.message, "Success!");
        vm.demandsAsRenting.splice(index, 1);
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