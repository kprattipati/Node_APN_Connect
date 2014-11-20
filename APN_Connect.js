/**
 * New node file
 */
var querystring = require('querystring');
var http = require('http');

var hostname = "api-console.client-testing.adnxs.net";
var username = "accuen_ct_api_user";
var password = "m4$bo74W";
var apiKey = null;
var sessionId = null;

function APNStringify(data) 
{
	var keys = Object.keys(data);
	var vals = null;
	var index = 0;
	var qs = '';
	var keysize = keys.length;
	var valsize = 0;
	var valcount = 0;
	var keycount = 0;
	
	console.log("keys are: ", keys);
	
	keys.forEach(function(key) {
		console.log("data indice is: ", key);
		vals = data[key];
		console.log('values are', vals);
		qs = qs.concat(key);
		qs = qs.concat('=');
		
		valsize = vals.length;
		valcount = 0;
		vals.forEach(function(value) {
			console.log('value is: ', value);
			qs = qs.concat(value);
			valcount++;
			if(valcount < valsize) qs = qs.concat(",");
		});
		keycount++;
		if(keycount < keysize) qs = qs.concat("&");
	});
	console.log('query string is', qs);
	return qs;
}

function performRequest(endpoint, method, data, success) {
	try{
	  console.log("inside of perform request: ", endpoint);
	  var dataString = JSON.stringify(data);
	  var headers = {};
	  
	  if (method == 'GET') {
	    endpoint += '?' + APNStringify(data);
	    if(sessionId != null)
	    {
	    	headers = {
	    			'Authorization': sessionId
	    	};
	    }
	  }
	  else {
	    if(sessionId == null)
	    {
	    	headers = {
	    			'Content-Type': 'application/json',
	    			'Content-Length': dataString.length
	    	};
	    }
	    else {
	    	headers = {
	    			'Content-Type': 'application/json',
	    			'Content-Length': dataString.length,
	    			'Authorization': sessionId
	    	};
	    }
	  }
	  var options = {
	    hostname: hostname,
	    path: endpoint,
	    method: method,
	    headers: headers
	  };

	  var req = http.request(options, function(res) {
	    res.setEncoding('utf-8');

	    var responseString = '';

	    res.on('data', function(data) {
	      responseString += data;
	    });

	    res.on('end', function() {
	      console.log(responseString);
	      var responseObject = JSON.parse(responseString);
	      console.log("about to call callback");
	      success(responseObject);
	      console.log("called callbak");
	    });
	  });

	  req.write(dataString);
	  req.end();
	}
	catch(ex)
	{
		throw new Error(ex);
	}
}

function login(callback) {
	  performRequest('/auth', 'POST', {
	    auth: {
	    	username: username,
	    	password: password,
	    }
	  }, function(data) {
	    sessionId = data.response.token;
	    console.log('Logged in:', sessionId);
	  });
	  setTimeout(callback, 5000);
}

function isAuthorized(res_data, callback)
{
	console.log("inside of isAuthorized");
	var no_auth = res_data.response.error_id;
	if(no_auth == "NOAUTH")
	{
		console.log("not authorized");
		login(callback);
		return;
	}
}

module.exports = {
createObject: function(object, data)
{
	console.log('inside of create object');
	performRequest('/'.concat(object), 'POST', data, function(res_data) {
		isAuthorized(res_data, function() {createObject(object, data);});
		if(sessionId != null && res_data.response.status == 'OK') {
			console.log(object.concat(' created: '), res_data.response.id);
			return res_data;
		}
	});
},
getObjects: function(object)
{
	console.log('inside of get objects');
	performRequest('/'.concat(object), 'GET', null, function(res_data) {
		isAuthorized(res_data, function() {getObjects(object);});
		if(sessionId != null && res_data.response.status == 'OK') {
			console.log('res data is: ', res_data);
			return res_data;
		}
	});
},

getObject: function(object, data)
{
	console.log('inside of get object');
	performRequest('/'.concat(object), 'GET', data, function(res_data) {
		isAuthorized(res_data, function() {getObject(object, data);});
		if(sessionId != null && res_data.response.status == 'OK') {
			console.log('res data is: ', res_data);
			return res_data;
		}
	});
	
},

updateObject: function(object, data)
{
	
},

deleteObject: function()
{
	
}
};