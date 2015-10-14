describe('Service: embedcodeOutput', function() {
  'use strict';

  // load the service's module
  beforeEach(module('axis'));

  // instantiate service
  var embedcodeOutput,
      scope,
      MainCtrl,
      EmbedCtrl,
      embed,
      output;

  beforeEach(inject(function(_embedcodeOutput_, $controller, $rootScope, $httpBackend) {
    embedcodeOutput = _embedcodeOutput_;
    scope = $rootScope.$new();
    $httpBackend.expectGET('default.config.yaml');
    $httpBackend.whenGET('default.config.yaml').respond('');
    $httpBackend.expectGET('config.yaml');
    $httpBackend.whenGET('config.yaml').respond('');
    $httpBackend.expectGET('partials/configChooser.html'); // due to angular-off-canvas.
    $httpBackend.whenGET('partials/configChooser.html').respond('');
    $httpBackend.expectGET('partials/outputModal.html'); // due to angular-off-canvas.
    $httpBackend.whenGET('partials/outputModal.html').respond('');

    MainCtrl = $controller('MainController as main', {
      $scope: scope,
      appConfig: {
        renderer: 'c3',
        input: 'csv',
        export: ['embedcode'],
        colors: [
          {value: 'blue'},
          {value: 'red'}
        ],
        defaults: {}
      }
    });
  }));

  it('should properly identify itself', function(){
    expect(embedcodeOutput.name).toBe('embedcodeOutputService');
  });

  it('should return the chart config and dependencies on preprocess()', function(){
    output = embedcodeOutput.preprocess(scope);
    expect(output.config).toBeDefined();
    expect(output.dependencies).toBeDefined();
  });

  it('should return an output object on process()', function(){
    var preprocessed = embedcodeOutput.preprocess(scope);
    output = embedcodeOutput.process(preprocessed);

    expect(output.complete).toBeDefined();
    expect(output.partial).toBeDefined();
    expect(typeof output.complete).toBe('string');
    expect(typeof output.partial).toBe('string');
  });

  describe('embedcodeOutput.complete() method', function(){
    var pre, proc;
    beforeEach(inject(function($controller){
      pre = embedcodeOutput.preprocess(scope);
      proc = embedcodeOutput.process(pre);
      EmbedCtrl = $controller('EmbedcodeOutputController as EmbedCtrl', {
        'output': proc,
        '$scope': scope
      });

      embed = scope.EmbedCtrl;
    }));

    it('should default to including dependencies', function(){
      expect(embed.includeDeps).toBeTruthy();
    });

    it('should output complete JS + deps if includeDeps is true', function(){
      expect(embed.output).toMatch(/d3\.min\.js/);
      expect(embed.output).toMatch(/var configJSON/);
    });

    it('should output JS and no deps if includeDeps is false', function(){
      embed.includeDeps = false;
      embed.updateOutput();

      expect(embed.output).not.toMatch(/d3\.min\.js/);
      expect(embed.output).toMatch(/var configJSON/);
    });
  });
});
