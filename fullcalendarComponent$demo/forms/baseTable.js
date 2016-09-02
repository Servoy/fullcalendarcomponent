/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"ACC0B80E-1DCE-499D-BAA1-87DD0292CADD"}
 */
function onNewRecord(event) {
	foundset.newRecord()
}

/**
 * @param event
 *
 * @properties={typeid:24,uuid:"19A0658A-1C76-46D5-8BF0-B728A6C9134E"}
 */
function onDeleteRecord(event) {
	foundset.deleteRecord()
}

/**
 * @param event
 *
 * @properties={typeid:24,uuid:"57157411-E297-40AD-A014-F6513AC40F57"}
 */
function onSave(event) {
	databaseManager.saveData();
}

/**
 * @param event
 *
 * @properties={typeid:24,uuid:"DD334B5B-0D12-42CC-BE83-5A62E419B842"}
 */
function onCancel(event) {
	databaseManager.revertEditedRecords();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"7C9BE783-BE19-472C-8173-80CAEE83A391"}
 */
function onLoadAllRecords(event) {
	foundset.loadAllRecords();
}
