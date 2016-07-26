(function () {

  'use strict';

  angular
    .module('LocsappControllers')
    .controller('NotationAsRenterController', NotationAsRenterController);

  /** @ngInject */
  function NotationAsRenterController(HistoryService, $stateParams, $log, $state) {

    var vm = this;
    var i;
    vm.current_page = 1;
    vm.page_size = 10;
    vm.id_user = $stateParams.id_user;


    //$log.log("current_page = ", vm.current_page);


    vm.GetNotationAsRenterSuccess = function (data) {
      $log.log("GetNotationAsRenterSuccess", data);
      vm.notations = data.notations_as_renter;

      for (i = 0; i < vm.notations.length; i++) {
        var score_renter = Math.round(vm.notations[i].value);
        var score_array_renter = [];

        for (var j = 0; j < 5; j++) {
          if (j < score_renter)
            score_array_renter.push(true);
          else
            score_array_renter.push(false);
        }
        vm.notations[i].score = score_array_renter;

      }

      vm.nb_items = data.nb_page * vm.page_size;
      vm.nb_page = data.nb_page;
    };

    vm.getNotationAsRenterFailure = function (data) {
      $log.error("getNotationAsRenterFailure", data);
    };


    HistoryService
      .getNotationsAsRenter
      .get({id_user: $stateParams.id_user, id_page: vm.current_page})
      .$promise
      .then(vm.GetNotationAsRenterSuccess, vm.getNotationAsRenterFailure);

    vm.prevPage = function (idPage) {
      vm.current_page = idPage;
      HistoryService
        .getNotationsAsRenter
        .get({id_user: $stateParams.id_user, id_page: idPage})
        .$promise
        .then(vm.GetNotationAsRenterSuccess, vm.getNotationAsRenterFailure);
    };

    vm.nextPage = function (idPage) {
      vm.current_page = idPage;
      HistoryService
        .getNotationsAsRenter
        .get({id_user: $stateParams.id_user, id_page: idPage})
        .$promise
        .then(vm.GetNotationAsRenterSuccess, vm.getNotationAsRenterFailure);
    };

    vm.goToPage = function (currentPage) {

      HistoryService
        .getNotationsAsRenter
        .get({id_user: $stateParams.id_user, id_page: currentPage})
        .$promise
        .then(vm.GetNotationAsRenterSuccess, vm.getNotationAsRenterFailure);
    }

  }


})();
