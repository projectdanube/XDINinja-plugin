(function () {
	return function(endpoint, requestbody, success, error) {
	    appAPI.request.post({
	        url: endpoint,
	        postData: requestbody,
	        onSuccess: function(responsebody) {
				success(responsebody);
	        },
	        onFailure: function(responseerror) {
	        	error(responseerror);
	        },
	        additionalRequestHeaders: {
	            Accept: 'text/xdi'
	        },
	        contentType: 'text/xdi'
	    });	
	}
})();
