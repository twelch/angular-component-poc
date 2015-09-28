'use strict';

describe('sunSearch.sunService module', function() {

  describe('good sun search service request', function(){
    var sunService, $httpBackend;

    beforeEach(module('sunSearch.sunService', 'sunSearch.sunService.testData'));

    beforeEach(inject(function(_sunService_, _$httpBackend_, geocodeSuccess, timezoneSuccess, sunSuccess) {
      sunService = _sunService_;

      $httpBackend = _$httpBackend_;

      $httpBackend.expectGET(new RegExp('https://maps.googleapis.com/maps/api/geocode/json*')).
          respond(geocodeSuccess);
      $httpBackend.expectGET(new RegExp('https://maps.googleapis.com/maps/api/timezone/json*')).
          respond(timezoneSuccess);          
      $httpBackend.expectJSONP(new RegExp('http://api.sunrise-sunset.org/json*')).
          respond(sunSuccess);
      $httpBackend.expectJSONP(new RegExp('http://api.sunrise-sunset.org/json*')).
          respond(sunSuccess);          
    }));

    it('should have access to service', function() {
      expect(sunService).toBeDefined();
    });

    it('should return true and have 2 days results on successful search', function() {
      sunService.doSearch(
        'white house', 
        moment(), //start 
        moment().add(1, 'days') //end
      ).then(function(success){      
        expect(success).toEqual(true);
        expect(sunService.sunDays.length == 2);
      });
      $httpBackend.flush();
    });

  });
});