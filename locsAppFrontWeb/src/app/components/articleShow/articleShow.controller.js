(function () {

  'use strict';

  angular
    .module('LocsappControllers')
    .controller('ArticleShowController', ArticleShowController);

  /** @ngInject */
  function ArticleShowController($log, $mdDialog, $document, ArticleService, $stateParams, $interval, toastr) {
    var vm = this;
    //vm.showChildComment = false;
    vm.test_test = ['un', 'deux', 'trois'];
     vm.url_pictures = ['http://www.voguequeen.com/images/dresses/bridesmaids/20120921/fashion-chiffon-a-line-strapless-sleeveless-short-length-empire-bridesmaid-dress_120920005.jpg',
        'http://www.polyvore.com/cgi/img-thing?.out=jpg&size=l&tid=135603516',
        'http://cdn.shopify.com/s/files/1/0293/9277/products/Fashion_Nova_-_01-21-16-410_large.JPG?v=1453489020',
        'http://www.voguequeen.com/images/dresses/bridesmaids/20120921/fashion-chiffon-a-line-strapless-sleeveless-short-length-empire-bridesmaid-dress_120920005.jpg',
        'http://www.polyvore.com/cgi/img-thing?.out=jpg&size=l&tid=135603516',
        'http://cdn.shopify.com/s/files/1/0293/9277/products/Fashion_Nova_-_01-21-16-410_large.JPG?v=1453489020'
      ];

    $log.log("route params = ", $stateParams.id);


    vm.GetInfoArticleSuccess = function (data) {
      $log.log("data SUCCESS= ", data);
      vm.urlpictures = ['http://www.voguequeen.com/images/dresses/bridesmaids/20120921/fashion-chiffon-a-line-strapless-sleeveless-short-length-empire-bridesmaid-dress_120920005.jpg',
        'http://www.polyvore.com/cgi/img-thing?.out=jpg&size=l&tid=135603516',
        'http://cdn.shopify.com/s/files/1/0293/9277/products/Fashion_Nova_-_01-21-16-410_large.JPG?v=1453489020',
        'http://www.voguequeen.com/images/dresses/bridesmaids/20120921/fashion-chiffon-a-line-strapless-sleeveless-short-length-empire-bridesmaid-dress_120920005.jpg',
        'http://www.polyvore.com/cgi/img-thing?.out=jpg&size=l&tid=135603516',
        'http://cdn.shopify.com/s/files/1/0293/9277/products/Fashion_Nova_-_01-21-16-410_large.JPG?v=1453489020'
      ];

      vm.comments = [
        {
          "_id": "56cb3cb1b2bc57ab2908e697",
          "id_author": 42,
          "username_author": "locsapp",
          "content": "Je suis un com de test.",
          "is_visible": true,
          "date_created": "fausse date",
          "date_modified": "fausse date",
          "childs": [],
          "last_versions": [],
          "flagged": null
        },
        {
          "_id": "56cb3cb1b2bc57ab2908e787",
          "id_author": 42,
          "username_author": "locsapp",
          "content": "Je suis un com de test. 2",
          "is_visible": true,
          "date_created": "fausse date",
          "date_modified": "fausse date",
          "childs": [
            {
              "_id": "56cb3cb1b2bc57ab2908e787",
              "id_author": 42,
              "username_author": "locsapp",
              "content": "Je suis un com de test. 2",
              "is_visible": true,
              "date_created": "fausse date",
              "date_modified": "fausse date",
              "childs": [],
              "last_versions": [],
              "flagged": null
            },
            {
              "_id": "56cb3cb1b2bc57ab2908e787",
              "id_author": 42,
              "username_author": "locsapp",
              "content": "Je suis un com de test. 2",
              "is_visible": true,
              "date_created": "fausse date",
              "date_modified": "fausse date",
              "childs": [],
              "last_versions": [],
              "flagged": null
            }
          ],
          "last_versions": [],
          "flagged": null
        },
        {
          "_id": "56cb3cb1b2bc57ab2908e787",
          "id_author": 42,
          "username_author": "locsapp",
          "content": "Je suis un com de test. 2",
          "is_visible": true,
          "date_created": "fausse date",
          "date_modified": "fausse date",
          "childs": [],
          "last_versions": [],
          "flagged": null
        },
        {
          "_id": "56cb3cb1b2bc57ab2908e787",
          "id_author": 42,
          "username_author": "locsapp",
          "content": "Je suis un com de test. 2",
          "is_visible": false,
          "date_created": "fausse date",
          "date_modified": "fausse date",
          "childs": [],
          "last_versions": [],
          "flagged": null
        }

      ]

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


    vm.reply = function()
    {
      //Show the new input

    };

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


    vm.submitComment = function (comment) {
      // SI on a clique sur shit on veut revenir a ligne
      //SINON on envoie le commentaire direcment1
      $log.log("Send form", vm.parentNewComment, comment);
      //vm.parentNewComment += '\n toto';
      if (comment === "")
        toastr.error("there is nothing in your comment", "Error");
      else
        toastr.success("comment sent", "Success!");
    };


    vm.showImageCarouselController = function (index, slides) {

      var vm = this;

      vm.slideRight = false;
      vm.slideLeft = false;
      vm.fade = false;
      //$log.log("IN image show Image Gallery", index, slides[0]);


      vm.slides = slides;
      vm.currentIndex = index;

      vm.automaticNext = function () {
        vm.currentIndex = (vm.currentIndex < vm.slides.length - 1) ? ++vm.currentIndex : 0;
        vm.slideRight = true;
        vm.slideLeft = false;
        vm.fade = false;
      };

      var intervalNext = $interval(vm.automaticNext, 3000);


      vm.cancel = function () {

      };

      vm.setCurrentSlideIndex = function (index) {
        $log.log("in setCurrentSlideindex");
        vm.fade = true;
        vm.slideLeft = false;
        vm.slideRight = false;
        $interval.cancel(intervalNext);
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
        $interval.cancel(intervalNext);
      };

      vm.nextSlide = function () {
        vm.currentIndex = (vm.currentIndex < vm.slides.length - 1) ? ++vm.currentIndex : 0;
        vm.slideRight = true;
        vm.slideLeft = false;
        vm.fade = false;

        $interval.cancel(intervalNext);
      };


    }
  }

})();
