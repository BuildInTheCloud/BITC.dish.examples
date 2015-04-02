
var app = angular.module('steambuddy', ['ngRoute', 'ngMaterial']);

app.config(function ($routeProvider, $mdThemingProvider) {

    $mdThemingProvider.theme('default')
        .primaryPalette('grey', {
            'default' : '400',
            'hue-1' : '100',
            'hue-2' : '600',
            'hue-3' : '50'
        })
        .accentPalette('light-green');

    $routeProvider
        .when('/home', {templateUrl: 'views/home.html', controller: 'HomeController'})
        .when('/login', { templateUrl: 'views/login.html', controller: 'LoginController' })
        //.when('/books/:id', { templateUrl: 'views/books.html', controller: 'BookController' })
        .otherwise({ redirectTo: '/login' });
})

.run(['$rootScope', function($rootScope){
    $rootScope.$on('$locationChangeStart', function(e, next, current){

        /*Sets a solid background color when one isn't on the landing page*/
        var index = next.lastIndexOf('/');
        var route = next.substring((index + 1), next.length);
        /*window.alert(current.substring((index + 1), current.length));*/
        switch(route){
            case 'home':
                break;

            default:
        }
    })
}]);

