(function () {

  'use strict';

  angular
    .module('LocsappControllers')
    .controller('FavoriteController', FavoriteController);

  function FavoriteController($log, ArticleService, $state, toastr, URL_API) {
    var vm = this;
    vm.current_page_favorite = 1;
    vm.current_page_search = 1;
    vm.page_size = 10;
    vm.url_api = URL_API;
    vm.limitDescription = 50;

    vm.getArticleFavoriteSuccess = function (data) {
      $log.log("getArticleFavoriteSuccess = ", data);
      vm.favorite_articles = data.favorite_article;
      vm.nb_items_favorite = data.nb_page * vm.page_size;
      vm.nb_page_favorite = data.nb_page;
    };

    vm.getArticleFavoriteError = function (data) {
      $log.error("getArticleFavoriteError", data);
    };

    ArticleService
      .getArticlesFavorite
      .get({"id_page": vm.current_page_favorite})
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


        /* Action Pagination Favorite */

    vm.goToPageFavorite = function (currentPage) {

      vm.animatePagination = 'animate-pagination';
      //$log.log("currentPage = ", currentPage);
      ArticleService
        .getArticlesFavorite
        .get({id_page: currentPage})
        .$promise
        .then(vm.getArticleFavoriteSuccess, vm.getArticleFavoriteError);
    };

    vm.prevOrNextPageClient = function (idPage) {

      vm.animatePagination = 'animate-pagination';
      vm.current_page_client = idPage;
      ArticleService
        .getArticlesFavorite
        .get({id_page: idPage})
        .$promise
        .then(vm.getArticleFavoriteSuccess, vm.getArticleFavoriteError);

    };

    /* End Action Pagination Favorite */
  }

})();
