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
    	}]
	});
