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

    $log.log("route params = ", $stateParams.id);


    vm.GetInfoArticleSuccess = function (data) {
      $log.log("data SUCCESS= ", data);
      vm.title = "Robe bleu hermes excellente qualite";
      vm.id_author = "42";
      vm.username_author = "author";
      vm.id = "145454e";
      vm.url_thumbnail = "http://www.polyvore.com/cgi/img-thing?.out=jpg&size=l&tid=135603516";
      vm.url_pictures = ['http://www.voguequeen.com/images/dresses/bridesmaids/20120921/fashion-chiffon-a-line-strapless-sleeveless-short-length-empire-bridesmaid-dress_120920005.jpg',
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

      ];
      vm.within = "1";
      vm.sexe = "Femme";
      vm.BaseCategory = "evening";
      vm.SubCategory = "dress";
      vm.tags = ["blue", "dress", "evening"];
      vm.size = "L";
      vm.meaning_payment = ["cash", "check", "bank card"];
      vm.brand = "Hermes";
      vm.state = "good";
      vm.description = "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repell";
      vm.start_availble = "3/15/2016";
      vm.end_availble = "6/15/2016";
      vm.date_created = "Creation date";
      vm.date_modified = "Modified date";
      vm.long = "longitude";
      vm.lat = "latttitude";
      vm.price = "42";
      vm.color = "red";
      vm.id_user_ask_for_location = ["one_ask", "two_ask", "three_ask"];
      vm.state_renting = "askeur";
      vm.id_renter = "two_ask";

      //request author profile to get his notation;

      //Put the date min and max
      vm.dateStart = new Date(vm.start_availble);
      vm.dateEnd = new Date(vm.end_availble);

      vm.rentDateStart = new Date(vm.start_availble);
      vm.rentDateEnd = new Date(vm.end_availble);

      // Add col and row for the grid gallery
      vm.obj_url_pictures = [];
      for (var i = 0; i < vm.url_pictures.length; i++) {
        vm.obj_url_pictures[i] = Object();
        vm.obj_url_pictures[i]["col"] = "1";
        vm.obj_url_pictures[i]["row"] = "1";
        vm.obj_url_pictures[i]["url"] = vm.url_pictures[i];

      }

      $log.log("TEST = ", vm.url_pictures);
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


    vm.reply = function () {
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
