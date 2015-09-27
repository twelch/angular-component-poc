'use strict';

//Create new module
angular.module('sunSearch.sunTable', ['sunSearch.sunService'])

.directive('sunTable', [function() {
  return {
    templateUrl: 'components/sun-search/sun-table/sun-table-tpl.html',    
    scope: {}, //Isolated
    controllerAs: 'sunTableCtrl',
    controller: ['$scope', 'sunService', function($scope, sunService) {
      //Watch search service
      $scope.search = sunService;
    }]
  };
}]);

