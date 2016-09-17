(function() {
  'use strict';

  angular
    .module('LocsappDirectives')
    .directive('menuLink', menuLink);

  function menuLink() {

    return {
        scope: {
          section: '='
        },
        templateUrl: 'app/components/menuLink/menuLink.tmpl.html',
        link: function ($scope, $element) {
          var controller = $element.parent().controller();

          $scope.focusSection = function () {
            // set flag to be used later when
            // $locationChangeSuccess calls openPage()
            controller.autoFocusContent = true;
          };
        }
      };

  }
});
