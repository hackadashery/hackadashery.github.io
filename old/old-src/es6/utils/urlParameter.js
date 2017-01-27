'use strict';

/* A URL parameter reader
 *
 */

module.exports = {
	getParameter: function(paramName){
		/* Takes the name of a parameter
		 * returns whatever string may be attached to it.
		 */	

		var query = window.location.search.substring(1);
		
		//find the index of paranName
		var paramIndex = query.indexOf(paramName);
		if (paramIndex == -1){
			return '';
		}
		var startSlice = paramIndex + paramName.length + 1; //+1 for the "="
		
		//find index of the next &
		var endSlice = query.indexOf('&', startSlice);
		if (endSlice == -1) {
			endSlice = query.length;
		}

		var returnString = query.slice(startSlice, endSlice);
		return returnString;
	},
	setParameter(paramName, value){
		/* Sets paramName in the URL param string
		 * Note - if said param already exists, it will be overwritten
		 */

	}
}