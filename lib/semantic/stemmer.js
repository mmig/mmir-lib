
//exports a function:
//  function(STRING):STRING
define(function(){

/*
 Really simple JavaScript stemmer based on the Snowball stemmer
 http://snowball.tartarus.org/algorithms/german/stemmer.html
 Some simplifications were made, e.g. ignoring R2 and the special
 provision for words ending in -isse-  
*/

var snowballSimpleStemFunc = (function(){
	/* Definitions */
	
	// var vowel = /[aeiouyäöüUY]/;
	// var cons = /[^aeiouyäöüUY]/;
	var sEnding = "[bdfghklmnrt]";
	var stEnding = "[bdfghklmnt]";
	
	var prefix = "^((.[aeiouyäöüUY][^aeiouyäöüUY])|([aeiouyäöüUY][^aeiouyäöüUY].))";
	
	
	var stem_word = function simpleStemmer(word){
	
	    word = word.toLowerCase();
	    word = word.replace(/ß/g, "ss");
	    
	    if (word.length < 4) {
	        return word;
	    }
	    
	    word = word.replace(/([aeiouyäöü])y([aeiouyäöü])/g, "$1Y$2"); // replace y between vowels with Y
	    word = word.replace(/([aeiouyäöü])u([aeiouyäöü])/g, "$1U$2"); // replace u between vowels with U
	    /* Step 1 */
	    
	    if (word.match(prefix + "(.*)" + "ern$")) {
	        word = word.slice(0, -3);
	    }
	    else 
	        if (word.match(prefix + "(.*)" + "(em$|en$|er$|es$)")) {
	            word = word.slice(0, -2);
	        }
	        else 
	            if (word.match(prefix + "(.*)" + "(e$)")) {
	                word = word.slice(0, -1);
	            }
	            else 
	                if (word.match(sEnding + "s$") && word.match(prefix + "(.*)" + "(s$)")) {
	                    word = word.slice(0, -1);
	                }
	    
	    
	    
	    /* Step 2 */
	    
	    if (word.match(prefix + "(.*)" + "est$")) {
	        word = word.slice(0, -3);
	    }
	    else 
	        if (word.match(prefix + "(.*)" + "(en$|er$)")) {
	            word = word.slice(0, -2);
	        }
	        else 
	            if (word.match(prefix + "(.*)" + stEnding + "(st$)")) {
	                word = word.slice(0, -2);
	            }
	    
	    
	    
	    /* Step 3 */
	    // simplified!! Really these should be in R2 not R1
	    
	    if (word.match(prefix + "(.*)" + "keit$")) {
	        word = word.slice(0, -4);
	    }
	    if (word.match(prefix + "(.*)" + "(lich$|heit$)")) {
	        word = word.slice(0, -4);
	        if (word.match(prefix + "(.*)" + "(er$|en$)")) {
	            word = word.slice(0, -2);
	        }
	    }
	    else 
	        if (word.match(prefix + "(.*)" + "(isch$)")) {
	            if (!word.match("eisch$")) {
	                word = word.slice(0, -4);
	            }
	        }
	        else 
	            if (word.match(prefix + "(.*)" + "(ig$|ik$)")) {
	                if (!word.match("e..$")) {
	                    word = word.slice(0, -2);
	                }
	            }
	            else 
	                if (word.match(prefix + "(.*)" + "(end$|ung$)")) {
	                    word = word.slice(0, -3);
	                }
	    
	    
	    
	    /* Clean up */
	    
	    word = word.replace(/([aeiouyäöü])Y/g, "$1y"); // replace Y with y
	    word = word.replace(/([aeiouyäöü])U/g, "$1u"); // replace U with u
	    word = word.replace(/ä/g, "a");
	    word = word.replace(/ö/g, "o");
	    word = word.replace(/ü/g, "u");
	    
	
	    return word;
	    
	};
	
	return stem_word;
})();

//exported function:
return snowballSimpleStemFunc;

});
