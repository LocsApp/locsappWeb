(function () {

  'use strict';

  angular
    .module('LocsappControllers')
    .controller('ArticleShowController', ArticleShowController);

  /** @ngInject */
  function ArticleShowController($log) {
    var vm = this;

   // $log.log("In controller Article");


    vm.showImageGalery = function(index) {
      $log.log(index);
    }
  }

})();
