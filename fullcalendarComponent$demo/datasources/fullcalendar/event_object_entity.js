/**
 * Record after-insert trigger.
 *
 * @param {JSRecord<db:/fullcalendar/event_object>} record record that is inserted
 *
 * @private
 *
 *
 * @properties={typeid:24,uuid:"A83999BE-B6E0-48C7-A023-ED11C530CDC0"}
 */
function afterRecordInsert(record) {
	var data = {
		data: record
	}
	scopes.svyEventManager.fireEvent(getDataSource(), scopes.eventsHandler.EVENTS.EVENT_INSERT , data);
}

/**
 * Record after-update trigger.
 *
 * @param {JSRecord<db:/fullcalendar/event_object>} record record that is updated
 *
 * @private
 *
 *
 * @properties={typeid:24,uuid:"6AF285E0-0BB2-403C-A5AD-49C20235D0F0"}
 */
function afterRecordUpdate(record) {
	var data = {
		data: record,
		forceRender : true
	}
	scopes.svyEventManager.fireEvent(getDataSource(), scopes.eventsHandler.EVENTS.EVENT_UPDATE , data);
}

/**
 * Record after-delete trigger.
 *
 * @param {JSRecord<db:/fullcalendar/event_object>} record record that is deleted
 *
 * @private
 *
 *
 * @properties={typeid:24,uuid:"579C43E1-1C61-437B-9D03-0971430691BE"}
 */
function afterRecordDelete(record) {
	var data = {
		data: record
	}
	scopes.svyEventManager.fireEvent(getDataSource(), scopes.eventsHandler.EVENTS.EVENT_DELETE , data);
}