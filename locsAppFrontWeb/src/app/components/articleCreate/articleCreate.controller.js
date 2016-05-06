(function () {
  'use strict';

  angular
    .module('LocsappControllers')
    .controller('ArticleCreateController', ArticleCreateController);

  /** @ngInject */
  function ArticleCreateController($log, ArticleService, toastr, $timeout, $mdDialog, $document,
                                   ScopesService) {
    var vm = this;

    /* Get fixtures from cache */
    vm.categories = ScopesService.get("static_collections").base_categories;
    vm.subCategories = ScopesService.get("static_collections").sub_categories;
    vm.genders = ScopesService.get("static_collections").genders;
    vm.sizes = ScopesService.get("static_collections").sizes;
    vm.clothe_colors = ScopesService.get("static_collections").clothe_colors;
    vm.clothe_states = ScopesService.get("static_collections").clothe_states;
    vm.brands = [{_id: "56cb3ef2b2bc57ab2908e6b2", name: "Home made"}];
    vm.payment_methods = ScopesService.get("static_collections").payment_methods;
    //vm.payment_methods = data.payment_methods;
    //$log.log(vm.payment_methods[0]);

    //CheckBox payment
    vm.items_payment_methods = vm.payment_methods;
    vm.selected = [];
    vm.toggle = function (item, list) {
      var idx = list.indexOf(item);
      if (idx > -1) {
        list.splice(idx, 1);
      }
      else {
        list.push(item);
      }
    };
    vm.exists = function (item, list) {
      return list.indexOf(item) > -1;
    };
    vm.isIndeterminate = function () {
      return (vm.selected.length !== 0 &&
      vm.selected.length !== vm.items_payment_methods.length);
    };
    vm.isChecked = function () {
      return vm.selected.length === vm.items_payment_methods.length;
    };
    vm.toggleAll = function () {
      if (vm.selected.length === vm.items_payment_methods.length) {
        vm.selected = [];
      } else if (vm.selected.length === 0 || vm.selected.length > 0) {
        vm.selected = vm.items_payment_methods.slice(0);
      }
    };

    //steps vars
    vm.value = 0;
    vm.stepsNames = ["squared_one", "squared_two", "squared_three", "squared_four", "squared_five", "squared_six"];
    //vm.stepsComplete = [1, 0, 0, 0, 0, 0];
    vm.stepsComplete = [1, 1, 1, 1, 1, 1];

    vm.progressBars = [0, 0, 0, 0, 0, 0];
    vm.stepFocus = 0;

    //Textangular
    vm.toolbar = [['h1', 'h2', 'h3'], ['p', 'bold', 'italics', 'underline'], ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'], ['undo', 'redo', 'clear']];

    //article vars
    //vm.payment_methods = null;
    vm.description = null;
    vm.files = [];
    vm.date_start = new Date();
    vm.date_end = new Date();

    vm.price = 5; //Set minimum price

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


    //Dialog for preview article
    vm.previewArticle = function (event) {
      $mdDialog.show({
        controller: vm.previewArticleController,
        controllerAs: 'previewArticle',
        templateUrl: 'app/templates/dialogTemplates/showArticle.tmpl.html',
        locals: {
          title: vm.title, newArticle: vm.article, description: vm.description,
          date_start: vm.date_start, date_end: vm.date_end, price: vm.price,
          files: vm.files, payment_methods: vm.selected
        },
        bindToController: true,
        parent: angular.element($document.body),
        targetEvent: event,
        clickOutsideToClose: false,
        fullscreen: true
      });
    };

    //Submit the article
    vm.submit = function (event) {

      vm.previewArticle(event);


      //We launch a dialog to preview the article

    };

    //Static collection retrieval
    vm.failedRetrieval = function (data) {
      $log.log(data);
      toastr.error("We couldn't retrieve some informations...", 'Woops...');
    };


    /****
     * Preview Article Controller
     */
    /** @ngInject */
    vm.previewArticleController = function () {

      var vm = this;

      //request author profile to get his notation; We only need the notation so do a special
      // route in the backend will be the best


      //Fill with picture url after send image to the server
      vm.pictures = [];
      //stock only id in payment methods
      vm.payment_methods_id = [];

      vm.rentDateStart = new Date(vm.start_availble);
      vm.rentDateEnd = new Date(vm.end_availble);

      vm.createArticleSuccess = function (data) {
        $log.log("This is a success", data);
      };

      vm.createArticleFailure = function (data) {
        $log.log("this is an error", data);
      };


      vm.closeDialog = function() {
        $mdDialog.cancel();
      };

      vm.createNewArticle = function () {


        vm.uploadImageFailure = function (data) {
          toastr.error(data.error, "Couldn't upload a picture");
          $log.log(data);
        };

        vm.uploadImageSuccess = function (data) {
          vm.pictures.push(data.data.url);
          for (var i = 0; i < vm.payment_methods.length; i++) {
            vm.payment_methods_id.push(vm.payment_methods[i]._id);
          }

          vm.new_start_availble = "";
          if (vm.date_start.getDate() <= 9)
            vm.new_start_availble = vm.new_start_availble.concat("0");
          vm.new_start_availble = vm.new_start_availble.concat(vm.date_start.getDate().toString()).concat("/");
          if (vm.date_start.getMonth() <= 8)
            vm.new_start_availble = vm.new_start_availble.concat("0");
          vm.new_start_availble = vm.new_start_availble.concat((vm.date_start.getMonth() + 1).toString()).concat("/").concat(vm.date_start.getFullYear().toString());


          vm.new_end_availble = "";
          if (vm.date_end.getDate() <= 9)
            vm.new_end_availble = vm.new_end_availble.concat("0");
          vm.new_end_availble = vm.new_end_availble.concat(vm.date_end.getDate().toString()).concat("/");
          if (vm.date_end.getMonth() <= 8)
            vm.new_end_availble = vm.new_end_availble.concat("0");
          vm.new_end_availble = vm.new_end_availble.concat((vm.date_end.getMonth() + 1).toString()).concat("/").concat(vm.date_end.getFullYear().toString());


          ArticleService
            .createArticle
            .save({
              "title": vm.title, "base_category": vm.newArticle.base_category._id,
              "sub_category": vm.newArticle.sub_category._id,
              "gender": vm.newArticle.gender._id, "size": vm.newArticle.size._id,
              "color": vm.newArticle.color._id,
              "clothe_condition": vm.newArticle.clothe_condition._id,
              "brand": vm.newArticle.brand._id, "description": vm.description,
              "price": vm.price,
              "payment_methods": vm.payment_methods_id,
              "availibility_start": vm.new_start_availble,
              "availibility_end": vm.new_end_availble,
              "url_pictures": vm.pictures,
              "url_thumbnail": vm.pictures[0]

              /* "location": "toto"*/
            })
            .$promise
            .then(vm.createArticleSuccess, vm.createArticleFailure);
        };


        //Upload the pictures
        vm.submitPictures = function () {
          for (var i = 0; i < vm.files.length; i++) {
            ArticleService
              .uploadPicture(vm.files[i])
              .then(vm.uploadImageSuccess, vm.uploadImageFailure);
          }
        };

        //For upload the pictures
        vm.submitPictures();


      }

    }
  }
})();
