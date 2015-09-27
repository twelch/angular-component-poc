'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.resultView',
  'sunSearch.sunService',
  'sunSearch.sunForm',
  'sunSearch.sunTable'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/list'});
}]);
