//Voir pour plus tard les date picker s'ils sont reglable correctements
//Share Faceook pas possible
//Favorites pas encore dans le profil user
// Faire les questions reponses en backend
//Faire le carousel pour les articles

(function () {

  'use strict';

  angular
    .module('LocsappControllers')
    .controller('ArticleShowController', ArticleShowController);

  /** @ngInject */
  function ArticleShowController($log, $mdDialog, $document, ArticleService, $stateParams,
                                 $interval, toastr, ScopesService, URL_API, $sessionStorage, $localStorage, $state) {

    var vm = this;
    vm.url_api = URL_API;
    /* Pagination */
    var pagesShown = 1;
    var pageSize = 1;
    /* Fixtures */
    vm.categories = ScopesService.get("static_collections").base_categories;
    vm.subCategories = ScopesService.get("static_collections").sub_categories;
    vm.genders = ScopesService.get("static_collections").genders;
    vm.sizes = ScopesService.get("static_collections").sizes;
    vm.clothe_colors = ScopesService.get("static_collections").clothe_colors;
    vm.clothe_states = ScopesService.get("static_collections").clothe_states;
    vm.brands = [{_id: "56cb3ef2b2bc57ab2908e6b2", name: "Home made"}];
    vm.payment_methods = ScopesService.get("static_collections").payment_methods;


    //vm.showChildComment = false;
    vm.test_test = ['un', 'deux', 'trois'];
    vm.items = ['../assets/images/users/profile_picture/160281_3_photo_781124_899A08_BD_3.jpg',
      '../assets/images/users/profile_picture/160281_3_photo_781124_899A08_BD_3.jpg'];


    vm.GetInfoArticleSuccess = function (data) {
      vm.article = data.article;
      vm.global_mark = data.global_mark_as_renter;
      vm.nb_mark = data.nb_mark_as_renter;
      $log.log("GetInfoArticleSuccess = ", data);
      //$log.log("get infoi = ", data.article.username_author);

      /* For Debug since the username is mising in the fixtures */
      if (vm.article.username_author == undefined) {
        vm.article.username_author = 'debug username';
      }
      //$log.log("get infoi = ", vm.article.username_author);

      /* For the global notation */
      var global_mark = Math.round(vm.global_mark);
      var global_mark_array = [];
      for (i = 0; i < 5; i++) {
        if (i < global_mark)
          global_mark_array.push(true);
        else
          global_mark_array.push(false);
      }
      vm.global_mark_array = global_mark_array;
      $log.log("global mark array ", vm.global_mark_array);

      /* find the name using the id fixtures */
      vm.name_gender = vm.genders[vm.genders.map(function (x) {
        return x._id;
      }).indexOf(vm.article.gender)].name;

      vm.name_category = vm.categories[vm.categories.map(function (x) {
        return x._id;
      }).indexOf(vm.article.base_category)].name;

      vm.name_subCategory = vm.subCategories[vm.subCategories.map(function (x) {
        return x._id;
      }).indexOf(vm.article.sub_category)].name;
      vm.name_size = vm.sizes[vm.sizes.map(function (x) {
        return x._id;
      }).indexOf(vm.article.size)].name;
      vm.name_clothe_colors = vm.clothe_colors[vm.clothe_colors.map(function (x) {
        return x._id;
      }).indexOf(vm.article.color)].name;
      vm.name_clothe_states = vm.clothe_states[vm.clothe_states.map(function (x) {
        return x._id;
      }).indexOf(vm.article.clothe_condition)].name;
      vm.name_brand = vm.brands[vm.brands.map(function (x) {
        return x._id;
      }).indexOf(vm.article.brand)].name;

      /* We can have several payment so we need to loop in the array */
      vm.name_payment_methods = [];
      for (var i = 0; i < vm.article.payment_methods.length; i++) {
        //$log.log("Data pyament  = ", vm.article.payment_methods);

        vm.name_payment_methods.push(vm.payment_methods[vm.payment_methods.map(function (x) {
          return x._id
        }).indexOf(vm.article.payment_methods[i])].name);
      }

      /* Create date for date picker */
      $log.log(vm.article.availibility_start);
      /*
       vm.dateBeginParts = vm.article.availibility_start.split("/");
       vm.dateEndParts = vm.article.availibility_end.split("/");
       vm.dateStart = new Date(vm.dateBeginParts[2], vm.dateBeginParts[1] - 1, vm.dateBeginParts[0]);
       vm.dateEnd = new Date(vm.dateEndParts[2], vm.dateEndParts[1] - 1, vm.dateEndParts[0]);
       vm.AskBeginLocation = new Date(vm.dateBeginParts[2], vm.dateBeginParts[1] - 1, vm.dateBeginParts[0]);
       vm.AskEndLocation = new Date(vm.dateEndParts[2], vm.dateEndParts[1] - 1, vm.dateEndParts[0]);*/
      vm.dateStart = new Date(vm.article.availibility_start.$date);
      vm.dateEnd = new Date(vm.article.availibility_end.$date);
      if (vm.dateEnd < new Date())
        vm.articleNotAvailable = true;
      if (vm.dateStart < new Date()) {
        delete vm.dateStart;
        vm.dateStart = new Date();
      }
      vm.AskBeginLocation = new Date(vm.dateStart);
      vm.AskEndLocation = new Date(vm.dateStart);

      $log.log("id_author = ", vm.article.id_author);
      //$log.log("ScopesServiece = ",  ScopesService.get("current_user").id);

        if (ScopesService.get("current_user") && ScopesService.get("current_user").id
          &&
          (vm.article.id_author == ScopesService.get("current_user").id))
          vm.ownArticle = true;


      /* Init array questions */
      //$log.log("questions = ", vm.article.questions);
      if (vm.article.questions == undefined)
        vm.questions = "";
      else {
        vm.questions = vm.article.questions;
        vm.answers = new Array(vm.questions.length);
      }

      /* We create an array for the carousel and the first picture is the thumbnail */
      vm.carousel = [];
      vm.carousel.push(vm.url_api + vm.article.url_thumbnail);
      for (i = 0; i < vm.article.url_pictures.length; i++) {
        //$log.log("url API = ", vm.url_api);
        vm.carousel.push(vm.url_api + vm.article.url_pictures[i]);
      }



      //Nom de la ville si pas connecte ou pas d'addresse dans son compte
      vm.within = "1";
      vm.long = "longitude";
      vm.lat = "latttitude";

      // $log.log("TEST = ", vm.url_pictures);

      vm.paginationLimit = function () {
        return pageSize * pagesShown;
      };

      vm.hasMoreItemsToShow = function () {
        return pagesShown < (vm.questions.length / pageSize);
      };

      vm.showMoreItems = function () {
        pagesShown = pagesShown + 1;
      };

    };

    vm.getInfoArticleFailure = function (data) {
      $log.error("error", data)
    };

    ArticleService
      .getArticle
      .get({id: $stateParams.id})
      .$promise
      .then(vm.GetInfoArticleSuccess, vm.getInfoArticleFailure);


    vm.sendReportSuccess = function () {
      toastr.success("Report sent", "Success!");
    };

    vm.sendReportError = function (data) {
      toastr.error("An error occurred", "Error");
      $log.log("sendReport Error", data);
    };

    vm.sendReport = function () {

      $log.log("Send report = id", $stateParams.id);

      ArticleService
        .sendReport
        .save({"article_id": $stateParams.id})
        .$promise
        .then(vm.sendReportSuccess, vm.sendReportError);

    };

    vm.reply = function () {
      //Show the new input

    };


    vm.submitComment = function (comment) {
      // SI on a clique sur shit on veut revenir a ligne
      //SINON on envoie le commentaire direcment1
      $log.log("Send form", vm.parentNewComment, comment);
      //vm.parentNewComment += '\n toto';
      if (comment === "")
        toastr.error("there is nothing in your comment", "Error");
      else
        toastr.success("comment sent", "Success!");
    };

    /*Function to ask for rent*/
    vm.askForRent = function () {
      ArticleService
        .demands
        .save({
          "id_target": vm.article.id_author,
          "name_target": vm.username_author,
          "id_article": vm.article._id,
          "availibility_start": vm.AskBeginLocation,
          "availibility_end": vm.AskEndLocation,
          "article_name": vm.article.title,
          "article_thumbnail_url": vm.article.url_thumbnail,
          "author_name": ScopesService.get("current_user").username,
          "author_notation": ScopesService.get("current_user").notation_renting || -1
        })
        .$promise
        .then(function () {
            toastr.success("Your demand has been sent!", "Success !");
          },
          function (data) {
            if (data.article.error)
              toastr.error(data.article.error, "Woops...");
            else
              toastr.error("An error occured while sending the demand", "Woops...");
            $log.log(data);
          })
    };

    /*Dialog to ask to rent the article*/
    /** @ngInject */
    vm.askRentDialog = function (event) {
      $mdDialog.show({
        controller: vm.askRentController,
        controllerAs: 'askRent',
        templateUrl: 'app/templates/dialogTemplates/askRent.tmpl.html',
        locals: {
          user_id: $localStorage.id || $sessionStorage.id,
          author_id: vm.author_id,
          article_id: $stateParams.id,
          article_name: vm.article.title,
          article_date_begin: vm.article.availibility_start,
          article_date_end: vm.article.availibility_end
        },
        bindToController: true,
        parent: angular.element($document.body),
        targetEvent: event,
        clickOutsideToClose: true
      }).then(function () {
        $log.log("finished");
      });
    };

    /*askRentDialog Controller*/
    /** @ngInject */
    vm.askRentController = function ($mdDialog) {
      var vm = this;

      /*Hide callback for $mdDialog*/
      vm.hide = function () {
        $mdDialog.hide(vm.user);
      };
    };

    //On affiche le show more si il reste des false dans le tableau
    //Et le show more est affiche on derner true du tableau

    vm.sendQuestionSuccess = function () {

      toastr.success("Your questions has been sent", "Success!");
      // $log.log("sendQuestiopnSuccess = ", data);
      $state.go($state.$current, null, {reload: true});

    };

    vm.sendQuestionError = function (data) {
      $log.error("sendQuestionError= ", data);
      toastr.error("Something went wrong", "Error!");
    };

    vm.sendQuestion = function () {

      if (vm.askQuestion != undefined) {

        ArticleService
          .questions
          .save({
            "content": vm.askQuestion,
            "id_article": $stateParams.id
          })
          .$promise
          .then(vm.sendQuestionSuccess, vm.sendQuestionError)

      }
      else {
        toastr.error("Your question can't be empty", "Error!");
      }
    };

    vm.sendAnswerError = function (data) {
      toastr.error("Something went wrong", "Error!");
      $log.error("sendAnswerError", data);
    };

    vm.sendAnswerSuccess = function () {

      toastr.success("Your answer has been sent", "Success!");
      // $log.log("sendQuestiopnSuccess = ", data);
      $state.go($state.$current, null, {reload: true});
    };

    vm.sendAnswer = function (idQuestion, answer) {
      if (answer != undefined) {
        ArticleService
          .answers
          .save({
            "response": answer,
            "id_question": idQuestion
          })
          .$promise
          .then(vm.sendAnswerSuccess, vm.sendAnswerError)
      }

      else {
        toastr.error("Your answer can't be empty", "Error!");
      }
    };

    vm.upVoteSuccess = function (data) {
      toastr.success("Your upvote has been sent", "Success!");
      $state.go($state.$current, null, {reload: true});
      $log.log("upVoteSuccess = ", data);
    };

    vm.upVoteError = function (data) {
      $log.error("upVoteError", data);
      if (data.status == 403)
        toastr.error(data.article.Error, "Error!");
      else
        toastr.error("Something went wrong", "Error!");
    };

    vm.upVote = function (idQuestion) {
      ArticleService
        .upVote
        .save({
          "id_question": idQuestion
        })
        .$promise
        .then(vm.upVoteSuccess, vm.upVoteError);
    };

    /* Report */
    vm.reportSuccess = function (data) {
      toastr.success("Your report has been sent", "Success!");
      $state.go($state.$current, null, {reload: true});
      $log.log("reportSuccess = ", data);
    };

    vm.reportError = function (data) {
      $log.error("reportError", data);
      if (data.status == 403)
        toastr.error(data.article.Error, "Error!");
      else
        toastr.error("Something went wrong", "Error!");
    };

    vm.report = function (idQuestion) {
      ArticleService
        .reportQuestion
        .save({
          "id_question": idQuestion
        })
        .$promise
        .then(vm.reportSuccess, vm.reportError);
    };

    vm.addArticleToFavoriteSuccess = function (data) {
      toastr.success("This article has been added to your favorite", "Success!");
      $state.go($state.$current, null, {reload: true});
      $log.log("addArticleToFavoriteSuccess = ", data);
    };

    vm.addArticleToFavoriteError = function (data) {
      $log.error("addArticleToFavoriteError", data);
      toastr.error(data.article.error, "Error!");
    };

    vm.addArticleToFavorite = function (idArticle) {
      ArticleService
        .articlesFavorite
        .save({
          "id_article": idArticle
        })
        .$promise
        .then(vm.addArticleToFavoriteSuccess, vm.addArticleToFavoriteError)
    }


  }

})();
