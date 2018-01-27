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
					}else if (timeunit=='hour'){
						self.scheduleItem.hour1=$scope.hour1224(item,meridiem);
					}else{ // meridiem
						if(self.scheduleItem.hour1>11){ // to am
							self.scheduleItem.hour1-=12;
						}else{ // to pm
							self.scheduleItem.hour1+=12;	
						}
					}
				}else{ // until
					if(timeunit=='minute'){
						self.scheduleItem.minute2=item;
					}else if (timeunit=='hour'){
						self.scheduleItem.hour2=$scope.hour1224(item,meridiem);
					}else{ // meridiem
						if(self.scheduleItem.hour2>11){ // to am
							self.scheduleItem.hour2-=12;
						}else{ // to pm
							self.scheduleItem.hour2+=12;							
						}
					}
				}
			}
			$scope.hour2412 = function(hour){
				if(hour==0)
					return 12;
				if(hour>12)
					return hour-12;
				return hour; 
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
