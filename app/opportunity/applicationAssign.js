app.controller("applicationAssignController", function ($scope, $http, $location, $filter, toaster, locationService, $routeParams, $uibModal) {
    "use strict";
    $scope.header = "Assign Reviewers to Application";
    $scope.load =  false;
    $scope.params = {};
    $scope.queue = {show:false, application_id: '', opportunity_name: '', opportunity_id :'', disabled: true};
    $scope.modalInstance = {};
    
    $scope.init = function(){
        if(angular.isUndefined($routeParams.opportunityId)){
            $scope.queue.disabled = false;
            $scope.load = true;
        }
        else{
        var url = locationService.url('opportunity?get_id=') + $routeParams.opportunityId;
                $http.get(url).then(function(response) {
                    console.log(response);
                    $scope.queue.opportunity_name = response.data.opportunity_detail[0].headline;
                    $scope.queue.opportunity_id = $routeParams.opportunityId;
                    $scope.queue.review_deadline = response.data.opportunity_detail[0].review_deadline;
                    var item = {application_id: $routeParams.application_id};
                    $scope.onSelect(item);
                }, function(response) {
                });
            }
    };
    
    $scope.getApplications = function(val) {
        console.log(val);
        $scope.params.service_name = 'GET_SEARCHED_APPLICATION_AUTOCOMPLETE';
        $scope.params.values = {search_param: val, opportunity_id: $scope.queue.opportunity_id};
        console.log($scope.params);
        var temp = locationService.fetch_data($scope.params);
    return temp.then(function(response){
        console.log(response);
        if(!angular.isUndefined(response.data.success)){
        return response.data.success.map(function(item){
        return item;
      });
        }
    });
  };
    
    $scope.getOpportunities = function(val){
        $scope.params.service_name = 'GET_SEARCHED_OPPORTUNITY_AUTOCOMPLETE';
        $scope.params.values = {search_param: val};
        console.log($scope.params);
        var temp = locationService.fetch_data($scope.params);
    return temp.then(function(response){
        if(!angular.isUndefined(response.data.success)){
        return response.data.success.map(function(item){
        return item;
      });
        }
    });
    };
    
    $scope.onSelect = function(item){
        $scope.params.service_name = 'GET_APPLICATION_REVIEWERS';
        $scope.params.values = {application_id: item.application_id};
        $scope.queue.application_id = item.application_id;
        console.log($scope.params);
        var temp = locationService.fetch_data($scope.params);
        temp.then(function(result) {
            console.log(result);
            if(!angular.isUndefined(result.data.success))
                $scope.queue.application_reviewers = result.data.success;
            var item = $scope.queue.application_reviewers[$scope.index];
//        queue.application_reviewers[index]
        $scope.params.service_name = 'GET_APPLICATION_SHORT_DETAILS';
        $scope.params.values = {application_id: $scope.queue.application_id};
        console.log($scope.params);
        var temp = locationService.fetch_data($scope.params);
        temp.then(function(result) {
            console.log(result);
            if(angular.isUndefined(result.data.success)){}
            else{
                $scope.queue.application_name = result.data.success[0].innovation_name;
                $scope.select = result.data.success[0].innovation_name;
            $scope.search('');
            $scope.load = true;
            }
        });
            
            
        });
    };
    
    $scope.onSelectOpportunity = function(item){
        var url = locationService.url('opportunity?get_id=') + item.opportunity_id;
                $http.get(url).then(function(response) {
                    console.log(response);
                    $scope.queue.opportunity_name = response.data.opportunity_detail[0].headline;
                    $scope.queue.opportunity_id = item.opportunity_id;
                    $scope.queue.review_deadline = item.review_deadline;
                    $scope.load = true;
                    $scope.queue.disabled = true;
                }, function(response) {
                });
    };
    
    $scope.click = function(index){
        $scope.index = index;
            $scope.modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'myModalContent.html',
                    scope:$scope
                });
        };
    
    $scope.removeItem = function(item){
        if(item){
        var item = $scope.queue.application_reviewers[$scope.index].rev_app_id;
//        queue.application_reviewers[index]
        $scope.params.service_name = 'REMOVE_REVIEWER_FROM_APPLICATION';
        $scope.params.values = {rev_app_id: item};
        console.log($scope.params);
        var temp = locationService.fetch_data($scope.params);
        temp.then(function(result) {
            console.log(result);
            if(angular.isUndefined(result.data.success)){
                $scope.modalInstance.dismiss();
                toaster.pop('error', "Error", angular.isUndefined(result.data.error)?'Something went wrong, Please try again later':result.data.error);
            }
            else{
                var text = '<p>Hi,</p>'+
                            '<p><a href="http://camtechmgh.org/expert/'+$scope.queue.application_reviewers[$scope.index].reviewer_id+'" target="_blank">'+$scope.queue.application_reviewers[$scope.index].reviewer_name+'</a> has been removed from the reviewer’s list for '+$scope.queue.application_name+' under '+$scope.queue.opportunity_name+'.</p>'+
                            '<p>Regards,</p>'+
                            '<p>Tech Support @ Lattice</p>';
                    $scope.params.mail = {to: 'camtechmgh.org', 
                        bcc: '', 
                        subject: 'Reviewer removed from innovation review', 
                        text: text};
                    var mail = locationService.mail($scope.params.mail);
                    mail.then(function(result){
                        console.log(result);
                    });
                $scope.modalInstance.dismiss();
                toaster.pop('success','Success',result.data.success);
                $scope.onSelect($scope.queue);
            }
        });
        }
    else{
        $scope.modalInstance.dismiss();
    }
    };
    
    $scope.search = function(item){
        $scope.params.service_name = 'GET_OPPORTUNITY_REVIEWERS';
        $scope.params.values = {opportunity_id: $scope.queue.opportunity_id, search_param: angular.isUndefined(item)?'':item, filter: 'accepted'};
        console.log($scope.params);
        var temp = locationService.fetch_data($scope.params);
        temp.then(function(result) {
            console.log(result);
            if(!angular.isUndefined(result.data.success))
                $scope.queue.all_reviewers = result.data.success;
            $scope.queue.show = true;
        });
    };
    
    $scope.assign = function(item){
        $scope.params.service_name = 'ASSIGN_REVIEWER_TO_APPLICATION';
        $scope.params.values = {reviewer_id: item.reviewer_id, application_id: $scope.queue.application_id};
        console.log($scope.params);
        var temp = locationService.fetch_data($scope.params);
        temp.then(function(result) {
            console.log(result);
            if(angular.isUndefined(result.data.success)){
                toaster.pop('error', "Error", angular.isUndefined(result.data.error)?'Something went wrong, Please try again later':result.data.error);
            }
            else{
                var text = '<p>Dear '+item.reviewer_name+',</p>'+
                            '<p>Thank you participating in the Technology Review Committee for the <a href="http://camtechmgh.org/opportunities/details/'+$scope.queue.opportunity_id+'" target="_blank">'+$scope.queue.opportunity_name+'</a> on the CAMTech Innovation Platform.</p>'+
                            '<p>We have received several exciting applications for the following opportunity: '+$scope.queue.opportunity_name+'.  CAMTech has requested that you review the follow application: '+$scope.queue.application_name+' by the '+$filter('date')(new Date($scope.queue.review_deadline),'mediumDate')+' 11:59 PM EDT to allow us to select and reward the most compelling innovations.</p>'+
                            '<p>You can access your queue of reviews <a href="http://camtechmgh.org/reviews" target="blank">here</a>.</p>'+
                            '<p>Warm regards,</p>'+
                            '<p>Alexis Steel</p>'+
                            '<p>Program Manager</p>';
                    $scope.params.mail = {to: item.email, 
                        bcc: 'asteel@partners.org,sgudapakkam@partners.org,hkalidindi1@babson.edu', 
                        subject: 'Review Applications: Technology Review Committee, CAMTech', 
                        text: text};
                    var mail = locationService.mail($scope.params.mail);
                    mail.then(function(result){
                        console.log(result);
                    });
                toaster.pop('success','Success',result.data.success);
                $scope.onSelect($scope.queue);
            }
        });
    };
    
    $scope.init();
    
    });