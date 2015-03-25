/**
 * Created by Namdascious on 3/19/2015.
 */

(function(){
    var wwo_api_key = '8ecacbd1f61a0ac9190af2d840262';
    var wwo_api_url = 'http://api.worldweatheronline.com/free/v2/weather.ashx';
    var usr_location = {};
    var timeCheckId;
    var polymer_instance;


    /* Polymer starts right here*/
    Polymer('nam-weather-display', {
        /**
         * Specifies whether the size of the tile on load.
         * sizes: ['half', 'regular', 'double', 'triple', 'quadro']
         *
         * @attribute size
         * @type string
         * @default 'regular'
         */
        sizes: {
            half: 'inherit',
            regular: 'none',
            double: 'none',
            triple: 'none',
            quadro: 'none'
        },

        classes: {
            half: 'weather-active',
            regular: '',
            double: '',
            triple: '',
            quadro: ''
        },

        displayView: function(element){
            var fade_in_animation = new CoreAnimation();
            fade_in_animation.duration = 500;
            fade_in_animation.keyframes = [
                {opacity: 0},
                {opacity: 1}
            ];

            var fade_out_animation = new CoreAnimation();
            fade_out_animation.duration = 500;
            fade_out_animation.keyframes = [
                {opacity: 1},
                {opacity: 0}
            ];

            //Get the element currently visible...
            fade_out_animation.target = $('.weather-active')[0];
            if(fade_out_animation.target !== null && fade_out_animation.target !== undefined){
                fade_out_animation.play();
            }

            fade_in_animation.target = element;
            fade_in_animation.play();
        },

        getCityAndState : function(usr_location){
            var city, state;
            var can_break = function(city, state){
                return city !== null && city !== undefined && state !== null && state !== undefined;
            };

            //Get location info
            if(usr_location !== null && usr_location !== undefined){
                for(var i = 0; i < usr_location.length; i++){
                    for(var j = 0; j < usr_location[i].types.length; j++ ){
                        if(usr_location[i].types[j] === 'postal_code'){
                            var addrcomponents = usr_location[i].address_components;

                            for(var k = 0; k < addrcomponents.length; k++){
                                var addr_types = addrcomponents[k].types;

                                for(var l = 0; l < addr_types.length; l++){
                                    //city
                                    if(addr_types[l] === 'locality'){
                                        city = addrcomponents[k].short_name;
                                    }
                                    //state
                                    if(addr_types[l] === 'administrative_area_level_1'){
                                        state = addrcomponents[k].short_name;
                                    }
                                    if(city !== null && city !== undefined && state !== null && state !== undefined){
                                        break;
                                    }
                                }
                                if(can_break(city, state)){ break; }
                            }
                        }
                        if(can_break(city, state)){ break; }
                    }
                    if(can_break(city, state)){ break; }
                }
            }
            return { city: city, state: state };
        },

        getUserLocation: function(lat, long){
            //reverse-geocode for readable info using googlemaps API
            var polymer = polymer_instance;

            var geocoder = new google.maps.Geocoder();
            var latlng = new google.maps.LatLng(lat, long);
            geocoder.geocode({'latLng': latlng}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var usr_location = results;
                    var weather_cache = localStorage.getItem('weather_data');

                    if(weather_cache !== null && weather_cache !== undefined && weather_cache !== ''){
                        weather_cache = JSON.parse(weather_cache);
                        weather_cache.location = usr_location;
                    }
                    else{
                        weather_cache = { 'weather' : '', 'time' : (new Date().getTime() / 1000).toString(), 'location' : usr_location};
                    }
                    localStorage.setItem('weather_data', JSON.stringify(weather_cache));
                    polymer.updateWeather(weather_cache);
                } else {
                    //alert('Geocoder failed due to: ' + status);
                    //Handle eror using dish/dish-tray specific means
                }
            });
        },

        getWeather: function(position){
            if(Modernizr.localstorage /* Probably uneccessary */){
                var weather_data = localStorage.getItem('weather_data');

                if(weather_data !== null && weather_data !== undefined && weather_data !== ''){
                    var weather_data_obj = JSON.parse(weather_data);
                    var time = new Date().getTime() / 1000;
                    var cache_time = parseFloat(weather_data_obj.time);
                    if(time - cache_time < 20000){ //refreshes cache every 20 mins. Weather doesn't change that much
                        return weather_data_obj;
                    }
                }
            }
            return null; //no data in cache or cache expired
        },

        getWeatherFromService: function(position){
            var polymer = polymer_instance;
            var lat =  position.coords.latitude;
            var long = position.coords.longitude;

            //Get the user's city & state at the same time
            polymer.getUserLocation(position.coords.latitude, position.coords.longitude);

            var weather_url = wwo_api_url + '?key=' + wwo_api_key + '&q=' + lat.toString() + ',' + long.toString() + '&format=JSON&num_of_days=7';
            var http  = new XMLHttpRequest();
            http.open("GET", weather_url);
            http.onload = function(){ polymer.receiveWeather(http); }
            http.send();
        },

        /**
         * rearranges dish tile layout based on window resize
         */
        rearrangeElements: function(){
            var polymer = polymer_instance;
            var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            var element;

            polymer.sizes.half = 'none';
            polymer.sizes.regular = 'none';
            polymer.sizes.double = 'none';
            polymer.sizes.triple = 'none';
            polymer.sizes.quadro = 'none';

            polymer.classes.half = '';
            polymer.classes.regular = '';
            polymer.classes.double = '';
            polymer.classes.triple = '';
            polymer.classes.quadro = '';

            //half size (icon)
            if(width <= 168){
                polymer.sizes.half = 'inherit';
                polymer.classes.half = 'weather-active';
                element = $('#weather_view_half')[0];
            }

            if(width > 168 && width <= 350){
                polymer.sizes.regular = 'inherit';
                polymer.classes.regular = 'weather-active';
                element = $('#weather_view_regular')[0];
            }

            if(width > 350 && width <= 1000){
                polymer.sizes.double = 'inherit';
                polymer.classes.double = 'weather-active';
                element = $('#weather_view_double')[0];
            }

            /*if(width > 600 && width <= 1000 ){
             polymer.sizes.triple = 'inherit';
             polymer.classes.triple = 'weather-active';
             element = $('#weather_view_triple')[0];
             }*/

            if(width > 1000){
                polymer.sizes.quadro = 'inherit';
                polymer.classes.quadro = 'weather-active';
                element = $('#weather_view_quadro')[0];
            }

            polymer.displayView(element);
        },

        ready: function(){
            var polymer = this; /* instance of polymer */
            polymer_instance = polymer; //set a polymer instance globally so we can access it later
            window.resizeStop.bind(polymer.rearrangeElements);
            polymer.startWeatherProcess();
            //set interval for time check/update
            clearInterval(timeCheckId);
            timeCheckId = setInterval(polymer.updateTime, 1000);
            polymer.rearrangeElements();
        },

        receiveWeather: function(http){
            var polymer = polymer_instance;
            if(http.readyState == 4 && http.status == 200){
                //var weather_info = JSON.parse(http.responseText);
                var weather_info = JSON.parse(http.responseText);

                //cache in localstorage
                var weather_cache = localStorage.getItem('weather_data');

                if(weather_cache !== null && weather_cache !== undefined && weather_cache !== ''){
                    weather_cache = JSON.parse(weather_cache);
                    weather_cache.weather = weather_info;
                    weather_cache.time = (new Date().getTime() / 1000).toString();
                }
                else{
                    weather_cache = { 'weather': weather_info, 'time' : (new Date().getTime() / 1000).toString(), 'location': ''};
                }

                localStorage.setItem('weather_data', JSON.stringify(weather_cache));
                polymer.updateWeather(weather_cache);
            }
        },

        startWeatherProcess: function(){
            var polymer = polymer_instance;
            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(function(position){
                    var data = polymer.getWeather(position);
                    if(data !== null){
                        //render weather info with Polymer
                        //polymer.getUserLocation(position.coords.latitude, position.coords.longitude);
                        polymer.updateWeather(data);
                    }
                    else {
                        polymer.getWeatherFromService(position);
                    }
                });
            }
            else { /*alert("I wasn't able to get your location. Sorry...");*/}
        },

        /**
         * Display weather info passed in
         */
        updateWeather: function(data){
            /**
             * Using World Weather Online API.
             *
             */
            var polymer = polymer_instance;
            if(data === null){
                return;
            }
            var weather = data.weather;
            var cityAndState = polymer.getCityAndState(data.location);

            //Get weather information
            if(weather !== null && weather !== undefined){}

            //Get icons
            $.get('imports/nam-weather-display/wwo_weather_codes.json', function(data){
                var icon_obj = _.find(data, function(icon_elem){
                    return weather.data.current_condition[0].weatherCode == icon_elem.WeatherCode;
                });

                polymer.temperature = { F: weather.data.current_condition[0].temp_F, C: weather.data.current_condition[0].temp_C };
                polymer.currTime = new Date().toString('hh:mm tt');
                polymer.unit = 'F'; //default
                polymer.city = cityAndState.city;
                polymer.state = cityAndState.state;
                polymer.icon_single = '';
                polymer.forecast = [];
                polymer.humidity = weather.data.current_condition[0].humidity;
                polymer.pressure = weather.data.current_condition[0].pressure;
                polymer.uvIndex = weather.data.weather[0].uvIndex;

                var getDay = function(date){
                    switch((new Date(date)).getDay()){
                        case 0:
                            return 'Sunday';

                        case 1:
                            return 'Monday';

                        case 2:
                            return 'Tuesday';

                        case 3:
                            return 'Wednesday';

                        case 4:
                            return 'Thursday';

                        case 5:
                            return 'Friday';

                        case 6:
                            return 'Saturday';

                    }
                };

                var getWeatherIconsMode = function(weather_hourly){
                    var weather_modes = [];

                    _.each(weather_hourly, function(hourly_elem, index){
                        var found_mode = _.find(weather_modes, function(weather_mode){
                            return weather_mode.weatherCode === hourly_elem.weatherCode;
                        });

                        if(found_mode !== null && found_mode !== undefined){
                            found_mode.frequency  = found_mode.frequency !== null && found_mode.frequency !== undefined ? found_mode.frequency++ : 1;
                        }
                        else {
                            weather_modes.push({ weatherCode: hourly_elem.weatherCode, frequency : 1});
                        }
                    });

                    //Get max
                    var max_weather = _.max(weather_modes, function(mode_item){
                        return mode_item.frequency;
                    });
                    return max_weather.weatherCode;
                };

                /* Current condition of forecast */
                _.each(weather.data.weather, function(forecast_data, index){
                    polymer.forecast.push({});
                });

                for(var k = 0; k < polymer.forecast.length; k++){
                    polymer.forecast[k].weather_icon =  (_.find(data, function(icon_val){
                        return (getWeatherIconsMode(weather.data.weather[k].hourly) == icon_val.WeatherCode)
                    })).DayIcon;
                    polymer.forecast[k].weather_condition = weather.data.weather[k];
                    polymer.forecast[k].date = weather.data.weather[k].date;
                    polymer.forecast[k].day = getDay(weather.data.weather[k].date);
                    //polymer.forecast[i].weather_condition.maxtempC   for instance...
                }

                if(icon_obj !== null && icon_obj !== undefined){
                    polymer.icon_single = icon_obj.DayIcon;
                }
            });
        },

        updateTime: function(){
            var polymer = polymer_instance;
            polymer.currTime = new Date().toString('hh:mm tt');
        }
    });
})();
