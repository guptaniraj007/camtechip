'use strict';
app.factory('locationService', function ($resource, $location, $http, $window) {
    var locationFactory = {};
    
    var _location = function () {
        var host = $location.host();
        if(host != 'localhost' && host != 'makersinindia.in' && host != 'www.makersinindia.in'){
            host = 'makersinindia.com';
        }
        return host; 
        };
        
    var _path = function(){
        return $location.path();
    }
        
    var _service_url = function(path){
        var url = '';
        url = 'http://'+_location()+'/cip/cipa/'+path;
        return url;
    };
    
    var _get_dashboard = function(item) {
                    var url = _service_url('get_dashboard_data');
                    var data = {
                        service_name: item.service_name,
                        num_of_months: angular.toJson(item.num_of_months)
                    };
                    var data = $http.post(url, data);
                    return data;//returns response
                };
    
    var _logged_in = function(){
        var url = _service_url('logged_in');
        var data = $http.post(url);
        return data;//returns response
    };
    
    var _fetch_data = function(item) {
                    var url = _service_url('fetch_data');
                    var data = {
                        service_name: item.service_name,
                        values: angular.toJson(item.values)
                    };
                    if(!angular.isUndefined(item.mail))
                        data.mail = item.mail;
                    console.log(data);
                    var data = $http.post(url, data);
                    return data;//returns response
                };
                
    var _back = function(){
        $window.history.back();
    };
    
    var _mail = function(values){
        var url = _service_url('send_mail');
                    var data = {
                        values: values
                    };
                    console.log(data);
                    var data = $http.post(url, data);
                    return data;//returns response
    };
    
    locationFactory.location = _location;
    locationFactory.url = _service_url;
    locationFactory.path = _path;
    locationFactory.get_dashboard = _get_dashboard;
    locationFactory.fetch_data = _fetch_data;
    locationFactory.logged_in = _logged_in;
    locationFactory.back = _back;
    locationFactory.mail = _mail;
    return locationFactory;
});