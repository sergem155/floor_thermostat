// Define the app module
angular.module('thermostatApp', [
  // ...which depends on the module:
  'weatherForecast','weatherCurrent','thermostatStatus','core','scheduleList','scheduleDetail','timeInput','ngRoute'
]).controller('TimeCtrl', function($scope, $interval) { // simple clock controller
	var tick = function() {
		$scope.clock = Date.now();
	}
	tick();
	$scope.promise = $interval(tick, 1000);
	$scope.$on('$destroy', function() {
		$interval.cancel($scope.promise);
	});
});
