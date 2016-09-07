(function () {

  'use strict';

  angular
    .module('LocsappControllers')
    .controller('HistoryNotationController', HistoryNotationController);

  /** @ngInject */
  function HistoryNotationController($log, HistoryService, URL_API, $mdDialog, $document) {
    var vm = this;

    vm.current_page = 1;
    vm.page_size = 10; // We use the same variable for the both

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
      vm.nb_items_client = data.nb_page * vm.page_size;
      vm.nb_page_client = data.nb_page;
      for (var i = 0; i < vm.notationsClient.length; i++) {
        vm.notationsClient[i].nb_stars = [0, 0, 0, 0, 0];
        for (vm.iterator = 0; vm.iterator < vm.notationsClient[i].nb_stars.length; vm.iterator++) {
          if (vm.iterator < vm.notationsClient[i].value)
            vm.notationsClient[i].nb_stars[vm.iterator] = 1;
          else
            vm.notationsClient[i].nb_stars[vm.iterator] = 0;
        }
      }
    };

    vm.GetNotationsRenterSuccess = function (data) {
      $log.log("GetNotationsRenterSuccess", data);
      vm.notationsRenter = data.notations_as_renter;
      for (var i = 0; i < vm.notationsRenter.length; i++) {
        vm.notationsRenter[i].nb_stars = [0, 0, 0, 0, 0];
        for (vm.iterator = 0; vm.iterator < vm.notationsRenter[i].nb_stars.length; vm.iterator++) {
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
      .then(vm.GetNotationsClientSuccess, vm.GetNotationFailure);

    /* Action Pagination Client */

    vm.goToPageClient = function (currentPage) {

      vm.animatePagination = 'animate-pagination';
      //$log.log("currentPage = ", currentPage);
      HistoryService
        .getMarksForClients
        .get({id_page: currentPage})
        .$promise
        .then(vm.GetNotationsClientSuccess, vm.GetNotationFailure);
    };

    vm.prevOrNextPageClient = function(idPage) {

      vm.animatePagination='animate-pagination';
      vm.current_page = idPage;
      HistoryService
        .getMarksForClients
        .get({id_page: idPage})
        .$promise
        .then(vm.GetNotationsClientSuccess, vm.GetNotationFailure);

    };

    /* End Action Pagination Client */

    HistoryService
      .getMarksForRenters
      .get(({id_page: vm.current_page}))
      .$promise
      .then(vm.GetNotationsRenterSuccess, vm.GetNotationFailure);



    /* Dialog to show one notation */

        /** @ngInject */
    vm.showNotationDialog = function (event, notation) {
      $mdDialog.show({
        controller: vm.showNotationController,
        controllerAs: 'showNotation',
        templateUrl: 'app/templates/dialogTemplates/showOneNotation.tmpl.html',
        locals: {
          notation: notation
        },
        bindToController: true,
        parent: angular.element($document.body),
        targetEvent: event,
        clickOutsideToClose: true
      })
    };

    /* ShowNotation controller */
    vm.showNotationController = function($mdDialog, notation) {
        $log.log("notation = ", notation);
      notation.score = notation.nb_stars;

    };

    /* End dialog to show one notation */

  }

})();
