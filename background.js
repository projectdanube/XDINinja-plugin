/************************************************************************************
  This is your background code.
  For more information please visit our wiki site:
  http://docs.crossrider.com/#!/guide/scopes_background
*************************************************************************************/
		
function error(errorText, cards, card) {

	if (cards && card) {
		
		cards.error(card, errorText);
	} else {
	
		alert(errorText);
	}
}

function notifychangedvalues(card, changedvalues) {

	try {

		appAPI.message.toActiveTab({
	
			type: 'notifychangedvalues',
			notification: {
				'card': card,
				'changedvalues': changedvalues
			}
		});

	} catch(e) { error("notifychangedvalues: " + e); }
}

function notifychangedmessages(card, changedmessages) {

	try {

		appAPI.message.toActiveTab({
	
			type: 'notifychangedmessages',
			notification: {
				'card': card,
				'changedmessages': changedmessages
			}
		});

	} catch(e) { error("notifychangedmessages: " + e); }
}

function refreshvalues(cards, card) {

	try {

		cards.refreshvalues(

			card, 
			function(card, changedvalues) { 
	
				if (Object.keys(changedvalues).length > 0 && !card['you']) notifychangedvalues(card, changedvalues);
			}, function(errorText) { 
				
				error(errorText, cards, card);
			});

	} catch(e) { error("refreshvalues: " + e, cards, card); }
}

function refreshmessages(messages, cards, card) {

	try {

		messages.refreshmessages(

			card, 
			function(messages, changedmessages) { 

				if (Object.keys(changedmessages).length > 0) notifychangedmessages(card, changedmessages);
			}, function(errorText) { 

				error(errorText, cards, card);
			});

	} catch(e) { error("refreshmessages: " + e, cards, card); }
}

appAPI.ready(function() {

	var xdipost = eval(appAPI.resources.get('xdipost.js'));
	var xdi = eval(appAPI.resources.get('xdi.js'));
	var cards = eval(appAPI.resources.get('cards.js'));
	var messages = eval(appAPI.resources.get('messages.js'));

    appAPI.browserAction.setResourceIcon('app20.png');
    
    appAPI.browserAction.setBadgeText('5', [0,0,0,128]);
    
    appAPI.browserAction.setTitle('');

    appAPI.webRequest.onBeforeNavigate.addListener(function(details, data) {
    	
    	if (details.pageUrl.indexOf('=') === 0 || details.pageUrl.indexOf('+') === 0)
			return { redirectTo: "https://cloud-cards.xdi2.org/" + encodeURIComponent(details.pageUrl) };
    }, null);

    appAPI.browserAction.setPopup({
        resourcePath:'popup.html',
        width: 600,
        height: 400
    });

    appAPI.setInterval(function() {

		var youcardlist = cards.listYOU();
		var flwcardlist = cards.listFLW();

		for (var address in youcardlist) refreshvalues(cards, youcardlist[address]);
		for (var address in flwcardlist) refreshvalues(cards, flwcardlist[address]);
		for (var address in youcardlist) refreshmessages(messages, cards, youcardlist[address]);
    }, 30000);
});
