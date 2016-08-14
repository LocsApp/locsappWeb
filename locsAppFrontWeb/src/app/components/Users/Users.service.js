(function () {
  'use strict';

  angular
    .module('LocsappServices')
    .factory('UsersService', UsersService);

  /** @ngInject */
  function UsersService($log, $resource, URL_API, $sessionStorage, $localStorage, Upload) {

    var service = {
      register: $resource(URL_API + 'api/v1/rest-auth/registration/'),
      login: $resource(URL_API + 'api/v1/rest-auth/login/'),
      logout: $resource(URL_API + 'api/v1/rest-auth/logout/'),
      profile_check: $resource(URL_API + 'api/v1/rest-auth/user/', null, {'update': {method: 'PUT'}}),
      modify_profile: $resource(URL_API + 'api/v1/rest-auth/user/', null, {'update': {method: 'PUT'}}),
      change_password: $resource(URL_API + 'api/v1/rest-auth/password/change/'),
      change_email : $resource(URL_API + 'api/v1/user/change-email/'),
      living_addresses: $resource(URL_API + 'api/v1/user/:id/living_addresses/', {id: "@user_id"}),
      living_addresses_delete: $resource(URL_API + 'api/v1/user/:id/living_addresses/delete/', {id: "@user_id"}),
      billing_addresses: $resource(URL_API + 'api/v1/user/:id/billing_addresses/', {id: "@user_id"}),
      billing_addresses_delete: $resource(URL_API + 'api/v1/user/:id/billing_addresses/delete/', {id: "@user_id"}),
      add_secondary_email: $resource(URL_API + 'api/v1/user/add-email/'),
      set_primary_email: $resource(URL_API + 'api/v1/user/set-primary-email/'),
      delete_email: $resource(URL_API + 'api/v1/user/delete-email/'),
      verify_email: $resource(URL_API + 'api/v1/verify-email/:key/', {key: '@key'}),
      password_reset: $resource(URL_API + 'api/v1/rest-auth/password/reset/'),
      password_reset_confirm: $resource(URL_API + 'api/v1/rest-auth/password/reset/confirm/'),
      facebook_register: $resource(URL_API + 'api/v1/auth/facebook-register/'),
      facebook_login: $resource(URL_API + 'api/v1/auth/facebook-login/'),
      articleFromUserProfile: $resource(URL_API + 'api/v1/articles/user-profile/:id/', {id: "id"}),
      firstFourNotation: $resource(URL_API + 'api/v1/history/notations-profile/:id/', {id: "id"}),
      getPublicUser: $resource(URL_API + 'api/v1/user/:username/', {username: "username"}),
      uploadPicture: uploadPicture,
      is_authenticated: is_authenticated
    };

    return service;


    function uploadPicture(file) {
      return (Upload.upload({
        url: URL_API + 'api/v1/user/image-upload-avatar/',
        data: {file: file}
      }));
    }


    function is_authenticated() {
      return ($sessionStorage.key || $localStorage.key) ? true : false;
    }
  }
})();
