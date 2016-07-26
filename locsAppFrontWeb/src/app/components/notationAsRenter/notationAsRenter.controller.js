(function(){

  'use strict';

  angular
    .module('LocsappControllers')
    .controller('NotationAsRenterController', NotationAsRenterController);

  /** @ngInject */
  function NotationAsRenterController(HistoryService, $stateParams, $log) {

    var vm = this;

    vm.GetNotationAsRenterSuccess = function(data) {
      $log.log("GetNotationAsRenterSuccess", data);
    };

    vm.getNotationAsRenterFailure = function(data) {
     $log.error("getNotationAsRenterFailure", data);
    };


    HistoryService
      .getNotationsAsRenter
      .get({id_user: $stateParams.id_user, id_page: $stateParams.id_page})
      .$promise
      .then(vm.GetNotationAsRenterSuccess, vm.getNotationAsRenterFailure);
  }


})();
