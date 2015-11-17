(function() {
  'use strict';

  angular
    .module('refonte')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
