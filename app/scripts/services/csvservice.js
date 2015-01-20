'use strict';
// TODO abstract CSV input into csvService
/**
 * @ngdoc service
 * @name axisJsApp.csvService
 * @description
 * # csvService
 * Factory in the axisJsApp.
 */
angular.module('axisJSApp')
  .factory('csvInput', function () {

    var validateCSV = function (value) {
      var parserConfig = {
        header: true
      };

      // Detect TSV; fallback to auto-detection. @see #39.
      if (value.match('\t')) {
        parserConfig.delimiter = '\t';
      }

      var csv = Papa.parse(value, parserConfig);
      var noDelimiter = /^[^,\t\s]*\n[^,\t\s]*$/gm; // Edge-case for gauge charts (one column of data)
      return (csv.errors.length > 0 && !value.match(noDelimiter) ? false : true);
    };

    var defaultCSV = 'data1\tdata2\n30\t50\n200\t20\n100\t10\n400\t40\n150\t15\n250\t25';

    var parseCSV = function (scope) {
      if (scope.inputs.csvData) {
        scope.chartData = []; // Empty, or else new column names will break ng-grid
        scope.columns = []; // Clear existing
        scope.config.data.columns = [];
        var parserConfig = {
          header: true
        };

        // Detect TSV; fallback to auto-detection. @see #39.
        if (scope.inputs.csvData.match('\t')) {
          parserConfig.delimiter = '\t';
        }

        scope.chartData = Papa.parse(scope.inputs.csvData, parserConfig).data;
        // n.b., you can also use rows in C3 instead, which is like Papa.parse() without
        // header: true. TODO for anyone wanting to play some code golf...

        if (scope.chartData.length > 0) {
          scope.columns = Object.keys(scope.chartData[0]);
          angular.forEach(scope.columns, function(colName) {
            var column = [];
            column.push(colName);
            angular.forEach(scope.chartData, function(datum) {
              column.push(datum[colName]);
            });

            scope.config.data.columns.push(column);
            if (typeof scope.config.data.types[colName] === 'undefined') {
              if (scope.config.chartGlobalType === 'series') {
                scope.config.data.types[colName] = 'line'; // default to line.
              } else { // else the global chart type
                scope.config.data.types[colName] = scope.config.chartGlobalType;
              }

            }
          });
        }
      }
    };

    // Public API here
    return {
      validate: function(value) {
        return validateCSV(value);
      },

      defaultData: {
        csvData: defaultCSV
      },

      input: function(scope) {
        return parseCSV(scope);
      }
    };
  });
