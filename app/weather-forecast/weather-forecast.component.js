// Register the  component on the  module,
angular.
	module('weatherForecast').
	component('weatherForecast', {  
		templateUrl: 'weather-forecast/weather-forecast.template.html',
		controller: function WeatherForecastController($http,$scope,$interval) {
			var self = this;
			$scope.Math = window.Math;
			$scope.loadData = function() {
				$http.get('/weather_forecast').then(function(response) {
					self.forecast = response.data;
				});
			}
			$scope.loadData();
			$scope.promise = $interval($scope.loadData, 600000);
			$scope.$on('$destroy', function() {
				$interval.cancel($scope.promise);
			});
    	}
	});
