(function() {
  'use strict';

  angular
    .module('axis')
    .config(config);

  /** @ngInject */
  function config($logProvider, toastr, $translateProvider, $tooltipProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Toastr options (currently unused)
    toastr.options.timeOut = 3000;
    toastr.options.positionClass = 'toast-top-right';
    toastr.options.preventDuplicates = true;
    toastr.options.progressBar = true;
    
    // Translation options
    $translateProvider.useStaticFilesLoader({
        prefix: 'assets/i18n/',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('en_GB');
    $translateProvider.useSanitizeValueStrategy('sanitize');
    
    // Popover options
    $tooltipProvider.options({trigger: 'mouseenter'});
  }

})();
