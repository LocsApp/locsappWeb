(function () {

  'use strict';

  angular
    .module('LocsappControllers')
    .controller('NotationAsRenterController', NotationAsRenterController);

  /** @ngInject */
  function NotationAsRenterController(HistoryService, $stateParams, $log, $mdDialog, $document) {

    var vm = this;
    var i;
    vm.current_page = 1;
    vm.page_size = 10;
    vm.username = $stateParams.username;

    //Average mark;

    //On doit faire un get du profile utilisateur pour etre sur d'avoir le nombre d'etoile





    vm.GetNotationAsRenterSuccess = function (data) {
      $log.log("GetNotationAsRenterSuccess", data);
       vm.animatePagination='';
      vm.notations = data.notations_as_renter;


      //We transform the average mark in bool array;
        vm.renter_score_array = undefined;
      if (data.average_mark != -1) {
        var renter_score = Math.round(data.average_mark);
        vm.renter_score_array = [];
        for (i = 0; i < 5; i++) {
          if (i < renter_score)
            vm.renter_score_array.push(true);
          else
            vm.renter_score_array.push(false);
        }
      }
      $log.log("vm score = ", vm.renter_score_array);

    // We transfrom each mark in a bool array
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
      .get({id_user: $stateParams.username, id_page: vm.current_page})
      .$promise
      .then(vm.GetNotationAsRenterSuccess, vm.getNotationAsRenterFailure);

    vm.prevPage = function (idPage) {
      vm.animatePagination='animate-pagination';
      vm.current_page = idPage;
      HistoryService
        .getNotationsAsRenter
        .get({id_user: $stateParams.username, id_page: idPage})
        .$promise
        .then(vm.GetNotationAsRenterSuccess, vm.getNotationAsRenterFailure);
    };

    vm.nextPage = function (idPage) {
      vm.animatePagination='animate-pagination';
      vm.current_page = idPage;
      HistoryService
        .getNotationsAsRenter
        .get({id_user: $stateParams.username, id_page: idPage})
        .$promise
        .then(vm.GetNotationAsRenterSuccess, vm.getNotationAsRenterFailure);
    };

    vm.goToPage = function (currentPage) {

      vm.animatePagination='animate-pagination';

      HistoryService
        .getNotationsAsRenter
        .get({id_user: $stateParams.username, id_page: currentPage})
        .$promise
        .then(vm.GetNotationAsRenterSuccess, vm.getNotationAsRenterFailure);
    };

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
    }

  }


})();
