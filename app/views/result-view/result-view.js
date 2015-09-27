'use strict';

angular.module('myApp.resultView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/list', {
    templateUrl: 'views/result-view/result-view.html'
  });
}]);