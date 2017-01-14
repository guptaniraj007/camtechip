app.controller("jobRejectController", function($scope, $http, $location, $filter, toaster, $window, locationService, $routeParams) {
    "use strict";
    $scope.header = "Reject job";
    $scope.load = true;
    $scope.params = {};
    $scope.details = {};
    $scope.details.reason = '';
    console.log($routeParams.jobId);

    $scope.cancel = function() {
        locationService.back();
    };

    $scope.save = function(){
        if ($scope.details.reason.length === 0)
        {
            toaster.pop('error', "Error", 'Please provide a reason for rejection.');           
        }
        else
        {
            $scope.params.service_name = 'REJECT_JOB_POST';
            $scope.params.values = {job_post_id: $routeParams.jobId, reason: $scope.details.reason};
            var temp = locationService.fetch_data($scope.params);
            temp.then(function(result) {
                console.log(result);
                if(angular.isUndefined(result.data.success)){
                    toaster.pop('error', "Error", angular.isUndefined(result.data.error)?'Something went wrong, Please try again later':result.data.error);
                }
                else{
                    toaster.pop('success', "Success", 'Job post rejected successfully');


                    var text = '<p>Dear '+result.data.success.name+',</p>'+
                            '<p>Your job post <strong>'+result.data.success.title+'</strong> published on '+result.data.success.published_on+' has been removed by the administrator due to the following reason: </p>'+
                                '<p>'+$scope.details.reason+'</p>'+
                                '<p>Warm Regards,</p>'+
                                '<p>CAMTech Admin</p>';
                        $scope.params.mail = {to: result.data.success.email, 
                            bcc: 'asteel@partners.org,sgudapakkam@partners.org,hkalidindi1@babson.edu', 
                            subject: 'Job post rejected by admin', 
                            text: text};
                        var mail = locationService.mail($scope.params.mail);
                        mail.then(function(result){
                            console.log(result);
                        });
                }
            });
            $location.path('/jobs');
        }
    };
});
