// Register the  component on the  module,
angular.
	module('scheduleList').
	component('scheduleList', {  
		templateUrl: 'schedule-list/schedule-list.template.html',
		controller: ['$http','$scope','Schedule',function ScheduleListController($http,$scope,Schedule) {
			var self=this;
			self.schedule = Schedule.query();
			$scope.navigate = function(period){
				window.location='#!/schedule-detail/'+window.encodeURIComponent(period.key);
			}
    	}]
	});
