"use strict";
app.controller("applicationController", function($scope, $http, $location, locationService, toaster, tableService, $q, $interpolate, $sce, $filter) {
    $scope.header = "Application";
    $scope.load = false;
    $scope.params = {service_name: '',search_param: '', opportunity_id: '', status: '', sort_param: 'submitted_on', sort_type: 'desc', row_index: 1, num_of_records: 20};
    $scope.headers = [];
    $scope.data = [];
    $scope.pages = [];    
    $scope.search_text = '';
    $scope.csv = '';
    $scope.records = [10, 20, 50];
    $scope.page_number = 1;
    $scope.total_count = 0;
    $scope.total_pages = 0;
    $scope.filter = {all: true, prelim_draft: false, prelim_submitted: false, final_submitted: false};
    
    $scope.preInit = function(){
        $scope.params.service_name = 'GET_REPORT_ALL_APPLICATION_LIST';
        $scope.params.values = {};
        var temp = locationService.fetch_data($scope.params);
        temp.then(function(result){
            $scope.csv = tableService.convert_to_csv(result.data.success,'Applications', true);
        });
        $scope.init();
    };

    $scope.init = function() {
        console.log($scope.params);
        var request = $scope.params;
        request.service_name = 'GET_ALL_APPLICATION_LIST';
        var temp = tableService.get_data(request);
        temp.then(function(result) {
            console.log(result);
        if(result.data == 403){
                    $location.path('/login');
                }
        else if(angular.isUndefined(result.data.success)){
            
        }
        else{
            $scope.total_count = result.data.success[0].total_count;
            $scope.total_pages = (parseInt($scope.total_count / $scope.params.num_of_records)) + 1;
            $scope.pages = tableService.page_array($scope.total_pages);
            $scope.headers = [{key:'submitted_on',value:'Submitted on', type:'date', sort:true},{key:'opportunity_name',value:'Opportunity Name', type:'string', sort:true},
                {key:'innovation_name',value:'Application Name', type:'string', sort:true}, {key:'innovation_id',value:'Innovation ID', type:'number', sort:false},
                {key:'application_status',value:'Application Status', type:'string', sort:true}, {key:'pa_name',value:'Principal Applicant', type:'string', sort:true},
                {key:'pa_email',value:'Principal Applicant Email', type:'string', sort:false}, {key:'team_size',value:'Team Size', type:'number', sort:false}];
            $scope.data = result.data.success[1].application_list;
            //$scope.csv = tableService.convert_to_csv($scope.data,'Users', true);
            angular.forEach($scope.data, function(item, index) {
                item.submitted_on = item.submitted_on === '' ? '' : $filter('date')(new Date(item.submitted_on),'mediumDate');
                item.innovation_name = $sce.trustAsHtml('<a class="cursor" href="/camtech_admin/application/'+item.application_id+'" target="_blank">'+item.innovation_name+'</a>');                
                });
                var params = {};
                params.service_name = 'GET_OPEN_OPPORTUNITY_LIST';
                params.values = '';
                var temp = tableService.get_data(params);
                temp.then(function(result){
                    console.log(result.data);
                    $scope.opportunity_list = result.data.success;
                    console.log($scope.opportunity_list);
                });                
            $scope.load = true;
        }
    });
    
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
        $scope.params.opportunity_id = item.opportunity_id;        
        $scope.init();
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
    
    $scope.filterOpp = function(){
        console.log('filter');
        $scope.init();
    };
    
    $scope.filterClick = function(item){        
        if (item === 'All')
            $scope.filter = {all: true, prelim_draft: false, prelim_submitted: false, final_submitted: false};
        if (item === 'Prelim-Draft')
            $scope.filter = {all: false, prelim_draft: true, prelim_submitted: false, final_submitted: false};            
        if (item === 'Prelim-Submitted')
            $scope.filter = {all: false, prelim_draft: false, prelim_submitted: true, final_submitted: false};            
        if (item === 'Final-Submitted')
            $scope.filter = {all: false, prelim_draft: false, prelim_submitted: false, final_submitted: true};
        $scope.params.status = item;
        
        /*for (var property in $scope.filter) {
          if ($scope.filter.hasOwnProperty(property)) {
              if($scope.filter[property]){
                  if (property === 'all')
                        property = 'All';
                      if (property === 'prelim_draft')
                        property = 'Prelim-Draft';
                      if (property === 'prelim_submitted')
                        property = 'Prelim-Submitted';
                      if (property === 'final_submitted')
                        property = 'Final-Submitted';
                      $scope.params.status = property;                  
              }
          }
      }*/
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