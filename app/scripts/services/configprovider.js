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
      var appConfig = $q.defer();

      $http.get('config.yaml').success(function(data){
        appConfig.resolve(jsyaml.safeLoad(data));
      });

      return appConfig.promise;
    };
  });
