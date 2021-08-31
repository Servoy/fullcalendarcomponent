/*
 * README
 *
 * This forms demonstrate how to use the Resource View of the calendar.
 * Such implementation is based on the Fullcalendar Scheduler plugin (https://fullcalendar.io/scheduler/) which is not licensed under MIT.
 * Therefore the Scheduler plugin is not included in this open sourced project but should be included manually once a proper Scheduler License is purchased (see https://fullcalendar.io/scheduler/license/).
 *
 * */

/**
 * @param {JSEvent} event
 * @protected
 * @override
 *
 * @properties={typeid:24,uuid:"D461E7D3-28FA-4A06-817F-8E172D7FB4DF"}
 */
function onLoad(event) {
	var fullCalendar = scopes.svyFullCalendar;
	calendar = elements.fullcalendar_1;

	// init the configuration Menu
	initConfigMenu();

	// create resource objects to be used for scheduler view.
	/** @type {Array<svy-fullcalendar.ResourceType>} */
	var resources = getActiveResources();

	/** @type {Array<svy-fullcalendar.EventSourceType>} */
	var eventSources = [];

	// create an event source for any db resource
	eventSources = eventSources.concat(getActiveEventSources());

	// create an event source wich is going to load all events not linked to resource from db
	eventSources.push(resourceNullEventSource);

	// create eventSource with statics events
	eventSources.push(evnts1);
	eventSources.push(evnts2);

	// add the calendar feed as eventSource
	if (GOOGLE_API_KEY) {
		//	eventSources.push(googleCalendarFeed);
	} else {
		log.warn('Set the GOOGLE_API_KEY to feed events from Google calendar')
	}

	// get i18n text for dayNameShort
	var dayNamesShort = [];
	dayNamesShort.push(i18n.getI18NMessage("fullcalendar.day.short.sunday"));
	dayNamesShort.push(i18n.getI18NMessage("fullcalendar.day.short.monday"));
	dayNamesShort.push(i18n.getI18NMessage("fullcalendar.day.short.tuesday"));
	dayNamesShort.push(i18n.getI18NMessage("fullcalendar.day.short.wednsday"));
	dayNamesShort.push(i18n.getI18NMessage("fullcalendar.day.short.thursday"));
	dayNamesShort.push(i18n.getI18NMessage("fullcalendar.day.short.friday"));
	dayNamesShort.push(i18n.getI18NMessage("fullcalendar.day.short.saturday"));

	// init the calendar
	/** @type {svy-fullcalendar.FullCalendarOptions} */
	var options = {
		allDayText: '',
		lang: 'en',
		businessHours: {
			start: '09:00:00',
			end: '20:00:00',
			dow: [1, 2, 3, 4, 5, 6]
		},
		dayNamesShort: dayNamesShort,
		defaultDate: new Date(2016, 4, 1),
		defaultView: fullCalendar.CALENDAR_VIEW_TYPE.AGENDADAY,
		editable: true,
		eventSources: eventSources,
		eventConstraint: 'businessHours',
		firstDay: 1,
		handleWindowResize: true,
		header: {
			left: 'title',
			center: '',
			right: ''
		},
		minTime: "07:00:00",
		nowIndicator: true,
		//		timeFormat: {
		//			// for agendaWeek and agendaDay
		//			agenda: 'h:mm{- h:mm}',
		//			// for all other views
		//			'': 'h(:mm)t'
		//		},
		//		columnFormat: {
		//			month: 'ddd',
		//			week: 'ddd M/d',
		//			day: 'dddd M/d'
		//		},
		//		titleFormat: {
		//			month: 'MMMM yyyy',
		//			week: "MMMM yyyy}",
		//			day: 'dddd, MMM d, yyyy'
		//		},
		scrollTime: "8:00:00",
		selectable: true,
		selectConstraint: 'businessHours',
		weekends: true,
		resources: resources
	};

	// calendar.functionEventSources = functionEventSources;
	//calendar.eventSources = eventSources;
	calendar.fullCalendar(options);

	// second calendar for date selection
	elements.fullcalendarSelector.fullCalendar({
		firstDay: 1,
		selectable: false,
		editable: false,
		defaultView: fullCalendar.CALENDAR_VIEW_TYPE.MONTH,
		header: false,
		contentHeight: 'auto',
		aspectRatio: 2
	});
}

/**
 * Get all active resources
 *
 * @return {Array<svy-fullcalendar.ResourceType>}
 *
 * @properties={typeid:24,uuid:"FBAA5661-34FA-47EC-9456-293A11CE9196"}
 * @AllowToRunInFind
 * @private
 */
function getActiveResources() {
	var resources = [];
	/** @type {JSFoundSet<db:/fullcalendar/resources>} */
	var fs = databaseManager.getFoundSet('db:/fullcalendar/resources');
	fs.loadAllRecords();

	/* for each active resource in foundset create a ResourceType object.*/
	var record;
	for (var i = 1; i <= fs.getSize(); i++) {
		record = fs.getRecord(i);
		if (record.render_flag !== 0) {
			record.render_flag = 1;
			var resource = getResource(record);
			resources.push(resource);
		}
	}

	return resources;
}

/**
 * get the FunctionEventSource object for the given record
 *
 * @param {JSRecord<db:/fullcalendar/resources>} record
 * @protected
 *
 * @return {svy-fullcalendar.ResourceType}
 *
 * @properties={typeid:24,uuid:"6BEE9273-6BA0-45D4-BBC9-9AC704E48211"}
 */
function getResource(record) {
	if (!record) {
		throw new scopes.svyExceptions.IllegalArgumentException('illegal argument record NULL')
	}

	/** @type {svy-fullcalendar.ResourceType} */
	var resource = {
		id: record.resource_id.toString(),
		title: record.name,
		eventBackgroundColor: record.background_color
	}

	return resource;
}

/**
 * @param {JSRecord<db:/fullcalendar/event_object>} record
 * @return {svy-fullcalendar.EventType}
 * @override
 * @protected
 *
 * @properties={typeid:24,uuid:"0353CD5E-EE30-4B47-9A61-B6AB206036D5"}
 */
function getEvent(record) {
	var event = _super.getEvent(record);

	if (utils.hasRecords(record, "event_object_to_event_resources")) {
		// Used only for scheduler calendar
		event.resourceIds = getEventResources(record);
	}
	return event;
}

/**
 * Returns the array of resources linked to the event.
 * @param {JSRecord<db:/fullcalendar/event_object>} [record]
 * @private
 *
 * @return {Array<String>}
 * *
 * @properties={typeid:24,uuid:"C1CAE0BF-A4A8-4E41-AE29-E0EC02E1F164"}
 */
function getEventResources(record) {

	var resources = [];
	if (utils.hasRecords(record.event_object_to_event_resources) && record.event_object_to_event_resources.resource_id) {
		for (var i = 1; i <= record.event_object_to_event_resources.getSize(); i++) {
			var resourceRecord = record.event_object_to_event_resources.getRecord(i);
			resources.push(resourceRecord.resource_id.toString());
		}
	}

	return resources;
}

/**
 * @param {JSRecord<db:/fullcalendar/resources>} record
 * @override
 * @protected
 *
 * @properties={typeid:24,uuid:"0A7FC3A8-8F35-413A-85E5-01691FF3096C"}
 */
function onEventSourceAdd(record) {

	_super.onEventSourceAdd(record);

	var resource = getResource(record);
	calendar.addResource(resource);
	log.debug("add resource " + record.name);
}

/**
 * @param {JSRecord<db:/fullcalendar/resources>} record
 * @override
 * @protected
 *
 * @properties={typeid:24,uuid:"D01941B5-DD5D-4BB7-A27E-2B15F595DA9F"}
 */
function onEventSourceRemove(record) {
	_super.onEventSourceRemove(record);
	calendar.removeResource(record.resource_id.toString());
	log.debug("remove resource " + record.name);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @override
 *
 * @properties={typeid:24,uuid:"52A74449-DF61-44B5-A3D4-28CFA9EE8C2C"}
 */
function agendaDay(event) {
	calendar.changeView(scopes.svyFullCalendar.CALENDAR_VIEW_TYPE.AGENDADAY);
	updateUI(event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @override
 *
 * @properties={typeid:24,uuid:"CF1D1BBC-0281-47FB-916D-CFFD3350C252"}
 */
function agendaWeek(event) {
	calendar.changeView(scopes.svyFullCalendar.CALENDAR_VIEW_TYPE.TIMELINE_WEEK);
	updateUI(event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @override
 *
 * @properties={typeid:24,uuid:"AED46CD5-5928-4AC1-ADF8-D520F6D27195"}
 */
function month(event) {
	calendar.changeView(scopes.svyFullCalendar.CALENDAR_VIEW_TYPE.TIMELINE_MONTH);
	updateUI(event);
}
