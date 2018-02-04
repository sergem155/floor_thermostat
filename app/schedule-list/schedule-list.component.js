// Register the  component on the  module,
angular.
	module('scheduleList').
	component('scheduleList', {  
		templateUrl: 'schedule-list/schedule-list.template.html',
		controller: ['$http','$scope','Schedule',function ScheduleListController($http,$scope,Schedule) {
			var self=this;
			self.schedule = Schedule.query();
			$scope.navigate = function(period){
				if(period=='new') 
					scheduleId = 'new';
				else
					scheduleId = period.scheduleId
				window.location='#!/schedule-detail/'+window.encodeURIComponent(scheduleId);
			}
    	}]
	});
