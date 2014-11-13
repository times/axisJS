'use strict';

/**
 * @ngdoc service
 * @name axisJsApp.GenericOutputService
 * @description
 * # GenericOutput
 * Useless service. Meant to be extended.
 */
angular.module('axisJSApp')
  .factory('GenericOutput', function GenericOutput() {
    var generic = {};
    generic.serviceConfig = {
      type: 'save', // Options: 'save' and 'export'
      label: ''
    };
    generic.preprocess = function(){};
    generic.process = function(){};
    generic.complete = function(){};
    generic.export = function(scope){
      var payload = generic.preprocess(scope);
      generic.process(payload);
      generic.complete();
    };

    return generic;
  });
