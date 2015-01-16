'use strict';
/*global jsyaml*/
/**
 * @ngdoc service
 * @name axisJsApp.configProvider
 * @description
 * # configProvider
 * Provider in the axisJsApp.
 */
angular.module('axisJSApp')
  .provider('configProvider', function () {
    var userConfigFile = 'config.yaml';
    return {
      setConfigFile: function(value) {
        userConfigFile = value;
      },
      $get: function($http, $q) {
        var defaultConfig = $http.get('default.config.yaml');
        var userConfig = $http.get(userConfigFile).then(
          function(response){
            return response.data;
          },
          function(response){
            if( response.status === 404 ) {
                response.data = {};
                return response;
            }
            else {
                return $q.reject(response);
            }
          }
        );

        return $q.all([defaultConfig, userConfig]).then(function(values){
          var defaultConfigYaml = jsyaml.safeLoad(values[0].data);
          var userConfigYaml = jsyaml.safeLoad(values[1]);
          // Oddly, js-yaml returns string 'undefined' on fail and not type undefined
          userConfigYaml = userConfigYaml !== 'undefined' ? userConfigYaml : {};
          return angular.extend(defaultConfigYaml, userConfigYaml);
        });
      }
    };
  })
  .config(['configProviderProvider', function(configProviderProvider){ // "Natascha! Launch the anti-anti-missile-missile missile!"
    var config = window.location.href.match(/config=([a-z]+)/i);
    if (config && config.length > 0) {
      configProviderProvider.setConfigFile('themes/' + config[1] + '.config.yaml');
    }
  }]);
