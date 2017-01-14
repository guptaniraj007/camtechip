
/*######################*********************#############################
  
 Created by: Niraj Gupta

 ######################*********************##############################*/

var app = angular.module('CamtechAdmin', ['ngRoute', 'ngResource', 'ngSanitize', 'ngAnimate', 'ngCookies', 'ui.bootstrap', 'toaster', 'chieffancypants.loadingBar', 'textAngular', 'highcharts-ng']);

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('changeFile', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

app.directive('errSrc', function() {
    "use strict";
    return {
        link: function(scope, element, attrs) {
            element.bind('error', function() {
                if (attrs.src !== attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                }
            });
            attrs.$observe('ngSrc', function(value) {
                if (!value && attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                }
            });
        }
    };
});

app.directive('jqdatepicker', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
         link: function (scope, element, attrs, ngModelCtrl) {
            element.datepicker({
                dateFormat: 'dd-mm-yy',
                onSelect: function (date) {
                    scope.date = date;
                    scope.$apply();
                }
            });
        }
    };
});

app.directive('noCacheSrc', function($window) {
  return {
    priority: 99,
    link: function(scope, element, attrs) {
      attrs.$observe('noCacheSrc', function(noCacheSrc) {
        noCacheSrc += '?q=' + (new Date()).getTime();
        attrs.$set('src', noCacheSrc);
      });
    }
  };
});

app.config(function ($routeProvider,$locationProvider, $compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|data):/);
        
    $routeProvider.when("/", {
        controller: "dashboardController",
        templateUrl: "app/dashboard/dashboard.html"
    });
    
    $routeProvider.when("/dashboard", {
        controller: "dashboardController",
        templateUrl: "app/dashboard/dashboard.html"
    });

    $routeProvider.when("/slider", {
        controller: "sliderController",
        templateUrl: "app/slider/slider.html"
    });

    $routeProvider.when("/innovation", {
        controller: "innovationController",
        templateUrl: "app/innovation/innovation.html"
    });

    $routeProvider.when("/innovator", {
        controller: "innovatorController",
        templateUrl: "app/innovator/innovator.html"
    });
    
    $routeProvider.when("/expert", {
        controller: "expertController",
        templateUrl: "app/expert/expert.html"
    });
    
    $routeProvider.when("/reviewer", {
        controller: "reviewerController",
        templateUrl: "app/reviewer/reviewer.html"
    });
    
    $routeProvider.when("/user", {
        controller: "userController",
        templateUrl: "app/user/user.html"
    });
    
    $routeProvider.when("/user/:userId", {
        controller: "userEditController",
        templateUrl: "app/user/userEdit.html"
    });
    
    $routeProvider.when("/user/reviewer/:userId", {
        controller: "userReviewerController",
        templateUrl: "app/user/userReviewer.html"
    });
    
    $routeProvider.when("/user/expertise/:userId", {
        controller: "userExpertiseController",
        templateUrl: "app/user/userExpertise.html"
    });
    $routeProvider.when("/password", {
        controller: "passwordController",
        templateUrl: "app/password/password.html"
    });
    
    $routeProvider.when("/opportunity", {
        controller: "opportunityController",
        templateUrl: "app/opportunity/opportunity.html"
    });
    
    $routeProvider.when("/opportunity/edit/:opportunityId/:maxId", {
        controller: "opportunityEditController",
        templateUrl: "app/opportunity/opportunityEdit.html"
    });
    
    $routeProvider.when("/opportunity/assign/:opportunity_id?", {
        controller: "opportunityAssignController",
        templateUrl: "app/opportunity/opportunityAssign.html"
    });
    
    $routeProvider.when("/innovation/list", {
        controller: "innovationListController",
        templateUrl: "app/innovation/innovationList.html"
    });
    
    $routeProvider.when("/application/assign/:opportunity_id?", {
        controller: "opportunityAssignListController",
        templateUrl: "app/opportunity/opportunityAssignList.html"
    });
    
    $routeProvider.when("/application/:application_id", {
        controller: "applicationDetailController",
        templateUrl: "app/application/detail.html"
    });
    
    $routeProvider.when("/application/assign/:opportunityId/:application_id", {
        controller: "applicationAssignController",
        templateUrl: "app/opportunity/applicationAssign.html"
    });
    
    $routeProvider.when("/application", {
        controller: "applicationController",
        templateUrl: "app/application/application.html"
    });
    
    $routeProvider.when("/jobs", {
        controller: "jobsController",
        templateUrl: "app/jobs/jobs.html"
    });
    
    $routeProvider.when("/jobs/view/:jobId", {
        controller: "jobViewController",
        templateUrl: "app/jobs/view.html"
    });
    
    $routeProvider.when("/jobs/reject/:jobId", {
        controller: "jobRejectController",
        templateUrl: "app/jobs/reject.html"
    });
    
    $routeProvider.when("/marketplace", {
        controller: "marketplaceController",
        templateUrl: "app/marketplace/marketplace.html"
    });
    
    $routeProvider.when("/marketplace/view/:marketplaceId", {
        controller: "marketplaceViewController",
        templateUrl: "app/marketplace/view.html"
    });
    
    $routeProvider.when("/marketplace/reject/:marketplaceId", {
        controller: "marketplaceRejectController",
        templateUrl: "app/marketplace/reject.html"
    });
    
    $routeProvider.when("/marketplace/spotlight", {
        controller: "marketplaceSpotlightController",
        templateUrl: "app/marketplace/spotlight.html"
    });
    
    $routeProvider.when("/webinars", {
        controller: "webinarsController",
        templateUrl: "app/webinars/webinars.html"
    });
    
    $routeProvider.when("/webinars/view/:webinarId", {
        controller: "webinarViewController",
        templateUrl: "app/webinars/view.html"
    });
    
    $routeProvider.when("/opportunity/winners", {
        controller: "opportunityWinnerController",
        templateUrl: "app/opportunity/winner.html"
    });
    
    $routeProvider.when("/review/:reviewId", {
        controller: "reviewController",
        templateUrl: "app/opportunity/review.html"
    });
    
    $routeProvider.when("/reports", {
        controller: "reportsController",
        templateUrl: "app/reports/reports.html"
    });
    
    $routeProvider.when("/usage/innovation", {
        controller: "usageInnovationController",
        templateUrl: "app/usage/innovation.html"
    });
    
    $routeProvider.when("/usage/user", {
        controller: "usageUserController",
        templateUrl: "app/usage/user.html"
    });
    
    $routeProvider.when("/usage/team", {
        controller: "usageTeamController",
        templateUrl: "app/usage/team.html"
    });
    
    $routeProvider.when("/lattice", {
        controller: "latticeController",
        templateUrl: "app/lattice/lattice.html"
    });
    
    $routeProvider.when("/login", {
        controller: "loginController",
        templateUrl: "app/login/login.html"
    });
    
    

    $routeProvider.otherwise({ redirectTo: "/login" });
    $locationProvider.html5Mode(true);
    

});