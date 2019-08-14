define(['require', 'mmirf/dialogManager4Compatiblity',
		'mmirf/dialogManager', 'mmirf/resources', 'mmirf/commonUtils'
],
	/**
	 * Set to "backwards compatibility mode v3" (for pre version 4.0) for module names and method names.
	 *
	 * This function adds old names/synonyms for modules names (on <code>mmir</code> object/namespace):
	 * <ul>
	 *  <li> <u>mmir.res</u> as
	 *          <b><u>mmir.const</u></b>
	 *  </li>
	 * </ul>
	 *
	 * In addition, old method names will be added as synonyms:
	 * <ul>
	 * 	 <li> {@link mmir.Resources}
	 * 		<ul>
	 * 			<li><b><u>getGrammarFileName</u></b> for {@link mmir.Resources#getGrammarFileUrl}</li>
	 * 			<li><b><u>getSpeechConfigFileName</u></b> for {@link mmir.Resources#getSpeechConfigFileUrl}</li>
	 * 			<li><b><u>getDictionaryFileName</u></b> for {@link mmir.Resources#getGrammarFileUrl}</li>
	 * 		</ul>
	 *  </li>
	 * </ul>
	 *
	 * Methods with changed signature will be re-mapped to match their old signature
	 * <ul>
	 * 	 <li> {@link mmir.CommonUtils}
	 * 		<ul>
	 * 			<li><b><u>listDir</u></b> for {@link mmir.CommonUtils#listDir}:<br/>
	 * 				re-enable wildcards for type string in second paramter <code>filter</code> of the function
	 * 			</li>
	 * 		</ul>
	 *   </li>
	 * </ul>
	 *
	 * Lastly, removed methods will be added:
	 * <ul>
	 * 	<li> {@link mmir.CommonUtils}
	 * 		<ul>
	 * 			<li><b><u>getDirectoryContents</u></b> <em>(removed)</em> for {@link mmir.CommonUtils}</li>
	 * 			<li><b><u>getDirectoryContentsWithFilter</u></b> <em>(removed)</em> for {@link mmir.CommonUtils}</li>
	 * 		</ul>
	 *  </li>
	 * </ul>
	 *
	 * @param {mmir} mmir
	 * 			the (core) instance/namespace for MMIR
	 *
	 *
	 * @class
	 * @name mmir.compat.v4.CoreCompat
	 * @static
	 *
	 * @see mmir.compat.v4.DialogManager
	 *
	 * @requires mmir.compat.v4.DialogManager
	 *
	 * @example
	 * mmir.require(['mmirf/core4Compatibility', 'mmirf/core'], function(setCompatibility, mmir){
	 * 		setCompatibility(mmir);
	 * });
	 *
	 * //OR: if mmir-lib modules were require'd in application code, add v4 module-ID aliases first:
	 * mmir.require(['mmirf/core4ModuleIdCompatibility', 'mmirf/core4Compatibility', 'mmirf/core'], function(core4ModuleIdCompatibility, setCompatibility, mmir){
	 * 		core4ModuleIdCompatibility(mmir.require, mmir);
	 * 		setCompatibility(mmir);
	 * });
	 *
	 * @public
	 */
	function(require, dialogManager4Compatiblity,
		dialogManager, res, utils
	){

	/**
	 * Map v4 IDs (input) to v5 IDs (output)
	 *
	 * @memberOf mmir.compat.v4.ModuleIdCompat#
	 */
	core4Ids = {
		'mmirf/constants': 'mmirf/resources'
	};

	/**
	 * Set to "backwards compatibility mode" (for pre version 5.0).
	 *
	 * This function re-adds deprecated and removed functions and
	 * properties to the (core) mmir namespace.
	 *
	 * NOTE that once set to compatibility mode, it cannot be reset to
	 * non-compatibility mode.
	 *
	 *
	 * @param {mmir} mmir
	 * 			the (core) instance/namespace for MMIR
	 *
	 * @constructs mmir.compat.v3.CoreCompat
	 */
	return function setToCompatibilityMode(mmir) {

		mmir.consts = res;

		res.getGrammarFileName = res.getGrammarFileUrl;
		res.getSpeechConfigFileName = res.getSpeechConfigFileUrl;
		res.getDictionaryFileName = res.getGrammarFileUrl;

		dialogManager4Compatiblity(dialogManager);


		/**
		 * @copydoc #listDir
		 * @deprecated use {@link #listDir} instead
		 * @memberOf mmir.compat.v4.CommonUtils#
		 */
		utils.getDirectoryContents = function(pathname) {
			return this.getDirectoryContentsWithFilter(pathname);
		};

		/**
		 * @copydoc #listDir
		 * @deprecated use {@link #listDir} with RegExp for filter instead (see example for converting pseudo-wildcard string to RegExp)
		 * @memberOf mmir.compat.v4.CommonUtils#
		 *
		 * @example
		 * //convert pseudo-wildcard string to RegExp
		 * var filterStr = '^' + filter.replace('.', '\\.').replace('*', '.*').replace('\$', '\\$') + '$'; // e.g.,// '^.*\.js$'
		 * var regexpr = new RegExp(filterStr, 'gi');
		 * mmir.CommonUtils.listDir(pathname, regexpr);
		 *
		 */
		utils.getDirectoryContentsWithFilter = function(pathname, filter) {

			if(filter){
				var filterStr = '^' + filter.replace('.', '\\.').replace('*', '.*').replace('\$', '\\$') + '$'; // e.g.,// '^.*\.js$'
				filter = new RegExp(filterStr, 'gi');
			}

			return this.listDir(pathname, filter);
		};

		/**
		 * Reference to original/overwritten implementation
		 *
		 * @copydoc {@link #mmir.CommonUtils.listDir}
		 * @memberOf mmir.compat.v4.CommonUtils#
		 */
		utils._listDir = utils.listDir;

		/**
		 * This function returns an array of strings (file names) with the contents of
		 * the directory <code>pathname</code>.
		 *
		 * The <code>pathname</code> must be one of the directories (or sub-directories)
		 * of the framework's parsed folders, see {@link #directoriesToParse}.
		 *
		 * If a <code>filter</code> is use, only files which's names match
		 * the filter are included in the returned list.
		 *
		 * @function
		 * @param {String} pathname
		 *            Path of the directory which's contents should be
		 *            returned
		 * @param {String|RegExp|Function} [filter]
		 *            Filter for file-names:
		 *              if <code>String</code> the file-name may contain the wildcard <code>*</code>
		 *                (comparison is <b>not case-sensitive</b>),
		 *                e.g.: <b>*.js</b>, <b>*</b> or <b>*.ehtml</b>
		 *              if <code>RegExp</code> the file-name must match the regular expression,
		 *                e.g.: <b>/.*\.js/ig</b> or <b>/^.*\.ehtml$/ig</b>
		 *              if <code>Function</code> the file-name is included, if the function returns <code>true</code>,
		 *                where the function signature is <code>function(fileName: String) : Boolean</code>,
		 *                note that argument <code>fileName</code> will have been transformed to lower-case characters
		 *
		 * @public
		 * @returns {Array} Array of Strings which contains the contents of
		 *          the directory.
		 *          Or <code>null</code>, if <code>pathname</code> is not one of the framework's
		 *          parsed folders.
		 *
		 * @memberOf mmir.compat.v4.CommonUtils#
		 */
		utils.listDir = function(pathname, filter) {

			pathname = this.stripPathName(pathname);

			try {
				var tmp = this.directoryStructure[pathname];
				if (typeof tmp === 'undefined') {

					logger.debug('CommonUtils', 'listDir', 'path "' + pathname + '" not found.');

					return null;////////////////// EARLY EXIT ///////////////////////////////
				}
				else {

					if(filter && typeof filter !== 'string'){//evaluate filter as RegExp or Function
						return utils._listDir(pathname, filter);////////////////// EARLY EXIT ///////////////////////////////
					}

					var i, size, retValue;
					var pattern = typeof filter === 'string'? filter.split('*') : null;

					if(!pattern || pattern.length === 0){
						//no filter or invalid/all-allowing wildcard filter -> return complete result
						return tmp;////////////////// EARLY EXIT ////////////////////////////////////
					}

					//evaluate filter as wildcard-string

					//ASSERT pattern.length >= 1

					for (i = 0, size = pattern.length; i < size; ++i) {
						pattern[i] = pattern[i].toLowerCase();
					}

					var e, elen, j, index, part, doAdd, isStartWc;
					var plen = pattern.length;

					retValue = [];
					for (i = 0, size = tmp.length; i < size; ++i) {

						e = tmp[i].toLowerCase();

						if(e){

							//ASSERT e.length >= 1

							elen = e.length;

							doAdd = true;
							index = 0;
							isStartWc = false;

							//match all entries of pattern-list (or exclude e from retValue)
							for(j=0; j < plen; ++j){

								part = pattern[j];

								if(!part){
									if(j===0){
										//-> very first pattern-part is a wildcard
										isStartWc = true;
									} else if(j=== plen-1) {
										//-> very last pattern-part is a wildcard
										break;
									} else {
										//-> double wildcard, i.e. '**' ... just ignore, and continue with next part
										continue;
									}
								}

								index = e.indexOf(part, index);
								if(index === -1){
									doAdd = false;
									break;
								} else {

									//special case j==0: matching for part must be at index 0,
									// if pattern does not start with a wildcard
									if(j===0 && index!==0 && !isStartWc){
										doAdd = false;
										break;
									}

									//continue matching for next pattern-part at pos+1
									index += part.length;

									if(j === plen-1 && index < elen){

										//if last pattern-part (and it is not a wildcard),
										//then it must match the remaining string, otherwise
										//exclude e from retValue
										doAdd = false;
									}
								}

							}//END for(j in pattern)

							if(doAdd){
								retValue.push(tmp[i]);
							}

						}//END if(e)

					}//END for(i in tmp)

					return retValue;////////////////// EARLY EXIT ///////////////////////////////

				}//END else tmp

			} catch (e) {
				logger.error('CommonUtils', 'listDir', '[' + pathname + ' | ' + filter + '] ', e);
			}

			return null;
		};

	};

});
