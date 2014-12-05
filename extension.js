/************************************************************************************
  This is your Page Code. The appAPI.ready() code block will be executed on every page load.
  For more information please visit our docs site: http://docs.crossrider.com
*************************************************************************************/

eval(appAPI.resources.get('htmlencode.js'));

function notify(notification) {

	var card = notification['card'];
	var changedvalues = notification['changedvalues'];

	var body = "";
	body += "<div>";
	body += "<div style=\"font-weight:bold;font-size:14pt;color:#333;\">";
	body += card['address'];
	body += "</div>";
	for (var i in changedvalues) {

		body += "<div style=\"font-size:10pt;color:#999;\">";
		body += htmlEncode(i) + " " + htmlEncode(changedvalues[i]);
		body += "</div>";
	}
	body += "</div>";

	appAPI.notifier.show({

		'name': 'XDI Ninja!',
		'title': null,
		'body': body,
		'link': 'https://',
		'theme': 'white-black',
		'position': 'top-right',
		'icon': "data:image/png;base64,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",
		'close': true,
		'sticky': false,
		'fadeAfter': 4,
		'width': '600px',
		'closeWhenClicked': true
	});
}

appAPI.ready(function($) {

	appAPI.message.addListener(function(msg) {

		if (msg.type === 'notify') notify(msg.notification);
	});
});
