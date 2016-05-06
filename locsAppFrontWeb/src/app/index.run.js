(function () {
  'use strict';

  angular
    .module('locsapp')
    .run(runBlock);

  /** @ngInject */
  function runBlock($http, Permission, UsersService, NotificationsService, CacheService, ScopesService, $q, $sessionStorage,
                    $localStorage, $log, toastr, $rootScope, $state, URL_API, ngMdIconService) {
    //Automatize send of Csrf token
    $http.defaults.xsrfHeaderName = 'X-CSRFToken';
    $http.defaults.xsrfCookieName = 'csrftoken';

    //Add of custom icons ng-md-icon
    ngMdIconService
      .addShapes({
        'location': '<path d="M16,21H8A1,1 0 0,1 7,20V12.07L5.7,13.12C5.31,13.5 4.68,13.5 4.29,13.12L1.46,10.29C1.07,9.9 1.07,9.27 1.46,8.88L7.34,3H9C9,4.1 10.34,5 12,5C13.66,5 15,4.1 15,3H16.66L22.54,8.88C22.93,9.27 22.93,9.9 22.54,10.29L19.71,13.12C19.32,13.5 18.69,13.5 18.3,13.12L17,12.07V20A1,1 0 0,1 16,21M20.42,9.58L16.11,5.28C15.8,5.63 15.43,5.94 15,6.2C14.16,6.7 13.13,7 12,7C10.3,7 8.79,6.32 7.89,5.28L3.58,9.58L5,11L8,9H9V19H15V9H16L19,11L20.42,9.58Z" />',
        'squared_one': '<path d="M14,17H12V9H10V7H14M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3Z" />',
        'squared_two': '<path d="M15,11C15,12.11 14.1,13 13,13H11V15H15V17H9V13C9,11.89 9.9,11 11,11H13V9H9V7H13A2,2 0 0,1 15,9M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3Z" />',
        'squared_three': '<path d="M15,10.5A1.5,1.5 0 0,1 13.5,12C14.34,12 15,12.67 15,13.5V15C15,16.11 14.11,17 13,17H9V15H13V13H11V11H13V9H9V7H13C14.11,7 15,7.89 15,9M19,3H5C3.91,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19C20.11,21 21,20.1 21,19V5A2,2 0 0,0 19,3Z" />',
        'squared_four': '<path d="M15,17H13V13H9V7H11V11H13V7H15M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3Z" />',
        'squared_five': '<path d="M15,9H11V11H13A2,2 0 0,1 15,13V15C15,16.11 14.1,17 13,17H9V15H13V13H9V7H15M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3Z" />',
        'squared_six': '<path d="M15,9H11V11H13A2,2 0 0,1 15,13V15C15,16.11 14.1,17 13,17H11A2,2 0 0,1 9,15V9C9,7.89 9.9,7 11,7H15M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M11,15H13V13H11V15Z" />',
        'cash': '<path d="M3,6H21V18H3V6M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M7,8A2,2 0 0,1 5,10V14A2,2 0 0,1 7,16H17A2,2 0 0,1 19,14V10A2,2 0 0,1 17,8H7Z" />'
      });

    //ui-router keep url on child on multiple levels nested views and redirect to the default child
    var rootScopeOnStateChangeStart = $rootScope.$on('$stateChangeStart', function (evt, to, params) {
      if (to.redirectTo) {
        evt.preventDefault();
        $state.go(to.redirectTo, params)
      }
    });

    //Destruction and memory release of the rootScopeOnStateChangeStart
    $rootScope.$on('$destroy', rootScopeOnStateChangeStart);

    //Check for the cache
    if (!$localStorage.static_collections ||
        !$localStorage.static_collections.version ||
        !$localStorage.static_collections.body)
    {
      $log.log("NO CACHE");
      $localStorage.static_collections = {};
      CacheService
      .checkStaticCollectionVersion
      .save({"argument" : 1})
      .$promise
      .then(function (data) { $localStorage.static_collections.version = data.version; $localStorage.static_collections.body = data.static_collections; ScopesService.set("static_collections", $localStorage.static_collections.body);},
        function(data) { $log.log("ERROR CACHE RETRIEVAL"); $log.log(data); });
    }
    else
    {
      CacheService
      .checkStaticCollectionVersion
      .save({"argument" : 0, "version": $localStorage.static_collections.version})
      .$promise
      .then(function (data) {
        if (!data.up_to_date)
        {
          $localStorage.static_collections = {};
          $localStorage.static_collections.version = data.version;
          $localStorage.static_collections.body = data.static_collections;
        }
      },
        function(data) { $log.log("ERROR CACHE RETRIEVAL"); $log.log(data); });
    }

    //Set the shared scope of the elements of cache
    ScopesService.set("static_collections", $localStorage.static_collections.body);
    //End check for the cache

    //Defining of guest role for permissions
    Permission.defineRole("guest", function () {
      var deferred = $q.defer();

      UsersService
        .profile_check
        .get({})
        .$promise
        .then(profileSuccess, profileError);

      function profileSuccess() {
        $log.log("in");
        deferred.reject();
      }

      function profileError(data) {
        if ($localStorage.key) {
          toastr.error("The server disconnected you.", "Please login again");
          delete $localStorage.key
        }
        if ($sessionStorage.key) {
          toastr.error("The server disconnected you.", "Please login again");
          delete $sessionStorage.key
        }
        $log.log(data);
        $log.log("out");
        deferred.resolve();
      }

      return (deferred.promise);
    });

    //Defining of user role for permissions
    Permission.defineRole("user", function () {
      var deferred = $q.defer();

      UsersService
        .profile_check
        .get({})
        .$promise
        .then(profileSuccess, profileError);

      function profileSuccess() {
        //Checks if a listener is set, if not, set one
        if (Object.getOwnPropertyNames(NotificationsService.getListeners()).length == 0)
          NotificationsService.addListener("user", URL_API + "api/v1/search/notifications/" + $sessionStorage.id + "/");
        //stimulates the listener to retrieve the notifications for the user
        NotificationsService.stimulateListener("user");
        deferred.resolve();
      }

      function profileError(data) {
        if ($localStorage.key) {
          toastr.error("The server disconnected you.", "Please login again");
          delete $localStorage.key
        }
        if ($sessionStorage.key) {
          toastr.error("The server disconnected you.", "Please login again");
          delete $sessionStorage.key
        }
        $log.log(data);
        $log.log("out");
        deferred.reject();
      }

      return (deferred.promise);
    });
  }

})();
