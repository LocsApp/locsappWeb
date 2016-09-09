(function () {

  'use strict';

  angular
    .module('LocsappControllers')
    .controller('FavoriteController', FavoriteController);

  /** @ngInject */
  function FavoriteController($log, ArticleService, $state, toastr, URL_API, $document,
                              $mdDialog) {
    var vm = this;
    vm.current_page_favorite_article = 1;
    vm.page_size = 10;
    vm.url_api = URL_API;
    vm.limitDescription = 50;
    vm.limitTitle = 5;

     vm.getArticleFavorite = function () {
      vm.getArticleFavoriteSuccess = function (data) {
        $log.log("getArticleFavoriteSuccess = ", data);
        vm.favorite_articles = data.favorite_article;
        vm.nb_items_favorite_article = data.nb_page * vm.page_size;
        vm.nb_page_favorite_article = data.nb_page;
      };

      vm.getArticleFavoriteError = function (data) {
        $log.error("getArticleFavoriteError", data);
      };

      ArticleService
        .getArticlesFavorite
        .get({"id_page": vm.current_page_favorite_article})
        .$promise
        .then(vm.getArticleFavoriteSuccess, vm.getArticleFavoriteError);

    };

    vm.getArticleFavorite();

    vm.goToArticlePage = function (id) {
      $state.go("main.articleShow", {"id": id});
    };


    /* Action Pagination Favorite Article */

    vm.goToPageArticleFavorite = function (currentPage) {

      vm.animatePagination = 'animate-pagination';
      //$log.log("currentPage = ", currentPage);
      ArticleService
        .getArticlesFavorite
        .get({id_page: currentPage})
        .$promise
        .then(vm.getArticleFavoriteSuccess, vm.getArticleFavoriteError);
    };

    vm.prevOrNextPageArticleFavorite = function (idPage) {

      vm.animatePagination = 'animate-pagination';
      vm.current_page_client = idPage;
      ArticleService
        .getArticlesFavorite
        .get({id_page: idPage})
        .$promise
        .then(vm.getArticleFavoriteSuccess, vm.getArticleFavoriteError);

    };

    /* End Action Pagination Favorite Article */


    /* Start dialog confirm delete favorite article */
    /** @ngInject */
    vm.deleteFavoriteArticleDialog = function (event, id_article_favorite, current_page) {
      $mdDialog.show({
        controller: vm.deleteFavoriteArticleController,
        controllerAs: 'deleteFavoriteArticle',
        templateUrl: 'app/templates/dialogTemplates/confirmDeleteFavoriteArticle.tmpl.html',
        locals: {id_article_favorite: id_article_favorite, current_page: current_page},
        bindToController: true,
        parent: angular.element($document.body),
        targetEvent: event,
        clickOutsideToClose: true
      }).then(function () {

       vm.getArticleFavorite();
      });
    };
    /* End dialog confirm delete favorite article */


    /* Start deleteFavoriteArticleController Controller*/
    /** @ngInject */
    vm.deleteFavoriteArticleController = function ($mdDialog, id_article_favorite, current_page) {
      var vm = this;
      vm.id_article_favorite = id_article_favorite;
      vm.current_page = current_page;

      /* Call delete function favorite */
      vm.accepted = function () {

        vm.deleteArticleFavoriteSuccess = function (data) {
          $log.log("deleteArticleFavoriteSuccess", data);

          toastr.success("This article has been deleted from your favorite", "Success!");
          vm.hide();
        };

        vm.deleteArticleFavoriteError = function (data) {
          $log.error("deleteArticleFavoriteError", data);
          toastr.error("There was a problem deleted this article", "Error!");
          vm.hide();
        };


        $log.log("idFavoriteArticle = ", vm.id_article_favorite);

        ArticleService
          .deleteArticlesFavorite
          .save({
            "id_favorite_article": vm.id_article_favorite
          })
          .$promise
          .then(vm.deleteArticleFavoriteSuccess, vm.deleteArticleFavoriteError)
      };

      /*Hide callback for $mdDialog*/
      vm.hide = function () {

        $mdDialog.hide(vm.user);
      };
    };
    /* End deleteFavoriteArticleController Controller*/



  }

})();
