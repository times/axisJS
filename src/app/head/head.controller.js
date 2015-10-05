/**
 * @ngdoc function
 * @name AxisJS.controller:HeadController
 * @description
 * # HeadController
 * Adds stylesheets, fonts and other stuff in the `<head>` section.
 */

(function() {
  'use strict';

  angular
    .module('axis')
    .controller('HeadController', HeadController);

  /** @ngInject */
  function HeadController($scope, configProvider) {
    var head = this;
    
    configProvider.then(function(appConfig){
      head.conf = appConfig;
      head.stylesheet = typeof appConfig.stylesheet !== 'undefined' ? appConfig.stylesheet : '';
      head.fonts = typeof appConfig.fonts !== 'undefined' ? appConfig.fonts : [];
    });
  }
})();
