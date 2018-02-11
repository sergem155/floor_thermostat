// Register the  component on the  module,
angular.
	module('scheduleDetail').
	component('scheduleDetail', {  
		templateUrl: 'schedule-detail/schedule-detail.template.html',
		controller: ['$http','$scope','Schedule','$routeParams',function ScheduleDetailController($http,$scope,Schedule,$routeParams) {
			var self=this;
			self.day_names=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
			if($routeParams.scheduleId=='new')
				self.scheduleItem = {"minute1":0,"hour1":19,"temp1":82,"minute2":45,"hour2":23,"temp2":41,"days":["0","1","2","3","4","5","6"],"scheduleId":"new"};
			else
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
						console.log(self.scheduleItem.hour2);
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
			$scope.toggle = function(day){
				if(self.scheduleItem.days.indexOf(''+day)==-1)
					self.scheduleItem.days.push(''+day);
				else
					self.scheduleItem.days.splice(self.scheduleItem.days.indexOf(''+day),1);
			}
			$scope.save = function(){
				Schedule.save(self.scheduleItem,function(response){
						window.location='#!/schedule-list';
				});
			}
			$scope.delete = function(){
				Schedule.delete(self.scheduleItem,function(response){
						window.location='#!/schedule-list';
				});
			}
    	}]
	});
