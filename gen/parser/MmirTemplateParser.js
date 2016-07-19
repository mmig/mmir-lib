// $ANTLR 3.3 Nov 30, 2010 12:50:56 MmirTemplate.g 2016-07-04 21:14:33

var MmirTemplateParser = function(input, state) {
    if (!state) {
        state = new org.antlr.runtime.RecognizerSharedState();
    }

    (function(){
    }).call(this);

    MmirTemplateParser.superclass.constructor.call(this, input, state);


         

    /* @todo only create adaptor if output=AST */
    this.adaptor = new org.antlr.runtime.tree.CommonTreeAdaptor();

};

org.antlr.lang.augmentObject(MmirTemplateParser, {
    EOF: -1,
    CHAR: 4,
    NL: 5,
    END: 6,
    EscapeExit: 7,
    ESC_DoEnter: 8,
    COMMENT: 9,
    DoEnterBlock: 10,
    DoEnterStatement: 11,
    DoEnterIncludeScript: 12,
    DoEnterIncludeStyle: 13,
    DoEnterLocalize: 14,
    DoEnterYieldDeclaration: 15,
    DoEnterYieldContent: 16,
    DoEnterIfStatement: 17,
    DoEnterElseStatement: 18,
    DoEnterForStatement: 19,
    DoEnterDeclareVar: 20,
    DoEnterHelper: 21,
    DoEnterRender: 22,
    END_SCRIPT: 23
});

(function(){
// public class variables
var EOF= -1,
    CHAR= 4,
    NL= 5,
    END= 6,
    EscapeExit= 7,
    ESC_DoEnter= 8,
    COMMENT= 9,
    DoEnterBlock= 10,
    DoEnterStatement= 11,
    DoEnterIncludeScript= 12,
    DoEnterIncludeStyle= 13,
    DoEnterLocalize= 14,
    DoEnterYieldDeclaration= 15,
    DoEnterYieldContent= 16,
    DoEnterIfStatement= 17,
    DoEnterElseStatement= 18,
    DoEnterForStatement= 19,
    DoEnterDeclareVar= 20,
    DoEnterHelper= 21,
    DoEnterRender= 22,
    END_SCRIPT= 23;

// public instance methods/vars
org.antlr.lang.extend(MmirTemplateParser, org.antlr.runtime.Parser, {
        
    setTreeAdaptor: function(adaptor) {
        this.adaptor = adaptor;
    },
    getTreeAdaptor: function() {
        return this.adaptor;
    },

    getTokenNames: function() { return MmirTemplateParser.tokenNames; },
    getGrammarFileName: function() { return "MmirTemplate.g"; }
});
org.antlr.lang.augmentObject(MmirTemplateParser.prototype, {

    // inline static return class
    main_return: (function() {
        MmirTemplateParser.main_return = function(){};
        org.antlr.lang.extend(MmirTemplateParser.main_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // MmirTemplate.g:40:1: main : text ;
    // $ANTLR start "main"
    main: function() {
        var retval = new MmirTemplateParser.main_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

         var text1 = null;


        try {
            // MmirTemplate.g:41:2: ( text )
            // MmirTemplate.g:41:4: text
            root_0 = this.adaptor.nil();

            this.pushFollow(MmirTemplateParser.FOLLOW_text_in_main42);
            text1=this.text();

            this.state._fsp--;

            this.adaptor.addChild(root_0, text1.getTree());



            retval.stop = this.input.LT(-1);

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    text_return: (function() {
        MmirTemplateParser.text_return = function(){};
        org.antlr.lang.extend(MmirTemplateParser.text_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // MmirTemplate.g:44:1: text : ( line )+ ;
    // $ANTLR start "text"
    text: function() {
        var retval = new MmirTemplateParser.text_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

         var line2 = null;


        try {
            // MmirTemplate.g:45:2: ( ( line )+ )
            // MmirTemplate.g:45:4: ( line )+
            root_0 = this.adaptor.nil();

            // MmirTemplate.g:45:4: ( line )+
            var cnt1=0;
            loop1:
            do {
                var alt1=2;
                var LA1_0 = this.input.LA(1);

                if ( ((LA1_0>=CHAR && LA1_0<=DoEnterForStatement)) ) {
                    alt1=1;
                }


                switch (alt1) {
                case 1 :
                    // MmirTemplate.g:45:4: line
                    this.pushFollow(MmirTemplateParser.FOLLOW_line_in_text54);
                    line2=this.line();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, line2.getTree());


                    break;

                default :
                    if ( cnt1 >= 1 ) {
                        break loop1;
                    }
                        var eee = new org.antlr.runtime.EarlyExitException(1, this.input);
                        throw eee;
                }
                cnt1++;
            } while (true);




            retval.stop = this.input.LT(-1);

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    line_return: (function() {
        MmirTemplateParser.line_return = function(){};
        org.antlr.lang.extend(MmirTemplateParser.line_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // MmirTemplate.g:48:1: line : ( other | CHAR )* ( NL | END ) ;
    // $ANTLR start "line"
    line: function() {
        var retval = new MmirTemplateParser.line_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var CHAR4 = null;
        var set5 = null;
         var other3 = null;

        var CHAR4_tree=null;
        var set5_tree=null;

        try {
            // MmirTemplate.g:48:7: ( ( other | CHAR )* ( NL | END ) )
            // MmirTemplate.g:48:9: ( other | CHAR )* ( NL | END )
            root_0 = this.adaptor.nil();

            // MmirTemplate.g:48:9: ( other | CHAR )*
            loop2:
            do {
                var alt2=3;
                var LA2_0 = this.input.LA(1);

                if ( ((LA2_0>=EscapeExit && LA2_0<=DoEnterForStatement)) ) {
                    alt2=1;
                }
                else if ( (LA2_0==CHAR) ) {
                    alt2=2;
                }


                switch (alt2) {
                case 1 :
                    // MmirTemplate.g:49:5: other
                    this.pushFollow(MmirTemplateParser.FOLLOW_other_in_line73);
                    other3=this.other();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, other3.getTree());


                    break;
                case 2 :
                    // MmirTemplate.g:52:5: CHAR
                    CHAR4=this.match(this.input,CHAR,MmirTemplateParser.FOLLOW_CHAR_in_line86); 
                    CHAR4_tree = this.adaptor.create(CHAR4);
                    this.adaptor.addChild(root_0, CHAR4_tree);



                    break;

                default :
                    break loop2;
                }
            } while (true);

            set5=this.input.LT(1);
            if ( (this.input.LA(1)>=NL && this.input.LA(1)<=END) ) {
                this.input.consume();
                this.adaptor.addChild(root_0, this.adaptor.create(set5));
                this.state.errorRecovery=false;
            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                throw mse;
            }




            retval.stop = this.input.LT(-1);

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    other_return: (function() {
        MmirTemplateParser.other_return = function(){};
        org.antlr.lang.extend(MmirTemplateParser.other_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // MmirTemplate.g:57:1: other : ( EscapeExit | ESC_DoEnter | COMMENT | DoEnterBlock | DoEnterStatement | DoEnterIncludeScript | DoEnterIncludeStyle | DoEnterLocalize | DoEnterYieldDeclaration | DoEnterYieldContent | DoEnterIfStatement | DoEnterElseStatement | DoEnterForStatement );
    // $ANTLR start "other"
    other: function() {
        var retval = new MmirTemplateParser.other_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set6 = null;

        var set6_tree=null;

        try {
            // MmirTemplate.g:57:7: ( EscapeExit | ESC_DoEnter | COMMENT | DoEnterBlock | DoEnterStatement | DoEnterIncludeScript | DoEnterIncludeStyle | DoEnterLocalize | DoEnterYieldDeclaration | DoEnterYieldContent | DoEnterIfStatement | DoEnterElseStatement | DoEnterForStatement )
            // MmirTemplate.g:
            root_0 = this.adaptor.nil();

            set6=this.input.LT(1);
            if ( (this.input.LA(1)>=EscapeExit && this.input.LA(1)<=DoEnterForStatement) ) {
                this.input.consume();
                this.adaptor.addChild(root_0, this.adaptor.create(set6));
                this.state.errorRecovery=false;
            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                throw mse;
            }




            retval.stop = this.input.LT(-1);

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    }

    // Delegated rules




}, true); // important to pass true to overwrite default implementations

 

// public class variables
org.antlr.lang.augmentObject(MmirTemplateParser, {
    tokenNames: ["<invalid>", "<EOR>", "<DOWN>", "<UP>", "CHAR", "NL", "END", "EscapeExit", "ESC_DoEnter", "COMMENT", "DoEnterBlock", "DoEnterStatement", "DoEnterIncludeScript", "DoEnterIncludeStyle", "DoEnterLocalize", "DoEnterYieldDeclaration", "DoEnterYieldContent", "DoEnterIfStatement", "DoEnterElseStatement", "DoEnterForStatement", "DoEnterDeclareVar", "DoEnterHelper", "DoEnterRender", "END_SCRIPT"],
    FOLLOW_text_in_main42: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_line_in_text54: new org.antlr.runtime.BitSet([0x000FFFF2, 0x00000000]),
    FOLLOW_other_in_line73: new org.antlr.runtime.BitSet([0x000FFFF0, 0x00000000]),
    FOLLOW_CHAR_in_line86: new org.antlr.runtime.BitSet([0x000FFFF0, 0x00000000]),
    FOLLOW_set_in_line98: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_set_in_other0: new org.antlr.runtime.BitSet([0x00000002, 0x00000000])
});

})();