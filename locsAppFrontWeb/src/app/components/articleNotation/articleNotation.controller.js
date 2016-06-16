(function () {

  'use strict';

  angular
    .module('LocsappControllers')
    .controller('ArticleNotationController', ArticleNotationController);

  /** @ngInject */
  function ArticleNotationController($log, ArticleService, toastr, ScopesService, URL_API) {
    var vm = this;

    vm.notationsClient = true;
    vm.notationsRenter = true;

    vm.url_api = URL_API;

  }

})();