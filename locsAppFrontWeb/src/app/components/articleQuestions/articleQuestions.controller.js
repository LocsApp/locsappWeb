(function(){

  'use strict';

   angular
    .module('LocsappControllers')
    .controller('ArticleQuestionController', ArticleQuestionController);

  /** @ngInject */
  function ArticleQuestionController($log, ArticleService, toastr, ScopesService, URL_API) {
    var vm = this;

    vm.notationsClient = true;
    vm.notationsRenter = true;

    vm.url_api = URL_API;

  }

});
