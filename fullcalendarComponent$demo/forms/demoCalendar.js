/**
 * @type {scopes.svyLogManager.Logger}
 * @protected 
 *
 * @properties={typeid:35,uuid:"D1E42303-9866-4099-AE76-F5F24315B2E0",variableType:-4}
 */
var log = scopes.svyLogManager.getLogger('com.servoy.ng.components.fullcalendar.demo');

/**
 * @type {plugins.window.Popup}
 * @private 
 *
 * @properties={typeid:35,uuid:"417B9652-C939-42F7-B575-E9B02370288D",variableType:-4}
 */
var configMenu;

/**
 * @type {String}
 * Google API key. Required to use Google Calendar feeds
 * @protected  
 *
 * @properties={typeid:35,uuid:"B9794034-5F69-46C2-B483-B388BB7799C7"}
 */
var GOOGLE_API_KEY;

/**
 * The calendar object
 * @protected 
 * *
 * @properties={typeid:35,uuid:"6C27B580-FCB0-4A1D-BE1E-03D3C105BA3B",variableType:-4}
 */
var calendar;

/**
 * @type {svy-fullcalendar.EventSourceType}
 * @protected 
 *
 * @properties={typeid:35,uuid:"78470515-071C-4417-AC4F-D2EBC983EFD4",variableType:-4}
 */
var resourceNullEventSource = {
	id: "0000-0000-0000-0000",
	events: resourceEventSourceCallback,
	textColor: 'black',
	backgroundColor: '#ffffff',
	editable: true,
	startEditable: true,
	durationEditable: true,
	allDayDefault: false
};

/**
 * Use google calendar feeds {@link http://fullcalendar.io/docs1/google_calendar/}
 *
 * Google API key is required. Obtain an API key from the google developer console {@link https://console.developers.google.com/project} and activate the google calendar API
 *
 * How to get the feed URL of a private calendar:
 *
 *  1. In the list of calendars on the left side of the page, find the calendar you want to interact with. You can create a new calendar for this purpose if you want to.
 *  2. Click the arrow button to the right of the calendar. Select "Calendar settings" from the drop-down menu. The Calendar Details page appears.
 *  3. Click "Share this Calendar", check "Make this calendar public" and make sure "Share only my free/busy information" is unchecked; save.
 *  4. In the "Calendar Address" section of the screen, you will see your Calendar ID. It will look something like "your.email@gmail.com"
 *
 *  @type {svy-fullcalendar.EventSourceType}
 *  @protected 
 *
 * @properties={typeid:35,uuid:"8084D574-8749-4B3D-8F28-6897A78D9F04",variableType:-4}
 */
var googleCalendarFeed = {
	id:'usa__en@holiday.calendar.google.com',
	googleCalendarApiKey: GOOGLE_API_KEY, // Your Google Developer API key
	googleCalendarId: 'usa__en@holiday.calendar.google.com', // Replace with YOUR_CALENDAR_ID you would like to feed
	backgroundColor: '#fff',
	borderColor: 'orange',
	textColor: 'orange',
	className: 'gcal-event'
};

/**
 * @type {Array<svy-fullcalendar.EventType>}
 * @protected 
 * @deprecated 
 *
 * @properties={typeid:35,uuid:"F8C4B11C-3C5D-4678-A271-28C0A3C0608E",variableType:-4}
 */
var evnts = [{
		title: "All day event",
		start: scopes.svyDateUtils.addDays(new Date(), -2),
		editable: true,
		rendering : 'background-inverse'

	}, {
		title: "2 day event",
		start: scopes.svyDateUtils.toStartOfDay(new Date()),
		end: new scopes.svyDateUtils.toEndOfDay(scopes.svyDateUtils.addDays(new Date(), 1)),
		allDay: true,
		editable: true
	}, {
		title: "lunch event",
		start: scopes.svyDateUtils.toStartOfDay(scopes.svyDateUtils.addHours(new Date(), 12)),
		end: scopes.svyDateUtils.toStartOfDay(scopes.svyDateUtils.addHours(new Date(), 13)),
		allDay: false,
		editable: true,
		rendering : 'background'
	}];

/**
 * @type {svy-fullcalendar.EventSourceType}
 * @protected 
 * 
 * @properties={typeid:35,uuid:"6CC006E9-E23B-4461-8251-15FA6739F37F",variableType:-4}
 */
var evnts1 = {
	id : "array1",
	events: [{
		title: "All day event",
		start: scopes.svyDateUtils.addDays(new Date(), -2),
		editable: true,
		rendering : 'background'
	}, {
		title: "2 day event",
		start: scopes.svyDateUtils.toStartOfDay(new Date()),
		end: new scopes.svyDateUtils.toEndOfDay(scopes.svyDateUtils.addDays(new Date(), 1)),
		allDay: true,
		editable: true
	}, {
		title: "lunch event",
		start: scopes.svyDateUtils.toStartOfDay(scopes.svyDateUtils.addHours(new Date(), 12)),
		end: scopes.svyDateUtils.toStartOfDay(scopes.svyDateUtils.addHours(new Date(), 13)),
		allDay: false,
		editable: true,
		rendering : 'background'
	}]
};

/**
 * @type {svy-fullcalendar.EventSourceType}
 * @protected 
 * 
 * @properties={typeid:35,uuid:"5EF3A4B8-A002-4F9D-9971-781623AA2F16",variableType:-4}
 */
var evnts2 = {
	id : "array2",
	events: [{
		title: "lunch event",
		start: scopes.svyDateUtils.toStartOfDay(scopes.svyDateUtils.addHours(new Date(), 12)),
		end: scopes.svyDateUtils.toStartOfDay(scopes.svyDateUtils.addHours(new Date(), 13)),
		allDay: false,
		editable: true
	}],
	color: 'gray'
};

/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"249A635F-D679-4136-B390-91D197B71089"}
 */
function onLoad(event) {
	/* 
	 * 3.5 Changes:
	 * Title Format from titleFormat {month, week, day} to month {}, week {}, day {}
	 * */
	
	var fullCalendar = scopes.svyFullCalendar;
	calendar = elements.fullcalendar_1;
	
	// init the configuration Menu
	initConfigMenu();

	// collect all eventSources
	/** @type {Array<svy-fullcalendar.EventSourceType>} */
	var eventSources = [];

	// create an event source for any db resource
	eventSources = eventSources.concat(getActiveEventSources());

	// create an event source wich is going to load all events not linked to resource from db
	eventSources.push(resourceNullEventSource);

	// create an eventSource with statics events
	eventSources.push(evnts1);
	eventSources.push(evnts2);

	// add the calendar feed as eventSource
	if (GOOGLE_API_KEY) {
		eventSources.push(googleCalendarFeed);
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
				dow: [1,2,3,4,5,6]
			},
//			columnFormat: {
//				month: 'ddd',
//				week: 'ddd M/D',
//				day: 'dddd M/D'
//			},
			dayNamesShort : dayNamesShort,
			defaultDate : new Date(2016, 4, 1),
			defaultView: fullCalendar.CALENDAR_VIEW_TYPE.AGENDAWEEK,
			editable: true,
			eventSources : eventSources,
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
			scrollTime: "8:00:00",
			selectable: true,
			selectConstraint: 'businessHours',
//			timeFormat: {
//				agenda: 'h:mm',
//				'': 'h(:mm)t'
//			},
//			titleFormat: {
//				month: 'MMMM YYYY',
//				week: 'MMMM D YYYY',
//				day: 'MMMM D YYYY'
//			},
			month : {
				columnFormat: 'dd',
				titleFormat: 'MMMM YYYY'
			},
			week : {
				columnFormat: 'ddd M/d',
				titleFormat: 'MMMM D YYYY'
			},
			day : {
				columnFormat: 'dddd M/d',
				titleFormat: 'MMMM D YYYY'
			},
			weekends: true
		};
	calendar.fullCalendar(options);
	
	// init the calendar in the left pane for date selection
	elements.fullcalendarSelector.fullCalendar({
		firstDay: 1,
		selectable: false,
		editable: false,
		defaultView: fullCalendar.CALENDAR_VIEW_TYPE.MONTH,
		contentHeight: 'auto',
		height: 'auto',
		aspectRatio: 2,
		month : {
			columnFormat: 'dd'
		},
		week : {
			columnFormat: 'ddd M/d'
		},
		day : {
			columnFormat: 'dddd M/d'
		},
		header: {
			right: 'prev,next',
			left: 'title'
		}
	});
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"74FF3A10-81F5-4C1C-9133-7869928463E6"}
 */
function onShow(firstShow, event) {
	var datasource = datasources.db.fullcalendar.event_object.getDataSource();
	scopes.svyEventManager.addListener(datasource, scopes.eventsHandler.EVENTS.EVENT_INSERT, onEventInsertListener)
	scopes.svyEventManager.addListener(datasource, scopes.eventsHandler.EVENTS.EVENT_UPDATE, onEventUpdateListener)
	scopes.svyEventManager.addListener(datasource, scopes.eventsHandler.EVENTS.EVENT_DELETE, onEventDeleteListener)

	datasource = datasources.db.fullcalendar.resources.getDataSource();
	scopes.svyEventManager.addListener(datasource, scopes.eventsHandler.EVENTS.RESOURCE_ADD, onEventSourceAdd);
	scopes.svyEventManager.addListener(datasource, scopes.eventsHandler.EVENTS.RESOURCE_UPDATE, onEventSourceUpdate);
	scopes.svyEventManager.addListener(datasource, scopes.eventsHandler.EVENTS.RESOURCE_REMOVE, onEventSourceRemove);
}

/**
 * @param {JSEvent} event
 * @protected 
 *
 * @properties={typeid:24,uuid:"E9AFF989-703D-4D0D-91CF-407C86F2D727"}
 */
function onHide(event) {
	var datasource = datasources.db.fullcalendar.event_object.getDataSource();
	scopes.svyEventManager.removeListener(datasource, scopes.eventsHandler.EVENTS.EVENT_INSERT, onEventInsertListener)
	scopes.svyEventManager.removeListener(datasource, scopes.eventsHandler.EVENTS.EVENT_UPDATE, onEventUpdateListener)
	scopes.svyEventManager.removeListener(datasource, scopes.eventsHandler.EVENTS.EVENT_DELETE, onEventDeleteListener)

	datasource = datasources.db.fullcalendar.resources.getDataSource();
	scopes.svyEventManager.removeListener(datasource, scopes.eventsHandler.EVENTS.RESOURCE_ADD, onEventSourceAdd);
	scopes.svyEventManager.removeListener(datasource, scopes.eventsHandler.EVENTS.RESOURCE_ADD, onEventSourceUpdate);
	scopes.svyEventManager.removeListener(datasource, scopes.eventsHandler.EVENTS.RESOURCE_REMOVE, onEventSourceRemove);
}

/**
 * @param {{data: JSRecord<db:/fullcalendar/event_object>, forceRender: Boolean}} eventManager
 * @private 
 *
 * @properties={typeid:24,uuid:"6D347108-9202-499A-81A5-8540CEC77AB5"}
 */
function onEventInsertListener(eventManager) {
	/** @type {svy-fullcalendar.EventType} */
	var eventObject = getEvent(eventManager.data);
	
	log.debug('insert event - ' + eventObject);
	calendar.renderEvent(eventObject);
}

/**
 * @param {{data: JSRecord<db:/fullcalendar/event_object>, forceRender: Boolean=, removeSource: Boolean=}} eventManager
 * @private 
 *
 * @properties={typeid:24,uuid:"F1B149DC-61A5-4807-A892-3D092CDBC307"}
 */
function onEventUpdateListener(eventManager) {
	
	/** @type {svy-fullcalendar.EventType} */
	var eventObject = getEvent(eventManager.data);
	
	// when called from event_resources handler afterRecordDelete, the related record is still in memory. Resource is forced to null
	if (eventManager.removeSource) {
		eventObject.source = resourceNullEventSource;
	}

	var eventUpdated = calendar.updateEvent(eventObject)
	log.debug("Update event " + eventUpdated);
	
	if (!eventUpdated && eventManager.forceRender) {	// if the event is not visible in the current filters, render the event.
		delete eventObject.source;	// TODO fix link to eventSource
		calendar.renderEvent(eventObject);
	}
}

/**
 * @param {{data: JSRecord<db:/fullcalendar/event_object>, forceRender: Boolean}} eventManager
 * @private 
 *
 * @properties={typeid:24,uuid:"9AF766F8-6412-408C-97E3-E5C3F2CC9CAD"}
 */
function onEventDeleteListener(eventManager) {
	/** @type {svy-fullcalendar.EventType} */
	var eventObject = getEvent(eventManager.data);
	
	log.debug('deleteEvent - ' + eventObject);
	calendar.removeEvents(eventObject.id);
}


/**
 * add a new eventSource to the calendar
 *
 * @param {JSRecord<db:/fullcalendar/resources>} record
 * @protected  
 *
 * @properties={typeid:24,uuid:"674DA4F2-87C3-45FF-8E39-4C5B67E600B6"}
 */
function onEventSourceAdd(record) {
	
	var eventSource = getEventSource(record);
	if (!eventSource) {	// TODO eventSources ?
		throw scopes.svyExceptions.IllegalStateException("no eventSource found with resource_id: " + record.resource_id)
	}
	
	calendar.addEventSource(eventSource);
	log.debug("add eventSource " + record.name );
}

/**
 * remove a eventSource from the calendar
 *
 * @param {JSRecord<db:/fullcalendar/resources>} record
 * 
 * @protected  
 *
 * @properties={typeid:24,uuid:"8EAB5BBA-DC0B-4560-BE83-13B491B3ECA7"}
 */
function onEventSourceUpdate(record) {
	log.debug("update eventSource " + record.name);
	if (record.render_flag) {
		
		// remove the existing eventSource
		calendar.removeEventSource(record.resource_id.toString());
		
		// force update UI to avoid flickering on the UI
		application.updateUI();
		
		// add the updated eventSource
		var eventSource = getEventSource(record);
		calendar.addEventSource(eventSource);
	}
}

/**
 * remove a eventSource from the calendar
 *
 * @param {JSRecord<db:/fullcalendar/resources>} record
 * 
 * @protected  
 *
 * @properties={typeid:24,uuid:"F2B07697-538E-4D5C-9AD5-4583A6829156"}
 */
function onEventSourceRemove(record) {
	calendar.removeEventSource(record.resource_id.toString())
	log.debug("remove eventSource " + record.name);
}

/**
 * create an event source for any resource in database saved in database.
 * Use the result to populate the calendar eventSources
 *
 * @return Array<svy-fullcalendar.EventSourceType>
 * 
 * @protected 
 *
 * @properties={typeid:24,uuid:"48B06FA3-4F0A-41FA-9497-9E4F2A649F25"}
 * @AllowToRunInFind
 */
function getActiveEventSources() {
	var activeEventSources = [];
	/** @type {JSFoundSet<db:/fullcalendar/resources>} */
	var fs = databaseManager.getFoundSet('db:/fullcalendar/resources');
	fs.loadAllRecords();
	
	/* for any resource in foundset create a FunctionEventSourceType object.
	 * store all the sources in a form variable.
	 * is required to keep in memory the created eventSources since is necessary
	 * to provide the same object instance to the calendar ro remove or update the eventSource
	 * */
	var record;
	for (var i = 1; i <= fs.getSize(); i++) {
		record = fs.getRecord(i);
		if (record.render_flag !== 0) {
			record.render_flag = 1;
			var source = getEventSource(record);
			activeEventSources.push(source);
		}
	}
	return activeEventSources;
}

/**
 * FunctionEventSourceType callback method.
 * Populate the calendar with the returned array of EventType object for any event_object related to the resource
 *
 * @param {Date} start
 * @param {Date} end
 * @param {Object<String>} params
 *
 * @return {Array<svy-fullcalendar.EventType>}
 * @private 
 *
 * @properties={typeid:24,uuid:"A4524BB8-44DA-4283-A14C-05517CA0FED8"}
 *
 * @AllowToRunInFind
 */
function resourceEventSourceCallback(start, end, params) {

	/** @type {JSFoundSet<db:/fullcalendar/event_object>} */
	var fs = databaseManager.getFoundSet("db:/fullcalendar/event_object");

	if (params && params.filter) {

		// search all events with the by resource_id between start and end time
		if (fs.find()) {
			fs.start_date = '>= ' + utils.dateFormat(scopes.svyDateUtils.toStartOfDay(new Date(start)), 'dd/MM/yyyy HH:mm:ss') + '|dd/MM/yyyy HH:mm:ss';
			fs.end_date = '<= ' + utils.dateFormat(scopes.svyDateUtils.toEndOfDay(new Date(end)), 'dd/MM/yyyy HH:mm:ss') + '|dd/MM/yyyy HH:mm:ss';
			fs.event_object_to_event_resources.resource_id = application.getUUID(params.filter);
			fs.search();
		}
	} else {
		// search all events not related to any resource
		var inQuery = databaseManager.createSelect('db:/fullcalendar/event_resources');
		inQuery.result.add(inQuery.getColumn('event_object_id'))

		/** @type {QBSelect<db:/fullcalendar/event_object>} */
		var query = databaseManager.createSelect('db:/fullcalendar/event_object');
		query.result.addPk()
		var where = query.where;
		where.add(query.columns.event_object_id.not.isin(inQuery))
		fs.loadRecords(query)
	}

	var record;
	var retval = [];
	// return the EventType objects for each record in foundset
	for (var i = 1; i <= fs.getSize(); i++) {
		record = fs.getRecord(i);
		var event = getEvent(record);
		retval.push(event)
	}
	return retval;
}

/**
 * get the FunctionEventSource object for the given record
 *
 * @param {JSRecord<db:/fullcalendar/resources>} record
 * @protected 
 *
 * @return {svy-fullcalendar.EventSourceType}
 * @properties={typeid:24,uuid:"467105D4-B7FC-4A5F-A8AB-6C9838CFAFBB"}
 */
function getEventSource(record) {
	if (!record) {
		throw new scopes.svyExceptions.IllegalArgumentException('illegal argument foundset NULL')
	}
	
	// className can be 'icon-servoy' or 'icon-microsoft' or 'icon-google' or 'icon-apple'
	var className = 'icon-' + record.name.toLowerCase();
	
	/** @type {svy-fullcalendar.EventSourceType} */
	var eventSource = {
		id: record.resource_id.toString(),
		events: resourceEventSourceCallback, // the callback method which is going to populate the calendar
		data: { filter: record.resource_id.toString() }, // provide to the callback method the resource_id; will be used to filter the events by resource
		backgroundColor: record.background_color,
		editable: true,
		startEditable: true,
		durationEditable: true,
		allDayDefault: false,
		className : [className]	// use className to display the event source icon
	}
	
	return eventSource
}


/**
 * get the EventType object for the given record
 *
 * @param {JSRecord<db:/fullcalendar/event_object>} record
 * @protected 
 *
 * @return {svy-fullcalendar.EventType}
 * @properties={typeid:24,uuid:"7DC5C807-AAC6-483D-9B65-CA50A466A7CE"}
 */
function getEvent(record) {
	if (!record) {
		throw new scopes.svyExceptions.IllegalArgumentException('illegal argument record NULL')
	}

	// create the EventType
	/** @type {svy-fullcalendar.EventType} */
	var event = {
		id: record.event_id,
		title: record.title_event,
		start: record.start_date,
		data: { description: record.description },
		borderColor: record.border_color,
		color : record.color,
		backgroundColor: record.background_color,
		textColor: record.text_color
	}
	
	if (utils.hasRecords(record, 'event_object_to_event_resources.event_resources_to_resources')) {
		className: ['icon-' + record.event_object_to_event_resources.event_resources_to_resources.name.toLowerCase()];	// use css class to show an icon in the calendar event
	}
	
	if (record.end_date) { // set end time if exist
		event.end = record.end_date;
	}
	if (record.allday) { // set allDay property
		event.allDay = true
	} else {
		event.allDay = false
	}
	
	if (utils.hasRecords(record, "event_object_to_event_resources") && record.event_object_to_event_resources.resource_id) {
		// Used only in Web Client
		event.source = record.event_object_to_event_resources.resource_id.toString();
		// Used only for scheduler calendar
		// eventObject.resourceIds = getResources(record);
	} else { 
		event.source = resourceNullEventSource;
	}
	
	return event;
}


/**
 * delete the event object record
 *
 * @param {String|Number} id the id of the event record to be deleted
 * @private 
 *
 * @properties={typeid:24,uuid:"F85C6899-00FD-4728-A881-BBD4A6BDC52D"}
 * @AllowToRunInFind
 */
function deleteEvent(id) {

	if (id) {
		// skip if id is a String and not an Integer
//		if (id instanceof String) {
//			/** @type {String} */
//			var idString = id;
//			if (id != utils.stringToNumber(idString)) { //check that id has not changed after parsing
//				return;
//			}
//		}

		/** @type {JSFoundSet<db:/fullcalendar/event_object>}*/
		var fs = databaseManager.getFoundSet("db:/fullcalendar/event_object");
		if (fs.find()) { // search for the event by id
			fs.event_id = id
			if (fs.search()) {
				fs.deleteRecord()
			}
		} else {
			log.debug('warning: testCalendar.deleteEvent can\'t find event with event_id: ' + id)
		}
	}
}

/**
 * fired when view type is changed
 *
 * @param {svy-fullcalendar.ViewType} viewObject
 * @param {JSEvent} event
 * @protected 
 *
 * @properties={typeid:24,uuid:"CCC5CC24-907D-4256-8F0A-4CE877FDDEC5"}
 */
function onViewChange(viewObject, event) {
	// force event refetch on view changed
	logEventHandler("VIEW_RENDER",event,null,viewObject,null)
	calendar.refetchEvents()
}

/**
 * fired at calendar select
 * 
 * @param {Date} start
 * @param {Date} end
 * @param {JSEvent} event
 * @param {svy-fullcalendar.ViewType} viewObject
 * @param {svy-fullcalendar.ResourceType} [resource]
 * @protected 
 *
 *
 * @properties={typeid:24,uuid:"974C9D60-E061-4BA7-9FCE-83E43D8E9990"}
 */
function onCalendarSelect(start, end, event, viewObject, resource) {
	logEventHandler("SELECT",event,null,viewObject,resource)
	
	/** @type {Object} */
	var eventObject = {
		start: new Date(start),
		end: new Date(end)
	};
	
	// is an allDay event if is of exactly 24h
	if (eventObject.end === scopes.svyDateUtils.addDays(eventObject.start,1)) {
		eventObject.allDay = true;
	}
	if (resource) {
		eventObject.resourceId = resource.id
	}

	forms.eventDialog.openInModalDialog(eventObject, forms.eventDialog.DIALOG_MODE.ADD);
	calendar.unselect()
}

/**
 *
 * @param {Date} date
 * @param {JSEvent} event
 * @param {svy-fullcalendar.ViewType} viewObject
 * @param {svy-fullcalendar.ResourceType} [resource]
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"83F0F5F8-12DF-49E4-93F0-0F62EC8F3564"}
 */
function onDayClickMethodID(date, event, viewObject, resource) {
	logEventHandler("DAY_CLICK",event,null,viewObject,resource)
}


/**
 * fired at click on event
 *
 * @param {svy-fullcalendar.EventType} eventObject
 * @param {JSEvent} event
 * @param {svy-fullcalendar.ViewType} viewObject
 * @protected 
 *
 * @properties={typeid:24,uuid:"1E6A8C2B-355B-4DED-BAD3-B9EE242DDA17"}
 */
function onEventClick(eventObject, event, viewObject) {
	logEventHandler("EVENT_CLICK",event,eventObject,viewObject,null);
	forms.eventDialog.openInModalDialog(eventObject, forms.eventDialog.DIALOG_MODE.EDIT);
}

/**
 * fired at right click on event
 *
 * @param {svy-fullcalendar.EventType} eventObject
 * @param {JSEvent} event
 * @param {svy-fullcalendar.ViewType} viewObject
 * 
 * @protected  
 *
 * @properties={typeid:24,uuid:"6B974361-0BA4-474C-A034-9FDA00471E4A"}
 */
function onEventRightClick(eventObject, event, viewObject) {
	logEventHandler("RIGHT_CLICK",event,eventObject,viewObject,null)
	var answer = plugins.dialogs.showQuestionDialog('Fullcalendar', 'Do you want to remove the event: ' + eventObject.title + ' ?', 'yes', 'no')
	if (answer == 'yes' && eventObject.id) {
		// calendar.removeEvents(eventObject.id);
		deleteEvent(eventObject.id);
	}
}

/**
 * update the event record at event resize/drop
 *
 * @param {svy-fullcalendar.EventType} eventObject
 * @param {Number} delta
 * @param {JSEvent} event
 * @param {svy-fullcalendar.ViewType} view
 * 
 * @protected  
 *
 * @properties={typeid:24,uuid:"49EBE503-D8B2-424A-A5ED-3A216B45F4ED"}
 * @AllowToRunInFind
 */
function onEventUpdate(eventObject, delta, event, view) {
	logEventHandler("UPDATE",event,eventObject,null,null)
	
	if (eventObject.id && utils.stringToNumber(eventObject.id) == eventObject.id) {
		/** @type {JSFoundSet<db:/fullcalendar/event_object>}*/
		var fs = databaseManager.getFoundSet("db:/fullcalendar/event_object");
		if (fs.find()) { // search event_object by event id
			fs.event_id = eventObject.id
			if (fs.search()) {
				// update the foundset record
				if (eventObject.start) {
					fs.start_date = new Date(eventObject.start)
				}
				if (eventObject.end) {
					fs.end_date = new Date(eventObject.end)
				}
				if (eventObject.allDay || eventObject.allDay == false) {
					fs.allday = eventObject.allDay
				}
				if (eventObject.resourceIds && eventObject.resourceIds.length) {
					var resourceId;
					var resourceIds = eventObject.resourceIds;
					// TODO handle multiple resources
						resourceId = resourceIds[0];
						
						//update the event_object resource
						if (resourceId) {
							// create new event source if the record does not have any
							if (!utils.hasRecords(fs.event_object_to_event_resources)) {
								fs.event_object_to_event_resources.newRecord()
							}
							fs.event_object_to_event_resources.resource_id = application.getUUID(resourceId);
						
					}
				}
				return databaseManager.saveData();
			}
		} else {
			log.debug('warning: testCalendar.onEventUpdate can\'t find event with event_id: ' + eventObject.id)
		}
	} else {
		log.debug('warning: testCalendar.onEventUpdate can\'t update events with id NULL')
	}
	return false
}

/**
 * @param {String} type
 * @param {JSEvent} event
 * @param {svy-fullcalendar.EventType} eventObject
 * @param {svy-fullcalendar.ViewType} viewObject
 * @param {svy-fullcalendar.ResourceType} resource
 * 
 * @protected 
 *
 * @properties={typeid:24,uuid:"CE9147B7-6056-4B48-9BFA-0D1F9E916AEC"}
 */
function logEventHandler(type, event, eventObject, viewObject, resource) {
	var msg = "EVENT " + type + " " + event.getElementName() + " x: " + event.getX() + " y " + event.getY();
	if (eventObject) msg+= ' | title: ' + eventObject.title + ' id:' + eventObject.id
	if (eventObject && eventObject.data && eventObject.data.description) msg+= ' description ' + eventObject.data.description;
	if (eventObject && eventObject.resourceIds) msg += ' | resource '  + eventObject.resourceIds[0];
	if (viewObject) msg+= ' | view: ' + viewObject.name + ' start ' + viewObject.start;
	if (resource) msg+= ' | resource: ' + resource.id + ' title ' + resource.title;
	log.warn(msg)
}

/**
 * @param {JSEvent} event the event that triggered the action
 * @protected
 *
 * @properties={typeid:24,uuid:"CC5940C6-5464-441F-A2F6-043CAB52A4AA"}
 */
function render(event) {
	calendar.render()
}

/**
 * @param {JSEvent} event the event that triggered the action
 * @protected
 *
 * @properties={typeid:24,uuid:"F72CF128-063C-4208-A982-BE0A3420D5FD"}
 */
function refetchEvents(event) {
	calendar.refetchEvents()
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 * @protected 
 *
 * @properties={typeid:24,uuid:"309A8BDF-599D-4A0D-AE73-CE3CBE01707C"}
 */
function changeViewDate(event) {
	calendar.changeView(scopes.svyFullCalendar.CALENDAR_VIEW_TYPE.MONTH);
	calendar.gotoDate(new Date(2006,0,1))
	for (var i = 0; i < 120; i++) {
		calendar.incrementDate(0, 1)
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action

 * @protected
 *
 * @properties={typeid:24,uuid:"709C050D-3D22-4207-A6CD-F26C424DE285"}
 */
function today(event) {
	calendar.today()
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"4D921E5B-AD25-4392-A625-48295CD9DADC"}
 */
function next(event) {
	calendar.next()
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"9C1A1D8C-8804-420F-96CE-E21690104148"}
 */
function nextyear(event) {
	calendar.nextYear()
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"21FA66F7-5884-4A81-A31C-8D6805B21558"}
 */
function prev(event) {
	calendar.prev()
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"27F5E477-7982-424C-A9CB-746F274A8C2C"}
 */
function prevyear(event) {
	calendar.prevYear()
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"660DB3BD-8EBD-4270-A9C6-335B2A5A333E"}
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
 * @properties={typeid:24,uuid:"347FC8A1-7327-4E49-B6D6-CDF1B3927A5F"}
 */
function agendaWeek(event) {
	calendar.changeView(scopes.svyFullCalendar.CALENDAR_VIEW_TYPE.AGENDAWEEK);
	updateUI(event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"3ADDF19B-1251-43C1-8073-BAF083CEBDCF"}
 */
function month(event) {
	calendar.changeView(scopes.svyFullCalendar.CALENDAR_VIEW_TYPE.MONTH);
	updateUI(event);
}

/**
 * @param {JSEvent} event
 * @protected 
 *
 * @properties={typeid:24,uuid:"A8383190-B2A0-443D-8D30-B98FEEE5F187"}
 */
function updateUI(event) {
	elements.btnAgendaDayView.removeStyleClass('btn-primary');
	elements.btnAgendaWeekView.removeStyleClass('btn-primary');
	elements.btnMonthView.removeStyleClass('btn-primary');
	var btn = elements[event.getElementName()];
	if (btn) {
		btn.addStyleClass('btn-primary');
	}
}

/**
 *
 * @param {Date} date
 * @param {JSEvent} event
 * @param {object} view
 * @param {object} resource
 * 
 * @protected 
 *
 * @properties={typeid:24,uuid:"AF4DE5E0-A45B-4A9A-AABD-053DB2CA13CB"}
 */
function onDayClickSelector(date, event, view, resource) {
	calendar.gotoDate(new Date(date));
}

/**
* @protected 
* @properties={typeid:24,uuid:"E46FC259-DCCD-413A-BF8C-4B07AD7749ED"}
*/
function gotoMorningTime() {
	calendar.updateFullCalendar('scrollTime','08:00:00');
}

/**
* @protected 
* @properties={typeid:24,uuid:"6232C540-C2F0-4392-9994-FAA6C468B0C7"}
*/
function gotoNoonTime() {
	calendar.updateFullCalendar('scrollTime','13:00:00');
}


/**
 * @deprecated 
 * @protected 
 * 
 * @properties={typeid:24,uuid:"1A38BF8B-E986-4674-A57D-EED0C23D8340"}
 */
function testEventSource() {
	var eventSources = getActiveEventSources();
	
	elements.fullcalendarSelector.fullCalendar({
		firstDay: 1,
		selectable: false,
		editable: false,
		defaultView: scopes.svyFullCalendar.CALENDAR_VIEW_TYPE.MONTH,
		header: false,
		contentHeight: 'auto',
		aspectRatio: 2,
		columnFormat: {
			month: 'dd',
			week: 'ddd M/d',
			day: 'dddd M/d'
		},
		eventSources: []
	});
	
	// second calendar for date selection
	elements.fullcalendarSelector.fullCalendar({
		firstDay: 1,
		selectable: false,
		editable: false,
		defaultView: scopes.svyFullCalendar.CALENDAR_VIEW_TYPE.MONTH,
		header: false,
		contentHeight: 'auto',
		aspectRatio: 2,
		columnFormat: {
			month: 'dd',
			week: 'ddd M/d',
			day: 'dddd M/d'
		},
		eventSources: [eventSources[0]]
	});
}

/**
 * @deprecated 
 * @protected 
 * 
 * @properties={typeid:24,uuid:"F677D682-6C30-429E-9BA3-FDD3FAEBBEE2"}
 */
function testAddEventSource() {
	var eventSources = getActiveEventSources();
	elements.fullcalendarSelector.addEventSource(eventSources[1])
}
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"DCAF2BCD-E7DB-423E-BF36-CEA37F4FE70D"}
 */
function showPopupMenu(event) {
	configMenu.show(elements[event.getElementName()]);
}

/**
 * @protected 
 * @properties={typeid:24,uuid:"9A22108A-A8B1-429A-A3B0-7766DA50FB36"}
 */
function initConfigMenu() {
	configMenu = plugins.window.createPopupMenu();
	var menu;
	var menuItem;
	
	// FIXME enable hidden days
	menu = configMenu.addMenu();
	menu.text = "hiddenDays";
	
	var hiddenDays = ["Sunday", "Monday", "Tuesday", "Wednsday", "Thursday", "Friday", "Saturday"];
	for (var i = 0; i < hiddenDays.length; i++) {
		menuItem = menu.addCheckBox();
		menuItem.text = hiddenDays[i];
		menuItem.selected = false;
		menuItem.setMethod(toggleHiddenDays);
		menuItem.methodArguments = ["hiddenDays", i, 0];
		
	}
	
	menuItem = configMenu.addCheckBox();
	menuItem.text = "Weekends";
	menuItem.selected = true;
	menuItem.setMethod(toggleCalendarOption,["weekends", false]);
	menuItem.methodArguments = ["weekends", false];

}

/**
 * @param {Number} itemIndex
 * @param {Number} parentIndex
 * @param {Boolean} isSelected
 * @param {String} parentText
 * @param {String} menuText
 * @param {String} option the option to be toggled
 * @param {Object} hiddenDay the hidden day to be toggled
 * @param {Number} [parentIdx] optional param
 * 
 * @private 
 *
 * @properties={typeid:24,uuid:"D90114BF-6889-4DBA-8762-6EEFED3AE7BB"}
 */
function toggleHiddenDays(itemIndex, parentIndex, isSelected, parentText, menuText, option, hiddenDay, parentIdx) {
	
	var options = calendar.getFullCalendarOptions();
	var hiddenDays = options.hiddenDays ? options.hiddenDays : [];
	
	if (!isSelected) {	// hide the selected day
		hiddenDays = hiddenDays.concat([hiddenDay]);
	} else if (hiddenDays) {  // remove selected day from hidden day list
		hiddenDays.splice(hiddenDays.indexOf(hiddenDay),1);
	} else {  
		throw 'this should not happen'
	}
	
	updateCalendarOption(option, hiddenDays);
	updateMenuSelection(itemIndex, parentIdx, isSelected, parentText, menuText);
}

/**
 * @param {Number} itemIndex
 * @param {Number} parentIndex
 * @param {Boolean} isSelected
 * @param {String} parentText
 * @param {String} menuText
 * @param {String} option the option to be toggled
 * @param {Object} value the option value
 * 
 * @private 
 *
 * @properties={typeid:24,uuid:"38086F08-0582-4193-9BEE-F8645526152A"}
 */
function toggleCalendarOption(itemIndex, parentIndex, isSelected, parentText, menuText, option, value) {
	
	// toggle the calendar option if item is now unselected
	updateCalendarOption(option, !isSelected);
	updateMenuSelection(itemIndex, parentIndex, isSelected, parentText, menuText);
}

/**
 * update the menuItem selected property
 * @param {Number} itemIndex
 * @param {Number} parentIndex
 * @param {Boolean} isSelected
 * @param {String} parentText
 * @param {String} menuText
 * @private 
 *
 * @properties={typeid:24,uuid:"27E675B9-38D8-4CFF-A17D-B6FD3A93C90A"}
 */
function updateMenuSelection(itemIndex, parentIndex, isSelected, parentText, menuText) {
	var menu;
	if (parentIndex === -1) {
		menu = configMenu;
	} else if (parentIndex != -1) {
		menu = configMenu.getItem(parentIndex);
	} 
	
	var menuItem = menu.getItem(itemIndex);
	
	if (menuItem) {
		menuItem.selected = isSelected ? false : true;
	}
	
}

/**
 * Update the calendar option with the given value
 * 
 * @param {String} option the option of the calendar to be updated
 * @param {Object} value the value to update the option
 * @private 
 *
 * @properties={typeid:24,uuid:"320F1719-C464-4799-83C0-454C080BBF47"}
 */
function updateCalendarOption(option, value) {
	calendar.updateFullCalendar(option, value);
}