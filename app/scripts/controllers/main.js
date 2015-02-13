/**
 * @ngdoc function
 * @name axisJSApp.controller:MainCtrl
 * @description
 * Main controller. Populates and links the input fields.
 */

'use strict';

angular.module('axisJSApp')
  .controller('MainCtrl', function (chartProvider, inputService, configChooser, appConfig, $scope) {
    /**
     * Sets up the configuration object from YAML
     */
    $scope.appConfig = appConfig;
    $scope.appConfig.toggleChooser = configChooser.toggle;
    $scope.inputs = {};
    $scope.columns = [];
    $scope.chartData = {};
    $scope.config = chartProvider(appConfig).config;
    $scope.chartTypes = chartProvider(appConfig).chartTypes;
    $scope.axesConfig = chartProvider(appConfig).axesConfig;
    $scope.config.background = appConfig.background ? appConfig.background : false;
    $scope.config.backgroundColor = appConfig.backgroundColor ? appConfig.backgroundColor : 'white';
    var input = inputService(appConfig);

    /**
     * Updates the data. Runs whenever data is added, deleted or modified.
     */
    $scope.updateData = function() {
      return input.input($scope);
    };

    /**
     * Validates the data. Runs on data change.
     */
    $scope.validateData = function(value) {
      return input.validate(value);
    };

    /**
     * Sets the global chart type.
     * TODO move to c3Service
     */
    $scope.setGlobalType = function(type) {
      for (var key in $scope.config.data.types) {
        if ($scope.config.data.types.hasOwnProperty(key)) {
          if (type !== 'series') {
            $scope.config.data.types[key] = type;
          } else {
            $scope.config.data.types[key] = 'line';
          }

        }
      }
    };

    /**
     * Sets data groups. Used with stacked bar charts.
     * TODO move to c3Service
     */
    $scope.setGroups = function() {
      $scope.config.data.groups = [];
      for (var group in $scope.config.groups) {
        if ($scope.config.groups.hasOwnProperty(group)) {
          if (typeof $scope.config.data.groups[$scope.config.groups[group]] === 'undefined') {
            $scope.config.data.groups[$scope.config.groups[group]] = [];
          }
          $scope.config.data.groups[$scope.config.groups[group]].push(group);
        }
      }
    };

    // Debugging function — run getConfig() in the console to get current config object
    window.getConfig = function(){
      console.dir($scope);
      window.chartConfig = $scope.config;
    };

    /**
     * Sets up callback functions broken by JSON stringify.
     * TODO replace with calls to JSONfn as per embedcodeService.
     */

    // var parent = {
    //   tinymce: {
    //     activeEditor: {
    //       windowManager: {
    //         getParams: function() {
    //           return {
    //             axisJS: "eyJkYXRhIjp7IngiOiIiLCJ5IjoiIiwieTIiOiIiLCJjb2x1bW5zIjpbWyJkYXRhMTMiLCIzMCIsIjIwMDAiLCIxMDAiLCI0MDAiLCIxNTAiLCIyNTAiXSxbImRhdGEyMiIsIjUwIiwiMjAiLCIxMCIsIjQwIiwiMTUiLCIyNSJdXSwiYXhlcyI6eyJkYXRhMTMiOiJ5IiwiZGF0YTIyIjoieSJ9LCJncm91cHMiOltdLCJ0eXBlIjoiIiwidHlwZXMiOnsiZGF0YTEzIjoiYXJlYS1zdGVwIiwiZGF0YTIyIjoiYmFyIn0sImNvbG9ycyI6eyJkYXRhMTMiOiIjNzhCOERGIiwiZGF0YTIyIjoiIzc4QjhERiJ9fSwiZ3JpZCI6eyJ4Ijp7InNob3ciOmZhbHNlfSwieSI6eyJzaG93IjpmYWxzZX19LCJheGlzIjp7IngiOnsic2hvdyI6dHJ1ZSwiYWNjdXJhY3kiOjAsInByZWZpeCI6IiIsInN1ZmZpeCI6IiIsInRpY2siOnsiZm9ybWF0IjoiZnVuY3Rpb24gKGIpe3JldHVybidzZXJpZXMnPT09JHNjb3BlLmNvbmZpZy5jaGFydEdsb2JhbFR5cGUmJidjYXRlZ29yeSchPT0kc2NvcGUuY29uZmlnLmF4aXMueC50eXBlPyRzY29wZS5jb25maWcuYXhpcy54LnByZWZpeCtiLnRvRml4ZWQoJHNjb3BlLmNvbmZpZy5heGlzLnguYWNjdXJhY3kpLnRvU3RyaW5nKCkrJHNjb3BlLmNvbmZpZy5heGlzLnguc3VmZml4OmI7fSJ9fSwieSI6eyJzaG93Ijp0cnVlLCJhY2N1cmFjeSI6MCwicHJlZml4IjoiIiwic3VmZml4IjoiIiwidGljayI6eyJmb3JtYXQiOiJmdW5jdGlvbiAoYil7cmV0dXJuJ3Nlcmllcyc9PT0kc2NvcGUuY29uZmlnLmNoYXJ0R2xvYmFsVHlwZSYmJ2NhdGVnb3J5JyE9PSRzY29wZS5jb25maWcuYXhpcy55LnR5cGU/JHNjb3BlLmNvbmZpZy5heGlzLnkucHJlZml4K2IudG9GaXhlZCgkc2NvcGUuY29uZmlnLmF4aXMueS5hY2N1cmFjeSkudG9TdHJpbmcoKSskc2NvcGUuY29uZmlnLmF4aXMueS5zdWZmaXg6Yjt9In19LCJ5MiI6eyJzaG93IjpmYWxzZSwiYWNjdXJhY3kiOjAsInByZWZpeCI6IiIsInN1ZmZpeCI6IiIsInRpY2siOnsiZm9ybWF0IjoiZnVuY3Rpb24gKGIpe3JldHVybidzZXJpZXMnPT09JHNjb3BlLmNvbmZpZy5jaGFydEdsb2JhbFR5cGUmJidjYXRlZ29yeSchPT0kc2NvcGUuY29uZmlnLmF4aXMueTIudHlwZT8kc2NvcGUuY29uZmlnLmF4aXMueTIucHJlZml4K2IudG9GaXhlZCgkc2NvcGUuY29uZmlnLmF4aXMueTIuYWNjdXJhY3kpLnRvU3RyaW5nKCkrJHNjb3BlLmNvbmZpZy5heGlzLnkyLnN1ZmZpeDpiO30ifX19LCJwb2ludCI6eyJzaG93IjpmYWxzZX0sImxlZ2VuZCI6eyJwb3NpdGlvbiI6ImJvdHRvbSIsInNob3ciOnRydWV9LCJjb2xvciI6eyJwYXR0ZXJuIjpbIiM3OEI4REYiLCIjQUZDQkNFIiwiIzIzMzkzRCIsIiM4N0FGOUMiLCIjMEVCRjAwIiwiI0VEMUIyNCIsIiM4MDgwODAiLCIjRUQxQjI0IiwiIzAyMjM5NyIsIiNGREJCMzAiLCIjNzIyODg5IiwiIzZBQjAyMyIsIiMxZjc3YjQiLCIjYWVjN2U4IiwiI2ZmN2YwZSIsIiNmZmJiNzgiLCIjMmNhMDJjIiwiIzk4ZGY4YSIsIiNkNjI3MjgiLCIjZmY5ODk2IiwiIzk0NjdiZCIsIiNjNWIwZDUiLCIjOGM1NjRiIiwiI2M0OWM5NCIsIiNlMzc3YzIiLCIjZjdiNmQyIiwiIzdmN2Y3ZiIsIiNjN2M3YzciLCIjYmNiZDIyIiwiI2RiZGI4ZCIsIiMxN2JlY2YiLCIjOWVkYWU1Il19LCJncm91cHMiOltdLCJjaGFydFRpdGxlIjoiIiwiY2hhcnRDcmVkaXQiOiIiLCJjaGFydFNvdXJjZSI6IiIsImNoYXJ0V2lkdGgiOjEwMDAsImNoYXJ0R2xvYmFsVHlwZSI6InNlcmllcyIsImNoYXJ0QWNjdXJhY3kiOjEsImNtcyI6dHJ1ZSwicGllIjp7ImxhYmVsIjp7ImZvcm1hdCI6ImZ1bmN0aW9uIChiLGMpe3JldHVybigxMDAqYykudG9GaXhlZCgkc2NvcGUuY29uZmlnLmNoYXJ0QWNjdXJhY3kpKyclJzt9In19LCJkb251dCI6eyJsYWJlbCI6eyJmb3JtYXQiOiJmdW5jdGlvbiAoYixjKXtyZXR1cm4oMTAwKmMpLnRvRml4ZWQoJHNjb3BlLmNvbmZpZy5jaGFydEFjY3VyYWN5KSsnJSc7fSJ9fSwiZ2F1Z2UiOnsibGFiZWwiOnsiZm9ybWF0IjoiZnVuY3Rpb24gKGIsYyl7cmV0dXJuKDEwMCpjKS50b0ZpeGVkKCRzY29wZS5jb25maWcuY2hhcnRBY2N1cmFjeSkrJyUnO30ifX0sImJhY2tncm91bmQiOmZhbHNlLCJiYWNrZ3JvdW5kQ29sb3IiOiJ3aGl0ZSIsImF0dGFjaG1lbnRJRCI6Njc4LCJhdHRhY2htZW50VVJMIjoiaHR0cDovL3Byb3RvdHlwZXMudGltZXNkZXYudG9vbHMvd3AtY29udGVudC91cGxvYWRzLzIwMTUvMDIvXzE0MjM4NTEyMTYucG5nIn0="
    //           };
    //         }
    //       }
    //     }
    //   }
    // }
    if (typeof parent.tinymce !== 'undefined' && typeof parent.tinymce.activeEditor.windowManager.getParams().axisJS !== 'undefined' ) {
      var fromWP = angular.fromJson(window.atob(parent.tinymce.activeEditor.windowManager.getParams().axisJS));
      $scope.config = fromWP;
      $scope.inputs.csvData = input.convert($scope.config.data.columns);
  		$scope.config.axis.x.tick.format = function (b){return'series'===$scope.config.chartGlobalType&&'category'!==$scope.config.axis.x.type?$scope.config.axis.x.prefix+b.toFixed($scope.config.axis.x.accuracy).toString()+$scope.config.axis.x.suffix:b;};
  		$scope.config.axis.y.tick.format = function (b){return'series'===$scope.config.chartGlobalType&&'category'!==$scope.config.axis.y.type?$scope.config.axis.y.prefix+b.toFixed($scope.config.axis.y.accuracy).toString()+$scope.config.axis.y.suffix:b;};
  		$scope.config.axis.y2.tick.format = function (b){return'series'===$scope.config.chartGlobalType&&'category'!==$scope.config.axis.y2.type?$scope.config.axis.y2.prefix+b.toFixed($scope.config.axis.y2.accuracy).toString()+$scope.config.axis.y2.suffix:b;};
  		$scope.config.donut.label.format = function (b,c){return(100*c).toFixed($scope.config.chartAccuracy)+'%';};
  		$scope.config.pie.label.format = function (b,c){return(100*c).toFixed($scope.config.chartAccuracy)+'%';};
  		$scope.config.gauge.label.format = function (b,c){return(100*c).toFixed($scope.config.chartAccuracy)+'%';};
      $scope.updateData();
    } else {
      /**
      * Push the initial data.
      */
      $scope.inputs.csvData = input.defaultData.csvData;
      $scope.updateData();
    }

  });
