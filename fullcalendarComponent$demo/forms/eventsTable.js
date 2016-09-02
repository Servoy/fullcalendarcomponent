
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"5F7E0148-146F-4E7B-A672-92D6C605F5D5"}
 */
function btnDeleteEventSource(event) {
	if (utils.hasRecords(foundset.event_object_to_event_resources)) {
		foundset.event_object_to_event_resources.deleteRecord();
	}
}
