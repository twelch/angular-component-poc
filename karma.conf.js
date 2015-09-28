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
      'components/**/*-tpl.html',
      'views/**/*.js',
    ],

    autoWatch : true,
    frameworks: ['jasmine'],
    browsers : ['Chrome'],
    reporters: ['spec'],

    plugins : [
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-spec-reporter',
      'karma-ng-html2js-preprocessor'
    ],

    //Configure preprocessor
    ngHtml2JsPreprocessor: {
      stripPrefix: 'app/',
      moduleName: 'appTemplates'
    },

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '**/*.html': ['ng-html2js']
    }   
     
  });
};
