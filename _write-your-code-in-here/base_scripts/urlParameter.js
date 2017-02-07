'use strict';

//https://github.com/delphic-digital/urlParameter

function addToQueryString(queryString, paramName, value){
	if (queryString.length > 0) {
		//there's something in the querystring, I'm going to assume it's a properly formed parameter
		return queryString + '&' + paramName + '=' + value;
	} else {
		//guess there's nothing there, no need to '&'
		return '?' + paramName + '=' + value;			
	}
} 

function removeQueryFromString(queryString, paramName){

	//find the index of paramName (note that the param name could be a substring of another param name)
	var startSlice = queryString.indexOf('?' + paramName + '='); //include the "?" and "=" to help negate the substring problem
	if (startSlice == -1){
		//it's not the first param, but it could be further along
		var startSlice = queryString.indexOf('&' + paramName + '=');
		if (startSlice == -1){
			//it's not there either, just return the string
			return queryString;
		}
	}
	
	//shift the index of the start slice along past the '?' or '&'
	startSlice++;
	


	//find index of the next &
	var endSlice = queryString.indexOf('&', startSlice);
	if (endSlice == -1) {
		//it's the last / only one!
		return queryString.substr(0, startSlice - 1); //-1 to lop of the preceeding "?" if it's the only one or "&" if it's the last one
	}

	if (endSlice < queryString.length) {
		//we're in the middle, add to end slice so it'll lop off one of the "&"'s
		endSlice++;
	}

	//if we're here - the param is one of many - return the slice before & after the param
	return queryString.substr(0, startSlice) + queryString.substr(endSlice, queryString.length);
}

function formatStringForUrl(unsafeString){
	//note: I've tried a bunch of alternate methods to replace characters, none have managed to beat the regex.
	unsafeString = unsafeString.replace(/ /g, '%20');
	unsafeString = unsafeString.replace(/&/g, '%26');
	unsafeString = unsafeString.replace(/\//g, '%2F');

	return unsafeString;
}

module.exports = {
	get(paramName, queryString, isEncoded){
		if (typeof paramName != 'string' || typeof queryString != 'string') {
			return false;
		}

		//find the index of paramName
		var startSlice = queryString.indexOf(paramName);
		if (startSlice == -1){
			//it's not in there, return false
			return false;
		}
		startSlice = startSlice + paramName.length + 1;//start slice for the actual value. Param name + "="

		//find index of the next &
		var endSlice = queryString.indexOf('&', startSlice);
		if (endSlice == -1) {
			//it's the last / only one!
			return queryString.substr(startSlice, queryString.length);
		}

		return queryString.substr(startSlice, endSlice - startSlice); //end slice is index. substr needs length
	},
	set(paramName, value, queryString, isEncoded){
		if (typeof paramName != 'string') {
			return false;
		}

		var queryString = removeQueryFromString(queryString, paramName);
		if (value == "") {
			return queryString;
		}
		if (!isEncoded) {
			//param name and value have passed, so format them 
			var paramName = formatStringForUrl(paramName);
			var value = formatStringForUrl(value);			
		}

		//and return the new string!
		var newQuery = addToQueryString(queryString, paramName, value);
		
		return newQuery;		
	}
}