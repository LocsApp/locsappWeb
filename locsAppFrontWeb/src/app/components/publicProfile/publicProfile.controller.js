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

    vm.firstFourNotationSuccess = function (data) {
      $log.log("firstFourNotationSuccess ", data);

      vm.public_user.renter_notation = data.renter_notation;
      vm.public_user.client_notation = data.client_notation;
      vm.public_user.nb_rotation_renter = data.nb_notation_renter;
      vm.public_user.nb_notation_client = data.nb_notation_client;


      for (i = 0; i < vm.public_user.renter_notation.length; i++) {
        var score_renter = Math.round(vm.public_user.renter_notation[i].value);
        var score_array_renter = [];

        for (var j = 0; j < 5; j++) {
          if (j < score_renter)
            score_array_renter.push(true);
          else
            score_array_renter.push(false);
        }
        vm.public_user.renter_notation[i].score = score_array_renter;

      }

      for (i = 0; i < vm.public_user.client_notation.length; i++) {
        var score_client = Math.round(vm.public_user.client_notation[i].value);
        var score_array_client = [];

        for (j = 0; j < 5; j++) {
          if (j < score_client)
            score_array_client.push(true);
          else
            score_array_client.push(false);
        }
        vm.public_user.client_notation[i].score = score_array_client;


      }

    };

    vm.firstFourNotationFailure = function (data) {
      $log.error("firstFourNotationFailure ", data);
    };

    vm.GetArticleFromUserProfileSuccess = function (data) {
      //$log.log("GetArticleFromUserProfileSuccess ", data);
      vm.public_user.nb_total_articles = data.nb_total_articles;
      vm.public_user.articles = data.articles;

      UsersService
        .firstFourNotation
        .get({id: vm.public_user.id})
        .$promise
        .then(vm.firstFourNotationSuccess, vm.firstFourNotationSuccess)

    };

    vm.GetArticleFromUserProfileFailure = function (data) {
      $log.error("GetArticlefromUserProfileFailure ", data);
    };

    /*Success callback of profile_check*/
    vm.GetPublicUserSuccess = function (data) {
      vm.public_user = data;
      vm.public_user.registered_date = vm.public_user.registered_date.substring(0, 10).replace(/-/g, '/');
      vm.public_user.last_activity_date = vm.public_user.last_activity_date.split('T')[0].replace(/-/g, '/');

      vm.public_user.renter_score_array = undefined;
      if (vm.public_user.renter_score != -1) {
        var renter_score = Math.round(vm.public_user.renter_score);
        vm.public_user.renter_score_array = [];
        for (i = 0; i < 5; i++) {
          if (i < renter_score)
            vm.public_user.renter_score_array.push(true);
          else
            vm.public_user.renter_score_array.push(false);
        }
      }

      vm.public_user.client_score_array = undefined;
      if (vm.public_user.tenant_score != -1) {
        var client_score = Math.round(vm.public_user.tenant_score);
        vm.public_user.client_score_array = [];
        for (i = 0; i < 5; i++) {
          if (i < client_score)
            vm.public_user.client_score_array.push(true);
          else
            vm.public_user.client_score_array.push(false);
        }
      }

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
