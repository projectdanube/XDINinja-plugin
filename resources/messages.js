(function (global, module, define, XHR, xdipost) {

	'use strict';

	/*
	 * Library object
	 */

	var messages = {};

	messages = {

		refreshmessages: function(card, success, error) {

			try {

				var msg;
	
				if (card['you']) {
				
					msg = xdi.message(card['cloudnumber']);
					msg.linkContract("(" + card['cloudnumber'] + "/" + card['cloudnumber'] + ")" + xdi.constants.xri_do);
					msg.secretToken(card['secrettoken']);
				} else {
					
					throw "Can only read your own messages";
				}
	
				msg.toAddress("(" + card['cloudnumber'] + ")");
				msg.operationParameter("$get", "<$deref>", true);
				msg.operation("$get", card['cloudnumber'] + "[$messages]");

				var endpoint = card['endpoint'].replace('---', '%', 'g');

				msg.send(
	
				    endpoint,
				    function(response) {
	
						var changedmessages = {};
	
				    	try {
	
					    	var messages = response.root().context(card['cloudnumber'] + "[$messages]");
					    	if (messages === null) throw "Messages for  " + card['cloudnumber'] + " not found.";
	
					    	var contexts = messages.contexts();

					    	for (var i in contexts) {
	
					    		var messageid = contexts[i].arc().string();
					    		var message = {};
					    		
					    		var messagefrom = contexts[i].relation("$from").target().string();
					    		var messagecontent = contexts[i].context("<#content>&").literal().data();
					    		var messagetimestamp = contexts[i].context("<$t>&").literal().data();

								message['from'] = messagefrom;
								message['content'] = messagecontent;
								message['timestamp'] = messagetimestamp;

					    		if (appAPI.db.get("MESSAGE" + messageid) !== null) {
					    			
					    		} else {
	
					    			changedmessages[messageid] = message;
									appAPI.db.set("MESSAGE" + messageid, message);
					    		}
					    	}
	
							success(card, changedmessages);
	
				    	} catch(e) { error("refreshmessages:success: " + e); }
				    },
				    function(errorText) {

				        error(errorText);
				    }
				);

			} catch(e) { error("refreshmessages: " + e); }
		}
	};

	return messages;
})();
