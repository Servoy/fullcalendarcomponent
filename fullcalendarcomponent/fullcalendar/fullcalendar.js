angular.module('svyFullcalendar', ['servoy']).directive('svyFullcalendar', function($log, $timeout, $svyTooltipUtils) {
		return {
			restrict: 'E',
			transclude: true,
			scope: {
				model: "=svyModel",
				handlers: "=svyHandlers",
				svyServoyapi: '=svyServoyapi',
				api: '=svyApi'
			},
			controller: function($scope, $element, $attrs, $window, $parse) {

				/* Implementation details
				 *
				 * calendar is initalized by calling fullCalendar constructor API.
				 * Api update event and eventSource by id.
				 *
				 * Internally the constructor keep track of a object copy (is this required ??)
				 * Internally eventSourced are splitted in 3 categories depending of events type: functionEventSources, arrayEventSorces, urlEventSources
				 * Function eventSources are transformed client side, the scope object $scope.eventSources holds the clientSide version of eventSources.
				 * Is required to retrieve the original eventSource passed to the fullCalendar.
				 *
				 * */

				// TODO Text/Time customization properties
				// TODO Timezone, TimezoneParam, endParam, startParam

				// View
				// TODO onViewRenderMethodID handler, expose in another version
				// DONE select allDay, check start/end in client
				// DONE persist calendar view: which view is open, which day is looking at

				// Resource View
				// DONE fix: renderEvent does not update resourceIds
				// TODO custom resource view
				// DONE add/remove resource
				// DONE change resource to event
				// DONE test d&d, select

				// Optimization tasks
				// TODO test multiple events with same id and multiple eventSources/resources.
				// TODO use minfied version of fullcalendar libs
				// TODO events
				// TODO filter events by anything else then id ?
				// TODO review renderEvent with eventSource
				// TODO remove/update event by id ??? What happens if there are multiple events with the same id ?
				// TODO persist sticky events ? should they be allowed ?
				// TODO googleCalendarEvents
				// TODO on clientSide there are 3 copies of the eventSources. For arrayEventSource would be better optimized if using a single copy or removing the list of events when not necessary.

				var TIMEZONE_DEFAULT = "local"

				var calendar = $element.find('.svy-fullcalendar');

				var select;
				var dayClick;
				var eventClick;
				var eventRightClick;
				var eventDrop;
				var eventResize;
				var eventRender;
				var viewRender;

				$scope.view;

				/* redraw the calendar to center it */
				angular.element($window).bind("resize", onWindowResize);

				// unbind the resize event at destroy
				$scope.$on('$destroy', function() {
						angular.element($window).unbind('resize', onWindowResize);
					});

				function onWindowResize() {
					$scope.api.option("height", calendar.height());
				}

				/* config object */
				/**
				 * @deprecated
				 *  */
				$scope.uiConfig = {
					calendar: {
						height: $scope.model.size.height,
						editable: true,
						header: {
							left: 'month, basicWeek, basicDay, agendaWeek, agendaDay',
							center: 'title',
							right: 'today, prev next'
						},
						select: select,
						dayClick: dayClick,
						eventClick: eventClick,
						eventDrop: eventDrop,
						eventResize: eventResize
					}
				};

				//				for (var item in $scope.model.calendarOptions) {
				//					$scope.uiConfig.calendar[item] = $scope.model.calendarOptions[item]
				//				}

				/* private method */
				function getCalendarOptions() {
					if ($scope.model.calendarOptions) {
						return $scope.model.calendarOptions//.options
					} else {
						return null;
					}
				}

				/* private method */
				function setOption(optionName, value) {
					// TODO chech if value != null/undefined and set the value to the option object
				}

				/** init the fullcalendar. will destroy the calendar if existing already */
				$scope.initFullCalendar = function() {
					// TODO is this good ?
					$scope.destroy();
					var options = getOptions();
					calendar.fullCalendar(options);
				}

				/** destroy the fullcalendar */
				$scope.destroy = function() {
					if (calendar && calendar.fullCalendar) {
						calendar.fullCalendar('destroy');
					}
				};

				/** return the eventSource object */
				function getEventSources() {
					var eventSources = [];

					// arrayEventSources
					if ($scope.model.arrayEventSources && $scope.model.arrayEventSources.length) {
						eventSources = eventSources.concat($scope.model.arrayEventSources);
					}

					// functionEventSources
					for (var i = 0; $scope.model.functionEventSources && i < $scope.model.functionEventSources.length; i++) {
						eventSources.push(transformFunctionEventSource($scope.model.functionEventSources[i]))
					}
					
					// GoogleFeedEventSources
					if ($scope.model.gcalEventSources && $scope.model.gcalEventSources.length) {
						eventSources = eventSources.concat($scope.model.gcalEventSources);
					}

					// TODO add other resources if available
					return eventSources;
				}

				/** get eventSource with function feed */
				function transformFunctionEventSource(eventSource) {
					// TODO should be a deep copy instead ?
					var source = { };

					// copy properties of eventSource
					for (var property in eventSource) {
						source[property] = eventSource[property];
					}

					// register server side callback
					var callback = eventSource.events;
					source.events = function(start, end, timezone, callbackFunction) {
						// TODO add timezone ??
						var retValue = $window.executeInlineScript(callback.formname, callback.script, [parseMoment(start), parseMoment(end), eventSource.data])
						retValue.then(function(success) {
								callbackFunction(success)
							}, function(error) {
								console.log('handler error')
								console.log(error)
							});
					}
					return source;
				}

				/** return the calendar config object */
				function getOptions() {

					/* config object */
					var options = {
						height: calendar.height(),
						select: select,
						dayClick: dayClick,
						eventClick: eventClick,
						eventDrop: eventDrop,
						eventResize: eventResize,
						eventRender: eventRender,
						viewRender: viewRender
					};

					var calendarOptions = getCalendarOptions();

					if (calendarOptions) {
						for (var property in calendarOptions) {
							// TODO parse
							// slotDuration

							options[property] = calendarOptions[property]
						}
					}
					
					// If draw without calling constructor or renderOnCurrentView is set to true, use the persisteView to rerender
					if ((!$scope.model.hasToDraw || $scope.model.renderOnCurrentView) && $scope.model.view) {
						options.defaultView = $scope.model.view.name;
						options.defaultDate = new Date($scope.model.view.defaultDate);
					}

					if (!options.timezone) {
						options.timezone = TIMEZONE_DEFAULT;
						// TODO is possible to explicitly set the today time/day using now
						//						options.now = new DateTime('now', 'America/Chicago');
					}

					// TODO events are not fully supported yet
					if ($scope.model.events && $scope.model.events.length) {
						options.events = $scope.model.events;
					}
					$scope.eventSources = getEventSources();
					if ($scope.eventSources) {
						options.eventSources = $scope.eventSources;
					}

					return options;
				}

				/* Calendar Callbacks */
				select = function(start, end, jsEvent, view, resource) {
					//console.log(view);
					//console.log(resource);
					if ($log.debugEnabled) $log.debug(view);

					//					console.log(start)
					//					console.log(parseMoment(start))
					//					console.log(end)
					//					console.log(parseMoment(end))

					if ($scope.handlers.onSelectMethodID) {
						// if jsEvent is undefined create a jsEvent. May be the case if selection is triggered from API
						if (!jsEvent) {
							jsEvent = createMouseEvent();
						}
						$scope.handlers.onSelectMethodID(parseMoment(start), parseMoment(end), jsEvent, stringifyView(view), resource);
					}
				}

				dayClick = function(date, jsEvent, view) {
					if ($scope.handlers.onDayClickMethodID) {
						$scope.handlers.onDayClickMethodID(parseMoment(date), jsEvent, stringifyView(view))
					}
				}

				eventClick = function(event, jsEvent, view) {
					if ($scope.handlers.onEventClickMethodID) {
						$scope.handlers.onEventClickMethodID(stringifyEvent(event), jsEvent, stringifyView(view));
					}
				}

				eventRightClick = function(jsEvent) {
					if ($scope.handlers.onEventRightClickMethodID) {
						jsEvent.preventDefault();
						var event = jsEvent.data.event;
						var view = $scope.model.view;
						$scope.handlers.onEventRightClickMethodID(stringifyEvent(event), jsEvent, view);
					}
				}

				eventResize = function(event, delta, revertFunc, jsEvent, ui, view) {
					if ($scope.handlers.onEventResizeMethodID) {
						var retValue = $scope.handlers.onEventResizeMethodID(stringifyEvent(event), delta, jsEvent, stringifyView(view))
						retValue.then(function(success) {
								if (success === false) {
									revertFunc();
								}
							}, function(error) {
								console.log('onResize handler error')
								console.log(error)
							});
					}

				}

				eventDrop = function(event, delta, revertFunc, jsEvent, ui, view) {
					//console.log(event)
					//console.log(delta)
					//console.log(ui)
					//console.log(view)

					if ($scope.handlers.onEventDropMethodID) {
						var retValue = $scope.handlers.onEventDropMethodID(stringifyEvent(event), delta, jsEvent, stringifyView(view))
						retValue.then(function(success) {
								if (success === false) {
									revertFunc();
								}
							}, function(error) {
								console.log('onDrop handler error')
								console.log(error)
							});
					}

				}

				function evaluateTooltipExpression(expression, event) {
					// match all text wrapped in {{ }} which starts with a literal and may contains literal, numbers _ and . (. is used for nested properties)
				    return expression.replace(/({{[a-zA-Z][a-zA-Z0-9&._]*}})/g, function(j) { 
				    	var property = j.replace(/{{/, '').replace(/}}/, '');				    	
				        return evalDeepProperty(event, property) || '';
				    });
				}
				
				/**
				 * @param {Object} obj
				 * @param {String} property
				 *  */
				function evalDeepProperty(obj, property) {
					if (!property) {
						throw 'Illegal argument property undefined';
					}
					
					var parts = property.split('.');
					var deepObj = obj[parts[0]];
					
					if (parts.length === 1) {
						return deepObj;
					} else if (deepObj) {
						return evalDeepProperty(deepObj, parts.slice(1).join('.'));
					} else {
						return null;
					}
				} 

				eventRender = function(event, element) {
					// show tooltip
					if ($scope.model.tooltipExpression) {
						var tooltip = evaluateTooltipExpression($scope.model.tooltipExpression, event);
						element.bind('mouseover', function(jsEvent) {
								if (tooltip) $svyTooltipUtils.showTooltip(jsEvent, tooltip, 750, 5000);
							});
						element.bind('mouseout', function(jsEvent) {
								if (tooltip) $svyTooltipUtils.hideTooltip();
							});
					}
					
					// bind right click to event
					if ($scope.handlers.onEventRightClickMethodID) {
						element.bind('contextmenu', { event: event }, eventRightClick);
					}
				}

				viewRender = function(viewObject, element) {
					
					// persist date
					var view = stringifyView(viewObject);
					var date = calendar.fullCalendar('getDate');
					$scope.model.view = view;
					$scope.model.view.defaultDate = parseMoment(date);
					$scope.svyServoyapi.apply("view");

					//console.log("view rendered on:");
					//console.log(view);

					// fire onViewRenderMethodID
					if ($scope.handlers.onViewRenderMethodID) {
						// TODO should not be a mouse event but something else !!
						var jsEvent = createMouseEvent();
						$scope.handlers.onViewRenderMethodID(view, jsEvent);
					}
				}

				function parseMoment(m) {
					// console.log(m.toDate().toUTCString().replace(" GMT", ""))
					return m.toDate().getTime();//.toUTCString().replace(" GMT", ""); //m.toDate();
					//return m.toDate().toUTCString().replace(" GMT", ""); //m.toDate();
				}

				/* stringify objects */
				function stringifyEvent(event) {

					var parsedEvent = { }
					for (var property in event) {
						switch (property) {
						case "source":
						case "className":
							// skip to include the source object
							// TODO should include the name of the sourceObject ??
							break;
						case "resourceId":
							parsedEvent.resourceIds = [event[property]];
							break;
						default:
							// skip if is an internal property
							if (property.indexOf("_") === 0) {
								break;
							}
							// if is a moment
							if (event[property] instanceof moment) {
								parsedEvent[property] = parseMoment(event[property]);
								break;
							}
							parsedEvent[property] = event[property];
							break;
						}
					}
//					console.log('parsing event')
//					console.log(parsedEvent)
					return parsedEvent
				}

				function stringifyView(view) {
					return {
						name: view.name,
						title: view.title,
						start: parseMoment(view.start),
						end: parseMoment(view.end),
						intervalStart: parseMoment(view.intervalStart),
						intervalEnd: parseMoment(view.intervalEnd)
					}
				}

				/** 
				 * Create mouse event */
				function createMouseEvent() {
					// get element offset
					var element = calendar;
					var offset = element.offset();
					var x = offset.left;
					var y = offset.top;
					
				    var ev = document.createEvent('MouseEvent');
				    ev.initMouseEvent(
				          'click',
				          /*bubble*/true, /*cancelable*/true,
				          window, null,
				          x, y, x, y, /*coordinates*/
				          false, false, false, false, /*modifier keys*/
				          0/*button=left*/, null
				      );
					
					//event.initMouseEvent("click", false, true, window, 1, x, y, x, y);
					return ev;
				}

				/* internal API search for the given event in the calendar clientEvent */
				function getClientEvent(event) {
					var clientEvent;
					var clientEvents;

					if (!event) {
						// TODO log warning
						clientEvent = null;
					}

					if (event.id) { // find event by id
						// TODO there may be multiple events with the same id
						clientEvents = calendar.fullCalendar('clientEvents', event.id);
					} else {
						throw("Event id is required for this functionality");
						clientEvents = calendar.fullCalendar('clientEvents');
					}

					if (clientEvents && clientEvents.length === 1) {
						clientEvent = clientEvents[0];
					} else if (clientEvents && clientEvents.length > 1) {
						throw("Having multiple events with same id is not supported yet");
						console.log("Having multiple events with same id is not supported yet");
						for (var i = 0; i < clientEvents.length; i++) {
							// TODO provide old event and/or expose functionality to compare
							// return clientEvents[0];
						}
					} else {
						console.log("Could not find client event");
						clientEvent = null
					}
					return clientEvent
				}

				// TODO getCalendarOptions this works
				//				$scope.api.getFullCalendarOptions = function() {
				//					var copy
				//					var calendarOptions = getCalendarOptions()
				//					if (calendarOptions) {
				//						copy = { }
				//						for (var property in calendarOptions) {
				//							copy[property] = calendarOptions[property];
				//						}
				//					}
				//					console.log(copy)
				//					return calendarOptions;
				//				}

				//				$scope.$watch("model.events", function(newValue, oldValue) {
				//						if (newValue) {
				//							$scope.initFullCalendar();
				//						}
				//					});

				/* events object */
				if (!$scope.model.events) {
					$scope.model.events = []
				}

				//				/* set event Sources */
				//				$scope.eventSources = [$scope.model.events,
				//				//$scope.functionEventSource,
				//				$scope.model.eventSourceDataprovider,
				//				$scope.model.functionEventSourceDataprovider];

				/* **********************************************************************************************************
				 * Api
				 * **********************************************************************************************************/

				/* navigation api */
				$scope.api.select = function(startDate, endDate, allDay, resource) {
					// TODO calculate if is a full day or not
					calendar.fullCalendar('select', startDate, endDate, resource);
				}

				$scope.api.unselect = function() {
					calendar.fullCalendar('unselect');
				}

				$scope.api.getView = function() {
					var view = calendar.fullCalendar('getView');
					return stringifyView(view)
				}

				// TODO test
				$scope.api.changeView = function(viewName) {
					// console.log($scope.model.calendarOptions);
					calendar.fullCalendar('changeView', viewName);
				}

				/**
				 * Change a calendar option.
				 * Supported options: <i> height, contentHeight, aspectRatio </i>
				 * <br>
				 * <br>
				 * <code>//set the calendar height to 600</code>
				 * <br/>
				 * <code>calendar.option('height', 600)</code>
				 * <br/>
				 * <br/>
				 * @param {String} option
				 * @param {Object} value
				 *
				 *  */
				$scope.api.option = function(option, value) {
					calendar.fullCalendar('option', option, value);
				}

				$scope.api.getDate = function() {
					return parseMoment(calendar.fullCalendar('getDate'));
				}

				$scope.api.incrementDate = function(years, months, days) {
					// TODO translate into duration
					var duration = { }
					if (years) duration.years = years
					if (months) duration.months = months
					if (days) duration.days = days
					calendar.fullCalendar('incrementDate', moment.duration(duration));
				}

				$scope.api.gotoDate = function(date) {
					//					var date
					//					if (dateOrYears instanceof Date) {
					//						date = dateOrYears
					//					} else {
					//						date = new Date(dateOrYears, months, days)
					//					}
					calendar.fullCalendar('gotoDate', date);
				}

				$scope.api.nextYear = function() {
					calendar.fullCalendar('nextYear');
				}

				$scope.api.prevYear = function() {
					calendar.fullCalendar('prevYear');
				}

				$scope.api.today = function() {
					calendar.fullCalendar('today');
				}

				$scope.api.next = function() {
					calendar.fullCalendar('next');
				}

				$scope.api.prev = function() {
					calendar.fullCalendar('prev');
				}

				/* events api */

				/**
				 * Returns event rendered in the calendar
				 * @param {Object} [id]
				 *
				 * @return {Array<EventType>}
				 * */
				$scope.api.clientEvents = function(id) {
					var clientEvents = calendar.fullCalendar('clientEvents', id);
					var result = []
					for (var i = 0; i < clientEvents.length; i++) {
						result.push(stringifyEvent(clientEvents[i]))
					}
					return result;
				}

				// TODO the component API should not modify the dataprovider
				$scope.api.renderEvent = function(event, stick) {
					//console.log("API: render event");
					//console.log(event);
					
					var eventSource;
					if (event.source) {	// find eventSource by id
						var source = event.source;
						if (typeof(source) === 'string' || typeof(source) === 'number') {
							eventSource = getEventSourcesById(source);
						} else {
							eventSource = getEventSourcesById(source.id);
						}
						// TODO eventSource not found: what to do ? throw an exception !!
					}

					// FIXME: is this a bug of fullcalendar ?
					delete event.source;

					// TODO should search for the eventSource to be rendered into
					calendar.fullCalendar('renderEvent', event, stick);

					// this is a workaround to delete event.source
					if (eventSource && event.id) {
						var clientEvent = getClientEvent(event);
						if (clientEvent) {
							clientEvent.source = eventSource;
							calendar.fullCalendar('updateEvent', clientEvent);
						} else {
							throw 'something went wrong'
						}
					}
				}

				/**
				 * Update the given event which is rendered in the client
				 * @param {Object} event
				 *
				 * @return {Boolean}
				 * */
				$scope.api.updateEvent = function(event) {
					if (!event) {
						return false;
					}
					var clientEvent = getClientEvent(event);
					if (clientEvent) {
						var property;
						// remove old properties from the clientSide event
						var originalClientEvent = stringifyEvent(clientEvent);
						for (property in originalClientEvent) {
							// TODO should remove other properties ?
							delete clientEvent[property];
						}
						// set new properties to the event
						for (property in event) {
							clientEvent[property] = event[property];
						}
						
						// if event contains source id findSource by id and link it to the event
						if (event.source && (typeof(event.source) === 'string' || typeof(event.source) === 'number')) {
							var eventSource = getEventSourcesById(event.source);
							clientEvent.source = eventSource;
						}
						
						// FIX fullcalendar remap resourceIds to resourceId;
						if (clientEvent.resourceIds && clientEvent.resourceIds.length === 1) {
							clientEvent.resourceId = clientEvent.resourceIds[0];
							delete clientEvent.resourceIds;
						}

						calendar.fullCalendar('updateEvent', clientEvent);
					} else {
						return false
					}
					return true;
				}

				// TODO the component API should not modify the dataprovider
				/**
				 * If id is omitted, all events are removed.
				 * If id is an ID, all events with the same ID will be removed.
				 *
				 * */
				$scope.api.removeEvents = function(id) {
					// TODO remove events from the event object if removed.
					// TODO what if event is removed from an array eventSource.
					calendar.fullCalendar('removeEvents', id)
				}

				/**
				 * @param {Object} eventSource
				 *
				 *  */
				$scope.addEventSource = function(eventSource) {
					if (eventSource) {
						// in the controller or link functions you can use that then
						//						 $scope.svyServoyapi.callServerSideApi("addEventSource",[eventSource]).then(function(retValue) {
						//							if (retValue == true) {

						var parsedEventSource = eventSource;
						if (eventSource.events && eventSource.events.script) { // remove it from function eventSources
							parsedEventSource = transformFunctionEventSource(eventSource);
						} else if (eventSource.events instanceof Array) {
						} else if (eventSource.googleCalendarId && eventSource.googleCalendarId instanceof String) {
						} else {
						}
						$scope.eventSources.push(parsedEventSource);

						calendar.fullCalendar('addEventSource', parsedEventSource);
						//							} else {
						//								console.log("could not remove eventSource " + id)
						//							}
						//						 });
					}

					//					var parsedEventSource = eventSource;
					//					if (eventSource.events) {
					//						var modelEventSources
					//						// find type of eventSource
					//						if (eventSource.events.script) { // remove it from function eventSources
					//							modelEventSources = $scope.model.functionEventSources;
					//							parsedEventSource = transformFunctionEventSource(eventSource);
					//						} else if (eventSource.events instanceof Array) {
					//							modelEventSources = $scope.model.arrayEventSources;
					//						} else if (eventSource.events instanceof String) {
					//							// TODO
					//						} else {
					//							// TODO could not find eventSource;
					//						}
					//
					//						// removed eventSource from calendar and from cache
					//						calendar.fullCalendar('addEventSource', parsedEventSource);
					//						modelEventSources.push(eventSource);	// remove original eventSource
					//						$scope.eventSources.push(parsedEventSource);	// remove eventSource from scope
					//						// TODO apply a change to the eventSource will trigger a refresh of the calendar
					//						// $scope.svyServoyapi.apply("functionEventSources");
					//						// TODO delete it from array
					//						// $scope.svyServoyapi.apply("arrayEventSources")
					//					}
				}

				/**
				 * @param {Object} id
				 *
				 *  */
				$scope.api.removeEventSource = function(id) {
					var index = getEventSourcesIndexById(id);
					var eventSource = $scope.eventSources[index];
					if (eventSource) {
						// call the server side API to persist the change in the calendarOptions object
						$scope.svyServoyapi.callServerSideApi("removeEventSource", [id]).then(function(retValue) {
							if (retValue == true) {
								// remove eventSource
								calendar.fullCalendar('removeEventSource', eventSource);
								$scope.eventSources.splice(index, 1);
							} else {
								console.log("could not remove eventSource " + id)
							}
						});
					}

					//					// TODO remove eventSource from scope
					//					var index = getEventSourcesIndexById(id);
					//					if (index >= 0) {
					//						var eventSource = $scope.eventSources[index]
					//
					//						var modelEventSources
					//						if (eventSource.events) {
					//
					//							// find type of eventSource
					//							if (eventSource.events instanceof Function) { // remove it from function eventSources
					//								modelEventSources = $scope.model.functionEventSources;
					//							} else if (eventSource.events instanceof Array) {
					//								modelEventSources = $scope.model.arrayEventSources;
					//							} else if (eventSource.events instanceof String) {
					//								// TODO
					//							} else {
					//								// TODO could not find eventSource;
					//							}
					//
					//							// removed eventSource from calendar and from cache
					//							for (var i = 0; modelEventSources && i < modelEventSources.length; i++) {
					//								if (modelEventSources[i].id === id) {
					//									calendar.fullCalendar('removeEventSource', eventSource);
					//									modelEventSources.splice(i, 1);	// remove original eventSource
					//									$scope.eventSources.splice(index,1);	// remove eventSource from scope
					//									// TODO apply a change to the eventSource will trigger a refresh of the calendar
					//									// $scope.svyServoyapi.apply("functionEventSources");
					//									// TODO delete it from array
					//									// $scope.svyServoyapi.apply("arrayEventSources")
					//									return true;
					//								}
					//							}
					//						}
					//					}
					//					return false;

				}

				/**
				 * @param {String} id
				 * @returns {Object}
				 *
				 *  */
				function getEventSourcesById(id) {
					var index = getEventSourcesIndexById(id)
					if (index >= 0) {
						return $scope.eventSources[index];
					}
					return null;
				}

				function getEventSourcesIndexById(id) {
					for (var i = 0; $scope.eventSources && i < $scope.eventSources.length; i++) {
						var eventSource = $scope.eventSources[i];
						if (eventSource.id === id) {
							return i;
						}
					}
					return null;
				}

				$scope.api.rerenderEvents = function() {
					calendar.fullCalendar('rerenderEvents');
				}

				$scope.api.refetchEvents = function() {
					calendar.fullCalendar('refetchEvents');
				}

				$scope.api.render = function() {
					calendar.fullCalendar('render');
				}

				/* Scheduler API */
				$scope.addResource = function(resource, scroll) {
					// call the server side API to persist the resource in the calendarOptions object
//					$scope.svyServoyapi.callServerSideApi("addResource", [resource]).then(function(retValue) {
//						if (retValue == true) {		// add resource
							calendar.fullCalendar('addResource', resource, scroll);
//						} else {
//							console.log("could not add resource " + resource.id + ' ' + resource.title);
//						}
//					});
				}
				
				$scope.api.removeResource = function(id) {
					// call the server side API to persist the resource in the calendarOptions object
					$scope.svyServoyapi.callServerSideApi("removeResource", [id]).then(function(retValue) {
						if (retValue == true) { 	// remove resource
							calendar.fullCalendar('removeResource', id);
						} else {
							console.log("could not remove resource " + id);
						}
					});
				}

				//				/** @deprecated
				//				 * use render instead */
				//				$scope.api.refreshCalendar = function() {
				//					$scope.initFullCalendar();
				//				}

			},
			link: function($scope, $element, $attrs) {

				$scope.$watch("model.calendarOptions", function(newValue, oldValue) {
						// TODO a possible solution would be to collect options and resources in a single object from a Server side API.
						// console.log("watch calendarOptions hasToDraw " + $scope.model.hasToDraw + " -> " + false)

						if (newValue) {
							$scope.initFullCalendar();
							// reset hasToDraw option
							$scope.$evalAsync(function() {
								$scope.model.hasToDraw = false;
								$scope.svyServoyapi.apply("hasToDraw");
							});
						}
					});

				$scope.$watch("model.calendarOptions.eventSources.length", function(newValue, oldValue) {
						// TODO a possible solution would be to collect options and resources in a single object from a Server side API.
						// console.log("eventSources is changed " + oldValue + " -> " + newValue)
						// console.log("watch eventSources hasToDraw " + $scope.model.hasToDraw + " -> " + false)

						// checking the length is necessary to understand if eventSource has been added
						if (!$scope.model.hasToDraw && (newValue - oldValue === 1 || (newValue == 1 && oldValue === undefined))) { // if hasToDraw is true if fullCalendar constructor has been called
							var eventSource = $scope.model.calendarOptions.eventSources[newValue - 1];

							// if the eventSource is of type Function read it from the functionEventSources
							if (! (eventSource.events instanceof Array) && ! (typeof(eventSource.googleCalendarId) === "string")) {
								eventSource = $scope.model.functionEventSources[$scope.model.functionEventSources.length - 1];
							}

							$scope.addEventSource(eventSource);
						}
					});
				
				$scope.$watch("model.calendarOptions.resources.length", function(newValue, oldValue) {
					// TODO a possible solution would be to collect options and resources in a single object from a Server side API.
					// console.log("resource is changed" + oldValue + " -> " + newValue)

					// checking the length is necessary to understand if resource has been added
					if (!$scope.model.hasToDraw && (newValue - oldValue === 1 || (newValue == 1 && oldValue === undefined))) { // if hasToDraw is true if fullCalendar constructor has been called
						var resource = $scope.model.calendarOptions.resources[newValue - 1];
						$scope.addResource(resource);
					}
				});

				//				$scope.$watch("model.arrayEventSources", function(newValue, oldValue) {
				//						if (newValue) {
				//							$scope.initFullCalendar();
				//						}
				//						// FIXME this trigger continuosly the watch
				//						//$scope.svyServoyapi.apply("eventSources");
				//					});
				//
				//				$scope.$watch("model.functionEventSources", function(newValue, oldValue) {
				//						console.log("change functionEventSources")
				//						if (newValue) {
				//							$scope.initFullCalendar();
				//						}
				//						// FIXME this trigger continuosly the watch
				//						//$scope.svyServoyapi.apply("eventSources");
				//					});
				//
				//				$scope.$watch("model.gcalEventSources", function(newValue, oldValue) {
				//					if (newValue) {
				//						$scope.initFullCalendar();
				//					}
				//					// FIXME this trigger continuosly the watch
				//					//$scope.svyServoyapi.apply("eventSources");
				//				});

				/* watcher */
				//				if ($scope.model.foundsetToShow) {
				//					$scope.$watch('model.foundsetToShow.serverSize', function(newValue) {
				//							var wanted = Math.min(newValue, 10);
				//							if (wanted > $scope.model.foundsetToShow.viewPort.size) {
				//								$scope.model.foundsetToShow.loadRecordsAsync(0, wanted);
				//							}
				//						});
				//
				//					$scope.$watch('model.foundsetToShow.viewPort.size', function(newValue) {
				//							if (newValue == 0 && $scope.model.foundsetToShow.serverSize > 0) {
				//								var wanted = Math.min($scope.model.foundsetToShow.serverSize, 10);
				//								if (wanted > $scope.model.foundsetToShow.viewPort.size) {
				//									$scope.model.foundsetToShow.loadRecordsAsync(0, wanted);
				//								}
				//							}
				//						});
				//
				//					/* this watch is too expensive. */
				//					$scope.$watch('model.foundsetToShow.viewPort.rows', function(newValue) {
				//							getFoundsetEvents();
				//						}, true);
				//				}

				//				function getFoundsetEvents() {
				//					console.log('clear foundset events')
				//					var rows = $scope.model.foundsetToShow.viewPort.rows
				//					var row;
				//					$scope.foundsetEventSource.events.length = 0
				//					for (var i = 0; i < rows.length; i++) {
				//						row = rows[i];
				//						// TODO populate the event
				//						$scope.foundsetEventSource.events.push({
				//							title: row.title,
				//							start: row.start,
				//							end: row.end,
				//							allDay: row.allDay
				//						});
				//
				//						console.log(row)
				//					}
				//				}

			},
			templateUrl: 'fullcalendarcomponent/fullcalendar/fullcalendar.html',
			replace: true
		};
	});