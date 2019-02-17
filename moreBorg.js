// More Borg Actions

var spineLogTest;

var moreBorg = {

	animate: function(overlay, animationId) {

		var target = (overlay.constructor === Array) ? overlay : [overlay];

		borg.runAction({
			"action": "animate",
			"targets": target,
			"data": {
				"animationId": animationId
			}
		});
	},

	close: function(overlay) {

		var target = (overlay.constructor === Array) ? overlay : [overlay];

		borg.runAction({
			"action": "close",
			"targets": target
		});
	},

	setImages: function(overlay, images, imagesDown) {
		if (imagesDown) {
			a = {
				"action": "setImagesAction",
				"target": overlay,
				"data": {
					"images": [images],
					"imagesDown": [imagesDown]
				}
			}
		}
		else if (!imagesDown) {
			a = {
				"action": "setImagesAction",
				"target": overlay,
				"data": {
					"images": [images]
				}
			}
		}
		borg.runAction(a);
	},

	playSound: function(soundFile) {
		a = {
			"action": "playSoundAction",
			"target": "#systemAudio",
			"data": {
				"soundFile": soundFile
			}
		}
		borg.runAction(a);
	},

	bringToFront: function(overlay) {

		var target = (overlay.constructor === Array) ? overlay : [overlay];

		borg.runAction({
			"action": "bringToFront",
			"targets": target
		});
	},

	replaceOverlays: function(container, overlays) {
		a = {
			"action": "replaceOverlays",
			"target": container,
			"data": {
				"overlays": overlays
			}
		}
		borg.runAction(a);
	},

	loadDefaultPackage: function(pageId) {
		if (!pageId) {
			a = {
				"action": "#loadDefaultPackage"
			}
			borg.runAction(a);
		}
		else {
			a = {
				"action": "#loadDefaultPackage",
				"data": {
					"pageId": pageId
				}
			}
			borg.runAction(a);
		}
	},

	loadPackage: function(packageId, pageId) {
		if (pageId) {
			a = {
				"action": "#loadPackage",
				"data": {
					"packageId": packageId,
					"pageId": pageId
				}
			}
			borg.runAction(a);
		}
		else {
			a = {
				"action": "#loadPackage",
				"data": {
					"packageId": packageId
				}
			}
			borg.runAction(a);
		}
	},

	spawn: function(overlay, boolForOnce) {

		var spawn = (!boolForOnce) ? "#spawn" : "#spawnOnce";

		if (overlay.constructor === String) {

			borg.runAction({
				"action": spawn,
				"data": {
					"overlayId": overlay
				}
			});
		}

		else if (overlay.constructor === Array) {

			for (i = 0; i < overlay.length; i++) {

				if (overlay[i].constructor === String) {

					borg.runAction({
						"action": spawn,
						"data": {
							"overlayId": overlay[i]
						}
					});

				}

				else {
					borg.runAction({
						"action": spawn,
						"data": overlay[i]
					});
				}
			}
		}

		else {
			borg.runAction({
				"action": spawn,
				"data": overlay
			});
		}
	},

	containerSpawn: function(overlay, container, boolForOnce) {

		var spawn = (!boolForOnce) ? "spawn" : "spawnOnce";

		if (overlay.constructor === String) {
			borg.runAction({
				"action": spawn,
				"target": container,
				"data": {
					"overlayId": overlay,
					"relative": "container"
				}
			});
		}

		else if (overlay.constructor === Array) {

			for (i = 0; i < overlay.length; i++) {

				if (overlay[i].constructor === String) {

					borg.runAction({
						"action": spawn,
						"target": container,
						"data": {
							"overlayId": overlay[i]
						}
					});

				}

				else {
					borg.runAction({
						"action": spawn,
						"target": container,
						"data": overlay[i]
					});
				}
			}
		}

		else {
			borg.runAction({
				"action": spawn,
				"target": container,
				"data": overlay
			});
		}
	},

	toggle: function(overlay, state) {
		if (state === "on") {
			a = {
				"action": "toggleButtonOn",
				"target": overlay
			}
			borg.runAction(a);
		}
		else if (state === "off") {
			a = {
				"action": "toggleButtonOff",
				"target": overlay
			}
			borg.runAction(a);
		}
		else {
			alert("no state chose")
		}
	},

	runScript: function(script, webview) {

		var target = (webview.constructor === Array) ? webview : [webview];

		borg.runAction({
			"action": "runScriptAction",
			"targets": target,
			"data": {
				"javascript": script
			}
		});
	},

	contentOffset: function(container, absPos, anim, x, y) {
		a = {
			"action": "setContentOffsetAction",
			"target": container,
			"data": {
				"absolutePosition": absPos,
				"animated": anim,
				"x": x,
				"y": y
			}
		}
		borg.runAction(a);
	},

	setEnabledAction: function(overlay, bool) {
		a = {
			"action": "setEnabledAction",
			"target": overlay,
			"data": {
				"enabled": bool
			}
		}
		borg.runAction(a);
	},

	setHidden: function(overlay, bool) {

		a = {
			"action": "setHiddenAction",
			"target": overlay,
			"data": {
				"hidden": bool
			}
		}
		borg.runAction(a);

	},

	logAction: function(eventName, eventInfo) {

		if (!eventInfo) {
			eventInfo = {
				"blank": "blank"
			}
		}
		a = {
			"action": "logAction",
			"target": "#remoteLogger",
			"data": {
				"eventName": eventName,
				"eventInfo": eventInfo
			}
		}
		borg.runAction(a);
	},

	clearCanvas: function(canvas) {
		borg.runAction({
			"action": "clearImageAction",
			"target": canvas
		});
	},

	setBrushColor: function(canvas, hexColor) {

		borg.runAction({
			"action": "setBrushColorAction",
			"target": canvas,
			"data": {
				"color": hexColor
			}
		});

	},

	setBrushWidth: function(canvas, width) {

		borg.runAction({
			"action": "setBrushWidthAction",
			"target": canvas,
			"data": {
				"width": width + "px"
			}
		});
	},


	//Spine version of console log. Spawns textbox with value you enter.
	//Pass an object, array, string, number, or etc

	//var spineLogTest;

	spineLog: function(logThis, x, y, width, height) {

		if (spineLogTest) {
			logThis = spineLogTest.toString() + ", " + logThis.toString();
		}
		else {
			spineLogTest = logThis;
		}

		if (!x) {
			x = 0;
		}
		if (!y) {
			y = 0;
		}
		if (!width) {
			width = 200;
		}
		if (!height) {
			height = 200;
		}

		var spawnSpineLogTest = {
			"action": "#spawnOnce",
			"trigger": "now",
			"data": {
				"overlayId": "consoleLogContainer",
				"type": "container",
				"x": x + "px",
				"y": y + "px",
				"width": width + "px",
				"height": height + "px",
				"backgroundColor": "#d1d1d1",
				"backgroundAlpha": 1,
				"borderWidth": "2px",
				"draggable": true,
				"verticalAlign": "top",
				"horizontalAlign": "left",
				"relative": "screen",
				"overlays": [
                        {
					"overlayId": "logThis",
					"type": "text",
					"text": logThis,
					"x": x + "px",
					"y": y + "px",
					"width": width + "px",
					"height": height + "px",
					"borderWidth": "2px",
					"size": "2ems",
					"relative": "screen",
					"horizontalAlign": "left",
					"verticalAlign": "top"
				},
                        {
					"overlayId": "closeLogBtn",
					"type": "button",
					"_borderWidth": "1px",
					"text": "close",
					"verticalAlign": "bottom",
					"horizontalAlign": "center",
					"relative": "parent",
					"x": width / 2 + "px",
					"y": height - 20 + "px",
					"actions": [
                                {
						"action": "close",
						"target": "consoleLogContainer",
						"trigger": "touchUpInside"
					}
                            ]
				}
                    ]
			}
		}
		borg.setText("logThis", logThis);
		borg.runAction(spawnSpineLogTest);
	},


	//EXPERIMENTAL STUFF

	//get the ContentSpec

	getSpec: function(ContentSpec) {

		var obj = {}

		ContentSpec = "../Library/Caches/Content/" + borg.packageId + "/" + ContentSpec;

		$.ajax({
			url: ContentSpec,
			async: false,
			dataType: 'json',
			success: function(data) {
				obj = data;
			}
		});

		moreBorg.spec = obj;

	},

	containerObject: function(properties) {
		this.overlayId = (properties.overlayId) ? properties.overlayId : "line";
		this.type = "container";
		this.relative = (properties.relative) ? properties.relative : "screen";
		this.borderWidth = (properties.borderWidth) ? properties.borderWidth : "0px";
		this.borderColor = (properties.borderColor) ? properties.borderColor : "#000000";
		this.height = (properties.height) ? properties.height + "px" : "1px";
		this.width = (properties.width) ? properties.width + "px" : "1px";
		this.backgroundColor = (properties.backgroundColor) ? properties.backgroundColor : "#000000";
		this.backgroundAlpha = (properties.backgroundAlpha) ? properties.backgroundAlpha : 0;
		this.x = (properties.x) ? properties.x : "512px";
		this.y = (properties.y) ? properties.y : "384px";
		this.verticalAlign = (properties.verticalAlign) ? properties.verticalAlign : "top";
		this.horizontalAlign = (properties.horizontalAlign) ? properties.horizontalAlign : "left";
		this.overlays = (properties.overlays) ? properties.overlays : [];
	}

}

var moreBorgDraw = {

	drawViaContainer: function(overlays) {

		var lastX, lastY;

		borg.getOverlayById(overlays.container).onTouchDown = function(info) {
			lastX = info.screenX;
			lastY = info.screenY;
		}
		borg.getOverlayById(overlays.container).onTouchMoved = function(info) {
			borg.drawLine(overlays.canvas, lastX, lastY, info.screenX, info.screenY);
			lastX = info.screenX;
			lastY = info.screenY;
		}

	},
	decToHex: function(dec) {

		dec = (dec === 10) ? "A" : (dec === 11) ? "B" : (dec === 12) ? "C" : (dec === 13) ? "D" : (dec === 14) ? "E" : (dec === 15) ? "F" : dec;
		return dec;

	},
	chooseColor: function(canvas, red, green, blue) {

		var red1 = moreBorgDraw.decToHex(Math.floor(red / 16));
		var red2 = moreBorgDraw.decToHex(red % 16);
		var green1 = moreBorgDraw.decToHex(Math.floor(green / 16));
		var green2 = moreBorgDraw.decToHex(green % 16);
		var blue1 = moreBorgDraw.decToHex(Math.floor(blue / 16));
		var blue2 = moreBorgDraw.decToHex(blue % 16);

		var numString = "#" + red1 + red2 + green1 + green2 + blue1 + blue2;

		moreBorg.setBrushColor(canvas, numString);

		//alert(numString);
		//alert("choseColor");
	},
	arc: function(overlay, x, y, radius, start, end) {
		var arcX = x;
		var arcY = y;
		var arcRadius = radius;
		var arcStart = this.degToRad(start);
		var arcEnd = this.degToRad(end);

		var ARC_SEG = 18;

		if (start > end) {
			arcEnd = this.degToRad(end + 360);
		}
		var arcSegments = Math.abs((arcStart - arcEnd) / ARC_SEG);

		var dx1 = Math.cos(arcStart) * arcRadius;
		var dy1 = Math.sin(arcStart) * arcRadius;
		var progress = arcStart;

		var dx2, dy2;
		for (var i = 0; i < ARC_SEG; i++) {

			progress += arcSegments;
			dx2 = Math.cos(progress) * arcRadius;
			dy2 = Math.sin(progress) * arcRadius;

			borg.drawLine(overlay, arcX + dx1 + "px", arcY + dy1 + "px", arcX + dx2 + "px", arcY + dy2 + "px");

			//if(i === 0) {borg.drawLine(overlay, arcX + (Math.cos(progress) * 6) + "px", arcY + (Math.sin(progress) * 6) + "px", arcX + (Math.cos(arcStart) * (arcRadius - 2)) + "px", arcY + (Math.sin(arcStart) * (arcRadius - 2)) + "px");}
			//borg.drawLine(overlay, arcX + (Math.cos(progress) * 6) + "px", arcY + (Math.sin(progress) * 6) + "px", arcX + (Math.cos(progress) * (arcRadius - 2)) + "px", arcY + (Math.sin(progress) * (arcRadius - 2)) + "px");

			dx1 = dx2;
			dy1 = dy2;
		}
	},
	degToRad: function(degree) {
		return degree * Math.PI / 180;
	}

}

//alert("moreBorg is a go");