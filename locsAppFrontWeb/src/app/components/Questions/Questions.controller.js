(function () {

  'use strict';

  angular
    .module('LocsappControllers')
    .controller('QuestionsController', QuestionsController);

  /** @ngInject */
  function QuestionsController($log, ArticleService, $state, URL_API) {
    var vm = this;
    vm.url_api = URL_API;
    vm.limitDescription = 50;
    vm.questions = "";


    vm.GetArticleWitQuestionToAnswerSuccess = function (data) {
      vm.articlesWithQuestionsToAnswer = data.articles;
    };

    vm.GetArticleWitQuestionToAnswerFailure = function (data) {
      $log.error("ArticleWitQuestionToAnswerFailure", data)
    };

    ArticleService
      .articleWithQuestionToAnswer
      .get({"id_page": 1})
      .$promise
      .then(vm.GetArticleWitQuestionToAnswerSuccess, vm.GetArticleWitQuestionToAnswerFailure);


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
      .get({"id_page": 1})
      .$promise
      .then(vm.GetArticleWithQuestionUserAskedSuccess, vm.GetArticleWithQuestionUserAskedFailure)

    vm.goToArticlePage = function (id) {
      $state.go("main.articleShow", {"id": id});
    }

  }


})();
