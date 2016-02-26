(function () {

  'use strict';

  angular
    .module('LocsappControllers')
    .controller('ArticleShowController', ArticleShowController);

  /** @ngInject */
  function ArticleShowController($log, $mdDialog, $document, ArticleService, $stateParams, $interval) {
    var vm = this;

    $log.log("route params = ", $stateParams.id);


    vm.GetInfoArticleSuccess = function (data) {
      $log.log("data SUCCESS= ", data);
      vm.url_pictures = ['http://www.voguequeen.com/images/dresses/bridesmaids/20120921/fashion-chiffon-a-line-strapless-sleeveless-short-length-empire-bridesmaid-dress_120920005.jpg',
        'http://www.polyvore.com/cgi/img-thing?.out=jpg&size=l&tid=135603516',
        'http://cdn.shopify.com/s/files/1/0293/9277/products/Fashion_Nova_-_01-21-16-410_large.JPG?v=1453489020',
        'http://www.voguequeen.com/images/dresses/bridesmaids/20120921/fashion-chiffon-a-line-strapless-sleeveless-short-length-empire-bridesmaid-dress_120920005.jpg',
        'http://www.polyvore.com/cgi/img-thing?.out=jpg&size=l&tid=135603516',
        'http://cdn.shopify.com/s/files/1/0293/9277/products/Fashion_Nova_-_01-21-16-410_large.JPG?v=1453489020'
      ];

    };

    vm.getInfoArticleFailure = function (data) {
      $log.error("error", data)
    };

    //"56cb41c0421aa91298799892"
    //$stateParams.id
    ArticleService
      .getArticle
      .get({id: $stateParams.id})
      .$promise
      .then(vm.GetInfoArticleSuccess, vm.getInfoArticleFailure);


    vm.clickImageGallery = function (event, index) {
      $mdDialog.show({
        controller: vm.showImageCarouselController,
        controllerAs: 'showImageCarousel',
        templateUrl: 'app/templates/dialogTemplates/articleImageCarousel.tmpl.html',
        parent: angular.element($document.body),
        locals: {index: index, slides: vm.url_pictures},
        targetEvent: event,
        clickOutsideToClose: true
      });
    };

    vm.showImageCarouselController = function (index, slides) {

      var vm = this;

      vm.slideRight = false;
      vm.slideLeft = false;
      vm.fade = false;
      //$log.log("IN image show Image Gallery", index, slides[0]);


      vm.slides = slides;
      vm.currentIndex = index;


      vm.setCurrentSlideIndex = function (index) {
        vm.fade = true;
        vm.slideLeft = false;
        vm.slideRight = false;
        vm.currentIndex = index;
      };

      vm.isCurrentSlideIndex = function (index) {
        return vm.currentIndex == index;
      };

      vm.prevSlide = function () {
        vm.currentIndex = (vm.currentIndex > 0) ? --vm.currentIndex : vm.slides.length - 1;
        vm.slideLeft = true;
        vm.slideRight = false;
        vm.fade = false;
      };

      vm.nextSlide = function () {
        vm.currentIndex = (vm.currentIndex < vm.slides.length - 1) ? ++vm.currentIndex : 0;
        vm.slideRight = true;
        vm.slideLeft = false;
        vm.fade = false;
      };

      vm.automaticNext = function () {
        $log.log("Automatic next");
        vm.nextSlide();
      };

      $interval(vm.automaticNext, 5000);


    }
  }

})();
