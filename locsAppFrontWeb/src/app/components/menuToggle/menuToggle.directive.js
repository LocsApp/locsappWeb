(function() {
  'use strict';

  angular
    .module('LocsappDirectives')
    .directive('menuToggle', menuToggle);

  function menuToggle() {

     return {
          scope: {
            section: '='
          },
          templateUrl: 'app/components/menuToggle/menuToggle.tmpl.html',
          link: function($scope, $element) {
            var controller = $element.parent().controller();
            $scope.isOpen = function() {
              return controller.isOpen($scope.section);
            };
            $scope.toggle = function() {
              controller.toggleOpen($scope.section);
            };
          }
         };

  }
});
