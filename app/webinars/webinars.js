"use strict";
app.controller("webinarsController", function($scope, $http, $location, locationService, toaster, tableService, $q, $interpolate, $sce, $filter) {
    $scope.header = "Webinars";
    $scope.load = false;
    $scope.params = {search_param: '', sort_param: 'scheduled_on', sort_type: 'desc', row_index: 1, num_of_records: 10};
    $scope.error = false;
    $scope.error_text = '';
    $scope.headers = [];
    $scope.data = [];
    $scope.page_number = 1;
    $scope.total_count = 0;
    $scope.total_pages = 0;
    $scope.pages = [];
    $scope.records = ['10', '20', '50'];
    $scope.search_text = '';
    $scope.csv = '';
    $scope.filter = {all: true, cve: false, trc: false, innovator: false, expert: false};
    
    $scope.init = function() {
        console.log($scope.params);
        var request = $scope.params;
        request.row_index = request.row_index.toString();
        request.num_of_records = request.num_of_records.toString();
        request.service_name = 'GET_WEBINAR_POST_LIST';
        var temp = tableService.get_data(request);
        temp.then(function(result) {
            console.log(result);
        if(result.data == 403){
                    $location.path('/login');
                }
        else if(angular.isUndefined(result.data.success)){
            $scope.error = true;           
            $scope.load = true;
            $scope.error_text = result.data.error;
        }
        else{
            $scope.error = false;
            $scope.total_count = result.data.success[1].total_count;
            $scope.total_pages = (parseInt($scope.total_count / $scope.params.num_of_records)) + 1;
            $scope.pages = tableService.page_array($scope.total_pages);
            $scope.headers = [{key:'webinar_post_id',value:'ID', type:'number', sort:false},{key:'title',value:'Webinar Title', type:'string', sort:true},                
                {key:'scheduled_on',value:'Scheduled On', type:'string', sort:true}];
            $scope.data = result.data.success[0].list;
            $scope.csv = tableService.convert_to_csv(result.data.success[0].list,'Webinars', true);
            angular.forEach($scope.data, function(item, index) {
                item.scheduled_on = $filter('date')(new Date(item.scheduled_on),'mediumDate');
                item.title = $sce.trustAsHtml('<a class="cursor" href="webinars/view/'+item.webinar_post_id+'">'+item.title+'</a>');                
                });
            $scope.load = true;
        }        
    });
    
    };
    
    $scope.addItem = function() {        
        $location.path('webinars/view/@');
    };
    
    $scope.next = function(){
        if($scope.page_number !== $scope.total_pages){
            $scope.page_number = $scope.page_number + 1;
            $scope.params.row_index = (($scope.page_number - 1) * $scope.params.num_of_records) + 1;
            $scope.init();
        }
    };
    
    $scope.previous = function(){
        if($scope.page_number !== 1){
            $scope.page_number = $scope.page_number - 1;
            $scope.params.row_index = (($scope.page_number - 1) * $scope.params.num_of_records) + 1;
            $scope.init();
        }
    };
    
    $scope.last = function(){
        if($scope.page_number !== $scope.total_pages){
            $scope.page_number = $scope.total_pages;
            $scope.params.row_index = (($scope.page_number - 1) * $scope.params.num_of_records) + 1;
            $scope.init();
        }
    };
    
    $scope.first = function(){
        if($scope.page_number !== 1){
            $scope.page_number = 1;
            $scope.params.row_index = 1;
            $scope.init();
        }
    };
    
    $scope.seek = function(){
        $scope.params.row_index = (($scope.page_number - 1) * $scope.params.num_of_records) + 1;
        $scope.init();
    };
    
    $scope.pageSizeChanged = function(){
        if(((($scope.page_number - 1) * $scope.params.num_of_records) + 1) > $scope.total_count)
            $scope.page_number = (parseInt($scope.total_count / $scope.params.num_of_records)) + 1;
        $scope.params.row_index = (($scope.page_number - 1) * $scope.params.num_of_records) + 1;
        $scope.init();
    };
    
    $scope.search = function(){
        $scope.data = [];
        $scope.params.search_param = $scope.search_text;
        $scope.init();
    };
    
    $scope.sort = function(item,sort){
        if(sort){
        if($scope.params.sort_param === item){
            if($scope.params.sort_type === 'asc')
                $scope.params.sort_type = 'desc';
            else
                $scope.params.sort_type = 'asc';
        }
        else{
            $scope.params.sort_param = item;
            $scope.params.sort_type = 'asc';
        }
        $scope.init();
    }
    };
    
    $scope.init();
});