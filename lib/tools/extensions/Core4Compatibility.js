define(['require', 'mmirf/dialogManager4Compatibility',
		'mmirf/dialogManager',
		'mmirf/grammarConverter', 'mmirf/baseGen', 'mmirf/positionUtils', 'mmirf/semanticInterpreter',
		'mmirf/resources', 'mmirf/commonUtils',
		'mmirf/util/forEach', 'mmirf/util/isArray'
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
	 * @namespace mmir.compat.v4
	 * @static
	 * @hideconstructor
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
	function(require, dialogManager4Compatibility,
		dialogManager,
		gc, bg, posUtil, semantic,
		res, utils,
		forEach, isArray
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
	 * @function
	 * @memberOf mmir.compat.v4
	 */
	return function setToCompatibilityMode(mmir) {

		mmir.consts = res;

		res.getGrammarFileName = res.getGrammarFileUrl;
		res.getSpeechConfigFileName = res.getSpeechConfigFileUrl;
		res.getDictionaryFileName = res.getGrammarFileUrl;

		dialogManager4Compatibility(dialogManager);


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

		////////////////////////////////// add backwards compatibility to GrammarConverter /////////////////////////


		/////////// add backwards-compatibility for preproc() and postproc():

		/**
		 * HELPER add processing step for custom pre/post processing function
		 *
		 * @param {mmir.grammar.GrammarConverter} obj the GrammarConverter instance
		 * @param {Function} func the custom processing function
		 * @param {"pre" | "post"} phase the processing phase
		 * @param {"escape" | "stopwords"} type the name/ID of processing step that should be modified
		 */
		function setCustomProc(obj, func, phase, type){
			var rmMode = false;
			var procFunc = posUtil.createPosPreProc(func, obj);
			var procStep = obj.procList[obj.getProcIndex(type)];
			if(procStep){
				rmMode = 'revert';
				procStep['_'+phase] = procStep[phase];
				procStep[phase] = procFunc;
			} else {
				rmMode = 'rm';
				procStep = {name: type};
				procStep[phase] = procFunc;
				obj.addProc();
			}
			return rmMode;
		}
		/**
		 * HELPER revert adding/modifying processing step for custom pre/post processing function
		 *
		 * @param {mmir.grammar.GrammarConverter} obj the GrammarConverter instance
		 * @param {"pre" | "post"} phase the processing phase
		 * @param {"escape" | "stopwords"} type the name/ID of processing step that should be modified
		 * @param {"revert" | "rm"} rmMode the removal mode for cleaning up the temporary custom processing function
		 */
		function removeCustomProc(obj, phase, type, rmMode){

			if(rmMode === 'revert'){

				var procStep = obj.procList[obj.getProcIndex(type)];
				if(procStep){
					procStep[phase] = procStep['_'+phase];
					procStep['_'+phase] = void(0);
				}
				else console.warn('GrammarConverterCompat4: could not find processing step for reverting ', phase, type, mode)

			} else if(rmMode === 'rm'){
				obj.removeProc(type);
			}
			else console.warn('GrammarConverterCompat4: could not revert custom processing step, unknown mode ', mode, ' -> ', phase, type)

			return rmMode;
		}

		gc.prototype._preproc = gc.prototype.preproc;
		gc.prototype.preproc = function(thePhrase, pos, maskFunc, stopwordFunc){

			var rmMask = false, rmStopword = false, procList;
			if(typeof maskFunc === 'function'){
				rmMask = setCustomProc(this, maskFunc, 'pre', 'escape');

				if(stopwordFunc){
					rmStopword = setCustomProc(this, maskFunc, 'pre', 'stopwords');
				}
			} else if(isArray(maskFunc)){
				procList = maskFunc;
			}

			var result = this._preproc(thePhrase, pos, procList);

			if(rmMask){
				removeCustomProc(this, 'escape', 'pre', rmMask);
			}
			if(rmStopword){
				removeCustomProc(this, 'stopwords', 'pre', rmStopword);
			}

			return result;
		};

		gc.prototype._postproc = gc.prototype.postproc;
		gc.prototype.postproc = function(procResult, recodeFunc){

			var rmRecode = false, procList;
			if(typeof recodeFunc === 'function'){
				rmRecode = setCustomProc(this, recodeFunc, 'post', 'escape');
			} else if(isArray(recodeFunc)){
				procList = recodeFunc;
			}

			var pos = procResult && procResult.preproc? procResult.preproc : false;
			var result = this._postproc(procResult, pos, procList);

			if(rmRecode){
				removeCustomProc(this, 'escape', 'post', rmRecode);
			}

			return result;
		};



		/////////// add backwards-compatibility for removeStopwords(), maskString(), unmaskString(), maskAsUnicode()

		//HELPER do re-add field "str" to Positions result:
		function addCompatPositionsFunc(funcName){
			var storeName = '_' + funcName;
			gc.prototype[storeName] = gc.prototype[funcName];
			gc.prototype[funcName] = function () {
				var res = this[storeName].apply(this, arguments);
				if(res && typeof res === 'object'){
					res.str = res.text;
				}
				return res;
			};
		}

		//re-add field "str" to Positions result of functions:
		forEach(['removeStopwords', 'maskString', 'unmaskString', 'maskAsUnicode'], function(funcName){
			addCompatPositionsFunc(funcName);
		});

		//do accept boolean (new API) as well as in/out Array (old API) for second argument in removeStopwords()
		gc.prototype.__removeStopwords = gc.prototype._removeStopwords;
		gc.prototype.removeStopwords = function (thePhrase, positions) {
			var res = this.__removeStopwords.call(this, thePhrase, !!positions);
			if(isArray(positions) && res && typeof res === 'object'){
				var pos = res.pos;
				for(var i=0,size=pos.length; i < size; ++i){
					positions.push(pos[i]);
				}
			}
			return res;
		};

		//add properties for changed fields

		if(!Object.defineProperty){
			Object.defineProperty = function(obj, name, config){
				if(config.get){
					if(obj.__defineGetter__){
						obj.__defineGetter__(name, obj.get)
					} else {
						console.warn('Could not add backwards compatibility getter (for mmir-lib <= 4.x) for field "'+name+'" for ', obj);
					}
				}
				if(config.set){
					if(obj.__defineSetter__){
						obj.__defineSetter__(name, obj.set)
					} else {
						console.warn('Could not add backwards compatibility setter (for mmir-lib <= 4.x) for field "'+name+'" for ', obj);
					}
				}
			};
		}

		//add getter/setter for "jscc_grammar_definition", that maps to new field name "grammar_definition"
		Object.defineProperty(gc.prototype, 'jscc_grammar_definition', {
			get: function(){ return this.grammar_definition; },
			set: function(def){ this.grammar_definition = def; }
		});

		var bgInst = new bg();
		gc.prototype.variable_prefix = bgInst.variable_prefix;
		gc.prototype.variable_regexp = bgInst.variable_regexp;
		gc.prototype.entry_token_field = bgInst.entry_token_field;
		gc.prototype.entry_index_field = bgInst.entry_index_field;
		gc.prototype.entry_type_field = bgInst.entry_type_field;

		gc.prototype.getCodeWrapPrefix = bgInst.getCodeWrapPrefix;
		gc.prototype.getCodeWrapSuffix = bgInst.getCodeWrapSuffix;



		/////////// backwards-compatibility for SemanticInterpreter ///////////////////////////////////////////

		semantic._removeStopwords = semantic.removeStopwords;
		semantic.removeStopwords = function(thePhrase, lang, processingSteps){

			if(typeof processingSteps === 'function'){
				//convert custom stopword-function to (single-entry) list of pre-processing steps
				var stopwordFunc = processingSteps;
				processingSteps = [{
					name: 'stopwords',
					pre: posUtil.createPosPreProc(stopwordFunc)
				}];
			}

			return this._removeStopwords(thePhrase, lang, processingSteps);
		}

	};

});
