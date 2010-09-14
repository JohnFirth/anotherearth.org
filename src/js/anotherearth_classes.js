// Copyright 2010, John Firth. Licensed under BSD (http://www.anotherearth.org/license.txt)
// Incorporates:
// Translator.js Copyright 2008 Ariel Fleischer.
// jQuery.js Copyright 2010 John Resig.
// jQuery-ui.js Copyright 2010 Copyright 2009 various authors (http://jqueryui.com/about) 
// ui-dropdown-checklist.js Copyright 2008-2009 Adrian Tosca

google.load("maps",     "2");//solely for google.maps.Language
google.load("earth",    "1");
google.load("language", "1");
google.load("search",   "1");

//TODO: organise classes into subdirectory equivalents
//TODO: revise verbose variable names
//TODO: look into enum equivalent

var org = window.org || {};
if (typeof org.anotherearth !== 'undefined') {
	throw new Error("org.anotherearth already exists.");
}

org.anotherearth = {
	//CONSTANTS
	JAVASCRIPT_DISABLED_MESSAGE_ID:	 'js_disabled_message',
	L_EARTH_ID:                      'left_earth',
	R_EARTH_ID:                      'right_earth',
	L_EARTH_SEARCH_BOX_ID:           'l_earth_search',
	R_EARTH_SEARCH_BOX_ID:           'r_earth_search',
	CP_ID:                           'control_panel',
	CP_HEADER_ID:                    'control_panel_header',
	CP_BUTTONS_CONTAINER_ID:         'control_panel_widgets',
	CP_UNDO_BUTTON_ID:               'undo',
	CP_REDO_BUTTON_ID:               'redo',
	CP_L_EARTH_EXTRAS_SELECTOR_ID:   'left_earth_extras_selector',
	CP_R_EARTH_EXTRAS_SELECTOR_ID:   'right_earth_extras_selector',
	CP_LINK_CREATOR_BUTTON_ID:       'link_creator',
	CP_LINK_BOX_ID:                  'link_box',
	CP_LINK_CREATOR_CONTAINER_ID:    'link_creator_container',
	CP_ALTITUDE_LOCK_CHECKBOX_ID:    'altitude_lock',
	CP_VIEW_CENTER_LOCK_CHECKBOX_ID: 'view_center_lock',
	CP_TILT_LOCK_CHECKBOX_ID:        'tilt_lock',
	CP_HEAD_LOCK_CHECKBOX_ID:        'heading_lock',
	CP_EARTH_OPTIONS_SUB_PANEL_ID:   'earth_options',
	CP_MISC_OPTIONS_SUB_PANEL_ID: 	 'misc_options',
	CP_SEARCH_BOX_SUB_PANEL_ID:      'search_boxes',
	WELCOME_PANEL_ID:                'welcome_panel',
	WELCOME_PANEL_HEADER_ID:         'welcome_panel_header',
	WELCOME_PANEL_BODY_ID:           'welcome_panel_body',
	CP_CAMERA_PROPERTY_LOCKING_SUB_PANEL_ID: 'camera_propety_locking_checkboxes',
	CP_CAMERA_PROPERTY_COPYING_SUB_PANEL_ID: 'camera_property_copying_buttons',
	EQUATE_CAM_ALTITUDES_BUTTON_ID: 'equate_camera_altitudes',
	EQUATE_CAM_LATS_LNGS_BUTTON_ID: 'equate_camera_latitudes_and_longitudes',
	EQUATE_CAM_TILTS_BUTTON_ID:     'equate_camera_tilts',
	EARTH_CANVAS_CLASS:      'earth_canvas',
	CP_OPEN_ICON_CLASS:      'ui-icon-arrowthickstop-1-n',
	CP_SHUT_ICON_CLASS:      'ui-icon-arrowthickstop-1-s',
	CP_CAPTION_BUTTON_CLASS: 'control_panel_caption_button',
	SUB_PANEL_CAPTION_BUTTON_CLASS: 'sub_panel_caption_button',
	SUB_PANEL_SHUT_ICON_CLASS: 'ui-icon-circle-triangle-e',
	SUB_PANEL_OPEN_ICON_CLASS: 'ui-icon-circle-triangle-s',
	PANEL_TITLE_CLASS:       'panel_title',
	SEARCH_BOX_CLASS:        'search_box',
	PLUGIN_INCOMPATIBILITY_MESSAGE_ID:  'plugin_incompatibility_message',
	JS_INCOMPATIBILITY_MESSAGE_ID:      'js_incompatibility_message',
	PLAIN_HTML_MESSAGE_ID:              'html_welcome_message',
	DEFAULT_L_EARTH_COORDS: {
		LAT: 33.43,
		LNG: 61.24,
		ALT: 10400000,
		TILT: 0,
		HEAD: 0
	},
	DEFAULT_R_EARTH_COORDS: {
		LAT: 9.61,
		LNG: -78.33,
		ALT: 10400000,
		TILT: 0,
		HEAD: 0
	}		
};
/*CLASS DEFINITIONS - separate for unit testing:*/

/*utility classes*/
/*org.anotherearth.Interface = function(name, methods) {//constructor
	if(arguments.length != 2) {
		throw new Error("Interface constructor called with " + arguments.length
				+ "arguments, but expected exactly 2.");
	}

	this.name = name;
	this.methods = [];

	for(var i = 0, len = methods.length; i < len; i++) {
		if(typeof methods[i] !== 'string') {
				throw new Error("Interface constructor expects method names to be " 
						+ "passed in as a string.");
		}
		this.methods.push(methods[i]);        
	}    
};    

org.anotherearth.Interface.ensureImplements = function(object) {// Static class method.
	if(arguments.length < 2) {
		throw new Error("Function Interface.ensureImplements called with " + 
				arguments.length  + "arguments, but expected at least 2.");
	}

	for(var i = 1, len = arguments.length; i < len; i++) {
		var thisInterface = arguments[i];//interface is a keyword reserved for later use
		if(thisInterface.constructor !== org.anotherearth.Interface) {
			throw new Error("Function Interface.ensureImplements expects arguments "   
					+ "two and above to be ges of Interface.");
		}

		for(var j = 0, methodsLen = thisInterface.methods.length; j < methodsLen; j++) {
			var method = thisInterface.methods[j];
			if(!object[method] || typeof object[method] !== 'function') {
				throw new Error("Function Interface.ensureImplements: " + object 
						+ "does not implement the " + thisInterface.name 
						+ " thisInterface. Method " + method + " was not found.");
			}
		}
	} 
};
*/

org.anotherearth.ArrayList = function() {
	var buffer = [];
	var args = arguments;
	if (args.length > 0) {
		this.buffer = args[0];
	}

	//inner class
	var _Iterator = function (buffer) {
		var table = buffer;
		var len = buffer.length;
		var index = 0;

		this.hasNext = function() {
			return (index < len);
		};

		this.next = function() {
			if (this.hasNext()) {
				return table[index++];
			}
			else {
				return null;
			}
		};
	};

	//privileged methods
	this.add = function(object) {
		buffer.push(object);
	};
	this.getLength = function() {
		return buffer.length;
	};
	this.indexOf = function(object) {
		for (var i = 0; i <= buffer.length; i++) {
			if (buffer[i] === object) {
				break;
			}
		}
		return i;
	};
	this.iterator = function() {
		return new _Iterator(buffer);//TODO: don't like creating a new one each time
	};
	this.remove = function(index) {
		buffer.splice(index, 1);
	};
}; 

org.anotherearth.NullIterator = function() {};
org.anotherearth.NullIterator.prototype = {
	next: function() {
		return null;
	},
	hasNext: function() {
		return false;
	}
};

org.anotherearth.IFrameGenerator = {};
org.anotherearth.IFrameGenerator.createFrame = function() {
	var iframe = document.createElement('iframe');
	iframe.setAttribute('allowtransparency', 'false');
	iframe.scrolling = 'no';
	iframe.frameBorder = '0';
	iframe.src = (navigator.userAgent.indexOf('MSIE 6') >= 0) ? '' : 'javascript:void(0);';
	iframe.style.position = 'absolute';
	iframe.style.opacity = 0;
	iframe.style.top = 0;
	iframe.style.left = 0;
	iframe.style.width = '100%';
	iframe.style.height = '100%';
	iframe.style.zIndex = -1;
		
	return iframe;
};

//INTERFACES
/*
org.anotherearth.Command           = new org.anotherearth.Interface('Command',           ['execute']);
org.anotherearth.GUIComposite      = new org.anotherearth.Interface('GUIComposite',      ['addChild', 'removeChild', 'show', 'hide', 'getContainingElement', 'createIterator']);
org.anotherearth.TwoEarthsObserver = new org.anotherearth.Interface('TwoEarthsObserver', ['performUndoRedoUpdate', 'performNewEarthPropsUpdate']);
org.anotherearth.GUIObject         = new org.anotherearth.Interface('GUIObject',         ['createGUIElements']);
org.anotherearth.GUIWidget         = new org.anotherearth.Interface('GUIWidget',         ['addClickEventListener', 'setIsEnabled', 'setTabIndex']);//extends GUIObject
org.anotherearth.Iterator          = new org.anotherearth.Interface('Interface',         ['next', 'hasNext']);
*/

//DISPLAY CLASSES
//implements TwoEarthsObserver, GUIComposite, GUIWidget and by extension GUIObject
org.anotherearth.ControlPanel = function(panelWidgetsContainerId, panelHeaderId, panelId, panelTitle, parentElement, isDraggable, isShrinkable, isMortal) {
	//private attributes
	var panel;

	//privileged methods
	this.addChild = function(controlPanelObject) {
		//org.anotherearth.Interface.ensureImplements(controlPanelObject, org.anotherearth.TwoEarthsObserver);
		panel.addChild(controlPanelObject);
	};
	this.closeSubPanels = function() {
		panel.closeSubPanels();
	};
	this.createGUIElements = function(panelWidgetsContainerId, panelHeaderId, panelId, panelTitle, parentElement) {
		panel.createGUIElements(panelWidgetsContainerId, panelHeaderId, panelId, panelTitle, parentElement);
	};
	this.getContainingElement = function() {
		return panel.getContainingElement();
	};
	this.performNewEarthPropsUpdate = function() {
		this.createIterator();
		var iterator = panel.getIterator();
		while (iterator.hasNext()) {
			iterator.next().performNewEarthPropsUpdate();
		}
	};
	this.performUndoRedoUpdate = function() {
		this.createIterator();
		var iterator = panel.getIterator();
		while (iterator.hasNext()) {
			iterator.next().performUndoRedoUpdate();
		}
	};
	this.removeChild = function(panelObject) {
		panel.removeChild(panelObject);
	};
	this.show = function() {
		panel.show();
	};
	this.hide = function() {
		panel.hide();
	};
	this.setTabIndex = function(initialTabIndex) {//TODO: should/could tab index be set with visitor pattern
		panel.setTabIndex(initialTabIndex);
	};
	this.createIterator = function() {
		panel.createIterator();
	};

	//constructor
	panel = new org.anotherearth.Panel(panelWidgetsContainerId, panelHeaderId, panelId, panelTitle, parentElement, isDraggable, isShrinkable, isMortal);
};

//Panel 'class' - with reference to the composite design pattern, a composite class
//implements GUIComposite, GUIWidget and by extension GUIObject
org.anotherearth.Panel = function(panelBodyId, panelHeaderId, panelId, panelTitle, parentElement, isDraggable, isShrinkable, isMortal) {
	//private attributes
	var panelBody, panel, iterator, iframe;
	var panelObjects = new org.anotherearth.ArrayList();
	var panelBodyId = panelBodyId;
	var panelHeaderId = panelHeaderId;
	var panelId = panelId;
	var panelTitle = panelTitle;
	var parentElement = parentElement;
	var isDraggable = isDraggable;
	var isShrinkable = isShrinkable;
	var isMortal = isMortal;
	var tabIndex = 1;
	var self = this;
	
	//private methods
	var _createDragHandle = function() {	
		var panelDragHandle = document.createElement('div');
		$(panelDragHandle).addClass(org.anotherearth.CP_CAPTION_BUTTON_CLASS).addClass('drag_handle').addClass('ui-state-default');
		var panelDragHandleSpan = document.createElement('span');
		$(panelDragHandleSpan).addClass('ui-icon').addClass('ui-icon-arrow-4-diag');
		panelDragHandle.appendChild(panelDragHandleSpan);
		$(panelDragHandle).bind('mouseleave mouseenter', function() {
			$(this).toggleClass('ui-state-hover');
		});
		$(panelDragHandle).bind('focus blur', function() {
			$(this).toggleClass('ui-state-focus');
		});
		$(panel).draggable({containment: 'window',
		                    handle: panelDragHandle,
		                    start:  function() {
										self.createIterator();
										while (iterator.hasNext()) {
											var next = iterator.next();
											if (next instanceof org.anotherearth.SelectBox) {
												next.hideDropDownList();
											}
										}
										$(panelDragHandle).addClass('ui-state-active');
									},
		                    stop:   function() {$(panelDragHandle).removeClass('ui-state-active');}
		                   });
		return panelDragHandle;
	};

	var _createShrinkingButton = function() {//TODO: refactor to eliminate repeated code in these caption buttons - compose with SimpleButton
		var shrinkingIcon = document.createElement('div');
		$(shrinkingIcon).addClass('ui-state-default').addClass(org.anotherearth.CP_CAPTION_BUTTON_CLASS);
		var shrinkingIconSpan = document.createElement('span');
		shrinkingIcon.appendChild(shrinkingIconSpan);
		$(shrinkingIconSpan).addClass('ui-icon').addClass(org.anotherearth.CP_OPEN_ICON_CLASS);
		$(shrinkingIcon).click(function() {
			self.createIterator();
			if ($(shrinkingIconSpan).hasClass(org.anotherearth.CP_SHUT_ICON_CLASS)) {
				while (iterator.hasNext()) {
					iterator.next().show();
				}
			}
			if (!$.support.leadingWhitespace) {//if is IE - else dropdown button icons are misaligned
				$(panelBody).show();
				}
			else {
				$(panelBody).slideToggle(175);
			}
			//Necessary to obtain size before closing in order to prevent shrinking caused by width: auto.
			if ($(shrinkingIconSpan).hasClass(org.anotherearth.CP_OPEN_ICON_CLASS)) {
				while (iterator.hasNext()) {
					iterator.next().hide();
				}
			}
			$(shrinkingIconSpan).toggleClass(org.anotherearth.CP_SHUT_ICON_CLASS).toggleClass(org.anotherearth.CP_OPEN_ICON_CLASS);
			return false;//else page reloads - suppressing default button action
		}).bind('mouseleave', function() {
			$(this).removeClass('ui-state-active');
		}).bind('mouseleave mouseenter', function() {
			$(this).toggleClass('ui-state-hover');
		}).bind('mousedown mouseup', function() {
			$(this).toggleClass('ui-state-active');
		}).bind('focus blur', function() {
			$(this).toggleClass('ui-state-focus');
		});
		return shrinkingIcon;
	};

	var _createKillingButton = function() {
		var killingButton = document.createElement('div');
		$(killingButton).addClass('ui-state-default').addClass(org.anotherearth.CP_CAPTION_BUTTON_CLASS);
		var killingButtonSpan = document.createElement('span');
		killingButton.appendChild(killingButtonSpan);
		$(killingButtonSpan).addClass('ui-icon').addClass('ui-icon-close');
		$(killingButton).click(function() {
			$(panel).remove();
			return false;//else page reloads - suppressing default button action
		}).bind('mouseleave', function() {
			$(this).removeClass('ui-state-active');
		}).bind('mouseleave mouseenter', function() {
			$(this).toggleClass('ui-state-hover');
		}).bind('mousedown mouseup', function() {
			$(this).toggleClass('ui-state-active');
		}).bind('focus blur', function() {
			$(this).toggleClass('ui-state-focus');
		});
		return killingButton;
	};

	//inner class
	var _PanelIterator = function(iterator) {
		//constructor
		//org.anotherearth.Interface.ensureImplements(iterator, org.anotherearth.Iterator);
		var iteratorArray = [];
		iteratorArray.push(iterator);

		//privileged methods
		this.next = function() {
			if (this.hasNext()) {
				var iterator = iteratorArray[iteratorArray.length-1];
				var component = iterator.next();
				if (/*component instanceof org.anotherearth.ControlPanelFieldSet ||*/
						component instanceof org.anotherearth.ShrinkableSubPanel) {
					iteratorArray.push(component.createIterator());	
				}
				return component;
			}
			else {
				return null;
			}
		};

		this.hasNext = function() {
			if (iteratorArray.length === 0) {
				return false;
			}
			else {
				var iterator = iteratorArray[iteratorArray.length-1];
				if (!iterator.hasNext()) {
					iteratorArray.pop();
					return this.hasNext();
				}
				else {
					return true;
				}
			}
		};
	};	

	//privileged methods
	this.addChild = function(panelObject) {
		//org.anotherearth.Interface.ensureImplements(panelObject, org.anotherearth.GUIComposite, org.anotherearth.GUIObject);
		panelObjects.add(panelObject);
		panelBody.appendChild(panelObject.getContainingElement());
	};
	this.closeSubPanels = function() {
		this.createIterator();
		while (iterator.hasNext()) {
			var next = iterator.next();
			if (next instanceof org.anotherearth.ShrinkableSubPanel) {
				next.close();
			}
		}
	};
	this.createGUIElements = function(panelBodyId, panelHeaderId, panelId, panelTitle, parentElement) {
		panel = document.createElement('form');//form solely to allow tab access
		panel.id = panelId;
		panel.setAttribute("z-index", "10");
		$(panel).addClass('panel').addClass('ui-widget').addClass('ui-widget-content');

		var panelHeader = document.createElement('div');
		panelHeader.id = panelHeaderId;
		$(panelHeader).addClass('panel_header');

		var panelTitleElement = document.createElement('h4');
		panelTitleElement.appendChild(document.createTextNode(panelTitle));
		$(panelTitleElement).addClass(org.anotherearth.PANEL_TITLE_CLASS);

		panelBody = document.createElement('div');
		panelBody.id = panelBodyId;

		if (isMortal) {
			panelHeader.appendChild(_createKillingButton());
		}
		if (isShrinkable) {
			panelHeader.appendChild(_createShrinkingButton());
		}
		if (isDraggable) {
			panelHeader.appendChild(_createDragHandle());
		}
		panelHeader.appendChild(panelTitleElement);
		panel.appendChild(panelHeader);
		panel.appendChild(panelBody);

		panel.style.display = 'none';
		
		iframe = org.anotherearth.IFrameGenerator.createFrame();
		panel.insertBefore(iframe, panel.firstChild);
		
		$(panel).bgiframe();

		parentElement.appendChild(panel);
	};
		
	this.getContainingElement = function() {
		return panel;
	};
	this.getIterator = function() {
		if (typeof iterator !== undefined) {
			return iterator;
		}
	};
	this.performNewEarthPropsUpdate = function() {
		this.createIterator();
		while (iterator.hasNext()) {
			iterator.next().performNewEarthPropsUpdate();
		}
	};
	this.performUndoRedoUpdate = function() {
		this.createIterator();
		while (iterator.hasNext()) {
			iterator.next().performUndoRedoUpdate();
		}
	};
	this.removeChild = function(panelObject) {
		panelObjects.remove(panelObjects.getIndexOf(panelObject));
		this.setTabIndex(2);
	};
	this.show = function() {
		this.createIterator();
		while (iterator.hasNext()) {
			iterator.next().show();
		}
		//this.setTabIndex(tabIndex);
		panel.style.display = 'block';
	};
	this.hide = function() {
		this.createIterator();
		while (iterator.hasNext()) {
			iterator.next().hide();
		}
		panel.style.display = 'none';
	};
	this.setTabIndex = function(initialTabIndex) {
		var tabIndex = initialTabIndex;
		this.createIterator();
		while (iterator.hasNext()) {
			tabIndex = iterator.next().setTabIndex(tabIndex);
		}
	};
	this.createIterator = function() {
		iterator = new _PanelIterator(panelObjects.iterator());//TODO: don't like creating a new one each time
	};

	//constructor
	this.createGUIElements(panelBodyId, panelHeaderId, panelId, panelTitle, parentElement);
};

org.anotherearth.ShrinkableSubPanel = function(title, subPanelId) {
	//private variables
	var subPanel, subPanelHead, subPanelBody, shrinkingIcon;
	var title = title;
	var subPanelId = subPanelId;
	var subPanelObjects = new org.anotherearth.ArrayList();
	var self = this;
	var isSlideInProgress = false;//prevents two concurrent closing commands from leaving an empty, open subpanel

	//privileged methods
	this.close = function() {
		if (isSlideInProgress) {
			return;
		}
		var _turnOffSlideFlag = function() {
			isSlideInProgress = false;
		};
		isSlideInProgress = true;
		var iterator = self.createIterator();
		if ($(subPanelBody).css('display') === 'none') {
			while (iterator.hasNext()) {
				iterator.next().show();
			}
			$(subPanelBody).slideToggle(175, _turnOffSlideFlag);
		}
		else if ($(subPanelBody).css('display') !== 'none') {
			var _hider = function() {
				while (iterator.hasNext()) {
					iterator.next().hide();
				}
				_turnOffSlideFlag();
			};
			$(subPanelBody).slideToggle(175, _hider);
		}
		$(shrinkingIcon).toggleClass(org.anotherearth.SUB_PANEL_SHUT_ICON_CLASS).toggleClass(org.anotherearth.SUB_PANEL_OPEN_ICON_CLASS);
		return false;//else page reloads - suppressing default button action
	};
	this.createGUIElements = function() {
		shrinkingIcon	= document.createElement('span');
		$(shrinkingIcon).addClass(org.anotherearth.SUB_PANEL_CAPTION_BUTTON_CLASS).addClass('ui-icon').addClass(org.anotherearth.SUB_PANEL_OPEN_ICON_CLASS);

		subPanel = document.createElement('div');
		subPanel.id = subPanelId;
		$(subPanel).addClass('sub_panel');
		
		subPanelHead = document.createElement('h5');
		$(subPanelHead).addClass('sub_panel_header');
		$(subPanelHead).click(this.close);
		$(subPanelHead).bind('mouseleave mouseenter', function() {
			$(this).toggleClass('sub_panel_header_highlight');
		});

		subPanelBody = document.createElement('div');
		$(subPanelBody).addClass('sub_panel_body');
	
		var titleContainer = document.createElement('span');
		titleContainer.appendChild(document.createTextNode(title));
		$(titleContainer).addClass('sub_panel_title');
		
		subPanelHead.appendChild(shrinkingIcon);
		subPanelHead.appendChild(titleContainer);
		subPanel.appendChild(subPanelHead);
		subPanel.appendChild(subPanelBody);
		subPanel.style.display = 'none';
	};
	this.addChild = function(subPanelObject) {
		//org.anotherearth.Interface.ensureImplements(subPanelObject, org.anotherearth.GUIComposite, org.anotherearth.GUIObject);
		subPanelObjects.add(subPanelObject);
		subPanelBody.appendChild(subPanelObject.getContainingElement());
	};
	this.createIterator = function() {
		return subPanelObjects.iterator();
	};
	this.removeChild = function(subPanelObject) {
		subPanelObjects.remove(subPanelObjects.getIndexOf(subPanelObject));
	};
	this.setTabIndex = function(tabIndex) {//Do nothing with this, and return tabIndex as supplied to indicate that nothing has been done.
		return tabIndex;
	};
	this.show = function() {
		var _showShrinkingIcon = function() {
			shrinkingIcon.style.visibility = 'visible';
		}
		subPanel.style.display = 'block';
		shrinkingIcon.style.visibility = 'hidden';
		setTimeout(_showShrinkingIcon, 70);//bit of a hack to stop icons appearing before the rest of the (sliding) panel
	};
	this.hide = function() {
		subPanel.style.display = 'none';
	};
	this.getContainingElement = function() {
		return subPanel;
	};

	//constructor
	this.createGUIElements();
};
org.anotherearth.ShrinkableSubPanel.prototype = {
	performNewEarthPropsUpdate: function() {},
	performUndoRedoUpdate: function() {}
};

//with reference to the composite design pattern, a composite class
//implements TwoEarthsObserver, GUIComposite and GUIObject
/*
org.anotherearth.ControlPanelFieldSet = function(fieldSetLegend, fieldSetId) {
	//private variables
	var fieldset;
	var fieldSetLegend = fieldSetLegend;
	var fieldSetId = fieldSetId;
	var controlPanelObjects = new org.anotherearth.ArrayList();

	//privileged methods
	this.createGUIElements = function() {
		fieldset = document.createElement('fieldset');
		
		if (fieldSetLegend.length !== 0) {
			var legend = document.createElement('legend');
			var legendText = document.createTextNode(fieldSetLegend);
			legend.appendChild(legendText);
			fieldset.appendChild(legend);
			$(fieldset).addClass('panel_fieldset');
		}
		else {
			$(fieldset).addClass('legendless_panel_fieldset');
		}
		fieldset.id = fieldSetId;
		fieldset.style.display = 'none';
	};
	this.addChild = function(controlPanelObject) {
		//org.anotherearth.Interface.ensureImplements(controlPanelObject, org.anotherearth.GUIComposite, org.anotherearth.GUIObject);
		controlPanelObjects.add(controlPanelObject);
		fieldset.appendChild(controlPanelObject.getContainingElement());
	};
	this.createIterator = function() {
		return controlPanelObjects.iterator();
	};
	this.performNewEarthPropsUpdate = function() {
	};
	this.performUndoRedoUpdate = function() {
	};
	this.removeChild = function(controlPanelObject) {
		controlPanelObjects.remove(controlPanelObjects.getIndexOf(controlPanelObject));
	};
	this.setTabIndex = function(tabIndex) {//Do nothing with this, and return tabIndex as supplied to indicate that nothing has been done.
		return tabIndex;
	};
	this.show = function() {
		fieldset.style.display = 'block';
	};
	this.hide = function() {
		fieldset.style.display = 'none';
	};
	this.getContainingElement = function() {
		return fieldset;
	};

	//constructor
	this.createGUIElements();
};*/

//with reference to the composite design pattern, a leaf class
//implements GUIObject, GUIComposite
//class allows html to be added to composite structure
org.anotherearth.MiscellaneousElement = function(html) {
	//private variables
	var element = html;
	
	//privileged methods
	this.createGUIElements = function(html) {
		element = html;
	};
	this.createIterator  = function() {
		return new org.anotherearth.NullIterator();
	};
	this.getContainingElement = function() {
		return element;
	};
	this.setTabIndex = function(tabIndex) {//Do nothing with this, and return tabIndex as supplied to indicate that nothing has been done.
		return tabIndex;
	};
	this.show = function() {
		element.style.display = 'block';
	};
	this.hide = function() {
		element.style.display = 'none';
	};
	
	//constructor
	this.createGUIElements(html);
};
org.anotherearth.MiscellaneousElement.prototype = {
	addChild: function() {},
	removeChild: function() {}
};

//composite pattern leaf class
//implements GUIComposite, GUIWidget and by extension GUIObject
org.anotherearth.SimpleButton = function(buttonLabel, buttonId, model) {
	//private variables
	var containingElement, button, isEnabled;
	var buttonId = buttonId;
	var buttonLabel = buttonLabel;
	var model = model;

	//privileged methods
	this.createGUIElements = function() {
		containingElement = document.createElement('div');
		$(containingElement).addClass('control_panel_element');
		containingElement.id = buttonId + "_button_container";

		button = document.createElement('button');
		button.id = buttonId;
		$(button).addClass('ui-state-default');
		$(button).attr("innerHTML", buttonLabel);
		//TODO: room for abstracting further into GUIElement class e.g. event listeners
		$(button).mouseenter(function() {
			$(this).toggleClass('ui-state-hover');
		});
		$(button).mouseleave(function() {
			$(this).toggleClass('ui-state-hover');
			$(this).removeClass('ui-state-active');
		});
		$(button).bind('mousedown mouseup', function() {
			$(this).toggleClass('ui-state-active');
		});
		$(button).bind('focus blur', function() {
			$(this).toggleClass('ui-state-focus');
		});

		containingElement.appendChild(button);
		containingElement.style.display = 'none';
	};

	this.addClickEventListener = function(command) {
		//org.anotherearth.Interface.ensureImplements(command, org.anotherearth.Command);
		$(button).bind('click', function() {
			command.execute();
			return false;//else page reloads if Button in form - suppressing default button action
		});
	};
	this.createIterator  = function() {
		return new org.anotherearth.NullIterator();
	};
	this.getContainingElement = function() {
		return containingElement;
	};
	this.getModel = function() {
		return model;
	};
	this.setIsEnabled = function(newIsEnabled) {
		var oldIsEnabled = isEnabled;
		if(oldIsEnabled == newIsEnabled) {
			return;
		}
		if (newIsEnabled) {
			$(button).removeAttr('disabled').removeClass('ui-state-disabled');
		}
		else {
			$(button).attr('disabled', 'disabled').removeClass('ui-state-hover').removeClass('ui-state-focus').addClass('ui-state-disabled');
		}
	};
	this.setTabIndex = function(tabIndex) {
		button.setAttribute('tabindex', tabIndex++);
		return tabIndex;
	};
	this.show = function() {
		containingElement.style.display = 'block';
	};
	this.hide = function() {
		containingElement.style.display = 'none';
	};

	//constructor
	this.createGUIElements();
};
org.anotherearth.SimpleButton.prototype = {
	addChild: function() {}, 
	removeChild: function() {}
};

//implements GUIWidget and by extension GUIObject, implements TwoEarthsObserver and GUIComposite
org.anotherearth.TwoEarthsButton = function(buttonLabel, buttonId, earthModel) {
	//private variables
	var button, undoRedoUpdateStrategy, newEarthPropsUpdateStrategy;

	//privileged methods
	this.addClickEventListener = function(command) {
		button.addClickEventListener(command);
	};
	this.createGUIElements = function() {
		button.createGUIElements();
	};
	this.createIterator  = function() {
		return button.createIterator();
	};
	this.getContainingElement = function() {
		return button.getContainingElement();
	};
	this.getModel = function() {
		return button.getModel();
	};
	this.performUndoRedoUpdate = function() {
		undoRedoUpdateStrategy.execute(this);
	};
	this.performNewEarthPropsUpdate = function() {
		newEarthPropsUpdateStrategy.execute(this);
	};
	this.setIsEnabled = function(newIsEnabled) {
		button.setIsEnabled(newIsEnabled);
	};
	this.setUndoRedoUpdateStrategy = function(updateStrategy) {
		undoRedoUpdateStrategy = updateStrategy;
	};
	this.setNewEarthPropsUpdateStrategy = function(updateStrategy) {
		newEarthPropsUpdateStrategy = updateStrategy;
	};
	this.show = function() {
		button.show();
	};		
	this.hide = function() {
		button.hide();
	};		
	this.setTabIndex = function(tabIndex) {
		return button.setTabIndex(tabIndex);
	};

	//constructor
	button = new org.anotherearth.SimpleButton(buttonLabel, buttonId, earthModel);
	button.createGUIElements();
	undoRedoUpdateStrategy = new org.anotherearth.NullUpdateStrategy();
	newEarthPropsUpdateStrategy = new org.anotherearth.NullUpdateStrategy();
};
org.anotherearth.TwoEarthsButton.prototype = {
	addChild: function() {},//composite alone implements these methods
	removeChild: function() {}
};

//non-generic button for displaying parameterized URL link upon button click
//implements GUIWidget and by extension GUIObject, TwoEarthsObserver and GUIComposite
org.anotherearth.LinkCreatorButton = function(buttonLabel, buttonId, linkBoxId, earthModel) {
	//private variables
	var button, linkBox, undoRedoUpdateStrategy, newEarthPropsUpdateStrategy;
	var buttonLabel = buttonLabel;
	var buttonId = buttonId;
	var earthModel = earthModel;
	var linkBoxId = linkBoxId;

	//private method
	var _createLinkBox = function() {
		linkBox = document.createElement('input');
		linkBox.setAttribute('type', 'text');
		linkBox.id = linkBoxId; 
		button.getContainingElement().appendChild(linkBox);
		linkBox.style.display = 'none';
	};

	//privileged methods
	this.addLink = function(link) {
		if (typeof linkBox === 'undefined') {
			_createLinkBox();
		}
		linkBox.setAttribute('value', link);
		linkBox.style.display = 'none';//apparently giving a text input field a value automatically changes display to block
	};
	this.addClickEventListener = function(command) {
		button.addClickEventListener(command);
	};
	this.createGUIElements = function() {//creates button but not link box, see below
		button.createGUIElements();
	};
	this.createIterator  = function() {
		return button.createIterator();
	};
	this.getContainingElement = function() {
		return button.getContainingElement();
	};
	this.setIsEnabled = function(newIsEnabled) {
		button.setIsEnabled(newIsEnabled);
	};
	this.setIsLinkVisible = function(newIsLinkVisible) {
		if (typeof linkBox === 'undefined') {
			return;
		}
		var oldIsLinkVisible = (linkBox.style.display === 'block');
		if (oldIsLinkVisible == newIsLinkVisible) {
			return;
		}
		else if (newIsLinkVisible) {
			linkBox.style.display = 'block';
		}
		else {
			linkBox.style.display = 'none';
		}
	};
	this.show = function() {
		button.getContainingElement().style.display = 'block';
		if (typeof linkBox !== 'undefined') {//want to keep linkBox hidden at this point - sorry, bit ugly
			linkBox.style.display = 'none';
		}
	};
	this.hide = function() {
		button.getContainingElement().style.display = 'none';
	};
	this.setTabIndex = function(tabIndex) {
		return button.setTabIndex(tabIndex);
	};
	this.performUndoRedoUpdate = function() {
		undoRedoUpdateStrategy.execute(this);
	};
	this.performNewEarthPropsUpdate = function() {
		newEarthPropsUpdateStrategy.execute(this);
	};
	this.setUndoRedoUpdateStrategy = function(updateStrategy) {
		undoRedoUpdateStrategy = updateStrategy;
	};
	this.setNewEarthPropsUpdateStrategy = function(updateStrategy) {
		newEarthPropsUpdateStrategy = updateStrategy;
	};

	//constructor
	button = new org.anotherearth.TwoEarthsButton(buttonLabel, buttonId, earthModel);
	this.createGUIElements();
	this.setUndoRedoUpdateStrategy(new org.anotherearth.NullUpdateStrategy());
	this.setNewEarthPropsUpdateStrategy(new org.anotherearth.NullUpdateStrategy());
};
org.anotherearth.LinkCreatorButton.prototype = {
	addChild: function() {},//composite only implements these
	removeChild: function() {}
};

//implements GUIWidget and by extension GUIObject, TwoEarthsObserver and GUIComposite
org.anotherearth.TwoEarthsCheckbox = function(checkboxLabel, checkboxId, earthModel) {
	//private variables
	var containingElement, checkbox, onClickCommand, newEarthPropsUpdateStrategy, undoRedoUpdateStrategy;
	var checkboxLabel = checkboxLabel;
	var checkboxId    = checkboxId;
	var earthModel    = earthModel;

	//privileged methods
	this.addClickEventListener = function(command) {
		onClickCommand = command;//for programmatic calls to setIsChecked()
		$(checkbox).bind('click', function() {
			command.execute();
		});
	};
	this.createGUIElements = function() {
		containingElement = document.createElement('div');
		$(containingElement).addClass('control_panel_element');
		containingElement.id = checkboxId + "_checkbox_container";//TODO: could improve this id strategy?
		checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.id = checkboxId;

		var labelElement = document.createElement('label');
		labelElement.setAttribute('for', checkboxId);
		labelElement.innerHTML = checkboxLabel;

		containingElement.appendChild(checkbox);
		containingElement.appendChild(labelElement);
		containingElement.style.display = 'none';
	};
	this.createIterator  = function() {
		return new org.anotherearth.NullIterator();
	};
	this.getIsChecked = function() {
		return $(checkbox).attr('checked');
	};
	this.getContainingElement = function() {
		return containingElement;
	};
	this.setIsChecked = function(newIsChecked){
		var oldIsChecked = this.getIsChecked();
		if (newIsChecked == oldIsChecked) {
			return;
		}
		(oldIsChecked)? $(checkbox).attr('checked', 'true') : $(checkbox).attr('checked', 'false');
		onClickCommand.execute();
	};
	this.show = function() {
		containingElement.style.display = 'block';
	};
	this.hide = function() {
		containingElement.style.display = 'none';
	};
	this.performUndoRedoUpdate = function() {
		undoRedoUpdateStrategy.execute(this);
	};
	this.performNewEarthPropsUpdate = function() {
		newEarthPropsUpdateStrategy.execute(this);
	};
	this.setUndoRedoUpdateStrategy = function(strategy) {
		undoRedoUpdateStrategy = strategy;
	};
	this.setNewEarthPropsUpdateStrategy = function(strategy) {
		newEarthPropsUpdateStrategy = strategy;
	};
	this.setTabIndex = function(tabIndex) {
		checkbox.setAttribute('tabindex', tabIndex++);
		return tabIndex;
	};

	//constructor
	this.createGUIElements();
	onClickCommand = new org.anotherearth.NullCommand();
	undoRedoUpdateStrategy      = new org.anotherearth.NullUpdateStrategy();
	newEarthPropsUpdateStrategy = new org.anotherearth.NullUpdateStrategy();
};
org.anotherearth.TwoEarthsCheckbox.prototype = {
	addChild: function() {},//Composite classes alone implements these methods - this is a leaf class.
	removeChild: function(){}
};

//implements GUIWidget and by extension GUIObject, TwoEarthsObserver and GUIComposite
//composite leaf class
org.anotherearth.RadioButtons = function(radioButtons, groupId) {
	var radioButtons = radioButtons;
	var groupId = groupId;
	var onClickCommand, containingElement;
	var newEarthPropsUpdateStrategy, undoRedoUpdateStrategy;

	//privileged methods
	this.addClickEventListener = function(command) {
		onClickCommand = command;//for programmatic calls to setIsChecked()       

		for (var button in radioButtons) {
			if (radioButtons.hasOwnProperty(button)) {
				if (typeof document.body.style.maxHeight === 'undefined') {//if IE6 - IE6 doesn't register radio button clicks visibly otherwise
					$(radioButtons[button].htmlElement).click(function() {
						var name = this.getAttribute('name');
						$("input[name='" + name + "']").removeAttr('checked');
						$(this).attr('checked', 'checked');
						command.execute(this);
					});
				}
				else {
					$(radioButtons[button].htmlElement).click(function() {
						command.execute(this);
					});
				}
			}		
		}
	};
	this.createGUIElements = function() {
		containingElement = document.createElement('div');
		$(containingElement).addClass('control_panel_element');
		containingElement.id = groupId + "_container";//TODO: could improve this id strategy?
		for (var i = 0; i < radioButtons.length; i++) {
			var label = document.createElement('label');
			label.setAttribute('for', radioButtons[i].id);
			var input   = document.createElement('input');
			input.type  = 'radio';
			input.id    = radioButtons[i].id;
			input.name  = radioButtons[i].name;
			input.value = radioButtons[i].value;
			radioButtons[i].htmlElement = input;

			label.appendChild(input);
			var textSpan = document.createElement('span');
			$(textSpan).addClass('radio_button_label_span');
			textSpan.appendChild(document.createTextNode(radioButtons[i].label));
			label.appendChild(textSpan);
			containingElement.appendChild(label);
		}
		containingElement.style.display = 'none';
	};
	this.createIterator = function() {
		return new org.anotherearth.NullIterator();
	};
	this.getContainingElement = function() {
	  return containingElement;
	};
	this.getIsChecked = function(index) {
		return $(radioButtons[index].htmlElement).attr('checked');
	};
	this.getIndexOf = function(value) {
		var i = 0;
		for (var button in radioButtons) {
			if (radioButtons.hasOwnProperty(button) && radioButtons[button].value === value) {
				break;
			}	
		}
		return i;
	};
	this.performUndoRedoUpdate = function() {
		undoRedoUpdateStrategy.execute(this);
	};
	this.performNewEarthPropsUpdate = function() {
		newEarthPropsUpdateStrategy.execute(this);
	};
	this.setIsChecked = function(newIsChecked, index) {
		var oldIsChecked = this.getIsChecked(index);
		if (newIsChecked === oldIsChecked) {
			return;
		}
		(oldIsChecked)? $(radioButtons[index].htmlElement).attr('checked', 'true') : $(radioButtons[index].htmlElement).attr('checked', 'false');
		onClickCommand.execute(radioButtons[index]);
	};
	/*this.setIsEnabled = function(newIsEnabled) {//TODO: improve this
		var oldIsEnabled = isEnabled;
		if(oldIsEnabled === newIsEnabled) {
			return;
		}
		if (newIsEnabled) {
			$(containingElement, input).removeAttr('disabled').removeClass('ui-state-disabled');
		}
		else {
			$(containingElement, input).attr('disabled', 'disabled').removeClass('ui-state-hover').removeClass('ui-state-focus').addClass('ui-state-disabled');
		}
	};*/
	this.setTabIndex = function(tabIndex) {
		for (var i = 0; i < radioButtons.length; i++) {
			radioButtons[i].htmlElement.setAttribute('tabindex', tabIndex++);
		}
		return tabIndex;
	};
	this.show = function() {
		containingElement.style.display = 'block';	
	};
	this.hide = function() {
		containingElement.style.display = 'none';	
	};
	this.setNewEarthPropsUpdateStrategy = function(strategy) {
	  newEarthPropsUpdateStrategy = strategy; 
	};
	this.setUndoRedoUpdateStrategy = function(strategy) {
	  undoRedoUpdateStrategy = strategy;
	};
	
	//constructor
	this.createGUIElements();
	onClickCommand = new org.anotherearth.NullCommand();
	undoRedoUpdateStrategy       = new org.anotherearth.NullUpdateStrategy();
	newEarthPropsUpdateStrategy = new org.anotherearth.NullUpdateStrategy();
};
org.anotherearth.RadioButtons.prototype = {
	addChild:    function() {},//Composite classes alone implements these methods - this is a leaf class.
	removeChild: function() {}//TODO: throw unsupported method?
};

//composite pattern leaf class
//implements GUIWidget and by extension GUIObject, TwoEarthsObserver and GUIComposite
org.anotherearth.SearchBox = function(earth, earthsController, searchBoxId, searchBoxTitle) {
	//private variable
	var searchBox;
	var earth = earth;
	var earthsController = earthsController;
	var title = searchBoxTitle;
	var undoRedoUpdateStrategy, newEarthPropsUpdateStrategy;

	//privileged methods
	this.createGUIElements = function() {
		searchBox = document.createElement('div');
		searchBox.id = searchBoxId;
		$(searchBox).addClass(org.anotherearth.SEARCH_BOX_CLASS);
		
		var boxTitle = document.createElement('h6');
		boxTitle.appendChild(document.createTextNode(title));
		$(boxTitle).addClass('search_box_label');
		
		var searcher = new google.search.LocalSearch();
		searcher.setNoHtmlGeneration();
		var searchControl = new google.search.SearchControl();
		searchControl.setSearchCompleteCallback(null, function() {
			$('.gs-title').removeAttr('href').css('text-decoration', 'none');//excuse the hacking - no google search box for earth plugin at this point in time 
			$('.gs-directions').remove();      
			var lat, lng;
			if (searcher.results.length && searcher.results[0].GsearchResultClass === GlocalSearch.RESULT_CLASS) {
				lat = parseFloat(searcher.results[0].lat);
				lng = parseFloat(searcher.results[0].lng);
				var props = earth.getCameraProperties();
				earthsController.jumpCameraCoords(earth, lat, lng, 20000, props.tilt, props.head);
			}
		});
		searchControl.addSearcher(searcher);
		searchControl.draw(searchBox);
		searchBox.insertBefore(boxTitle, searchBox.firstChild);

		searchBox.style.display = 'none';
	};
	this.createIterator = function() {
		return new org.anotherearth.NullIterator();
	};
	this.getContainingElement = function() {
		return searchBox;
	};
	this.show = function() {
		$('.gsc-branding-user-defined').siblings().andSelf().remove();
		searchBox.style.display = 'block';	
	};
	this.hide = function() {
		searchBox.style.display = 'none';
	};
	this.performUndoRedoUpdate = function() {
		undoRedoUpdateStrategy.execute(this);
	};
	this.performNewEarthPropsUpdate = function() {
		newEarthPropsUpdateStrategy.execute(this);
	};
	this.setTabIndex = function(tabIndex) {
		return tabIndex;
	};

	//contructor
	this.createGUIElements();
	undoRedoUpdateStrategy       = new org.anotherearth.NullUpdateStrategy();
	newEarthPropsUpdateStrategy  = new org.anotherearth.NullUpdateStrategy();
}
org.anotherearth.SearchBox.prototype = {
	addChild:    function() {},
	removeChild: function() {}
};

//composite pattern leaf class
org.anotherearth.SelectBox = function(options, selectBoxSize, selectBoxText, selectBoxId, isMultipleSelectType) {
	var options = options;//TODO: type checking on these widget elements' arguments - and on the abstract widget elements
	var selectBoxSize = selectBoxSize;
	var selectBoxText = selectBoxText;
	var selectBoxId = selectBoxId;
	var isMultipleSelectType = isMultipleSelectType;
	var selectBoxId = selectBoxId;
	var onClickCommand, containingElement, selectBox;
	var undoRedoUpdateStrategy, newEarthPropsUpdateStrategy;

	//privileged methods
	this.addClickEventListener = function(command) {
		if (!isMultipleSelectType) {
			for (var option in options) {
				if (options.hasOwnProperty(option)) {
					$(options[option].htmlElement).click(function() {command.execute(selectBox, this)});
				}			
			}
		}
		else {
			var checkboxes = [];
			var re = new RegExp(selectBoxId + '\\d+');//This is the form of id assigned by dropdownlist plugin to checkboxes.
			var inputs = document.getElementsByTagName('input');
			for (var input in inputs) {
				if (typeof inputs[input].id !== 'undefined' && inputs[input].id.match(re)) {
					checkboxes.push(inputs[input]);
				}
			}
			$(checkboxes).click(function() {command.execute(selectBox, this);});
		}
	};
	this.createGUIElements = function() {
		//define selectbox
		containingElement = document.createElement('div');
		$(containingElement).addClass('control_panel_element').addClass('select_box_container');
		containingElement.id = selectBoxId + "_select_box_container";//TODO: don't like this
		
		selectBox = document.createElement('select');
		selectBox.id = selectBoxId;

		if (isMultipleSelectType) {
			selectBox.setAttribute("multiple", "multiple");
		}
		else {
			var option = document.createElement('option');
			option.setAttribute('selected', 'selected');
			selectBox.appendChild(option);
		}

		//define options
		for (var i = 0; i < options.length; i++) {
			var option   = document.createElement('option');
			option.value = options[i].value;

			option.appendChild(document.createTextNode(options[i].text));
			options[i].htmlElement = option;
			selectBox.appendChild(option);
		}

		var selectBoxLabel = document.createElement('label');
		selectBoxLabel.appendChild(document.createTextNode(selectBoxText));

		containingElement.appendChild(selectBoxLabel);
		containingElement.appendChild(selectBox);
		if (isMultipleSelectType) {       
			$(selectBox).dropdownchecklist();
		}
		containingElement.style.display = 'none';
	};
	this.createIterator = function() {
		return new org.anotherearth.NullIterator();
	};
	this.getContainingElement = function() {
	  return containingElement;
	};
	this.getIsEnabled = function(index) {
		if ($(options[index].htmlElement).attr('disabled') === 'disabled') {
			return false;
		}
		else {
			return true;
		}
	};
	this.getIsSelected = function(index) {
		if ($(options[index].htmlElement).attr('selected') === 'selected') {
			return true;
		}
		else {
			return false;
		}
	};
	this.setIsSelected = function(index, newIsSelected) {
		var oldIsSelected = this.getIsSelected(index);
		if (newIsSelected === oldIsSelected) {
			return;
		}
		(oldIsSelected)? $(options[index].htmlElement).removeAttr('selected') : $(options[index].htmlElement).attr('selected', 'selected');
		onClickCommand.execute(selectBox, options[index]);
	};
	this.performUndoRedoUpdate = function() {
		undoRedoUpdateStrategy.execute(this);
	};
	this.performNewEarthPropsUpdate = function() {
		newEarthPropsUpdateStrategy.execute(this);
	};
	this.getIndexOfOption = function(optionValue) {
		for (var i = 0; i < options.length; i++) {
			if (options[i].value === optionValue) {
				break;
			}
		}
		return i;
	};
	/*
	this.setIsEnabled = function(index, newIsEnabled) {//TODO: improve this
		var oldIsEnabled = newIsEnabled;
		if(oldIsEnabled === newIsEnabled) {
			return;
		}
		if (newIsEnabled) {
			$(selectBox, option).removeAttr('disabled').removeClass('ui-state-disabled');
		}
		else {
			$(selectBox, option).attr('disabled', 'disabled').removeClass('ui-state-hover').removeClass('ui-state-focus').addClass('ui-state-disabled');
		}
	};
	*/
	this.setTabIndex = function(tabIndex) {
		if (!isMultipleSelectType) {
			for (var i = 0; i < options.length; i++) {
				options[i].htmlElement.tabindex =  tabIndex++;
			}
		}
	  return tabIndex;
	};
	this.show = function() {
		containingElement.style.display = 'block';
	};
	this.hide = function() {
		containingElement.style.display = 'none';
		if (isMultipleSelectType) {
			$(selectBox).dropdownchecklist('hide');
		}
	};
	this.hideDropDownList = function() {
		if (isMultipleSelectType) {
			$(selectBox).dropdownchecklist('hide');
		}
	};
	this.setNewEarthPropsUpdateStrategy = function(strategy) {
	  newEarthPropsUpdateStrategy = strategy; 
	};
	this.setUndoRedoUpdateStrategy = function(strategy) {
	  undoRedoUpdateStrategy = strategy;
	};
	
	//constructor
	this.createGUIElements();
	onClickCommand               = new org.anotherearth.NullCommand();
	undoRedoUpdateStrategy       = new org.anotherearth.NullUpdateStrategy();
	newEarthPropsUpdateStrategy  = new org.anotherearth.NullUpdateStrategy();
};
org.anotherearth.SelectBox.prototype = {
	addChild:    function() {},
	removeChild: function() {}
};

//NON-DISPLAY CLASSES

org.anotherearth.UndoButtonUpdateStrategy = function() {}; //implements observer update strategy
org.anotherearth.UndoButtonUpdateStrategy.prototype = {
	execute: function(button) {
		//org.anotherearth.Interface.ensureImplements(button, org.anotherearth.GUIWidget);
		button.setIsEnabled(button.getModel().getNumberRemainingUndos());
	}
};

org.anotherearth.RedoButtonUpdateStrategy = function() {}; //implements observer update strategy
org.anotherearth.RedoButtonUpdateStrategy.prototype = {
	execute: function(button) {
		//org.anotherearth.Interface.ensureImplements(button, org.anotherearth.GUIWidget);
		button.setIsEnabled(button.getModel().getNumberRemainingRedos());
	}
};

org.anotherearth.EquateLatLngsButtonStrategy = function() {}; //implements observer update stragegy
org.anotherearth.EquateLatLngsButtonStrategy.prototype = {
	execute: function(button) {
		//org.anotherearth.Interface.ensureImplements(button, org.anotherearth.GUIWidget);
		var props = button.getModel().getCurrentCameraProperties();
		if (props.leftEarth.lat    === props.rightEarth.lat &&
		    props.leftEarth.lng === props.rightEarth.lng) {
			button.setIsEnabled(false);
		}
		else {	
			button.setIsEnabled(true);
		}
	}
};

org.anotherearth.EquateAltitudesButtonStrategy = function() {}; //implements observer update stragegy
org.anotherearth.EquateAltitudesButtonStrategy.prototype = {
	execute: function(button) {
		//org.anotherearth.Interface.ensureImplements(button, org.anotherearth.GUIWidget);
		var props = button.getModel().getCurrentCameraProperties();
		(props.leftEarth.alt === props.rightEarth.alt) ? button.setIsEnabled(false) : button.setIsEnabled(true);
	}
};

org.anotherearth.EquateTiltsButtonStrategy = function() {}; //implements observer update stragegy
org.anotherearth.EquateTiltsButtonStrategy.prototype = {
	execute: function(button) {
		//org.anotherearth.Interface.ensureImplements(button, org.anotherearth.GUIWidget);
		var props = button.getModel().getCurrentCameraProperties();
		var leftTiltRounded = Math.round(props.leftEarth.tilt * 10)/10;  //Unlike other properties, tilt cannot apparently be
		var rightTiltRounded = Math.round(props.rightEarth.tilt * 10)/10;//set reliably with more than one decimal place of precision
		(leftTiltRounded === rightTiltRounded) ? button.setIsEnabled(false) : button.setIsEnabled(true);
	}
};

org.anotherearth.EquateHeadingsButtonStrategy = function() {}; //implements observer update stragegy
org.anotherearth.EquateHeadingsButtonStrategy.prototype = {
	execute: function(button) {
		//org.anotherearth.Interface.ensureImplements(button, org.anotherearth.GUIWidget);
		var props = button.getModel().getCurrentCameraProperties();
		(props.leftEarth.head === props.rightEarth.head) ? button.setIsEnabled(false) : button.setIsEnabled(true);
	}
};

org.anotherearth.LinkCreatingButtonUpdateStrategy = function() {}; //implements observer update strategy
org.anotherearth.LinkCreatingButtonUpdateStrategy.prototype = {
	execute: function(button) {
		//org.anotherearth.Interface.ensureImplements(button, org.anotherearth.GUIWidget);
		button.setIsEnabled(true);
		button.setIsLinkVisible(false);
	}
};

org.anotherearth.NullUpdateStrategy = function() {}; //implements observer update strategy
org.anotherearth.NullUpdateStrategy.prototype = {
	execute: function(button) {}
};

org.anotherearth.EarthsManager = function() {
	//private variables
	var earthLtoRCamDiffs  = {};
	earthLtoRCamDiffs.lat  = null;
	earthLtoRCamDiffs.lng  = null;
	earthLtoRCamDiffs.alt  = null;
	earthLtoRCamDiffs.tilt = null;
	earthLtoRCamDiffs.head = null;
	var earthRtoLCamDiffs  = {};  //Having two separate collections, the choice of which depends 
	earthRtoLCamDiffs.lat  = null;//upon the camera being moved, produces a performance benefit.
	earthRtoLCamDiffs.lng  = null;
	earthRtoLCamDiffs.alt  = null;
	earthRtoLCamDiffs.tilt = null;
	earthRtoLCamDiffs.head = null;
	var isHorizMovementLocked = false;
	var isVertMovementLocked = false;
	var isTiltLocked = false;
	var isHeadingLocked = false;
	var completeHistory = [];
	var undoHistory = [];                   //When undo is performed, a snapshot of current history is taken and 
	var currentUndoHistoryPosition = null;  //traversed through until new movement is performed, at which point 
	var observers = {};                     //undoHistory is cleared and currentUndoHistoryPosition is set back 
	observers.undoRedo = [];                //to null. currentUndoHistoryPosition is relative to the last item 
	observers.newEarthProps = [];           //to the highest index array element. This seems like the most legible
	                                        //undo scheme.
	//privileged methods
	this.redo = function() {
		if (this.getNumberRemainingRedos()) {//If not equal to null and not equal to 0.
			currentUndoHistoryPosition++;
			completeHistory.push(undoHistory[undoHistory.length-1 + currentUndoHistoryPosition]);
			this.notifyUndoRedoObservers();
		}
		else {
			throw new Error("nothing to redo - shouldn't be calling method.");
		}
	};
	this.undo = function() {
		if (currentUndoHistoryPosition !== null) {//History is currently being travelled through.
			if (this.getNumberRemainingUndos()) {   
				currentUndoHistoryPosition--;
			}
			else {
				throw new Error("nothing to undo - shouldn't be calling method.");
			}
		}
		else {
			undoHistory = completeHistory.slice(0);//Beginning a journey through history.
			currentUndoHistoryPosition = -1;
		}
		completeHistory.push(undoHistory[undoHistory.length-1 + currentUndoHistoryPosition]);
		this.notifyUndoRedoObservers();
	};
	this.getNumberRemainingRedos = function() {//TODO: according to Holub should return only booleans or objects	
		return ((currentUndoHistoryPosition === null) ? 0 : -currentUndoHistoryPosition);
	};
	this.getNumberRemainingUndos = function() {//TODO: according to Holub should return only booleans or objects		
		return ((currentUndoHistoryPosition === null) ? completeHistory.length-1 : undoHistory.length-1 + currentUndoHistoryPosition);
	};
	this.getCurrentCameraProperties = function() {
		return completeHistory[completeHistory.length-1];
	};
	this.saveCameraProperties = function(LEarthCamProps, REarthCamProps, isCurrentPropertySetOverwritten) {
		var propsToSave = {};
		propsToSave.leftEarth  = LEarthCamProps;
		propsToSave.rightEarth = REarthCamProps;
		undoHistory = [];                 //Saving new properties, as opposed to getting them from history,
		currentUndoHistoryPosition = null;//clears undo stack - history is no longer being examined.
		if (isCurrentPropertySetOverwritten) {
			completeHistory.pop();
		}
		completeHistory.push(propsToSave);
		this.notifyNewEarthPropsObservers();
	};
	this.getLtoRCameraPropertyDifferences = function() {
		return earthLtoRCamDiffs;
	};
	this.getRtoLCameraPropertyDifferences = function() {
		return earthRtoLCamDiffs;
	};
	this.getIsHorizMovementLocked = function() {
		return isHorizMovementLocked;
	};
	this.getIsVertMovementLocked = function() {
		return isVertMovementLocked;
	};
	this.getIsTiltLocked = function() {
		return isTiltLocked;
	};
	this.getIsHeadingLocked = function() {
		return isHeadingLocked;
	};
	this.setIsHorizMovementLocked = function(newIsMovementLocked) {
		isHorizMovementLocked = newIsMovementLocked;
	};
	this.setIsVertMovementLocked = function(newIsMovementLocked) {
		isVertMovementLocked = newIsMovementLocked;
	};
	this.setIsTiltLocked = function(newIsMovementLocked) {
		isTiltLocked = newIsMovementLocked;
	};
	this.setIsHeadingLocked = function(newIsMovementLocked) {
		isHeadingLocked = newIsMovementLocked;
	};
	this.setCameraCoordDiff = function(lockType, value) {
		if (value === null) {
			earthLtoRCamDiffs[lockType] = null;
			earthRtoLCamDiffs[lockType] = null;
		}
		else {
			earthLtoRCamDiffs[lockType] = value;
			earthRtoLCamDiffs[lockType] = -value;
		}
	};
	this.registerUndoRedoObserver = function(observer) {
		//org.anotherearth.Interface.ensureImplements(observer, org.anotherearth.TwoEarthsObserver);
		observers.undoRedo.push(observer);
	};
	this.registerNewEarthObserver = function(observer) {
		//org.anotherearth.Interface.ensureImplements(observer, org.anotherearth.TwoEarthsObserver);
		observers.newEarthProps.push(observer);
	};
	this.notifyUndoRedoObservers = function() {
		for (var observerNumber in observers.undoRedo) {
			if (observers.undoRedo.hasOwnProperty(observerNumber)) {
				var observer = observers.undoRedo[observerNumber];
				observer.performUndoRedoUpdate();
			}
		}
	};
	this.notifyNewEarthPropsObservers = function() {
		for (var observerNumber in observers.newEarthProps) {
			if (observers.newEarthProps.hasOwnProperty(observerNumber)) {
				var observer = observers.newEarthProps[observerNumber];
				observer.performNewEarthPropsUpdate();
			}
		}
	};
};

org.anotherearth.LockableEarth = function(canvasDivId, earthsController, initialCameraProperties, kmlUrl) {
	//private variables
	var ALTITUDE_TYPE;
	var REGULAR_FLY_TO_SPEED = 3.5;
	var ge;
	var geView, geWindow, geOptions, geLayerRoot, geTime;
	var overlays = {};
	var isNextViewChangeIgnored    = false;
	var isNextViewChangeEndIgnored = false;
	var self = this;
	var canvasDivId = canvasDivId;
	var earthCanvas;
	var currentKmlObject;
	var kmlUrl = kmlUrl;
	var isHistoricalImageryEnabled;

	//private functions
	var _fetchKml = function() {
		google.earth.fetchKml(ge, kmlUrl, _kmlFinishedLoading);
	};	
	var _kmlFinishedLoading = function(kmlObject) {//if kml overlay is applied  		
		if (kmlObject) {
			currentKmlObject = kmlObject;
    	ge.getFeatures().appendChild(kmlObject);
		
    	if (kmlObject.getAbstractView() !== null) {
      	ge.getView().setAbstractView(kmlObject.getAbstractView());
			}
  	}
	};	
	var _initEarth = function(instance) {//constructor
		ge = instance;
		geView      = instance.getView();
		geWindow    = instance.getWindow();
		geOptions   = instance.getOptions();
		geLayerRoot = instance.getLayerRoot();
		geTime     = instance.getTime();
		
		ge.getNavigationControl().setVisibility(ge.VISIBILITY_AUTO);
		ALTITUDE_TYPE = ge.ALTITUDE_ABSOLUTE;
		geOptions.setScaleLegendVisibility(true);
		geOptions.setStatusBarVisibility(true);

		//terrain layer enabled by default
		geLayerRoot.enableLayerById(ge.LAYER_ROADS, true);	
		geLayerRoot.enableLayerById(ge.LAYER_BORDERS, true);	
		geLayerRoot.enableLayerById(ge.LAYER_BUILDINGS, true);	
		geLayerRoot.enableLayerById(ge.LAYER_BUILDINGS_LOW_RESOLUTION, true);
			
		overlays.borders        = geLayerRoot.getLayerById(ge.LAYER_BORDERS);
		overlays.roads          = geLayerRoot.getLayerById(ge.LAYER_ROADS);
		overlays.terrain        = geLayerRoot.getLayerById(ge.LAYER_TERRAIN);
		overlays.hiResBuildings = geLayerRoot.getLayerById(ge.LAYER_BUILDINGS);
		overlays.loResBuildings = geLayerRoot.getLayerById(ge.LAYER_BUILDINGS_LOW_RESOLUTION);

		for (var overlay in overlays) {
			if (overlays.hasOwnProperty(overlay)) {
				overlays[overlay].setVisibility(false);
			}
		}

		self.setCameraProperties(initialCameraProperties.lat,
		                         initialCameraProperties.lng,
		                         initialCameraProperties.alt,
		                         initialCameraProperties.tilt,
		                         initialCameraProperties.head,
		                         false);
		earthsController.saveCameraProperties(false);//this method won't do anything when called by first map to be initialized
		geWindow.setVisibility(true);

		//Saving scheme: on viewchangeend (which can be fired continuously, e.g. throughout heading changes) on map that initialized movement,
		//attempt to save Earths' coordinates. If first viewchangeend since mouseup, then save new set of coords;
		//if a suitable interval has elapsed since last viewchangeend also save - this latter condition covers nav control-triggered movement,
		//necessary since nav control doesn't fire events. If neither of the above is true then overwrite the previous set of saved coordinates.
		//Add Event Listeners to Earth
		google.earth.addEventListener(geWindow, 'mouseup', function() {
			earthsController.respondToMouseUpOnEarth();
		});
		google.earth.addEventListener(geView, 'viewchange', function() {
			var moveInitializingEarth = earthsController.getMoveInitializingEarth();
			if (isNextViewChangeIgnored) {
				isNextViewChangeIgnored = false;
				return;
			}
			if (moveInitializingEarth === null) {
				earthsController.setMoveInitializingEarth(self);
			}
			else if (moveInitializingEarth !== self) {//this is a catch for rare instances, happening exclusively during synchronized dragging,
				return;                                 //in which a camera moves twice after it has had its position set, thereby bypassing the
			}                                         //movement-ignoring condition above and typically causing movement to abruptly halt.
			                                          //since the movement-ignoring condition is used for other types of movement (other than dragging)
																								//it has not been replaced by this commented condition.
			earthsController.moveOtherEarthIfLocked(self);
		});
		google.earth.addEventListener(geView, 'viewchangeend', function() {
			var moveInitializingEarth = earthsController.getMoveInitializingEarth();
			if (isNextViewChangeEndIgnored) {
				isNextViewChangeEndIgnored = false;
				return;
			}
			if (moveInitializingEarth !== self) {
				return;
			}
			var isCurrentPropSetOverwritten = !earthsController.getIsTimeElapsedSufficientForSave();
			earthsController.saveCameraProperties(isCurrentPropSetOverwritten);
		});
		if (kmlUrl) {//if was set during instantiation
			_fetchKml();
		}
		earthsController.respondToEarthFullyLoading();
	};
	var _initEarthFailed = function(errorCode){//this function is mandatory for loading the plugin but unnecessary for me
	};
	var _createEarthCanvas = function() {
		earthCanvas = document.createElement('div');
		earthCanvas.id = canvasDivId;
		$(earthCanvas).addClass(org.anotherearth.EARTH_CANVAS_CLASS);
		$('body').append(earthCanvas);
	};

	//privileged methods
	this.setCameraProperties = function(lat, lng, alt, tilt, head, isNextMoveIgnored) {
		if (typeof geView === 'undefined') {
			var errorMessage = canvasDivId + " not initialized";
			throw new ReferenceError(errorMessage);
		}
		var camera = geView.copyAsCamera(ALTITUDE_TYPE);
		if (isNextMoveIgnored) {//e.g. if earths are locked together, this will prevent an infinite loop of property setting between the Earths
			isNextViewChangeIgnored    = true;
			isNextViewChangeEndIgnored = true;
		}
		camera.setLatitude(lat);
		camera.setLongitude(lng);
		camera.setAltitude(alt);
		camera.setTilt(tilt);
		camera.setHeading(head);
		geOptions.setFlyToSpeed(ge.SPEED_TELEPORT);
		geView.setAbstractView(camera);
		geOptions.setFlyToSpeed(REGULAR_FLY_TO_SPEED);
	};
	this.getCameraProperties = function() {
		if (typeof geView === 'undefined') {//i.e. if earth not loaded
			var errorMessage = canvasDivId + " not initialized";
			throw new ReferenceError(errorMessage);
		}
		else {
			var camera = geView.copyAsCamera(ALTITUDE_TYPE);
			var props = {};
			//Props given to six decimal places - any more precision unnecessary even at lowest altitudes.
			var oneMillion = Math.pow(10,6);
			props.lat  = Math.round(camera.getLatitude()  * oneMillion)/oneMillion;
			props.lng  = Math.round(camera.getLongitude() * oneMillion)/oneMillion;
			props.alt  = Math.round(camera.getAltitude()  * oneMillion)/oneMillion;
			props.tilt = Math.round(camera.getTilt()      * oneMillion)/oneMillion;
			props.head = Math.round(camera.getHeading()   * oneMillion)/oneMillion;
			return props;
		}
	};
	this.toggleExtra = function(overlayId) {
		switch(overlayId) {
			case 'atmosphere' :
				geOptions.setAtmosphereVisibility(!geOptions.getAtmosphereVisibility());
				break;
			case 'hiRes':
				overlays.hiResBuildings.setVisibility(!overlays.hiResBuildings.getVisibility());
				break;
			case 'loRes':
				overlays.loResBuildings.setVisibility(!overlays.loResBuildings.getVisibility());
				break;
			case 'borders':
				overlays.borders.setVisibility(!overlays.borders.getVisibility());
				break;
			case 'grid':
				geOptions.setGridVisibility(!geOptions.getGridVisibility());
				break;
			case 'roads':
				overlays.roads.setVisibility(!overlays.roads.getVisibility());
				break;
			case 'sun':
				var sun = ge.getSun();
				sun.setVisibility(!sun.getVisibility());
				break;
			case 'terrain':
				overlays.terrain.setVisibility(!overlays.terrain.getVisibility());
				break;
			case 'time':
				var timeControl = geTime.getControl();
				if (geTime.getHistoricalImageryEnabled()) {
					timeControl.getVisibility() ? timeControl.setVisibility(ge.VISIBILITY_HIDE) : timeControl.setVisibility(ge.VISIBILITY_SHOW);
				}
				else if (timeControl.getVisibility()) {
					geTime.setHistoricalImageryEnabled(false);
				}
				else {
					geTime.setHistoricalImageryEnabled(true);
				}
				break;
			default:
				var errorMessage = 'Unrecognised Overlay Type: ' + overlayId;
				var error = new Error();
				error.message = errorMessage;
				throw error;
		}
	};
	this.createEarthInstance = function() {
		google.earth.createInstance(canvasDivId, _initEarth, _initEarthFailed);
	};
	this.setCanvasPositionAndSize = function(top, left, width, height) {
		$(earthCanvas).css('top', top).css('left', left).css('width', width).css('height', height);
	};
	this.addKmlFromUrl = function(newKmlUrl) {
		if (currentKmlObject) {
			if (ge) {
				ge.getFeatures().removeChild(currentKmlObject);
			}
			currentKmlObject = null;
		}
		kmlUrl = newKmlUrl;
		if (typeof ge !== 'undefined') {
			_fetchKml();
		}
	};
	this.show = function() {
		earthCanvas.style.display = 'block';
	};

	//constructor
	_createEarthCanvas();
};

org.anotherearth.EarthsController = function(earthsManager, initialLocks) {
	//private fields
	var controlPanel;
	var leftEarth, rightEarth, linkCreatorButton, altLockingCheckbox, tiltLockingCheckbox, latLngLockingCheckbox, headingLockingCheckbox, donorCameraSelector;
	var earthsManager = earthsManager;
	var loadedEarths = 0;
	var donor, receiver;
	var timeOfLastAttemptedSave = null;
	var timeOfPenultimateAttemptedSave = null;
	var minTimeBetweenSaves = 2000; //ms
	var moveInitializingEarth = null;

	//private methods

	//TODO: calculate diffs in model from undo data?
	var _evaluateCameraViewCenterDiff = function() {
		if (!earthsManager.getIsHorizMovementLocked()) {
			earthsManager.setCameraCoordDiff('lat', null);
			earthsManager.setCameraCoordDiff('lng', null);
		} 
		else {
			var leftEarthCamProps  = leftEarth.getCameraProperties();
			var rightEarthCamProps = rightEarth.getCameraProperties();
			earthsManager.setCameraCoordDiff('lat', (leftEarthCamProps.lat - rightEarthCamProps.lat));
			earthsManager.setCameraCoordDiff('lng', (leftEarthCamProps.lng - rightEarthCamProps.lng));
		}
	};

	var _evaluateCameraAltitudeDiff = function() {
		if (!earthsManager.getIsVertMovementLocked()) {
			earthsManager.setCameraCoordDiff('alt', null);
		}
		else {
			earthsManager.setCameraCoordDiff('alt', (leftEarth.getCameraProperties().alt - rightEarth.getCameraProperties().alt));
		}
	};

	var _evaluateCameraTiltDiff = function() {
		if (!earthsManager.getIsTiltLocked()) {
			earthsManager.setCameraCoordDiff('tilt', null);
		}
		else {
			earthsManager.setCameraCoordDiff('tilt', (leftEarth.getCameraProperties().tilt - rightEarth.getCameraProperties().tilt));
		}
	};

	var _evaluateCameraHeadingDiff = function() {
		if (!earthsManager.getIsHeadingLocked()) {
			earthsManager.setCameraCoordDiff('head', null);
		}
		else {
			earthsManager.setCameraCoordDiff('head', (leftEarth.getCameraProperties().head - rightEarth.getCameraProperties().head));
		}
	};

	//privileged methods
	this.getMoveInitializingEarth = function() {
		return moveInitializingEarth;
	};
	this.setMoveInitializingEarth = function(newInitializingEarth) {
		moveInitializingEarth = newInitializingEarth;
	};
	this.getIsTimeElapsedSufficientForSave = function() {
		var currentTime = new Date().getTime();
		var isTimeElapsedSufficient = true;
		if (timeOfLastAttemptedSave !== null) {
			timeOfPenultimateAttemptedSave = timeOfLastAttemptedSave;
			timeOfLastAttemptedSave = currentTime;
			isTimeElapsedSufficient = (timeOfLastAttemptedSave-timeOfPenultimateAttemptedSave > minTimeBetweenSaves);
		}
		else {
			timeOfPenultimateAttemptedSave = timeOfLastAttemptedSave;
			timeOfLastAttemptedSave = currentTime;
		}
		return isTimeElapsedSufficient;
	};
	this.respondToMouseUpOnEarth = function() {
		timeOfLastAttemptedSave        = null;
		timeOfPenultimateAttemptedSave = null;
	};
	this.respondToEarthFullyLoading = function() {
		if (++loadedEarths == 2) {
			altLockingCheckbox.setIsChecked(initialLocks.alt);
			tiltLockingCheckbox.setIsChecked(initialLocks.tilt);
			latLngLockingCheckbox.setIsChecked(initialLocks.latLng);
			headingLockingCheckbox.setIsChecked(initialLocks.heading);
			donorCameraSelector.setIsChecked(true, donorCameraSelector.getIndexOf('left_camera'));
			controlPanel.performNewEarthPropsUpdate();
			controlPanel.show();
			//need to set these widths in pixels once the elements have been created to avoid jerkiness and resizing with subpanel and panel shrinking (jQuery flaws)
			$('#' + org.anotherearth.CP_ID + ' button').width($('#' + org.anotherearth.CP_ID + ' button').width());
			$('#' + org.anotherearth.CP_ID).width($('#' + org.anotherearth.CP_ID).width());
			var viewportHeight = window.innerHeight ? window.innerHeight : $(window).height();
			var controlPanelElement = controlPanel.getContainingElement();
			var totalPanelHeight =  $(controlPanelElement).outerHeight();
			var panelTopOffset = parseInt(($(controlPanelElement).css('top')).replace(/(\d+)px/, "$1"), 10);
			if (viewportHeight <= (($(controlPanel.getContainingElement()).outerHeight()) + panelTopOffset)) {
				controlPanel.closeSubPanels();
			}
		}
	};
	this.moveOtherEarthIfLocked = function(givingEarth) {
		movingEarth = givingEarth;

		var isTiltLocked          = earthsManager.getIsTiltLocked();
		var isHeadingLocked       = earthsManager.getIsHeadingLocked();
		var isHorizMovementLocked = earthsManager.getIsHorizMovementLocked();
		var isVertMovementLocked  = earthsManager.getIsVertMovementLocked();

		if (isHorizMovementLocked || isVertMovementLocked || isTiltLocked || isHeadingLocked) {
			var takingEarth = {};
			var newTakerProps = {};
			var earthCamDiffs = {};
			var takingCamProps, givingCamProps;
			var LCameraProps  = leftEarth.getCameraProperties();
			var RCameraProps = rightEarth.getCameraProperties();

			if (givingEarth === leftEarth) {
				earthCamDiffs = earthsManager.getLtoRCameraPropertyDifferences();
				takingEarth = rightEarth;
				takingCamProps = RCameraProps;
				givingCamProps = LCameraProps;
			}
			else {
				earthCamDiffs = earthsManager.getRtoLCameraPropertyDifferences();
				takingEarth = leftEarth;
				takingCamProps = LCameraProps;
				givingCamProps = RCameraProps;
			}
			
			if (earthCamDiffs.alt === null) {
				newTakerProps.alt = takingCamProps.alt;
			}
			else {
				var calculatedTakerAlt = givingCamProps.alt - earthCamDiffs.alt;
				newTakerProps.alt = ((calculatedTakerAlt > 0) ? calculatedTakerAlt : 0);//attempting to set a negative altitude causes problems
			}

			if (earthCamDiffs.lng === null) {
				newTakerProps.lng = takingCamProps.lng;
			}
			else {
				var calculatedTakerLng = givingCamProps.lng - earthCamDiffs.lng;
				if (calculatedTakerLng >= 180) {//TODO: can this be more succint?
					newTakerProps.lng = calculatedTakerLng - 360;
				}
				else if (calculatedTakerLng <= -180) {
					newTakerProps.lng = calculatedTakerLng + 360;
				}
				else {
					newTakerProps.lng = calculatedTakerLng;
				}
			}	
			
			newTakerProps.lat  = ((earthCamDiffs.lat  === null) ? takingCamProps.lat  : givingCamProps.lat  - earthCamDiffs.lat);
			newTakerProps.tilt = ((earthCamDiffs.tilt === null) ? takingCamProps.tilt : givingCamProps.tilt - earthCamDiffs.tilt);
			newTakerProps.head = ((earthCamDiffs.head === null) ? takingCamProps.head : givingCamProps.head - earthCamDiffs.head);
			
			takingEarth.setCameraProperties(newTakerProps.lat,
			                                newTakerProps.lng,
			                                newTakerProps.alt,
			                                newTakerProps.tilt,
			                                newTakerProps.head,
			                                true);
		}
	};
	this.setLinkCreatorButton = function(newLinkCreatorButton) {
		linkCreatorButton = newLinkCreatorButton;
	};
	this.setLeftEarth = function(earth) {
		leftEarth = earth;
	};
	this.setRightEarth = function(earth) {
		rightEarth = earth;
	};
	this.setAltLockingCheckbox = function(checkbox) {
		altLockingCheckbox = checkbox;
	};
	this.setTiltLockingCheckbox = function(checkbox) {
		tiltLockingCheckbox = checkbox;
	};
	this.setLatLngLockingCheckbox = function(checkbox) {
		latLngLockingCheckbox = checkbox;
	};
	this.setHeadingLockingCheckbox = function(checkbox) {
		headingLockingCheckbox = checkbox;
	};
	this.setDonorCameraSelector = function(radioButtons) {
		//TODO: type checking
		donorCameraSelector = radioButtons;
	};
	this.setControlPanel = function(newPanel) {
		controlPanel = newPanel;
	};
	this.setLeftSearchBar = function(newBar) {
		leftSearchBar = newBar;
	};
	this.setRightSearchBar = function(newBar) {
		rightSearchBar = newBar;
	};
	this.jumpCameraCoords = function(earth, lat, lng, alt, tilt, head) {
		earth.setCameraProperties(lat, lng, alt, tilt, head, true);
		this.saveCameraProperties(false);
		_evaluateCameraViewCenterDiff();
		_evaluateCameraAltitudeDiff();
		_evaluateCameraHeadingDiff();
		_evaluateCameraTiltDiff();
	};
	this.equateCameraAltitudes = function() {
		if (earthsManager.getIsVertMovementLocked()) {
			earthsManager.setCameraCoordDiff('alt', 0);
		}
		var donorProps    = donor.getCameraProperties();
		var receiverProps = receiver.getCameraProperties();
		receiver.setCameraProperties(receiverProps.lat,
		                          receiverProps.lng,
		                          donorProps.alt,
		                          receiverProps.tilt,
		                          receiverProps.head,
		                          true);
	};
	this.equateCameraLatsLngs = function() {
		if (earthsManager.getIsHorizMovementLocked()) {
			earthsManager.setCameraCoordDiff('lat', 0);
			earthsManager.setCameraCoordDiff('lng', 0);
		}
		var donorProps    = donor.getCameraProperties();
		var receiverProps = receiver.getCameraProperties();
		receiver.setCameraProperties(donorProps.lat,
		                             donorProps.lng,
		                             receiverProps.alt,
		                             receiverProps.tilt,
		                             receiverProps.head,
		                             true);
	};
	this.equateCameraTilts = function() {
		if (earthsManager.getIsTiltLocked()) {
			earthsManager.setCameraCoordDiff('tilt', 0);
		}
		var donorProps    = donor.getCameraProperties();
		var receiverProps = receiver.getCameraProperties();
		receiver.setCameraProperties(receiverProps.lat,
		                             receiverProps.lng,
		                             receiverProps.alt,
		                             donorProps.tilt,
		                             receiverProps.head,
		                             true);
	};
	this.equateCameraHeadings = function() {
		if (earthsManager.getIsHeadingLocked()) {
			earthsManager.setCameraCoordDiff('head', 0);
		}
		var donorProps    = donor.getCameraProperties();
		var receiverProps = receiver.getCameraProperties();
		receiver.setCameraProperties(receiverProps.lat,
		                             receiverProps.lng,
		                             receiverProps.alt,
		                             receiverProps.tilt,
		                             donorProps.head,
		                             true);
	};
	this.toggleEarthExtra = function(earthId, extraId) {
		(earthId === 'LEarth') ? leftEarth.toggleExtra(extraId) : rightEarth.toggleExtra(extraId);
	};
	this.toggleMovementLock = function(lockType) {
		linkCreatorButton.setIsLinkVisible(false);
		linkCreatorButton.setIsEnabled(true);
		if (lockType === 'vertical') {
			earthsManager.setIsVertMovementLocked(!earthsManager.getIsVertMovementLocked());
			_evaluateCameraAltitudeDiff();
		} 
		else if (lockType === 'horizontal') {
			earthsManager.setIsHorizMovementLocked(!earthsManager.getIsHorizMovementLocked());
			_evaluateCameraViewCenterDiff();
		}
		else if (lockType === 'head') {
			earthsManager.setIsHeadingLocked(!earthsManager.getIsHeadingLocked());
			_evaluateCameraHeadingDiff();
		}
		else if (lockType === 'tilt') {
			earthsManager.setIsTiltLocked(!earthsManager.getIsTiltLocked());
			_evaluateCameraTiltDiff();
		}
	};
	this.toggleDonorEarth = function(newDonorValue) {
		if (newDonorValue === 'left_earth') {
			donor    = leftEarth;
			receiver = rightEarth;
		}
		else if (newDonorValue === 'right_earth') {
			donor    = rightEarth;
			receiver = leftEarth;
		}
		else {
			throw new Error('unrecognised donor value: ');
		}
	};
	this.saveCameraProperties = function(isCurrentPropertySetOverwritten) {
		var LEarthProps, REarthProps;
		try {
			LEarthProps = leftEarth.getCameraProperties();
			REarthProps = rightEarth.getCameraProperties();
		}
		catch (err) {
			if (err instanceof ReferenceError) {//At least one Earth has not been initialized - safe to ignore.
				return;
			}
			else {
				throw err;
			}
		}
		moveInitializingEarth = null;//the move is over
		earthsManager.saveCameraProperties(LEarthProps, REarthProps, isCurrentPropertySetOverwritten);
	};
	this.undo = function() {
		earthsManager.undo();
	};
	this.redo = function() {
		earthsManager.redo();
	};
	this.createLink = function() {
		var url = org.anotherearth.URLManager.createURLFromCurrentParameters(leftEarth, rightEarth, earthsManager);
		linkCreatorButton.addLink(url);
		linkCreatorButton.setIsLinkVisible(true);
		linkCreatorButton.setIsEnabled(false);
	};
	this.performUndoRedoUpdate = function() {//called by model, subject of this registered observer
		var propsRevertedTo = earthsManager.getCurrentCameraProperties();
		if (typeof propsRevertedTo === 'undefined' || propsRevertedTo === null) {
			return;
		}
		leftEarth.setCameraProperties( propsRevertedTo.leftEarth.lat,
		                               propsRevertedTo.leftEarth.lng,
		                               propsRevertedTo.leftEarth.alt,
		                               propsRevertedTo.leftEarth.tilt,
		                               propsRevertedTo.leftEarth.head,
		                               true);
		rightEarth.setCameraProperties(propsRevertedTo.rightEarth.lat,
		                               propsRevertedTo.rightEarth.lng,
		                               propsRevertedTo.rightEarth.alt,
		                               propsRevertedTo.rightEarth.tilt,
		                               propsRevertedTo.rightEarth.head,
		                               true);
		_evaluateCameraViewCenterDiff();
		_evaluateCameraAltitudeDiff();
		_evaluateCameraHeadingDiff();
		_evaluateCameraTiltDiff();
	};
};

org.anotherearth.URLManager = {};
org.anotherearth.URLManager.createURLFromCurrentParameters = function(LEarth, REarth, earthsManager) {//static method
		//TODO:add times
		var LEarthProps = LEarth.getCameraProperties();
		var REarthProps = REarth.getCameraProperties();
		var parameters = {};
		parameters.LLat  = LEarthProps.lat;
		parameters.LLng  = LEarthProps.lng;
		parameters.LAlt  = LEarthProps.alt;
		parameters.LTilt = LEarthProps.tilt;
		parameters.LHead = LEarthProps.head;
		parameters.RLat  = REarthProps.lat;
		parameters.RLng  = REarthProps.lng;
		parameters.RAlt  = REarthProps.alt;
		parameters.RTilt = REarthProps.tilt;
		parameters.RHead = REarthProps.head;
		parameters.isTiltLocked    = (earthsManager.getIsTiltLocked())          ? 1 : 0;
		parameters.isHeadingLocked = (earthsManager.getIsHeadingLocked())       ? 1 : 0;
		parameters.isAltLocked     = (earthsManager.getIsVertMovementLocked())  ? 1 : 0;
		parameters.isLatLngLocked  = (earthsManager.getIsHorizMovementLocked()) ? 1 : 0;
		var url = location.protocol + '//' + location.host + location.pathname;

		var _getSeparator = function() {
			_getSeparator = function() {//This changes _getSeparator() from a function returning "?" to one returning "&".
				return "&";               //I.e. for the first call, ? is returned, then subsequently &.
			};
			return "?";
		};

		for (var parameter in parameters) {
			if (parameters.hasOwnProperty(parameter)) {
				url += _getSeparator() + parameter + "=" +  parameters[parameter];
			}
		}

		return url;
};
org.anotherearth.URLManager.getURLQueryStringValue = function(queryStringArg) {//static method
	var valueArgPair = new RegExp(queryStringArg + '=([-,\\d\.]*)');
	var matches = location.search.match(valueArgPair);
	if (matches !==  null) {
		return matches[1];
	}
	else {
		return null;
	}
};

org.anotherearth.Translator = {};
org.anotherearth.Translator.translatePage = function() {
	var browserLanguage = google.maps.Language.getLanguageCode();
	//convert text to browser language
	if (browserLanguage !== "en" && google.language.isTranslatable(browserLanguage)) {
		var parser = function(text, callback) {
			google.language.translate(text, "en", browserLanguage, function(result) {
				if (!result.error) { 
					result.translation = result.translation.replace(/&#\d{2};/, "");
					callback(result.translation);
				}
			});
		};

		var trans = new Translator(parser);
		trans.sync = false;
		trans.traverse($('body')[0]);
	}
};

org.anotherearth.ToggleMovementLockCommand = function(lockType, earthsController) {//implements Command
	var lockType = lockType;
	var earthsController = earthsController;
	
	this.execute = function() {
		earthsController.toggleMovementLock(lockType);
	};
};

org.anotherearth.ToggleEarthExtraCommand = function(earthsController) {
	var earthsController;

	this.execute = function(selectBox, option) {
		var earthId = ((selectBox.id === org.anotherearth.CP_R_EARTH_EXTRAS_SELECTOR_ID) ? 'REarth' : 'LEarth'); 
		earthsController.toggleEarthExtra(earthId, option.value);
	};
};

org.anotherearth.LinkCreatorCommand = function(earthsController) {//implements Command
	var earthsController = earthsController;
	
	this.execute = function() {
		earthsController.createLink();
	};
};

org.anotherearth.UndoCommand = function(earthsController) { //implements Command
	var earthsController = earthsController;
	var enabled = true;

	this.execute = function() {
		if (!enabled) {//concurrency bug prevention
			return;
		}
		enabled = false;
		earthsController.undo();
		enabled = true;
	};
};

org.anotherearth.RedoCommand = function(earthsController) {//implements Command
	var earthsController = earthsController;
	var enabled = true;

	this.execute = function() {
		if (!enabled) {//concurrency bug prevention
			return;
		}
		enabled = false;
		earthsController.redo();
		enabled = true;
	};
};

org.anotherearth.EquateCameraAltitudesCommand = function(earthsController) {//implements Command interface
	var earthsController = earthsController;

	this.execute = function() {
		earthsController.equateCameraAltitudes();
		earthsController.saveCameraProperties(false);
	};
};

org.anotherearth.EquateCameraLatsLngsCommand = function(earthsController) { //implements Command interface
	var earthsController = earthsController;

	this.execute = function() {
		earthsController.equateCameraLatsLngs();
		earthsController.saveCameraProperties(false);
	};
};

org.anotherearth.EquateCameraTiltsCommand = function(earthsController) { //implements Command interface
	var earthsController = earthsController;

	this.execute = function() {
		earthsController.equateCameraTilts();
		earthsController.saveCameraProperties(false);
	};
};

org.anotherearth.EquateCameraHeadingsCommand = function(earthsController) { //implements Command interface
	var earthsController = earthsController;

	this.execute = function() {
		earthsController.equateCameraHeadings();
		earthsController.saveCameraProperties(false);
	};
};

org.anotherearth.ToggleDonorEarthCommand = function(earthsController) {
	var earthsController = earthsController;

	this.execute = function(option) {
		earthsController.toggleDonorEarth(option.value);
	};
};

org.anotherearth.NullCommand = function() {
	this.execute = function() {};
};
