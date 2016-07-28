(function () {
  'use strict';

  angular
    .module('LocsappControllers')
    .controller('PublicProfileController', PublicProfileController);

  /** @ngInject */
  function PublicProfileController($scope, $log, UsersService, ScopesService, $state, toastr, URL_API,
  $stateParams) {
    var vm = this;

    /*vars initilization*/
    vm.public_user = {};
    vm.url_api = URL_API;
    var i;


    vm.GetArticleFromUserProfileSuccess = function (data) {
      $log.log("GetArticleFromUserProfileSuccess ", data);
      vm.public_user.nb_total_articles = data.nb_total_articles;
      vm.public_user.articles = data.articles;

    };

    vm.GetArticleFromUserProfileFailure = function (data) {
      $log.error("GetArticlefromUserProfileFailure ", data);
    };

    /*Success callback of profile_check*/
    vm.GetPublicUserSuccess = function (data) {
      vm.public_user = data;
      vm.public_user.registered_date = vm.public_user.registered_date.substring(0, 10).replace(/-/g, '/');
      vm.public_user.last_activity_date = vm.public_user.last_activity_date.split('T')[0].replace(/-/g, '/');


      // We call the routes to get articles of the current user
      UsersService
        .articleFromUserProfile
        .get({id: vm.public_user.id})
        .$promise
        .then(vm.GetArticleFromUserProfileSuccess, vm.GetArticleFromUserProfileFailure)

    };

    /*Failure callback of profile_check*/
    vm.GetPublicUserFailure = function (data) {
      $log.log(data);
      toastr.error("This is odd...", "Woops...");
    };


    /*vm.public_user initializer*/
    UsersService
      .getPublicUser
      .get({username: $stateParams.username})
      .$promise
      .then(vm.GetPublicUserSuccess, vm.GetPublicUserFailure);
  }
})();
