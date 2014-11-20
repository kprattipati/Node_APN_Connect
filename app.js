/**
 * New node file
 */
var api = require('./APN_Connect');

/*createObject('advertiser', {
	advertiser: {
		name: "test advertiser 3",
		state: "active",
	}
});*/


//var data = {"id": ["1", "2"], "advertiser" : ["3", "4"]};
var data = {"id": ["1", "2"], "advertiser" : ["3", "4"], "client" : ["abc", "def"]};
console.log("json dat is ", data);
api.APNStringify(data);
/*console.log('json parse ', data);
var qs = APNStringify(data);
console.log("query string is: ", qs);
console.log("query string is: ", querystring.stringify(data));
*/
