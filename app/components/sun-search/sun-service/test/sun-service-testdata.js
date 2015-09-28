'use strict';

angular.module('sunSearch.sunService.testData', [])
.value('geocodeSuccess', {
  "results" : [
    {
      "address_components" : [
        {
          "long_name" : "400",
          "short_name" : "400",
          "types" : [ "street_number" ]
        },
        {
          "long_name" : "Southwest 6th Avenue",
          "short_name" : "SW 6th Ave",
          "types" : [ "route" ]
        },
        {
          "long_name" : "Southwest Portland",
          "short_name" : "Southwest Portland",
          "types" : [ "neighborhood", "political" ]
        },
        {
          "long_name" : "Portland",
          "short_name" : "Portland",
          "types" : [ "locality", "political" ]
        },
        {
          "long_name" : "Multnomah County",
          "short_name" : "Multnomah County",
          "types" : [ "administrative_area_level_2", "political" ]
        },
        {
          "long_name" : "Oregon",
          "short_name" : "OR",
          "types" : [ "administrative_area_level_1", "political" ]
        },
        {
          "long_name" : "United States",
          "short_name" : "US",
          "types" : [ "country", "political" ]
        },
        {
          "long_name" : "97204",
          "short_name" : "97204",
          "types" : [ "postal_code" ]
        }
      ],
      "formatted_address" : "400 SW 6th Ave, Portland, OR 97204, USA",
      "geometry" : {
        "location" : {
            "lat" : 45.5207049,
            "lng" : -122.6773971
          },
          "location_type" : "ROOFTOP",
          "viewport" : {
            "northeast" : {
            "lat" : 45.52205388029149,
            "lng" : -122.6760481197085
          },
          "southwest" : {
            "lat" : 45.5193559197085,
            "lng" : -122.6787460802915
          }
        }
      },
      "place_id" : "ChIJk_wWPAQKlVQRUTkrn0kqOWI",
      "types" : [ "street_address" ]
    }
  ],
  "status" : "OK"
})

.value('geocodeZero', {
  "results" : [],
  "status" : "ZERO_RESULTS"
})

.value('timezoneSuccess', {
  "dstOffset" : 3600,
  "rawOffset" : -28800,
  "status" : "OK",
  "timeZoneId" : "America/Los_Angeles",
  "timeZoneName" : "Pacific Daylight Time"
})

.value('sunSuccess', {
  "results":{"sunrise":"2015-09-24T14:00:51+00:00","sunset":"2015-09-25T02:04:12+00:00","solar_noon":"2015-09-24T20:02:32+00:00","day_length":43401,"civil_twilight_begin":"2015-09-24T13:31:25+00:00","civil_twilight_end":"2015-09-25T02:33:39+00:00","nautical_twilight_begin":"2015-09-24T12:56:47+00:00","nautical_twilight_end":"2015-09-25T03:08:16+00:00","astronomical_twilight_begin":"2015-09-24T12:21:21+00:00","astronomical_twilight_end":"2015-09-25T03:43:42+00:00"},"status":"OK"  
});