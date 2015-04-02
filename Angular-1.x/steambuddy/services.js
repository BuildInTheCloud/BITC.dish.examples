/**
 * Created by Namdascious on 4/1/2015.
 */

angular.module('steambuddy')

    .factory('steamFactory', function($q, $http){
        var steam_api_url = 'http://api.steampowered.com/<interface_name>/<method_name>/<version>/?key=<api_key>&format=<format>';
        var steam_api_key = '4B152814751E25D21F710569111A99BE';
        var steam_interface = {
            news: 'ISteamNews',
            user: 'ISteamUser',
            userStats: 'ISteamUserStats'
        };
        var steam_version = 'v0002';
        var steam_methods = [
            { name: 'getPlayerSummaries', method: { name: 'GetPlayerSummaries', version: 'v0002' }},
            { name: 'getFriendList', method: { name: 'GetFriendList', version: 'v0001' }},
            { name: 'getPlayerAchievements', method: { method: 'GetPlayerAchievements', version: 'v0001' }},
            { name: 'getUserStatsForGame', method: { name: 'GetUserStatsForGame', version: 'v0002' }},
            { name: 'getOwnedGames', method: { name: 'GetOwnedGames', version: 'v0001' }},
            { name: 'getRecentlyPlayedGames', method: { name: 'GetRecentlyPlayedGames', version: 'v0001' }},
            { name: 'isPlayingSharedGame', method: { name: 'IsPlayingSharedGame', version: 'v0001' }}
        ];

        var steam_service = {};

        steam_service.getSteamUser = function(username){

            steam_api_url = steam_api_url
                                .replace('<interface_name>', steam_interface.user)
                                .replace('<method_name>', steam_interface.user);
            return $http.get(steam_api_url);
        };

        steam_service.getSteamUserStats = function(){
        };

        steam_service.getSteamNews = function(){
        };

        return steam_service;
    })

    .factory('localStorageFactory', function(){

        var steam_service = {};

        steam_service.getItem = function(key){

        };

        steam_service.addItem = function(key, value){

        }

        return steam_service;
    });