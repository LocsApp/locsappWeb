/**
 * Created by sylflo on 3/28/16.
 */

(function () {

  'use strict';

  angular
    .module('LocsappDirectives')
    .directive('owlCarousel', owlCarousel);

  /** @ngInject */
  function owlCarousel() {

    return {
      restrict: 'E',
      transclude: false,
      link: function (scope) {
        scope.initCarousel = function (element) {
          // provide any default options you want
          var defaultOptions = {};
          var customOptions = scope.$eval(angular.element(element).attr('data-options'));
          // combine the two options objects
          for (var key in customOptions) {
            defaultOptions[key] = customOptions[key];
          }
          // init carousel
          angular.element(element).owlCarousel(defaultOptions);
        };
      }
    };
  }


  angular
    .module('LocsappDirectives')
    .directive('owlCarouselItem', function () {
      return {
        restrict: 'A',
        transclude: false,
        link: function (scope, element) {
          // wait for the last item in the ng-repeat then call init
          if (scope.$last) {
            scope.initCarousel(element.parent());
          }
        }
      };
    });


})();
