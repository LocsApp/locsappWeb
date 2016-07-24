(function () {
  'use strict';

  angular
    .module('LocsappControllers')
    .controller('ProfileController', ProfileController);

  /** @ngInject */
  function ProfileController($scope, $log, UsersService, ScopesService, $state, toastr, URL_API) {
    var vm = this;

    /*vars initilization*/
    vm.user = {};
    vm.url_api = URL_API;

    vm.GetArticleFromUserProfileSuccess = function (data) {
      $log.log("GetArticleFromUserProfileSuccess", data);

      vm.user.total_article = data.nb_total_articles;

      vm.user.first_part_article = [];
      vm.user.second_part_article = [];

      //Need to check if the variabl we want to access exist first
      for (var i = 0; i < 2; i++) {
        if (data.articles[i] != undefined)
          vm.user.first_part_article[i] = data.articles[i];
      }
      var j = 0;
      for (var i = 2; i < 4; i++) {
        if (data.articles[i] != undefined)
          vm.user.second_part_article[j] = data.articles[i];
          j++;
      }

    };

    vm.GetArticleFromUserProfileFailure = function (data) {
      $log.error("GetArticleFromUserProfileFailure", data);
      //toastr.error("This is odd...", "Woops...");
    };

    /*Success callback of profile_check*/
    vm.GetInfosUserSuccess = function (data) {
      $log.log(data);
      vm.user = data;
      vm.user.registered_date = vm.user.registered_date.substring(0, 10).replace(/-/g, '/');
      vm.user.last_activity_date = vm.user.last_activity_date.split('T')[0].replace(/-/g, '/');


      // We call the routes to get articles of the current user
      UsersService
        .articleFromUserProfile
        .get({id: vm.user.id})
        .$promise
        .then(vm.GetArticleFromUserProfileSuccess, vm.GetArticleFromUserProfileFailure)

    };

    /*Failure callback of profile_check*/
    vm.GetInfosUserFailure = function (data) {
      $log.log(data);
      toastr.error("This is odd...", "Woops...");
    };

    /*Adds a new scope to share, and goes to profile_management*/
    vm.goToParameters = function () {
      ScopesService
        .set("user_infos", vm.user);
      $state.go("main.profile_management")
    };

    /*vm.user initializer*/
    UsersService
      .profile_check
      .get({})
      .$promise
      .then(vm.GetInfosUserSuccess, vm.GetInfosUserFailure);
  }
})();
