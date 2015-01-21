'use strict';

describe('Directive: exportChart', function () {

  // load the directive's module
  beforeEach(module('axisJSApp'));

  var MainCtrl,
      element,
      scope,
      body;

  // Initialize the controller and a mock MainCtrl scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    body = angular.element('body');
    body.empty(); // clean up previous tests

    body.append(angular.element('<a href="#" class="savePNG">png</a>'));
    body.append(angular.element('<a href="#" class="saveSVG">svg</a>'));
    body.append(angular.element('<canvas id="canvas"></canvas>'));
    body.append(angular.element('<div id="chart"></div>'));
    c3.generate({data: {columns: [['data1', 1, 2, 3], ['data2', 4, 5, 6]]}});

    $httpBackend.expectGET('default.config.yaml');
    $httpBackend.whenGET('default.config.yaml').respond('');
    $httpBackend.expectGET('config.yaml');
    $httpBackend.whenGET('config.yaml').respond('');
    $httpBackend.expectGET('partials/configChooser.html');
    $httpBackend.whenGET('partials/configChooser.html').respond('');

    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope,
      appConfig: {
        framework: 'c3',
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

  }));

  it('should create chart images if the "save" button is clicked', inject(function ($compile) {
    // Arrange
    element = angular.element('<a href="#" export-chart="save" id="a-button">');
    element = $compile(element)(scope);
    scope.$apply();

    // Act
    element.trigger('click');

    // Assert
    expect(angular.element('canvas').length).toBe(1);
  }));

  it('should save a PNG if the "Save to PNG" button is clicked', inject(function ($compile) {
    // Arrange
    element = angular.element('<a href="#" export-chart="save" id="a-button">');
    element = $compile(element)(scope);
    scope.$apply();

    // Act
    element.trigger('click');

    // Assert
    expect(angular.element('.savePNG').attr('href')).toMatch(/base64/);
  }));

  it('should save a SVG if the "Save to SVG" button is clicked', inject(function ($compile) {
    // Arrange
    element = angular.element('<a href="#" export-chart="save" id="a-button">');
    element = $compile(element)(scope);
    scope.$apply();

    // Act
    element.trigger('click');

    // Assert
    expect(angular.element('.saveSVG').attr('href')).toMatch(/\?xml/);
  }));

  describe('a spec with tests intended to prevent regression on closed issues', function() {
    it('should not add cruft that prevents Illustrator from opening (#31)', inject(function ($compile) {
      // Arrange
      element = angular.element('<a href="#" export-chart="save" id="a-button">');
      element = $compile(element)(scope);
      scope.$apply();

      // Act
      element.trigger('click');
      var svg = angular.element('.saveSVG').attr('href');

      // Assert
      expect(svg).toMatch(/\?xml/);
      expect(svg).not.toMatch(/\sfont-.*?: .*?;/gi);
      expect(svg).not.toMatch(/\sclip-.*?="url\(http:\/\/.*?\)"/gi); // This one is particularly important.
      expect(svg).not.toMatch(/\stransform="scale\(2\)"/gi);
    }));
  });
});
