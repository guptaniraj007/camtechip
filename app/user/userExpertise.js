app.controller("userExpertiseController", function ($scope, $http, $location, $filter, toaster, $window, locationService, $routeParams, tableService) {
    "use strict";
    $scope.header = "Edit user";
    $scope.load =  true;
    $scope.details = {};
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
    
    $scope.cancel = function(){
        locationService.back();
    };
    
    $scope.save = function(){
        $scope.params.service_name = 'UPDATE_USER_STATUS';
        $scope.params.values = {user_id: $routeParams.userId, page_number: '3', is_clinical: $scope.details.reviewer_details.is_clinical, is_technical: $scope.details.reviewer_details.is_technical, is_business: $scope.details.reviewer_details.is_business, is_other: $scope.details.reviewer_details.is_other};
        var temp = locationService.fetch_data($scope.params);
        temp.then(function(result) {
            console.log(result);
            if(angular.isUndefined(result.data.success)){
                toaster.pop('error', "Error", angular.isUndefined(result.data.error)?'Something went wrong, Please try again later':result.data.error);
            }
            else{
                toaster.pop('success', "Success", result.data.success);
            }
        });
    };
    
    $scope.notify = function(){
        var text = '<p>Dear '+$scope.details.first_name+',</p>'+
                '<p>The CAMTech team requests you to serve as a member of the Technology Review Committee.<a href="http://camtechmgh.org/cdn/pdfs/CAMTech Opportunities_TRC Guidance and NDA.pdf" target="_blank">This document</a> has details about the process and the criteria using which innovations are evaluated and rewarded.</p>'+
                            '<p>Please login in to the <a href="http://camtechmgh.org/reviews" target="_blank"> CAMTech Innovation Platform </a> for details.</p>'+
                            '<p>Your expertise will help direct resources to the most deserving innovations that have the potential to create public health impact in low and mid income countries.</p>'+
                            '<p>Sincerely,</p>'+
                            '<p>Alexis Steel</p>'+
                            '<p>Program Manager</p>';
                    $scope.params.mail = {to: angular.isUndefined($scope.details.contact_email) || $scope.details.contact_email == '' ? $scope.details.email : $scope.details.contact_email, 
                        bcc: 'asteel@partners.org,sgudapakkam@partners.org,hkalidindi1@babson.edu', 
                        subject: 'Invitation to join Technology Review Committee, CAMTech', 
                        text: text};
                    var mail = locationService.mail($scope.params.mail);
                    mail.then(function(result){
                        console.log(result);
            if(result.data == 0){
                toaster.pop('error', "Error", angular.isUndefined(result.data.error)?'Something went wrong, Please try again later':result.data.error);
            }
            else{
                toaster.pop('success', "Success", 'Notified successfully');
            }
                    });
    };
    
    $scope.init();
    });