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
                                 $interval, toastr, ScopesService, URL_API) {

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
      vm.dateStart = new Date(vm.data.availibility_start);
      vm.dateEnd = new Date(vm.data.availibility_end);
      vm.AskBeginLocation = new Date(vm.data.availibility_start);
      vm.AskEndLocation = new Date(vm.data.availibility_end);

      /* Init array questions */
      vm.questions = [];

      /* We create an array for the carousel and the first picture is the thumbnail */
      vm.carousel = [];
      vm.carousel.push(vm.data.url_thumbnail);
      for (i = 0; i < vm.data.url_pictures.length; i++) {
        vm.carousel.push(vm.data.url_pictures[i]);
      }

      $log.log("Url carousel = ", vm.carousel);


      //Nom de la ville si pas connecte ou pas d'addresse dans son compte
      vm.within = "1";
      vm.long = "longitude";
      vm.lat = "latttitude";


      /* Just for test for the moment */
      vm.id_author = "42";
      vm.username_author = "author";
      vm.id = "145454e";


      //Le back renvoie du plus grand au plus petit et uniquement les trois premieres questions
      /* vm.questions = [

       {
       "_id": "56cb3cb1b2bc57ab2908e697",
       "id_author": 42,
       "username_author": "locsapp",
       "content": "What is the breast size ? ",
       "is_visible": true,
       "is_useful": ["sdsgdsgs46887", "sdfdsgsdgds6465464", "sdfdsgsdgds646546478"],
       "date_created": "fausse date",
       "date_modified": "fausse date",
       "response": {
       "_id": "56cb3cb1b2bc57ab2908e698",
       "id_author": 44,
       "username_author": "sylflo",
       "content": "The breast size 95C",
       "is_visible": true,
       "date_created": "fausse date",
       "date_modified": "fausse date"
       },
       "last_versions": [],
       "flagged": null
       },

       {
       "_id": "56cb3cb1b2bc57ab2908e697",
       "id_author": 42,
       "username_author": "locsapp",
       "content": "What is the breast size ? ",
       "is_visible": true,
       "is_useful": ["sdsgdsgs46887"],
       "date_created": "fausse date",
       "date_modified": "fausse date",
       "response": {
       "_id": "56cb3cb1b2bc57ab2908e698",
       "id_author": 44,
       "username_author": "sylflo",
       "content": "The breast size 95C",
       "is_visible": true,
       "date_created": "fausse date",
       "date_modified": "fausse date"
       },
       "last_versions": [],
       "flagged": null
       },
       {
       "_id": "56cb3cb1b2bc57ab2908e697",
       "id_author": 42,
       "username_author": "locsapp",
       "content": "What is the breast size ? ",
       "is_visible": true,
       "is_useful": ["sdsgdsgs46887"],
       "date_created": "fausse date",
       "date_modified": "fausse date",
       "response": {
       "_id": "56cb3cb1b2bc57ab2908e698",
       "id_author": 44,
       "username_author": "sylflo",
       "content": "The breast size 95C",
       "is_visible": true,
       "date_created": "fausse date",
       "date_modified": "fausse date"
       },
       "last_versions": [],
       "flagged": null
       }


       ];*/


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


    //On affiche le show more si il reste des false dans le tableau
    //Et le show more est affiche on derner true du tableau


  }

})();
