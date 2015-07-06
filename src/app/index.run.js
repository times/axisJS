(function() {
  'use strict';

  angular
    .module('axis')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('Axis loaded.');
  }

})();
