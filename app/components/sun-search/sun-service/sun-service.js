'use strict';

angular.module('sunSearch.sunService', [])

.service('sunService', ['$http', '$q', function($http, $q) {
  var self = this;  //Preserve scope for callbacks

  /**** Constants ****/
  this.googleKey = "AIzaSyAobzxF8_W8lPcC5MxOMUhMvelegBW70Ps";
  this.geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?';
  this.tzUrl = "https://maps.googleapis.com/maps/api/timezone/json?";
  this.sunUrl = "http://api.sunrise-sunset.org/json?";
  this.sunUrlCallback = 

  /**** Model ****/
  this.location = undefined;  //Search location
  this.startDay = undefined;  //Search start day
  this.endDay = undefined;    //Search end day
  this.sunDays = [];          //List of search results for day range

  this.getDays = function() {
    return this.sunDays;
  }

  /*
   * Create new day
   * dayresult - result from sun service
   */
  this.addDay = function(dayResult) {
    var newDay = {};
    //Copy results and convert to moments with time zone
    newDay.date = moment(dayResult.date).startOf('day');
    newDay.status = angular.copy(dayResult.status);
    newDay.events = {};
    for (event in dayResult.results) {
      var eventValue = dayResult.results[event];
      if (event == 'day_length') {
        //Duration
        var eventDuration = moment.duration(eventValue, 'seconds')
        newDay.events[event] = eventDuration;
      } else {
        //Time
        var eventMoment = moment.utc(eventValue);
        //Add TZ and DST offsets
        newDay.events[event] = eventMoment.add(self.timezone.rawOffset+self.timezone.dstOffset, 'seconds');
      }
    }
    //Add nautical afternoon duration
    newDay.events['nautical_afternoon'] = moment.duration(newDay.events['nautical_twilight_end'].diff(newDay.events['solar_noon']));
    //Add new day
    this.sunDays.push(newDay);
  };
  this.clearDays = function() {
    this.sunDays = []
  };
  this.setStart = function(moment) {
    this.startDay = moment;
  }
  this.getStart = function() {
    return this.startDay;
  }
  this.setEnd = function(moment) {
    this.endDay = moment;
  }
  this.getEnd = function() {
    return this.endDay;
  }
  this.setLocation = function(location) {
    this.location = location;
  }
  this.getLocation = function() {
    return this.location;
  }
  this.getLocationStr = function() {
    if (!this.location) return '';
    return "("+this.location.lat.toFixed(2)+', '+this.location.lng.toFixed(2)+")"
  }
  this.clearLocation = function() {
    this.location = undefined;
  }
  this.setTimezone = function(timezone) {
    this.timezone = timezone;
  }
  this.getTimezone = function() {
    return this.timezone;
  }
  /*
   * doSearch - Conducts sun search for given address and day range
   * address - string
   * startDay - Moment
   * end Day - Moment
   */
  this.doSearch = function(address, startDay, endDay) {
    //Reset
    this.clearDays();
    this.clearLocation();
    this.setStart(startDay);
    this.setEnd(endDay);

    //Conduct geolocation then sun search, handling all errors
    return getLocation(address)
    .then(handleLocation)
    .then(handleTimezone)
    .then(handleSunDays, handleException);

    /**** SEARCH HANDLERS ****/

    //Save location and start timezone search
    function handleLocation(location) {            
      self.setLocation(location);
      //Resolve promise
      return getTimezone(location, self.getStart().unix());
    }

    //Save timezone and start sun search
    function handleTimezone(timezone) {
      self.setTimezone(timezone);
      //Resolve promise
      return getSunDays(self.getLocation(), self.getStart(), self.getEnd());
    }

    //Save day results
    function handleSunDays(dayResults) {      
      for (var key in dayResults) {
        self.addDay(dayResults[key]);
      }
      //Resolve promise
      return true;
    }
    
    //End of the line exception handler for promise chain
    function handleException(errorStr) {
      return $q.reject(errorStr);
    }

    /**** SEARCH METHODS ****/

    /*
     * getLocation - returns a location object {lat: number, lng: number} for given address
     * address- string
     */
    function getLocation(address) {
      //Return promise
      return $http({
        url: self.geocodeUrl,
        method: "GET",
        params: {
          key: self.googleKey, 
          address: address
        }
      }).then(
        function (response) {
          //Check response
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
     * getTimezone - returns timezone data for given location and timestampe
     * location - object with lat, lng property
     * timestamp - time to use to lookup daylight savings offset
     */
    function getTimezone(location, timestamp) {
      return $http({
        url: self.tzUrl,
        method: "GET",
        params: {
          key: self.googleKey, 
          location: location.lat+','+location.lng,
          timestamp: timestamp
        }
      }).then(
        function (response) {
          //Check response
          if (response.data.status == 'OK') {
            //Resolve promise
            return response.data;
          } else if (response.data.status == 'ZERO_RESULTS') {
            //Reject promise
            return $q.reject('timezoneZero');
          } else {
            //Reject promise
            return $q.reject('timezoneError');
          }
        }, function (error) {
          //Reject promise
          return $q.reject(error);
        }
      );
    }

    /*
     * getSunDays - returns a list of sun events for given location, one for each day from start to end
     * location - {lat: number, lng: number}
     * start day (Moment)
     * end day (Moment)
     */
    function getSunDays(location, startDay, endDay) {
      var numDays = Math.abs(startDay.diff(endDay,'days'))
      var dateList = [];

      //Fire off 1 request for each day in range, building list of promises
      var datePromises = [];
      for (var i=0; i<= numDays; i++) {
        var curDay = moment.utc(startDay);  //Preserve start day
        if (i > 0) {
          curDay.add(i, 'days');
        }
        var dateStr = curDay.format('YYYY-MM-DD');
        dateList.push(dateStr);
        datePromises.push(
          $http({
            url: self.sunUrl,
            method: "jsonp",
            params: {
              lat: location.lat,
              lng: location.lng,
              date: dateStr,
              formatted: 0, //unformatted
              callback: 'JSON_CALLBACK'
            }
           })
        );
      }

      //Reduce to one promise
      return $q.all(datePromises).then(function (responses) {
        //Repack responses
        var days = [];
        for (var i in responses) {          
          responses[i].data.date = dateList[i]; //Add search date to result
          days.push(responses[i].data);
        }
        //Resolve promise
        return days;
      }, function (error) {
        //Reject promise
        return $q.reject(error);
      });
    }
  }

}]);

