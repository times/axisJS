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
  function configChooser($aside) {
    return function() {
      $aside.open({
        placement: 'right',
        backdrop: true,
        controller: /*@ngInject*/ function ($scope, localStorageService, $window, configProvider, $modalInstance) {
          this.name = 'Choose Configuration';
          $scope.themes = [];
          
          configProvider.then(function(res){
            $scope.themes = res.themes;
          });
          
          $scope.cancel = function(e){
            $modalInstance.dismiss();
            e.stopPropagation();
          };
          
          $scope.setConfig = function(config) {
            localStorageService.set('config', config);
            $window.location.reload();
          };
        },
        templateUrl: 'app/components/config/configChooser/configChooser.html' 
      });
    };
  }
})();