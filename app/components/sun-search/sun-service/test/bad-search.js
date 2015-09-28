'use strict';

describe('sunSearch.sunService module', function() {

  describe('bad sun search service request', function(){
    var sunService, $httpBackend, geocodeZero;

    beforeEach(module('sunSearch.sunService', 'sunSearch.sunService.testData'));

    beforeEach(inject(function(_sunService_, _$httpBackend_, _geocodeZero_) {
      sunService = _sunService_;
      geocodeZero = _geocodeZero_;
      $httpBackend = _$httpBackend_;
          
    }));

    it('should return geocodeZero exception for missing address', function() {
      $httpBackend.expectGET(new RegExp('https://maps.googleapis.com/maps/api/geocode/json*')).
        respond(geocodeZero);
      sunService.doSearch(
        '', 
        moment(), //start 
        moment().add(1, 'days') //end
      ).then(function(success){      
        //should not get here
      }, function(exceptionStr) {
        expect(exceptionStr).toEqual('geocodeZero');
      });
      $httpBackend.flush();
    });

    it('should return geocodeZero exception for address "foobar"', function() {
      $httpBackend.expectGET(new RegExp('https://maps.googleapis.com/maps/api/geocode/json*')).
        respond(geocodeZero);
      sunService.doSearch(
        'foobar', 
        moment(), //start 
        moment().add(1, 'days') //end
      ).then(function(success){      
        //should not get here
      }, function(exceptionStr) {
        expect(exceptionStr).toEqual('geocodeZero');
      });
      $httpBackend.flush();
    });

  });
});