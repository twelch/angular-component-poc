'use strict';

angular.module('myApp.search', [])

.controller('SearchCtrl', ['$scope', 'SearchService', function($scope, SearchService) {
  //Search params
  $scope.params = {
    address: "400 SW 6th Ave, Portland, OR",
    startDate: new Date(Date.now()-86400000*7), //7 days ago
    endDate: new Date() //Today
  };
  
  //Search exceptions
  $scope.exceptions = {};
  
  //Search form config
  $scope.config = {
    dateOptions: {
      formatYear: 'yy',
      startingDay: 1
    }
  };

  //Watch search service
  $scope.search = SearchService;

  //Watch date fields and validate on change
  $scope.$watch('params.startDate', validateDates);
  $scope.$watch('params.endDate', validateDates);
  
  /*
   * validateDates - Checks if start and end date meet requirements and sets form validity accordingly
   */
  function validateDates() {
    //Invalid if start date before end date
    $scope.searchform.$setValidity("endBeforeStart", $scope.params.endDate > $scope.params.startDate);
  }

  /*
   * doSearch - kicks off search process with current params and reports any errors
   */
  $scope.doSearch = function(params) {    
    $scope.exceptions = {}; //Reset exceptions

    SearchService.doSearch(params.address, params.startDate, params.endDate).then(function(success){      
      if (!success) {
        $scope.exceptions['searchError'] = true;
      }
    }, function(errorStr) {      
      $scope.exceptions[errorStr] = true; //Catch exceptions
    })
  }
}])

/*
 * SearchService - manage sun event searches
 */
.service('SearchService', ['$http', '$q', function($http, $q) {

  var sunDays = ['foo'];

  var getDays = function() {
    return sunDays;
  }
  var addDay = function(newDay) {
    sunDays.push(newDay);
  };
  var clearDays = function() {
    sunDays = []
  };

  /*
   * doSearch - Conducts sun search for given address and date range,
   * storing the list of results for controllers to access
   */
  function doSearch (address, startDate, endDate) {
    clearDays();

    //Conduct geolocation then sun search in order using promise chain
    return getLocation(address)
    .then(handleLocation)
    .then(handleSunDays, handleError);

    /*
     * getLocation - given an address string returns a location object {lat: number, lng: number}
     */
    function getLocation(address) {
      var geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?';
      var key = "AIzaSyAobzxF8_W8lPcC5MxOMUhMvelegBW70Ps";

      //Return promise
      return $http({
        url: geocodeUrl,
        method: "GET",
        params: {
          key: key, 
          address: address
        }
       }).then(
        function (response) {
          //Handle response
          if (response.data.status == 'OK') {
            //Resolve promise
            return response.data.results[0].geometry.location;
          } else if (response.data.status == 'ZERO_RESULTS') {
            //Reject promise
            return $q.reject('geocodeZero');
          } else {
            //Reject promise
            return $q.reject('geocodeError');
          }
        }, function (error) {
          //Reject promise
          return $q.reject(error);
        }
      );
    }
    
    /*
     * handleLocation - given a location, starts a sun service search
     */
    function handleLocation(location) {      
      //Resolve promise
      return getSunDays(location, startDate, endDate);
    }

    /*
     * getSunDays - returns a list of sun events for given location, one for each day from start to end
     * location - {lat: number, lng: number}
     * start date (Date)
     * end date (Date)
     */
    function getSunDays(location, startDate, endDate) {
      var sunUrl = "http://api.sunrise-sunset.org/json?";
      var dates = ['2015-09-25','2015-09-26','2015-09-27','2015-09-28']
      
      //Fire off requests, building list of promises
      var datePromises = [];
      for (var key in dates) {
        datePromises.push(
          $http({
            url: sunUrl,
            method: "jsonp",
            params: {
              lat: location.lat,
              lng: location.lng,
              date: '2015-09-25',
              callback: 'JSON_CALLBACK'
            }
           }).then()
        );
      }

      //Reduce to one promise
      return $q.all(datePromises).then(function (results) {
        //Resolve promise with list of results in order
        return results;        
      }, function (error) {
        //Reject promise
        return $q.reject(error);
      });
    }
    
    /*
     * handleSunDays - check and store list of sun objects
     */
    function handleSunDays(results) {      
      var numErrors = 0;      
      for (var i in results) {
        var result = results[i];
        if (result.data.status == 'OK') {
          addDay(result.data.results);
        } else {
          numErrors += 1;
        }
      }

      if (numErrors > 1) {
        return 'incompleteResults';
      } else {
        console.log(sunDays);
        return true;
      }
    }
    
    /* 
     * handleError - end of the line exception handler for the promise chain
     */
    function handleError(errorStr) {
      return $q.reject(errorStr);
    }
  }

  //Publish public methods
  return {
    doSearch: doSearch,
    getDays: getDays,
    sunDays: sunDays
  };

}]);

