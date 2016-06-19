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
                                 $interval, toastr, ScopesService, URL_API, $sessionStorage, $localStorage) {

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
      vm.data = data;

      /* find the name using the id fixtures */
      vm.name_gender = vm.genders[vm.genders.map(function (x) {
        return x._id;
      }).indexOf(vm.data.gender)].name;
      vm.name_category = vm.categories[vm.categories.map(function (x) {
        return x._id;
      }).indexOf(vm.data.base_category)].name;
      vm.name_subCategory = vm.subCategories[vm.subCategories.map(function (x) {
        return x._id;
      }).indexOf(vm.data.sub_category)].name;
      vm.name_size = vm.sizes[vm.sizes.map(function (x) {
        return x._id;
      }).indexOf(vm.data.size)].name;
      vm.name_clothe_colors = vm.clothe_colors[vm.clothe_colors.map(function (x) {
        return x._id;
      }).indexOf(vm.data.color)].name;
      vm.name_clothe_states = vm.clothe_states[vm.clothe_states.map(function (x) {
        return x._id;
      }).indexOf(vm.data.clothe_condition)].name;
      vm.name_brand = vm.brands[vm.brands.map(function (x) {
        return x._id;
      }).indexOf(vm.data.brand)].name;

      /* We can have several payment so we need to loop in the array */
      vm.name_payment_methods = [];
      for (var i = 0; i < vm.data.payment_methods.length; i++) {
        //$log.log("Data pyament  = ", vm.data.payment_methods);

        vm.name_payment_methods.push(vm.payment_methods[vm.payment_methods.map(function (x) {
          return x._id
        }).indexOf(vm.data.payment_methods[i])].name);
      }

      /* Create date for date picker */
      $log.log(vm.data.availibility_start)
      /*
      vm.dateBeginParts = vm.data.availibility_start.split("/");
      vm.dateEndParts = vm.data.availibility_end.split("/");
      vm.dateStart = new Date(vm.dateBeginParts[2], vm.dateBeginParts[1] - 1, vm.dateBeginParts[0]);
      vm.dateEnd = new Date(vm.dateEndParts[2], vm.dateEndParts[1] - 1, vm.dateEndParts[0]);
      vm.AskBeginLocation = new Date(vm.dateBeginParts[2], vm.dateBeginParts[1] - 1, vm.dateBeginParts[0]);
      vm.AskEndLocation = new Date(vm.dateEndParts[2], vm.dateEndParts[1] - 1, vm.dateEndParts[0]);*/
      vm.dateStart = new Date(vm.data.availibility_start.$date)
      vm.dateEnd = new Date(vm.data.availibility_end.$date)
      if (vm.dateEnd < new Date())
        vm.articleNotAvailable = true;
      if (vm.dateStart < new Date())
      {
        delete vm.dateStart;
        vm.dateStart = new Date();
      }
      vm.AskBeginLocation = new Date(vm.dateStart)
      vm.AskEndLocation = new Date(vm.dateStart)

      if (vm.data.id_author == ScopesService.get("current_user").id)
        vm.ownArticle = true;

      /* Init array questions */
      vm.questions = [];

      /* We create an array for the carousel and the first picture is the thumbnail */
      vm.carousel = [];
      vm.carousel.push(vm.url_api + vm.data.url_thumbnail);
      for (i = 0; i < vm.data.url_pictures.length; i++) {
        //$log.log("url API = ", vm.url_api);
        vm.carousel.push(vm.url_api + vm.data.url_pictures[i]);
      }


      vm.getSellerSuccess = function (data) {
        vm.author_id = data._id;
        vm.username_author = data.username;
        vm.nb_renter_notation = data.notation_renter;

      };

      vm.getSellerFailure = function () {
        toastr.error("there was an error when retrieving the seller.\n Please reload the page", "Error");
      };

      /* We did a request to get the username of the vendor and his notation as a vendor */
      ArticleService
        .getSeller
        .get({id: vm.data.id_author})
        .$promise
        .then(vm.getSellerSuccess, vm.getSellerFailure);

      //Nom de la ville si pas connecte ou pas d'addresse dans son compte
      vm.within = "1";
      vm.long = "longitude";
      vm.lat = "latttitude";


      /* Just for test for the moment */
      vm.id_author = "42";
      //vm.username_author = "author";
      //vm.id = "145454e";


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
    vm.askForRent = function()
    {
      ArticleService
      .demands
      .save({
      "id_target": vm.data.id_author,
      "name_target": vm.username_author,
      "id_article": vm.data._id,
      "availibility_start": vm.AskBeginLocation,
      "availibility_end": vm.AskEndLocation,
      "article_name": vm.data.title,
      "article_thumbnail_url": vm.data.url_thumbnail,
      "author_name": ScopesService.get("current_user").username,
      "author_notation": ScopesService.get("current_user").notation_renting || -1})
      .$promise
      .then(function () {
        toastr.success("Your demand has been sent!", "Success !");
      },
      function (data) {
        if (data.data.error)
          toastr.error(data.data.error, "Woops...");
        else
          toastr.error("An error occured while sending the demand", "Woops...");
        $log.log(data);
      })
    }

    /*Dialog to ask to rent the article*/
    /** @ngInject */
    vm.askRentDialog = function (event) {
      $mdDialog.show({
        controller: vm.askRentController,
        controllerAs: 'askRent',
        templateUrl: 'app/templates/dialogTemplates/askRent.tmpl.html',
        locals: {user_id: $localStorage.id || $sessionStorage.id, author_id: vm.author_id, article_id: $stateParams.id, article_name: vm.data.title, article_date_begin: vm.data.availibility_start, article_date_end: vm.data.availibility_end},
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


  }

})();
