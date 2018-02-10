angular.
	module('core').
	factory('ScheduleStatus', ['$resource',
		function($resource) {
			return $resource('/api/schedule-status.php');
		}
	]);
