/**
 * Created by Namdascious on 3/31/2015.
 */

angular.module('steambuddy')

    /*==========================================================================
     App Controller -- Top Level Controller.
     ==========================================================================*/
    .controller('AppController', ['$scope', '$http', function ($scope, $http) {

        /* registers a script block to the DOM. Called in 1st level nested app controllers using $scope.$parent.loadScript()*/
        $scope.loadScript = function(url, type, charset, override){
            if(type === undefined) type = 'text/javascript';

            if(url){
                var script = document.querySelector("script[src*='" + url + "']");
                if(!script || override){
                    var heads = document.getElementsByTagName("head");
                    if(heads && heads.length){
                        var head = heads[0];
                        if(head){
                            script = document.createElement('script');
                            script.setAttribute('src', url);
                            script.setAttribute('type', type);
                            if(charset) script.setAttribute('charset', charset);
                            head.appendChild(script);
                        }
                    }
                }
                return script;
            }
        };
    }])

    /*==========================================================================
     Home Controller
     ==========================================================================*/
    .controller('HomeController', ['$scope', '$http', function ($scope, $http) {
    }])

    /*==========================================================================
     Landing Page Controller
     ==========================================================================*/
    .controller('LoginController', ['$scope', '$http', 'steamFactory', 'localStorageFactory', function ($scope, $http, steamFactory, localStorageFactory) {
        $scope.username = '';

        $scope.getUserData = function(){
            steamFactory.getSteamUser($scope.username).then(function(data){

            });
        }

        $scope.init = function(){

        }

        $scope.init();
    }])

    /*==========================================================================
     Navbar Controller
     ==========================================================================*/
    .controller('NavController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    }])

    /*==========================================================================
     Settings Controller
     ==========================================================================*/
    .controller('SettingsController', ['$scope', '$http', function ($scope, $http) {
    }])

