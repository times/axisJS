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
    this.$get = function axisJSConfig($http, $q) {
      var defaultConfig = $http.get('default.config.yaml');
      var userConfig = $http.get('config.yaml').then(
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
        var userConfigYaml = jsyaml.safeLoad(values[1].data);

        // Oddly, js-yaml returns string 'undefined' on fail and not type undefined
        userConfigYaml = userConfigYaml !== 'undefined' ? userConfigYaml : {};

        return angular.extend(defaultConfigYaml, userConfigYaml);
      });
    };
  });
