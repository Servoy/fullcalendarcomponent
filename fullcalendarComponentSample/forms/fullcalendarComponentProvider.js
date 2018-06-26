/**
 * @protected 
 * 
 * @properties={typeid:24,uuid:"38047A64-1756-4B24-8F12-605665EC60B0"}
 */
function allowFormIncludedInMenu() {
	return true;
}

/**
 *
 * @return {String}
 *
 * @properties={typeid:24,uuid:"EE53A934-54FD-4F14-9C4D-357B97D4A7CD"}
 */
function getName() {
	return "Fullcalendar Component";
}

/**
*
* @return {String}
* @protected 
*
* @properties={typeid:24,uuid:"86573E1F-3D83-430A-A204-83F8D9648BF9"}
*/
function getDescription() {
	return "Fully interactive agenda component";
}

/**
*
* @return {String}
* @protected 
*
* @properties={typeid:24,uuid:"E2BB7BE4-E887-4B0E-B25A-D9612F501FF5"}
*/
function getIconStyleClass() {
	return "fa fa-calendar"
}

/**
*
* @return {RuntimeForm<AbstractMicroSample>}
*
* @properties={typeid:24,uuid:"E3BD524E-575A-43D0-9F6E-73BF50F182AE"}
*/
function getParent() {
	return forms.specializedSamples;
}
