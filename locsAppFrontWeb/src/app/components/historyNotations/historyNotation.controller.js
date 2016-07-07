(function () {

  'use strict';

  angular
    .module('LocsappControllers')
    .controller('HistoryNotationController', HistoryNotationController);

  /** @ngInject */
  function HistoryNotationController($log, HistoryService, URL_API) {
    var vm = this;

    vm.notationsClient = true;
    vm.notationsRenter = true;

    vm.url_api = URL_API;

    vm.dummyArray = [0, 0, 0, 0, 0]
    vm.iterator = 0;

    vm.lastDemand = -1;
    vm.lastMode = false;

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

    /* used to show the proper numbe rof stars */
    vm.arrayGen = function arrayGen(value) {
      for (vm.iterator=0; vm.iterator < vm.dummyArray.length; vm.iterator++)
      {
        if (vm.iterator < value)
          vm.dummyArray[vm.iterator] = 1;
        else
          vm.dummyArray[vm.iterator] = 0;
      }
    }

    HistoryService
    .getMarksForClients
    .get()
    .$promise
    .then(vm.GetNotationsClientSuccess,  vm.GetNotationFailure);

    HistoryService
    .getMarksForRenters
    .get()
    .$promise
    .then(vm.GetNotationsRenterSuccess,  vm.GetNotationFailure);
  }

})();
