/**
 * Record after-insert trigger.
 *
 * @param {JSRecord<db:/fullcalendar/event_resources>} record record that is inserted
 *
 * @private
 *
 * @properties={typeid:24,uuid:"E3FDFC2C-77BF-4AE3-81E4-3A3DF08318F5"}
 */
function afterRecordInsert(record) {
	if (utils.hasRecords(event_resources_to_event_object)) {
		var eventRecord = record.foundset.event_resources_to_event_object.getSelectedRecord();
		var data = {
			data: eventRecord,
			forceRender : false
		}
		scopes.svyEventManager.fireEvent(event_resources_to_event_object.getDataSource(), scopes.eventsHandler.EVENTS.EVENT_UPDATE , data);
	}
}

/**
 * Record after-update trigger.
 *
 * @param {JSRecord<db:/fullcalendar/event_resources>} record record that is updated
 *
 * @private
 *
 * @properties={typeid:24,uuid:"CA64E73B-726E-4AF1-BB4C-403C7010CA7C"}
 */
function afterRecordUpdate(record) {
	if (utils.hasRecords(event_resources_to_event_object)) {
		var eventRecord = record.foundset.event_resources_to_event_object.getSelectedRecord();
		var data = {
			data: eventRecord,
			forceRender : false
		}
		scopes.svyEventManager.fireEvent(event_resources_to_event_object.getDataSource(), scopes.eventsHandler.EVENTS.EVENT_UPDATE , data);
	}
}
/**
 * Record after-delete trigger.
 *
 * @param {JSRecord<db:/fullcalendar/event_resources>} record record that is deleted
 *
 * @private
 *
 *
 * @properties={typeid:24,uuid:"926D2AFE-7042-400E-9A8A-9849316526ED"}
 */
function afterRecordDelete(record) {
	if (utils.hasRecords(event_resources_to_event_object)) {
		var eventRecord = record.foundset.event_resources_to_event_object.getSelectedRecord();
		var data = {
			data: eventRecord,
			forceRender : false,
			removeSource: true
		}
		scopes.svyEventManager.fireEvent(event_resources_to_event_object.getDataSource(), scopes.eventsHandler.EVENTS.EVENT_UPDATE , data);
	}
}
