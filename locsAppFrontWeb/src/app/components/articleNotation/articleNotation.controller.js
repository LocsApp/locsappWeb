(function () {

  'use strict';

  angular
    .module('LocsappControllers')
    .controller('ArticleNotationController', ArticleNotationController);

  /** @ngInject */
  function ArticleNotationController($log, ArticleService, toastr, ScopesService, URL_API) {
    var vm = this;

    vm.notationsClient = true;
    vm.notationsRenter = true;

    vm.url_api = URL_API;

    vm.number_stars = [1,2,3,4,5];

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

    vm.sendNotationFailure = function (data) {
      $log.log(data);
      toastr.error(data.data.Error, "Woops...")
    };

    vm.sendNotationSuccess = function (data) {
      toastr.success(data.message, "Success!")
      if (vm.lastDemand != -1)
       {
          if (vm.lastMode == false)
            vm.notationsClient.splice(vm.lastDemand, 1);
          else
            vm.notationsRenter.splice(vm.lastDemand, 1);
       }
      $log.log(data);
    }

    /* Stores the new mark in the given demand */
    vm.starValue = function(newValue, demand) {
      demand.value = newValue;
      $log.log(demand.value)
    }

    /* Sends the notation */
    vm.sendNotation = function(index, demand, mode) {
      $log.log("kek");
      if (!demand.value || demand.value < 1 || demand.value > 5)
        toastr.error("The mark must be of value between 1 and 5" ,"Woops...")
      else if (!demand.comment || demand.comment.length < 5 || demand.comment.length > 90)
        toastr.error("The comment length must be shorter than 5 characters and longer than 90." ,"Woops...")
      else
      {
        var id_target = undefined;
        if (mode)
          id_target = demand.id_target;
        else
          id_target = demand.id_author;
        vm.lastDemand = index;
        vm.lastMode = mode;
        ArticleService
        .giveMark
        .save({
         "id_target": id_target, 
         "id_demand": demand._id, 
         "id_article": demand.id_article, 
         "value": demand.value,
         "as_renter": mode,
         "comment": demand.comment})
        .$promise
        .then(vm.sendNotationSuccess, vm.sendNotationFailure);
      }
    }

    ArticleService
    .getPendingMarksForClients
    .get()
    .$promise
    .then(vm.GetNotationsClientSuccess,  vm.GetNotationFailure);

    ArticleService
    .getPendingMarksForRenters
    .get()
    .$promise
    .then(vm.GetNotationsRenterSuccess,  vm.GetNotationFailure);
  }

})();