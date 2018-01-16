// Register the  component on the  module,
angular.
	module('weatherCurrent').
	component('weatherCurrent', {  
		templateUrl: 'weather-current/weather-current.template.html',
		controller: function WeatherCurrentController($http,$scope,$interval) {
			var self = this;
			$scope.Math = window.Math;
			$scope.loadData = function() {
				$http.get('/weather_current').then(function(response) {
					self.weather = response.data;
				});
			}
			$scope.loadData();
			$scope.promise = $interval($scope.loadData, 600000);
			$scope.$on('$destroy', function() {
				$interval.cancel($scope.promise);
			});
    	}
	});
