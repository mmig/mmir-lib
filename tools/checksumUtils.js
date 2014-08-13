/*
 * 	Copyright (C) 2012-2013 DFKI GmbH
 * 	Deutsches Forschungszentrum fuer Kuenstliche Intelligenz
 * 	German Research Center for Artificial Intelligence
 * 	http://www.dfki.de
 * 
 * 	Permission is hereby granted, free of charge, to any person obtaining a 
 * 	copy of this software and associated documentation files (the 
 * 	"Software"), to deal in the Software without restriction, including 
 * 	without limitation the rights to use, copy, modify, merge, publish, 
 * 	distribute, sublicense, and/or sell copies of the Software, and to 
 * 	permit persons to whom the Software is furnished to do so, subject to 
 * 	the following conditions:
 * 
 * 	The above copyright notice and this permission notice shall be included 
 * 	in all copies or substantial portions of the Software.
 * 
 * 	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
 * 	OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
 * 	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * 	IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY 
 * 	CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
 * 	TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * 	SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


/**
 * @module mmir.tools
 * 
 */

define(['md5'],
	/**
	 * A Utility class for creating / reading checksum (files).<br>
	 * 
	 * @name ChecksumUtils
	 * @class
	 * @exports ChecksumUtils as mmir.tools.ChecksumUtils
	 * @static
	 * 
	 * @depends CryptoJS (MD5, see https://code.google.com/p/crypto-js/)
	 */
	function(
		CryptoJS
){
	
	var cryptoInstance;
	var computeChecksum = function(str){
		return ''+cryptoInstance.MD5(str);//<- enforce String-value by using: ''+...
	};
	
	var digestFileExt = '.checksum.txt';
	var digestContentSeparator = '\t';
	var digestContentPostfix = '\r\n';
	
	var createDigestFileContent = function(originalText){
	
		var size = originalText.length;
		var digest = computeChecksum(originalText);
		
		return digest + digestContentSeparator + size + digestContentPostfix;
	};
	
	var parseDigestFileContent = function(rawTextContent){
		
		var data = rawTextContent.split(digestContentSeparator);
		
		return {
			size: parseInt(data[1]),
			hash: data[0]
		};
	};
	
	var verifyIsSame = function(rawTextContent, referenceHash){
		
		if(typeof referenceHash === 'string'){
			referenceHash = parseDigestFileContent(referenceHash);
		}
		
		var origSize = rawTextContent.length;
		
		if(origSize === referenceHash.size){
			return referenceHash.hash === computeChecksum(rawTextContent);
		}
	};
	
	/**
	 * @lends ChecksumUtils.prototype
	 */
	return {
		/**
		 * Must be called before using checksum-generation:
		 * sets/initializes the object/function for checksum generation.
		 * 
		 * @param {CryptoJS} [cryptoImpl] OPTIONAL
		 * 				if omitted, the (global!) variable <code>CryptoJS</code> is used by default.
		 * 				This argument should be the CryptoJS object containing the MD5 function/algorithm, i.e. CryptoJS.MD5() must be a function!
		 */
		init: function(cryptoImpl){
			if(!cryptoImpl){
				cryptoImpl = CryptoJS;
			}
			cryptoInstance = cryptoImpl;
			return this;
		},
		/**
		 * Creates the content for a checksum file, containing information about
		 * the size and hash-value for the supplied String argument.
		 * 
		 * The result can be "written as is" to a file.
		 * 
		 * @param {String} originalText
		 * 						the "raw" text for which to generate the checksum information
		 * 
		 * @returns {String} the checksum information as a String (formatted as content of a checksum file)
		 * 
		 */
		createContent: createDigestFileContent,
		/**
		 * Parses the raw text-content of a checksum file and returns an object
		 * with properties:
		 * 
		 * <code>{ size: INTEGER, hash: STRING }</code>
		 * 
		 * 
		 * @param {String} rawTextContent
		 * 					the raw conent of a checksum file
		 * 
		 * @returns {PlainObject} an object with the extracted properties from the checksum-data:
		 * 				{ size: INTEGER, hash: STRING }
		 */
		parseContent: parseDigestFileContent,
		/**
		 * Check if the length / checksum for a raw text is the same as the checksum-information.
		 * 
		 * NOTE: The actual checksum for the raw text is only generated & checked, if the size is equal.
		 * 
		 * @param {String} rawTextContent
		 * 					the (raw) text/content which should be checked
		 * @param {String|PlainObject} referenceHash
		 * 					the checksum information to check against: either the 
		 * 					raw content (String) of a checksum file, or the parsed
		 * 					contents of a checksum file, which is a PlainObject with
		 * 					properties:
		 * 					{ size: INTEGER, hash: STRING }
		 * 
		 * @returns {Boolean} <code>true</code> if 
		 */
		isSame: verifyIsSame,
		/**
		 * Returns the file extension for checksum-files.
		 * 
		 * CONST
		 * 
		 * @returns {String} the default file extension for checksum files 
		 * 						(including the separating dot, eg. ".checksum.txt") 
		 */
		getFileExt: function(){
			return digestFileExt;
		},
		/**
		 * The Char used for separating fields within checksum files.
		 * 
		 * @returns {String} the separator char (TAB)
		 */
		getConentSeparator: function(){
			return digestContentSeparator;
		}
	};
	
});//END: define