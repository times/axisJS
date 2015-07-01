/**
 * @ngdoc service
 * @name axis.genericOutput
 * @description
 * # genericOutput
 * Output service primitive. Useless as-is; meant to be extended.
 */

(function(){
  'use strict';

  angular
    .module('axis')
    .factory('genericOutput', genericOutput);
  
  function genericOutput() {
    /**
     * Output service configuration options (currently unused)
     * @type {Object}
     */
    this.serviceConfig = {
      type: 'save', // Options: 'save' and 'export'
      label: ''
    };

    /**
     * Preprocess the data before sending somewhere
     * @param  {Object} scope Axis scope object.
     * @return {Object}       Updated scope object.
     */
    this.preprocess = function(scope){
      return scope;
    };
    
    /**
     * Sends output from preprocess somewhere
     * @param  {Object} payload Payload for server or whatever.
     * @return {Object}         Response from server or whatever.
     */
    this.process = function(payload){
      return payload;
    };

    /**
     * Fires once process is complete.
     * @param  {Object} output Response from server or whatever
     * @return {Object}        Whatever final transformations before passing back
     */
    this.complete = function(output){
      return output; // This generally doesn't return anything, but is doing so for tests in this case.
    };

    /**
     * Passes a scope into the service, manipulates it, sends it somewhere, etc.
     * @param  {Object} scope Axis scope object.
     * @return {Object}       Output from the genericOutput.complete stage.
     */
    this.export = function(scope){
      var payload = this.preprocess(scope);
      var output = this.process(payload);
      return this.complete(output);
    };

    return this;
  }
})();