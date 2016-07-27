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


    vm.GetFirstFourNotationSuccess = function(data) {
      $log.log("GetFirstFourNotationSuccess = ", data);

        vm.renter_notation = data.renter_notation;
        vm.client_notation = data.client_notation;
        vm.nb_rotation_renter = data.nb_notation_renter;
        vm.nb_notation_client = data.nb_notation_client;


        for (i = 0; i < vm.renter_notation.length; i++) {
            var score_renter = Math.round(vm.renter_notation[i].value);
            var score_array_renter = [];

            for (var j = 0; j < 5; j++) {
              if (j < score_renter)
                score_array_renter.push(true);
              else
                score_array_renter.push(false);
            }
            vm.renter_notation[i].score = score_array_renter;

        }

        for (i = 0; i < vm.client_notation.length; i++) {
            var score_client = Math.round(vm.client_notation[i].value);
            var score_array_client = [];

            for (j = 0; j < 5; j++) {
              if (j < score_client)
                score_array_client.push(true);
              else
                score_array_client.push(false);
            }
            vm.client_notation[i].score = score_array_client;

        }

    };

    vm.GetFirstFourNotationFailure = function(data) {
      $log.error("GetFirstFourNotationFailure", data);
    };


    vm.GetArticleFromUserProfileSuccess = function (data) {
      //$log.log("GetArticleFromUserProfileSuccess", data);

      vm.public_user.total_article = data.nb_total_articles;

      vm.public_user.first_part_article = [];
      vm.public_user.second_part_article = [];

      //Need to check if the variabl we want to access exist first
      for (var i = 0; i < 2; i++) {
        if (data.articles[i] != undefined)
          vm.public_user.first_part_article[i] = data.articles[i];
      }
      var j = 0;
      for (i = 2; i < 4; i++) {
        if (data.articles[i] != undefined)
          vm.public_user.second_part_article[j] = data.articles[i];
          j++;
      }

      // Call the endpoint to have the notation
       UsersService
         .firstFourNotation
        .get({id: vm.public_user.id})
        .$promise
        .then(vm.GetFirstFourNotationSuccess, vm.GetFirstFourNotationFailure)


    };

    vm.GetArticleFromUserProfileFailure = function (data) {
      $log.error("GetArticleFromUserProfileFailure", data);
      //toastr.error("This is odd...", "Woops...");
    };

    /*Success callback of profile_check*/
    vm.GetPublicUserSuccess = function (data) {
      vm.public_user = data;
      vm.public_user.registered_date = vm.public_user.registered_date.substring(0, 10).replace(/-/g, '/');
      vm.public_user.last_activity_date = vm.public_user.last_activity_date.split('T')[0].replace(/-/g, '/');

      vm.renter_score_array = undefined;
      if (vm.public_user.renter_score != -1) {
        var renter_score = Math.round(vm.public_user.renter_score);
        vm.renter_score_array = [];
        for (i = 0; i < 5; i++) {
          if (i < renter_score)
            vm.renter_score_array.push(true);
          else
            vm.renter_score_array.push(false);
        }
      }

      vm.client_score_array = undefined;
      $log.log("score client = ", vm.public_user);
      if (vm.public_user.tenant_score != -1) {
      var client_score = Math.round(vm.public_user.tenant_score);
      vm.client_score_array = [];
      for (i = 0; i < 5; i++) {
        if (i < client_score)
          vm.client_score_array.push(true);
        else
          vm.client_score_array.push(false);
      }
            }

      //vm.renter_score_array = [true, false, false, false, false];

      //$log.log("ceci est un test",vm.renter_score_array, vm.public_user.renter_score);



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

    /*Adds a new scope to share, and goes to profile_management*/
    vm.goToParameters = function () {
      ScopesService
        .set("user_infos", vm.public_user);
      $state.go("main.profile_management")
    };

    /*vm.public_user initializer*/
    UsersService
      .getPublicUser
      .get({username: $stateParams.username})
      .$promise
      .then(vm.GetPublicUserSuccess, vm.GetPublicUserFailure);
  }
})();
