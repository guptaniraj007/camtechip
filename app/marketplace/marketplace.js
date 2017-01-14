"use strict";
app.controller("marketplaceController", function($scope, $http, $location, locationService, toaster, tableService, $q, $interpolate, $sce, $filter) {
    $scope.header = "Marketplace";
    $scope.load = false;
    $scope.params = {search_param: '', sort_param: 'updated_on', sort_type: 'desc', row_index: 1, num_of_records: '10'};
    $scope.headers = [];
    $scope.data = [];
    $scope.page_number = 1;
    $scope.total_count = 0;
    $scope.total_pages = 0;
    $scope.pages = [];
    $scope.records = ['10', '20', '50'];
    $scope.search_text = '';
    $scope.csv = '';
    $scope.error = false;
    $scope.filter = {all: true, cve: false, trc: false, innovator: false, expert: false};
    
    $scope.preInit = function(){
        $scope.params.service_name = 'GET_REPORT_ALL_MARKETPLACE';
        $scope.params.values = {};
        var temp = locationService.fetch_data($scope.params);
        temp.then(function(result){
            $scope.csv = tableService.convert_to_csv(result.data.success,'Marketplace', true);
        });
        $scope.init();
    };

    $scope.init = function() {
        console.log($scope.params);
        var request = $scope.params;
        request.row_index = request.row_index.toString();
        request.num_of_records = request.num_of_records.toString();
        request.service_name = 'GET_MARKETPLACE_LIST';
        var temp = tableService.get_data(request);
        temp.then(function(result) {
            console.log(result);
        if(result.data == 403){
                    $location.path('/login');
                }
        else if(angular.isUndefined(result.data.success) || result.data.success[1].total_count == 0){
            $scope.error = true;
            $scope.load = true;
        }
        else{
            $scope.total_count = result.data.success[1].total_count;
            $scope.total_pages = (parseInt($scope.total_count / $scope.params.num_of_records)) + 1;
            $scope.pages = tableService.page_array($scope.total_pages);
            $scope.headers = [{key:'marketplace_id',value:'ID', type:'number', sort:false},{key:'title',value:'Post Title', type:'string', sort:true},
                {key:'posted_by',value:'Contact Person', type:'string', sort:true},{key:'contact_email',value:'Contact email', type:'email', sort:true},
                {key:'status',value:'Status', type:'string', sort:true},{key:'category_name',value:'Category', type:'string', sort:false},
                {key:'updated_on',value:'Updated On', type:'date', sort:true}];
            $scope.data = result.data.success[0].list;
            
            angular.forEach($scope.data, function(item, index) {
                item.updated_on = $filter('date')(new Date(item.updated_on),'mediumDate');
                item.title = $sce.trustAsHtml('<a class="cursor" href="marketplace/view/'+item.marketplace_id+'">'+item.title+'</a>');                
                });
            $scope.load = true;
        }
    });
    
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
    
    $scope.preInit();
});