app.controller("webinarViewController", function($scope, $log, $http, $location, $filter, toaster, $window, locationService, $routeParams, $uibModal) {
    "use strict";
    $scope.header = "Webinar Details";
    $scope.load = true;
    $scope.params = {};
    $scope.details = {};
    $scope.webinar_post_id = $routeParams.webinarId;
    $scope.error = {};
    
    /* time picker */
    
    $scope.details.start = new Date();
    $scope.details.end = new Date();    

    $scope.hstep = 1;
    $scope.mstep = 2;

    $scope.options = {
        hstep: [1, 2, 3],
        mstep: [1, 5, 10, 15, 25, 30]
    };
    /*./time picker */
  
    

    $scope.cancel = function() {
        locationService.back();
    };
    
    $scope.ismeridian = false;
    $scope.toggleMode = function() {
        $scope.ismeridian = ! $scope.ismeridian;
    };
    
    $scope.update = function() {
        var d = new Date();
        d.setHours( 14 );
        d.setMinutes( 0 );
        $scope.details.start = d;
        $scope.details.end = d;
    };
    
    $scope.changed = function () {
        $log.log('Time changed to: ' + $scope.details.start_time);
        $log.log('Time changed to: ' + $scope.details.end_time);
    };
      
    /* datepicker */
    $scope.today = function() {
        $scope.details.date = new Date();
    };
    $scope.today();
    
    $scope.clear = function () {
        $scope.details.date = null;
    };
  
    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };
  
    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();
    $scope.maxDate = new Date(2020, 5, 22);
  
    $scope.pop = function($event) {
        $scope.status.opened = true;
    };

    $scope.setDate = function(year, month, day) {
        $scope.dt = new Date(year, month, day);
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };
    
    $scope.status = {
        opened: false
    };
    
    $scope.getDayClass = function(date, mode) {
        if (mode === 'day') {
          var dayToCheck = new Date(date).setHours(0,0,0,0);

          for (var i=0;i<$scope.events.length;i++){
            var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

            if (dayToCheck === currentDay) {
              return $scope.events[i].status;
            }
          }
        }

        return '';
    };
    /* ./datepicker */
    
    $scope.init = function() {
        $scope.error.show = false;
        if ($routeParams.webinarId === '@'){
            $scope.details = {title: '', date: '', start: '', end: '', video_url: '', registration_url: '', speakers: '', moderator: '', description: ''};
        }
        else
        {
            $scope.params.service_name = 'GET_WEBINAR_POST_DETAILS';
            $scope.params.values = {webinar_post_id: $routeParams.webinarId, user_id: '350'};
            console.log($scope.params);
            var temp = locationService.fetch_data($scope.params);
            temp.then(function(result) {
                console.log(result);
                if (angular.isUndefined(result.data.success)) {
                    toaster.pop('error', "Error", "Something went wrong while fetching data, please try after some time");
                }
                else {
                    $scope.details = result.data.success;
                    /*var time = $scope.details.start_time;
                    var hours = time.getHours() <= 9 ? ('0' + time.getHours().toString()) : time.getHours().toString();
                    var minutes = time.getMinutes() <= 9 ? ('0' + time.getMinutes().toString()) : time.getMinutes().toString();
                    var seconds = time.getSeconds() <= 9 ? ('0' + time.getSeconds().toString()) : time.getSeconds().toString();
                    
                    var dt = $scope.details.date;
                    var day = dt.getDay()*/
                    $scope.details.start_time = $scope.details.date + " " + $scope.details.start_time;
                    $scope.details.end_time = $scope.details.date + " " + $scope.details.end_time;
                    $scope.details.start = new Date($scope.details.start_time);
                    $scope.details.end = new Date($scope.details.end_time);
                    $scope.details.date = new Date($scope.details.date);
                    console.log($scope.details.start.getUTCHours() + ':' + $scope.details.start.getUTCMinutes());
                    console.log($scope.details.end.getUTCHours() + ':' + $scope.details.end.getUTCMinutes());
                    console.log($scope.details);                
                }
            });
        }
    };
    
    $scope.validate = function() {
        $scope.disbled = true;
        var status = true;
        var temp = $scope.details;
        if (angular.isUndefined(temp.title) || angular.isUndefined(temp.date) || angular.isUndefined(temp.start) || angular.isUndefined(temp.end) || angular.isUndefined(temp.speakers) || angular.isUndefined(temp.moderator) 
                || angular.isUndefined(temp.description) || (temp.video_url !== '' && temp.registration_url !== '')){
            status = false;
            $scope.error.show = true;
                }
        return status;
    };
    
    $scope.save = function(item) {
        if (item === 'Save')
        {
                if ($scope.validate()) {
                

                $scope.details.action = $scope.webinar_post_id === '@' ? 'create' : 'update';
                var time = $scope.details.start;
                var hours = time.getHours() <= 9 ? ('0' + time.getHours().toString()) : time.getHours().toString();
                var minutes = time.getMinutes() <= 9 ? ('0' + time.getMinutes().toString()) : time.getMinutes().toString();
                var seconds = time.getSeconds() <= 9 ? ('0' + time.getSeconds().toString()) : time.getSeconds().toString();
                $scope.details.start_time = hours + ':' + minutes + ':' + seconds;        

                var time = $scope.details.end;
                var hours = time.getHours() <= 9 ? ('0' + time.getHours().toString()) : time.getHours().toString();
                var minutes = time.getMinutes() <= 9 ? ('0' + time.getMinutes().toString()) : time.getMinutes().toString();
                var seconds = time.getSeconds() <= 9 ? ('0' + time.getSeconds().toString()) : time.getSeconds().toString();
                $scope.details.end_time = hours + ':' + minutes + ':' + seconds;

                $scope.details.webinar_post_id = $routeParams.webinarId;
                $scope.details.user_id = '350';
                $scope.params.values = $scope.details; 

                var temp = $scope.params.values.date;
                var month = (temp.getMonth() + 1) <= 9 ? ('0' + (temp.getMonth() + 1).toString()) : ((temp.getMonth() + 1).toString());
                var date = temp.getDate() <= 9 ? ('0' + temp.getDate().toString()) : (temp.getDate().toString());
                $scope.params.values.date = temp.getFullYear().toString() + '-' + month + '-' + date;


                $scope.params.service_name = 'SAVE_WEBINAR_POST_DETAILS';
                console.log($scope.params);
                var temp={};
                temp = locationService.fetch_data($scope.params);      
                temp.then(function(result){
                    toaster.pop('success', "Success", "Webinar posted successfully.");
                });
            }
            
            else {
                $scope.disbled = false; 
                toaster.pop('error', "Error", "Please fill all required fields");                
            }
            $scope.close();
            $scope.cancel();
        }
        else if (item === 'Delete')
        {
            $scope.params.service_name = 'DELETE_WEBINAR_POST_DETAILS';
            $scope.params.values = {webinar_post_id: $routeParams.webinarId};
            var temp = locationService.fetch_data($scope.params);
            temp.then(function(result) {
            console.log(result);
                if(angular.isUndefined(result.data.success)){
                    toaster.pop('error', "Error", angular.isUndefined(result.data.error)?'Something went wrong, Please try again later':result.data.error);
                }
                else{
                    toaster.pop('success', "Success", 'Webinar post deleted successfully');                    
                }
                $scope.close();
                $scope.cancel();
            });
        }
        else
        {
            toaster.pop('error', "Error", 'Something went wrong, Please try again later');
            $scope.close();
            $scope.cancel();
        }
    };
    
    $scope.open = function(item){
        if ($scope.validate()){
            $scope.modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'myModalContent.html',
                    scope:$scope,                
                    resolve: {
                        param: function(){
                            $scope.status = item;                        
                        }
                    }                
            });
        }
        else 
        {
            $scope.disbled = false;            
            if($scope.details.video_url !== '' && $scope.details.registration_url !== ''){
                toaster.pop('error', "Error", "Both Video URL and Registration URL are not allowed!");
            }
            else{
                toaster.pop('error', "Error", "Please fill all required fields");
            }
        }
    };
    
    $scope.close = function(){
        $scope.modalInstance.dismiss();
    };
    
    $scope.init();
});
    
    