angular.
  module('thermostatApp').
  config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/thermostat', {
          template: '<thermostat-status></thermostat-status>'
        }).
        when('/schedule-list', {
          template: '<schedule-list></schedule-list>'
        }).
        when('/schedule-detail/:scheduleId', {
          template: '<schedule-detail></schedule-detail>'
        }).
        otherwise('/thermostat');
    }
  ]);
