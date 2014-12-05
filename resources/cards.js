(function (global, module, define, XHR, xdipost) {

	'use strict';

	/*
	 * Library object
	 */

	var cards = {};

	cards = {

		addYOU: function(address, cloudname, cloudnumber, endpoint, secrettoken, ote) {

			endpoint = endpoint.replace('%', '---', 'g');
			
			var card = {'you': true, 'address': address, 'cloudname': cloudname, 'cloudnumber': cloudnumber, 'endpoint': endpoint, 'secrettoken': secrettoken, 'ote': ote, 'values': {}};
			appAPI.db.set("CARD1" + address, card);
			return appAPI.db.get("CARD1" + address);
		},

		addFLW: function(address, cloudname, cloudnumber, endpoint, ote) {

			endpoint = endpoint.replace('%', '---', 'g');
			
			var card = {'you': false, 'address': address, 'cloudname': cloudname, 'cloudnumber': cloudnumber, 'endpoint': endpoint, 'ote': ote, 'values': {}};
			appAPI.db.set("CARD0" + address, card);
			return appAPI.db.get("CARD0" + address);
		},

		listYOU: function() {

			var list = appAPI.db.getList();
			var cardlist = {};

			for (var i=0; i<list.length; i++) {
				
				if (list[i].key.substring(0,5) != "CARD1") continue;
				cardlist[list[i].key.substring(5)] = list[i].value;
			}

			return cardlist;
		},

		listFLW: function() {

			var list = appAPI.db.getList();
			var cardlist = {};

			for (var i=0; i<list.length; i++) {
				
				if (list[i].key.substring(0,5) != "CARD0") continue;
				cardlist[list[i].key.substring(5)] = list[i].value;
			}

			return cardlist;
		},
		
		error: function(card, errorText) {

			card['error'] = errorText;

	    	appAPI.db.set((card['you'] ? "CARD1" : "CARD0") + card['address'], card);
		},

		refresh: function(card, success, error) {

			try {

				var message;
	
				if (card['you']) {
				
					message = xdi.message(card['cloudnumber']);
					message.linkContract("(" + card['cloudnumber'] + "/" + card['cloudnumber'] + ")" + xdi.constants.xri_do);
					message.secretToken(card['secrettoken']);
				} else {
					
					message = xdi.message(xdi.constants.xri_anon);
					message.linkContract("(" + card['cloudnumber'] + "/" + xdi.constants.xri_public + ")" + xdi.constants.xri_do);
				}
	
				message.toAddress("(" + card['cloudnumber'] + ")");
				message.operationParameter("$get", "<$deref>", true);
				message.operation("$get", card['address'] + "$card" + "$public");

				var endpoint = card['endpoint'].replace('---', '%', 'g');

				message.send(
	
				    endpoint,
				    function(response) {
	
						var newvalues = {};
						var changedvalues = {};
	
				    	try {
	
					    	var cardpublic = response.root().context(card['address'] + "$card" + "$public");
					    	if (cardpublic === null) throw "Cloud address " + card['address'] + " not found.";
	
					    	var attributes = cardpublic.attributes();
	
							if (! card['values']) card['values'] = {};
	
					    	for (var i in attributes) {
	
					    		var attribute = xdi.util.localSegment(attributes[i].xri(), cardpublic.xri().length()).string();
					    		var value = attributes[i].context(xdi.constants.xri_value).literal().data();
	
					    		if (attribute == "<#background><#image>") continue;
					    		if (attribute == "<#connect><#button>") continue;
					    		if (attribute == "<#tag>") continue;
					    		if (attribute == "<#description>") { card['description'] = value; continue; }
	
					    		if (card['values'][attribute] && card['values'][attribute] == value) {
					    			
					    		} else {
	
					    			changedvalues[attribute] = value;
					    		}
	
				    			newvalues[attribute] = value;
					    	}
	
							delete card['error'];
							card['values'] = newvalues;
					    	appAPI.db.set((card['you'] ? "CARD1" : "CARD0") + card['address'], card);
	
							success(card, changedvalues);
	
				    	} catch(e) { error("refresh:success: " + errorText); }
				    },
				    function(errorText) {
	
				        error(errorText);
				    }
				);

			} catch(e) { error("refresh: " + e); }
		},

		set: function(card, attribute, newvalue, success, error) {

			try {

			var message;

			if (! card['you']) throw "Can only modify own cards.";
			
			message = xdi.message(card['cloudnumber']);
			message.linkContract("(" + card['cloudnumber'] + "/" + card['cloudnumber'] + ")" + xdi.constants.xri_do);
			message.secretToken(card['secrettoken']);
			message.toAddress("(" + card['cloudnumber'] + ")");
			message.operation("$set", card['address'] + "$card" + "$public" + attribute + xdi.constants.xri_value + "/" + xdi.constants.xri_literal + "/" + JSON.stringify(newvalue));
			
			var endpoint = card['endpoint'].replace('---', '%', 'g');

			message.send(

			    endpoint,
			    function(response) {
		
					try {
			    	
				    	success();
	
			    	} catch(e) { error("refresh:success: " + errorText); }
			    },
			    function(errorText) {

			        error("Error while setting card: " + errorText);
			    }
			);

			} catch(e) { error("set: " + e); }
		},

		del: function(card, success, error) {

			try {

				appAPI.db.remove((card['you'] ? "CARD1" : "CARD0") + card['address']);

				success(card);

	    	} catch(e) { error("del: " + e); }
		},
		
		reset: function() {
			
			appAPI.db.removeAll();
			
			alert("All cards removed.");
		}
	};

	return cards;
})();
