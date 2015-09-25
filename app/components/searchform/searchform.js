'use strict';

angular.module('myApp.searchform', [])

/*
 * SunService - manage sun event searches
 */
.service('SearchService', ['$http', '$q', function($http, $q) {

  //Given address, returns promise of lat/lon
  this.getLocation = function(address) {
    var geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?';
    var key = "AIzaSyAobzxF8_W8lPcC5MxOMUhMvelegBW70Ps";

    return $http({
      url: geocodeUrl,
      method: "GET",
      params: {key: key,address: address}
     }).then(
      function (response) {
        if (response.data.status == 'OK') {
          return response.data.results[0].geometry.location;
        } else if (response.data.status == 'ZERO_RESULTS') {
          return $q.reject('0 results');
        } else {
          return $q.reject('Geocode error');
        }
      }, function (error) {
        //Exception handler
        return $q.reject(error);
      }
    );
  }
}])

.controller('SearchCtrl', ['$scope', 'SearchService', function($scope, SearchService) {
  //Search model with defaults
  $scope.search = {
    address: "400 SW 6th Ave, Portland, OR",
    startDate: new Date(Date.now()-86400000*7), //7 days ago
    endDate: new Date()
  };

  //Search constants
  $scope.minDate = new Date(Date.now()-86400000*365); //1 year ago
  $scope.maxDate = new Date(Date.now()+86400000*365); //1 year from now
  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.doSearch = function(searchParams) {    
    SearchService.getLocation(searchParams.address).then(function(location){
      console.log(location);
    }, function(error) {
      throw error
    });
  }
}]);

