/**
 * Created by sylflo on 3/28/16.
 */

(function () {

  'use strict';

  angular
    .module('LocsappDirectives')
    .directive('wrapperOwlCarousel', wrapperOwlCarousel);

  /** @ngInject */
  function wrapperOwlCarousel($log) {

    $log.log("IN wrrapper carousel");

    return {
      restrict: 'E',
      link: function (scope, element, attrs) {
        var options = scope.$eval(angular.element(element).attr('data-options'));
        angular.element(element).owlCarousel(options);
      }
    };
  }

})();
