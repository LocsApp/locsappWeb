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

      vm.nb_page = data.nb_page;
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

/*
"object:18"
_id
:
"5794795dcfcde402f20833f6"
article_name
:
"dolore eu Lorem culpa consequat"
as_renter
:
true
author_name
:
"sylflo"
comment
:
"WTF ????"
date_issued
:
"2016-07-24T08:16:29.072"
id_article
:
"5762ba8a574f43e5de201558"
id_author
:
2
id_demand
:
"57937731cfcde40ff523d742"
id_target
:
1
value
:
1
  */
