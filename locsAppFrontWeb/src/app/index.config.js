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
      'OR': 'or',
      'CURRENCY': '$',
      'WOPS': 'Woops...',
      'RETRIEVING_DATA': 'An error occured while retrieving your data...',
      'SERVER_NOT_ANSWERING': 'The server isn\'t answering...',
      'SUCCESS': 'Success!',
      'ERROR_OCCURRED': 'An error occurred',
      'BY': 'By',
      'DAY': 'day',

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
      'USERNAME_TOO_SHORT': 'The username must be longer than 3 characters',
      'USERNAME_TOO_LONG': 'The username must be shorter than 30 characters',
      'TITLE_TOO_SHORT': 'The title must be longer than 3 characters',
      'TITLE_TOO_LONG': 'The title must be shorter than 50 characters',
      'DESCRIPTION_TOO_SHORT': 'The description must be longer than 3 characters',
      'DESCRIPTION_TOO_LONG': 'The description must be shorter than 5000 characters',
      'PRICE_TOO_SHORT': 'The price must be higher than 5',
      'PRICE_TOO_LONG': 'The price must be lower than 500',

      /* The navbar */
      'SEARCH': 'Search',
      'CREATE_ARTICLE': 'Create an article',

      'MY_ARTICLES': 'My articles',
      'CURRENT_REQUESTS': 'Current requests',
      'CURRENT_ARTICLES': 'Current articles',
      'TIMELINE': 'Timeline',
      'NOTATION': 'Notation',

      'MY_QUESTIONS': 'My questions',
      'QUESTIONS_I_HAVE_ASKED': 'Questions I have asked',
      'QUESTIONS_TO_ANSWER': 'Questions to answer',

      'MY_BOOKMARKS': 'My bookmarks',
      'MY_SEARCHES': 'My searches',

      'MY_ACCOUNT': 'My account',
      'MY_INFORMATIONS': 'My informations',
      'EDIT_PROFILE': 'Edit my profile',
      'HISTORY_NOTATION': 'History notation',
      'HISTORY_ARTICLE': 'History article',

      'LOGOUT': 'Log out',
      'LOGIN': 'Log in',
      'SIGN_IN': 'Sign in',

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

      /* Questions */
      'DID_NOT_ASK_QUESTIONS': 'You did not ask a question about any article',
      'DONT_HAVE_QUESTIONS': 'You don\'t have any question to answer about an article',

      /* Request */
      'MY_REQUEST_AS_RENTER': 'My Requests As Renter',
      'MY_REQUEST_AS_TENANT': 'My Requests As Tenant',
      'DEMAND_AS_RENTER': 'There are no demands available at the moment',
      'DEMAND_AS_TENANT': 'You issued no requests yet',
      'USER_HAS_NO_NOTATION': 'This user has no notation yet',
      'FROM': 'from',
      'TO': 'to',
      'ACCEPT': 'ACCEPT',
      'REFUSE': 'REFUSE',
      'ASKED_TO': 'Asked to',
      'ON': 'on',
      'RETRACT': 'RETRACT',

      /* Timeline */
      'CURRENT_TIMELINES': 'Current Timelines',
      'TIMELINE_AS_RENTER': 'My Timelines As Renter',
      'TIMELINE_AS_TENANT': 'My Timelines As tenant',
      'NO_AVAILABLE_TIMELINE': 'There are no timelines available at the moment',
      'DAYS_LEFT': 'day(s) left',

      /* Article notation */
      'TENANT': 'Tenant',
      'RENTER': 'Renter',
      'NO_MARK_TO_GIVE_TO_CLIENT': 'There are no clients to give a mark to at the moment',
      'NO_MARK_TO_GIVE_TO_RENTER': 'There are no renters to give a mark to at the moment',
      'COMMENT': 'comment',

      /* Search */
      'SORT_BY': 'SORT_BY',
      'YOUR_RESEARCH': 'Your research',
      'YOUR_KEYWORD': 'Your Keyword',
      'SEARCH_ONLY_IN_TITLE': 'Search only in title',
      'YOUR_AVAILABILITY': 'Your availability',
      'YOUR_POSITION': 'Your position',
      'NEAR_ME': 'Near Me',
      'BEGIN_LOCATION': 'Begin location',
      'END_LOCATION': 'End location',
      'CLOTHES_PROPERTIES': 'Clothes properties',
      'TRANSACTION_MODALITIES': 'Transaction Modalities',
      'CAUTION': 'Caution',
      'WITHIN': 'Within',
      'KM': 'km',

      'CATEGORIES': 'categories',
      'SUBCATEGORIES': 'Sub-Categories',
      'BRANDS': 'brands',
      'GENDERS': 'genders',
      'SIZES': 'sizes',
      'COLORS': 'colors',
      'STATES': 'states',


      /* Login and Sign in */
      'USERNAME_OR_EMAIL': 'Username or Email',
      'PASSWORD': 'Password',
      'REMEMBER_ME': 'Remember me',
      'FORGET_YOUR_PASSWORD': 'Forgot your password ?',
      'LOGIN_WITH_FACEBOOK': 'Login with Facebook',

      'JOIN_THE_COMMUNITY': 'Join the community !',
      'USERNAME': 'Username',
      'SIGN_IN_WITH_FACEBOOK': 'Register with Facebook',
      //'EMAIL': ''

      /* Create article */
      'NEXT_STEP': 'Next Step',
      'WELCOME_CREATION_ARTICLE': 'Welcome to the article creation',
      'DEFINE_YOUR_ARTICLE': 'Define your article',
      'TITLE': 'Title',
      'TITLE_OF_YOUR_ARTICLE': 'The title of your article',
      'TOOLTIP_TITLE_ARTICLE': 'This will be the title of your article. It will be displayed in the search, and will appear as the main sentence on top of your article\'s page',
      'CATEGORY': 'The category',
      'TOOLTIP_CATEGORY': 'It will categorize your article to be found in one of the 3 main themes',
      'SUBCATEGORY': 'The sub-category',
      'TOOLTIP_SUBCATEGORY': 'It will help to precise the scope of your article',

      'ARTICLE_CHARACTERISTIC': 'Characteristic of your article',
      'GENDER': 'The gender',
      'TOOLTIP_GENDER': 'It defines for which gender the clothe is meant to be for',
      'SIZE': 'The size',
      'TOOLTIP_SIZE': 'This is the size of your clothe',
      'COLOR': 'Color',
      'TOOLTIP_COLOR': 'Choose the main color of your clothe',
      'STATE': 'The state',
      'TOOLTIP_STATE': 'Indicate in which state your clothe is',
      'BRAND': 'The Brand',
      'TOOLTIP_BRAND': 'This is the brand of your clothe (you can put homemade if you made it yourself)',

      'ARTICLE_DESCRIPTION': 'Description of your article',
      'THE_ARTICLE_DESCRIPTION': 'The description of your article',
      'TOOLTIP_DESCRIPTION': 'This will be the description of your article, keep in mind that it will represent your article',
      'YOUR_DESCRIPTION': 'Your description',

      'PICTURE_OF_YOUR_ARTICLE': 'The pictures of your article',
      'THUMBNAIL_PICTURE': 'The thumbnail picture',
      'TOOLTIP_THUMBNAIL': 'It is the main picture for your article. it will be displayed in the search and in the top of your article.',
      'ARTICLE_PICTURE': 'The article pictures',
      'TOOLTIP_PICTURE': 'These are your the pictures of your article. It will be displayed in the main body of your article\'s page.',

      'RENTER_MODALITIES': 'The modalities for the tenant',
      'AVAILIBILITY_DATE': 'The availibility date',
      'TOOLTIP_AVAILIBILITY_START': 'This indicates when the clothe will be available',
      'END_AVAILIBILITY_DATE': 'End of availibility date',
      'TOOLTIP_AVAILIBILITY_END': 'This indicates when the clothe will not be available anymore',
      'PAYMENT_METHOD': 'Payment methods',
      'SELECT_PAYMENT_METHOD': 'You can select which payment method the user can choose to pay for the renting',
      'REMOVE_ONE': 'Un-',
      'SELECT_ALL': 'Select All',
      'ARTICLE_PRICE': 'The price of your article',
      'TOOLTIP_PRICE': 'This will be the price of your article by day. It will be displayed in the search. The minimum price is 5$ and the max price is 500$',
      'PRICE': 'price',

      'PREVIEW_ARTICLE': 'Preview of your article',
      'CONGRATULATION': 'Congratulation ! There will be a preview here.',


      /* Forget password */
      'ENTER_YOUR_EMAIL': 'Enter your email',
      'RESET': 'Reset',

      /* Article show */
      'ASK_FOR_RENT': 'Ask for rent',
      'ARTICLE_NOT_AVAILABLE': 'This article is not available at this moment.',
      'CAN_NOT_BOOK_OWN_ARTICLE': 'You can\'t book your own article.',
      'ADD_TO_FAVORITE': 'Add to your favorites',
      'DELETE_FROM_FAVORITE': 'Delete from your favorites',
      'SHARE_IT': 'Share it',
      'SHARE_LOOK': 'Look what I found on LocsApp',
      'SEND_REPORT': 'Send a report',
      'REPORT_ALREADY_SENT': 'Report already sent',

      'CAN_ANSWER_QUESTION': 'You can answer the question here',
      'ANSWER_QUESTION': 'Answer the question',

      'CAN_NOT_ASK_QUESTION_OWN_ARTICLE': 'You can\'t ask question on your own article',
      'FIRST_ONE': 'Be the first one to ask something',
      'ASK_YOUR_QUESTION': ' Please ask your question',
      'SEND_QUESTION': 'Send your question',


      /* Toaster */

      /* Login */
      'LOGIN_ERROR_CREDENTIALS': 'We couldn\'t log you in with these infos...',
      'ERROR_VERIFY_YOUR_EMAIL': 'Please verify your email.',
      'SUCCESS_PASSWORD_RESET': 'Password reset e-mail has been sent.',
      /* EndLogin */

      /* Update profile */
      'SUCCESS_MODIFIED_PROFILE': 'The profile has been successfully modified.',
      'AVATAR_CHANGED': 'Your avatar has been changed',
      'AVATAR_ERROR': 'Couldn\'t upload a picture',
      'ALREADY_EMAIL_ADDRESS': 'This is already your email address',
      'NEW_ADDRESSES_ADD': 'The new addresses have been successfully added.',
      'NEW_LIVING_ADDRESS_ADD': 'The new living address has been successfully modified.',
      'MODIFY_BILLING_ADDRESS_ADD': 'The new billing address has been successfully modified.',
      'SUCCESS_DELETE': 'The address has been successfully deleted.',
      'NEW_LIVING_ADDRESS': 'The new living address has been successfully added.',
      'NEW_BILLING_ADDRESS': 'The new billing address has been successfully added.',

      'SUCCESS_CHANGE_EMAIL': 'The email has been changed',
      'SUCCESS_CHANGE_PASSWORD': 'Your password has been changed'
      /* End Update profile */

      /* End Toaster */

    })
    ;

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
      'OR': 'ou',
      'CURRENCY': '€',
      'WOPS': 'Woops...',
      'RETRIEVING_DATA': 'Erreur inconnue...',
      'SERVER_NOT_ANSWERING': 'Le serveur ne répond pas',
      'SUCCESS': 'Succès!',
      'ERROR_OCCURRED': 'Une erreur est survenue',
      'BY': 'Par',
      'DAY': 'jour',


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
      'USERNAME_TOO_SHORT': 'Le pseudo doit être plus long que 3 caractères',
      'USERNAME_TOO_LONG': 'Le pseudo doit être plus court que 30 caractères',
      'TITLE_TOO_SHORT': 'Le titre doit être plus long 3 caractères',
      'TITLE_TOO_LONG': 'Le titre doit être plus court que 50 caractères',
      'DESCRIPTION_TOO_SHORT': 'La description doit être plus longue que 3 caractères',
      'DESCRIPTION_TOO_LONG': 'La description doit être plus courte que 5000 caractères',
      'PRICE_TOO_SHORT': 'Le prix doit être supérieur à  5',
      'PRICE_TOO_LONG': 'Le prix doit être inférieur à 500',

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
      'LOGIN': 'Se connecter',
      'SIGN_IN': 'S\'enregistrer',

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

      /* Questions */
      'DID_NOT_ASK_QUESTIONS': 'Vous n\'avez posé aucune question',
      'DONT_HAVE_QUESTIONS': 'Vous n\'avez aucune question à repondre',

      /* Request */
      'MY_REQUEST_AS_RENTER': 'Mes requêtes en tant que loueur',
      'MY_REQUEST_AS_TENANT': 'Mes requêtes en tant que locataire',
      'DEMAND_AS_RENTER': 'Vous n\'avez aucune demande',
      'DEMAND_AS_TENANT': 'Vous n\'avez aucunde demande en attente',
      'USER_HAS_NO_NOTATION': 'Cette utilisateur n\'a pas de notations',
      'FROM': 'de',
      'TO': 'à',
      'ACCEPT': 'ACCEPTER',
      'REFUSE': 'REFUSER',
      'ASKED_TO': 'Asked to',
      'ON': 'le',
      'RETRACT': 'SE RETRACTER',

      /* Timeline */
      'CURRENT_TIMELINES': 'Timelines en cours',
      'TIMELINE_AS_RENTER': 'Timelines en tant que loueur',
      'TIMELINE_AS_TENANT': 'Timelines en tant que locataire',
      'NO_AVAILABLE_TIMELINE': 'Il n\'y a pas de timeline en cours',
      'DAYS_LEFT': 'jour(s) restant',

      /* Article notation */
      'TENANT': 'Locataire',
      'RENTER': 'Loueur',
      'NO_MARK_TO_GIVE_TO_CLIENT': 'Il n\'y a pas de locataire à qui donner une note',
      'NO_MARK_TO_GIVE_TO_RENTER': 'Il n\'y a pas de loueur à qui donner une note',
      'COMMENT': 'Laissez un message',

      /* Search */
      'SORT_BY': 'Trier par',
      'YOUR_RESEARCH': 'Votre recherche',
      'YOUR_KEYWORD': 'Vos mot(s) clé',
      'SEARCH_ONLY_IN_TITLE': 'Chercher uniquement dans le titre',
      'YOUR_AVAILABILITY': 'Vos disponibilités',
      'YOUR_POSITION': 'Votre position',
      'NEAR_ME': 'Près de moi',
      'BEGIN_LOCATION': 'Date de début',
      'END_LOCATION': 'Date de fin',
      'CLOTHES_PROPERTIES': 'Propriété du vêtement',
      'TRANSACTION_MODALITIES': 'Modalité de transaction',
      'CAUTION': 'Caution',
      'WITHIN': 'A environ',
      'KM': 'km',

      'CATEGORIES': 'Catégories',
      'SUBCATEGORIES': 'Sous catégories',
      'BRANDS': 'Marques',
      'GENDERS': 'Sexes',
      'SIZES': 'Tailles',
      'COLORS': 'Couleurs',
      'STATES': 'Etats',

      /* Login and Sign in */
      'USERNAME_OR_EMAIL': 'Pseudo ou Email',
      'PASSWORD': 'Mot de passe',
      'REMEMBER_ME': 'Se souvenir de moi',
      'FORGET_YOUR_PASSWORD': 'Vous avez oublié votre mot de passe ?',
      'LOGIN_WITH_FACEBOOK': 'Se connecter avec Facebook',

      'JOIN_THE_COMMUNITY': 'Rejoignez la communauté !',
      'USERNAME': 'Pseudo',
      'SIGN_IN_WITH_FACEBOOK': 'Se connecter avec Facebook',

      /* Create article */
      'NEXT_STEP': 'Etape suivante',
      'WELCOME_CREATION_ARTICLE': 'Bienvenue à la création d\'article',
      'DEFINE_YOUR_ARTICLE': 'Défénissez votre article',
      'TITLE': 'Titre',
      'TITLE_OF_YOUR_ARTICLE': 'Le titre de votre article',
      'TOOLTIP_TITLE_ARTICLE': 'Ce sera le titre de votre article. Il sera affiché lors d\'une recherche et apparaîtra en haut de la page de votre article',
      'CATEGORY': 'La catégorie',
      'TOOLTIP_CATEGORY': 'Cela va catégoriser votre article pour être trouvé dans une des 3 grandes catégories',
      'SUBCATEGORY': 'La sous-catégorie',
      'TOOLTIP_SUBCATEGORY': 'Cela permet de définir un peu plus précisiément votre article',

      'ARTICLE_CHARACTERISTIC': 'Les caractéristiques de votre article',
      'GENDER': 'Le sexe',
      'TOOLTIP_GENDER': 'Cela défine pour quel sexe est votre vêtement',
      'SIZE': 'La taille',
      'TOOLTIP_SIZE': 'La taille de votre vêtement',
      'COLOR': 'Couleur',
      'TOOLTIP_COLOR': 'Choisir la couleur principale de votre article',
      'STATE': 'L\'état',
      'TOOLTIP_STATE': 'Indique dans quel état est votre article',
      'BRAND': 'La marque',
      'TOOLTIP_BRAND': 'La marque de votre vêtement (vous pouvez mettre fait main si vous l\'avez effectué vous même)',
      'ARTICLE_DESCRIPTION': 'Description de votre article',
      'THE_ARTICLE_DESCRIPTION': 'La description de votre article',
      'TOOLTIP_DESCRIPTION': 'Ce sera la description de votre article, cela représentera votre article',
      'YOUR_DESCRIPTION': 'Votre description',
      'PICTURE_OF_YOUR_ARTICLE': 'Les images de votre article',
      'THUMBNAIL_PICTURE': 'L\'image principale de votre article',
      'TOOLTIP_THUMBNAIL': 'Ceci est l\'image principale de votre article. Elle sera affiché lors d\'une recherche et en haut de la page de votre article.',
      'ARTICLE_PICTURE': 'Les images de votre article',
      'TOOLTIP_PICTURE': 'Ce sont les images de votre article. Elle seront affichées en haut de votre page d\'article.',

      'RENTER_MODALITIES': 'Modalités pour le locataire',
      'AVAILIBILITY_DATE': 'La de disponiblité',
      'TOOLTIP_AVAILIBILITY_START': 'Ceci indique quand votre vêtement sera disponible',
      'END_AVAILIBILITY_DATE': 'La fin de la date d\'avibilité',
      'TOOLTIP_AVAILIBILITY_END': 'Cela indique quand le vêtement ne sera plus disponible',
      'PAYMENT_METHOD': 'Méthodes de paiments',
      'SELECT_PAYMENT_METHOD': 'Vous pouvez choisir les méthodes de paiment que vous acceptez',
      'REMOVE_ONE': 'Un-',
      'SELECT_ALL': 'Tout sélectionner',
      'ARTICLE_PRICE': 'Le prix de l\'article',
      'TOOLTIP_PRICE': 'Ce sera le prix de la location de votre article par jour. Ce sera affiché dans la recherche.',
      'PRICE': 'Prix',

      'PREVIEW_ARTICLE': 'Prévisualiser votre article',
      'CONGRATULATION': 'Félicitations ! Vous allez avoir une prévisualisation de votre article.',

      /* Forget password */
      'ENTER_YOUR_EMAIL': 'Entrer votre email',
      'RESET': 'Reset',

        /* Article show */
      'ASK_FOR_RENT': 'Demande de location',
      'ARTICLE_NOT_AVAILABLE': 'Cette article n\'est pas disponible',
      'CAN_NOT_BOOK_OWN_ARTICLE': 'Vous ne pouvez pas louer votre article.',
      'ADD_TO_FAVORITE': 'Ajouté à vos favoris',
      'DELETE_FROM_FAVORITE': 'Supprimé de vos favoris',
      'SHARE_IT': 'Partager',
      'SHARE_LOOK': 'Trouvé sur Locsapp',
      'SEND_REPORT': 'Signaler cette article',
      'REPORT_ALREADY_SENT': 'Vous avez déjà signalé cet article',

      'CAN_ANSWER_QUESTION': 'Vous pouvez répondre à la question ici',
      'ANSWER_QUESTION': 'Répondre',

         'CAN_NOT_ASK_QUESTION_OWN_ARTICLE': 'Vous ne pouvez pas poser des questions sur votre propre article',
      'FIRST_ONE': 'Soyez le premier à poser une question',
      'ASK_YOUR_QUESTION': 'S\'il vous plaît, posez votre question',
      'SEND_QUESTION': 'Envoyer votre question',



      /* Toaster */

      /* Login */
      'LOGIN_ERROR_CREDENTIALS': 'Nous ne pouvons pas vous connecter avec ces informations...',
      'ERROR_VERIFY_YOUR_EMAIL': 'S\'il vous plaît vérifier votre email.',
      'SUCCESS_PASSWORD_RESET': 'Un email vous a était envoyé',

      /* EndLogin */

      /* Update profile */
      'SUCCESS_MODIFIED_PROFILE': 'Le profile a été modifié avec succès.',
      'AVATAR_CHANGED': 'Votre avatar a été modifié avec succès',
      'AVATAR_ERROR': 'Impossible d\'upload votre image',
      'ALREADY_EMAIL_ADDRESS': 'Vous utilisez déjà cette adresse',
      'NEW_ADDRESSES_ADD': 'Les nouvelles addresse ont été ajoutées.',
      'MODIFY_LIVING_ADDRESS_ADD': 'L\'adresse de livraison a été modifiée avec succès.',
      'MODIFY_BILLING_ADDRESS_ADD': 'L\'adresse de facturation a été modifiée avec succès.',
      'SUCCESS_DELETE': 'L\'adresse a été supprimé avec succès.',
      'NEW_LIVING_ADDRESS': 'L\'adresse de livraison a été ajoutée avec succès.',
      'NEW_BILLING_ADDRESS': 'L\'adresse de facturation a été ajoutée avec succès.',


      'SUCCESS_CHANGE_EMAIL': 'L\'adresse email a été changée',
      'SUCCESS_CHANGE_PASSWORD': 'Your password has been changed'


      /* End Update profile */

      /* End Toaster */

    });

    /* Default translation */
    $translateProvider.preferredLanguage('fr');
  }

})();
