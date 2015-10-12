describe('Directive: exportChart', function () {
  'use strict';

  // load the directive's module
  beforeEach(module('axis'));

  var MainController,
      element,
      scope,
      body,
      c3;

  // Initialize the controller and a mock MainController scope
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
    $httpBackend.whenGET('default.config.yaml').respond('');
    $httpBackend.expectGET('config.yaml');
    $httpBackend.whenGET('config.yaml').respond('');
    $httpBackend.expectGET('partials/configChooser.html');
    $httpBackend.whenGET('partials/configChooser.html').respond('');

    scope = $rootScope.$new();
    MainController = $controller('MainController as main', {
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

  it('should set image dimensions if specified');
  it('should have a test for whatever the heck it is doing on ln 70');
  it('should create a chart style object from C3 css');
  it('should change elements with 0 opacity or visibility: hidden to display: none');
  it('should inline all CSS rules');
  it('should change .c3-line path fill CSS to an attribute');
  it('should create a style object');


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
