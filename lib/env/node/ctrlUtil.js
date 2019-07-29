
define(function(){

function _getClass(inst){
  return inst.constructor;
}

function _createCaller(ctx, func){
  return function(){
    return func.apply(ctx, arguments);
  };
}

function _extendDefaultCtrl(ctrl){

  var ctrlInst = ctrl.impl;
  ctrlInst.dummyFuncInit = false;

  ctrlInst.ctrlUtil = null;
  ctrlInst.ctrlImpl = null;

  if(!ctrlInst.setDebug){
    ctrlInst.setDebug = function(isDebug) {
      ctrlInst.debug = isDebug;
    };
  }

  _getClass(ctrlInst).prototype.setCtrl = function(ctrlImpl) {

    if(this.debug) console.log('called '+this.name+'.setCtrl ', arguments);

    if(!this.ctrlUtil){
      this.ctrlUtil = _utils;
    }

    if(!this.dummyFuncInit){
      var self = this;
      this.dummyFunc.forEach(function(name){
        self.ctrlUtil.createDummyFunc(self, name);
      });
    }

    this.ctrlImpl = ctrlImpl;
    this.ctrlUtil.attach(this, ctrlImpl);
  };
}

function _createDummyFunc(inst, funcName){
  var cl = _getClass(inst);
  var name = inst.name? inst.name : cl.name;
  cl.prototype[funcName] = function() {
    console.log('DUMMY: called '+name+'.'+funcName+' ', arguments);
  };
}

function _attach(target, impl){
  //create facade for functions of impl on target
  var f;
  for(var n in impl){
    f = impl[n];
    if(typeof f === 'function'){
      target[n] = _createCaller(impl, f);
    }
  }
}

var _utils = {
  createDummyFunc: _createDummyFunc,
  attach: _attach,
  extendDefaultCtrl: _extendDefaultCtrl
};

return _utils;

});
