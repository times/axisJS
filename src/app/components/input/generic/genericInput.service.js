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
