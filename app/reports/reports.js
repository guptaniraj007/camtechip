app.controller("reportsController", function($scope, $http, $location, $filter, toaster, locationService, tableService, $routeParams, $q) {
    "use strict";
    $scope.header = "Reports";
    $scope.load = false;
    $scope.params = {};
    $scope.csv = {};

    $scope.init = function() {
        var service = [];
        $scope.params.service_name = 'GET_REPORT_ALL_USER';
        $scope.params.values = {};
        service.push(locationService.fetch_data($scope.params));
        $scope.params.service_name = 'GET_REPORT_DAILY_LOGINS';
        $scope.params.values = {};
        service.push(locationService.fetch_data($scope.params));
        $scope.params.service_name = 'GET_REPORT_ALL_USER_EXPERTISES';
        $scope.params.values = {};
        service.push(locationService.fetch_data($scope.params));
        $scope.params.service_name = 'GET_REPORT_ALL_USER_INNOVATIONS';
        $scope.params.values = {};
        service.push(locationService.fetch_data($scope.params));
        $scope.params.service_name = 'GET_REPORT_ALL_INNOVATION';
        $scope.params.values = {};
        service.push(locationService.fetch_data($scope.params));
        $scope.params.service_name = 'GET_REPORT_ALL_VACANCY';
        $scope.params.values = {};
        service.push(locationService.fetch_data($scope.params));
        $scope.params.service_name = 'GET_REPORT_ALL_INVITATION';
        $scope.params.values = {};
        service.push(locationService.fetch_data($scope.params));
        $scope.params.service_name = 'GET_REPORT_ALL_TRC_NDA';
        $scope.params.values = {};
        service.push(locationService.fetch_data($scope.params));
        $scope.params.service_name = 'GET_REPORT_ALL_JOB_POSTS';
        $scope.params.values = {};
        service.push(locationService.fetch_data($scope.params));
        $scope.params.service_name = 'GET_REPORT_ALL_MARKETPLACE';
        $scope.params.values = {};
        service.push(locationService.fetch_data($scope.params));
        $q.all(service).then(function(response){
            if (!angular.isUndefined(response[0].data.success)) {
                $scope.csv.all_users = tableService.convert_to_csv(response[0].data.success, 'Users', true);
            }
            if (!angular.isUndefined(response[1].data.success)) {
                $scope.csv.daily_logins = tableService.convert_to_csv(response[1].data.success, 'Daily Logins', true);
            }
            if (!angular.isUndefined(response[2].data.success)) {
                $scope.csv.user_expertises = tableService.convert_to_csv(response[2].data.success, 'User Expertises', true);
            }
            if (!angular.isUndefined(response[3].data.success)) {
                $scope.csv.user_innovations = tableService.convert_to_csv(response[3].data.success, 'User Innovations', true);
            }
            if (!angular.isUndefined(response[4].data.success)) {
                $scope.csv.all_innovations = tableService.convert_to_csv(response[4].data.success, 'All Innovations', true);
            }
            if (!angular.isUndefined(response[5].data.success)) {
                $scope.csv.all_vacancies = tableService.convert_to_csv(response[5].data.success, 'Vacancies', true);
            }
            if (!angular.isUndefined(response[6].data.success)) {
                $scope.csv.all_invitations = tableService.convert_to_csv(response[6].data.success, 'Invitations', true);
            }
            if (!angular.isUndefined(response[7].data.success)) {
                $scope.csv.all_trc_nda = tableService.convert_to_csv(response[7].data.success, 'TRC NDA', true);
            }
            if (!angular.isUndefined(response[8].data.success)) {
                $scope.csv.all_jobs = tableService.convert_to_csv(response[8].data.success, 'Jobs', true);
            }
            if (!angular.isUndefined(response[9].data.success)) {
                $scope.csv.all_marketplace = tableService.convert_to_csv(response[9].data.success, 'Marketplace', true);
            }
            $scope.load = true;
        });
        
    };

    $scope.init();
});