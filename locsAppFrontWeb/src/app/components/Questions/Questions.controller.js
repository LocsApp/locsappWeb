(function () {

  'use strict';

  angular
    .module('LocsappControllers')
    .controller('QuestionsController', QuestionsController);

  /** @ngInject */
  function QuestionsController($log, ArticleService, $state, URL_API) {
    var vm = this;
    vm.current_page_questions_user_asked = 1;
    vm.current_page_questions_to_answer = 1;
    vm.page_size = 10;
    vm.url_api = URL_API;
    vm.limitDescription = 50;
    vm.questions = "";


    vm.GetArticleWitQuestionToAnswerSuccess = function (data) {
      vm.articlesWithQuestionsToAnswer = data.articles;
      vm.nb_items_questions_to_answer = data.nb_page * vm.page_size;
      vm.nb_page_questions_to_answer = data.nb_page;
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
      vm.nb_items_questions_user_asked = data.nb_page * vm.page_size;
      vm.nb_page_questions_user_asked = data.nb_page;
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
    };


      /* Start Action Pagination Questions user asked */

    vm.goToPageQuestionsUserAsked = function (currentPage) {

      vm.animatePagination = 'animate-pagination';
      //$log.log("currentPage = ", currentPage);
      ArticleService
        .getArticlesFavorite
        .get({id_page: currentPage})
        .$promise
        .then(vm.GetArticleWithQuestionUserAskedFailure, vm.GetArticleWithQuestionUserAskedFailure);
    };

    vm.prevOrNextPageQuestionsUserAsked = function (idPage) {

      vm.animatePagination = 'animate-pagination';
      vm.current_page_client = idPage;
      ArticleService
        .getArticlesFavorite
        .get({id_page: idPage})
        .$promise
        .then(vm.GetArticleWithQuestionUserAskedFailure, vm.GetArticleWithQuestionUserAskedFailure);

    };

    /* End  Action Pagination Questions user asked */


    /* Start Action Pagination Questions user has to answer */

    vm.goToPageQuestionsToAnswer  = function (currentPage) {

      vm.animatePagination = 'animate-pagination';
      //$log.log("currentPage = ", currentPage);
      ArticleService
        .getArticlesFavorite
        .get({id_page: currentPage})
        .$promise
        .then(vm.GetArticleWitQuestionToAnswerSuccess, vm.GetArticleWitQuestionToAnswerFailure);
    };

    vm.prevOrNextPageQuestionsToAnswer = function (idPage) {

      vm.animatePagination = 'animate-pagination';
      vm.current_page_client = idPage;
      ArticleService
        .getArticlesFavorite
        .get({id_page: idPage})
        .$promise
        .then(vm.GetArticleWitQuestionToAnswerSuccess, vm.GetArticleWitQuestionToAnswerFailure);

    };

    /* End  Action Pagination Questions has to answer */

  }


})();
