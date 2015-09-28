module.exports = function(config){
  config.set({

    basePath : './app',

    files : [
      'lib/angular/angular.js',
      'lib/angular-route/angular-route.js',
      'lib/angular-mocks/angular-mocks.js',
      'lib/moment/moment.js',
      'lib/moment-timezone/moment-timezone.js',
      'components/**/*.js',
      'views/**/*.js'
    ],

    autoWatch : true,
    frameworks: ['jasmine'],
    browsers : ['Chrome'],
    reporters: ['spec'],

    plugins : [
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-spec-reporter'
    ]
  });
};
