// Register the  component on the  module,
angular.
	module('scheduleList').
	component('scheduleList', {  
		templateUrl: 'schedule-list/schedule-list.template.html',
		controller: ['$http','$scope','Schedule','ScheduleStatus',
		function ScheduleListController($http,$scope,Schedule,ScheduleStatus) {
			var self=this;
			self.schedule = Schedule.query();
			self.schedule_status = ScheduleStatus.get();
			$scope.navigate = function(period){
				if(period=='new') 
					scheduleId = 'new';
				else
					scheduleId = period.scheduleId;
				window.location='#!/schedule-detail/'+window.encodeURIComponent(scheduleId);
			}
			$scope.set_schedule = function(value){
				self.schedule_status.schedule_status=value;
				self.schedule_status.$save();
			}
    	}]
	});
