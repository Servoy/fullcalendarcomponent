/**
 * Create related record event_resources if the event object has a resource
 * 
 * @param {String} resourceId
 *
 * @AllowToRunInFind
 *
 * @properties={typeid:24,uuid:"FABF2BB2-C481-46F4-826E-7DFE316BC1FE"}
 */
function createEventResourceById(resourceId) {
	if (resourceId) {
		/** @type {JSFoundSet<db:/fullcalendar/resources>}*/
		var resources = databaseManager.getFoundSet('fullcalendar','resources')
		if (resources.find()) {
			resources.resource_id = application.getUUID(resourceId);
			if(resources.search()) {
				event_object_to_event_resources.newRecord();
				event_object_to_event_resources.resource_id = resources.resource_id
			}
		}
	}
}