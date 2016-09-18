(function () {
  'use strict';

  angular
    .module('locsapp')
    .factory('TokenAuthInterceptor', TokenAuthInterceptor);

  TokenAuthInterceptor.$inject = ['$sessionStorage', '$localStorage', '$q'];

  function TokenAuthInterceptor($sessionStorage, $localStorage, $q) {
    return {
      request: function (config) {
        config.headers = config.headers || {};
        if ($localStorage.key)
          config.headers.Authorization = 'Token ' + $localStorage.key;
        else if ($sessionStorage.key)
          config.headers.Authorization = 'Token ' + $sessionStorage.key;
        return config || $q.when(config);
      },
      response: function (response) {
        return response || $q.when(response);
      }
    };
  }

  angular
    .module('locsapp')
    .config(config);

  /** @ngInject */
  function config($logProvider, toastrConfig, $locationProvider, $httpProvider, $resourceProvider,
                  cfpLoadingBarProvider, ezfbProvider, $translateProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';

    //Configuring of html5 routes
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');

    //CSRF token sending automation
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

    //Call of TokenAuthInterceptor for Authorization header sending automation
    $httpProvider.interceptors.push('TokenAuthInterceptor');

    //Prevent resource from stripping the / on requests (Django stuff)
    $resourceProvider.defaults.stripTrailingSlashes = false;

    //Sets the angular-loading-bar settings
    cfpLoadingBarProvider.selector = '#loading-bar-container';
    cfpLoadingBarProvider.includeSpinner = false;

    //Sets the Facebook local
    ezfbProvider.setLocale('fr_FR');


    ezfbProvider.setInitParams({
      appId: '1011661268854723',

      // Module default is `v2.4`.
      // If you want to use Facebook platform `v2.3`, you'll have to add the following parameter.
      // https://developers.facebook.com/docs/javascript/reference/FB.init
      version: 'v2.5'
    });


    /* English translation */
    $translateProvider.translations('en', {
      /* The navbar */
      'SEARCH': 'Search',
      'CREATE_ARTICLE': 'Create an article',

      'MY_ARTICLES': 'My articles',
      'CURRENT_REQUESTS': 'Current requests',
      'CURRENT_ARTICLES': 'Current articles',
      'TIMELINE': 'Timeline',
      'NOTATION': 'Notation',

      'MY_QUESTIONS': 'My questions',
      'QUESTIONS_I_HAVE_ASEKD': 'Questions I have asked',
      'QUESTIONS_TO_ANSWER': 'Questions to answer',

      'MY_BOOKMARKS': 'My bookmarks',
      'MY_SEARCHES': 'My searches',

      'MY_ACCOUNT': 'My account',
      'MY_INFORMATIONS': 'My informations',
      'EDIT_PROFILE': 'Edit my profile',
      'HISTORY_NOTATION': 'History notation',
      'HISTORY_ARTICLE': 'History article',

      'LOGOUT': 'Log out'
    });

    /* French translation */
    $translateProvider.translations('fr', {
      /* The navbar */
      'SEARCH': 'Recherche',
      'CREATE_ARTICLE': 'Créer un article',

      'MY_ARTICLES': 'Mes articles',
      'CURRENT_REQUESTS': 'Requêtes en cours',
      'CURRENT_ARTICLES': 'Article en cours',
      'TIMELINE': 'Timeline',
      'NOTATION': 'Notation',

      'MY_QUESTIONS': 'Mes questions',
      'QUESTIONS_I_HAVE_ASKED': 'Questions que j\'ai posées',
      'QUESTIONS_TO_ANSWER': 'Questions à répondre',

      'MY_BOOKMARKS': 'Mes favoris',
      'MY_SEARCHES': 'Mes recherches',

      'MY_ACCOUNT': 'Mon compte',
      'MY_INFORMATIONS': 'Mes informations',
      'EDIT_PROFILE': 'Editer mon profile',
      'HISTORY_NOTATION': 'Historique des notations',
      'HISTORY_ARTICLE': 'Historique des articles',

      'LOGOUT': 'Déconnexion'

    });

    /* Default translation */
    $translateProvider.preferredLanguage('fr');

  }

})();
