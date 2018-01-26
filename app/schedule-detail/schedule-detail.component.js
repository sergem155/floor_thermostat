// Register the  component on the  module,
angular.
	module('scheduleDetail').
	component('scheduleDetail', {  
		templateUrl: 'schedule-detail/schedule-detail.template.html',
		controller: ['$http','$scope','Schedule','$routeParams',function ScheduleDetailController($http,$scope,Schedule,$routeParams) {
			var self=this;
			self.scheduleItem = Schedule.get({scheduleId: $routeParams.scheduleId});
			//$scope.Math = window.Math;
			$scope.update = function(item,label,timeunit,meridiem){
				if(label=='from'){
					if(timeunit=='minute'){
						self.scheduleItem.minute1=item;
					}else{
						self.scheduleItem.hour1=$scope.hour1224(item,meridiem);
					}
				}else{ // until
					if(timeunit=='minute'){
						self.scheduleItem.minute2=item;
					}else{
						self.scheduleItem.hour2==$scope.hour1224(item,meridiem);
					}
				}
			}
			$scope.hour2412 = function(hour){
				if(hour==0)
					return 12;
				else if(hour>12)
					return hour-12; 
			}
			$scope.hour1224 = function(hour,ampm){
				if(ampm=='am')
					if(hour==12)
						return 0;
					else
						return hour;
				else
					return (hour+12) % 24;
			}
    	}]
	});
