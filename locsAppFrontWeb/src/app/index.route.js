(function () {
  'use strict';

  angular
    .module('locsapp')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('main', {
        abstract: true,
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      /*	.state('main.homepage', {
       url: '',
       parent: 'main',
       templateUrl: 'app/templates/home/home.html',
       data: {
       permissions: {
       only: ['guest', 'user'],
       redirectTo: 'main.homepage'
       }
       }
       })*/

      .state('main.homepage', {
        url: '',
        parent: 'main',
        templateUrl: 'app/templates/articleSearch/articleSearch.html',
        controller: 'ArticleSearchController',
        controllerAs: 'articleSearch',
        data: {
          permissions: {
            only: ['guest', 'user'],
            redirectTo: 'main.homepage'
          }
        }
      })

      .state('main.verify-email', {
        url: 'verify-email/:key',
        parent: 'main',
        controller: 'VerifyEmailController',
        controllerAs: 'verifyEmail',
        data: {
          permissions: {
            only: ['guest', 'user'],
            redirectTo: 'main.homepage'
          }
        }
      })
      .state('main.password-reset', {
        url: 'password-reset/:uid/:token',
        parent: 'main',
        templateUrl: 'app/templates/passwordReset/passwordReset.html',
        controller: 'PasswordResetController',
        controllerAs: 'passwordReset',
        data: {
          permissions: {
            only: ['guest'],
            redirectTo: 'main.homepage'
          }
        }
      })
      .state('main.login', {
        url: 'login',
        parent: 'main',
        templateUrl: 'app/templates/login/login.html',
        controller: 'LoginController',
        controllerAs: 'login',
        data: {
          permissions: {
            only: ['guest'],
            redirectTo: 'main.homepage'
          }
        }
      })
      .state('main.logout', {
        url: 'logout',
        parent: 'main',
        controller: 'LogoutController',
        controllerAs: 'logout',
        data: {
          permissions: {
            only: ['user'],
            redirectTo: 'main.homepage'
          }
        }
      })
      .state('main.public_user_profile', {
        url: 'public_profile',
        parent: 'main',
        controller: 'PublicProfileController',
        controllerAs: 'publicProfile',
        templateUrl: 'app/templates/userProfile/public_user_profile.html',
        data: {
          permissions: {
            only: ['guest', 'user'],
            redirectTo: 'main.homepage'
          }
        }
      })
      .state('main.user_profile', {
        url: 'profile',
        parent: 'main',
        controller: 'ProfileController',
        controllerAs: 'profile',
        templateUrl: 'app/templates/userProfile/user_profile.html',
        data: {
          permissions: {
            only: ['user'],
            redirectTo: 'main.homepage'
          }
        }
      })
      .state('main.profile_management', {
        url: 'profile-parameters',
        parent: 'main',
        controller: 'ProfileParamsController',
        controllerAs: 'profileParams',
        redirectTo: 'main.profile_management.default',
        templateUrl: 'app/templates/userProfileParameters/user_profile_parameters.html',
        data: {
          permissions: {
            only: ['user'],
            redirectTo: 'main.homepage'
          }
        }
      })
      .state('main.profile_management.default', {
        url: '/informations',
        templateUrl: 'app/templates/userProfileParameters/Menu_Tabs/user_profile_parameters_informations.html',
        data: {
          permissions: {
            only: ['user'],
            redirectTo: 'main.homepage'
          }
        }
      })
      .state('main.profile_management.emails', {
        url: '/emails',
        templateUrl: 'app/templates/userProfileParameters/Menu_Tabs/user_profile_parameters_emails.html',
        data: {
          permissions: {
            only: ['user'],
            redirectTo: 'main.homepage'
          }
        }
      })
      .state('main.profile_management.change_password', {
        url: '/change-password',
        parent: 'main.profile_management',
        templateUrl: 'app/templates/userProfileParameters/Menu_Tabs/user_profile_parameters_change_password.html',
        data: {
          permissions: {
            only: ['user'],
            redirectTo: 'main.homepage'
          }
        }
      })
      .state('main.register', {
        url: 'register',
        parent: 'main',
        templateUrl: 'app/templates/register/register.html',
        controller: 'RegisterController',
        controllerAs: 'register',
        data: {
          permissions: {
            only: ['guest'],
            redirectTo: 'main.homepage'
          }
        }
      })
      /*.state('main.article_search', {
        url: 'search-article/',
        parent: 'main',
        templateUrl: 'app/templates/articleSearch/articleSearch.html',
        controller: 'ArticleSearchController',
        controllerAs: 'articleSearch',
        data: {
          permissions: {
            only: ['guest', 'user'],
            redirectTo: 'main.homepage'
          }
        }
      })*/
      .state('main.articleShow', {
        url: 'article/:id',
        parent: 'main',
        templateUrl: 'app/templates/articleShow/articleShow.html',
        controller: 'ArticleShowController',
        controllerAs: 'articleShow',
        data: {
          permissions: {
            only: ['guest', 'user'],
            redirectTo: 'main.homepage'
          }
        }
      })

      .state('main.articleEdit', {
        url: 'article-edit/:id',
        parent: 'main',
        templateUrl: 'app/templates/articleEdit/articleEdit.html',
        controller: 'ArticleEditController',
        controllerAs: 'articleEdit',
        data: {
          permissions: {
            only: ['user'],
            redirectTo: 'main.homepage'
          }
        }
      })

      .state('main.article_requests', {
        url: 'my-requests/',
        parent: 'main',
        templateUrl: 'app/templates/articleRequests/articleRequests.html',
        controller: 'ArticleRequestsController',
        controllerAs: 'articleRequests',
        data: {
          permissions: {
            only: ['user'],
            redirectTo: 'main.homepage'
          }
        }
      })

      .state('main.article_timelines', {
        url: 'my-timelines/',
        parent: 'main',
        templateUrl: 'app/templates/articleTimeline/articleTimeline.html',
        controller: 'ArticleTimelinesController',
        controllerAs: 'articleTimeline',
        data: {
          permissions: {
            only: ['user'],
            redirectTo: 'main.homepage'
          }
        }
      })

      .state('main.article_notations', {
        url: 'notations/',
        parent: 'main',
        templateUrl: 'app/templates/articleNotation/articleNotation.html',
        controller: 'ArticleNotationController',
        controllerAs: 'articleNotation',
        data: {
          permissions: {
            only: ['user'],
            redirectTo: 'main.homepage'
          }
        }
      })

      .state('main.article_create', {
        url: 'create-article/',
        parent: 'main',
        templateUrl: 'app/templates/articleCreate/articleCreate.html',
        controller: 'ArticleCreateController',
        controllerAs: 'articleCreate',
        data: {
          permissions: {
            only: ['user'],
            redirectTo: 'main.homepage'
          }
        }
      })


      .state('main.questions', {
        url: 'questions/',
        parent: 'main',
        templateUrl: 'app/templates/questions/questions.html',
        controller: 'QuestionsController',
        controllerAs: 'questions',
        data: {
          permissions: {
            only: ['user'],
            redirectTo: 'main.homepage'
          }
        }
      })

      .state('main.history_notations', {
        url: 'history-notations/',
        parent: 'main',
        templateUrl: 'app/templates/historyNotations/historyNotations.html',
        controller: 'HistoryNotationController',
        controllerAs: 'historyNotation',
        data: {
          permissions: {
            only: ['user'],
            redirectTo: 'main.homepage'
          }
        }
      })

      .state('main.history_articles', {
        url: 'history-articles/',
        parent: 'main',
        templateUrl: 'app/templates/historyArticles/historyArticles.html',
        controller: 'HistoryArticleController',
        controllerAs: 'historyArticles',
        data: {
          permissions: {
            only: ['user'],
            redirectTo: 'main.homepage'
          }
        }
      })

      .state('main.favorites', {
        url: 'favorites/',
        parent: 'main',
        templateUrl: 'app/templates/favorite/favorite.html',
        controller: 'FavoriteController',
        controllerAs: 'favorite',
        data: {
          permissions: {
            only: ['user'],
            redirectTo: 'main.homepage'
          }
        }
      })


    ;

    $urlRouterProvider.otherwise(function ($injector) {
      var $state = $injector.get("$state");
      $state.go('main.homepage');
    });
  }

})();
