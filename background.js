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

function notify(card, changedvalues) {

	try {

		appAPI.message.toActiveTab({
	
			type: 'notify',
			notification: {
				'card': card,
				'changedvalues': changedvalues
			}
		});

	} catch(e) { error("notify: " + e); }
}

function refresh(cards, card) {

	try {

		cards.refresh(

			card, 
			function(card, changedvalues) { 
	
				if (Object.keys(changedvalues).length > 0 && !card['you']) notify(card, changedvalues);
			}, function(errorText) { 
				
				error(errorText, cards, card);
			});

	} catch(e) { error("refresh: " + e, cards, cardlist, address); }
}

appAPI.ready(function() {

	var xdipost = eval(appAPI.resources.get('xdipost.js'));
	var xdi = eval(appAPI.resources.get('xdi.js'));
	var cards = eval(appAPI.resources.get('cards.js'));

    appAPI.browserAction.setResourceIcon('app20.png');
    
    appAPI.browserAction.setBadgeText('12', [0,0,0,125]);
    
    appAPI.browserAction.setTitle('');

    appAPI.webRequest.onBeforeNavigate.addListener(function(details, data) {
    	
    	if (details.pageUrl.indexOf('=') === 0 || details.pageUrl.indexOf('+') === 0)
			return { redirectTo: "http://cloudcards.projectdanube.org/" + encodeURIComponent(details.pageUrl) };
    }, null);

    appAPI.browserAction.setPopup({
        resourcePath:'popup.html',
        width: 600,
        height: 400
    });

    appAPI.setInterval(function() {

		var youcardlist = cards.listYOU();
		var flwcardlist = cards.listFLW();

		for (var address in youcardlist) refresh(cards, youcardlist[address]);
		for (var address in flwcardlist) refresh(cards, flwcardlist[address]);
    }, 20000);
});
