//slight overhead checking and/or creating namespaces justified by removing dependency on script inclusion order

org = window.org || {};
org.anotherearth = window.org.anotherearth || {};
org.anotherearth.command = window.org.anotherearth.command || {};

org.anotherearth.command.ToggleEarthExtraCommand = function(earthsController, earthId, extraId) {
	var earthsController = earthsController;
	var earthId = earthId;
	var extraId = extraId;

	this.execute = function() {
		earthsController.toggleEarthExtra(earthId, extraId);
	};
};

org.anotherearth.command.ToggleEarthExtraCommandFactory = function(earthsController, earthId) {
	var earthsController = earthsController;
	var earthId = earthId;

	this.createParameterizedCommand = function(extraId) {
		return new org.anotherearth.command.ToggleEarthExtraCommand(earthsController, earthId, extraId);
	};
};