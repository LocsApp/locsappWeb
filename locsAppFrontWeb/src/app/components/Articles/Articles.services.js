(function () {

  'use strict';

  angular
    .module('LocsappServices')
    .factory('ArticleService', ArticleService);

  /** @ngInject */
  function ArticleService($log, $resource, URL_API, $sessionStorage, $localStorage, Upload) {

    var service = {

      getArticle: $resource(URL_API + 'api/v1/articles/get/:id/', {id: "@article_id"}),
      getCategories: $resource(URL_API + 'api/v1/static-collections/base-categories/'
        , {}, {
          cache: true,
          method: 'GET'
        }),
      getSubCategories: $resource(URL_API + 'api/v1/static-collections/sub-categories/'),
      getGenders: $resource(URL_API + 'api/v1/static-collections/genders/'),
      getSizes: $resource(URL_API + 'api/v1/static-collections/sizes/'),
      getClotheColors: $resource(URL_API + 'api/v1/static-collections/clothe-colors/'),
      getClotheStates: $resource(URL_API + 'api/v1/static-collections/clothe-states/'),
      getPaymentMethods: $resource(URL_API + 'api/v1/static-collections/payment-methods/'),
      createArticle: $resource(URL_API + 'api/v1/articles/create/'),
      searchArticles: $resource(URL_API + 'api/v1/search/articles/'),
      getSeller: $resource(URL_API + 'api/v1/articles/seller/:id/', {id: "@user_id"}),
      sendReportArticle: $resource(URL_API + 'api/v1/articles/report/'),
      demands: $resource(URL_API + 'api/v1/articles/demands/'),
      demandsAsRenting: $resource(URL_API + 'api/v1/articles/demands-as-renting/'),
      refuseDemand: $resource(URL_API + 'api/v1/articles/refuse-demand/'),
      retractDemand: $resource(URL_API + 'api/v1/articles/retract-demand/'),
      acceptDemand: $resource(URL_API + 'api/v1/articles/accept-demand/'),
      currentTimelines: $resource(URL_API + 'api/v1/articles/current-timelines/'),
      currentTimelinesAsRenting: $resource(URL_API + 'api/v1/articles/current-timelines-as-renting/'),

      questions: $resource(URL_API + 'api/v1/articles/questions/'),
      answers: $resource(URL_API + 'api/v1/articles/answers/'),
      upVote: $resource(URL_API + 'api/v1/articles/upvote/'),
      reportQuestion: $resource(URL_API + 'api/v1/articles/report-question/'),
      articleWithQuestionToAnswer: $resource(URL_API + 'api/v1/articles/articles-with-question-to-answer/'),
      articleWithQuestionUserAsked: $resource(URL_API + 'api/v1/articles/articles-with-question-asked/'),

      getArticlesFavorite: $resource(URL_API + 'api/v1/favorites/articles/:id_page/',
        {id_page: "id_page"}),
      addArticlesFavorite: $resource(URL_API + 'api/v1/favorites/add-articles/'),
      deleteArticlesFavorite: $resource(URL_API + 'api/v1/favorites/delete-articles/'),


      giveMark: $resource(URL_API + 'api/v1/articles/give-mark/'),
      getPendingMarksForClients: $resource(URL_API + 'api/v1/articles/get-pending-marks-for-clients/'),
      getPendingMarksForRenters: $resource(URL_API + 'api/v1/articles/get-pending-marks-for-renters/'),
      uploadPicture: uploadPicture,
      is_authenticated: is_authenticated
    };

    return service;

    function uploadPicture(file) {
      return (Upload.upload({
        url: URL_API + 'api/v1/articles/image-upload-article/',
        data: {file: file}
      }));
    }

    function is_authenticated() {
      return ($sessionStorage.key || $localStorage.key) ? true : false;
    }
  }

})();
