/*
 * This file is part of the Servoy Business Application Platform, Copyright (C) 2012-2013 Servoy BV
 * 
 * This program is free software; you can redistribute it and/or modify 
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or 
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License 
 * along with this program; if not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @enum 
 * @type {Object<String>}
 * 
 * @properties={typeid:35,uuid:"D4EDE21B-06AB-4C9A-B4BF-03867F4D652D",variableType:-4}
 */
var DIALOG_MODE = {
	ADD: "add",
	EDIT: "edit"
};

/**
 * @type {Boolean}
 * @protected 
 *
 * @properties={typeid:35,uuid:"1D15A495-CC88-4639-9D3E-CC74EADC6A6F",variableType:-4}
 */
var confirmed;

/**
 * @param {svy-fullcalendar.EventType} event
 * @param {String} dialogMode
 * 
 * @properties={typeid:24,uuid:"731B98E0-32F3-4A67-8B20-F8DF8B578918"}
 */
function openInModalDialog(event, dialogMode){
	if(setParameters(event, dialogMode)){
		var win = application.createWindow(controller.getName(), JSWindow.MODAL_DIALOG)
		win.show(controller.getName())
	} else {
		plugins.dialogs.showInfoDialog('Fullcalendar','This is a sample static event. Is not bound to database')
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"63E2C540-2C56-4D80-B7A9-B721A1158857"}
 */
function btnConfirm(event) {
	//create EventType object	
	if (!foundset.title_event) {
		plugins.dialogs.showWarningDialog('Can\'t save', 'Event title cannot be empty')
		return;
	}
	
	// save the event object
	if (databaseManager.saveData(foundset.getSelectedRecord())) {
		
		// save the resource assigned to the event object
		if (utils.hasRecords(event_object_to_event_resources) && event_object_to_event_resources.resource_id) {
			databaseManager.saveData(foundset.event_object_to_event_resources.getSelectedRecord())
		}
		confirmed = true;
		controller.getWindow().hide()
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"DA916C69-C026-46ED-91E6-98ADC8A5E38F"}
 */
function btnCancel(event) {
	confirmed = false;
	controller.getWindow().hide()
}

/**
 * @protected 

 * @param {svy-fullcalendar.EventType} event
 * @param {String} dialogMode
 *
 * @properties={typeid:24,uuid:"2357A1C2-2D97-4AA9-A7CE-328211CFB62A"}
 * @AllowToRunInFind
 */
function setParameters(event, dialogMode){
	var success = false;
	databaseManager.setAutoSave(false)
	switch(dialogMode) {
		case DIALOG_MODE.ADD:
			var idx = foundset.newRecord()
			if(idx != -1) {
				success = true
				foundset.start_date = event.start
				foundset.end_date = event.end
				foundset.allday = event.allDay
				// if has the resource assign the correct resource
				if (event.resourceId) {
					//assign event source with same name to source
					foundset.createEventResourceById(event.resourceId);
				}
			}
			break;
		case DIALOG_MODE.EDIT:
			// search the event in table
			if(event.id) {
				if(foundset.find()) {
					foundset.event_id = event.id
					if(foundset.search()) {
						success = true
					} else {
						success = false
					}
				}
			}
			break;
		default:
			break;
	}	
	return success;
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"D31D2763-1BCA-4C78-942A-BF065E1D0510"}
 */
function onShow(firstShow, event) {
	databaseManager.setAutoSave(false)
	elements.fld_title.requestFocus()
}

/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"87676389-1C14-49E3-A9FF-0FB54CC2B343"}
 */
function onHide(event) {
	if (!confirmed) { 
		// revert changes if save was not confirmed
		foundset.getSelectedRecord().revertChanges()
		if (utils.hasRecords(foundset.event_object_to_event_resources)) {
			foundset.event_object_to_event_resources.getSelectedRecord().revertChanges()
		}
	}
	confirmed = false;
	databaseManager.setAutoSave(true);
}

/**
 * @param {JSEvent} event
 * @protected 
 *
 * @properties={typeid:24,uuid:"D31AAF4F-4C55-48FC-890D-98DEF65AA64C"}
 */
function btnDeleteEventSource(event) {
	if (utils.hasRecords(foundset.event_object_to_event_resources)) {
		foundset.event_object_to_event_resources.deleteRecord();
	}
}
