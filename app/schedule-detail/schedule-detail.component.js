// Register the  component on the  module,
angular.
	module('scheduleDetail').
	component('scheduleDetail', {  
		templateUrl: 'schedule-detail/schedule-detail.template.html',
		controller: ['$http','$scope','Schedule','$routeParams',function ScheduleListController($http,$scope,Schedule,$routeParams) {
			var self=this;
			self.scheduleItem = Schedule.get({scheduleId: $routeParams.scheduleId});
    	}]
	});
