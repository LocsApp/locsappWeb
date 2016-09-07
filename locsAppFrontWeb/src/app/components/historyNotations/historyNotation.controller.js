(function () {

  'use strict';

  angular
    .module('LocsappControllers')
    .controller('HistoryNotationController', HistoryNotationController);

  /** @ngInject */
  function HistoryNotationController($log, HistoryService, URL_API) {
    var vm = this;

    vm.current_page = 1;
    vm.page_size_client = 10;

    vm.notationsClient = true;
    vm.notationsRenter = true;

    vm.url_api = URL_API;

    vm.dummyArray = [0, 0, 0, 0, 0];
    vm.iterator = 0;

    vm.lastDemand = -1;
    vm.lastMode = false;

    vm.GetNotationsClientSuccess = function (data) {
      $log.log("GetNotationsClientSuccess", data);
      vm.notationsClient = data.notations_as_client;
      vm.nb_items = data.nb_page * vm.page_size;
      vm.nb_page = data.nb_page;
      for (var i =0; i < vm.notationsClient.length; i++)
      {
        vm.notationsClient[i].nb_stars = [0, 0, 0, 0, 0];
        for (vm.iterator=0; vm.iterator < vm.notationsClient[i].nb_stars.length; vm.iterator++)
        {
          if (vm.iterator < vm.notationsClient[i].value)
            vm.notationsClient[i].nb_stars[vm.iterator] = 1;
          else
            vm.notationsClient[i].nb_stars[vm.iterator] = 0;
        }
      }
    };

    vm.GetNotationsRenterSuccess = function (data) {
      $log.log(data);
      vm.notationsRenter = data.notations;
      for (var i =0; i < vm.notationsRenter.length; i++)
      {
        vm.notationsRenter[i].nb_stars = [0, 0, 0, 0, 0];
        for (vm.iterator=0; vm.iterator < vm.notationsRenter[i].nb_stars.length; vm.iterator++)
        {
          if (vm.iterator < vm.notationsRenter[i].value)
            vm.notationsRenter[i].nb_stars[vm.iterator] = 1;
          else
            vm.notationsRenter[i].nb_stars[vm.iterator] = 0;
        }
      }
    };

    vm.GetNotationFailure = function (data) {
      $log.log(data);
    };


    HistoryService
    .getMarksForClients
    .get(({id_page: vm.current_page}))
    .$promise
    .then(vm.GetNotationsClientSuccess,  vm.GetNotationFailure);

    HistoryService
    .getMarksForRenters
    .get()
    .$promise
    .then(vm.GetNotationsRenterSuccess,  vm.GetNotationFailure);
  }

})();
