'use strict';

angular.module('myApp.view1', ['ngRoute','myApp.search'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', 'SearchService', function($scope, SearchService) {
  //Watch search service
  $scope.search = SearchService;
}]);