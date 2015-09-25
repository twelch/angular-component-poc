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
          return $q.reject('geocodeZero');
        } else {
          return $q.reject('geocodeError');
        }
      }, function (error) {
        //Exception handler
        return $q.reject(error);
      }
    );
  }
}])

.controller('SearchCtrl', ['$scope', 'SearchService', function($scope, SearchService) {
  //Search params model
  $scope.params = {
    address: "400 SW 6th Ave, Portland, OR",
    startDate: new Date(Date.now()-86400000*7), //7 days ago
    endDate: new Date()
  };

  //Search results model
  $scope.results = {
    location: undefined,
    days: {}
  };
  $scope.errors = {};

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

  $scope.doSearch = function(params) {    
    //Reset error messages
    $scope.location = undefined;
    $scope.errors = {};

    //Handle geolocation
    SearchService.getLocation(params.address).then(function(location){
      $scope.location = location;
    }, function(errorStr) {
      $scope.errors[errorStr] = true;
    });
  }
}]);

