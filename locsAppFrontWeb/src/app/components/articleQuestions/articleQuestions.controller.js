(function(){

  'use strict';

   angular
    .module('LocsappControllers')
    .controller('ArticleQuestionsController', ArticleQuestionsController);

  /** @ngInject */
  function ArticleQuestionsController($log, ArticleService, toastr, ScopesService, URL_API) {
    var vm = this;
    vm.questions = "";

   vm.GetQuestionsSuccess = function(data) {
      vm.questions = data.questions;
    };

    vm.GetQuestionsFailure = function(data) {
      $log.log("GetQuestionFailure", data)
    };

    ArticleService
      .questions
      .get({})
      .$promise
      .then(vm.GetQuestionsSuccess, vm.GetQuestionsFailure);

  }

})();
