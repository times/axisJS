describe('Service: wordpressOutput', function () {
  'use strict';

  // load the directive's module
  beforeEach(module('axis'));

  var MainCtrl,
  foo = '',
  element,
  scope,
  body,
  c3;

  // Initialize the controller and a mock MainCtrl scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend, $window) {
    c3 = $window.c3;
    body = angular.element('body');
    body.empty(); // clean up previous tests
    body.append(angular.element('<a href="#" class="savePNG">png</a>'));
    body.append(angular.element('<a href="#" class="saveSVG">svg</a>'));
    body.append(angular.element('<canvas id="canvas"></canvas>'));
    body.append(angular.element('<div id="chart"></div>'));

    c3.generate({data: {columns: [['data1', 1, 2, 3], ['data2', 4, 5, 6]]}});

    $httpBackend.expectGET('assets/i18n/en_GB.json');
    $httpBackend.whenGET('assets/i18n/en_GB.json').respond('{}');
    $httpBackend.expectGET('default.config.yaml');
    $httpBackend.whenGET('default.config.yaml').respond({});
    $httpBackend.expectGET('config.yaml');
    $httpBackend.whenGET('config.yaml').respond({});

    scope = $rootScope.$new();
    MainCtrl = $controller('MainController as main', {
      $scope: scope,
      appConfig: {
        renderer: 'c3',
        input: 'csv',
        save: [
          'png',
          'svg'
        ],
        export: [
          'Embed code'
        ],
        colors: [
          {value: 'blue'},
          {value: 'red'}
        ],
        defaults: {},
      }
    });

    var configObjectString = 'eyJkYXRhIjp7IngiOiIiLCJ5IjoiIiwieTIiOiIiLCJjb2x1bW5zIjpbWyJkYXRhMSIsIjMwIiwiMjAwIiwiMTAwIiwiNDAwIiwiMTUwIiwiMjUwIl0sWyJkYXRhMiIsIjUwIiwiMjAiLCIxMCIsIjQwIiwiMTUiLCIyNSJdXSwiYXhlcyI6e30sImdyb3VwcyI6e30sInR5cGUiOiIiLCJ0eXBlcyI6eyJkYXRhMSI6ImxpbmUiLCJkYXRhMiI6ImxpbmUifSwiY29sb3JzIjp7ImRhdGExIjoiIzc4QjhERiIsImRhdGEyIjoiI0FGQ0JDRSJ9fSwiYXhpcyI6eyJ4Ijp7InNob3ciOnRydWUsImFjY3VyYWN5IjowLCJwcmVmaXgiOiIiLCJzdWZmaXgiOiIiLCJ0aWNrIjp7fX0sInkiOnsic2hvdyI6dHJ1ZSwiYWNjdXJhY3kiOjAsInByZWZpeCI6IiIsInN1ZmZpeCI6IiIsInRpY2siOnt9fSwieTIiOnsic2hvdyI6ZmFsc2UsImFjY3VyYWN5IjowLCJwcmVmaXgiOiIiLCJzdWZmaXgiOiIiLCJ0aWNrIjp7fX19LCJwb2ludCI6eyJzaG93IjpmYWxzZX0sImdyb3VwcyI6e30sImRlZmF1bHRDb2xvcnMiOlsiIzFmNzdiNCIsIiNhZWM3ZTgiLCIjZmY3ZjBlIiwiI2ZmYmI3OCIsIiMyY2EwMmMiLCIjOThkZjhhIiwiI2Q2MjcyOCIsIiNmZjk4OTYiLCIjOTQ2N2JkIiwiI2M1YjBkNSIsIiM4YzU2NGIiLCIjYzQ5Yzk0IiwiI2UzNzdjMiIsIiNmN2I2ZDIiLCIjN2Y3ZjdmIiwiI2M3YzdjNyIsIiNiY2JkMjIiLCIjZGJkYjhkIiwiIzE3YmVjZiIsIiM5ZWRhZTUiXSwiY2hhcnRUaXRsZSI6InRlc3RpbmciLCJjaGFydENyZWRpdCI6IiIsImNoYXJ0U291cmNlIjoiIiwiY2hhcnRXaWR0aCI6MTAwMCwiY2hhcnRHbG9iYWxUeXBlIjoic2VyaWVzIiwiY2hhcnRBY2N1cmFjeSI6MSwiY21zIjpmYWxzZSwicGllIjp7ImxhYmVsIjp7fX0sImRvbnV0Ijp7ImxhYmVsIjp7fX0sImdhdWdlIjp7ImxhYmVsIjp7fX19';

    parent.ajaxurl = '/test-wordpress';

    parent.tinymce = {
      activeEditor: {
        insertContent: function(val) {
          foo = val;
        },
        windowManager: {
          getParams: function() {
            return {
              axisJS: configObjectString,
              axisWP: {
                parentID: 55
              }
            };
          },
          close: function() {
            return true;
          }
        }
      }
    };

    spyOn(parent.tinymce.activeEditor, 'insertContent').and.callThrough();
    spyOn(parent.tinymce.activeEditor.windowManager, 'close');

  }));

  it('should export data back to WordPress if the "Copy to CMS" button is clicked', inject(function ($compile, $httpBackend){
    // Arrange
    element = angular.element('<a href="#" export-chart="wordpress" id="a-button">');
    element = $compile(element)(scope);
    scope.$apply();

    element.trigger('click');
    $httpBackend.whenPOST('/test-wordpress').respond({attachmentURL: '#'});
    $httpBackend.flush();

    expect(parent.tinymce.activeEditor.insertContent).toHaveBeenCalled();
    expect(parent.tinymce.activeEditor.windowManager.close).toHaveBeenCalled();
    expect(foo.length).toBeGreaterThan(1);
  }));
});
