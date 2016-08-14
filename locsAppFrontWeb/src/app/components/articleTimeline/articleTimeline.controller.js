(function () {

  'use strict';

  angular
    .module('LocsappControllers')
    .controller('ArticleTimelinesController', ArticleTimelinesController);

  /** @ngInject */
  function ArticleTimelinesController($log, ArticleService, toastr, ScopesService, URL_API) {
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

    /* Calculates how many days are left to show in the progress bar */
    vm.daysLeftCalculate = function(demand)
    {
      var start = new Date(demand.availibility_start)
      var end = new Date(demand.availibility_end)
      end.setDate(end.getDate() + 1);
      var today = new Date();

      $log.log(start)
      $log.log(end)
      $log.log(today)
      var daysEllapsed = Math.round(((today - start) / (end - start)) * 100);
      $log.log(daysEllapsed);
      return (daysEllapsed)
    }

    vm.howManyDaysLeft = function(demand) {
      var oneDay = 24*60*60*1000;
      var end = new Date(demand.availibility_end);
      var today = new Date();
      var days_left = Math.round(Math.abs((today.getTime() - end.getTime())/(oneDay)));
      return (days_left + 1);
    }

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