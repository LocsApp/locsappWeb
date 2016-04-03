/**
 * Created by sylflo on 3/28/16.
 */

(function () {

  'use strict';

  angular
    .module('LocsappDirectives')
    .directive('wrapOwlcarousel', wrapOwlcarousel);

  /** @ngInject */
  function wrapOwlcarousel($log) {

    $log.log("IN wrrapper carousel");

    return {

      restrict: 'E',

      link: function (scope, element, attrs) {

        var options = scope.$eval($(element).attr('data-options'));

        $(element).owlCarousel(options);

      }

    };
  }

})();
