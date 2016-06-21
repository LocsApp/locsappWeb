(function () {

  'use strict';

  angular
    .module('LocsappControllers')
    .controller('ArticleQuestionsController', ArticleQuestionsController);

  /** @ngInject */
  function ArticleQuestionsController($log, ArticleService, toastr, ScopesService, URL_API) {
    var vm = this;
    vm.questions = "";
/*

    vm.GetArticleWitQuestionToAnswerSuccess = function (data) {
      $log.log("ArticleWitQuestionToAnswerSuccess", data);
      //vm.questions = data.questions;
      //$log.log("Vm questions = ", vm.questions);
    };

    vm.GetArticleWitQuestionToAnswerFailure = function (data) {
      $log.error("ArticleWitQuestionToAnswerFailure", data)
    };

    ArticleService
      .articleWithQuestionToAnswer
      .get({})
      .$promise
      .then(vm.GetArticleWitQuestionToAnswerSuccess, vm.GetArticleWitQuestionToAnswerFailure);

*/

    /* ArticleWithQuestionUserAsked */
     vm.GetArticleWithQuestionUserAskedSuccess = function (data) {
      $log.log("ArrticleWithQuestionUserAskedSuccess", data);
       vm.articlesWithQuestionUserAsked = data.articles;
      //vm.questions = data.questions;
      //$log.log("Vm questions = ", vm.questions);
    };

    vm.GetArticleWithQuestionUserAskedFailure = function (data) {
      $log.error("ArticleWithQuestionUserAskedFailure", data)
    };

    ArticleService
      .articleWithQuestionUserAsked
      .get({})
      .$promise
      .then(vm.GetArticleWithQuestionUserAskedSuccess, vm.GetArticleWithQuestionUserAskedFailure)

  }

})();
