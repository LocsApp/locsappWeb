/**
 * Created by sylflo on 2/26/16.
 */

(function () {

  'use strict';

  angular
    .module('LocsappDirectives')
    .directive('inputComment', inputComment);

  /** @ngInject */
  function inputComment() {

    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {

        elem.bind('keydown', function (event) {
          var code = event.keyCode || event.which;

          if (code === 13) {
            if (!event.shiftKey) {
              event.preventDefault();
              scope.$apply(attrs.inputComment);
            }
          }
        });
      }
    }
  }


})();
