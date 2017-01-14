app.controller("opportunityAssignListController", function ($scope, $http, $location, $filter, toaster, locationService, $routeParams, tableService) {
    "use strict";
    $scope.header = "Assign Reviewers to Application";
    $scope.load =  false;
    $scope.params = {};
    $scope.queue = {show:false, opportunity_id: ''};
    $scope.csv = {};
    
    $scope.init = function(){
        if(angular.isUndefined($routeParams.opportunity_id)){
            $scope.queue.disabled = false;
            $scope.load = true;
        }
        else{
        var url = locationService.url('opportunity?get_id=') + $routeParams.opportunity_id;
                $http.get(url).then(function(response) {
                    console.log(response);
                    $scope.select = response.data.opportunity_detail[0].headline;
                    var item = {opportunity_id: $routeParams.opportunity_id,opportunity_name: response.data.opportunity_detail[0].headline};
                    $scope.onSelect(item);
                }, function(response) {
                });
            }
    };
    
    $scope.getOpportunities = function(val) {
        console.log(val);
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
        $scope.queue.opportunity_id = item.opportunity_id;
        $scope.queue.opportunity_name = item.opportunity_name;
        $scope.params.service_name = 'GET_OPPORTUNITY_REVIEWS';
        $scope.params.values = {opportunity_id: $scope.queue.opportunity_id};
        console.log($scope.params);
        var temp = locationService.fetch_data($scope.params);
        temp.then(function(result) {
            console.log(result);
            if(!angular.isUndefined(result.data.success))
                $scope.csv.reviews = tableService.convert_to_csv(result.data.success,'Reviews for '+$scope.queue.opportunity_name, true);
            $scope.searchReviewers();
        });
        
    };
    
    $scope.searchReviewers = function(item){
        if(!angular.isUndefined($scope.queue.opportunity_id) && $scope.queue.opportunity_id!=''){
        $scope.params.service_name = 'GET_ALL_APPLICATION_REVIEWER_DETAILS';
        $scope.params.values = {opportunity_id: $scope.queue.opportunity_id,search_param: angular.isUndefined(item)?'':item};
        console.log($scope.params);
        var temp = locationService.fetch_data($scope.params);
        temp.then(function(result) {
            console.log(result);
            if(!angular.isUndefined(result.data.success))
                $scope.queue.reviewers = result.data.success;
            $scope.csv.summary = tableService.convert_to_csv($scope.queue.reviewers,'Reviewer Mapping for '+$scope.queue.opportunity_name, true);
            $scope.load = true;
            $scope.queue.show = true;
        });
    }
    };
    
    $scope.searchApplications = function(item){
        $scope.params.service_name = 'GET_OPPORTUNITY_APPLICATIONS';
        $scope.params.values = {opportunity_id: $scope.queue.opportunity_id,search_param: angular.isUndefined(item)?'':item};
        console.log($scope.params);
        var temp = locationService.fetch_data($scope.params);
        temp.then(function(result) {
            console.log(result);
            if(!angular.isUndefined(result.data.success))
                $scope.queue.reviewers = result.data.success;
            $scope.queue.show = true;
        });
    };
    
    $scope.reject = function(item){
        $scope.params.service_name = 'ACCEPT_OR_REJECT_APPLICATION';
        $scope.params.values = {application_id: item.application_id, status: 'rejected'};
        console.log($scope.params);
        var temp = locationService.fetch_data($scope.params);
        temp.then(function(result) {
            console.log(result);
            if(!angular.isUndefined(result.data.success)){
                
                angular.forEach(result.data.success.application_members, function(item, index) {
                    var text = '<p>Dear '+item.name+',</p>'+
                            '<p>After assembling a committee of external reviewers with expertise in business, global health, and technology, we regret to inform you that your application for this opportunity has not been approved. We received a large number of meritorious proposals, but unfortunately we were only able to fund select applications. We will be announcing the winner in the coming days. If you are interested in feedback from your reviewers please email us at camtech@partners.org. We appreciate your interest in participating in this opportunity and commend the exciting ideas detailed in your proposals.</p>'+
                            '<p>Please continue to check the CAMTech Innovation Platform for additional opportunities. We strongly encourage you to consider re-submitting your application. We wish you well in your future work.</p>'+
                            '<p>Warm Regards,</p>'+
                            '<p>Alexis Steel</p>'+
                            '<p>Program Manager</p>';
                    $scope.params.mail = {to: item.email, 
                        bcc: 'asteel@partners.org,sgudapakkam@partners.org,hkalidindi1@babson.edu', 
                        subject: 'Results for '+result.data.success.application_details.opportunity_name, 
                        text: text};
                    var mail = locationService.mail($scope.params.mail);
                    mail.then(function(result){
                        console.log(result);
                    });
                });
                $scope.searchApplications('');
            }
            else
                toaster.pop('error','Error',angular.isUndefined(result.data.error)?'Something went wrong, Please try again later':result.data.error);
        
        });
    };
    
    $scope.accept = function(item){
        $scope.params.service_name = 'ACCEPT_OR_REJECT_APPLICATION';
        $scope.params.values = {application_id: item.application_id, status: 'accepted'};
        console.log($scope.params);
        var temp = locationService.fetch_data($scope.params);
        temp.then(function(result) {
            console.log(result);
            var text = '<p>Dear '+item.pa_name+',</p>'+
                            '<p>Your application, <a href="http://camtechmgh.org/innovation/summary/'+item.innovation_id+'" target="_blank">'+item.innovation_name+'</a>, for '+$scope.queue.opportunity_name+' has cleared the preliminary selection process.</p>'+
                            '<p>Please go to <a href="http://camtechmgh.org/opportunities/oppfinal" target="_blank">your applications</a> to upload the necessary documents for the final review.</p>'+
                            '<p>We wish you the very best.</p>'+
                            '<p>Warm Regards,</p>'+
                            '<p>Alexis Steel</p>'+
                            '<p>Program Manager</p>';
                    $scope.params.mail = {to: item.pa_email, 
                        bcc: 'asteel@partners.org,sgudapakkam@partners.org,hkalidindi1@babson.edu', 
                        subject: 'Application cleared preliminary selection process', 
                        text: text};
                    var mail = locationService.mail($scope.params.mail);
                    mail.then(function(result){
                        if(result.data == '1')
                            $scope.searchApplications('');
                    });
            
        });
        
    };
    
    $scope.assign = function(item){
                $location.path('application/assign/'+$scope.queue.opportunity_id+'/'+item.application_id);
        
    };
    
    $scope.init();
    
    });