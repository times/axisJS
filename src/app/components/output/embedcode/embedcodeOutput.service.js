/**
 * @ngdoc service
 * @name axis.embedcodeOutput
 * @description
 * # embedcodeOutput
 * Factory to generate embed codes via a modal window.
 */

(function(){
  'use strict';

  angular
    .module('axis')
    .factory('embedcodeOutput', embedcodeOutput);

  /** @ngInject */
  function embedcodeOutput(genericOutput, chartService, $modal, $window) {
    var embed = angular.copy(genericOutput);
    var JSONfn = $window.JSONfn;

    /**
     * Service name
     * @type {String}
     */
    embed.name = 'embedcodeOutputService';

    /**
     * Service config. This isn't really used yet.
     * @type {Object}
     */
    embed.serviceConfig = {
      type: 'export', // Options: 'save' and 'export'.
      label: 'Generate embed code' // Label to use on button.
    };

    /**
     * Preprocess scope
     * @param  {Object} scope Axis MainCtrl scope
     * @return {object}       Chart config and deps.
     */
    embed.preprocess = function(mainScope){
      var chartConfig = angular.copy(mainScope.config); // Needs to copy or else scope breaks. See #45.
      chartConfig.bindto = '#chart-' + Math.floor((Math.random()*10000)+1);
      return {
        config: chartConfig,
        dependencies: chartService(mainScope.appConfig).dependencies
      };
    };

    /**
     * Process request.
     * @param  {Object} payload Needs config and dependencies.
     * @return {Object}         Embed code output with depenencies (complete) and not (partial).
     */
    embed.process = function(payload) {
      var output = {};
      var deps = [];
      var code = [];
      var config = JSONfn.stringify(payload.config);

      // Needs to be above script declarations.
      deps.push('<div id="' + payload.config.bindto.replace('#', '') + '"></div>');

      angular.forEach(payload.dependencies.css, function(v) {
        deps.push('<link rel="stylesheet" href="' + v + '" />');
      });

      angular.forEach(payload.dependencies.js, function(v) {
        deps.push('<script src="' + v + '"></script>');
      });

      code.push(
        '<script type="text/javascript">(function(){',
          'var configJSON = ' + config + ';',
          'var fixJson = function(obj){for(var i in obj)obj.hasOwnProperty(i)&&("string"==typeof obj[i]&&obj[i].match(/^function/)?obj[i]=eval("("+obj[i]+")"):"object"==typeof obj[i]&&fixJson(obj[i]));return obj};',
          'var config = fixJson(configJSON);',
          'c3.generate(config);',
        '})();</script>'
      );

      output.complete = deps.concat(code).join('\n'); // TODO figure out how to pretty-print.
      output.partial = [deps[0]].concat(code).join('\n');

      return output;
    };

    /**
     * Open a modal with the complete embed code.
     * @param  {string} output Rendered output
     * @return {embedModal}        Embed Modal
     *
     * @NB Istanbul instrumentation disabled until I can figure how to mock $modal here.
     */
    embed.complete = function(output) {
      /* istanbul ignore next */
      $modal.open({
        templateUrl: 'app/components/output/embedcode/embedcode.modal.html',
        controller: 'EmbedcodeOutputController as embed',
        resolve: {
          output: function(){
            return output;
          }
        }
      });
    };

    return embed;
  }


  angular
    .module('axis')
    .controller('EmbedcodeOutputController', EmbedcodeOutputController);

  function EmbedcodeOutputController(output) {
    var vm = this;
    vm.includeDeps = true;
    vm.output = vm.includeDeps ? output.complete : output.partial;
    vm.updateOutput = function(deps) {
      if (deps) {
        vm.output = output.complete;
      } else {
        vm.output = output.partial;
      }
    };
  }
})();
