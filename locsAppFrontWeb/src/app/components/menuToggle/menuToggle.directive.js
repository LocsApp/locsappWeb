(function () {
  'use strict';

  angular
    .module('LocsappDirectives')
    .directive('menuToggle', menuToggle);

  function menuToggle($log) {

    return {
      scope: {
        section: '='
      },
      templateUrl: 'app/components/menuToggle/menuToggle.tmpl.html',
      link: function ($scope, $element) {
        var controller = $element.parent().controller();
        $scope.isOpen = function () {
          return controller.isOpen($scope.section);
          //$log.log("menuToggle isOpen");
        };
        $scope.toggle = function () {
          //$log.log("menuToggle toggle");
          controller.toggleOpen($scope.section);
        };
      }
    };

  }
})();
