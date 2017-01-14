app.controller("opportunityWinnerController", function($scope, $http, $location, $filter, toaster, locationService, $routeParams) {
    "use strict";
    $scope.header = "Assign Winners";
    $scope.load = true;
    $scope.queue = [{display_sequence: '0', application_id: '', prize_name: '', prize_description: ''}];
    $scope.params = {};
    $scope.opportunity_name = '';
    $scope.opportunity_id = '';
    $scope.show = false;
    $scope.required = true;

    $scope.init = function() {
        
    };

    $scope.addPrize = function() {
        $scope.queue.push({display_sequence: $scope.queue.length.toString(), application_id: '', prize_name: '', prize_description: ''});
    };

    $scope.moveUp = function(item) {
        var temp = $scope.queue[item];
        $scope.queue[item - 1].display_sequence = String(parseInt($scope.queue[item - 1].display_sequence) + 1);
        temp.display_sequence = String(parseInt(temp.display_sequence) - 1);
        $scope.queue.splice(item, 1);
        $scope.queue.splice(item - 1, 0, temp);
    };

    $scope.moveDown = function(item) {
        var temp = $scope.queue[item];
        $scope.queue[item + 1].display_sequence = String(parseInt($scope.queue[item + 1].display_sequence) - 1);
        temp.display_sequence = String(parseInt(temp.display_sequence) + 1);
        $scope.queue.splice(item, 1);
        $scope.queue.splice(item + 1, 0, temp);
    };

    $scope.save = function() {
        $scope.params.service_name = 'SAVE_OPPORTUNITY_WINNER_LIST';
        console.log($scope.queue);
        if($scope.queue[0].prize_description == "")
            toaster.pop('error', "Error", "Please fill Prize description");
        else if($scope.queue[0].prize_name == ""){
            toaster.pop('error', "Error", "Please fill Prize name");
        }
        else if ($scope.queue[0].innovation_name == "")
        {
            toaster.pop('error', "Error", "Please fill Innovation name");
        }
        else
        {
        $scope.params.values = {opportunity_id: $scope.opportunity_id, winners: $scope.queue};
        console.log($scope.params);
        var temp = locationService.fetch_data($scope.params);
        temp.then(function(result) {
            console.log(result);
            if(angular.isUndefined(result.data.success))
                toaster.pop('error', "Error", "At least one winner should be present.");
            else{
                
                angular.forEach(result.data.success.winners_list[0].application_members, function(item, index) {
                    var text = '<p>Dear '+item.name+',</p>'+
                            '<p>Congratulations! We are pleased to inform you that you are three of the winners of '+$scope.opportunity_name+'. Please check out <a href="http://camtechmgh.org/opportunities/details/'+$scope.opportunity_id+'" target="_blank">'+$scope.opportunity_name+'</a> for more details.</p>'+
                            '<p>The CAMTech Technology Review Committee found your application meritorious across all of the evaluation criteria, and '+result.data.success.winners_list[0].application_details.innovation_name+' was chosen as the winner out of all the applications submitted.</p>'+
                            '<p>We trust that this opportunity will help you continue to make a meaningful impact towards addressing global health challenges. On behalf of the entire CAMTech team, we look forward to working with you. I will be in touch with you over the next coming weeks to work on our agreement and terms.</p>'+
                            '<p>We thank you for being a part of the CAMTech community, and look forward to your continued participation.</p>'+
                            '<p>Warm Regards,</p>'+
                            '<p>Alexis Steel</p>'+
                            '<p>Program Manager</p>';
                    $scope.params.mail = {to: item.email, 
                        bcc: 'asteel@partners.org,sgudapakkam@partners.org,hkalidindi1@babson.edu', 
                        subject: 'You’re a winner!', 
                        text: text};
                    var mail = locationService.mail($scope.params.mail);
                    mail.then(function(result){
                        console.log(result);
                    });
                });
                
                angular.forEach(result.data.success.winners_list[0].application_reviewers, function(item, index) {
                    var text = '<p>Dear '+item.reviewer_name+',</p>'+
                            '<p>We would like to thank you for reviewing the proposals for CAMTech’s most recent opportunity '+$scope.opportunity_name+'.</p>'+
                            '<p>We appreciate your thoughtful consideration of the proposals and for your participation in our program focused on identifying, sourcing and accelerating affordable medical technology solutions for low and middle income countries. We had a high caliber of individuals with business, public health, and technology expertise that comprised the review committee. Thank you for your expertise and valued input that helped in choosing the winner of this opportunity.</p>'+
                            '<p>We are excited to announce that we have selected winner(s) for the <a href="http://camtechmgh.org/opportunities/details/'+$scope.opportunity_id+'" target="_blank">'+$scope.opportunity_name+'</a>. Please <a href="http://camtechmgh.org/user/login" target="_blank">login</a> to the platform for more details on the winning innovation(s)!</p>'+
                            '<p>Warm Regards,</p>'+
                            '<p>Alexis Steel</p>'+
                            '<p>Program Manager</p>';
                    $scope.params.mail = {to: item.email, 
                        bcc: 'asteel@partners.org,sgudapakkam@partners.org,hkalidindi1@babson.edu', 
                        subject: 'Results for '+$scope.opportunity_name, 
                        text: text};
                    var mail = locationService.mail($scope.params.mail);
                    mail.then(function(result){
                        console.log(result);
                    });
                });
                angular.forEach(result.data.success.losers_list, function(loser, number) {
                angular.forEach(loser.application_members, function(item, index) {
                    var text = '<p>Dear '+item.name+',</p>'+
                            '<p>After assembling a committee of external reviewers with expertise in business, global health, and technology, we regret to inform you that your application for this opportunity has not been approved. We received a large number of meritorious proposals, but unfortunately we were only able to fund select applications. We will be announcing the winner in the coming days. If you are interested in feedback from your reviewers please email us at camtech@partners.org. We appreciate your interest in participating in this opportunity and commend the exciting ideas detailed in your proposals.</p>'+
                            '<p>Please continue to check the CAMTech Innovation Platform for additional opportunities. We strongly encourage you to consider re-submitting your application. We wish you well in your future work.</p>'+
                            '<p>Warm Regards,</p>'+
                            '<p>Alexis Steel</p>'+
                            '<p>Program Manager</p>';
                    $scope.params.mail = {to: item.email, 
                        bcc: 'asteel@partners.org,sgudapakkam@partners.org,hkalidindi1@babson.edu', 
                        subject: 'Results for '+$scope.opportunity_name, 
                        text: text};
                    var mail = locationService.mail($scope.params.mail);
                    mail.then(function(result){
                        console.log(result);
                    });
                });
                });
                toaster.pop('success', "Success", "Opportunity saved successfully");
            }
        });
    }
    };

    $scope.onSelect = function(item,index) {
        $scope.queue[index].application_id = item.application_id;
    };

    $scope.onSelectOpportunity = function(item) {
        $scope.opportunity_id = item.opportunity_id;
        $scope.opportunity_name = item.opportunity_name;
        $scope.params.service_name = 'GET_OPPORTUNITY_WINNER_LIST';
        $scope.params.values = {opportunity_id: $scope.opportunity_id};
        console.log($scope.params);
        var temp = locationService.fetch_data($scope.params);
        temp.then(function(result) {
            console.log(result);
            if (!angular.isUndefined(result.data.success) && result.data.success.length > 0) {
                $scope.queue = result.data.success;
                
            }
            $scope.show = true;
        });
    };

    $scope.removeItem = function(item, index) {
        item = item.splice(index, 1);
    };

    $scope.getOpportunities = function(val) {
        $scope.params.service_name = 'GET_SEARCHED_OPPORTUNITY_AUTOCOMPLETE';
        $scope.params.values = {search_param: val};
        console.log($scope.params);
        var temp = locationService.fetch_data($scope.params);
        return temp.then(function(response) {
            if (!angular.isUndefined(response.data.success)) {
                return response.data.success.map(function(item) {
                    return item;
                });
            }
        });
    };

    $scope.getApplications = function(val) {
        console.log(val);
        $scope.params.service_name = 'GET_SEARCHED_APPLICATION_AUTOCOMPLETE';
        $scope.params.values = {search_param: val, opportunity_id: $scope.opportunity_id};
        console.log($scope.params);
        var temp = locationService.fetch_data($scope.params);
        return temp.then(function(response) {
            console.log(response);
            if (!angular.isUndefined(response.data.success)) {
                return response.data.success.map(function(item) {
                    return item;
                });
            }
        });
    };

    $scope.init();
});