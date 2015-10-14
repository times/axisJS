/**
 * Spec for configChooserService
 */

// There is like literally nothing to test with this.
describe('Service: configChooser', function () {
  'use strict';
  
  // load the service's module
  beforeEach(module('axis'));

  // instantiate service
  var configChooser,
      ConfChooseCtrl,
      scope,
      localStorageService,
      $modalInstance,
      $window;

  beforeEach(inject(function (_configChooser_, $controller, $rootScope, _$window_) {
    scope = $rootScope.$new();
    configChooser = _configChooser_;

    // Mocks
    $modalInstance = {
      dismiss: jasmine.createSpy('dismiss')
    };

    localStorageService = {
      set: jasmine.createSpy('set')
    };

    $window = _$window_;
    $window.location.reload = jasmine.createSpy('reload');

    // Controllers
    ConfChooseCtrl = $controller('ConfigChooserController', {
      $scope: scope,
      localStorageService: localStorageService,
      $modalInstance: $modalInstance,
      $window: $window,
      conf: {
        renderer: 'c3',
        input: ['csv', 'spreadsheet'],
        colors: [
          {value: 'blue'},
          {value: 'red'}
        ],
        themes: [
          {
            name: 'test1',
            file: 'test1.yaml'
          },
          {
            name: 'test2',
            file: 'test2.yaml'
          },
        ],
        defaults: {}
      }
    });
  }));

  it('should have a list of themes', function(){
    expect(ConfChooseCtrl.themes.length).toBe(2);
  });

  it('should dismiss the aside on cancel', function(){
    var e = {stopPropagation: jasmine.createSpy('stopPropagation')};
    ConfChooseCtrl.cancel(e);

    expect($modalInstance.dismiss).toHaveBeenCalled();
    expect(e.stopPropagation).toHaveBeenCalled();
  });

  it('should save the config to localStorage on selection', function(){
    ConfChooseCtrl.setConfig('test1.yaml');

    expect(localStorageService.set).toHaveBeenCalled();
  });
});
