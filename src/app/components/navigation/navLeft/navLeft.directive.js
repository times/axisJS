/**
 * @ngdoc directive
 * @name axis.directive:navLeft
 * @description
 * Left off-hand navigation menu
 */

(function(){
  'use strict';

  angular.module('axis')
    .directive('navLeft', navLeft);

  /** @ngInject */
  function navLeft() {
    return {
      templateUrl: 'app/components/navigation/main.left.menu.html'
    };
  }
})();
