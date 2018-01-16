angular.
  module('thermostatApp').
  config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/thermostat', {
          template: '<div class="container-fluid">\
					<thermostat-status></thermostat-status>\
					<weather-current></weather-current>\
					<weather-forecast></weather-forecast>\
					</div>'
        }).
        when('/schedule-list', {
          template: '<schedule-list></schedule-list>'
        }).
        otherwise('/thermostat');
    }
  ]);
