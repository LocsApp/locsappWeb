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

      /* Genereal */
      'SHOW_MORE': 'Show more',
      'HAS_NO_NOTATION': 'has no notation',
      'NOT_SPECIFIED': 'Not specified',
      'UNKNOWN': 'unknown',
      'ARTICLES': 'Articles',
      'SEND': 'send',
      'MAN': 'man',
      'WOMAN': 'woman',
      'FIRST_NAME': 'First name',
      'LAST_NAME': 'Last name',
      'PHONE_NUMBER': 'Phone number',
      'EMAIL': 'email',
      'REPEAT_EMAIL': 'Repeat email',
      'THE_MASCULINE': 'Le',
      'THE_FEMININE': 'La',
      'ADD': 'Ajout',

      /* Error form */
      'THIS_IS_REQUIRED': 'Champ obligatoire',
      'MUST_BE_LONGER_THAN_FIVE': 'must be longer than 5 characters',
      'MUST_BE_SHORTER_THAN_TWENTY': 'must be shorter than 20 characters',
      'INCORRECT_PHONE_NUMBER': 'Phone number is incorrect',
      'BIRTHDATE_SHOULD_BE': 'Birthdate should be yyyy/mm/dd',
      'MUST_BE_AN_EMAIL': 'The field must be an email',
      'EMAIL_MUST_MATCH': ' Emails must match',
      'EMAIL_TOO_SHORT': 'The email must be longer than 8 characters',
      'EMAIL_TOO_LONG': 'The email must be shorter than 100 characters',
      'PASSWORD_TOO_SHORT': 'The password must be longer than 6 characters',
      'PASSWORD_TOO_LONG': 'The password must be shorter than 30 characters',
      'PASSWORDS_MUST_MATCH': 'Passwords must match',
      'ALIAS_TOO_SHORT': 'The alias must be longer than 3 characters',
      'ALIAS_TOO_LONG': 'The alias must be shorter than 20 characters',
      'FIRST_NAME_TOO_SHORT': 'The first name must be longer than 1 characters',
      'FIRST_NAME_TOO_LONG': 'The first name must be shorter than 50 characters',
      'LAST_NAME_TOO_SHORT': 'The last name must be longer than 1 characters',
      'LAST_NAME_TOO_LONG': 'The last name must be shorter than 50 characters',
      'ADDRESS_TOO_SHORT': 'The address must be longer than 5 characters',
      'ADDRESS_TOO_LONG': 'The address must be shorter than 500 characters',
      'POSTAL_CODE_TOO_SHORT': 'The postal code must be bigger than 0',
      'POSTAL_CODE_TOO_LONG': 'The postal code must be shorter than 5 characters',
      'CITY_TOO_SHORT': 'The city must be longer than 1 characters',
      'CITY_TOO_LONG': 'The city must be shorter than 50 characters',

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

      'LOGOUT': 'Log out',

      /* Profile */
      'BIRTHDATE': 'Birthdate',
      'LAST_ACTIVITY': 'Last activity',
      'SUBSCRIBED': 'Subscribed',
      'AS_A_RENTER': 'As a renter',
      'AS_A_TENANT': 'As a tenant',
      'HAS_NO_ARTICLE_FOR_THE_MOMENT': 'has no articles available for the moment',
      'BASIC_INFORMATION': 'Basic informations',
      'CHANGE_EMAIL': 'Change Email',
      'CHANGE_PASSWORD': 'Change password',
      'OLD_PASSWORD': 'Old password',
      'NEW_PASSWORD': 'New password',
      'CONFIRM_NEW_PASSWORD': 'Confirm new password',
      'YOUR_ADDRESSES': 'Your addresses',
      'LIVING_ADDRESSES': 'Living addresses',
      'BILLING_ADDRESSES': 'Billing addresses',
      'ADD_ADDRESS': 'Add an address',
      'ALIAS': 'Alias',
      'ADDRESS': 'Address',
      'POSTAL_CODE': 'Postal code',
      'CITY': 'City',
      'ADD_TO_BILLING_ADDRESS': 'Also add it to the billing addresses',
      'ADD_TO_LIVING_ADDRESS': 'Also add it to the living addresses',

      /* Historique de notations */
      'HISTORY_NOTATIONS': 'History notations',
      'NO_MARKS_AS_A_CLIENT': 'No marks as a tenant received',
      'NO_MARKS_AS_A_RENTER': 'No marks as a renter received',

      /* History articles */
      'HISTORY_ARTICLES': 'History article',
      'NO_HISTORY_ARTICLE_AS_RENTER': 'There are no article history as renter',
      'NO_HISTORY_ARTICLE_AS_TENANT': 'There are no article history as tenant',
      'HISTORY_ARTICLE_AS_RENTER': 'Article History as renter',
      'HISTORY_ARTICLE_AS_TENANT': 'Article History as tenant',
      'ASKED_BY': 'Asked by',
      'STARTED': 'Started',
      'FINISHED': 'Finished',

      /* Favorites */
      'NO_FAVORITE_ARTICLE': 'You don\'t have any favorite articles',

    });

    /* French translation */
    $translateProvider.translations('fr', {

      /* Genereal */
      'SHOW_MORE': 'Voir plus',
      'HAS_NO_NOTATION': 'n\'a pas de notations',
      'NOT_SPECIFIED': 'non spécifié',
      'UNKNOWN': 'inconnu',
      'ARTICLES': 'Articles',
      'SEND': 'Envoyer',
      'MAN': 'Homme',
      'WOMAN': 'Femme',
      'FIRST_NAME': 'Prénom',
      'LAST_NAME': 'Nom',
      'PHONE_NUMBER': 'Numéro de téléphone',
      'EMAIL': 'email',
      'REPEAT_EMAIL': 'Répétez email',
      'THE_MASCULINE': 'Le',
      'THE_FEMININE': 'La',
      'ADD': 'Ajouter',

      /* Error form */
      'THIS_IS_REQUIRED': 'Champ obligatoire',
      'MUST_BE_LONGER_THAN_FIVE': 'doit être plus long que 5 caractères',
      'MUST_BE_SHORTER_THAN_TWENTY': 'doit être plus court que 20 caractères',
      'INCORRECT_PHONE_NUMBER': 'Le numéro de téléphone est invalide',
      'BIRTHDATE_SHOULD_BE': 'Année de naissance invalide aaaa/mm/jj',
      'MUST_BE_AN_EMAIL': 'Email non valide',
      'EMAIL_MUST_MATCH': 'Emails différents',
      'EMAIL_TOO_SHORT': 'L\'email doit être plus long que 8 caractères',
      'EMAIL_TOO_LONG': 'L\'email doit être plus court que 100 caractères',
      'PASSWORD_TOO_SHORT': 'Le mot de passe doit être plus long que 6 caractères',
      'PASSWORD_TOO_LONG': 'Le mot de passe doit être plus court que 30 caractères',
      'PASSWORDS_MUST_MATCH': 'Mot de passes différent',
      'ALIAS_TOO_SHORT': 'L\'alias doit être plus long que 3 caractères',
      'ALIAS_TOO_LONG': 'L\'alias doit être plus court que 20 caractères',
      'FIRST_NAME_TOO_SHORT': 'Le prénom doit être plus long que 1 caractères',
      'FIRST_NAME_TOO_LONG': 'Le prénom name doit être plus court 50 caractères',
      'LAST_NAME_TOO_SHORT': 'Le nom de famille doit être plus long que 1 caractères',
      'LAST_NAME_TOO_LONG': 'Le nome de famille doit être plus court 50 caractères',
      'ADDRESS_TOO_SHORT': 'L\'adresse doit être plus long que 5 caractères',
      'ADDRESS_TOO_LONG': 'L\'adresse doit être plus court 500 caractères',
      'POSTAL_CODE_TOO_SHORT': 'Le code postal doit être plus long que 0 caractères',
      'POSTAL_CODE_TOO_LONG': 'Le code postal doit être plus court 5 caractères',
      'CITY_TOO_SHORT': 'La ville doit être plus long que 1 caractères',
      'CITY_TOO_LONG': 'La ville doit être plus court 50 caractères',

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

      'LOGOUT': 'Déconnexion',

      /* Profile */
      'BIRTHDATE': 'Anniversaire',
      'LAST_ACTIVITY': 'Dernière activité',
      'SUBSCRIBED': 'Enregistré',
      'AS_A_RENTER': 'En tant que loueur',
      'AS_A_TENANT': 'En tant que locataire',
      'HAS_NO_ARTICLE_FOR_THE_MOMENT': 'n\'a pas d\'articles disponibles pour le moment',
      'BASIC_INFORMATION': 'Informations basiques',
      'CHANGE_EMAIL': 'Changer votre email',
      'CHANGE_PASSWORD': 'Change votre mot de passe',
      'OLD_PASSWORD': 'Ancien mot de passe',
      'NEW_PASSWORD': 'Nouveau mot de passe',
      'CONFIRM_NEW_PASSWORD': 'Confirmer le nouveau mot de passe',
      'YOUR_ADDRESSES': 'Vos adresses',
      'LIVING_ADDRESSES': 'Adresses de livraisons',
      'BILLING_ADDRESSES': 'Adresses de facturations',
      'ADD_ADDRESS': 'Ajout d\'une adresse',
      'ALIAS': 'Alias',
      'ADDRESS': 'Adresse',
      'POSTAL_CODE': 'Code postal',
      'CITY': 'Ville',
      'ADD_TO_BILLING_ADDRESS': 'Ajout aussi aux adresses de facturations',
      'ADD_TO_LIVING_ADDRESS': 'Ajouter aussi aux adresses de livraisons',

      /* History notation */
      'HISTORY_NOTATIONS': 'Historique des notations',
      'NO_MARKS_AS_A_CLIENT': 'Pas de notations en tant que locataire',
      'NO_MARKS_AS_A_RENTER': 'Pas de notations en tant que loueur',

      /* History articles */
      'HISTORY_ARTICLES': 'Historique d\'article',
      'NO_HISTORY_ARTICLE_AS_RENTER': 'Il n\'y a pas d\'articles en tant que loueur',
      'NO_HISTORY_ARTICLE_AS_TENANT': 'Il n\'y a pas d\'articles en tant que locataire',
      'HISTORY_ARTICLE_AS_RENTER': 'Historique d\'article en tant que loueur',
      'HISTORY_ARTICLE_AS_TENANT': 'Historique d\'article en tant que locataire',
      'ASKED_BY': 'Demandé par',
      'STARTED': 'Début',
      'FINISHED': 'Fin',

       /* Favorites */
      'NO_FAVORITE_ARTICLE': 'Vous n\'avez aucun article enregistré',

    });

    /* Default translation */
    $translateProvider.preferredLanguage('fr');
  }

})();
