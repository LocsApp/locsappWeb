/**
 * Created by sylflo on 13/07/16.
 */
(function () {

  'use strict';

  angular
    .module('LocsappDirectives')
    .directive('phoneNumberFormValidator', phoneNumberFormValidator);

  /** @ngInject */
  function phoneNumberFormValidator() {
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

            var valid = true;
            var acceptNumber = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

            if (value.length != 10 || value[0] != '0') {
              valid = false;
            }

            for (var i = 0; i < value.length; i++) {
                if (!(value[i] in acceptNumber)) {
                  valid = false;
                }
            }

            // test and set the validity after update.
            //var valid = value.charAt(0) == 'A' || value.charAt(0) == 'a';
            ctrl.$setValidity('phoneNumber', valid);

          }

          // if it's valid, return the value to the model,
          // otherwise return undefined.
          return valid ? value : undefined;
        });

      }
    }
  }


})();
