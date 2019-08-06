

//monkey patch for commonUtils.getLocalScript

//the path to the base-directory (main/starting script location), from the location that this script is at
var nodeBasePath = '../../';

var createElement = function(tagName){

	//mock HTMLElement object for use in commonUtils.getLocalScript
	return {
		tagName: tagName,
		children: [],
		createElement: function(str){
			console.log('invoked '+tagName+'.createElement('+str+') from ');//+new Error().stack.replace(/^Error\s+/, ''));
			return createElement(str);
		},
		getElementsByTagName: function(str){
			// console.warn('invoked '+tagName+'.getElementsByTagName('+str+') from '+new Error().stack.replace(/^Error\s+/, ''));
			var list = this.children.filter(function(el){
				return str.toLowerCase() === el.tagName.toLowerCase();
			});
			console.log('invoked '+tagName+'.getElementsByTagName('+str+'): ' + list.map(function(el){return el.tagName;}).join(', '));
			return list;
		},
		appendChild: function(child){

			console.log('invoked '+tagName+'.appendChild('+(child? child.tagName: child)+')'+(child && child.src? '[src="'+child.src+'"]' : '')+' -> ');//, child,' from '+new Error().stack.replace(/^Error\s+/, ''));

			if(child){

				this.children.push(child);

				if(child.tagName.toLowerCase() === 'script' && /javascript/i.test(child.type)){

					console.log('invoked '+tagName+'.appendChild: loading script...');

					//simulate async loading with setTimeout
					setTimeout(function(){

						var path = child.src
													.replace(/^file:/, nodeBasePath)//<- remove leading 'file:' and set path to base-directory (i.e. to parent directory of this script)
													.replace(/\.js$/i, '');//<- "convert" to module name by removing file-extension .js from file name
						try{

							require(path);
							console.log('invoked '+tagName+'.appendChild: loaded script '+path);
							if(child.onload){
								child.onload();
							}

						} catch(err){

							console.log('invoked '+tagName+'.appendChild: ERROR loading '+path+': ', err);
							if(child.onerror){
								child.onerror(err);
							}

						}
					}, 0);
				}//END if(is-script)

			}//END if(child)

			return child;
		}
	}
}

var head = createElement('head');
var body = createElement('body');
var document = createElement('document');
document.appendChild(head);
document.appendChild(body);

global.document = document;
