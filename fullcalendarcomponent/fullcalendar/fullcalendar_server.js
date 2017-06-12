/**
 * TODO can be reused also on client side and on element side ?
 * @enum
 * */
var EVENTSOURCE_TYPE = {
	FUNCTION_SOURCE: "FunctionEventSourceType",
	ARRAY_SOURCE: 'ArrayEventSourceType',
	GCALENDAR_SOURCE: 'GoogleCalendarEventSourceType'
}

/**
 * return the type of eventSource
 * @private
 * @return {String}
 *  */
function getEventSourceType(eventSource) {
	// this is a workaround for object issue in 8.0.3
	var events
	var googleCalendarId
	if (eventSource instanceof java.util.HashMap) {
		events = eventSource.get("events");
		googleCalendarId = eventSource.get("googleCalendarId");
	} else {
		events = eventSource.events;
		googleCalendarId = eventSource.googleCalendarId;
	}
	
	// console.log(typeof(events));
	
	if (events instanceof Function) { // remove it from function eventSources
		return EVENTSOURCE_TYPE.FUNCTION_SOURCE;
	} else if (events instanceof Array) {
		return EVENTSOURCE_TYPE.ARRAY_SOURCE
	} else if (googleCalendarId instanceof String) {
		return EVENTSOURCE_TYPE.GCALENDAR_SOURCE
	} else {
		// is not a valid resource
		return null;
	}
}

/**
 * Finds the eventSource with the given id in the list of event sources
 * @param {Array<Object>} eventSources
 * @param {Object} id
 * @private
 *
 * @return {Number}
 * */
function getEventSourceIndexById(eventSources, id) {
	if (eventSources && eventSources.length) {
		for (var i = 0; i < eventSources.length; i++) {
			var source = eventSources[i];
			
			// this is a workaround for object issue in 8.0.3
			if (source instanceof java.util.HashMap) {
				if (source.containsValue && source.containsValue(id)) {
					return i;
				}
			} else if (source.id && source.id === id) {
				return i;
			}
		}
	}
	return null;
}

/**
 * @param {Object} options
 * @param {Boolean} renderOnCurrentView
 *
 * Initialize the fullcalendar with the config options.
 * If the calendar has been already initialized and any of the config options has been modified, the calendar
 * will be destroyed and re-init again.
 *
 * */
$scope.api.fullCalendar = function(options, renderOnCurrentView) {

	var copy;
	var functionEventSources = [];
	var arrayEventSources = [];
	var gcalEventSources = [];

	// parse event sources
	if (options) {
		copy = { }
		for (var property in options) {
			if (property == "eventSources") {
				var eventSources = options[property];
				if (eventSources instanceof Array) {
					for (var i = 0; i < eventSources.length; i++) {
						var eventSource = eventSources[i];
						switch (getEventSourceType(eventSource)) {
						case EVENTSOURCE_TYPE.FUNCTION_SOURCE:
							functionEventSources.push(eventSource);
							break;
						case EVENTSOURCE_TYPE.ARRAY_SOURCE:
							arrayEventSources.push(eventSource);
							break;
						case EVENTSOURCE_TYPE.GCALENDAR_SOURCE:
							gcalEventSources.push(eventSource);
							break;
						default:
							throw "Wrong events " + eventSource.events + " provided in eventSources.\nevents should be of type Function, Array<EventType> or URL feed.";
						}
					}
				} else {
					throw "Wrong eventSources provided\neventSources should be of type Array.";
				}
			}
			
			// copy property
			copy[property] = options[property];
		}
	}
	// update model properties;
	$scope.model.calendarOptions = copy;
	$scope.model.functionEventSources = functionEventSources;
	$scope.model.arrayEventSources = arrayEventSources;
	$scope.model.gcalEventSources = gcalEventSources;
	$scope.model.hasToDraw = true;
	$scope.model.renderOnCurrentView = renderOnCurrentView;
}

// TODO this gives an error in 8.0.3
/**
 * Returns the calendar config object
 *
 * @return {svy-fullcalendar.FullCalendarOptions}
 * */
$scope.api.getFullCalendarOptions = function() {
	if ($scope.model.calendarOptions) {
		return $scope.model.calendarOptions//.options;
	} else {
		return null;
	}
}

/**
 * @param {Object} eventSource
 *
 * */
$scope.api.addEventSource = function(eventSource) {
	if (!eventSource) {
		throw "Illegal argument eventSource " + eventSource;
	}
	
	// push eventSource into the typed eventSource
	switch (getEventSourceType(eventSource)) {
	case EVENTSOURCE_TYPE.FUNCTION_SOURCE:
		$scope.model.functionEventSources.push(eventSource);
		break;
	case EVENTSOURCE_TYPE.ARRAY_SOURCE:
		$scope.model.arrayEventSources.push(eventSource);
		break;
	case EVENTSOURCE_TYPE.GCALENDAR_SOURCE:
		$scope.model.gcalEventSources.push(eventSource);
		break;
	default:
		throw "Wrong events " + eventSource.events + " provided in eventSources.\nevents should be of type Function, Array<EventType> or URL feed.";
	}
	
	// push eventSource in options object
	var options = $scope.api.getFullCalendarOptions();
	if (!options) {	// option was undefined
		throw "Illegal State calendarOptions is undefined";
	} else {	
		if (options.eventSources) {	// eventSource was already existing
			options.eventSources.push(eventSource);
		} else {	// eventSource was undefined
			options.eventSources = [eventSource];
		}
	}
}

/**
 * @param {Object} id
 * */
$scope.removeEventSource = function(id) {
	if (!id && id!= 0) {
		throw "Illegal argument id " + id;
	}
	
	var options = $scope.api.getFullCalendarOptions();
	if (options && options.eventSources && options.eventSources.length) {

		/** @type {Array} */
		var eventSources = options.eventSources;

		// find eventSource index
		var index = getEventSourceIndexById(eventSources, id);
		var indexTyped;
		var eventSource = eventSources[index];
		if (eventSource) {
			
			// remove eventSource from typed objects
			switch (getEventSourceType(eventSource)) {
			case EVENTSOURCE_TYPE.FUNCTION_SOURCE:
				indexTyped = getEventSourceIndexById($scope.model.functionEventSources, id);
				$scope.model.functionEventSources.splice(indexTyped,1)
				break;
			case EVENTSOURCE_TYPE.ARRAY_SOURCE:
				indexTyped = getEventSourceIndexById($scope.model.arrayEventSources, id);
				$scope.model.arrayEventSources.splice(indexTyped,1)
				break;
			case EVENTSOURCE_TYPE.GCALENDAR_SOURCE:
				indexTyped = getEventSourceIndexById($scope.model.gcalEventSources, id);
				$scope.model.gcalEventSources.splice(indexTyped,1)
				break;
			default:
				throw "Wrong events " + eventSource.events + " provided in eventSources.\nevents should be of type Function, Array<EventType> or URL feed.";
			}

			// remove eventSource from model
			eventSources.splice(index, 1);
			return true;
		}
	} else {
		console.log('can\'t remove eventSources from options');
	}
	return false;
}

/**
 * @param {Object} resource
 *
 * @return {Boolean}
 * */
$scope.api.addResource = function(resource) {
	if (!resource) {
		throw "Illegal argument resource " + resource;
	}
	
	// push resource in options object
	var options = $scope.api.getFullCalendarOptions();
	if (!options) {	// option was undefined
		throw "Illegal State calendarOptions is undefined";
	} else {	
		if (options.resources) {	// resource was already existing
			options.resources.push(resource);
		} else {	// resource was undefined
			options.resources = [resource];
		}
	}
	return true;
}

/**
 * @param {Object} id
 * 
 * @return {Boolean}
 *
 * */
$scope.removeResource = function(id) {
	if (!id && id!= 0) {
		throw "Illegal argument id " + id;
	}
	
	var options = $scope.api.getFullCalendarOptions();
	if (options && options.resources && options.resources.length) {
		/** @type {Array} */
		var resources = options.resources;
		
		var index = getEventSourceIndexById(resources, id);
		if (index || index === 0) {
			$scope.model.calendarOptions.resources.splice(index, 1);
			return true;
		}
	} else {
		console.log('can\'t remove resource from options');
	}
	return false;
}