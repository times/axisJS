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
})();
