// Register the  component on the  module,
angular.
	module('timeInput').
	component('timeInput', {  
		templateUrl: 'time-input/time-input.template.html',
		bindings: {
			hour: '@',
			minute: '@',
			meridiem: '@',
			label: '@'
		},
		controller: ['$scope',function TimeInputController($scope) {
			var self=this;
			//self.scheduleItem = Schedule.get({scheduleId: $routeParams.scheduleId});
			$scope.Math = window.Math;

			$scope.setMinute = function(minute){
				$scope.$parent.update(minute,self.label,'minute',self.meridiem);
			}

			$scope.setHour = function(hour){
				$scope.$parent.update(hour,self.label,'hour',self.meridiem);
			}

			$scope.setMeridiem = function(meridiem){
				$scope.$parent.update(meridiem,self.label,'meridiem',self.meridiem);
			}

    	}]
	});
