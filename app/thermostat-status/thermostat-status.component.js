// Register the  component on the  module,
angular.
	module('thermostatStatus').
	component('thermostatStatus', {  
		templateUrl: 'thermostat-status/thermostat-status.template.html',
		controller: ['$http','$scope','$interval','Thermostat',function ThermostatStatusController($http,$scope,$interval,Thermostat) {
			var self=this;
			$scope.loadData = function () {
				self.thermostat = Thermostat.get();
			};
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
