(function () {

  'use strict';

  angular
    .module('LocsappControllers')
    .controller('ArticleShowController', ArticleShowController);

  /** @ngInject */
  function ArticleShowController($log, $mdDialog, $document) {
    var vm = this;

    $log.log("In controller Article");


    vm.clickImageGallery = function (event, index) {
      $mdDialog.show({
        controller: vm.showImageCarouselController,
        controllerAs: 'showImageCarousel',
        templateUrl: 'app/templates/dialogTemplates/articleImageCarousel.tmpl.html',
        parent: angular.element($document.body),
        locals: {index: index},
        targetEvent: event,
        clickOutsideToClose: true
      });
    };

    vm.showImageCarouselController = function() {
      $log.log("IN image show Image Gallery")
    }
  }

})();
