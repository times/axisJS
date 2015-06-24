/**
 * @ngdoc service
 * @name axisJsApp.csvService
 * @description
 * # csvService
 * Factory in the axisJsApp.
 */

'use strict';

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
      if (scope.inputs.inputData) {
        scope.chartData = []; // Empty, or else new column names will break ng-grid
        scope.columns = []; // Clear existing
        scope.config.data.columns = [];
        var parserConfig = {
          header: true
        };

        // Detect TSV; fallback to auto-detection. @see #39.
        if (scope.inputs.inputData.match('\t')) {
          parserConfig.delimiter = '\t';
        }

        scope.chartData = Papa.parse(scope.inputs.inputData, parserConfig).data;

        // Convert objects into arrays. Might be better long-term to use C3's JSON input.
        // Lots of this stuff is C3-specific. TODO move to c3Service.
        if (scope.chartData.length > 0) {
          scope.columns = Object.keys(scope.chartData[0]);
          angular.forEach(scope.columns, function(colName) {
            var column = [];
            column.push(colName);
            angular.forEach(scope.chartData, function(datum) {
              column.push(datum[colName]);
            });

            scope.config.data.columns.push(column);
          });
        }
      }

      return scope;
    };

    var convertColsToCSV = function(columns) {
      console.log(columns);
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

      return Papa.unparse({fields: headers, data: data}, {delimiter: '\t'});
    };

    // Public API here
    return {
      validate: function(value) {
        return validateCSV(value);
      },

      defaultData: defaultCSV,

      input: function(scope) {
        return parseCSV(scope);
      },

      convert: function(columns) {
        return convertColsToCSV(columns);
      }
    };
  });
