(function() {
  'use strict';

  angular
    .module('axis')
    .config(config);

  /** @ngInject */
  function config($logProvider, toastr, $translateProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastr.options.timeOut = 3000;
    toastr.options.positionClass = 'toast-top-right';
    toastr.options.preventDuplicates = true;
    toastr.options.progressBar = true;
    
    $translateProvider.useStaticFilesLoader({
        prefix: 'assets/i18n/',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('en_GB');
    $translateProvider.useSanitizeValueStrategy('sanitize');
  }

})();
