//slight overhead checking and/or creating namespaces justified by removing dependency on script inclusion order

org = window.org || {};
org.anotherearth = window.org.anotherearth || {};
org.anotherearth.controller = window.org.anotherearth.controller || {};

org.anotherearth.controller.EarthsController = function(earthsManager, urlManager, initialLocks) {
	//private fields
	var controlPanel;
	var leftEarth, rightEarth, linkCreatorButton;
	var earthsManager = earthsManager;
	var urlManager = urlManager;
	var donor, receiver;
	var timeOfLastAttemptedSave = null;
	var timeOfPenultimateAttemptedSave = null;
	var minTimeBetweenSaves = 2000; //ms
	var moveInitializingEarth = null;
	var responseToEarthLoading = null;

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
	this.setEarthLoadingResponseCallback = function (callback) {
		responseToEarthLoading = callback;
	};
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
		responseToEarthLoading();
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
		var url = urlManager.createURLFromCurrentParameters(leftEarth, rightEarth, earthsManager);
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
}