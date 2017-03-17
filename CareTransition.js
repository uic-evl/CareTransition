//
// SAGE2 application: CareTransition
// by: Manu Mathew Thomas <mthoma52@uic.edu>
//
// Copyright (c) 2015
//

"use strict";
var CareTransition = SAGE2_App.extend({
	init: function(data) {
		// Create div into the DOM
		this.SAGE2Init("div", data);
		// Set the DOM id
		this.element.id = "div_" + data.id;
		// Set the background to black
		this.element.style.backgroundColor = 'white';

		this.svg = Snap("100%", "100%");

		this.element.appendChild(this.svg.node);

		var ratio = 100 * data.height / data.width;

		appWidth = $(this.element).width();
		appHeight = $(this.element).height();

		path = this.resrcPath;

        CTController = new CareTransitionController(this, path, views, healthScore);
        CTController.initCareTransition(ratio);

        CTController.viewManager();
		
		this.lastRequest = -10000;

		// move and resize callbacks
		this.resizeEvents = "onfinish"; // onfinish
		// this.moveEvents   = "continuous";

		// SAGE2 Application Settings
		//
		// Control the frame rate for an animation application
		this.maxFPS = 1.0 / 60.0;
		// Not adding controls but making the default buttons available
		this.controls.finishedAddingControls();
		this.enableControls = true;

		if(this.state.goFullscreen) {
			this.sendFullscreen();

			this.state.goFullscreen = false;

			this.SAGE2Sync();
		}
	},

	makeText: function(x, y, fs, value, stroke, col) {
		var text = this.svg.text(x, y, value);
		text.attr({textAnchor: 'middle', "font-size": fs});
		if (col) {
			text.attr({fill: col});
		} else {
			text.attr({fill: "#FFFFFF"});
		}
		text.attr({fontFamily: 'Helvetica,Arial,sans-serif'});
		if (stroke === 1) {
			text.attr({paintOrder: 'stroke', stroke: '#000000'});
			text.attr({strokeWidth: '0.15px', strokeLinecap: 'butt', strokeLinejoin: 'miter'});
		} else if (stroke === 2) {
			text.attr({fontFamily: 'Helvetica,Arial,sans-serif'});
		}
		return text;
	},

	load: function(date) {
		//console.log('CareTransition> Load with state value', this.state.value);
		this.refresh(date);

	},

	draw: function(date) {
		//console.log('CareTransition> Draw with state value', this.state.value);
	},

	resize: function(date) {
		// Called when window is resized
		appWidth = $(this.element).width();
		appHeight = $(this.element).height();

        CTController.viewManager('resize');
		this.refresh(date);
	},

	move: function(date) {
		// Called when window is moved (set moveEvents to continuous)
		this.refresh(date);
	},

	quit: function() {
		// Make sure to delete stuff (timers, ...)
	},

	event: function(eventType, position, user_id, data, date) {
			
		if (eventType === "pointerPress" && (data.button === "left")) {
			// click
		} else if (eventType === "pointerMove" && this.dragging) {
			// move
		}
		else if (eventType === "pointerMove") {
			var newPositionX = position.x * (100/appWidth);
			var newPositionY = position.y * (100/appHeight);
            var newPosition = {x: newPositionX, y: newPositionY};
            CTController.eventManager(newPosition, eventType);
		}
		 else if (eventType === "pointerRelease" && (data.button === "left")) {
		 	var newPositionX = position.x * (100/appWidth);
			var newPositionY = position.y * (100/appHeight);
			var newPosition = {x: newPositionX, y: newPositionY};
            CTController.eventManager(newPosition, eventType);
			// click release
		} else if (eventType === "pointerScroll") {
			// Scroll events for zoom
		} else if (eventType === "widgetEvent") {
			// widget events
		} else if (eventType === "keyboard") {
            if(CTController.isTextBoxSelected())
                CTController.fetchKeyBoardInput(data.code);

		} else if (eventType === "specialKey") {

            if(CTController.isTextBoxSelected() && data.code==8)
                CTController.fetchKeyBoardInput(data.code);
			if (data.code === 37 && data.state === "down") {
				// left
				this.refresh(date);
			} else if (data.code === 38 && data.state === "down") {
				// up
				this.refresh(date);
			} else if (data.code === 39 && data.state === "down") {
				// right
				this.refresh(date);
			} else if (data.code === 40 && data.state === "down") {
				// down
				this.refresh(date);
			}
		}
	}
});
