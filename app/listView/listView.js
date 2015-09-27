'use strict';

angular.module('myApp.listView', ['ngRoute','myApp.search'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/list', {
    templateUrl: 'listView/listView.html',
    controller: 'listViewCtrl'
  });
}])

.controller('listViewCtrl', ['$scope', 'SearchService', function($scope, SearchService) {
  //Watch search service
  $scope.search = SearchService;
}]);