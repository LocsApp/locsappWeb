(function() {
  'use strict';

  angular
	.module('locsapp')
	.run(runBlock);

  /** @ngInject */
  function runBlock($http, $cookies) {
    //Automatize send of Csrf token
    $http.defaults.xsrfHeaderName = 'X-CSRFToken';
    $http.defaults.xsrfCookieName = 'csrftoken';
  }

})();
