'use strict';

angular.module('myApp.search', [])

.controller('SearchCtrl', ['$scope', 'SearchService', function($scope, SearchService) {
  //Search params
  $scope.params = {
    address: "400 SW 6th Ave, Portland, OR",
    startDate: new Date(Date.now()-86400000*7), //7 days ago
    endDate: new Date() //Today
  };
  //Search results
  $scope.results = undefined;
  //Search exceptions
  $scope.exceptions = {};
  //Search form config
  $scope.config = {
    dateOptions: {
      formatYear: 'yy',
      startingDay: 1
    }
  };

  //Custom date range validator
  $scope.$watch('params.startDate', validateDates);
  $scope.$watch('params.endDate', validateDates);
  function validateDates() {
    //Invalid if start date before end date
    $scope.searchform.$setValidity("endBeforeStart", $scope.params.endDate > $scope.params.startDate);
  }

  /*
   * doSearch - starts search process using service and reports any errors
   * Service communicates results to controllers
   */
  $scope.doSearch = function(params) {    
    //Reset exceptions
    $scope.exceptions = {};

    SearchService.doSearch(params.address, params.startDate, params.endDate).then(function(success){      
      if (!success) {
        $scope.exceptions['searchError'] = true;
      }
    }, function(errorStr) {
      //Catch expections
      $scope.exceptions[errorStr] = true;
    })
  }
}])

/*
 * SearchService - manage address geocode and sun event searches
 */
.service('SearchService', ['$http', '$q', function($http, $q) {

  /*
   * doSearch - Conducts sun search for given address and date range,
   * storing the list of results for controllers to access
   */
  this.doSearch = function(address, startDate, endDate) {
    //Handlers
    function handleLocation(location) {      
      return this.getSunDays(location, startDate, endDate);
    }
    function handleSunDays(sunDays) {      
      return true;
    }
    function handleError(errorStr) {
      return $q.reject(errorStr);
    }

    //Conduct geolocation then sun search using promise chain
    return this.getLocation(address)
    .then(handleLocation.bind(this))
    .then(handleSunDays, handleError);
  },

  /*
   * getLocation - given an address string returns a location object {lat: number, lng: number}
   */
  this.getLocation = function(address) {
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
          return response.data.results[0].geometry.location;
        } else if (response.data.status == 'ZERO_RESULTS') {
          return $q.reject('geocodeZero');
        } else {
          return $q.reject('geocodeError');
        }
      }, function (error) {
        //Reject promise
        return $q.reject(error);
      }
    );
  },

  /*
   * getSunDays - returns a list of sun events for given location, one for each day from start to end
   * location - {lat: number, lng: number}
   * start date (Date)
   * end date (Date)
   */
  this.getSunDays = function(location, startDate, endDate) {
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

    //Reduce list to one promise that resolves when all are complete with list of results in the order called
    $q.all(datePromises).then(function (sunDays) {
      console.log(sunDays);
      /*if (response.data.status != 'OK') {
        return $q.reject('searchError');        
      }
      return response.data;
      */
      return true;
    }, function (error) {
      //Reject promise
      return $q.reject(error);
    });
  }
}]);

