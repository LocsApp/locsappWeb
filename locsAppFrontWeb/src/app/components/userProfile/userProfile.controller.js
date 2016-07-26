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

    vm.GetFirstFourNotationSuccess = function(data) {
      $log.log("GetFirstFourNotationSuccess = ", data);

        vm.renter_notation = data.renter_notation;
        vm.client_notation = data.client_notation;
        vm.nb_rotation_renter = data.nb_notation_renter;
        vm.nb_notation_client = data.nb_notation_client;


        for (var i = 0; i < vm.renter_notation.length; i++) {
            var score = Math.round(vm.renter_notation[i].value);
            var score_array = [];

            for (var j = 0; j < 5; j++) {
              if (j < score)
                score_array.push(true);
              else
                score_array.push(false);
            }
            vm.renter_notation[i].score = score_array;

        }

        for (var i = 0; i < vm.client_notation.length; i++) {
            var score = Math.round(vm.client_notation[i].value);
            var score_array = [];

            for (var j = 0; j < 5; j++) {
              if (j < score)
                score_array.push(true);
              else
                score_array.push(false);
            }
            vm.client_notation[i].score = score_array;

        }

    };

    vm.GetFirstFourNotationFailure = function(data) {
      $log.error("GetFirstFourNotationFailure", data);
    };


    vm.GetArticleFromUserProfileSuccess = function (data) {
      //$log.log("GetArticleFromUserProfileSuccess", data);

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

      // Call the endpoint to have the notation
       UsersService
         .firstFourNotation
        .get({id: vm.user.id})
        .$promise
        .then(vm.GetFirstFourNotationSuccess, vm.GetFirstFourNotationFailure)


    };

    vm.GetArticleFromUserProfileFailure = function (data) {
      $log.error("GetArticleFromUserProfileFailure", data);
      //toastr.error("This is odd...", "Woops...");
    };

    /*Success callback of profile_check*/
    vm.GetInfosUserSuccess = function (data) {
      vm.user = data;
      vm.user.registered_date = vm.user.registered_date.substring(0, 10).replace(/-/g, '/');
      vm.user.last_activity_date = vm.user.last_activity_date.split('T')[0].replace(/-/g, '/');

      vm.renter_score_array = undefined;
      if (vm.user.renter_score != -1) {
        var renter_score = Math.round(vm.user.renter_score);
        vm.renter_score_array = [];
        for (i = 0; i < 5; i++) {
          if (i < renter_score)
            vm.renter_score_array.push(true);
          else
            vm.renter_score_array.push(false);
        }
      }

      vm.client_score_array = undefined;
      $log.log("score client = ", vm.user);
      if (vm.user.tenant_score != -1) {
      var client_score = Math.round(vm.user.tenant_score);
      vm.client_score_array = [];
      for (i = 0; i < 5; i++) {
        if (i < client_score)
          vm.client_score_array.push(true);
        else
          vm.client_score_array.push(false);
      }
            }

      //vm.renter_score_array = [true, false, false, false, false];

      //$log.log("ceci est un test",vm.renter_score_array, vm.user.renter_score);



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
