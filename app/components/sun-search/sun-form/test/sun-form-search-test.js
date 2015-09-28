'use strict';

describe("sunSearch.sunForm component", function() {
  var scope, sunFormCtrl, sunService, controller, q, deferred;

  //Mock sunService
  beforeEach(function() {
    sunService = {
      doSearch: function() {
        deferred = q.defer();
        //Return promise
        return deferred.promise;
      }
    };
  });

  beforeEach(module('sunSearch.sunForm'));
  beforeEach(inject(function($rootScope, $controller, $q) {
    scope = $rootScope.$new();
    q = $q;
    //Create controller passing mocked service
    sunFormCtrl = $controller('sunFormCtrl', {
      $scope: scope,
      sunService: sunService
    });    
  }));

  it("should have controller defined", function() {
    expect(sunFormCtrl).toBeDefined();
  });

  it("should have scope vars initialized", function() {
    expect(scope.exceptions).toBeDefined();
    expect(scope.config).toBeDefined();
  });

  it("should return search success", function() {
    var promise = scope.doSearch({
      address:'white house',
      startDay:moment(),
      endDay:moment()
    }).then(function(success){      
      expect(success).toEqual('NEVER GETS HERE BUT SHOULD');
    }, function(errorStr) {     
      //Never gets here
    });

    expect(promise.then).toBeDefined()
    //Resolve promise return success
    deferred.resolve(true);
  });

  it("should return searchError exception", function() {
    var promise = scope.doSearch({
      address:'foobar',
      startDay:moment(),
      endDay:moment()
    }).then(function(success){      
      //Never gets here
    }, function(errorStr) {     
      expect(errorStr).toEqual('NEVER GETS HERE BUT SHOULD');
    });

    expect(promise.then).toBeDefined()
    //Reject promise triggering error handler
    deferred.reject('searchError');
  });

});