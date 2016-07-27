(function () {

  'use strict';

  angular
    .module('LocsappControllers')
    .controller('NotationAsClientController', NotationAsClientController);

  /** @ngInject */
  function NotationAsClientController(HistoryService, $stateParams, $log, $mdDialog, $document) {

    var vm = this;
    var i;
    vm.current_page = 1;
    vm.page_size = 10;
    vm.username = $stateParams.username;

    //Average mark;

    //On doit faire un get du profile utilisateur pour etre sur d'avoir le nombre d'etoile





    vm.GetNotationAsClientSuccess = function (data) {
      $log.log("GetNotationAsClientSuccess", data);
       vm.animatePagination='';
      vm.notations = data.notations_as_client;


      //We transform the average mark in bool array;
        vm.client_score_array = undefined;
      if (data.average_mark != -1) {
        var client_score = Math.round(data.average_mark);
        vm.client_score_array = [];
        for (i = 0; i < 5; i++) {
          if (i < client_score)
            vm.client_score_array.push(true);
          else
            vm.client_score_array.push(false);
        }
      }
      $log.log("vm score = ", vm.client_score_array);

    // We transfrom each mark in a bool array
      for (i = 0; i < vm.notations.length; i++) {
        var score_client = Math.round(vm.notations[i].value);
        var score_array_client = [];

        for (var j = 0; j < 5; j++) {
          if (j < score_client)
            score_array_client.push(true);
          else
            score_array_client.push(false);
        }
        vm.notations[i].score = score_array_client;

      }

      vm.nb_items = data.nb_page * vm.page_size;
      vm.nb_page = data.nb_page;
    };

    vm.getNotationAsClientFailure = function (data) {
      $log.error("getNotationAsClientFailure", data);
    };


    HistoryService
      .getNotationsAsClient
      .get({id_user: $stateParams.username, id_page: vm.current_page})
      .$promise
      .then(vm.GetNotationAsClientSuccess, vm.getNotationAsClientFailure);

    vm.prevPage = function (idPage) {
      vm.animatePagination='animate-pagination';
      vm.current_page = idPage;
      HistoryService
        .getNotationsAsClient
        .get({id_user: $stateParams.username, id_page: idPage})
        .$promise
        .then(vm.GetNotationAsClientSuccess, vm.getNotationAsClientFailure);
    };

    vm.nextPage = function (idPage) {
      vm.animatePagination='animate-pagination';
      vm.current_page = idPage;
      HistoryService
        .getNotationsAsClient
        .get({id_user: $stateParams.username, id_page: idPage})
        .$promise
        .then(vm.GetNotationAsClientSuccess, vm.getNotationAsClientFailure);
    };

    vm.goToPage = function (currentPage) {

      vm.animatePagination='animate-pagination';

      HistoryService
        .getNotationsAsClient
        .get({id_user: $stateParams.username, id_page: currentPage})
        .$promise
        .then(vm.GetNotationAsClientSuccess, vm.getNotationAsClientFailure);
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
