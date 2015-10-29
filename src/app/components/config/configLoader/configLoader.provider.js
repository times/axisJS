/**
 * @ngdoc service
 * @name axis.configProvider
 * @description
 * # configProvider
 * Loads default.config.yaml and overrides values from that based on user config.
 * The (empty) config.yaml is used if no config option is set in localStorage.
 * Otherwise it attempts to load whatever value is stored as "config" in localStorage.
 */

(function(){
  'use strict';

  angular
    .module('axis')
    .provider('configProvider', configProvider);

  /** @ngInject */
  function configProvider() {
    return {
      $get: function($http, $q, localStorageService, $window) {
        var jsyaml = $window.jsyaml;

        var defaultConfigFile = localStorageService.get('defaultConfig') ? localStorageService.get('defaultConfig') : 'default.config.yaml';
        var defaultConfig = $http.get(defaultConfigFile).then(
          function(response){
            return response;
          },
          function(response){
            if (response.status === 404) {
              return $http.get('default.config.yaml');
            } else {
              return $q.reject(response);
            }
          }
        );

        var userConfigFile = localStorageService.get('config') ? localStorageService.get('config') : 'config.yaml';
        var userConfig = $http.get(userConfigFile).then(
          function(response){
            return response;
          },
          function(response){
            if (response.status === 404) {
              response = {};
              return response;
            } else {
              return $q.reject(response);
            }
          }
        );

        return $q.all([defaultConfig, userConfig]).then(function(values){
          var defaultConfigYaml = jsyaml.safeLoad(values[0].data);
          console.dir(defaultConfigYaml);
          var userConfigYaml = jsyaml.safeLoad(values[1].data);
          console.dir(userConfigYaml);
          var axisConfig;

          // Oddly, js-yaml returns string 'undefined' on fail and not type undefined
          userConfigYaml = userConfigYaml !== 'undefined' ? userConfigYaml : {};
          axisConfig = angular.extend({}, defaultConfigYaml, userConfigYaml);
          console.dir(axisConfig);

          axisConfig.framework = axisConfig.renderer; // Needed for backwards compat.
          return axisConfig;
        },
        function(err){ // Return default on failure.
          console.dir(err);
        });
      }
    };
  }
})();
