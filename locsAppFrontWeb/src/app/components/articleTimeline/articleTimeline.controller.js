(function () {

  'use strict';

  angular
    .module('LocsappControllers')
    .controller('ArticleTimelinesController', ArticleTimelinesController);

  /** @ngInject */
  function ArticleTimelinesController($log, ArticleService, toastr, ScopesService) {
    var vm = this;

    vm.demands = true;
    vm.demandsAsRenting = true;

    
  }

 })();