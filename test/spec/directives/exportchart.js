'use strict';

describe('Directive: exportChart', function () {

  // load the directive's module
  beforeEach(module('axisJSApp'));

  var MainCtrl,
      element,
      foo = null,
      scope;

  // Initialize the controller and a mock MainCtrl scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });

    var configObjectString = 'eyJkYXRhIjp7IngiOiIiLCJ5IjoiIiwieTIiOiIiLCJjb2x1bW5zIjpbWyJkYXRhMSIsIjMwIiwiMjAwIiwiMTAwIiwiNDAwIiwiMTUwIiwiMjUwIl0sWyJkYXRhMiIsIjUwIiwiMjAiLCIxMCIsIjQwIiwiMTUiLCIyNSJdXSwiYXhlcyI6e30sImdyb3VwcyI6e30sInR5cGUiOiIiLCJ0eXBlcyI6eyJkYXRhMSI6ImxpbmUiLCJkYXRhMiI6ImxpbmUifSwiY29sb3JzIjp7ImRhdGExIjoiIzc4QjhERiIsImRhdGEyIjoiI0FGQ0JDRSJ9fSwiYXhpcyI6eyJ4Ijp7InNob3ciOnRydWUsImFjY3VyYWN5IjowLCJwcmVmaXgiOiIiLCJzdWZmaXgiOiIiLCJ0aWNrIjp7fX0sInkiOnsic2hvdyI6dHJ1ZSwiYWNjdXJhY3kiOjAsInByZWZpeCI6IiIsInN1ZmZpeCI6IiIsInRpY2siOnt9fSwieTIiOnsic2hvdyI6ZmFsc2UsImFjY3VyYWN5IjowLCJwcmVmaXgiOiIiLCJzdWZmaXgiOiIiLCJ0aWNrIjp7fX19LCJwb2ludCI6eyJzaG93IjpmYWxzZX0sImdyb3VwcyI6e30sImRlZmF1bHRDb2xvcnMiOlsiIzFmNzdiNCIsIiNhZWM3ZTgiLCIjZmY3ZjBlIiwiI2ZmYmI3OCIsIiMyY2EwMmMiLCIjOThkZjhhIiwiI2Q2MjcyOCIsIiNmZjk4OTYiLCIjOTQ2N2JkIiwiI2M1YjBkNSIsIiM4YzU2NGIiLCIjYzQ5Yzk0IiwiI2UzNzdjMiIsIiNmN2I2ZDIiLCIjN2Y3ZjdmIiwiI2M3YzdjNyIsIiNiY2JkMjIiLCIjZGJkYjhkIiwiIzE3YmVjZiIsIiM5ZWRhZTUiXSwiY2hhcnRUaXRsZSI6InRlc3RpbmciLCJjaGFydENyZWRpdCI6IiIsImNoYXJ0U291cmNlIjoiIiwiY2hhcnRXaWR0aCI6MTAwMCwiY2hhcnRHbG9iYWxUeXBlIjoic2VyaWVzIiwiY2hhcnRBY2N1cmFjeSI6MSwiY21zIjpmYWxzZSwicGllIjp7ImxhYmVsIjp7fX0sImRvbnV0Ijp7ImxhYmVsIjp7fX0sImdhdWdlIjp7ImxhYmVsIjp7fX19';

    parent.tinymce = {
      activeEditor: {
        insertContent: function(val) {
          foo = val;
        },
        windowManager: {
          getParams: function() {
            return {
              axisJS: configObjectString
            };
          }
        }
      }
    };

    spyOn(parent.tinymce.activeEditor, 'insertContent');

  }));

  it('should create chart images if the "save" button is clicked', inject(function ($compile) {
    // Arrange
    element = angular.element('<a href="#" export-chart id="a-button">');
    element = $compile(element)(scope);
    scope.$apply();

    // Act
    angular.element(element).trigger('click');

    // Assert
    setTimeout(function(){
      expect(angular.element('canvas').length).toBe(1);
    }, 500);
  }));

  it('should save a PNG if the "Save to PNG" button is clicked', inject(function ($compile) {
    // Arrange
    element = angular.element('<a href="#" export-chart id="a-button">');
    element = $compile(element)(scope);
    scope.$apply();

    // Act
    angular.element(element).trigger('click');

    // Assert
    setTimeout(function(){
      expect(angular.element('.savePNG').attr('src').length).toMatch(/base64/);
    }, 500);
  }));

  it('should save a SVG if the "Save to PNG" button is clicked', inject(function ($compile) {
    // Arrange
    element = angular.element('<a href="#" export-chart id="a-button">');
    element = $compile(element)(scope);
    scope.$apply();

    // Act
    angular.element(element).trigger('click');

    // Assert
    setTimeout(function(){
      expect(angular.element('.saveSVG').attr('src').length).toMatch(/\?xml/);
    }, 500);
  }));

  it('should display the "Copy to CMS" button', function(){
    // Assert
    setTimeout(function(){
      expect(angular.element('.saveCMS').length).toBe(1);
    }, 500);
  });

  it('should export data back to WordPress if the "Copy to CMS" button is clicked', inject(function ($compile){
    // Arrange
    element = angular.element('<a href="#" export-chart id="a-button">');
    element = $compile(element)(scope);
    scope.$apply();

    // Act
    angular.element(element).trigger('click');

    // Assert
    setTimeout(function(){
      expect(parent.tinymce.activeEditor.insertContent).toHaveBeenCalled();
      expect(foo.length).toBeGreaterThan(1);
    }, 1000);
  }));
});
