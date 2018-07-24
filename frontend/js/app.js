// Link all the JS Docs here
var myApp = angular.module('myApp', [
    'ui.router',
    'pascalprecht.translate',
    'angulartics',
    'angulartics.google.analytics',
    'ui.bootstrap',
    'ngAnimate',
    'ngSanitize',
    'angular-flexslider',
    'ui.swiper',
    'angularPromiseButtons',
    'toastr'
]);

// Define all the routes below
myApp.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
    var tempateURL = "views/template/template.html"; //Default Template URL

    // for http request with session
    $httpProvider.defaults.withCredentials = true;
    $stateProvider
        .state('app', {
            abstract: true,
            templateUrl: "views/template/blank.html",
            controller: 'AppCtrl'
        })

        .state('login', {
            url: "/login",
            templateUrl: tempateURL,
            controller: 'LoginCtrl'
        })

        .state('app.validation', {
            url: "/validation?token",
            templateUrl: "views/template/empty.html",
            controller: 'ValidationCtrl'
        })
        .state('app.home', {
            url: "/",
            templateUrl: tempateURL,
            controller: 'HomeCtrl'
        })
        .state('app.project', {
            url: "/project/:id",
            templateUrl: tempateURL,
            controller: 'ProjectCtrl'
        })
        .state('app.project-demo', {
            url: "/demo?url&id",
            templateUrl: tempateURL,
            controller: 'ProjectDemoCtrl'
        });
    $urlRouterProvider.otherwise("/validation");
    $locationProvider.html5Mode(isproduction);
});

// For Language JS
myApp.config(function ($translateProvider) {
    $translateProvider.translations('en', LanguageEnglish);
    $translateProvider.translations('hi', LanguageHindi);
    $translateProvider.preferredLanguage('en');
});