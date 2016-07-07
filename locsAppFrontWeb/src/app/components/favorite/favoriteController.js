(function () {

  'use strict';

  angular
    .module('LocsappControllers')
    .controller('FavoriteController', FavoriteController);

  function FavoriteController($log, ArticleService, $state, toastr, URL_API) {
    var vm = this;
    vm.url_api = URL_API;
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
      .then(vm.getArticleFavoriteSuccess, vm.getArticleFavoriteError);

    vm.goToArticlePage = function (id) {
      $state.go("main.articleShow", {"id": id});
    };

    vm.deleteArticleFavoriteSuccess = function (data) {
      $log.log("deleteArticleFavoriteSuccess", data);
      toastr.success("This article has been deleted from your favorite", "Success!");
    };

    vm.deleteArticleFavoriteError = function (data) {
      $log.error("deleteArticleFavoriteError", data);
      toastr.error("There was a problem deleted this article", "Error!");
    };

    vm.deleteArticleFavorite = function (idFavoriteArticle) {

      $log.log("idFavoriteArticle = ", idFavoriteArticle);

      ArticleService
        .deleteArticlesFavorite
        .save({
          "id_favorite_article": idFavoriteArticle
        })
        .$promise
        .then(vm.deleteArticleFavoriteSuccess, vm.deleteArticleFavoriteError)
    };
  }

})();
