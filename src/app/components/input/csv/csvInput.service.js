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
})();
