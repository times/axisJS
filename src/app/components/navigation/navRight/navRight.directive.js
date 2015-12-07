/**
 * @ngdoc directive
 * @name axis.directive:navRight
 * @description
 * Left off-hand navigation menu
 */

(function(){
  'use strict';

  angular.module('axis')
    .directive('navRight', navRight);

  /** @ngInject */
  function navRight() {
    return {
      templateUrl: 'app/components/navigation/main.right.menu.html'
    };
  }
})();
