(function () {

  'use strict';

  angular
    .module('LocsappControllers')
    .controller('FavoriteController', FavoriteController);

  function FavoriteController($log, $mdDialog, $document, ArticleService, $stateParams,
                              $interval, toastr, ScopesService, URL_API, $sessionStorage, $localStorage, $state) {
    var vm = this;
    vm.limitDescription = 50;

    vm.getArticleFavoriteSuccess = function (data) {
      $log.log("getArticleFavoriteSuccess = ", data);
      vm.favorite_articles = data.favorite_article;
    };

    vm.getArticleFavoriteError = function (data) {
      $log.error("getArticleFavoriteError", data);
    };

    ArticleService
      .articlesFavorite
      .get({})
      .$promise
      .then(vm.getArticleFavoriteSuccess, vm.getArticleFavoriteError)
  }

})();
