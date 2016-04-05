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
        locals: {title: vm.title, newArticle: vm.article},
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
      $log.log("vm == ", vm);
      //vm.showChildComment = false;

      //request author profile to get his notation;

      //Put the date min and max
      vm.dateStart = new Date(vm.start_availble);
      vm.dateEnd = new Date(vm.end_availble);

      vm.rentDateStart = new Date(vm.start_availble);
      vm.rentDateEnd = new Date(vm.end_availble);

    }
  }
})();
