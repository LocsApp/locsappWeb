/**
 * Created by sylflo on 3/28/16.
 */

(function () {

  'use strict';

  angular
    .module('LocsappDirectives')
    .directive('wrapperOwlCarousel', wrapperOwlCarousel);

  /** @ngInject */
  function wrapperOwlCarousel() {
    return {
      restrict: 'E',
      link: function (scope, element, attrs) {
        var options = scope.$eval($(element).attr('data-options'));
        $(element).owlCarousel(options);
      }
    };
  }

})();
