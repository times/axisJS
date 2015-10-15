(function() {
  'use strict';

  angular
    .module('axis')
    .config(config);

  angular
    .module('axis')
    .factory('$exceptionHandler', exceptionHandlerOverride);

  /**
   * Main application config.
   * @TODO decide whether to use Toastr or not.
   */
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

  /**
   * This overrides the default Angular uncaught exception handling.
   * It basically writes chart config to localStorage so that it doesn't get lost.
   *
   * @TODO put this somewhere more intelligent.
   * @return {void}
   */
  /** @ngInject **/
  function exceptionHandlerOverride($log) {
    return function(exception, cause) {
      exception.message += ' (caused by "' + cause + '")';
      $log.error(exception);

      // Save current config to localStorage.
      try {
        // localStorageService.set('backup_' + Date.now(), $rootScope.main.config);
        // $log.info('localStorage backup successful');
        throw new Error('Backup not yet implemented.');
      } catch(e) {
        $log.warn('Warning: localStorage backup failed');
      }
    };
  }
})();
