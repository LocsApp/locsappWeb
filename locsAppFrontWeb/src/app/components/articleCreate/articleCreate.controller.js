(function () {
  'use strict';

  angular
    .module('LocsappControllers')
    .controller('ArticleCreateController', ArticleCreateController);

  /** @ngInject */
  function ArticleCreateController($log, ArticleService, toastr, $scope, $timeout, $mdDialog, $document) {
    var vm = this;

    //steps vars
    vm.value = 0;
    vm.stepsNames = ["squared_one", "squared_two", "squared_three", "squared_four", "squared_five", "squared_six"];
    vm.stepsComplete = [1, 1, 1, 1, 1, 1];
    vm.progressBars = [0, 0, 0, 0, 0, 0];
    vm.stepFocus = 0;

    //Textangular
    vm.toolbar = [['h1', 'h2', 'h3'], ['p', 'bold', 'italics', 'underline'], ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'], ['undo', 'redo', 'clear']];

    //article vars
    vm.categories = null;
    vm.subCategories = null;
    vm.genders = null;
    vm.sizes = null;
    vm.clothe_colors = null;
    vm.clothe_states = null;
    vm.payment_methods = null;
    vm.description = null;
    vm.brands = [{_id: "56cb3ef2b2bc57ab2908e6b2", name: "Home made"}];
    vm.pictures = [];
    vm.files = [];
    vm.date_start = new Date();
    vm.date_end = new Date();

    // misc vars
    vm.min_date = new Date();

    //user chose
    vm.article = {
      "base_category": ""
    };

    //Validates and changes to the next step
    vm.nextStep = function (focus) {
      vm.stepsComplete[focus] = 1;
      vm.progressBars[focus - 1] = 100;
      $timeout(function () {
        vm.stepFocus = focus;
      }, 100);
    };

    vm.uploadImageFailure = function (data) {
      toastr.error(data.error, "Couldn't upload a picture");
      $log.log(data);
    };

    vm.uploadImageSuccess = function (data) {
      vm.pictures.push(data.url);
    };

    //Upload the pictures
    vm.submitPictures = function () {
      for (var i = 0; i < vm.files.length; i++) {
        ArticleService
          .uploadPicture(vm.files[i])
          .then(vm.uploadImageSuccess, vm.uploadImageFailure);
      }
    };


    //Dialog for preview article
    vm.previewArticle = function (event) {
      $mdDialog.show({
        controller: vm.previewArticleController,
        controllerAs: 'previewArticle',
        templateUrl: 'app/templates/dialogTemplates/showArticle.tmpl.html',
        //locals: {user_id: vm.user.id, address: address, type: type},
        bindToController: true,
        parent: angular.element($document.body),
        targetEvent: event,
        clickOutsideToClose: false,
        fullscreen: true
      });
    };

    //Submit the article
    vm.submit = function (event) {
      //For upload the pictures
      vm.submitPictures();
      vm.previewArticle(event);


      //We launch a dialog to preview the article

    };

    //Static collection retrieval
    vm.failedRetrieval = function (data) {
      $log.log(data);
      toastr.error("We couldn't retrieve some informations...", 'Woops...');
    };

    vm.getClotheStates = function (data) {
      vm.clothe_states = data.clothe_states;
    };

    vm.getClotheColors = function (data) {
      vm.clothe_colors = data.clothe_colors;
      ArticleService
        .getClotheStates
        .get()
        .$promise
        .then(vm.getClotheStates, vm.failedRetrieval);
    };

    vm.getSizes = function (data) {
      vm.sizes = data.sizes;
      ArticleService
        .getClotheColors
        .get()
        .$promise
        .then(vm.getClotheColors, vm.failedRetrieval);
    };

    vm.getGenders = function (data) {
      vm.genders = data.genders;
      ArticleService
        .getSizes
        .get()
        .$promise
        .then(vm.getSizes, vm.failedRetrieval);
    };

    vm.getSubCategories = function (data) {
      vm.subCategories = data.sub_categories;
      ArticleService
        .getGenders
        .get()
        .$promise
        .then(vm.getGenders, vm.failedRetrieval);
    };

    vm.getCategories = function (data) {
      vm.categories = data.base_categories;
      ArticleService
        .getSubCategories
        .get()
        .$promise
        .then(vm.getSubCategories, vm.failedRetrieval);
    };

    ArticleService
      .getCategories
      .get()
      .$promise
      .then(vm.getCategories, vm.failedRetrieval);
    //End of Static collection retrieval


    /****
     * Preview Article Controller
     */
    /** @ngInject */
    vm.previewArticleController = function () {

      $log.log("in controller preview article");

      var vm = this;
      //vm.showChildComment = false;
      vm.test_test = ['un', 'deux', 'trois'];
      vm.items = ['../assets/images/users/profile_picture/160281_3_photo_781124_899A08_BD_3.jpg',
        '../assets/images/users/profile_picture/160281_3_photo_781124_899A08_BD_3.jpg'];

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

        //Le back renvoie du plus grand au plus petit et uniquement les trois premieres questions
        vm.questions = [

          {
            "_id": "56cb3cb1b2bc57ab2908e697",
            "id_author": 42,
            "username_author": "locsapp",
            "content": "What is the breast size ? ",
            "is_visible": true,
            "is_useful": ["sdsgdsgs46887", "sdfdsgsdgds6465464", "sdfdsgsdgds646546478"],
            "date_created": "fausse date",
            "date_modified": "fausse date",
            "response": {
              "_id": "56cb3cb1b2bc57ab2908e698",
              "id_author": 44,
              "username_author": "sylflo",
              "content": "The breast size 95C",
              "is_visible": true,
              "date_created": "fausse date",
              "date_modified": "fausse date"
            },
            "last_versions": [],
            "flagged": null
          },

          {
            "_id": "56cb3cb1b2bc57ab2908e697",
            "id_author": 42,
            "username_author": "locsapp",
            "content": "What is the breast size ? ",
            "is_visible": true,
            "is_useful": ["sdsgdsgs46887"],
            "date_created": "fausse date",
            "date_modified": "fausse date",
            "response": {
              "_id": "56cb3cb1b2bc57ab2908e698",
              "id_author": 44,
              "username_author": "sylflo",
              "content": "The breast size 95C",
              "is_visible": true,
              "date_created": "fausse date",
              "date_modified": "fausse date"
            },
            "last_versions": [],
            "flagged": null
          },
          {
            "_id": "56cb3cb1b2bc57ab2908e697",
            "id_author": 42,
            "username_author": "locsapp",
            "content": "What is the breast size ? ",
            "is_visible": true,
            "is_useful": ["sdsgdsgs46887"],
            "date_created": "fausse date",
            "date_modified": "fausse date",
            "response": {
              "_id": "56cb3cb1b2bc57ab2908e698",
              "id_author": 44,
              "username_author": "sylflo",
              "content": "The breast size 95C",
              "is_visible": true,
              "date_created": "fausse date",
              "date_modified": "fausse date"
            },
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

    }
  }
})();
