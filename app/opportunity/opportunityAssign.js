app.controller("opportunityAssignController", function ($scope, $http, $location, $filter, toaster, locationService, $routeParams, $uibModal) {
    "use strict";
    $scope.header = "Assign Reviewers to Opportunity";
    $scope.load =  true;
    $scope.params = {};
    $scope.queue = {show:false, opportunity_id: ''};
    $scope.modalInstance = {};
    
    $scope.init = function(){
        if(!angular.isUndefined($routeParams.opportunity_id)){
            var url = locationService.url('opportunity?get_id=') + $routeParams.opportunityId;
                $http.get(url).then(function(response) {
                    var item = {search_param:'', filter: 'all'};
                    console.log(response);
                    item.opportunity_name = response.data.opportunity_detail[0].headline;
                    item.opportunity_id = $routeParams.opportunity_id;
                    item.review_deadline = $filter('date')(new Date(response.data.opportunity_detail[0].review_deadline),'mediumDate');
                    item.final_deadline = $filter('date')(new Date(response.data.opportunity_detail[0].final_deadline),'mediumDate');
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
        console.log(response);
        if(!angular.isUndefined(response.data.success)){
        return response.data.success.map(function(item){
        return item;
      });
        }
    });
  };
    
    $scope.onSelect = function(item){
        $scope.params.service_name = 'GET_OPPORTUNITY_REVIEWERS';
        $scope.queue.opportunity_name = item.opportunity_name;
        $scope.queue.final_deadline = $filter('date')(new Date(item.deadline),'mediumDate');
        $scope.queue.review_deadline = $filter('date')(new Date(item.review_deadline),'mediumDate');
        $scope.params.values = {opportunity_id: item.opportunity_id, search_param:'', filter: 'all'};
        console.log($scope.params);
        var temp = locationService.fetch_data($scope.params);
        temp.then(function(result) {
            console.log(result);
            if(!angular.isUndefined(result.data.success))
                $scope.queue.opportunity_reviewers = result.data.success;
            $scope.queue.opportunity_id = item.opportunity_id;
            $scope.search();
            
            
        });
    };
    
    $scope.removeItem = function(item){
        if(item){
        var item = $scope.queue.opportunity_reviewers[$scope.index];
        $scope.params.service_name = 'REMOVE_REVIEWER_FROM_OPPORTUNITY';
        $scope.params.values = {rev_opp_id: item.rev_opp_id};
        console.log($scope.params);
        var temp = locationService.fetch_data($scope.params);
        temp.then(function(result) {
            console.log(result);
            if(angular.isUndefined(result.data.success)){
                $scope.modalInstance.dismiss();
                toaster.pop('error', "Error", angular.isUndefined(result.data.error)?'Something went wrong, Please try again later':result.data.error);
            }
            else{
                $scope.modalInstance.dismiss();
                toaster.pop('success','Success',result.data.success);
                var item = $scope.queue;
                item.deadline = $scope.queue.final_deadline;
                $scope.onSelect($scope.queue);
            }
        });
        }
    else{
        $scope.modalInstance.dismiss();
    }
    };
    
    $scope.search = function(){
        $scope.params.service_name = 'GET_ALL_REVIEWER_LIST';
        $scope.params.values = {search_param: $scope.search_text};
        console.log($scope.params);
        var temp = locationService.fetch_data($scope.params);
        temp.then(function(result) {
            console.log(result);
            if(!angular.isUndefined(result.data.success))
                $scope.queue.all_reviewers = result.data.success;
            $scope.queue.show = true;
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
    
    $scope.assign = function(item){
        $scope.params.service_name = 'ASSIGN_REVIEWER_TO_OPPORTUNITY';
        $scope.params.values = {reviewer_id: item.reviewer_id, opportunity_id: $scope.queue.opportunity_id, opportunity_name: $scope.queue.opportunity_name, deadline: $scope.queue.final_deadline, review_deadline: $scope.queue.review_deadline};
        console.log($scope.params);
        var temp = locationService.fetch_data($scope.params);
        temp.then(function(result) {
            console.log(result);
            if(angular.isUndefined(result.data.success)){
                toaster.pop('error', "Error", angular.isUndefined(result.data.error)?'Something went wrong, Please try again later':result.data.error);
            }
            else{
                var text = '<p>Dear '+item.reviewer_name+',</p>'+
                '<p>Thank you for being a part of the CAMTech Technology Review Committee. We have an upcoming opportunity, <a href="http://camtechmgh.org/opportunities/details/'+$scope.queue.opportunity_id+'" target="_blank">'+$scope.queue.opportunity_name+'</a>, for the innovators who are a part of the CAMTech Innovation platform.</p>'+
                            '<p>Innovators will apply for this opportunity by '+$scope.queue.final_deadline+'. Thereafter, we would like to solicit your inputs to select the most deserving innovations by '+$scope.queue.review_deadline+'.</p>'+
                            '<p>Please click on <a href="http://camtechmgh.org/cdn/pdfs/CAMTech Opportunities_TRC Guidance and NDA.pdf" target="_blank">this link</a>  to understand your role as a TRC member. Please login to the <a href="http://camtechmgh.org/reviews" target="_blank">reviews section</a> to indicate your availability to review 3-5 innovations.</p>'+
                            '<p>If you only have the capacity to review one innovation at this time, please reach out to me directly at asteel@partners.org.</p>'+
                            '<p>Sincerely,</p>'+
                            '<p>Alexis Steel</p>'+
                            '<p>Program Manager</p>';
                    $scope.params.mail = {to: item.email, 
                        bcc: 'asteel@partners.org,sgudapakkam@partners.org,hkalidindi1@babson.edu', 
                        subject: 'Reviews for an Opportunity: Technology Review Committee, CAMTech', 
                        text: text};
                    var mail = locationService.mail($scope.params.mail);
                    mail.then(function(result){
                        console.log(result);
                    });
                toaster.pop('success','Success',result.data.success);
                $scope.onSelect($scope.params.values);
            }
        });
    };
    
    $scope.init();
    
    });