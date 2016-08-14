/**
 * Created by sylflo on 13/07/16.
 */

(function () {

  'use strict';

  angular
    .module('LocsappDirectives')
    .directive('birthdateFormValidator', birthdateFormValidator);


  function isValidDate(date) {

    var matches = /(\d{4})[-\/](\d{2})[-\/](\d{2})/.exec(date);
    if (matches == null) return false;

    var year = matches[1];
    var month = matches[2] - 1;
    var day = matches[3];

    var composedDate = new Date(year, month, day);
    return composedDate.getDate() == day &&
      composedDate.getMonth() == month &&
      composedDate.getFullYear() == year;
  }

  /** @ngInject */
  function birthdateFormValidator() {
    return {
      // restrict to an attribute type.
      restrict: 'A',
      // element must have ng-model attribute.
      require: 'ngModel',
      link: function (scope, ele, attrs, ctrl) {

        // add a parser that will process each time the value is
        // parsed into the model when the user updates it.
        ctrl.$parsers.unshift(function (value) {
          if (value) {

            var valid = isValidDate(value);

            if (value.length != 10) {
              valid = false;
            }

            ctrl.$setValidity('birthdate', valid);

          }

          // if it's valid, return the value to the model,
          // otherwise return undefined.
          return valid ? value : undefined;
        });

      }
    }
  }


})();
