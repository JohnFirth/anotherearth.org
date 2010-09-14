org.anotherearth.Container = (function() { //singleton with deferred instantiation.  Dependency injector - primarily to facilitate unit testing.
	var uniqueInstance;

	function constructor() {
		var coms = {}; //coms = components
		var ae 	 = org.anotherearth;
		var body = $('body')[0];

		var urlManager = org.anotherearth.URLManager;
		var initialLCameraProps = {};
		var initialRCameraProps = {};
		var initialLocks = {};
		var queryStringValues = {};
		queryStringValues.latLng  = urlManager.getURLQueryStringValue('isLatLngLocked');
		queryStringValues.alt     = urlManager.getURLQueryStringValue('isAltLocked');
		queryStringValues.tilt    = urlManager.getURLQueryStringValue('isTiltLocked');
		queryStringValues.heading = urlManager.getURLQueryStringValue('isHeadingLocked'); 
		for (var value in queryStringValues) {
			initialLocks[value] = ((queryStringValues[value] !== null) ? parseInt(queryStringValues[value], 10) : 1);
		}
		initialLCameraProps.lat  = parseFloat(urlManager.getURLQueryStringValue('LLat'))  || org.anotherearth.DEFAULT_L_EARTH_COORDS.LAT;
		initialLCameraProps.lng  = parseFloat(urlManager.getURLQueryStringValue('LLng'))  || org.anotherearth.DEFAULT_L_EARTH_COORDS.LNG;
		initialLCameraProps.alt  = parseFloat(urlManager.getURLQueryStringValue('LAlt'))  || org.anotherearth.DEFAULT_L_EARTH_COORDS.ALT;
		initialLCameraProps.tilt = parseFloat(urlManager.getURLQueryStringValue('LTilt')) || org.anotherearth.DEFAULT_L_EARTH_COORDS.TILT;
		initialLCameraProps.head = parseFloat(urlManager.getURLQueryStringValue('LHead')) || org.anotherearth.DEFAULT_L_EARTH_COORDS.HEAD;
		initialRCameraProps.lat  = parseFloat(urlManager.getURLQueryStringValue('RLat'))  || org.anotherearth.DEFAULT_R_EARTH_COORDS.LAT;
		initialRCameraProps.lng  = parseFloat(urlManager.getURLQueryStringValue('RLng'))  || org.anotherearth.DEFAULT_R_EARTH_COORDS.LNG;
		initialRCameraProps.alt  = parseFloat(urlManager.getURLQueryStringValue('RAlt'))  || org.anotherearth.DEFAULT_R_EARTH_COORDS.ALT;
		initialRCameraProps.tilt = parseFloat(urlManager.getURLQueryStringValue('RTilt')) || org.anotherearth.DEFAULT_R_EARTH_COORDS.TILT;
		initialRCameraProps.head = parseFloat(urlManager.getURLQueryStringValue('RHead')) || org.anotherearth.DEFAULT_R_EARTH_COORDS.HEAD;

		coms.welcomePanel = new ae.Panel(org.anotherearth.WELCOME_PANEL_BODY_ID,
		                                 org.anotherearth.WELCOME_PANEL_HEADER_ID,
		                                 org.anotherearth.WELCOME_PANEL_ID,
		                                 'Welcome to anotherearth.org',
		                                 body,
		                                 true,
		                                 true,
		                                 true);
		var welcomeText = document.createElement('div');
		welcomeText.innerHTML = '<p>This application gives you a number of tools with which you can easily ' +
		                        'and comprehensively compare two views of the Earth, using the Google Earth browser plugin. ' +
		                        'These include the ability to synchronize the movement of two Earths, ' + 
		                        'select layers such as buildings, roads and borders for the Earths, ' +
		                        'jump to locations of your choice, undo/redo any movements, and save coordinates as a URL.</p>' +
		                        '<p>Please refer to Google\'s documentation ' +
		                        'for guides to Google Earth and its navigation control.</p>' +
		                        '<p>If your browser\'s preferred language isn\'t English then using a ' +
		                        'translator, <span id=\"google_branding\"></span>, ' +
		                        'I\'ve attempted to convert the text.</p>' +
		                        '<p>I\'m planning on giving you the ability to compare the Earth in two ' +
		                        'different states, e.g. at two different times - please check back.</p>' +
		                        '<p>I hope you find the application useful! Feel free to contact me by email: contact(at)anotherearth(dot)org</p>';
		
		if (!$.support.leadingWhitespace) {//if is IE
			welcomeText.innerHTML += '<p>For a somewhat enhanced experience with this site, I recommend using a browser other than Internet Explorer.</p>';
		}

		coms.welcomePanel.addChild(new org.anotherearth.MiscellaneousElement(welcomeText));
		google.language.getBranding('google_branding');
		
		//main MVC objects
		coms.earthsManager    = new ae.EarthsManager();
		coms.earthsController = new ae.EarthsController(coms.earthsManager, initialLocks); 
		coms.leftEarth	      = new org.anotherearth.LockableEarth(org.anotherearth.L_EARTH_ID, coms.earthsController, initialLCameraProps);
		coms.rightEarth       = new org.anotherearth.LockableEarth(org.anotherearth.R_EARTH_ID, coms.earthsController, initialRCameraProps);
		coms.controlPanel     = new ae.ControlPanel(org.anotherearth.CP_BUTTONS_CONTAINER_ID,//TODO: consider using builder pattern
		                                            org.anotherearth.CP_HEADER_ID,
		                                            org.anotherearth.CP_ID,
		                                            'Control Panel',
		                                            body,
		                                            true,
		                                            true,
		                                            false);
		coms.earthsController.setLeftEarth(coms.leftEarth);
		coms.earthsController.setRightEarth(coms.rightEarth);
		coms.earthsController.setControlPanel(coms.controlPanel);
		coms.earthsManager.registerNewEarthObserver(coms.controlPanel);
		coms.earthsManager.registerUndoRedoObserver(coms.controlPanel);
		coms.earthsManager.registerUndoRedoObserver(coms.earthsController);

		/*comand objects*/
			//locking checkboxes
		coms.linkCreatorCommand = new ae.LinkCreatorCommand(coms.earthsController);
		coms.toggleVerticalMovementLockCommand 	 = new ae.ToggleMovementLockCommand('vertical', coms.earthsController);
		coms.toggleHorizontalMovementLockCommand = new ae.ToggleMovementLockCommand('horizontal', coms.earthsController);
		coms.toggleTiltLockCommand    = new ae.ToggleMovementLockCommand('tilt', coms.earthsController);
		coms.toggleHeadingLockCommand = new ae.ToggleMovementLockCommand('head', coms.earthsController);
		
			//buttons
		coms.undoCommand = new ae.UndoCommand(coms.earthsController);
		coms.redoCommand = new ae.RedoCommand(coms.earthsController);
		coms.equateCameraAltitudesCommand = new ae.EquateCameraAltitudesCommand(coms.earthsController);
		coms.equateCameraLatsLngsCommand  = new ae.EquateCameraLatsLngsCommand(coms.earthsController);
		coms.equateCameraTiltsCommand     = new ae.EquateCameraTiltsCommand(coms.earthsController);
		coms.equateCameraHeadingsCommand  = new ae.EquateCameraHeadingsCommand(coms.earthsController);

			//select box
		coms.toggleEarthExtraCommand = new ae.ToggleEarthExtraCommand(coms.earthsController);

			//radio buttons
		coms.toggleDonorEarthCommand = new ae.ToggleDonorEarthCommand(coms.earthsController);

		//strategy objects
		coms.linkCreatingButtonUpdateStrategy = new ae.LinkCreatingButtonUpdateStrategy();
		coms.undoButtonUpdateStrategy         = new ae.UndoButtonUpdateStrategy();
		coms.redoButtonUpdateStrategy         = new ae.RedoButtonUpdateStrategy();
		coms.equateCameraLatsLngsStrategy     = new ae.EquateLatLngsButtonStrategy();
		coms.equateCameraAltitudesStrategy    = new ae.EquateAltitudesButtonStrategy();
		coms.equateCameraTiltsStrategy        = new ae.EquateTiltsButtonStrategy();
		coms.equateCameraHeadingsStrategy     = new ae.EquateHeadingsButtonStrategy();
		
		//gui objects
			//checkboxes
		coms.altLockingCheckbox     = new ae.TwoEarthsCheckbox("altitudes",
		                                                      org.anotherearth.CP_ALTITUDE_LOCK_CHECKBOX_ID,
		                                                      coms.earthsManager);
		coms.latLngLockingCheckbox  = new ae.TwoEarthsCheckbox("latitudes and longitudes",
		                                                      org.anotherearth.CP_VIEW_CENTER_LOCK_CHECKBOX_ID,
		                                                      coms.earthsManager);
		coms.tiltLockingCheckbox    = new ae.TwoEarthsCheckbox("tilts",
		                                                      org.anotherearth.CP_TILT_LOCK_CHECKBOX_ID,
		                                                      coms.earthsManager);
		coms.headingLockingCheckbox = new ae.TwoEarthsCheckbox("headings",
		                                                       org.anotherearth.CP_HEAD_LOCK_CHECKBOX_ID,
		                                                       coms.earthsManager);

		coms.altLockingCheckbox.addClickEventListener(coms.toggleVerticalMovementLockCommand);
		coms.latLngLockingCheckbox.addClickEventListener(coms.toggleHorizontalMovementLockCommand);
		coms.tiltLockingCheckbox.addClickEventListener(coms.toggleTiltLockCommand);
		coms.headingLockingCheckbox.addClickEventListener(coms.toggleHeadingLockCommand);

		//buttons
		coms.undoButton = new ae.TwoEarthsButton('undo', org.anotherearth.CP_UNDO_BUTTON_ID, coms.earthsManager);
		coms.undoButton.addClickEventListener(coms.undoCommand);
		coms.undoButton.setUndoRedoUpdateStrategy(coms.undoButtonUpdateStrategy);
		coms.undoButton.setNewEarthPropsUpdateStrategy(coms.undoButtonUpdateStrategy);
		coms.undoButton.setIsEnabled(false);

		coms.redoButton = new ae.TwoEarthsButton('redo', org.anotherearth.CP_REDO_BUTTON_ID, coms.earthsManager);
		coms.redoButton.addClickEventListener(coms.redoCommand);
		coms.redoButton.setUndoRedoUpdateStrategy(coms.redoButtonUpdateStrategy);
		coms.redoButton.setNewEarthPropsUpdateStrategy(coms.redoButtonUpdateStrategy);
		coms.redoButton.setIsEnabled(false);
		
		coms.equateCameraLatsLngsButton = new ae.TwoEarthsButton("latitude and longitude",
		                                                         org.anotherearth.EQUATE_CAM_LATS_LNGS_BUTTON_ID,
		                                                         coms.earthsManager);
		coms.equateCameraLatsLngsButton.addClickEventListener(coms.equateCameraLatsLngsCommand);
		coms.equateCameraLatsLngsButton.setUndoRedoUpdateStrategy(coms.equateCameraLatsLngsStrategy);
		coms.equateCameraLatsLngsButton.setNewEarthPropsUpdateStrategy(coms.equateCameraLatsLngsStrategy);
		
		coms.equateCameraAltitudesButton = new ae.TwoEarthsButton('altitude',
		                                                          org.anotherearth.EQUATE_CAM_ALTITUDES_BUTTON_ID,
		                                                          coms.earthsManager);
		coms.equateCameraAltitudesButton.addClickEventListener(coms.equateCameraAltitudesCommand);
		coms.equateCameraAltitudesButton.setUndoRedoUpdateStrategy(coms.equateCameraAltitudesStrategy);
		coms.equateCameraAltitudesButton.setNewEarthPropsUpdateStrategy(coms.equateCameraAltitudesStrategy);

		coms.equateCameraTiltsButton = new ae.TwoEarthsButton('tilt',
		                                                      org.anotherearth.EQUATE_CAM_TILTS_BUTTON_ID,
		                                                      coms.earthsManager);
		coms.equateCameraTiltsButton.addClickEventListener(coms.equateCameraTiltsCommand);
		coms.equateCameraTiltsButton.setUndoRedoUpdateStrategy(coms.equateCameraTiltsStrategy);
		coms.equateCameraTiltsButton.setNewEarthPropsUpdateStrategy(coms.equateCameraTiltsStrategy);
		
		coms.equateCameraHeadingsButton = new ae.TwoEarthsButton('heading',
		                                                         org.anotherearth.EQUATE_CAM_HEADINGS_BUTTON_ID,
		                                                         coms.earthsManager);
		coms.equateCameraHeadingsButton.addClickEventListener(coms.equateCameraHeadingsCommand);
		coms.equateCameraHeadingsButton.setUndoRedoUpdateStrategy(coms.equateCameraHeadingsStrategy);
		coms.equateCameraHeadingsButton.setNewEarthPropsUpdateStrategy(coms.equateCameraHeadingsStrategy);

		coms.linkCreatorButton = new ae.LinkCreatorButton("create link",
		                                                  org.anotherearth.CP_LINK_CREATOR_BUTTON_ID,
		                                                  org.anotherearth.CP_LINK_BOX_ID,
		                                                  coms.earthsManager);
		coms.linkCreatorButton.setUndoRedoUpdateStrategy(coms.linkCreatingButtonUpdateStrategy);
		coms.linkCreatorButton.setNewEarthPropsUpdateStrategy(coms.linkCreatingButtonUpdateStrategy);
		coms.linkCreatorButton.setIsEnabled(true);
		coms.linkCreatorButton.addClickEventListener(coms.linkCreatorCommand);
		coms.earthsController.setLinkCreatorButton(coms.linkCreatorButton);

		//radio buttons
		var donorRadios = [];
		var leftCameraRadios   = {};
		var rightCameraRadios  = {};
		leftCameraRadios.id    = 'pick_left_camera';
		leftCameraRadios.value = 'left_earth';
		leftCameraRadios.name  = 'donor_camera_selector';
		leftCameraRadios.label = 'from left camera';
		donorRadios.push(leftCameraRadios);
		rightCameraRadios.id    = 'pick_right_camera';
		rightCameraRadios.value = 'right_earth';
		rightCameraRadios.name  = 'donor_camera_selector'; 
		rightCameraRadios.label = 'from right camera';
		donorRadios.push(rightCameraRadios);
		coms.donorRadioButtons = new ae.RadioButtons(donorRadios, 'donor_camera_selector');
		coms.donorRadioButtons.addClickEventListener(coms.toggleDonorEarthCommand);

		//select box
		var borderOption          = {};
		var hiResBuildingsOption  = {};	
		var loResBuildingsOption  = {};
		var roadsOption           = {};
		var terrainOption         = {};
		var sunOption             = {};
		var atmosphereOption      = {};
		var latLngGridlinesOption = {};
		borderOption.text  = "borders and towns";
		borderOption.value = "borders";
		hiResBuildingsOption.text  = "hi-res buildings";
		hiResBuildingsOption.value = "hiRes";
		loResBuildingsOption.text  = "lo-res buildings";
		loResBuildingsOption.value = "loRes";
		roadsOption.text  = "roads";
		roadsOption.value = "roads";
		terrainOption.text  = "terrain";
		terrainOption.value = "terrain";
		sunOption.text  = "sun";
		sunOption.value = "sun";
		atmosphereOption.text  = "atmosphere";
		atmosphereOption.value = "atmosphere";
		latLngGridlinesOption.text  = "grid";
		latLngGridlinesOption.value = "grid";
		var LEarthOptions = [borderOption,
		                        hiResBuildingsOption,
		                        loResBuildingsOption,
		                        roadsOption,
		                        terrainOption,
		                        //sunOption,TODO: reinstate when search boxes are part of (accordian) control panel
		                        //atmosphereOption,TODO: reinstate when checked on by default
														//TODO: make scale bars and status bar selectable
		                        latLngGridlinesOption];
		var REarthOptions = [$.extend(true, {}, borderOption),           //deep copies of the option objects
		                     $.extend(true, {}, hiResBuildingsOption),
                         $.extend(true, {}, loResBuildingsOption),
		                     $.extend(true, {}, roadsOption),
		                     $.extend(true, {}, terrainOption),
                         //$.extend(true, {}, sunOption),
		                     //$.extend(true, {}, atmosphereOption),
		                     $.extend(true, {}, latLngGridlinesOption)];
		
		coms.LEarthOptionSelector = new ae.SelectBox(LEarthOptions,
		                                             1,
		                                             'left Earth',
		                                             org.anotherearth.CP_L_EARTH_EXTRAS_SELECTOR_ID,
		                                             true);
		coms.REarthOptionSelector = new ae.SelectBox(REarthOptions,
		                                             1,
		                                             'right Earth',
		                                             org.anotherearth.CP_R_EARTH_EXTRAS_SELECTOR_ID,
		                                             true);

		coms.LEarthOptionSelector.addClickEventListener(coms.toggleEarthExtraCommand);
		coms.REarthOptionSelector.addClickEventListener(coms.toggleEarthExtraCommand);
		
		//search boxes
		coms.leftEarthSearch  = new org.anotherearth.SearchBox(coms.leftEarth, coms.earthsController, org.anotherearth.L_EARTH_SEARCH_BOX_ID, 'left Earth');
		coms.rightEarthSearch = new org.anotherearth.SearchBox(coms.rightEarth, coms.earthsController, org.anotherearth.R_EARTH_SEARCH_BOX_ID, 'right Earth');

		//control panel fieldsets
		coms.checkBoxSubPanel           = new ae.ShrinkableSubPanel("synchronize camera movement",
		                                                              org.anotherearth.CP_CAMERA_PROPERTY_LOCKING_SUB_PANEL_ID);	
		coms.cameraPropCopyingSubPanel  = new ae.ShrinkableSubPanel("copy camera coordinates",
		                                                              org.anotherearth.CP_CAMERA_PROPERTY_COPYING_SUB_PANEL_ID);	
		coms.earthOptionsSubPanel       = new ae.ShrinkableSubPanel("Earth overlays",
		                                                              org.anotherearth.CP_EARTH_OPTIONS_SUB_PANEL_ID);	
		coms.searchBoxSubPanel          = new ae.ShrinkableSubPanel("search",
		                                                              org.anotherearth.CP_SEARCH_BOX_SUB_PANEL_ID);	
		var googleBranding = document.createElement('span');
		googleBranding.id = 'google_search_branding';

		$(coms.searchBoxSubPanel.getContainingElement()).find('.sub_panel_title').append(googleBranding);

		coms.miscellaneousSubPanel      = new ae.ShrinkableSubPanel("undo/redo and save",
		                                                              org.anotherearth.CP_MISC_OPTIONS_SUB_PANEL_ID);	

		var getLoadedEarths = (function() {
			var loadedEarths = 0;
			return function() { return ++loadedEarths; };
		})();

		var responseToEarthFullyLoading = function() {
			if (getLoadedEarths() === 2) {
				coms.altLockingCheckbox.setIsChecked(initialLocks.alt);
				coms.tiltLockingCheckbox.setIsChecked(initialLocks.tilt);
				coms.latLngLockingCheckbox.setIsChecked(initialLocks.latLng);
				coms.headingLockingCheckbox.setIsChecked(initialLocks.heading);
				coms.donorRadioButtons.setIsChecked(true, coms.donorRadioButtons.getIndexOf('left_camera'));
				coms.controlPanel.performNewEarthPropsUpdate();
				coms.controlPanel.show();
				//need to set these widths in pixels once the elements have been created to avoid jerkiness and resizing with subpanel and panel shrinking (jQuery flaws)
				$('#' + org.anotherearth.CP_ID + ' button').width($('#' + org.anotherearth.CP_ID + ' button').width());
				$('#' + org.anotherearth.CP_ID).width($('#' + org.anotherearth.CP_ID).width());
				var viewportHeight = window.innerHeight ? window.innerHeight : $(window).height();
				var controlPanelElement = coms.controlPanel.getContainingElement();
				var panelTopOffset = parseInt(($(controlPanelElement).css('top')).replace(/(\d+)px/, "$1"), 10);
				if (viewportHeight <= (($(coms.controlPanel.getContainingElement()).outerHeight()) + panelTopOffset)) {
					coms.controlPanel.closeSubPanels();
				}
			}
		};

		coms.earthsController.setEarthLoadingResponseCallback(responseToEarthFullyLoading);

		//add gui widgets to control panel
		coms.checkBoxSubPanel.addChild(coms.altLockingCheckbox);
		coms.checkBoxSubPanel.addChild(coms.headingLockingCheckbox);
		coms.checkBoxSubPanel.addChild(coms.latLngLockingCheckbox);
		coms.checkBoxSubPanel.addChild(coms.tiltLockingCheckbox);
		coms.cameraPropCopyingSubPanel.addChild(coms.donorRadioButtons);
		coms.cameraPropCopyingSubPanel.addChild(coms.equateCameraAltitudesButton);
		coms.cameraPropCopyingSubPanel.addChild(coms.equateCameraHeadingsButton);
		coms.cameraPropCopyingSubPanel.addChild(coms.equateCameraLatsLngsButton);
		coms.cameraPropCopyingSubPanel.addChild(coms.equateCameraTiltsButton);
		coms.earthOptionsSubPanel.addChild(coms.LEarthOptionSelector);
		coms.earthOptionsSubPanel.addChild(coms.REarthOptionSelector);
		coms.miscellaneousSubPanel.addChild(coms.undoButton);
		coms.miscellaneousSubPanel.addChild(coms.redoButton);
		coms.miscellaneousSubPanel.addChild(coms.linkCreatorButton);
		coms.searchBoxSubPanel.addChild(coms.leftEarthSearch);
		coms.searchBoxSubPanel.addChild(coms.rightEarthSearch);
		coms.controlPanel.addChild(coms.earthOptionsSubPanel);
		coms.controlPanel.addChild(coms.searchBoxSubPanel);
		coms.controlPanel.addChild(coms.checkBoxSubPanel);
		coms.controlPanel.addChild(coms.cameraPropCopyingSubPanel);
		coms.controlPanel.addChild(coms.miscellaneousSubPanel);

		google.language.getBranding('google_search_branding');
		$('.gBrandingText').css('vertical-align', 'text-bottom');

		//PUBLIC METHOD
		return {
			getComponent: function(id) {
				return coms[id];
			}
		};
	}

	return {
		getInstance: function() {
			if (!uniqueInstance) {//Instantiate only if the instance doesn't exist
				uniqueInstance = constructor();
			}
			return uniqueInstance;
		}
	};
})();
