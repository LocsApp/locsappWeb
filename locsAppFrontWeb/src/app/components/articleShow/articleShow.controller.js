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

    vm.showImageCarouselController = function () {
      $log.log("IN image show Image Gallery");

      var vm = this;

      vm.currentIndex = 0;
      vm.slides = [
        {image: 'http://www.voguequeen.com/images/dresses/bridesmaids/20120921/fashion-chiffon-a-line-strapless-sleeveless-short-length-empire-bridesmaid-dress_120920005.jpg', description: 'Image 00'},
        {image: 'http://www.polyvore.com/cgi/img-thing?.out=jpg&size=l&tid=135603516', description: 'Image 01'},
        {image: 'http://cdn.shopify.com/s/files/1/0293/9277/products/Fashion_Nova_-_01-21-16-410_large.JPG?v=1453489020', description: 'Image 02'},
         {image: 'http://www.voguequeen.com/images/dresses/bridesmaids/20120921/fashion-chiffon-a-line-strapless-sleeveless-short-length-empire-bridesmaid-dress_120920005.jpg', description: 'Image 03'},
        {image: 'http://www.polyvore.com/cgi/img-thing?.out=jpg&size=l&tid=135603516', description: 'Image 04'},
        {image: 'http://cdn.shopify.com/s/files/1/0293/9277/products/Fashion_Nova_-_01-21-16-410_large.JPG?v=1453489020', description: 'Image 05'},
      ];

      vm.setCurrentSlideIndex = function(index) {
        vm.currentIndex = index;
      };

      vm.isCurrentSlideIndex = function(index) {
        return vm.currentIndex == index;
      }


    }
  }

})();
