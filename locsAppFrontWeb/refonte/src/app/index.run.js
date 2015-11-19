(function() {
  'use strict';

  angular
	.module('locsapp')
	.run(runBlock);

  /** @ngInject */
  function runBlock($http) {
    //Automatize send of Csrf token
    $http.defaults.xsrfHeaderName = 'X-CSRFToken';
    $http.defaults.xsrfCookieName = 'csrftoken';
  }

})();
