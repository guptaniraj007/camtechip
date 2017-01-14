app.controller("userReviewerController", function ($scope, $http, $location, $filter, toaster, $window, locationService, $routeParams) {
    "use strict";
    $scope.header = "Edit user";
    $scope.load =  true;
    $scope.params = {};
    console.log($routeParams.userId);
    
    $scope.init = function(){
        $scope.params.service_name = 'GET_USER_DETAILS';
        $scope.params.values = {user_id: $routeParams.userId};
        console.log($scope.params);
        var temp = locationService.fetch_data($scope.params);
        temp.then(function(result) {
            console.log(result);
            if(angular.isUndefined(result.data.success)){
                toaster.pop('error', "Error", "Something went wrong while fetching data, please try after some time");
            }
            else{
                $scope.details = result.data.success;
                $scope.details.full_name = $scope.details.first_name+" "+$scope.details.last_name;
                
            }
        });
    };
    
    $scope.save = function(){
        $scope.params.service_name = 'UPDATE_USER_STATUS';
        $scope.params.values = {user_id: $routeParams.userId, page_number: '2', is_current: $scope.details.reviewer_details.is_current_reviewer};
        var temp = locationService.fetch_data($scope.params);
        temp.then(function(result) {
            console.log(result);
            if(angular.isUndefined(result.data.success)){
                toaster.pop('error', "Error", angular.isUndefined(result.data.error)?'Something went wrong, Please try again later':result.data.error);
            }
            else{
                if(!$scope.details.reviewer_details.is_current_reviewer){
                    var text = '<p>Hi,</p><p><a href="http://camtechmgh.org/'+($scope.details.is_expert?'expert':'innovator')+'/summary/'+$scope.details.user_id+'" target="_blank">'+$scope.details.full_name+'</a> is no longer a member of the CAMTech TRC. If this is an error, please login to the admin console to correct it.</p>'+
                            '<p>Regards,</p>'+
                            '<p>Tech Support @ Lattice</p>';
                    $scope.params.mail = {to: 'camtechmgh.org', 
                        bcc: '', 
                        subject: 'TRC member status reversed', 
                        text: text};
                    var mail = locationService.mail($scope.params.mail);
                    mail.then(function(result){
                        console.log(result);
                    });
                }
                toaster.pop('success', "Success", result.data.success);
                $location.path('/user/expertise/'+$routeParams.userId);
            }
        });
    };
    
    $scope.cancel = function(){
        locationService.back();
    };
    
    $scope.init();
    });