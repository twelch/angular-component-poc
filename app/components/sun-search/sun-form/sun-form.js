'use strict';

//Create new module
angular.module('sunSearch.sunForm', ['sunSearch.sunService'])

.controller('sunFormCtrl', ['$scope', 'sunService', function($scope, sunService) {
  //Search form config
  $scope.config = {
    dateOptions: {
      formatYear: 'yy',
      startingDay: 1
    }
  };

  //Search params
  $scope.params = {
    address: "400 SW 6th Ave, Portland, OR",
    //Start and end dates (Date) managed by date picker
    startDate: new Date(Date.now()-86400000*6), //7 days ago
    endDate: new Date(), //Now
    //Start and end days (Moment) used by rest of app
    startDay: moment.utc().startOf('day').subtract(6, 'days'),
    endDay: moment.utc().startOf('day')
  };

  //Extract Y-M-D from dates produced by picker onChange and convert to moments
  $scope.$watch('params.startDate', function() {
    var d = $scope.params.startDate;
    if (!d) {
      return;
    }
    var ymdStr = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
    $scope.params.startDay = moment.utc(ymdStr, 'YYYY-M-D');
  });
  $scope.$watch('params.endDate', function() {
    var d = $scope.params.endDate;
    if (!d) {
      return;
    }
    var ymdStr = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
    $scope.params.endDay = moment.utc(ymdStr, 'YYYY-M-D');
  });
  
  //Validate days on change
  $scope.$watch('params.startDay', validateDays);
  $scope.$watch('params.endDay', validateDays);  
  function validateDays() {    
    var diffDays = $scope.params.startDay.diff($scope.params.endDay,'days')
    //Verify start less than end
    $scope.searchform.$setValidity("endBeforeStart", diffDays <= 0);
    //Verify duration no more than 14 days
    $scope.searchform.$setValidity("durationTooLong", Math.abs(diffDays) < 14);
  }

  //Search exceptions
  $scope.exceptions = {};

  /*
   * doSearch - executes search and reports any errors
   * params - object with search parameters
   */
  $scope.doSearch = function(params) {    
    $scope.exceptions = {}; //Reset exceptions
    //Return promise
    return sunService.doSearch(params.address, params.startDay, params.endDay).then(function(success){      
      if (!success) {
        $scope.exceptions['searchError'] = true;
      } else {
        return true;
      }
    }, function(errorStr) {      
      $scope.exceptions[errorStr] = true; //Catch exceptions
    });
  }
}])

.directive('sunForm', [function() {
  return {
    templateUrl: 'components/sun-search/sun-form/sun-form-tpl.html',
    controller: 'sunFormCtrl',
    scope: {}
  };
}]);

