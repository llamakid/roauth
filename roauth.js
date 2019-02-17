/*global borg, moreBorg, window, $, document*/

//things to remember
// if you change the scopes, also change in the login method. 

var i, j;

function logMyErrors(data, textStatus, errorThrown, message) {
	console.log(data);
	console.log(textStatus);
	console.log(errorThrown);
	if (message) {
		alert(message);
	}
}

function runInWebview(overlay, func) {
	var nStr = func.toString();
	borg.runAction({
		"action": "runScriptAction",
		"target": overlay,
		"data": {
			"script": nStr.slice(nStr.indexOf('{') + 1, nStr.lastIndexOf('}') - 1)
		}
	});
}

//right now this is very specific to Google OAuth. Should be eventually generalized
//to cover more generic OAuth for multiple services

var roauth = {

	//properties to be used later for storing json objects during sessions
	token: null,
	userInfo: null,

	//info from Google API Console for your registered Installed Application
	clientInfo: {
		auth_uri: "https://accounts.google.com/o/oauth2/auth",
		client_secret: "Z1A9o3wheIbZEFDjnGtX72dZ",
		token_uri: "https://accounts.google.com/o/oauth2/token",
		client_email: "",
		redirect_uris: ["urn:ietf:wg:oauth:2.0:oob", "oob"],
		client_x509_cert_url: "",
		client_id: "638653080350-o6k4m0b6o8uo8s7c2u1fl8vrvcj4odei.apps.googleusercontent.com",
		auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs"
	},
	//different scope options for Google
	scopes: {
		driveReadOnly: "https://www.googleapis.com/auth/drive.readonly",
		userInfo: "https://www.googleapis.com/auth/userinfo.email",
		calReadOnly: "https://www.googleapis.com/auth/calendar.readonly",
		contacts: "https://www.google.com/m8/feeds"
	},

	//define overlays to be used
	overlays: {
		webLogin: {
			overlayId: "roauth_webpop",
			type: "webPopup",
			backgroundColor: "#ffffff",
			backgroundAlpha: 1,
			actions: [
                {
				action: "runScriptAction",
				trigger: "loadingFinished",
				target: "#jsBridge",
				data: {
					script: "runInWebview('roauth_webpop', roauth.getCode);"
				}
			}
            ]
		},
		//creates a container overlay for each file's line item
		fileInfo: function(data) {
			var L = data.title.length;
			var title = (L < 40) ? data.title : data.title.slice(0, 37) + "...";
			var img_icon = {
				"overlayId": data.title + "_img_icon",
				"imagesDefault": ["img_icon_unknown.png"],
				"dynamicSource": "url",
				"type": "image",
				"images": ["$(" + data.iconLink + ")"],
				"width": "25px",
				"height": "25px",
				"relative": "parent",
				"x": "20px",
				"y": "25px"
			};
			var txt_name = {
				"overlayId": data.title + "_txt_name",
				"type": "text",
				"relative": "parent",
				"font": "Thonburi-Bold",
				"size": "1.5ems",
				"fontColor": "#000000",
				"x": "270px",
				"y": "25px",
				"height": "30px",
				"width": "440px",
				"textAlign": "left",
				"text": title
			};
			var file_container = {
				"overlayId": data.title + "_file_container",
				"type": "container",
				"relative": "parent",
				"height": "50px",
				"width": "500px",
				"borderWidth": "1px",
				"backgroundColor": "#ffffff",
				"backgroundAlpha": 1,
				"overlays": [img_icon, txt_name]
			};

			return file_container;
		},
		//container for the entire list of files
		fileListContainer: {
			"overlayId": "driveFilesContainer",
			"type": "container",
			"relative": "screen",
			"height": "800px",
			"width": "500px",
			"layoutType": "flow",
			"userScrolling": "vertical"
		},
		contactInfo: function(data) {
			var L = data.name.length;
			var name = (L < 38) ? data.name : data.name.slice(0, 35) + "...";
			var txt_name = {
				"overlayId": name + "_txt_name",
				"type": "text",
				"relative": "parent",
				"font": "Thonburi-Bold",
				"size": "1.5ems",
				"fontColor": "#000000",
				"x": "20px",
				"y": "25px",
				"height": "30px",
				"width": "400px",
				"textAlign": "left",
				"text": name,
				"horizontalAlign": "left"
			};
			var emailHidden = (data.email === "") ? true : false;
			var btn_email = {
				"overlayId": name + "_btn_email",
				"type": "button",
				"relative": "parent",
				"text": " email ",
				"horizontalAlign": "right",
				"y": "25px",
				"x": "480px",
				"hidden": emailHidden,
				"actions": [
                {
					"action": "#spawn",
					"data": {
						"overlayId": name + "_email",
						"type": "email",
						"to": data.email,
						"subject": "Sent from Borg!"
					}
				}
                ]
			};
			var contacts_container = {
				"overlayId": name + "_contacts_container",
				"type": "container",
				"relative": "parent",
				"height": "50px",
				"width": "500px",
				"borderWidth": "1px",
				"backgroundColor": "#ffffff",
				"backgroundAlpha": 1,
				"overlays": [btn_email, txt_name]
			};

			return contacts_container;
		}
	},

	login: function() {
		var that = this;
		var url = this.clientInfo.auth_uri;
		var params = {
			scope: that.scopes.driveReadOnly + "+" + that.scopes.userInfo + "+" + that.scopes.calReadOnly + "+" + that.scopes.contacts,
			redirect_uri: that.clientInfo.redirect_uris[0],
			response_type: "code",
			client_id: that.clientInfo.client_id
		};
		url += "?" + $.param(params);
		console.log(url);
		this.overlays.webLogin.url = url;
		moreBorg.spawn(this.overlays.webLogin);
	},
	logout: function() {
		var that = this;
		borg.setPersistentItem('borg.google.token', null);
		var oldToken = {
			token: that.token,
			userInfo: that.userInfo
		};
		borg.setPersistentItem('borg.google.oldTokens', oldToken);
		this.token = null;
		this.userInfo = null;
		moreBorg.spawn({
			overlayId: "logoutWebview",
			type: "webview",
			height: "1px",
			width: "1px",
			x: "-5px",
			url: "https://accounts.google.com/Logout"
		});
		borg.gotoPage("page_login");
	},

	//this method is run through a webview as the argument for runInWebview global function
	getCode: function() {
		var title = document.title;
		if (title.indexOf('Success') === 0) {
			var code = title.slice((title.indexOf('=') + 1));
			var getToken = function() {
				var runScriptAction = [{
					action: "runScriptAction",
					target: "#jsBridge",
					data: {
						script: "roauth.getToken('" + code + "');"
					}
				}];
				return JSON.stringify(runScriptAction);
			};
			window.location = "sm://actions?getToken()";
		}
	},
	//POST method to get the token with optional arg for func to run on success
	getToken: function(code, func) {
		var that = this;
		var url = this.clientInfo.token_uri;
		var params = {
			client_secret: that.clientInfo.client_secret,
			client_id: that.clientInfo.client_id,
			code: code,
			redirect_uri: that.clientInfo.redirect_uris[0],
			grant_type: "authorization_code"
		};
		$.ajax({
			type: "POST",
			url: url,
			data: params,
			dataType: "json",
			success: function(data) {
				roauth.token = data;
				borg.setPersistentItem('borg.google.token', data);
				//alert("getToken success");
				roauth.userInfo_get();
				setTimeout(function() {
					borg.gotoPage("page_viewStuff");
				}, 500);
			},
			error: function(data, textStatus, errorThrown) {
				logMyErrors(data, textStatus, errorThrown, "getToken Error");
			}
		});
		moreBorg.close(this.overlays.webLogin.overlayId);
		if (func) {
			func();
		}
	},
	refreshToken: function(func) {
		var runThisFunc = func;
		var that = this;
		var url = this.clientInfo.token_uri;
		var params = {
			client_secret: that.clientInfo.client_secret,
			client_id: that.clientInfo.client_id,
			refresh_token: that.token.refresh_token,
			grant_type: "refresh_token"
		};
		$.ajax({
			type: "POST",
			url: url,
			data: params,
			dataType: "json",
			success: function(data) {
				roauth.token = data;
				borg.setPersistentItem('borg.google.token', data);
				alert("refreshToken success");
			},
			error: function(data, textStatus, errorThrown) {
				logMyErrors(data, textStatus, errorThrown, "refreshToken error");
			}
		});
	},

	userInfo_get: function(func) {
		var runThisFunc = func || null;
		var that = this;
		var url = "https://www.googleapis.com/oauth2/v1/userinfo?";
		var params = {
			access_token: that.token.access_token,
			token_type: that.token.type
		};
		$.ajax({
			type: "GET",
			url: url,
			data: params,
			dataType: "json",
			success: function(data) {
				roauth.userInfo = data;
				if (runThisFunc) {
					runThisFunc(data);
				}
			},
			error: function(data, textStatus, errorThrown) {
				logMyErrors(data, textStatus, errorThrown);
				var refresh = confirm("userInfo_get error. Refresh token?");
				if (refresh) {
					roauth.refreshToken();
				}
			}
		});
	},

	driveFiles_get: function() {
		var that = this;
		var url = "https://www.googleapis.com/drive/v2/files";
		var params = {
			access_token: that.token.access_token,
			token_type: that.token.type
		};
		$.ajax({
			type: "GET",
			url: url,
			data: params,
			dataType: "json",
			success: function(data) {
				roauth.driveFiles_show(data.items);
				//alert("driveFiles_get success")
			},
			error: function(data, textStatus, errorThrown) {
				logMyErrors(data, textStatus, errorThrown);
				var refresh = confirm("driveFiles_get error. Refresh token?");
				if (refresh) {
					roauth.refreshToken();
				}
			}
		});
	},
	driveFiles_show: function(data) {
		var filesArray = [];
		var L = data.length;
		for (i = 0; i < L; i++) {
			filesArray.push(this.overlays.fileInfo(data[i]));
		}
		var fileContainer = this.overlays.fileListContainer;
		fileContainer.overlays = filesArray;
		moreBorg.spawn(fileContainer);
		moreBorg.close("spinner");
	},

	//array to save calendar events
	calendar_eventsArray: [],
	calendar_get: function(calId, date, page) {
		//default to user's calendar if no calId argument is specified
		var calendarId = calId || this.userInfo.email;
		//default to current date if no date argument is specified
		var d = date ? new Date(date) : new Date();

		var that = this;
		var url = "https://www.googleapis.com/calendar/v3/calendars/" + calendarId + "/events";
		var params = {
			access_token: that.token.access_token,
			token_type: that.token.type,
			//returns recurring events as single events instead of one "master" event in the list
			singleEvents: true,
			orderBy: "startTime",
			//returns events starting from date argument
			timeMin: d.toISOString(),
			timeMax: "2015-01-01T00:00:00-08:00"
		};
		if (page) {
			params.pageToken = page;
		}
		$.ajax({
			type: "GET",
			url: url,
			data: params,
			dataType: "json",
			success: function(data) {
				that.calendar_eventsArray = that.calendar_eventsArray.concat(data.items);
				//250 events are returned per response, along with a nextPageToken
				//so this recursive loop to call this function again with the nextPageToken
				//until all events are captured in the calendar_eventsArray object.
				if (data.nextPageToken) {
					that.calendar_get(calendarId, d, data.nextPageToken);
				}
			},
			error: function(data, textStatus, errorThrown) {
				logMyErrors(data, textStatus, errorThrown, "getCal error");
			}
		});
	},

	contacts_get: function() {
		var that = this;
		var url = "https://www.google.com/m8/feeds/contacts/default/full";
		var params = {
			access_token: that.token.access_token,
			token_type: that.token.type,
			alt: "json",
			"max-results": 250,
			group: "http://www.google.com/m8/feeds/groups/" + that.userInfo.email + "/base/6"
		};
		$.ajax({
			type: "GET",
			url: url,
			data: params,
			headers: {
				"GData-Version": "3.0"
			},
			dataType: "json",
			success: function(data) {
				console.log(data.feed.entry);
				that.contacts_simpleParse(data.feed.entry, that.contacts_show);
			},
			error: function(data, textStatus, errorThrown) {
				logMyErrors(data, textStatus, errorThrown, "contacts_get failed");
				console.log(data.responseText);
			}
		});
	},
	contacts_simpleParse: function(data, func) {
		var L = data.length;
		var contactsArray = [];
		var email;
		for (i = 0; i < L; i++) {
			var key = data[i].title.$t;
			if (data[i].gd$email) {
				var jL = data[i].gd$email.length;
				for (j = 0; j < jL; j++) {
					if (data[i].gd$email[j].primary === "true") {
						email = data[i].gd$email[j].address;
					}
				}
			}
			else {
				email = "";
			}
			var contactInfo = {
				name: key,
				email: email
			};
			contactsArray.push(contactInfo);
		}
		console.log(contactsArray);
		if (func) {
			func(contactsArray);
		}
	},
	contacts_show: function(data) {
		var contactsArray = [];
		var L = data.length;
		for (i = 0; i < L; i++) {
			contactsArray.push(roauth.overlays.contactInfo(data[i]));
		}
		var contactsContainer = roauth.overlays.fileListContainer;
		contactsContainer.overlays = contactsArray;
		moreBorg.spawn(contactsContainer);
		moreBorg.close("spinner");
	}
};

var activeToken = borg.getPersistentItem('borg.google.token');

roauth.token = activeToken || null;

function goTo_page_viewStuff(data) {
	borg.gotoPage("page_viewStuff");
}

setTimeout(function(data) {
	if (roauth.token) {
		roauth.userInfo_get(goTo_page_viewStuff);
	}
	else {
		borg.gotoPage('page_login');
	}
}, 250);


alert("roauthLoaded updates");

/*
Access Token JSON:

{
  "access_token" : "12345awesome_token",
  "token_type" : "Bearer",
  "expires_in" : 3600,
  "refresh_token" : "12345awesome_refresh_token"
}

userInfo JSON:
{
	"id": "115795819739776574494",
	"email": "rgarcia@scrollmotion.com",
	"verified_email": true,
	"hd": "scrollmotion.com"
}

Contacts API JSON:

data.feed is an object
data.feed.entry is the array with your contacts
data.entry[i] = {
	"gd$etag": "\"QnYyfzVSLit7I2A9WhBQEk0JQQ0.\"",
	"id": {
		"$t": "http://www.google.com/m8/feeds/contacts/rgarcia%40scrollmotion.com/base/2b84a7148ba22262"
	},
	"updated": {
		"$t": "2013-03-13T19:41:33.897Z"
	},
	"app$edited": {
		"xmlns$app": "http://www.w3.org/2007/app",
		"$t": "2013-03-13T19:41:33.897Z"
	},
	"category": [{
		"scheme": "http://schemas.google.com/g/2005#kind",
		"term": "http://schemas.google.com/contact/2008#contact"
	}],
	"title": {
		"$t": "Budd Holly"
	},
	"link": [{
		"rel": "http://schemas.google.com/contacts/2008/rel#photo",
		"type": "image/<asterisk>",
		"href": "https://www.google.com/m8/feeds/photos/media/rgarcia%40scrollmotion.com/2b84a7148ba22262"
	}, {
		"rel": "self",
		"type": "application/atom+xml",
		"href": "https://www.google.com/m8/feeds/contacts/rgarcia%40scrollmotion.com/full/2b84a7148ba22262"
	}, {
		"rel": "edit",
		"type": "application/atom+xml",
		"href": "https://www.google.com/m8/feeds/contacts/rgarcia%40scrollmotion.com/full/2b84a7148ba22262"
	}],
	"gd$name": {
		"gd$fullName": {
			"$t": "Budd Holly"
		},
		"gd$givenName": {
			"$t": "Budd"
		},
		"gd$familyName": {
			"$t": "Holly"
		}
	},
	"gd$email": [
	{
		"rel": "http://schemas.google.com/g/2005#other",
		"address": "buddyholly@myfirstemail.com",
		"primary": "true"
	}, {
		"rel": "http://schemas.google.com/g/2005#work",
		"address": "buddyholly@mysecondemail.com"
	}
	],
	"gd$phoneNumber": [
	{
		"rel": "http://schemas.google.com/g/2005#work",
		"uri": "tel:+1-212-555-1234",
		"$t": "212-555-1234"
	}, {
		"rel": "http://schemas.google.com/g/2005#mobile",
		"uri": "tel:+1-917-555-1234",
		"$t": "917-555-1234"
	}
	],
	"gd$structuredPostalAddress": [
	{
		"rel": "http://schemas.google.com/g/2005#work",
		"gd$formattedAddress": {
			"$t": "1234 Main Street\nNew York, NY 10001"
		},
		"gd$street": {
			"$t": "1234 Main Street"
		},
		"gd$postcode": {
			"$t": "10001"
		},
		"gd$city": {
			"$t": "NY"
		},
		"gd$region": {
			"$t": "New York"
		}
	}
	],
	"gContact$groupMembershipInfo": [
	{
		"deleted": "false",
		"href": "http://www.google.com/m8/feeds/groups/rgarcia%40scrollmotion.com/base/6"
	}
	]
}

Calendar API:

More info: https://developers.google.com/google-apps/calendar/v3/reference/events/list
Breakfast Club Calendar ID: scrollmotion.com_3638303638303034343438@resource.calendar.google.com


More info from Google:
https://developers.google.com/accounts/docs/OAuth2InstalledApp
*/