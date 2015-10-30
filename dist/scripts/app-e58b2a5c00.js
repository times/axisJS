(function() {
  'use strict';

  angular
    .module('axis', [
      'ngAnimate', 
      'ngResource', 
      'ngTouch', 
      'ngSanitize', 
      'ui.router', 
      'ui.bootstrap',
      'minicolors',
      'ngAside',
      'ngHandsontable',
      'LocalStorageModule',
      'pascalprecht.translate'
    ]);

})();

/**
 * @ngdoc service
 * @name axis.wordpressOutput
 * @description
 * # wordpressOutput
 * Handles migrating data to and from AxisWP.
 */

(function(){
  'use strict';

  angular
    .module('axis')
    .factory('wordpressOutput', wordpressOutput);

  /** @ngInject */
  function wordpressOutput(genericOutput, $http, $window) {
    function WordPressOutputServiceException(data, status, headers, config) {
      this.name = 'WordPressOutputServiceException';
      this.message = 'WordPressOutputServiceException: ' + status;
      this.data = data;
      this.status = status;
      this.headers = headers;
      this.config = config;
    }
    WordPressOutputServiceException.prototype = new Error();
    WordPressOutputServiceException.prototype.constructor = WordPressOutputServiceException;

    var wordpress = angular.copy(genericOutput);

    wordpress.serviceConfig = {
      type: 'export', // Options: 'save' and 'export'.
      label: 'Save to WordPress' // Label to use on button.
    };

    wordpress.preprocess = function(scope){
      var chartConfig = angular.copy(scope.config);
      chartConfig.axis.x.tick.format = chartConfig.axis.x.tick.format.toString();
      chartConfig.axis.y.tick.format = chartConfig.axis.y.tick.format.toString();
      chartConfig.axis.y2.tick.format = chartConfig.axis.y2.tick.format.toString();
      chartConfig.pie.label.format = chartConfig.pie.label.format.toString();
      chartConfig.donut.label.format = chartConfig.donut.label.format.toString();
      chartConfig.gauge.label.format = chartConfig.gauge.label.format.toString();
      var axisConfig = String(angular.toJson(chartConfig));
      var axisChart = String(angular.element('.savePNG').attr('href'));
      var axisWP = parent.tinymce.activeEditor.windowManager.getParams().axisWP;
      return {
        action: 'insert_axis_attachment',
        axisConfig: axisConfig,
        axisChart: axisChart,
        parentID: axisWP.parentID
      };
    };

    wordpress.process = function(payload){
      // Have WordPress process the data-URI PNG and return some config data
      $http.post(parent.ajaxurl, payload, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}, // $http sends as JSON, WP expects form.
        transformRequest: function(obj) { // Via http://stackoverflow.com/a/19270196/467760
          var str = [];
          for (var key in obj) {
            /* istanbul ignore next */
            if (obj[key] instanceof Array) { // Transform array into flat object.
              for(var idx in obj[key]){
                var subObj = obj[key][idx];
                for(var subKey in subObj){
                  str.push(encodeURIComponent(key) + '[' + idx + '][' + encodeURIComponent(subKey) + ']=' + encodeURIComponent(subObj[subKey]));
                }
              }
            } else { // Already flat; just push key-value pairs.
              str.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
            }
          }
          return str.join('&');
        }
      })
      .success(function(res){
        res = angular.fromJson(res);
        parent.tinymce.activeEditor.insertContent('<div class="mceNonEditable"><img width="100%" src="' + res.attachmentURL + '?' + new Date().getTime() + '" data-axisjs=\'' + window.btoa(angular.toJson(res)) + '\' class="mceItem axisChart" /></div><br />');
        parent.tinymce.activeEditor.windowManager.close();
      })
      .error(function(data, status, headers, config){
        throw new WordPressOutputServiceException(data, status, headers, config);
      });
    };

    wordpress.export = function(scope){
      var payload = wordpress.preprocess(scope);
      wordpress.process(payload);
      wordpress.complete();
    };

    wordpress.import = function(inputService){
      if (typeof parent.tinymce !== 'undefined' && typeof parent.tinymce.activeEditor.windowManager.getParams().axisJS !== 'undefined') {
        var importData = {};
        importData.config = angular.fromJson($window.atob(parent.tinymce.activeEditor.windowManager.getParams().axisJS));
        importData.inputData = inputService.convert(importData.config.data.columns);

        var config = importData.config;
        /* jshint ignore:start */ // Whatever Crockford, all the cool kids use eval.
        importData.config.axis.x.tick.format = eval('(' + importData.config.axis.x.tick.format + ')'); //function(b) {if('series'===config.chartGlobalType&&'category'!==config.axis.x.type){var b=d3.format(config.axis.x.commas?',':config.axis.x.accuracy);return config.axis.x.prefix+b(a).toString()+config.axis.x.suffix}return a};
        importData.config.axis.y.tick.format = eval('(' + importData.config.axis.y.tick.format + ')');//function(b) {if('series'===config.chartGlobalType&&'category'!==config.axis.y.type){var b=d3.format(config.axis.y.commas?',':config.axis.y.accuracy);return config.axis.y.prefix+b(a).toString()+config.axis.y.suffix}return a};
        importData.config.axis.y2.tick.format = eval('(' + importData.config.axis.y2.tick.format + ')');//function(b) {if('series'===config.chartGlobalType&&'category'!==config.axis.y2.type){var b=d3.format(config.axis.y2.commas?',':config.axis.y2.accuracy);return config.axis.y2.prefix+b(a).toString()+config.axis.y2.suffix}return a};
        importData.config.donut.label.format = eval('(' + importData.config.donut.label.format + ')');//function(b,c) {return(100*c).toFixed(importData.config.chartAccuracy)+'%';};
        importData.config.pie.label.format = eval('(' + importData.config.pie.label.format + ')');//function(b,c) {return(100*c).toFixed(importData.config.chartAccuracy)+'%';};
        importData.config.gauge.label.format = eval('(' + importData.config.gauge.label.format + ')');//function(b,c) {return(100*c).toFixed(importData.config.chartAccuracy)+'%';};
        /* jshint ignore:end */ // WHAT EVAL LURKS IN THE HEARTS OF MEN?!

        if (importData.config && importData.inputData) {
          return importData;
        }
      }
    };

    return wordpress;
  }
  wordpressOutput.$inject = ["genericOutput", "$http", "$window"];
})();

/**
 * @ngdoc service
 * @name axis.svgOutput
 * @description
 * # svgOutput
 * Service to generate SVGs.
 * @TODO move the SVG creation code from exportChart directive to here.
 */
// angular.module('axis')
//   .service('svgOutput', function svgOutput() {
//     'use strict';
//     // AngularJS will instantiate a singleton by calling "new" on this function
//   });

/**
 * @ngdoc service
 * @name axis.pngOutput
 * @description
 * # pngOutput
 * Service to output PNGs.
 * @TODO move the PNG creation logic here.
 */
// angular.module('axis')
//   .service('pngOutput', function pngOutput() {
//    'use strict';
//     // AngularJS will instantiate a singleton by calling "new" on this function
//   });

/**
 * @ngdoc service
 * @name axis.pdfOutput
 * @description
 * # pdfOutput
 * Produces PDFs of the chart.
 */
/* global jsPDF*/

(function(){
  'use strict';

  angular
    .module('axis')
    .service('pdfOutput', pdfOutput);

  /** @ngInject */
  function pdfOutput(genericOutput) {
    var pdf = angular.copy(genericOutput);

    pdf.name = 'pdfOutputService';

    pdf.preprocess = function(scope) {
      return {
        data: document.getElementById('canvas').toDataURL(),
        margins: scope.appConfig['print margins'] ? scope.appConfig['print margins'] : undefined
      };
    };

    pdf.process = function(payload){
      var doc = new jsPDF('l', 'pt');
      doc.addImage(payload.data, 'PNG', 0, 0); // TODO add margins
      return doc;
    };

    pdf.complete = function(output) {
      output.save('axis.pdf'); // provided by jsPDF
    };

    return pdf;
  }
  pdfOutput.$inject = ["genericOutput"];
})();

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
/**
 * @ngdoc service
 * @name Axis.outputService
 * @description
 * # outputProvider
 * Service that pulls in output services specified in config.yaml.
 */

(function(){
  'use strict';

  angular
    .module('axis')
    .service('outputService', outputService);
    
  /** @ngInject */
  function outputService(configProvider, $injector) {
    return function(scope, type){
      var output = $injector.get(type + 'Output');
      return output.export(scope);
    };
  }
  outputService.$inject = ["configProvider", "$injector"];
})();
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
    embed.preprocess = function(scope){
      var chartConfig = angular.copy(scope.main.config); // Needs to copy or else scope breaks. See #45.
      chartConfig.bindto = '#chart-' + Math.floor((Math.random()*10000)+1);
      return {
        config: chartConfig,
        dependencies: chartService(scope.main.appConfig).dependencies
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
     * @param  {[type]} output [description]
     * @return {[type]}        [description]
     *
     * @NB Istanbul instrumentation disabled until I can figure how to mock $modal here.
     */
    embed.complete = function(output) {
      /* istanbul ignore next */
      $modal.open({
        templateUrl: 'partials/outputModal.html',
        controller: 'EmbedcodeOutputController',
        resolve: {
          output: output
        }
      });
    };

    return embed;
  }
  embedcodeOutput.$inject = ["genericOutput", "chartService", "$modal", "$window"];


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
  EmbedcodeOutputController.$inject = ["output"];
})();

/**
 * @ngdoc service
 * @name axis.axisOutput
 * @description
 * # axisOutput
 * Service for outputting to Axis Server or AxisMaker.
 */

(function(){
  'use strict';

  angular
    .module('axis')
    .factory('axisOutput', axisOutput);

  /** @ngInject */
  function axisOutput(genericOutput, $window) {
    var maker = angular.copy(genericOutput);
    var parent = $window.parent;

    maker.serviceConfig = {
      type: 'export', // Options: 'save' and 'export'.
      label: 'Save' // Label to use on button.
    };

    maker.preprocess = function(scope) { // @TODO Replace with JSONfn.
      var chartConfig = scope.main.config;
      chartConfig.axis.x.tick.format = chartConfig.axis.x.tick.format.toString();
      chartConfig.axis.y.tick.format = chartConfig.axis.y.tick.format.toString();
      chartConfig.axis.y2.tick.format = chartConfig.axis.y2.tick.format.toString();
      chartConfig.pie.label.format = chartConfig.pie.label.format.toString();
      chartConfig.donut.label.format = chartConfig.donut.label.format.toString();
      chartConfig.gauge.label.format = chartConfig.gauge.label.format.toString();
      var chartTitle = chartConfig.chartTitle;
      var axisConfig = String(angular.toJson(chartConfig));
      var axisChart = String(angular.element('.savePNG').attr('href'));
      return {
        config: axisConfig,
        png: axisChart,
        title: chartTitle
      };
    };

    maker.process = function(payload) {
      // Have use PostMessage to push outside the iframe
      parent.postMessage(
        JSON.stringify(payload),
        '*' // The intended origin, in this example we use the any origin wildcard.
      );
    };

    /* istanbul ignore next */
    maker.complete = function() {
      console.log('Complete.');
    };

    maker.export = function(scope) {
      var payload = maker.preprocess(scope);
      maker.process(payload);
      maker.complete();
    };

    maker.import = function(inputService) {
      if (typeof parent.axisConfig !== 'undefined') {
        var importData = {};
        importData.config = angular.fromJson(parent.axisConfig);
        importData.inputData = inputService.convert(importData.config.data.columns);

        /* jshint ignore:start */
        importData.config.axis.x.tick.format = function(b) {if('series'===config.chartGlobalType&&'category'!==config.axis.x.type){var b=d3.format(config.axis.x.commas?',':config.axis.x.accuracy);return config.axis.x.prefix+b(a).toString()+config.axis.x.suffix}return a};
        importData.config.axis.y.tick.format = function(b) {if('series'===config.chartGlobalType&&'category'!==config.axis.y.type){var b=d3.format(config.axis.y.commas?',':config.axis.y.accuracy);return config.axis.y.prefix+b(a).toString()+config.axis.y.suffix}return a};
        importData.config.axis.y2.tick.format = function(b) {if('series'===config.chartGlobalType&&'category'!==config.axis.y2.type){var b=d3.format(config.axis.y2.commas?',':config.axis.y2.accuracy);return config.axis.y2.prefix+b(a).toString()+config.axis.y2.suffix}return a};
        importData.config.donut.label.format = function(b,c) {return(100*c).toFixed(importData.config.chartAccuracy)+'%';};
        importData.config.pie.label.format = function(b,c) {return(100*c).toFixed(importData.config.chartAccuracy)+'%';};
        importData.config.gauge.label.format = function(b,c) {return(100*c).toFixed(importData.config.chartAccuracy)+'%';};
        /* jshint ignore:end */

        if (importData.config && importData.inputData) {
          return importData;
        }
      }
    };

    return maker;
  }
  axisOutput.$inject = ["genericOutput", "$window"];
})();

/**
 * @ngdoc service
 * @name axis.inputService
 * @description
 * # inputService
 * Service that pulls in input services specified in config.yaml.
 */

(function(){
  'use strict';

  angular
    .module('axis')
    .service('inputService', inputService);

  /** @ngInject */
  function inputService(configProvider, $injector) {
    return function(appConfig){
      if (!angular.isUndefined(appConfig) && !angular.isUndefined(appConfig.input)) {
        if (appConfig.input.constructor === Array) {
          return $injector.get(appConfig.input[0] + 'Input'); // If multiple, use the first to populate data.
        } else {
          return $injector.get(appConfig.input + 'Input');
        }
      }
    };
  }
  inputService.$inject = ["configProvider", "$injector"];
})();

/**
 * @ngdoc service
 * @name axis.spreadsheetInput
 * @description
 * # spreadsheetInput
 * Enables a fancy user-friendly spreadsheet input.
 */

(function(){
  'use strict';

  angular
    .module('axis')
    .factory('spreadsheetInput', spreadsheetInput);

  /** @ngInject */
  function spreadsheetInput() {
    var defaultSheet = [
      ['data1', 'data2'],
      [30, 50],
      [200, 20],
      [100, 10],
      [400, 40],
      [150, 15],
      [250, 25]
    ];

    var parseSheet = function(scope) {
      if (scope.inputs.inputData) {
        scope.chartData = []; // Empty, or else new column names will break ng-grid
        scope.columns = []; // Clear existing
        scope.config.data.columns = [];
        scope.chartData = angular.copy(scope.inputs.inputData);
        var cols = [];

        // Convert objects into arrays. Might be better long-term to use C3's JSON input.
        // Lots of this stuff is C3-specific. TODO move to c3Service.
        if (scope.chartData.length > 0) {
          scope.columns = scope.chartData[0].filter(function(v) {
            return v != undefined && v !== ''; /* jshint ignore:line */
          });

          scope.chartData.shift();
          angular.forEach(scope.columns, function(colName, index) {
            var column = [];
            column.push(colName);
            angular.forEach(scope.chartData, function(datum) {
              if (datum[index]) {
                column.push(datum[index]);
              }
            });

            cols.push(column);
          });

          scope.config.data.columns = cols;
        }
      }

      return scope;
    };

    var convertColsToRows = function(columns) {
      var data = [];
      var headers = [];
      for (var i = 0; i < columns.length; i++) {
        headers.push(columns[i].shift());
        for (var j = 0; j < columns[i].length; j++) {
          if (!data[j]) {
            data[j] = [];
          }

          data[j][i] = columns[i][j];
        }
      }

      return [headers].concat(data);
    };

    // Public API here
    return {
      /**
       * Service name
       * @type {String}
       */
      name: 'spreadsheetInputService',

      /**
       * Validate spreadsheet input
       * @param  {array} value   The output from HOT.getData()
       * @return {boolean}       True if validates, false if not.
       */
      validate: function(value) {
        return value instanceof Array; // TODO write a real validator.
      },

      /**
       * The default sheet to populate AxisJS with.
       * @type {array}
       */
      defaultData: defaultSheet,

      /**
       * Parses sheet into columns. Called whenever sheet updated.
       * @param  {object} scope The AxisJS scope object.
       * @return {object}       The updated scope object.
       */
      input: function(scope) {
        return parseSheet(scope);
      },

      /**
       * Convert array columns to Handsontable-compatible array.
       * @param  {array} data An array of array columns.
       * @return {array}      Array with header column values as first element.
       */
      convert: function(data) {
        return convertColsToRows(data);
      }
    };
  }
})();

/**
 * @ngdoc directive
 * @name AxisJS.directive:inputChooser
 * @description
 * Directive allowing the user choose an input method
 */
(function(){
  'use strict';

  angular
    .module('axis')
    .directive('spreadsheetInput', spreadsheetInput);

  /** @ngInject */
  function spreadsheetInput() {
    return {
      templateUrl: 'app/components/input/spreadsheet/spreadsheetInput.directive.html',
      restrict: 'E',
      scope: {
        main: '=config'
      },
      controllerAs: 'sheet',
      controller: ["$scope", function($scope) {
        var main = $scope.main;
        var vm = this;

        vm.inputs = main.inputs;

        /**
         * Clears HOT if data is from pasting.
         * @param  {array} changes From HOT, the changes being made to table.
         * @param  {string} source  From HOT, the source of the changes.
         * @return {void}
         */
        vm.clearOnPaste = function(changes, source){
          if (source === 'paste') {
            this.clear();
          }
        };
      }]
    };
  }
})();

/**
 * @ngdoc directive
 * @name AxisJS.directive:inputChooser
 * @description
 * Directive allowing the user choose an input method
 */
(function(){
  'use strict';

  angular
    .module('axis')
    .directive('inputChooser', inputChooser);

  function inputChooser() {
    return {
      templateUrl: 'app/components/input/inputChooser/inputChooser.html',
      restrict: 'E',
      scope: {
        'main': '=config'
      },
      controllerAs: 'inputCtrl',
      controller: 'InputChooserController'
    };
  }

  angular
    .module('axis')
    .controller('InputChooserController', InputChooserController);

  /** @ngInject **/
  function InputChooserController($scope, inputService) {
    var main = $scope.main;
    var vm = this;

    vm.isArray = angular.isArray;
    vm.template = false;
    vm.setTemplate = function(type) {
      vm.template = type;
      main.appConfig.input = type; // Replace array with string form.
      main.setInput(type); // Set input in MainController to this input provider.
      main.resetConfig(type); // Reset chart config to default
      main.inputs.inputData = inputService(main.appConfig).defaultData; // Replace default data
      main.config.inputType = type; // Set type in config object to restore on load.
      main.updateData();
    };
  }
  InputChooserController.$inject = ["$scope", "inputService"];
})();

/**
 * @ngdoc service
 * @name axis.genericInput
 * @description
 * # genericInput
 * Input service primitive. Useless as-is; meant to be extended.
 */

(function(){
  'use strict';

  angular
    .module('axis')
    .factory('genericInput', genericInput);

  /** @ngInject */
  function genericInput() {
    var defaultData = [
      ['data1', 'data2'],
      [30, 50],
      [200, 20],
      [100, 10],
      [400, 40],
      [150, 15],
      [250, 25]
    ];

    // Public API here
    return {
      /**
       * Service name
       * @type {String}
       */
      name: 'genericInputService',

      /**
       * Validate input
       * @param  {array} value   Some output
       * @return {boolean}       True if validates, false if not.
       */
      validate: function(value) {
        return value ? true : false;
      },

      /**
       * The default data to populate AxisJS with.
       * @type {array}
       */
      defaultData: defaultData,

      /**
       * Parses data into columns. Called whenever data updated.
       * @param  {object} scope The AxisJS scope object.
       * @return {object}       The updated scope object.
       */
      input: function(scope) {
        return scope;
      },

      /**
       * Convert data from something to something.
       * @param  {array} data An array of array columns.
       * @return {array}      Array with header column values as first element.
       */
      convert: function(data) {
        return data;
      }
    };
  }
})();

/**
 * @ngdoc service
 * @name axis.financialInput
 * @description
 * # financialInput
 * Enables a fancy user-friendly financial data picker.
 */

(function(){
  'use strict';

  angular
    .module('axis')
    .factory('financialInput', financialInput);

  /** @ngInject */
  function financialInput($q, $http, $window) {
    /**
     * Creates a bunch of promises to query Yahoo! Finance
     * @param  {object} inputs Object containing symbol, start date and end date.
     * @return {array}        Array of promises
     */
    var getData = function(inputs) {
      var symbols = inputs.symbol ? inputs.symbol.split(/[,\s]/) : ['NWS'];
      var dateStart = inputs.dateStart ? inputs.dateStart : $window.moment().subtract(31, 'days').format('YYYY-MM-DD');
      var dateEnd = inputs.dateEnd ? inputs.dateEnd : $window.moment().format('YYYY-MM-DD');
      var endpoint;
      var financialData = [];

      for (var i = 0; i < symbols.length; i++) {
        endpoint = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20%3D%20%22' + symbols[i] + '%22%20and%20startDate%20%3D%20%22' + dateStart + '%22%20and%20endDate%20%3D%20%22' + dateEnd + '%22&format=json&diagnostics=false&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
        financialData.push($http.get(endpoint)); // Add promise to array, to resolve in parseData
      }

      return financialData;
    };

    var parseData = function(scope) {
      if (scope.inputs.inputData) {
        var financialData = getData({
          symbol: scope.inputs.inputData.symbol,
          dateStart: angular.isString(scope.inputs.inputData.dateStart) ? scope.inputs.inputData.dateStart : $window.moment(scope.inputs.inputData.dateStart).format('YYYY-MM-DD'),
          dateEnd: angular.isString(scope.inputs.inputData.dateEnd) ? scope.inputs.inputData.dateEnd : $window.moment(scope.inputs.inputData.dateEnd).format('YYYY-MM-DD')
        });

        // Resolve all the promises and populate the chart
        $q.all(financialData).then(function(res){
          scope.chartData = []; // Empty, or else new column names will break ng-grid
          scope.columns = []; // Clear existing
          scope.config.data.columns = [];
          var cols = [];
          var colNames = [];

          angular.forEach(res, function(item, index){
            var stockData = item.data.query.results.quote;
            if (index === 0) {
              var dates = stockData.map(function(v){
                return v.Date;
              });
              dates.unshift('Date');
              cols.push(dates);
              colNames.push('Date');
            }

            if (stockData.length > 0) {
              var symbol = stockData[0].Symbol;
              var col = stockData.map(function(v){
                return v.Adj_Close;
              });
              col.unshift(symbol); // Add symbol name as item header
              cols.push(col);
              colNames.push(symbol);
            }
          });

          if (cols.length > 0) {
            scope.chartData = cols;
            scope.columns = colNames;
            scope.config.data.columns = cols;
            scope.config.data.x = 'Date';
            scope.config.financial = scope.chartData; // Needed to repopulate on load; unique to this.
            scope.config.title.source = 'Source: Yahoo';
            scope.config.axis.x.tick = scope.config.axis.x.tick ? scope.config.axis.x.tick : {format: '%Y-%m-%d'};
            scope.config.axis.x.type = 'timeseries';
            // scope.updateData(); // This might be needed somehow.
          }
        });
      }

      return scope;
    };

    var populateInput = function(columns) { // This doesn't do anything yet.

    };

    // Public API here
    return {
      /**
       * Service name.
       * @type {String}
       */
      name: 'financialInputService',

      /**
       * Validate spreadsheet input
       * @param  {array} value   A financial picker symbol
       * @return {boolean}       True if validates, false if not.
       */
      validate: function(value) {
        return value instanceof Array; // TODO write a real validator.
      },

      /**
       * The default data to populate Axis with.
       * @type {array}
       */
      defaultData: {
        symbol: 'NWS',
        dateStart: $window.moment().subtract(31, 'days').format('YYYY-MM-DD'),
        dateEnd: $window.moment().format('YYYY-MM-DD')
      },

      /**
       * Grabs the symbol data and applies to scope
       * @param  {object} scope The AxisJS scope object.
       * @return {object}       The updated scope object.
       */
      input: function(scope) {
        return parseData(scope);
      },

      /**
       * Convert loaded data to date ranges and symbol
       * @param  {array} data An array of array columns.
       * @return {array}      Array with header column values as first element.
       */
      convert: function(data) {
        return populateInput(data);
      }
    };
  }
  financialInput.$inject = ["$q", "$http", "$window"];
})();

/**
 * @ngdoc service
 * @name axis.feedInput
 * @description
 * # feedInput
 * Basic feed-based input service to extend.
 * @TODO fill this out and write unit tests.
 * @NB current ignored by istanbul (see below comment)
 */

(function(){
  'use strict';

  angular
    .module('axis')
    .factory('feedInput', feedInput);

  /* istanbul ignore next *//** @ngInject */
  function feedInput($q, $http, $window, $interpolate) {
    /**
     * The feed URL to query.
     * @type {String}
     */
    this.feedUrl = 'https://www.random.org/integers/?num={{ count }}&min={{ min }}&max={{ max }}&col=1&base=10&format=plain&rnd=new';

    /**
     * Creates a bunch of promises to query a RSS feed
     * @param  {object} inputs Object containing symbol, start date and end date.
     * @return {array}        Array of promises
     */
    var getData = function(inputs) {
      var exp = $interpolate(this.feedUrl);
      var symbols = inputs.symbol ? inputs.symbol.split(/[,\s]/) : ['NWS'];
      var dateStart = inputs.dateStart ? inputs.dateStart : $window.moment().subtract(31, 'days').format('YYYY-MM-DD');
      var dateEnd = inputs.dateEnd ? inputs.dateEnd : $window.moment().format('YYYY-MM-DD');
      var endpoint;
      var financialData = [];

      for (var i = 0; i < symbols.length; i++) {
        endpoint = exp({symbol: symbols[i], dateStart: dateStart, dateEnd: dateEnd});
        financialData.push($http.get(endpoint)); // Add promise to array, to resolve in parseData
      }

      return financialData;
    };

    var parseData = function(scope) {
      if (scope.inputs.inputData) {
        var financialData = getData({
          symbol: scope.inputs.inputData.symbol,
          dateStart: typeof scope.inputs.inputData.dateStart === 'string' ? scope.inputs.inputData.dateStart : $window.moment(scope.inputs.inputData.dateStart).format('YYYY-MM-DD'),
          dateEnd: typeof scope.inputs.inputData.dateEnd === 'string' ? scope.inputs.inputData.dateEnd : $window.moment(scope.inputs.inputData.dateEnd).format('YYYY-MM-DD')
        });

        // Resolve all the promises and populate the chart
        $q.all(financialData).then(function(res){
          scope.chartData = []; // Empty, or else new column names will break ng-grid
          scope.columns = []; // Clear existing
          scope.config.data.columns = [];
          var cols = [];
          var colNames = [];

          angular.forEach(res, function(item, index){
            var stockData = item.data.query.results.quote;
            if (index === 0) {
              var dates = stockData.map(function(v){
                return v.Date;
              });
              dates.unshift('Date');
              cols.push(dates);
              colNames.push('Date');
            }

            if (stockData.length > 0) {
              var symbol = stockData[0].Symbol;
              var col = stockData.map(function(v){
                return v.Adj_Close;
              });
              col.unshift(symbol); // Add symbol name as item header
              cols.push(col);
              colNames.push(symbol);
            }
          });

          if (cols.length > 0) {
            scope.chartData = cols;
            scope.columns = colNames;
            scope.config.data.columns = cols;
            scope.config.data.x = 'Date';
            scope.config.financial = scope.chartData; // Needed to repopulate on load; unique to this.
            scope.config.title.source = 'Source: Yahoo';
            scope.config.axis.x.tick = scope.config.axis.x.tick ? scope.config.axis.x.tick : {format: '%Y-%m-%d'};
            scope.config.axis.x.type = 'timeseries';
            // scope.updateData(); // This might be needed somehow.
          }
        });
      }

      return scope;
    };

    var populateInput = function(columns) { // This is untested. @TODO test.
      var data = [];
      var headers = [];
      for (var i = 0; i < columns.length; i++) {
        headers.push(columns[i].shift());
        for (var j = 0; j < columns[i].length; j++) {
          if (!data[j]) {
            data[j] = [];
          }

          data[j][i] = columns[i][j];
        }
      }

      return [headers].concat(data);
    };

    // Public API here
    return {
      /**
       * Service name
       * @type {String}
       */
      name: 'feedInputService',

      /**
       * Validate spreadsheet input
       * @param  {array} value   The output from HOT.getData()
       * @return {boolean}       True if validates, false if not.
       */
      validate: function(value) {
        return value instanceof Array; // TODO write a real validator.
      },

      /**
       * The default data to populate Axis with.
       * @type {array}
       */
      defaultData: {
        symbol: 'NWS',
        dateStart: $window.moment().subtract(31, 'days').format('YYYY-MM-DD'),
        dateEnd: $window.moment().format('YYYY-MM-DD')
      },

      /**
       * Parses sheet into columns. Called whenever sheet updated.
       * @param  {object} scope The AxisJS scope object.
       * @return {object}       The updated scope object.
       */
      input: function(scope) {
        return parseData(scope);
      },

      /**
       * Convert loaded data to date ranges and symbol
       * @param  {array} data An array of array columns.
       * @return {array}      Array with header column values as first element.
       */
      convert: function(data) {
        return populateInput(data);
      }
    };
  }
  feedInput.$inject = ["$q", "$http", "$window", "$interpolate"];
})();

/**
 * @ngdoc directive
 * @name axis.directive:maintainFocus
 * @description
 * # maintainFocus
 * Prevents tab key from changing focus and instead inserts a tab into the
 * focused element.
 */
(function(){
  'use strict';

  angular
    .module('axis')
    .directive('maintainFocus', maintainFocus);
  
  /** @ngInject */
  function maintainFocus() {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
        element.on('keydown', function(e) {
          if (e.keyCode === 9) { // tab was pressed
            // get caret position/selection
            var val = this.value,
            start = this.selectionStart,
            end = this.selectionEnd;

            // set textarea value to: text before caret + tab + text after caret
            this.value = val.substring(0, start) + '\t' + val.substring(end);

            // put caret at right position again
            this.selectionStart = this.selectionEnd = start + 1;

            // prevent the focus lose
            return false;
          }
        });
      }
    };
  }
})();
/**
 * @ngdoc service
 * @name axis.csvInput
 * @description
 * # csvInput
 * Provides a text box to input and parse CSV data.
 */

(function(){
  'use strict';

  angular
    .module('axis')
    .factory('csvInput', csvInput);

  /** @ngInject */
  function csvInput($window) {
    function CsvInputServiceException(message) {
      this.name = 'CsvInputServiceException';
      this.message = 'Input has failed: ' + message;
    }
    CsvInputServiceException.prototype = new Error();
    CsvInputServiceException.prototype.constructor = CsvInputServiceException;


    var Papa = $window.Papa;

    var validateCSV = function (value) {
      var csv, noDelimiter;
      var parserConfig = {
        header: true,
        dynamicTyping: true
      };

      // Detect TSV; fallback to auto-detection. @see #39.
      if (value.match('\t')) {
        parserConfig.delimiter = '\t';
      }

      try {
        csv = Papa.parse(value, parserConfig);
      } catch(e) {
        throw new CsvInputServiceException(e);
      }

      noDelimiter = /^[^,\t\s]*\n[^,\t\s]*$/gm; // Edge-case for gauge charts (one column of data)

      return (csv.errors.length > 0 && !value.match(noDelimiter) ? false : true);
    };

    var defaultCSV = 'data1\tdata2\n30\t50\n200\t20\n100\t10\n400\t40\n150\t15\n250\t25';

    var parseCSV = function (scope) {
      if (scope.inputs.inputData) {
        try {
          scope.chartData = []; // Empty, or else new column names will break ng-grid
          scope.columns = []; // Clear existing
          scope.config.data.columns = [];
          var parserConfig = {
            header: true,
            dynamicTyping: true
          };

          // Detect TSV; fallback to auto-detection. @see #39.
          if (scope.inputs.inputData.match('\t')) {
            parserConfig.delimiter = '\t';
          }

          scope.chartData = Papa.parse(scope.inputs.inputData, parserConfig).data;
        } catch(e) {
          throw new CsvInputServiceException(e);
        }

        // Convert objects into arrays. Might be better long-term to use C3's JSON input.
        // Lots of this stuff is C3-specific. TODO move to c3Service.
        if (scope.chartData.length > 0) {
          scope.columns = Object.keys(scope.chartData[0]);
          angular.forEach(scope.columns, function(colName) {
            var column = [];
            column.push(colName);
            angular.forEach(scope.chartData, function(datum) {
              // Remove commas from numbers
              if (!/(\d)(?=(\d{3})+(?!\d))/g.test(datum[colName]) && typeof datum[colName] === 'string') {
                datum[colName] = datum[colName].replace(/,/g, '');
              }

              column.push(datum[colName]);
            });

            scope.config.data.columns.push(column);
          });
        }
      }

      return scope;
    };

    var convertColsToCSV = function(columns) {
      var data = [];
      var headers = [];
      var output;
      for (var i = 0; i < columns.length; i++) {
        headers.push(columns[i].shift());
        for (var j = 0; j < columns[i].length; j++) {
          if (!data[j]) {
            data[j] = [];
          }
          data[j][i] = columns[i][j];
        }
      }

      try {
        output = Papa.unparse({fields: headers, data: data}, {delimiter: '\t'});
      } catch(e) {
        throw new CsvInputServiceException(e);
      }

      return output;
    };

    // Public API here
    return {
      /**
       * Service name. Useful for tests.
       * @type {String}
       */
      name: 'csvInputService',
      
      /**
       * Validates the CSV input.
       * @param  {string} value The raw CSV input
       * @return {boolean}       The validation result
       */
      validate: function(value) {
        return validateCSV(value);
      },

      /**
       * Default CSV data to populate input with.
       * @type {string}
       */
      defaultData: defaultCSV,

      /**
       * Parses the raw CSV into an array of arrays.
       * @param  {object} scope Axis scope object
       * @return {object}       Updated scope object
       */
      input: function(scope) {
        return parseCSV(scope);
      },

      /**
       * Converts an array into a CSV string.
       * @param  {array} columns Parsed CSV data
       * @return {string}         Converted CSV string
       */
      convert: function(columns) {
        return convertColsToCSV(columns);
      }
    };
  }
  csvInput.$inject = ["$window"];
})();

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
      $get: ["$http", "$q", "localStorageService", "$window", function($http, $q, localStorageService, $window) {
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
          var userConfigYaml = jsyaml.safeLoad(values[1].data);
          var axisConfig;

          // Oddly, js-yaml returns string 'undefined' on fail and not type undefined
          userConfigYaml = userConfigYaml !== 'undefined' ? userConfigYaml : {};
          axisConfig = angular.extend({}, defaultConfigYaml, userConfigYaml);

          axisConfig.framework = axisConfig.renderer; // Needed for backwards compat.
          return axisConfig;
        },
        function(err){ // Return default on failure.
          console.dir(err);
        });
      }]
    };
  }
})();

/**
 * @ngdoc service
 * @name axis.configChooser
 * @description
 * # configChooser
 * Opens an off-canvas configuration picker, using options defined in YAML.
 * When a new config is chosen, it's saved to localStorage and the app is reloaded.
 */

(function(){
  'use strict';

  angular
    .module('axis')
    .factory('configChooser', configChooser);

  /** @ngInject */
  function configChooser($aside, configProvider) {
    return function() {
      // This is ignored by Istanbul for the same reason as the modal in EmbedcodeOutput
      /* istanbul ignore next */
      $aside.open({
        placement: 'right',
        backdrop: true,
        controller: 'ConfigChooserController as ConfChooseCtrl',
        templateUrl: 'app/components/config/configChooser/configChooser.html',
        resolve: {
          conf: function(){ return configProvider; }
        }
      });
    };
  }
  configChooser.$inject = ["$aside", "configProvider"];

  angular
    .module('axis')
    .controller('ConfigChooserController', ConfigChooserController);

  /** @ngInject **/
  function ConfigChooserController($scope, localStorageService, $window, conf, $modalInstance) {
    var vm = this;
    vm.name = 'Choose Configuration';
    vm.themes = conf.themes;

    vm.cancel = function(e){
      $modalInstance.dismiss();
      e.stopPropagation();
    };

    vm.setConfig = function(config) {
      localStorageService.set('config', config);
      $window.location.reload();
    };
  }
  ConfigChooserController.$inject = ["$scope", "localStorageService", "$window", "conf", "$modalInstance"];
})();

/**
 * @ngdoc directive
 * @name axis.directive:exportChart
 * @description
 * Inlines styles and renders to canvas.
 * Also does some PNG and SVG stuff. It's not very well-written...
 *
 * Most of this is shamelessly stolen from Quartz's ChartBuilder.
 * @TODO Refactor the hell out of this.
 */
/*jshint -W083 */

(function(){
  'use strict';

  angular
    .module('axis')
    .directive('exportChart', exportChart);

  /** @ngInject */
  function exportChart (outputService) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var main = scope.main; // This is the entire main controller scope. @TODO isolate.

        element.on('click', function(){
          createChartImages(main.config.chartWidth);
          if (attrs.exportChart !== 'save') {
            outputService(main, attrs.exportChart);
          }
        });

        var styles;

        var createChartImages = function(width) {
          // Remove all defs, which botch PNG output
          angular.element('defs').remove();

          // Copy CSS styles to Canvas
          inlineAllStyles();

          // Create PNG image
          var canvas = angular.element('#canvas').empty()[0];

          if (!width) {
            // Zoom! Enhance!
            angular.element('#chart > svg').attr('transform', 'scale(2)');
            canvas.width = angular.element('#chart > svg').width() * 2;
            canvas.height = angular.element('#chart > svg').height() *2;
          } else {
            var scaleFactor = (width / angular.element('#chart').width()) * 2;
            angular.element('#chart > svg').attr('transform', 'scale(' + scaleFactor + ')');
            canvas.width = angular.element('#chart > svg').width() * scaleFactor;
            canvas.height = angular.element('#chart > svg').height() * scaleFactor;
          }


          var canvasContext = canvas.getContext('2d');
          var svg = document.getElementsByTagName('svg')[0];
          var serializer = new XMLSerializer();
          svg = serializer.serializeToString(svg);

          canvasContext.drawSvg(svg,0,0);
          var filename = [];
          for (var i=0; i < main.columns.length; i++) {
            filename.push(main.columns[i]);
          }

          if(main.chartTitle) {
            filename.unshift(main.chartTitle);
          }

          filename = filename.join('-').replace(/[^\w\d]+/gi, '-');

          angular.element('.savePNG').attr('href', canvas.toDataURL('png'))
            .attr('download', function(){ return filename + '_axisJS.png';
            });

          var svgContent = createSVGContent(angular.element('#chart > svg')[0]);

          $('.saveSVG').attr('href','data:text/svg,'+ svgContent.source[0])
            .attr('download', function(){ return filename + '_axisJS.svg';});
        };

        // This needs to be more abstracted. Currently it's built to handle C3's quirks.

        /* Take styles from CSS and put as inline SVG attributes so that Canvg
           can properly parse them. */
        var inlineAllStyles = function() {
          var chartStyle = {},
              selector;

          // Get rules from c3.css
          for (var i = 0; i <= document.styleSheets.length - 1; i++) {
            if (document.styleSheets[i].href && document.styleSheets[i].href.indexOf('c3.css') !== -1) {
              if (document.styleSheets[i].rules !== undefined) {
                chartStyle = angular.extend(chartStyle, document.styleSheets[i].rules);
              } else {
                chartStyle = angular.extend(chartStyle, document.styleSheets[i].cssRules);
              }
            }
          }

          if (chartStyle !== null && chartStyle !== undefined) {
            // SVG doesn't use CSS visibility and opacity is an attribute, not a style property. Change hidden stuff to "display: none"
            var changeToDisplay = function(){
              if (angular.element(this).css('visibility') === 'hidden' || angular.element(this).css('opacity') === '0') {
                angular.element(this).css('display', 'none');
              }
            };

            // Inline apply all the CSS rules as inline
            for (i = 0; i < Object.keys(chartStyle).length; i++) {
              if (chartStyle[i].type === 1) {
                selector = chartStyle[i].selectorText;
                styles = makeStyleObject(chartStyle[i]);
                angular.element('svg *').each(changeToDisplay);
                angular.element(selector).not('.c3-chart path').not('.c3-legend-item-tile').css(styles);
              }

              /* C3 puts line colour as a style attribute, which gets overridden
                 by the global ".c3 path, .c3 line" in c3.css. The .not() above
                 prevents that, but now we need to set fill to "none" to prevent
                 weird beziers.

                 Which screws with pie charts and whatnot, ergo the is() callback.
              */
              angular.element('.c3-chart path')
                .filter(function(){
                  return angular.element(this).css('fill') === 'none';
                })
                .attr('fill', 'none');

              angular.element('.c3-chart path')
                .filter(function(){
                  return angular.element(this).css('fill') !== 'none';
                })
                .attr('fill', function(){
                  return angular.element(this).css('fill');
                });
            }
          }
        };

        // Create an object containing all the CSS styles.
        // TODO move into inlineAllStyles
        var makeStyleObject = function (rule) {
          var styleDec = rule.style;
          var output = {};
          var s;

          for (s = 0; s < styleDec.length; s++) {
            output[styleDec[s]] = styleDec[styleDec[s]];
          }
          return output;
        };

        // Create a SVG.
        var createSVGContent = function(svg) {
          /*
            Copyright (c) 2013 The New York Times

            Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
            The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

            SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
          */

          //via https://github.com/NYTimes/svg-crowbar

          var prefix = {
            xmlns: 'http://www.w3.org/2000/xmlns/',
            xlink: 'http://www.w3.org/1999/xlink',
            svg: 'http://www.w3.org/2000/svg'
          };

          var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';


          svg.setAttribute('version', '1.1');

          // Disabled defs because it was screwing up SVG output
          //var defsEl = document.createElement("defs");
          //svg.insertBefore(defsEl, svg.firstChild); //TODO   .insert("defs", ":first-child")

          var styleEl = document.createElement('style');
          //defsEl.appendChild(styleEl);
          styleEl.setAttribute('type', 'text/css');


          // removing attributes so they aren't doubled up
          svg.removeAttribute('xmlns');
          svg.removeAttribute('xlink');

          // These are needed for the svg
          if (!svg.hasAttributeNS(prefix.xmlns, 'xmlns')) {
            svg.setAttributeNS(prefix.xmlns, 'xmlns', prefix.svg);
          }

          if (!svg.hasAttributeNS(prefix.xmlns, 'xmlns:xlink')) {
            svg.setAttributeNS(prefix.xmlns, 'xmlns:xlink', prefix.xlink);
          }

          var source = (new XMLSerializer()).serializeToString(svg).replace('</style>', '<![CDATA[' + styles + ']]></style>');

          // Quick 'n' shitty hacks to remove stuff that prevents AI from opening SVG
          source = source.replace(/\sfont-.*?: .*?;/gi, '');
          source = source.replace(/\sclip-.*?="url\(http:\/\/.*?\)"/gi, '');
          source = source.replace(/\stransform="scale\(2\)"/gi, '');
          // not needed but good so it validates
          source = source.replace(/<defs xmlns="http:\/\/www.w3.org\/1999\/xhtml">/gi, '<defs>');

          return {svg: svg, source: [doctype + source]};
        };
      }
    };
  }
  exportChart.$inject = ["outputService"];
})();

/**
 * @ngdoc service
 * @name axis.chartService
 * @description
 * # chartService
 * Injects the correct chart renderer service based on YAML config.
 */

(function(){
  'use strict';

  angular
    .module('axis')
    .service('chartService', chartService);

  /** @ngInject */
  function chartService($injector) {
    return function(appConfig) {
      var renderer = $injector.get(appConfig.renderer + 'Service');
      var chart = renderer.getConfig(appConfig);

      chart.getConfig = function() {
        return renderer.getConfig(appConfig).config;
      };

      chart.generate = renderer.generate;
      chart.watchers = renderer.watchers.map(function(v){
        return 'main.config.' + v;
      });

      return chart;
    };
  }
  chartService.$inject = ["$injector"];
})();

/**
 * @ngdoc directive
 * @name axis.directive:buildChart
 * @description
 * Builds the chart preview. Watches for specific scope changes and redraws when appropriate.
 *
 * This file is admittedly a bit of a mess and needs a total rewrite.
 */

(function(){
  'use strict';

  angular.module('axis')
    .directive('buildChart', buildChart);

  /** @ngInject */
  function buildChart(chartService, $window, $timeout) {
    var d3 = $window.d3;

    return {
      restrict: 'A',
      scope: {
        'main': '=config'
      },
      link: function postLink(scope, element) {
        var main = scope.main;
        var chart;

        element.children('svg').attr('transform', 'scale(2)'); // Needed to prevent pixely canvas

        function redraw() {
          // Sets size. @TODO move to chartService somehow.
          main.config.size = {
            width: main.config.chartWidth ? main.config.chartWidth : angular.element('.rendering').width() - 20,
            height: main.config.chartHeight ? main.config.chartHeight : angular.element(window).height() - 50,
          };
          main.config.chartWidth = main.config.size.width;
          main.config.chartHeight = main.config.size.height;

          if (chart && chart.hasOwnProperty('destroy')) { // Needed to prevent memory holes.
            try {
              chart.destroy();
            } catch(e) {
              throw new BuildChartServiceException(e);
            }
          }

          try {
            chart = chartService(main.appConfig).generate(element[0].id, main.config);
          } catch(e) {
            throw new BuildChartServiceException(e);
          }

        }

        redraw(); // initial draw.
        $timeout(function(){
          toggleBackground(main.config.background);
        }, 500);

        scope.$watchGroup(chartService(main.appConfig).watchers, function(){
          scope.$emit('triggerRedraw');
        });

        scope.$on('triggerRedraw', function(event){
          redraw(event);
        });

        /**
         * TODO refactor the following to make use of the chartService service.
         */

        // Change the data structure
        scope.$watch('main.config.data.columns', function(newValues){
          if (main.config.data.columns.length > 0) {
            main.config.data.colors = {}; // empty to prevent cruft from building. See #58.
            if (typeof main.config.data.types === 'object') {
              angular.forEach(main.config.data.types, function(v, key){
                for (var i = 0; i < newValues.length; i++){
                  if (newValues[i][0] === key) {
                    return;
                  }
                }
                // not here? delete.
                delete(main.config.data.types[key]);
              });
            } else {
              main.config.data.types = {};
            }

            main.config.data.axes = {};

            angular.forEach(main.columns, function(column, idx){
              // Set default y-axis. Should maybe be in csvInput or main?
              if (!main.config.data.axes[column]) {
                main.config.data.axes[column] = main.appConfig.defaults['y axis'] ? main.appConfig.defaults['y axis'] : 'y';
              }

              // Configure colours. @TODO move this somewhere else, make less shit. See #99.
              main.config.data.colors[column] = typeof chart.data.colors()[column] !== 'undefined' ? chart.data.colors()[column] : main.appConfig.colors[idx].value;

              // configure datum types
              if (main.config.chartGlobalType === 'series') {
                if (!main.config.data.types[column]) {
                  main.config.data.types[column] = main.appConfig.defaults['series type'] || 'line'; // default to line.
                }
              } else { // else the global chart type
                main.config.data.types[column] = main.config.chartGlobalType;
              }
            });

            redraw(); // Data's all updated — now trigger redraw.
          }
        }, true);

        // Change the colours
        scope.$watch('main.config.data.colors', function(){
          chart.data.colors(main.config.data.colors);
        }, true);

        // Change the chart types
        scope.$watch('main.config.data.types', function(){
          redraw();
        }, true);

        // Modify the axes
        scope.$watch('main.config.axis', function(newValues){
          for (var key in newValues) {
            if (newValues.hasOwnProperty(key)) {

              // Modify labels
              if (newValues[key].hasOwnProperty('label')) {
                var axis = {};
                axis[key] = newValues[key].label;
                chart.axis.labels(axis);
              }

              // Show or hide an axis; set maximums or minimums (requires simple redraw)
              if (newValues[key].hasOwnProperty('show') || newValues[key].hasOwnProperty('max') || newValues[key].hasOwnProperty('min')) {
                redraw();
              }

              // Setup prefix/suffix
              if (newValues[key].hasOwnProperty('prefix') ||
                  newValues[key].hasOwnProperty('suffix') ||
                  newValues[key].hasOwnProperty('accuracy') ||
                  newValues[key].hasOwnProperty('commas')) { // redraw if axis visibility changed
                if (typeof newValues[key].prefix === 'undefined') {
                  main.config.axis[key].prefix = '';
                } else {
                  main.config.axis[key].prefix = newValues[key].prefix;
                }

                if (typeof newValues[key].suffix === 'undefined') {
                  main.config.axis[key].suffix = '';
                } else {
                  main.config.axis[key].suffix = newValues[key].suffix;
                }

                if (typeof newValues[key].accuracy === 'undefined') {
                  main.config.axis[key].accuracy = 0;
                } else {
                  main.config.axis[key].accuracy = newValues[key].accuracy;
                }
              }
            }
          }
        }, true);

        // Modify data association
        scope.$watchGroup(['main.config.data.x', 'main.config.data.y', 'main.config.data.y2'], function(newValues){
          // Check if the column has categorical data strings
          newValues.forEach(function(v, i){
            var axis = (i === 0 ? 'x' : i === 1 ? 'y' : i === 2 ? 'y2' : '');
            main.config.data.columns.forEach(function(column){
              for (var i = 1; i < column.length; i++) {
                if (isNaN(column[i]) && column[0] === v) { // Column is NaN
                  main.config.axis[axis].type = 'category';
                  main.config.axis[axis].tick = undefined;
                  main.config.axis[axis].accuracy = undefined;
                  break;
                } else if (column[0] === v) {
                  main.config.data.axes[v] = axis;
                }
              }
            });
          });

          redraw();
        });

        // Watch for groups
        scope.$watch('main.config.data.groups', function(){
          redraw();
        }, true);

        // Watch for background
        scope.$watch('main.config.background', function(val){
          toggleBackground(val);
        });
        scope.$watch('main.config.backgroundColor', function(){
          d3.select('svg .chart-bg')
            .attr('fill', main.config.backgroundColor);
        });

        // Redraw on browser resize.
        angular.element($window).bind('resize', function(){
          redraw();
        });

        /**
         * Toggle background element
         * @param  {boolean} visible Whether the background is visible
         * @return {void}
         */
        function toggleBackground(visible) {
          if (visible) {
            d3.select('svg')
              .insert('rect', ':first-child')
              .attr('class', 'chart-bg')
              .attr('width', '100%')
              .attr('height', '100%')
              .attr('fill', main.config.backgroundColor);
          } else {
            d3.select('.chart-bg').remove();
          }
        }

        /**
         * Custom exception for the build chart service.
         * @param {string} message Exception message.
         */
        function BuildChartServiceException(message) {
          this.name = 'BuildChartServiceException';
          this.message = 'Chart rendering has failed: ' + message;
          this.config = main.config;
        }
        BuildChartServiceException.prototype = new Error();
        BuildChartServiceException.prototype.constructor = BuildChartServiceException;
      }
    };
  }
  buildChart.$inject = ["chartService", "$window", "$timeout"];
})();

/**
 * @ngdoc service
 * @name axis.c3Service
 * @description
 * # c3Service
 * Factory to render C3-based charts.
 * The following charts are currently supported:
 *   * line/spline
 *   * scatter
 *   * bar
 *   * pie
 *   * donut
 *   * gauge
 */

(function(){
'use strict';

  angular
    .module('axis')
    .factory('c3Service', c3Service);

  /** @ngInject */
  function c3Service($window) {
    var c3 = $window.c3;
    var d3 = $window.d3;

    function C3ServiceException(message) {
      this.name = 'C3ServiceException';
      this.message = 'Chart rendering has failed: ' + message;
    }
    C3ServiceException.prototype = new Error();
    C3ServiceException.prototype.constructor = C3ServiceException;

    return {
      /**
       * Scope variables to watch
       * @type {Array}
       */
      watchers: [
        'chartHeight',
        'chartWidth',
        'chartTitle',
        'chartCredit',
        'chartSource',
        'chartAccuracy',
        'legend.position',
        'legend.show',
        'subchart.show',
        'zoom.enabled',
        'interaction.enabled',
        'transition.duration',
        'title.text',
        'title.author',
        'title.source',
        'title.position',
        'area.zerobased',
        'grid.x.show',
        'grid.y.show',
        'data.labels'
      ],

      /**
       * Generates a chart based on config data
       * @param  {string} selectorID DOM ID to select
       * @param  {object} config     Config object passed in from scope
       * @return {object}            An instance of C3.js
       */
      generate: function(selectorID, config) {
        var chartConfig = angular.extend({bindto: '#' + selectorID}, config);
        var result;
        try {
          result = c3.generate(chartConfig);
        } catch (e) {
          console.dir(e);
          // throw new C3ServiceException(e);
        }

        return result;
      },

      /**
       * Builds a config object
       * @param {object} appConfig App config object via ConfigProvider.
       */
      getConfig: function (appConfig) {
        var defaultColors = [];
        angular.forEach(appConfig.colors, function(color){
          defaultColors.push(color.value);
        });

        var config = {
          data: {
            x: '',
            y: '',
            y2: '',
            columns: [
            ],
            axes: { // This is used in a similar fashion to config.axis.
              data1: appConfig.defaults['y axis'],
              data2: appConfig.defaults['y axis']
            },
            groups: { // Ditto.
            },
            type: '',
            types: {
              data1: angular.isDefined(appConfig.defaults['series type']) ? appConfig.defaults['series type'] : 'line', // Currently must set explictly on initialisation to populate view.
              data2: angular.isDefined(appConfig.defaults['series type']) ? appConfig.defaults['series type'] : 'line'
            },
            colors: {
              data1: angular.isDefined(appConfig.colors[0].value) ? appConfig.colors[0].value : 'blue',
              data2: angular.isDefined(appConfig.colors[1].value) ? appConfig.colors[1].value : 'red'
            }
          },
          grid: {
            x: {
              show: angular.isDefined(appConfig.defaults['grid x']) ? appConfig.defaults['grid x'] : false
            },
            y: {
              show: angular.isDefined(appConfig.defaults['grid y']) ? appConfig.defaults['grid y'] : false
            }
          },
          axis: {
            x: {
              show: angular.isDefined(appConfig.defaults['axis x']) ? appConfig.defaults['axis x'] : true,
              padding: {
                left: angular.isDefined(appConfig.defaults['axis x padding left']) ? appConfig.defaults['axis x padding left'] : 0,
                right: angular.isDefined(appConfig.defaults['axis x padding right']) ? appConfig.defaults['axis x padding left'] : 0
              }
            },
            y: {
              show: angular.isDefined(appConfig.defaults['axis y']) ? appConfig.defaults['axis y'] : true,
              invert: false,
              padding: {
                top: angular.isDefined(appConfig.defaults['axis y padding top']) ? appConfig.defaults['axis y padding top'] : 0,
                bottom: angular.isDefined(appConfig.defaults['axis y padding bottom']) ? appConfig.defaults['axis y padding bottom'] : 0
              }
            },
            y2: {
              show: angular.isDefined(appConfig.defaults['axis y2']) ? appConfig.defaults['axis y2'] : false,
              invert: false,
              padding: {
                top: angular.isDefined(appConfig.defaults['axis y2 padding top']) ? appConfig.defaults['axis y2 padding top'] : 0,
                bottom: angular.isDefined(appConfig.defaults['axis y2 padding bottom']) ? appConfig.defaults['axis y2 padding bottom'] : 0
              }
            }
          },
          point: {
            show:  angular.isDefined(appConfig.defaults['point show']) ? appConfig.defaults['point show'] : false
          },
          legend: {
            position: angular.isDefined(appConfig.defaults['legend position']) ? appConfig.defaults['legend position'] : 'bottom',
            show:  angular.isDefined(appConfig.defaults['legend show']) ? appConfig.defaults['legend show'] : true
          },
          color: {
            pattern: defaultColors
          },
          subchart: {
            show: angular.isDefined(appConfig.defaults['subchart show']) ? appConfig.defaults['subchart show'] : false
          },
          zoom: {
            enabled: angular.isDefined(appConfig.defaults['zoom enabled']) ? appConfig.defaults['zoom enabled'] : false
          },
          interaction: {
            enabled: angular.isDefined(appConfig.defaults['interaction enabled']) ? appConfig.defaults['interaction enabled'] : true
          },
          transition: {
            duration: angular.isDefined(appConfig.defaults['transition duration']) ? appConfig.defaults['transition duration'] : undefined
          },
          title: {
            text: angular.isDefined(appConfig.defaults['title text']) ? appConfig.defaults['title text'] : undefined,
            author: angular.isDefined(appConfig.defaults['title author']) ? appConfig.defaults['title author'] : undefined,
            source: angular.isDefined(appConfig.defaults['title source']) ? appConfig.defaults['title source'] : undefined,
            position: angular.isDefined(appConfig.defaults['title position']) ? appConfig.defaults['title position'] : 'top-right'
          },
          padding: {
            top: angular.isDefined(appConfig.defaults['padding top']) ? appConfig.defaults['padding top'] : 50,
            bottom: angular.isDefined(appConfig.defaults['padding bottom']) ? appConfig.defaults['padding bottom'] : 50,
            left: angular.isDefined(appConfig.defaults['padding left']) ? appConfig.defaults['padding left'] : 50,
            right: angular.isDefined(appConfig.defaults['padding right']) ? appConfig.defaults['padding right'] : 50
          }
        };

        var chartTypes = [
          'line',
          'step',
          'area',
          'area-step',
          'area-spline',
          'scatter',
          'bar',
          'spline',
          // 'donut', // These are handled via $scope.config.chartGlobalType
          // 'gauge',
          // 'pie'
        ];

        var axesConfig = [
          {value: 'x', label: 'Bottom'},
          {value: 'y', label: 'Left'},
          {value: 'y2', label: 'Right'}
        ];

        config.groups = {};

        // Populate Initial
        config.axis.x.accuracy = 0;
        config.axis.y.accuracy = 0;
        config.axis.y2.accuracy = 0;
        config.axis.x.commas = true;
        config.axis.y.commas = true;
        config.axis.y2.commas = true;
        config.axis.x.prefix = '';
        config.axis.y.prefix = '';
        config.axis.y2.prefix = '';
        config.axis.x.suffix = '';
        config.axis.y.suffix = '';
        config.axis.y2.suffix = '';
        config.axis.x.tick = {
          format: function (d) {
            if (config.chartGlobalType === 'series' && config.axis.x.type !== 'category') {
              var f = d3.format(config.axis.x.commas ? ',' : '' + '.' + config.axis.x.accuracy ? config.axis.x.accuracy : 0 + 'f');
              return config.axis.x.prefix + f(d).toString() + config.axis.x.suffix;
            } else {
              return d;
            }
          }
        };
        config.axis.y.tick = {
          format: function (d) {
            if (config.chartGlobalType === 'series' && config.axis.y.type !== 'category') {
              var f = d3.format(config.axis.y.commas ? ',' : '' + '.' + config.axis.y.accuracy ? config.axis.y.accuracy : 0 + 'f');
              return config.axis.y.prefix + f(d).toString() + config.axis.y.suffix;
            } else {
              return d;
            }
          }
        };
        config.axis.y2.tick = {
          format: function (d) {
            if (config.chartGlobalType === 'series' && config.axis.y2.type !== 'category') {
              var f = d3.format(config.axis.y2.commas ? ',' : '' + '.' + config.axis.y2.accuracy ? config.axis.y2.accuracy : 0 + 'f');
              return config.axis.y2.prefix + f(d).toString() + config.axis.y2.suffix;
            } else {
              return d;
            }
          }
        };

        config.chartGlobalType = 'series';
        config.chartAccuracy = 1;
        config.cms = typeof parent.tinymce !== 'undefined' ? true : false;

        config.pie = {
          label: {
            format: function(val, percentage) {
              return (percentage * 100).toFixed(config.chartAccuracy) + '%';
            }
          }
        };

        config.donut = {
          label: {
            format: function(val, percentage) {
              return (percentage * 100).toFixed(config.chartAccuracy) + '%';
            }
          }
        };

        config.gauge = {
          label: {
            format: function(val, percentage) {
              return (percentage * 100).toFixed(config.chartAccuracy) + '%';
            }
          }
        };

        config.area = {
          zerobased: angular.isDefined(appConfig.defaults['area zerobased']) ? appConfig.defaults['area zerobased'] : false
        };

        return {
          config: config,
          chartTypes: chartTypes,
          axesConfig: axesConfig,
          dependencies: this.getExternalDependencies(),
          setGlobalType: this.setGlobalType,
          setGroups: this.setGroups
        };
      },

      /**
       * Return external dependencies for embed code output.
       * @return {object} Contains arrays of CDN URLs for CSS and JS
       */
      getExternalDependencies: function(){
        return {
          css: [
            '//cdnjs.cloudflare.com/ajax/libs/c3/0.4.7/c3.min.css'
          ],
          js: [
            '//cdnjs.cloudflare.com/ajax/libs/d3/3.5.2/d3.min.js',
            '//cdnjs.cloudflare.com/ajax/libs/c3/0.4.7/c3.min.js'
          ]
        };
      },

      /**
       * Sets the global chart type.
       * @param  {string} type  A chart type
       * @param  {object} scope Axis scope
       */
      setGlobalType: function(type, scope) {
        // Set each data type to the new global type, unless it's a series chart,
        // in which case set everything to either line of defaults['series type'].
        for (var key in scope.config.data.types) {
          if (scope.config.data.types.hasOwnProperty(key)) {
            if (type !== 'series') {
              scope.config.data.types[key] = type;
            } else {
              scope.config.data.types[key] = scope.appConfig.defaults['series type'] || 'line';
            }
          }
        }

        // Apply any global type defaults from config
        if (angular.isDefined(scope.appConfig.defaults.charts) && angular.isDefined(scope.appConfig.defaults.charts[type])) {
          scope.config = angular.extend({}, scope.config, scope.appConfig.defaults.charts[type]);
        }
      },

      /**
       * Put data into groups.
       * @param  {object} scope Axis scope
       */
      setGroups: function(scope) {
        var groups = [];

        for (var group in scope.config.groups) {
          if (scope.config.groups.hasOwnProperty(group)) {
            if (typeof groups[scope.config.groups[group]] === 'undefined') {
              groups[scope.config.groups[group]] = [];
            }
            groups[scope.config.groups[group]].push(group);
          }
        }

        groups = groups.filter(function(item){ // Reindex array to prevent #98.
          return item;
        });
        scope.config.data.groups = groups;
      }
    }; //end return
  }
  c3Service.$inject = ["$window"];
})();

/**
 * @ngdoc directive
 * @name AxisJS.directive:saveButton
 * @description
 * # saveButton
 */

(function(){
  'use strict';

  angular.module('axis')
    .directive('saveButton', saveButton);

  function saveButton() {
    return {
      templateUrl: 'app/components/saveButton/saveButton.html',
      scope: true,
      link: function postLink(scope, element, attrs) {
        var main = scope.main;
        scope.buttonType = attrs.type;
        scope.items = attrs.type === 'export' ? main.appConfig.export : main.appConfig.save;
      }
    };
  }
})();

/**
 * @ngdoc directive
 * @name AxisJS.directive:addColorDataAttributes
 * @description
 * Lame hack to add data attributes to select options, for Bootstrap Color Picker.
 * Might be doable with $watch instead of $timeout. Feels sloppy doing it that way...
 */
(function(){
  'use strict';
  
  angular
    .module('axis')
    .directive('addColorDataAttributes', addColorDataAttributes);
  
  /** @ngInject */  
  function addColorDataAttributes($timeout) {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
        $timeout(function(){
          element.children('option').each(function(){
            var elm = angular.element(this);
            elm.attr('data-color', elm.text());
          });
          element.colorselector();
        }, 500);
      }
    };
  }
  addColorDataAttributes.$inject = ["$timeout"];
})();
/**
 * @ngdoc function
 * @name AxisJS.controller:MainController
 * @description
 * Main controller.
 * Pulls in config from the providers and sets up either the initial/default data or the loaded data.
 */

(function() {
  'use strict';

  angular
    .module('axis')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($injector, $window, appConfig, chartService, inputService, configChooser) {
    var vm = this;

    /**
     * Sets up the configuration object from YAML
     */
    var input = inputService(appConfig);
    var chart = chartService(appConfig);

    vm.inputs = {};
    vm.columns = [];
    vm.chartData = {};
    vm.appConfig = appConfig;
    vm.config = chart.config;
    vm.chartTypes = chart.chartTypes;
    vm.axesConfig = chart.axesConfig;
    vm.config.background = appConfig.background ? appConfig.background : false;
    vm.config.backgroundColor = appConfig.backgroundColor ? appConfig.backgroundColor : 'white';

    /**
     * Toggle the configuration chooser panel.
     * @return {void}
     */
    /* istanbul ignore next */
    vm.toggleChooser = function() {
      configChooser();
    };

    /**
     * Opens and closes datepicker in the stock symbol picker.
     * I have no idea why it is here and not there.
     * @type {Object}
     */
    /* istanbul ignore next */
    vm.datepicker = {
      isOpen: false,
      toggle: function($event){
        $event.preventDefault();
        $event.stopPropagation();
        this.isOpen = true;
      }
    };


    /**
     * Updates the data. Runs whenever data is added, deleted or modified.
     * @return {Object} MainController scope.
     */
    vm.updateData = function() {
      vm = input.input(vm);
      return vm;
    };

    /**
     * Validates data against chosen input picker.
     * @param  {string} value Value to validate
     * @return {boolean}       Whether string validates.
     */
    vm.validateData = function(value) {
      return input.validate(value);
    };

    /**
     * Resets the config to factory default from chartService.
     *
     * N.b., there's a bug (axisWP#16) wherein this keeps nuking config.issueType. The line
     * below resolves it, though it's a short-term fix given I'm not entirely sure what's going on.
     *
     * @return {void}
     */
    vm.resetConfig = function(type) {
      try {
        vm.config = chart.getConfig();
        vm.config.inputType = type; // Explicitly set inputType. See Axis-WordPress#16.
      } catch(e) {
        throw new MainControllerException('resetConfig failed');
      }
    };

    /**
     * Sets the global chart type.
     * @param  {string} type Type of chart
     * @return {void}
     */
    vm.setGlobalType = function(type) {
      chart.setGlobalType(type, vm);
      try {
        chart.setGlobalType(type, vm);
      } catch(e) {
        throw new MainControllerException('setGlobalType failed');
      }

    };

    /**
     * Sets data groups. Used with stacked bar charts.
     * TODO move to c3Service
     * @return {void}
     */
    vm.setGroups = function() {
      try {
        chart.setGroups(vm);
      } catch(e) {
        throw new MainControllerException('setGroups failed');
      }

    };

    /**
     * Sets the input service. Used by inputChooser.
     * @return {void}
     */
    vm.setInput = function() {
      input = inputService(appConfig);
    };

    /**
     * Checks whether any of the data are being displayed as areas.
     * TODO move to chartProvider.
     * @return {void}
     */
    vm.hasAreas = function(){
      for (var i in vm.config.data.types) {
        if (vm.config.data.types[i].match('area')) {
          return true;
        }
      }

      return false; // return false if no areas.
    };

    /**
     * Returns whether the chart type needs an axis.
     * @return {boolean} Whether the current chart global type needs an axis.
     */
    vm.hasAxis = function(){

    };

    /**
     * Debugging function — run getConfig() in the console to log current config object.
     * Also attaches $scope.config to window.chartConfig so it's visible in console.
     * @return {object} Chart config object.
     */
    /* istanbul ignore next */
    $window.getConfig = function() {
      console.dir(vm);
      $window.chartConfig = vm.config;
      return vm;
    };

    /**
     * Load data from external sources if present
     * @param  {array} appConfig.export List of all exporters in config file.
     * @return {void}
     */
    angular.forEach(appConfig.export, function(type){
      var output = $injector.get(type.toLowerCase().replace(' ', '') + 'Output');
      var importData;
      if (typeof output.import !== 'undefined') {
        importData = output.import(input);
        if (importData) {
          vm.inputs.inputData = importData.inputData;
          vm.config = importData.config;
        }
      }
    });

    // If the above services don't populate inputData, populate it with default data.
    if (!vm.inputs.inputData) {
      vm.inputs.inputData = input.defaultData;
    }

    // Finally, update and render.
    vm.updateData();

    function MainControllerException(message) {
      this.name = 'MainControllerException';
      this.message = message;
    }
    MainControllerException.prototype = new Error();
    MainControllerException.prototype.constructor = MainControllerException;
  }
  MainController.$inject = ["$injector", "$window", "appConfig", "chartService", "inputService", "configChooser"];
})();

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
  HeadController.$inject = ["$scope", "configProvider"];
})();

(function() {
  'use strict';

  angular
    .module('axis')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('Axis loaded.');
  }
  runBlock.$inject = ["$log"];

})();

/**
 * @ngdoc overview
 * @name AxisJS
 * @description
 * # AxisJS Routes
 *
 * Main route module of the application. Bootstraps config via ui-router.
 */

(function() {
  'use strict';

  angular
    .module('axis')
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('index', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController as main',
        resolve: {
          appConfig: ["configProvider", "$rootScope", function(configProvider, $rootScope) { /* istanbul ignore next */
            $rootScope.version = '1.1.0';
            return configProvider;
          }]
        }
      });
  }
  routeConfig.$inject = ["$stateProvider", "$urlRouterProvider"];

})();

/* global toastr:false, moment:false */
(function() {
  'use strict';

  angular
    .module('axis')
    .constant('toastr', toastr)
    .constant('moment', moment);
})();

(function() {
  'use strict';

  angular
    .module('axis')
    .config(config);

  // angular
  //   .module('axis')
  //   .factory('$exceptionHandler', exceptionHandlerOverride);

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
  config.$inject = ["$logProvider", "toastr", "$translateProvider", "$tooltipProvider"];

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

      if (angular.isDefined(exception.config)) { // Save current config to localStorage.
        try {
          localStorage.setItem('ls.backup_' + Date.now(), exception.config);
          $log.info('localStorage backup successful');
        } catch(e) {
          $log.warn('Warning: localStorage backup failed');
        }
      }
    };
  }
  exceptionHandlerOverride.$inject = ["$log"];
})();

angular.module("axis").run(["$templateCache", function($templateCache) {$templateCache.put("app/main/main.html","<div class=\"container-fluid\"><div class=\"row\"><div class=\"col-xs-7 rendering\"><ng-include src=\"\'app/components/chart/chart.html\'\"></ng-include></div><div class=\"col-xs-5\" id=\"chartControls\" ng-cloak=\"\"><button type=\"button\" class=\"btn-default btn-circle config\" ng-click=\"main.toggleChooser()\"><i class=\"glyphicon glyphicon-cog\" aria-hidden=\"true\"></i></button><h1><small>Axis {{version}}</small></h1><div class=\"row\"><div class=\"row\"><div class=\"col-xs-12\"><ng-include src=\"\'app/main/partials/input.html\'\"></ng-include></div></div><div class=\"row\"><div class=\"col-lg-6 col-lg-push-6\"><ng-include src=\"\'app/main/partials/axes.html\'\"></ng-include></div><div class=\"col-lg-6 col-lg-pull-6\"><ng-include src=\"\'app/main/partials/options.data.html\'\"></ng-include><ng-include src=\"\'app/main/partials/options.chart.html\'\"></ng-include><ng-include src=\"\'app/main/partials/options.output.html\'\"></ng-include></div></div></div><div class=\"row credit\"><small translate=\"CREDIT_TEXT\"></small></div></div></div></div>");
$templateCache.put("app/components/chart/chart.html","<div id=\"chart\" build-chart=\"\" config=\"main\" ng-style=\"{\'background-color\': main.config.chartBackground}\"></div><canvas id=\"canvas\" width=\"1072px\" height=\"676px\"></canvas>");
$templateCache.put("app/components/saveButton/saveButton.html","<span ng-switch=\"\" on=\"buttonType\"><span ng-switch-when=\"export\"><span ng-if=\"items.length > 1\" dropdown=\"\"><button type=\"button\" class=\"btn btn-success dropdown-toggle\" dropdown-toggle=\"\">{{ \'OUTPUT_EXPORT_BUTTON_LABEL\' | translate }} <span class=\"caret\"></span></button><ul class=\"dropdown-menu\" role=\"menu\"><li ng-repeat=\"output in items\"><a ng-class=\"\'export\' + output\" href=\"#\" export-chart=\"{{output.toLowerCase().replace(\' \', \'\')}}\">{{output}}</a></li></ul></span> <span ng-if=\"items.length === 1\"><button class=\"btn btn-success\" ng-class=\"\'export\' + items[0].toLowerCase()\" export-chart=\"{{items[0].toLowerCase().replace(\' \', \'\')}}\">Export to {{items[0].toLowerCase().replace(\' \', \'\')}}</button></span></span> <span ng-switch-when=\"save\"><span ng-if=\"items.length > 1\" dropdown=\"\"><button type=\"button\" class=\"btn btn-primary dropdown-toggle\" dropdown-toggle=\"\" export-chart=\"save\">{{ \'OUTPUT_SAVE_BUTTON_LABEL\' | translate }} <span class=\"caret\"></span></button><ul class=\"dropdown-menu\" role=\"menu\"><li ng-repeat=\"output in items\"><a ng-class=\"\'save\' + output.toUpperCase()\" href=\"#\">Save as {{output.toUpperCase()}}</a></li></ul></span> <span ng-if=\"items.length === 1\"><button class=\"btn btn-primary\" ng-class=\"\'save\' + items[0].toLowerCase()\" export-chart=\"{{items[0].toLowerCase().replace(\' \', \'\')}}\">Save to {{items[0].toLowerCase().replace(\' \', \'\')}}</button></span></span></span>");
$templateCache.put("app/main/partials/axes.html","<div class=\"panel panel-default\" ng-show=\"main.config.chartGlobalType === \'series\'\"><div class=\"panel-heading\" ng-click=\"main.axesOptionsAreCollapsed = !main.axesOptionsAreCollapsed\" ng-class=\"{collapsed: main.axesOptionsAreCollapsed}\">{{ \'PANEL_HEADING_AXES\' | translate }}</div><div class=\"panel-body\" collapse=\"!main.axesOptionsAreCollapsed\"><form class=\"form-horizontal\" role=\"form\"><fieldset ng-disabled=\"main.config.chartGlobalType !== \'series\'\"><h4 ng-repeat-start=\"axis in main.axesConfig\"><span translate=\"AXES_SECTION_HEADING\" translate-values=\"{axisPosition: axis.label}\"></span> <input type=\"checkbox\" ng-model=\"main.config.axis[axis.value].show\"></h4><fieldset ng-hide=\"!main.config.axis[axis.value].show\" ng-repeat-end=\"\"><div class=\"form-group\"><label class=\"col-sm-3 control-label\" for=\"{{axis.value}}AxisColumn\">{{ \'AXES_COLUMN_SELECT_LABEL\' | translate }}</label><div class=\"col-sm-9\"><select class=\"form-control\" id=\"{{axis.value}}AxisColumn\" popover=\"{{ \'POPOVER_TEXT_COLUMN_SELECT\' | translate }}\" ng-model=\"main.config.data[axis.value]\"><option value=\"\"></option><option value=\"{{col}}\" ng-repeat=\"col in main.columns\">{{col}}</option></select></div></div><div class=\"form-group\"><label class=\"col-sm-3 control-label\" for=\"{{axis.value}}AxisLabel\">{{ \'AXES_LABEL_FIELD_LABEL\' | translate }}</label><div class=\"col-sm-9\"><input type=\"text\" id=\"{{axis.value}}AxisLabel\" class=\"form-control\" ng-model=\"main.config.axis[axis.value].label\"></div></div><div class=\"form-group\"><label class=\"col-sm-3 control-label\" for=\"{{axis.value}}AxisPrefix\">{{ \'AXES_PREFIX_FIELD_LABEL\' | translate }}</label><div class=\"col-sm-9\"><input type=\"text\" id=\"{{axis.value}}AxisPrefix\" class=\"form-control\" ng-model=\"main.config.axis[axis.value].prefix\"></div></div><div class=\"form-group\"><label class=\"col-sm-3 control-label\" for=\"{{axis.value}}AxisSuffix\">{{ \'AXES_SUFFIX_FIELD_LABEL\' | translate }}</label><div class=\"col-sm-9\"><input type=\"text\" id=\"{{axis.value}}AxisSuffix\" class=\"form-control\" ng-model=\"main.config.axis[axis.value].suffix\"></div></div><div class=\"form-group\"><label class=\"col-sm-3 control-label\" for=\"{{axis.value}}AxisMin\">{{ \'AXES_MIN_FIELD_LABEL\' | translate }}</label><div class=\"col-sm-9\"><input type=\"number\" id=\"{{axis.value}}AxisMin\" class=\"form-control\" ng-model=\"main.config.axis[axis.value].min\"></div></div><div class=\"form-group\"><label class=\"col-sm-3 control-label\" for=\"yAxisMax\">{{ \'AXES_MAX_FIELD_LABEL\' | translate }}</label><div class=\"col-sm-9\"><input type=\"number\" id=\"{{axis.value}}AxisMax\" class=\"form-control\" ng-model=\"main.config.axis[axis.value].max\"></div></div><div class=\"form-group\" ng-hide=\"main.config.data[axis.value]\"><label class=\"col-sm-3 control-label\" for=\"{{axis.value}}AxisAccuracy\">{{ \'AXES_ACCURACY_SELECT_LABEL\' | translate }}</label><div class=\"col-sm-9\"><div class=\"input-group\"><select id=\"{{axis.value}}AxisAccuracy\" class=\"form-control\" ng-model=\"main.config.axis[axis.value].accuracy\"><option value=\"0\">{{ \'AXES_ACCURACY_SELECT_OPTION_TEXT\' | translate:\'{accuracy: 0}\' }}</option><option value=\"1\">{{ \'AXES_ACCURACY_SELECT_OPTION_TEXT\' | translate:\'{accuracy: 1}\' }}</option><option value=\"2\">{{ \'AXES_ACCURACY_SELECT_OPTION_TEXT\' | translate:\'{accuracy: 2}\' }}</option><option value=\"3\">{{ \'AXES_ACCURACY_SELECT_OPTION_TEXT\' | translate:\'{accuracy: 3}\' }}</option><option value=\"4\">{{ \'AXES_ACCURACY_SELECT_OPTION_TEXT\' | translate:\'{accuracy: 4}\' }}</option><option value=\"5\">{{ \'AXES_ACCURACY_SELECT_OPTION_TEXT\' | translate:\'{accuracy: 5}\' }}</option></select><span class=\"input-group-addon\" popover=\"{{ \'POPOVER_TEXT_ACCURACY_CHECKBOX\' | translate }}\"><input id=\"{{axis.value}}AxisCommas\" type=\"checkbox\" ng-model=\"main.config.axis[axis.value].commas\" ng-disabled=\"main.config.data[axis.value]\"></span></div></div></div><div class=\"form-group\"><label class=\"col-sm-3 control-label\" for=\"{{axis.value}}AxisTickCulling\">{{ \'AXES_CULLING_FIELD_LABEL\' | translate }}</label><div class=\"col-sm-9\" popover=\"{{ \'POPOVER_TEXT_CULLING_FIELD\' | translate }}\"><input type=\"number\" id=\"{{axis.value}}AxisTickCulling\" class=\"form-control\" ng-model=\"main.config.axis[axis.value].tick.culling.max\"></div></div><div class=\"form-group\"><label class=\"col-sm-3 control-label\" for=\"{{axis.value}}AxisTickCount\">{{ \'AXES_COUNT_FIELD_LABEL\' | translate }}</label><div class=\"col-sm-9\" popover=\"{{ \'POPOVER_TEXT_COUNT_FIELD\' | translate }}\"><input type=\"number\" id=\"{{axis.value}}AxisTickCount\" class=\"form-control\" ng-model=\"main.config.axis[axis.value].tick.count\"></div></div><div class=\"form-group\" ng-if=\"main.config.data[axis.value]\"><label class=\"col-sm-3 control-label\" for=\"{{axis.value}}TimeseriesBoolean\">{{ \'AXES_TIMESERIES_FIELD_LABEL\' | translate }}</label><div class=\"col-sm-9 checkbox\"><input type=\"checkbox\" id=\"{{axis.value}}TimeseriesBoolean\" ng-true-value=\"\'timeseries\'\" ng-false-value=\"\'categorical\'\" ng-model=\"main.config.axis[axis.value].type\"></div></div><div class=\"form-group\" ng-if=\"main.config.axis[axis.value].type === \'timeseries\'\"><label class=\"col-sm-3 control-label\" for=\"{{axis.value}}TimeseriesFormat\"><a href=\"https://github.com/mbostock/d3/wiki/Time-Formatting\" target=\"_blank\">{{ \'AXES_DATETIME_FORMAT_FIELD_LABEL\' | translate }}</a></label><div class=\"col-sm-9\"><input type=\"text\" id=\"{{axis.value}}TimeseriesFormat\" class=\"form-control\" value=\"timeseries\" ng-model=\"main.config.axis[axis.value].tick.format\"></div></div><div class=\"form-group\" ng-if=\"[\'y\', \'y2\'].indexOf(axis.value) > -1\"><label class=\"col-sm-3 control-label\" for=\"{{axis.value}}Inverted\">{{ \'AXES_INVERT\' | translate }}</label><div class=\"col-sm-9\"><div class=\"checkbox\"><label><input type=\"checkbox\" id=\"{{axis.value}}Inverted\" ng-model=\"main.config.axis[axis.value].inverted\"></label></div></div></div></fieldset></fieldset></form></div></div>");
$templateCache.put("app/main/partials/input.html","<div class=\"panel panel-default\"><div class=\"panel-heading\" ng-click=\"main.inputIsCollapsed = !main.inputIsCollapsed\" ng-class=\"{collapsed: !main.inputIsCollapsed}\">{{ \'PANEL_HEADING_DATA_INPUT\' | translate }}</div><div class=\"panel-body input-chooser\" collapse=\"main.inputIsCollapsed\"><input-chooser config=\"{ config: main.config, appConfig: main.appConfig, inputs: main.inputs, updateData: main.updateData, resetConfig: main.resetConfig, setInput: main.setInput }\"></input-chooser></div></div>");
$templateCache.put("app/main/partials/options.chart.html","<div class=\"panel panel-default\"><div class=\"panel-heading\" ng-click=\"chartOptionsAreCollapsed = !chartOptionsAreCollapsed\" ng-class=\"{collapsed: chartOptionsAreCollapsed}\">{{ \'PANEL_HEADING_CHART_OPTIONS\' | translate }}</div><div class=\"panel-body\" collapse=\"!chartOptionsAreCollapsed\"><form class=\"form-horizontal\" role=\"form\"><div class=\"form-group\"><label for=\"legendPosition\" class=\"col-sm-4 control-label\">{{ \'CHART_OPTIONS_LEGEND_SELECT_LABEL\' | translate }}</label><div class=\"col-sm-8\"><div class=\"input-group\"><select class=\"form-control\" id=\"legendPosition\" ng-model=\"main.config.legend.position\"><option value=\"bottom\">{{ \'CHART_OPTIONS_LEGEND_SELECT_OPTION_BOTTOM\' | translate }}</option><option value=\"right\">{{ \'CHART_OPTIONS_LEGEND_SELECT_OPTION_RIGHT\' | translate }}</option></select><span class=\"input-group-addon\"><input type=\"checkbox\" ng-model=\"main.config.legend.show\" popover=\"{{ \'POPOVER_TEXT_LEGEND_CHECKBOX\' | translate }}\"></span></div></div></div><div class=\"form-group\"><label for=\"chartTitle\" class=\"col-sm-4 control-label\">{{ \'CHART_OPTIONS_TITLE_LABEL\' | translate }}</label><div class=\"col-sm-8\"><input type=\"text\" class=\"form-control\" id=\"chartTitle\" ng-model=\"main.config.title.text\" placeholder=\"\"></div></div><div class=\"form-group\"><label for=\"chartCredit\" class=\"col-sm-4 control-label\">{{ \'CHART_OPTIONS_CREDIT_LABEL\' | translate }}</label><div class=\"col-sm-8\"><input type=\"text\" class=\"form-control\" id=\"chartCredit\" ng-model=\"main.config.title.author\" placeholder=\"{{ \'CHART_OPTIONS_CREDIT_FIELD_PLACEHOLDER\' | translate }}\"></div></div><div class=\"form-group\"><label for=\"chartSource\" class=\"col-sm-4 control-label\">{{ \'CHART_OPTIONS_SOURCE_LABEL\' | translate }}</label><div class=\"col-sm-8\"><input type=\"text\" class=\"form-control\" id=\"chartSource\" ng-model=\"main.config.title.source\" placeholder=\"{{ \'CHART_OPTIONS_SOURCE_FIELD_PLACEHOLDER\' | translate }}\"></div></div><div class=\"form-group\"><label for=\"chartTitlePosition\" class=\"col-sm-4 control-label\">{{ \'CHART_OPTIONS_TITLES_POSITION\' | translate }}</label><div class=\"col-sm-8\"><select id=\"chartTitlePosition\" class=\"form-control\" ng-model=\"main.config.title.position\"><option value=\"top-left\">{{ \'CHART_OPTIONS_TITLES_POSITION_SELECT_OPTION_TOP_LEFT\' | translate }}</option><option value=\"top-center\">{{ \'CHART_OPTIONS_TITLES_POSITION_SELECT_OPTION_TOP_CENTER\' | translate }}</option><option value=\"top-right\">{{ \'CHART_OPTIONS_TITLES_POSITION_SELECT_OPTION_TOP_RIGHT\' | translate }}</option></select></div></div><div class=\"form-group\"><label for=\"chartWidth\" class=\"col-sm-4 control-label\">{{ \'CHART_OPTIONS_WIDTH_LABEL\' | translate }}</label><div class=\"col-sm-8 input-group chartWidth-group\"><input type=\"number\" class=\"form-control\" id=\"chartWidth\" ng-model=\"main.config.chartWidth\"> <span class=\"input-group-addon\">px</span></div></div><div class=\"form-group\"><label for=\"chartHeight\" class=\"col-sm-4 control-label\">{{ \'CHART_OPTIONS_HEIGHT_LABEL\' | translate }}</label><div class=\"col-sm-8 input-group chartHeight-group\"><input type=\"number\" class=\"form-control\" id=\"chartHeight\" ng-model=\"main.config.chartHeight\"> <span class=\"input-group-addon\">px</span></div></div><div class=\"form-group\"><label for=\"chartTransition\" class=\"col-sm-4 control-label\">{{ \'CHART_OPTIONS_TRANSITION_LABEL\' | translate }}</label><div class=\"col-sm-8 input-group chartHeight-group\"><input type=\"number\" class=\"form-control\" id=\"chartHeight\" ng-model=\"main.config.transition.duration\"> <span class=\"input-group-addon\">ms</span></div></div><div class=\"form-group\" ng-if=\"main.config.chartGlobalType !== \'series\'\"><label class=\"col-sm-4 control-label\" for=\"chartAccuracy\">{{ \'CHART_OPTIONS_SELECT_LABEL\' | translate }}</label><div class=\"col-sm-8\"><select id=\"chartAccuracy\" class=\"form-control\" ng-model=\"main.config.chartAccuracy\"><option value=\"0\">{{ \'CHART_OPTIONS_SELECT_OPTION_TEXT\' | translate:\'{accuracy: 0}\' }}</option><option value=\"1\">{{ \'CHART_OPTIONS_SELECT_OPTION_TEXT\' | translate:\'{accuracy: 1}\' }}</option><option value=\"2\">{{ \'CHART_OPTIONS_SELECT_OPTION_TEXT\' | translate:\'{accuracy: 2}\' }}</option><option value=\"3\">{{ \'CHART_OPTIONS_SELECT_OPTION_TEXT\' | translate:\'{accuracy: 3}\' }}</option></select></div></div><div class=\"checkbox\" ng-if=\"main.config.chartGlobalType === \'series\' && main.hasAreas()\"><label><input type=\"checkbox\" id=\"chartZerobased\" ng-model=\"main.config.area.zerobased\"> {{ \'CHART_OPTIONS_ZERO_BASED\' | translate }}</label></div><div class=\"checkbox\" popover=\"{{ \'POPOVER_TEXT_ROTATED_CHECKBOX\' | translate }}\" ng-if=\"main.config.chartGlobalType === \'series\'\"><label><input type=\"checkbox\" id=\"chartRotated\" ng-model=\"main.config.axis.rotated\"> {{ \'CHART_OPTIONS_ROTATED_LABEL\' | translate }}</label></div><div class=\"checkbox\" popover=\"{{ \'POPOVER_TEXT_ZOOMABLE_CHECKBOX\' | translate }}\" ng-if=\"main.config.chartGlobalType === \'series\'\"><label><input type=\"checkbox\" id=\"chartZoomable\" ng-model=\"main.config.zoom.enabled\"> {{ \'CHART_OPTIONS_ZOOMABLE_LABEL\' | translate }}</label></div><div class=\"checkbox\" popover=\"{{ \'POPOVER_TEXT_SUBCHART_CHECKBOX\' | translate }}\" ng-if=\"main.config.chartGlobalType === \'series\'\"><label><input type=\"checkbox\" id=\"chartSubchart\" ng-model=\"main.config.subchart.show\"> {{ \'CHART_OPTIONS_SUBCHART_LABEL\' | translate }}</label></div><div class=\"checkbox\" popover=\"{{ \'POPOVER_TEXT_BACKGROUND_CHECKBOX\' | translate }}\"><label><input type=\"checkbox\" id=\"chartRotated\" ng-model=\"main.config.background\"> {{ \'CHART_OPTIONS_BACKGROUND_LABEL\' | translate }}<div ng-if=\"main.config.background && main.appConfig[\'background colors\'] && main.appConfig[\'background colors\'].length > 1\"><select add-color-data-attributes=\"\" ng-if=\"main.appConfig.colorPicker === \'simple\'\" ng-model=\"main.config.backgroundColor\" ng-options=\"color.value as color.value for color in main.appConfig[\'background colors\']\"></select><div ng-if=\"main.appConfig.colorPicker === \'default\'\"><input minicolors=\"\" type=\"hidden\" ng-model=\"main.config.backgroundColor\"></div></div></label></div><div class=\"checkbox\"><label><input type=\"checkbox\" id=\"chartInteraction\" ng-model=\"main.config.interaction.enabled\"> {{ \'CHART_OPTIONS_INTERACTION_LABEL\' | translate }}</label></div><div class=\"checkbox\" ng-if=\"main.config.chartGlobalType === \'series\'\"><label><input type=\"checkbox\" id=\"xGridlines\" ng-model=\"main.config.grid.x.show\"> {{ \'CHART_OPTIONS_X_GRID_LABEL\' | translate }}</label></div><div class=\"checkbox\" ng-if=\"main.config.chartGlobalType === \'series\'\"><label><input type=\"checkbox\" id=\"yGridlines\" ng-model=\"main.config.grid.y.show\"> {{ \'CHART_OPTIONS_Y_GRID_LABEL\' | translate }}</label></div><div class=\"checkbox\"><label><input type=\"checkbox\" id=\"dataLabels\" ng-model=\"main.config.data.labels\"> {{ \'CHART_OPTIONS_DATA_LABELS_LABEL\' | translate }}</label></div></form></div></div>");
$templateCache.put("app/main/partials/options.data.html","<div class=\"panel panel-default\"><div class=\"panel-heading\" ng-click=\"dataOptionsAreCollapsed = !dataOptionsAreCollapsed\" ng-class=\"{collapsed: dataOptionsAreCollapsed}\">{{ \'PANEL_HEADING_DATA_OPTIONS\' | translate }}</div><div class=\"panel-body\" collapse=\"!dataOptionsAreCollapsed\"><select ng-model=\"main.config.chartGlobalType\" class=\"form-control\" id=\"chartGlobalType\" ng-change=\"main.setGlobalType(main.config.chartGlobalType)\" popover=\"{{ \'POPOVER_TEXT_CHART_GLOBAL_TYPE\' | translate }}\"><option value=\"series\">{{ \'DATA_OPTIONS_GLOBAL_CHART_TYPE_SELECT_SERIES\' | translate }}</option><option value=\"pie\">{{ \'DATA_OPTIONS_GLOBAL_CHART_TYPE_SELECT_PIE\' | translate }}</option><option value=\"donut\">{{ \'DATA_OPTIONS_GLOBAL_CHART_TYPE_SELECT_DONUT\' | translate }}</option><option value=\"gauge\" ng-disabled=\"main.config.data.columns.length > 1\">{{ \'DATA_OPTIONS_GLOBAL_CHART_TYPE_SELECT_GAUGE\' | translate }}</option></select><div class=\"form-group\" ng-repeat=\"col in main.columns\" ng-hide=\"[main.config.data.x, main.config.data.y, main.config.data.y2].indexOf(col) > -1\"><label for=\"type-{{col}}\">{{col}}</label><div class=\"input-group\"><span class=\"input-group-addon\"><select add-color-data-attributes=\"\" ng-if=\"main.appConfig.colorPicker === \'simple\'\" ng-model=\"main.config.data.colors[col]\" ng-options=\"color.value as color.value for color in main.appConfig.colors\"></select><div ng-if=\"main.appConfig.colorPicker === \'default\'\"><input minicolors=\"\" type=\"hidden\" ng-model=\"main.config.data.colors[col]\"></div></span><select ng-options=\"chart as chart for chart in main.chartTypes\" class=\"form-control\" id=\"type-{{col}}\" ng-model=\"main.config.data.types[col]\" ng-disabled=\"main.config.chartGlobalType !== \'series\'\" popover=\"{{ \'POPOVER_TEXT_DATUM_TYPE\' | translate }}\"></select><span class=\"input-group-addon\" ng-show=\"[\'bar\', \'area\', \'area-step\', \'area-spline\'].indexOf(main.config.data.types[col]) >= 0\"><select id=\"group-{{col}}\" ng-model=\"main.config.groups[col]\" ng-change=\"main.setGroups()\" title=\"group\"><option value=\"{{index}}\" ng-repeat=\"(index, group) in main.columns\">{{index + 1}}</option></select></span></div></div></div></div>");
$templateCache.put("app/main/partials/options.output.html","<div class=\"panel panel-default\"><div class=\"panel-heading\" ng-click=\"outputOptionsAreCollapsed = !outputOptionsAreCollapsed\" ng-class=\"{collapsed: !outputOptionsAreCollapsed}\">{{ \'PANEL_HEADING_OUTPUT\' | translate }}</div><div class=\"panel-body\" style=\"text-align: center;\" collapse=\"outputOptionsAreCollapsed\"><div class=\"btn-group\"><save-button type=\"export\"></save-button></div><div class=\"btn-group\"><save-button type=\"save\"></save-button></div></div></div>");
$templateCache.put("app/components/input/csv/csvInput.html","<textarea maintain-focus=\"\" id=\"csvInput\" class=\"form-control\" rows=\"3\" ng-model=\"main.inputs.inputData\" ui-validate=\"\'main.validateData($value)\'\" ng-change=\"main.updateData()\">\n</textarea><div class=\"alert alert-danger\" ng-show=\"main.appConfig.input === \'csv\' && !main.inputs.inputData\"><strong>Whoops!</strong> {{ \'INPUT_MALFORMED_CSV_ERROR\' | translate }}</div>");
$templateCache.put("app/components/input/feed/feedInput.html","<div class=\"row\"><div class=\"col-xs-6\"><label for=\"feed-data-start-date\">{{ \'FEED_INPUT_START_DATE_LABEL\' | translate }}</label><p class=\"input-group\"><input type=\"text\" datepicker-popup=\"yyyy-MM-dd\" id=\"feed-data-start-date\" class=\"form-control\" ng-model=\"inputs.inputData.dateStart\" ng-model-options=\"{ updateOn: \'blur\'}\" is-open=\"datepicker.isOpen\" ng-change=\"main.updateData()\" close-text=\"Close\"> <span class=\"input-group-btn\"><button type=\"button\" class=\"btn btn-default\" ng-click=\"datepicker.toggle($event)\"><i class=\"glyphicon glyphicon-calendar\"></i></button></span></p></div><div class=\"col-xs-6\"><label for=\"feed-data-end-date\">{{ \'FEED_INPUT_END_DATE_LABEL\' | translate }}</label><p class=\"input-group\"><input type=\"text\" id=\"feed-data-end-date\" class=\"form-control\" datepicker-popup=\"yyyy-MM-dd\" ng-model=\"inputs.inputData.dateEnd\" ng-model-options=\"{ updateOn: \'blur\'}\" is-open=\"datepicker.isOpen\" ng-change=\"main.updateData()\" close-text=\"Close\"> <span class=\"input-group-btn\"><button type=\"button\" class=\"btn btn-default\" ng-click=\"datepicker.toggle($event)\"><i class=\"glyphicon glyphicon-calendar\"></i></button></span></p></div></div>");
$templateCache.put("app/components/input/financial/financialInput.html","<div class=\"row\"><div class=\"col-xs-6\"><label for=\"financial-data-start-date\">{{ \'FINANCIAL_INPUT_START_DATE_LABEL\' | translate }}</label><p class=\"input-group\"><input type=\"text\" datepicker-popup=\"yyyy-MM-dd\" id=\"financial-data-start-date\" class=\"form-control\" ng-model=\"main.inputs.inputData.dateStart\" ng-model-options=\"{ updateOn: \'blur\'}\" is-open=\"datepicker.isOpen\" ng-change=\"main.updateData()\" close-text=\"Close\"> <span class=\"input-group-btn\"><button type=\"button\" class=\"btn btn-default\" ng-click=\"datepicker.toggle($event)\"><i class=\"glyphicon glyphicon-calendar\"></i></button></span></p></div><div class=\"col-xs-6\"><label for=\"financial-data-end-date\">{{ \'FINANCIAL_INPUT_END_DATE_LABEL\' | translate }}</label><p class=\"input-group\"><input type=\"text\" id=\"financial-data-end-date\" class=\"form-control\" datepicker-popup=\"yyyy-MM-dd\" ng-model=\"main.inputs.inputData.dateEnd\" ng-model-options=\"{ updateOn: \'blur\'}\" is-open=\"datepicker.isOpen\" ng-change=\"main.updateData()\" close-text=\"Close\"> <span class=\"input-group-btn\"><button type=\"button\" class=\"btn btn-default\" ng-click=\"datepicker.toggle($event)\"><i class=\"glyphicon glyphicon-calendar\"></i></button></span></p></div></div><div class=\"row\"><div class=\"col-xs-12\"><label for=\"symbolInput\">{{ \'FINANCIAL_INPUT_SYMBOL_LABEL\' | translate }}</label> <input type=\"text\" id=\"financial-data-symbol-input\" class=\"form-control\" ng-model=\"main.inputs.inputData.symbol\" ng-model-options=\"{ updateOn: \'blur\'}\" ng-change=\"main.updateData()\"></div></div>");
$templateCache.put("app/components/input/inputChooser/inputChooser.html","<div ng-if=\"!main.config.inputType\"><div ng-if=\"!inputCtrl.isArray(main.appConfig.input)\"><ng-include src=\"\'app/components/input/\' + main.appConfig.input + \'/\' + main.appConfig.input + \'Input.html\'\"></ng-include></div><div ng-if=\"inputCtrl.isArray(main.appConfig.input)\" class=\"input-buttons\"><button class=\"btn btn-lg btn-warning\" ng-repeat=\"input in main.appConfig.input\" ng-hide=\"inputCtrl.template\" ng-click=\"inputCtrl.setTemplate(input)\">{{input}}</button><div ng-if=\"inputCtrl.template\" ng-include=\"\" src=\"\'app/components/input/\' + inputCtrl.template + \'/\' + inputCtrl.template + \'Input.html\'\"></div></div></div><div ng-if=\"main.config.inputType\"><div ng-include=\"\" src=\"\'app/components/input/\' + main.config.inputType + \'/\' + main.config.inputType + \'Input.html\'\"></div></div>");
$templateCache.put("app/components/input/spreadsheet/spreadsheetInput.directive.html","<hot-table name=\"hot-table-instance\" hot-id=\"spreadsheet-input\" row-headers=\"true\" col-headers=\"true\" datarows=\"sheet.inputs.inputData\" min-spare-rows=\"27\" min-spare-cols=\"10\" height=\"200\" on-before-change=\"sheet.clearOnPaste\" on-after-change=\"main.updateData\"></hot-table>");
$templateCache.put("app/components/input/spreadsheet/spreadsheetInput.html","<spreadsheet-input config=\"main\"></spreadsheet-input>");
$templateCache.put("app/components/config/configChooser/configChooser.html","<div class=\"modal-header\"><h3 class=\"modal-title\">Choose a config</h3></div><div class=\"modal-body\"><ul class=\"nav nav-pills nav-stacked\"><li role=\"presentation\" ng-repeat=\"theme in ConfChooseCtrl.themes\"><a href=\"#\" ng-click=\"ConfChooseCtrl.setConfig(theme.file)\">{{theme.name}}</a></li></ul></div><div class=\"modal-footer\"><button class=\"btn btn-warning\" ng-click=\"ConfChooseCtrl.cancel($event)\">Cancel</button></div>");
$templateCache.put("app/components/output/embedcode/embedcode.modal.html","<h1 style=\"text-align: center;\">Embed code:<br><small style=\"text-align: center;\">Copy and paste this into a new HTML document</small></h1><h5 style=\"text-align: center;\"><label>Include dependencies?</label> <input type=\"checkbox\" ng-model=\"includeDeps\" ng-change=\"updateOutput(includeDeps)\"></h5><textarea width=\"100%\" height=\"400\" class=\"form-control\">{{output}}</textarea>");}]);