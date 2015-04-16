window.IE = (function () {
	var DEBUG = false,
		dfd = $.Deferred(),
		IEOBJ = {};


	IEOBJ.ieBrowserVersion = (function() {
		var retval = 0,
			dfd1 = $.Deferred();

		try {
			 // Non supportato da IE 11
			retval = /*@cc_on (function() { return jscriptEngineVer(@_jscript_version); }()) || 0 ;@*/ 0;		
			if (console && DEBUG) {
				console.log("@_jscript_version: " + retval);
			}
		} catch (e) {
			retval = 0;
			if (console && DEBUG) {
				console.log("Error @_jscript_version: " + e.message);
			}
		}

		if (!retval && !!window.ScriptEngineMajorVersion) {
			// supportato anche da IE 11
			retval = ScriptEngineMajorVersion() + '.' + ScriptEngineMinorVersion();
			retval = jscriptEngineVer(retval);
			if (console && DEBUG) {
				console.log("ScriptEngine Major+.+Minor Version: " + retval);	
			}
		}
		
		dfd1.resolve(retval);
		
		/**** Questi controlli vengono falsati dal documentMode
		if (!retval) {
			if (Object.hasOwnProperty.call(window, "ActiveXObject") && !window.ActiveXObject) {
				retval = 11;
			} else {
				retval = 10;	
			}
			if (!window.atob) 				retval = 9;
			if (!document.addEventListener) retval = 8;
			if (!document.querySelector) 	retval = 7;
			if (!window.XMLHttpRequest) 	retval = 6;
			if (!document.compatMode) 		retval = 5;	
		} 
		******/
		
		return dfd1.promise();
	}());
	
	IEOBJ.ieDocumentMode = (function() {
		var dfd3 = $.Deferred();
		dfd3.resolve(document.documentMode);
		return dfd3.promise();
	}());

	IEOBJ.ieBrowserMode = (function() {
		var retval,
			dfd2 = $.Deferred();
		// ----------------------------------------------------------
		// A short snippet for detecting versions of IE in JavaScript
		// without resorting to user-agent sniffing
		// https://gist.github.com/padolsey/527683
		// ----------------------------------------------------------
		// If you're not in IE (or IE version is less than 5) then:
		//		     ie === undefined
		// If you're in IE (>=5) then you can determine which version:
		//		     ie === 7; // IE7
		// Thus, to detect IE:
		//		     if (ie) {}
		// And to detect the version:
		//		     ie === 6 // IE6
		//		     ie > 7 // IE8, IE9 ...
		//		     ie < 9 // Anything less than IE9
		// ----------------------------------------------------------
			 
		// UPDATE: Now using Live NodeList idea from @jdalton
		 
	    var undef,
	        v = 3,
	        div = document.createElement('div'),
	        all = div.getElementsByTagName('i');

		// the while loop is used without an associated block: {}
		// so, only the condition within the () is executed.

		// semicolons arent allowed within the condition,
		//   so a comma is used to stand in for one
		// basically allowing the two separate statements 
		//   to be evaluated sequentially.
			
	    while (
	        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
	        all[0]
	    );
		
		// each time it's evaluated, v gets incremented and
		//   tossed into the DOM as a conditional comment
		// the i element is then a child of the div.

		// the return value of the getEBTN call is used as 
		//   the final condition expression
		// if there is an i element (the IE conditional
		//   succeeded), then getEBTN's return is truthy
		// and the loop continues until there is no 
		//   more i elements.

		// In other words:  ** MAGIC**

	    retval = v > 4 ? v : undef;

	    // Per determinare il Browser Mode di IE >= 10 che non supporta piu' i conditional comments
		if (IEOBJ.ieBrowserVersion && !retval) {
			var msieLT11 = (/MSIE[\s]*([\d\.]+)/),
				msieGTE11 = (/rv:([\d\.]+)/),
				appVer = navigator.appVersion,
				
				result = [];
			try {
				if (msieLT11.test(appVer)) {
					result = msieLT11.exec(appVer);
					
				} else if (msieGTE11.test(appVer)) {
					result = msieGTE11.exec(appVer);
					
				} else {
					result[1] = "<unknown>";
				}
				
			} catch (e) {
				result[1] = "<error>";
				if (console && DEBUG) {
					console.log(e.message);
				}
			}
			
			retval = result[1];
			
		}
		
		dfd2.resolve(retval);
		
		return dfd2.promise();
	}());


	function jscriptEngineVer(engineVer) {
		var v = Number(engineVer);
	    switch (v) {
	        case 1.0: return 3;
	        case 3.0: return 4;
	        case 5.0: return 5;
	        case 5.1: return 5;
	        case 5.5: return 5.5;
	        case 5.6: return 6;
	        case 5.7: return 7;
	        case 5.8: return 8;
	        case 9:   return 9;
	        case 10:  return 10;
	        case 11:  return 11;
	        case 12:  return 12;
	    }
	}
	
	$.when(IEOBJ.ieBrowserVersion, IEOBJ.ieDocumentMode, IEOBJ.ieBrowserMode).then(function(ieBrowserVersion, ieDocumentMode, ieBrowserMode) {
		var result = {
				ieBrowserVersion: ieBrowserVersion,
				ieDocumentMode: ieDocumentMode, 
				ieBrowserMode: ieBrowserMode
		};
		dfd.resolve(result);
	});
	
	return dfd.promise();
}());