{
	"name": "svy-fullcalendar",
	"displayName": "FullCalendar",
	"icon" : "fullcalendarcomponent/fullcalendar/fullcalendar.png",
	"definition": "fullcalendarcomponent/fullcalendar/fullcalendar.js",
	"serverscript": "fullcalendarcomponent/fullcalendar/fullcalendar_server.js",
	"libraries": [{ 
			"name":"moment", 
			"version":"2.19.1", 
			"url": "fullcalendarcomponent/fullcalendar/lib/moment.min.js", 
			"mimetype":"text/javascript"
		},{
			"name": "fullcalendar.css",
			"version": "3.8.2",
			"url": "fullcalendarcomponent/fullcalendar/lib/fullcalendar.min.css",
			"mimetype": "text/css"
		},{
			"name": "fullcalendar.js",
			"version": "3.8.2",
			"url": "fullcalendarcomponent/fullcalendar/lib/fullcalendar.min.js",
			"mimetype": "text/javascript"
		},{
			"name": "gcal.js",
			"version": "3.8.2",
			"url": "fullcalendarcomponent/fullcalendar/lib/gcal.js",
			"mimetype": "text/javascript"
		},{
			"name": "fullcalendar.lang.js",
			"version": "3.8.2",
			"url": "fullcalendarcomponent/fullcalendar/lib/locale-all.js",
			"mimetype": "text/javascript"
		}],
	"version": 1,
	
	"model":
	{
		"hasToDraw": {"type":"boolean", "pushToServer" : "allow", "tags": {"scope": "private"}},
		"renderOnCurrentView": {"type":"boolean", "pushToServer" : "allow", "tags": {"scope": "private"}},
		"calendarOptions" : {"type":"FullCalendarOptions", "pushToServer" : "allow", "tags": {"scope": "private"}},
		"view" : {"type" : "object", "pushToServer": "allow", "tags" : {"scope" : "private"}},
		"events": {"type": "EventType[]", "tags" : {"scope" : "private"}},
		
		"eventSources" : {"type": "ArrayEventSourceType[]", "tags" : {"scope" : "private"}},
		
		"arrayEventSources" : {"type": "ArrayEventSourceType[]", "tags" : {"scope" : "private"}},
		"functionEventSources" : {"type": "FunctionEventSourceType[]", "tags" : {"scope" : "private"}},
		"gcalEventSources" : {"type": "GoogleCalendarEventSourceType[]", "tags" : {"scope" : "private"}},
		"styleClass" : {"type": "styleclass"},
		"tooltipExpression" : {"type": "tagstring"},
		
	    "location" : {"type" :"point", "pushToServer": "deep"}, 
		"size": {
			"type": "dimension",
			"default": {
				"width": 600,
				"height": 400
			}
		}
	},
	"handlers": {
		"onSelectMethodID": {
			"parameters" : [{
					"type": "date",
				 	"name": "start"
				 }, {
					"type": "date",
					"name": "end"
				 }, {
				 	"type": "JSEvent",
				 	"name": "event"
				 }, {
				 	"type": "ViewType",
				 	"name": "view"
				 }, {
				 	"type": "ResourceType",
				 	"name": "resource",
				 	"optional" : true
				}]
		},
		"onDayClickMethodID": {
			"parameters" : [{
					"type": "date",
				 	"name": "date"
				 }, {
				 	"type": "JSEvent",
				 	"name": "event"
				 }, {
				 	"type": "ViewType",
				 	"name": "view"
				 }, {
				 	"type": "ResourceType",
				 	"name": "resource",
				 	"optional" : true
				}]
		},
		"onEventClickMethodID": {
			"parameters" : [{
					"type": "EventType",
				 	"name": "eventObject"
				 }, {
				 	"type": "JSEvent",
				 	"name": "event"
				 }, {
				 	"type": "ViewType",
				 	"name": "view"
				}]
		},
		"onEventRightClickMethodID": {
			"parameters" : [{
					"type": "EventType",
				 	"name": "eventObject"
				 }, {
				 	"type": "JSEvent",
				 	"name": "event"
				 }, {
				 	"type": "ViewType",
				 	"name": "view"
				}]
		},
		"onEventResizeMethodID": {
			"parameters" : [{
					"type": "EventType",
				 	"name": "eventObject"
				 }, {
					"type": "int",
					"name": "delta"
				 }, {
				 	"type": "JSEvent",
				 	"name": "event"
				 }, {
				 	"type": "ViewType",
				 	"name": "view"
				}]
		},
		"onEventDropMethodID": {
			"parameters" : [{
					"type": "EventType",
				 	"name": "eventObject"
				 }, {
					"type": "int",
					"name": "delta"
				 }, {
				 	"type": "JSEvent",
				 	"name": "event"
				 }, {
				 	"type": "ViewType",
				 	"name": "view"
				}]
		},
		"onViewRenderMethodID": {
			"parameters" : [{
					"type": "ViewType",
				 	"name": "view"
				 },{
				 	"type": "JSEvent",
				 	"name": "event"
				 }]
		}
	},
	"api": {
		"fullCalendar" : {
			"parameters" : [{
				"name": "calendarOptions",
				"type": "FullCalendarOptions"
				}, {
				"name": "renderOnCurrentView",
				"type": "boolean",
				"optional" : true
				}]
		},
		"getFullCalendarOptions" : {
			"returns": "FullCalendarOptions"
		},
		"updateFullCalendar" : {
			"parameters" : [{
								"name":"option",
                                "type":"string"
                                }, {                                                                
                                "name":"value",
                                "type":"object"
                                }
			]
		},
         	"select": {
            	"parameters": [{
                                "name":"startDate",
                                "type":"date"
                                }, {                                                                
                                "name":"endDate",
                                "type":"date",
                                "optional" : true
                                }, {                                                                
                                "name":"allDay",
                                "type":"boolean",
                                "optional" : true
                                }, {
                                "name":"resourceId",
                                "type":"object",
                                "optional" : true
                              }],
                 "delayUntilFormLoad": true
            },
            "unselect": {
            	"delayUntilFormLoad": true
            },
            "getView": {
            	"returns": "ViewType",
            	"delayUntilFormLoad": true
            },
            "changeView": {
            	        "parameters":[{                                                                
                                "name":"viewName",
                                "type":"string"
                              }],
                "delayUntilFormLoad": true
            },
            
            "option": {
                      "parameters":[{                                                                
                                "name":"option",
                                "type":"string"
                              }, {                                                                
                                "name":"value",
                                "type":"object"
                              }],
                "delayUntilFormLoad": true
            },
            
            "next": {
            	"delayUntilFormLoad": true
            },
            "prev": {
            	"delayUntilFormLoad": true
            },
            "prevYear": {
            	"delayUntilFormLoad": true
            },
            "nextYear": {
            	"delayUntilFormLoad": true
            },
            "today": {
            	"delayUntilFormLoad": true
            },
            "getDate": {
            	"returns": "date",
            	"delayUntilFormLoad": true
            },
            "gotoDate": {
                      "parameters":[{
                                "name":"date",
                                "type":"date"
                                }],
                "delayUntilFormLoad": true 
            },
            "incrementDate": {
                "parameters":[{                                                                
                                "name":"years",
                                "type":"int",
                                "optional": true
                                }, {                                                                
                                "name":"months",
                                "type":"int",
                                "optional": true
                                }, {                                                                
                                "name":"days",
                                "type":"int",
                                "optional": true
                                }],
                "delayUntilFormLoad": true
            },

            
            "clientEvents": {
            		"returns" : "EventType []",
             		"parameters":[{                                                                
                                "name":"id",
                                "type":"string",
                                "optional": true
                                }],
                    "delayUntilFormLoad": true
            },
            "renderEvent": {
 					"parameters":[{                                                                
                                "name":"event",
                                "type":"EventType"
                                }, {                                                                
                                "name":"stick",
                                "type":"boolean",
                                "optional": true
                             }],
                    "returns" : "boolean",
                    "delayUntilFormLoad": true         
             },
            "updateEvent": {
            		"parameters":[{                                                                
                                "name":"event",
                                "type":"EventType"
                                }],
                    "returns" : "boolean",
                    "delayUntilFormLoad": true      
            },
            "removeEvents": {
            		"parameters":[{                                                                
                                "name":"id",
                                "type":"object"
                             }],
                    "delayUntilFormLoad": true  
            },
            "addEventSource": {
            	     "parameters":[{                                                                
                                "name":"eventSource",
                                "type":"EventSourceType"
                                }] 
            },
            "removeEventSource": {
            	    "parameters":[{                                                                
                                "name":"id",
                                "type":"object"
                              }],
                    "delayUntilFormLoad": true
            },
            "rerenderEvents": {
            	"delayUntilFormLoad": true
            },
            "refetchEvents": {
            	"delayUntilFormLoad": true
            },
            "render" : {
            	"delayUntilFormLoad": true
            },
            "addResource": {
            	     "parameters":[{                                                                
                                "name":"resource",
                                "type":"ResourceType"
                                }]
            },
            "removeResource": {
            	    "parameters":[{                                                                
                                "name":"id",
                                "type":"object"
                              }],
                    "delayUntilFormLoad": true
            }
		},
	"types": {
		"EventType": {
			"id" : "object",
			"title": "tagstring",
			"start": "date",
			"end": "date",
			"allDay" : "boolean",
			"className" : "object",
			"editable" : "boolean",
			"startEditable" : "boolean",
			"durationEditable" : "boolean",
			"rendering" : "string",
			"overlap" : "boolean",
			"constraint" : "BusinessHours",
			"color": "color",
			"backgroundColor": "color",
			"borderColor": "color",
			"textColor" : "color",
			"resourceIds" : "object",
			"data" : "object"
	 	},
	 	"ResourceType": {
			"id" : "object",
			"title" : "tagstring",
			"eventColor": "color",
			"eventBackgroundColor": "color",
			"eventBorderColor": "color",
			"eventTextColor" : "color",
			"eventClassName" : "styleclass",
			"children" : "object",
			"parentId" : "object",
			"parent" : "object"
	 	},
	 	"EventSourceType" : {
	 	    "id"  : "object",        
	 	    "events" : "object",
            "googleCalendarId": "string",
            "googleCalendarApiKey": "string",
            "className" : "string[]",
            "allDayDefault" : "boolean",
			"editable" : "boolean",
			"startEditable" : "boolean",
			"durationEditable" : "boolean",
			"rendering" : "string",
			"overlap" : "boolean",
			"constraint" : "BusinessHours",
			"color": "color",
			"backgroundColor": "color",
			"borderColor": "color",
			"textColor" : "color",
			"data" : "object"
	 	}, 	
      	"ArrayEventSourceType": {
      		"id"  : "object",
            "events": "EventType[]",
            "className" : "string[]",
            "allDayDefault" : "boolean",
			"editable" : "boolean",
			"startEditable" : "boolean",
			"durationEditable" : "boolean",
			"rendering" : "string",
			"overlap" : "boolean",
			"constraint" : "BusinessHours",
			"color": "color",
			"backgroundColor": "color",
			"borderColor": "color",
			"textColor" : "color",
			"data" : "object"
      	},
      	"FunctionEventSourceType": {
      	    "id"  : "object",
            "events": "function",
            "className" : "string[]",
            "allDayDefault" : "boolean",
			"editable" : "boolean",
			"startEditable" : "boolean",
			"durationEditable" : "boolean",
			"rendering" : "string",
			"overlap" : "boolean",
			"constraint" : "BusinessHours",
			"color": "color",
			"backgroundColor": "color",
			"borderColor": "color",
			"textColor" : "color",
			"data" : "object"
        },
        "GoogleCalendarEventSourceType": {
      		"id"  : "object",        
            "googleCalendarId": "string",
            "googleCalendarApiKey": "string",
            "className" : "string[]",
            "allDayDefault" : "boolean",
			"editable" : "boolean",
			"startEditable" : "boolean",
			"durationEditable" : "boolean",
			"rendering" : "string",
			"overlap" : "boolean",
			"constraint" : "BusinessHours",
			"color": "color",
			"backgroundColor": "color",
			"borderColor": "color",
			"textColor" : "color",
			"data" : "object"
        },
        "ViewType": {
            "name": "string",
	  		"title": "string",
	  		"start": "date",
	  		"end": "date",
	  		"intervalStart": "date",
	 		"intervalEnd": "date",
	 		"defaultDate": {"type": "date", "tags": {"scope" : "private"}}
        },
        "Header": {
        	"left": "string",
        	"center": "string",
        	"right" : "string"
        },
        "BusinessHours" : {
           	"start": "string",
           	"end": "string",
    		"dow": "int[]"
        },
        "FullCalendar": {
        	"options" : "FullCalendarOptions"
        },
        "FullCalendarOptions" : {
        	"allDayText": {"type" :"tagstring"},
        	"allDaySlot": {"type" :"boolean"},
        	"allDayDefault": {"type" :"boolean"},
        	"aspectRatio": {"type" :"double"},
        	"businessHours": {"type" :"BusinessHours"},
        	"buttonText": {"type" :"object"},
        	"contentHeight": {"type" :"object"},
        	"defaultAllDayEventDuration": {"type" :"object"},
        	"defaultTimedEventDuration": {"type" :"string"},
        	"defaultDate": {"type" :"date"},
        	"defaultView": {"type" :"string"},
        	"dayNames": {"type" :"string[]"},
        	"dayNamesShort": {"type" :"string[]"},
        	"displayEventEnd": {"type" :"boolean"},
        	"displayEventTime": {"type" :"boolean"},
        	"dayPopoverFormat": {"type" :"string"},
        	"dragOpacity": {"type" :"float"},
        	"dragRevertDuration": {"type" :"int"},
        	"dragScroll": {"type" :"boolean"},
			"editable": {"type" :"boolean"},   
			"eventDurationEditable": {"type" :"boolean"}, 
			"eventStartEditable": {"type" :"boolean"},
			"eventConstraint": {"type" :"object"}, 		 	
        	"eventLimit" : {"type" :"int"},
        	"eventLimitClick" : {"type" :"string"},
        	"eventLimitText" : {"type" :"string"},
        	"eventOverlap": {"type" :"boolean"},  
        	"eventSources" : {"type" :"EventSourceType[]"},
			"firstDay": {"type" :"int"},
			"fixedWeekCount": {"type" :"boolean"},
			"forceEventDuration": {"type" :"boolean"},
        	"handleWindowResize": {"type" :"boolean"},       	
        	"header" : {"type" :"object"},
        	"hiddenDays" : {"type" : "int[]"},
        	"locale": {"type" :"string"},
        	"lazyFetching": {"type" :"boolean"},
        	"isRTL": {"type" :"boolean"},
        	"longPressDelay" : {"type" : "int"},
			"minTime": {"type" :"string"},
			"maxTime": {"type" :"string"},
			"monthNames": {"type" :"string[]"},
			"monthNamesShort": {"type" :"string[]"},
			"nowIndicator": {"type" :"boolean"},
			"unselectAuto": {"type" :"boolean"},
			"unselectCancel": {"type" :"string"},
			"scrollTime": {"type" :"string"},
			"selectable": {"type" :"boolean"},
			"selectConstraint": {"type" :"object"},
			"selectHelper": {"type" :"boolean"},
			"selectOverlap": {"type" :"boolean"},
			"slotDuration": {"type" :"string"},
			"slotLabelFormat": {"type" :"string"},
			"slotLabelInterval": {"type" :"string"},
			"slotEventOverlap": {"type" :"boolean"},
			"snapDuration": {"type" :"string"},
			"timeFormat": {"type" :"object"},
			"weekends": {"type" :"boolean"},
			"weekNumbers": {"type" :"boolean"},
			"weekNumberCalculation": {"type" :"string"},
			"weekNumberTitle": {"type" :"string"},
			"views": { "type" : "object"},
		
			"resources" : {"type" :"ResourceType[]"},
			"resourceAreaWidth" : {"type" :"string"},
			"resourceLabelText" : {"type" :"string"},
			"resourceOrder" : {"type" :"string"},
			"resourceGroupField" : {"type" :"string"},
			"groupByResource" : {"type" :"boolean"},
			"groupByDateAndResource" : {"type" :"boolean"},
			"slotWidth" : {"type" :"string"}
			
        }
	}
}