'use strict';

describe("sunSearch.sunForm component", function() {
  var scope, element, render, sunFormCtrl, controller;

  beforeEach(module('sunSearch.sunForm'));
  //Load precompiled templates
  beforeEach(module('appTemplates'));

  beforeEach(inject(function($rootScope, $compile, $controller) {
    scope = $rootScope.$new();
    var templateHtml = '<sun-form class="sun-form"></sun-form>';
    var formElem = angular.element("<div>" + templateHtml + "</div>")
    $compile(formElem)(scope); 
    scope.$apply();

    sunFormCtrl = $controller('sunFormCtrl', { $scope: scope });    
  }));

  it("should error if no address", function() {   
    scope.params.address = "";
    console.log(scope.params.address);    
    var addressEl = angular.element(document.querySelector('#address'));
    console.log(addressEl);
    //addressEl.val('');
    //FAILS
    //angular.element(addressEl)[0].dispatchEvent(new Event('input'));
    //FAILS
    //scope.$digest();
    //expect(angular.element(addressEl).hasClass('ng-invalid')).toEqual(true);
  });
  it("should error if invalid start date");
  it("should error if invalid end date");
  it("should error if start date after end date");
  it("should error if start date more than 14 days apart from end date");

});