
define(['mmirf/util/isArray'],
/**
 * Utilities for handling position information in pre-/post-processing
 * functions before executing grammars/NLU functions.
 *
 * The position information is meant to trac the input-words' positions, so
 * that the returned grammar/NLU etc. results can be mapped to the input-string
 * again, e.g. so that it is possible to map
 * <pre>
 * ~ "match for token at [3, 8]" -> "sub-string [8,16] in input-string"
 * </pre>
 *
 *
 * @class
 * @public
 * @name PositionUtils
 *
 * @see GrammarConverter
 * @see GrammarConverter#addProc
 *
 * @example
 *
 * var posUtil = mmir.require('mmirf/positionUtils');
 * posUtil.createWordPosPreProc(someFunction, aGrammarConverterInstance);
 * ...
 */
function(isArray){


function createPosPreProc (preProcFunc, ctx){
	return function(thePhrase, pos){

		var str = thePhrase;
		if(typeof str === 'object'){
			if(pos){
				sourcePos = str.pos;
			}
			str = str.text;
		}

		return preProcFunc.call(ctx, str, !!pos);
	}
}

function createWordPosPreProc(wordProcFunc, ctx, splitRegExp){
	var re = splitRegExp || /\s+/g;
	return createPosPreProc(function(str, pos){
		var result, m, i = 0;
		re.lastIndex = 0;
		while((m = re.exec(str))){
			result = doProcWord(wordProcFunc, str, result, pos, i, m.index, m[0], ctx);
			i = m.index + m[0].length;
		}

		if(i > 0 && i < str.length){
			result = doProcWord(wordProcFunc, str, result, pos, i, str.length, '', ctx);
		} else if(i === 0){
			result = wordProcFunc(ctx, str, !!pos);
		}
		return result;
	}, ctx);
}

function doProcWord(wordProcFunc, str, result, pos, prev_i, index, match_str, ctx){
	var substr = str.substring(prev_i, index);
	var res = wordProcFunc.call(ctx, substr, !!pos);

	if(pos){
		var wordPos = doCalcPos(substr, res);
		if(!result){
			result = {text: '', pos: []};
		}
		result.text += res + match_str;
		if (wordPos.length > 0){
			wordPos.forEach(function(p){
				p.i += prev_i;
				result.pos.push(p);
			});
		}
	} else {
		result = (result? result : '') + res + match_str;
	}

	return result;
};

function doCalcPos(origStr, newStr){
	var l1 = origStr.length;
	var l2 = newStr.length;
	if(l1 !== l2){
		return [{i: 0, mlen: l1, len: l2}];
	}
	return [];
}



function recalcProcPos(pos){
	var order = pos._order;
	if(isArray(order)){
		var size = order.length;
		var curr_i = 0;
		var next = function(){
			var el;
			for(var i = curr_i; i < size; ++i){
				el = pos[order[i]];
				if(isArray(el) && el.length > 0){
					curr_i = i + 1;
					return el;
				}
			}
		}

		var source = next();
		if(source){
			var sources = [source], len = 1, target = next(), i;
			while(target){
				for(i=len-1; i >= 0; --i){
					recalcPos(sources[i], target);
				}
				sources.push(target);
				++len;
				target = next();
			}
		}
	}
}

function recalcPos(sourcePos, targetPos){

//		console.log('___________masking-input-pos: '+JSON.stringify(sourcePos));
//		console.log('___________stopword-input-pos: '+JSON.stringify(targetPos));

	//recalculate target positions w.r.t. reverted source positions:
	var offset = 0, mi = 0, msize = sourcePos.length;
	var spos, tpos, tposend, mlen, sposi, sposend, revertOffset;
	for(var i1=0, size1 = targetPos.length; i1 < size1; ++i1){

		tpos = targetPos[i1];

		for(; mi < msize; ++mi){
			//-> loop over source-positions to calculate offset (i.e. adjustment) for tpos...

			spos = sourcePos[mi];

			sposi = spos.i + offset;

			tposend = tpos.i + tpos.mlen;
			if(tposend <= sposi){
				//if target-entry ends before source-entry starts:
				// we already tried all source-entries that could have effected the target-entry
				//-> continue with next target-entry
				break;
			}

			mlen = spos.len - spos.mlen;//<- length difference due to modification
			offset += mlen;//<- offset for source-entry strings, after modification was applied

			sposend = sposi + spos.len;
			if(sposend < tpos.i){
				//if source-position ends before target-entry even begins:
				// offset needs to be applied to target-entry "in full"
				// -> continue with next source-entry position,
				//    in case "more offset" needs to be applied
				continue;
			}

			if(sposi <= tpos.i){
				// -> source-position started before or with target-position...

				revertOffset = false;
				if(sposi >= tpos.i  && sposend <= tposend){

					//if source-position occurs completely within target-entry:
					//adjust target-modification-length
					tpos.mlen = tpos.mlen - mlen;
					//... end revert index-adjustment (see below)
					revertOffset = true;

				} else if(sposend >= tposend){

					//if target ends before source -> revert index-adjustment (see below)
					revertOffset = true;
				}

				if(revertOffset){
					//need to "pre-adjust" index, since offset was already (in this case falsely) adjusted
					tpos.i += mlen;
				}

			} else {
				//... otherwise continue with next target-entry
				break;
			}
		}
		tpos.i -= offset;
	}

//		//FIXM DEBUG
//		console.log('__RECONST__stopword-input-pos: '+JSON.stringify(targetPos));
//		for(var li = 0, lsize = targetPos.length; li < lsize; ++li){
//			var lpos = targetPos[li];
//			console.log('    '+JSON.stringify(lpos) + ' "'+thePhrase.substring(lpos.i, lpos.i + lpos.mlen)+'"');
//		}
//		//FIXM DEBUG END
}

/**
 * @memberOf PositionUtils
 */
return {
	/**
	 * HELPER create pre-processing function that handles string|Positions argument
	 *
	 * @function
	 * @param {Function} preprocFunc the preprocessing function
	 * @param {any} ctx context for executing the preprocessing function
	 *
	 * @returns {Function} wrapper-function for <code>preprocFunc</code> that handles <code>Positions</code> input arguments
	 *
	 * @memberOf PositionUtils
	 */
	createPosPreProc: createPosPreProc,
	/**
	 * HELPER create pre-processing function that handles string|Positions argument
	 *        where the pre-processing function handles single "words":
	 *        input string is split by whitespaces, and then processed word by word;
	 *        the position information is automatically generated
	 *
	 * @function
	 * @param {Function} wordPreprocFunc the preprocessing function that handles single words
	 * @param {any} ctx context for executing the preprocessing function
	 *
	 * @returns {Function} wrapper-function for <code>wordPreprocFunc</code> that handles <code>Positions</code>
	 * 										 input arguments and tracks position-modifications for <code>wordPreprocFunc</code>
	 *
	 * @memberOf PositionUtils
	 */
	createWordPosPreProc: createWordPosPreProc,
	/**
	 * HELPER re-calculate the positions for 1-n steps of the pre-processing chain,
	 *        so that positions at step i do refer to the positions of the input-string instead of the pre-processed string from step i-1
	 *
	 * NOTE positions are changed "in-place"!
	 *
	 * @function
	 * @param {PositionsInfo} pos the positions information as processed by the {@link mmir.GrammarConverter.preproc} function
	 *
	 * @memberOf PositionUtils
	 */
	recalcProcPos: recalcProcPos,
	/**
	 * HELPER re-calculate the positions in <code>targetPos</code> according to <code>sourcePos</code>:
	 *        i.e. re-calculate the positions in <code>targetPos</code> so, as if <code>sourcePos</code> had not been applied.
	 *
	 * NOTE positions are changed "in-place" in targetPos
	 *
	 * @function
	 * @param {Array<Pos>} sourcePos the positions that should be used for re-calculation (e.g. from pre-processig step i-1)
	 * @param {Array<Pos>} targetPos the positions that should be changed/adjusted (e.g. from pre-processig step i)
	 *
	 * @memberOf PositionUtils
	 */
	recalcPos: recalcPos
}

});
