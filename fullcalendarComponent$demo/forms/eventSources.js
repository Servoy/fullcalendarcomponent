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
 * Handle changed data.
 *
 * @param {Number} oldValue old value
 * @param {Number} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"AA384825-CA71-45D0-BC2E-AC9D471B09F7"}
 */
function onDataChange(oldValue, newValue, event) {
	if(newValue) {
		scopes.svyEventManager.fireEvent(foundset.getDataSource(), scopes.eventsHandler.EVENTS.RESOURCE_ADD , foundset.getSelectedRecord());
	} else {
		scopes.svyEventManager.fireEvent(foundset.getDataSource(), scopes.eventsHandler.EVENTS.RESOURCE_REMOVE , foundset.getSelectedRecord());
	}
	return true
}

/**
 * Handle changed data.
 *
 * @param {String} oldValue old value
 * @param {String} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"AFB5CA5B-C5DF-48F2-8497-FE50755E0289"}
 */
function onDataChangeColor(oldValue, newValue, event) {
	// TODO to be implemented
	scopes.svyEventManager.fireEvent(foundset.getDataSource(), scopes.eventsHandler.EVENTS.RESOURCE_UPDATE , foundset.getSelectedRecord());
	return true
}

/**
 * Called before the form component is rendered.
 *
 * @param {JSRenderEvent} event the render event
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"AA39623B-F617-42F5-8E33-56E2233A8EC2"}
 */
function onRender(event) {
	if(event.getRecord()){
		/** @type {JSRecord<db:/fullcalendar/resources>} */
		var record = event.getRecord()
		event.getRenderable().bgcolor = getColor(record.background_color);
	}
}

/**
 * @param {String} colour
 *
 * @properties={typeid:24,uuid:"EDE1CA7E-561E-4942-A862-7D24BD4F7A32"}
 */
function getColor(colour){
	switch(colour){
		case 'white':
			return '#FFF'
		case 'orange':
			return '#F90'
		case 'yellow':
			return '#FF0'
		case 'blue':
			return '#00F'
		case 'green':
			return '#090'
		case 'red':
			return '#F00'
		case 'black':
			return '#000'
		case 'purple':
			return '#C0C'
		default :
			return '#FFF'
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"C31E50B3-8E85-42D5-875F-5C46180DC3CD"}
 */
function btnNewResource(event) {
	foundset.newRecord();
}