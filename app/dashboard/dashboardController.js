"use strict";
app.controller("dashboardController", function($scope, $http, $location, locationService, toaster, $window) {
    $scope.header = "Dashboard";
    $scope.load = false;
    $scope.count = {users: 0, innovations: 0, ratings: 0, applications: 0};
    $scope.users = {};
    var params = {};
    $scope.frequency = {};
    $scope.user_data = {
        options: {
            chart: {
                type: 'column'
            },
            tooltip: {
                headerFormat: '<span style="font-size:12px"><b>{point.key}</b></span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' + '<td style="padding:0">{point.y:.f}</tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true,
                followPointer: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0,
                    borderWidth: 2
                }
            }
        },
        title: {
            text: 'Users'
        },
        xAxis: {
            categories: [],
            crosshair: true
        },
        yAxis: {
            title: {
                text: ''
            }
        },
        series: [{
                name: 'Users',
                data: [],
                color: '#428bca'
            }, {
                name: 'Experts',
                data: [],
                color: '#f0ad4e'
            }, {
                name: 'Innovators',
                data: [],
                color: '#5cb85c'
            }],
        loading: false
    };
    
    $scope.usage_data = {
        title: {
            text: 'Login frequency'            
        },
        options: {
            chart: {
                type: 'pie',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false

            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true,
                    colorByPoint: true
                }
            }
        },    
        series: [{
            type: 'pie',
            name: 'Ratings',
            colorByPoint: true,
            innerSize: '50%',
            data: [{
                name: 'One login',
                y: 0,
                color: '#428bca'
            }, {
                name: 'Two logins',
                color: '#f0ad4e',           
                y: 0
            }, {
                name: 'Three to five logins',
                color: '#5cb85c',
                y: 0
            }, {
                name: 'More than five logins',
                color: '#d9534f',
                y: 0
            }, {
                name: 'Zero logins',
                color: '#ddd',
                y: 0
            }]            
        }],
        loading: false
    };
    var data;
    $scope.init = function() {
        var logged_in = locationService.logged_in();
        logged_in.then(function(result) {
            if (result.data == 403) {
                $location.path('/login');
            }
            else {
                var users = {};
                users.service_name = 'GET_COUNT_OF_NEW_USERS';
                users.num_of_months = 1;
                users = locationService.get_dashboard(users);
                users.then(function(result) {
                    $scope.count.users = angular.isUndefined(result.data.count)?0:result.data.count;
                });
                var innovations = {};
                innovations.service_name = 'GET_COUNT_OF_NEW_INNOVATIONS';
                innovations.num_of_months = 1;
                innovations = locationService.get_dashboard(innovations);
                innovations.then(function(result) {
                    $scope.count.innovations = angular.isUndefined(result.data.count)?0:result.data.count;
                });
                var ratings = {};
                ratings.service_name = 'GET_COUNT_OF_NEW_RATINGS';
                ratings.num_of_months = 1;
                ratings = locationService.get_dashboard(ratings);
                ratings.then(function(result) {
                    $scope.count.ratings = angular.isUndefined(result.data.count)?0:result.data.count;
                });
                var applications = {};
                applications.service_name = 'GET_COUNT_OF_NEW_APPLICATIONS';
                applications.num_of_months = 1;
                applications = locationService.get_dashboard(applications);
                applications.then(function(result) {
                    $scope.count.applications = angular.isUndefined(result.data.count)?0:result.data.count;
                    console.log(result);
                });
                var dashboard = {};
                dashboard.service_name = 'GET_DASHBOARD_GRAPH_DATA';
                dashboard.num_of_months = 1;
                dashboard.values = {graph_param: '1year'};
                dashboard = locationService.fetch_data(dashboard);
                dashboard.then(function(result) {
                    result = result.data.success;
                    $scope.user_data.xAxis.categories = result.map(function(item) {
                        return item.date;
                    });
                    var graph = {};
                    graph.user = result.map(function(item) {
                        return angular.isUndefined(item.users) ? 0 : parseInt(item.users);
                    });
                    graph.innovator = result.map(function(item) {
                        return angular.isUndefined(item.experts) ? 0 : parseInt(item.experts);
                    });
                    graph.expert = result.map(function(item) {
                        return angular.isUndefined(item.innovators) ? 0 : parseInt(item.innovators);
                    });
                    console.log(graph);
                    $scope.user_data.series = [{
                            name: 'Users',
                            data: graph.user,
                            color: '#428bca'
                        }, {
                            name: 'Experts',
                            data: graph.innovator,
                            color: '#f0ad4e'
                        }, {
                            name: 'Innovators',
                            data: graph.expert,
                            color: '#5cb85c'
                        }];


                    console.log(result);
                    $scope.load = true;
                });
                var dashboard = {};
                dashboard.service_name = 'GET_DASHBOARD_PIE_CHART_DATA';
                dashboard.values = {};
                dashboard = locationService.fetch_data(dashboard);
                dashboard.then(function(result) {
                    result = result.data.success;
                    $scope.usage_data.series= [{
            type: 'pie',
            name: 'Ratings',
            colorByPoint: true,
            innerSize: '50%',
            data: [{
                name: 'One login',
                y: result.one_logins,
                color: '#428bca'
            }, {
                name: 'Two logins',
                color: '#f0ad4e',           
                y: result.two_logins
            }, {
                name: 'Three to five logins',
                color: '#5cb85c',
                y: result.three_to_five_logins
            }, {
                name: 'More than five logins',
                color: '#d9534f',
                y: result.five_plus_logins
            }, {
                name: 'Zero logins',
                color: '#ddd',
                y: result.zero_logins
            }]            
        }]
                    
                });
            }
        });



    };

    $scope.renderGraph = function(item) {
        var dashboard = {};
        dashboard.service_name = 'GET_DASHBOARD_GRAPH_DATA';
        dashboard.num_of_months = 1;
        dashboard.values = {graph_param: item};
        dashboard = locationService.fetch_data(dashboard);
        dashboard.then(function(result) {
            result = result.data.success;
            $scope.user_data.xAxis.categories = result.map(function(item) {
                return item.date;
            });
            var graph = {};
            graph.user = result.map(function(item) {
                return angular.isUndefined(item.users) ? 0 : parseInt(item.users);
            });
            graph.innovator = result.map(function(item) {
                return angular.isUndefined(item.experts) ? 0 : parseInt(item.experts);
            });
            graph.expert = result.map(function(item) {
                return angular.isUndefined(item.innovators) ? 0 : parseInt(item.innovators);
            });
            console.log(graph);
            $scope.user_data.series = [{
                    name: 'Users',
                    data: graph.user,
                    color: '#428bca'
                }, {
                    name: 'Experts',
                    data: graph.innovator,
                    color: '#f0ad4e'
                }, {
                    name: 'Innovators',
                    data: graph.expert,
                    color: '#5cb85c'
                }];


            console.log(result);
            $scope.load = true;
        });
    };
    $scope.init();
});