// Register the  component on the  module,
angular.
	module('thermostatStatus').
	component('thermostatStatus', {  
		templateUrl: 'thermostat-status/thermostat-status.template.html',
		controller: ['$http','$scope','$interval','Thermostat','ScheduleStatus',function ThermostatStatusController($http,$scope,$interval,Thermostat,ScheduleStatus) {
			var self=this;
			$scope.loadData = function () {
				self.thermostat = Thermostat.get();
			};
			self.schedule_status = ScheduleStatus.get(); // changes on button, no need to refresh
			$scope.loadData();
			$scope.promise = $interval($scope.loadData, 10000);
			$scope.$on('$destroy', function() {
				$interval.cancel($scope.promise);
			});

			$scope.turn_on = function () {
				self.thermostat.set_temp=82;
				self.thermostat.$save();
			}

			$scope.turn_off = function () {
				self.thermostat.set_temp=41;
				self.thermostat.$save();
			}
    	}]
	});
