
define(['mmirf/antlr3'], function(org){

// $ANTLR 3.3 Nov 30, 2010 12:50:56 MmirScript.g 2016-07-04 21:14:34

var MmirScriptParser = function(input, state) {
    if (!state) {
        state = new org.antlr.runtime.RecognizerSharedState();
    }

    (function(){


        	this.isDebug = true;

        	function extractString(str){
        		if(str){
        			if(str.length > 0){
        				return str.substring(1,str.length - 1);
        			}
        			else return '';
        		}
        		return null;
        	}
        	this.extractString = extractString;

    }).call(this);

    MmirScriptParser.superclass.constructor.call(this, input, state);


         

    /* @todo only create adaptor if output=AST */
    this.adaptor = new org.antlr.runtime.tree.CommonTreeAdaptor();

};

org.antlr.lang.augmentObject(MmirScriptParser, {
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
    END_SCRIPT: 23,
    DoExit: 24,
    DoExitStatement: 25,
    DoEnter: 26,
    STRING: 27,
    SSTRING: 28,
    WS: 29,
    ESC_SEQ: 30,
    HEX_DIGIT: 31,
    UNICODE_ESC: 32,
    OCTAL_ESC: 33
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
    END_SCRIPT= 23,
    DoExit= 24,
    DoExitStatement= 25,
    DoEnter= 26,
    STRING= 27,
    SSTRING= 28,
    WS= 29,
    ESC_SEQ= 30,
    HEX_DIGIT= 31,
    UNICODE_ESC= 32,
    OCTAL_ESC= 33;

// public instance methods/vars
org.antlr.lang.extend(MmirScriptParser, org.antlr.runtime.Parser, {
        

    getTokenNames: function() { return MmirScriptParser.tokenNames; },
    getGrammarFileName: function() { return "MmirScript.g"; }
});
org.antlr.lang.augmentObject(MmirScriptParser.prototype, {


    // MmirScript.g:75:1: main returns [String theText] : t= text ( NL t= text )* ;
    // $ANTLR start "main"
    main: function() {
        var theText = null;

         var t = null;

        try {
            // MmirScript.g:79:2: (t= text ( NL t= text )* )
            // MmirScript.g:79:4: t= text ( NL t= text )*
            this.pushFollow(MmirScriptParser.FOLLOW_text_in_main62);
            t=this.text();

            this.state._fsp--;

             theText = ((t?this.input.toString(t.start,t.stop):null)?(t?this.input.toString(t.start,t.stop):null):''); 
            // MmirScript.g:79:48: ( NL t= text )*
            loop1:
            do {
                var alt1=2;
                var LA1_0 = this.input.LA(1);

                if ( (LA1_0==NL) ) {
                    alt1=1;
                }


                switch (alt1) {
                case 1 :
                    // MmirScript.g:79:49: NL t= text
                    this.match(this.input,NL,MmirScriptParser.FOLLOW_NL_in_main67); 
                    this.pushFollow(MmirScriptParser.FOLLOW_text_in_main71);
                    t=this.text();

                    this.state._fsp--;

                     theText = theText + '\r\n' + ((t?this.input.toString(t.start,t.stop):null)?(t?this.input.toString(t.start,t.stop):null):''); 


                    break;

                default :
                    break loop1;
                }
            } while (true);





            		if(this.isDebug) this.printInfo('SCRIPT_main.text', theText);//debug
            	
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return theText;
    },

    // inline static return class
    text_return: (function() {
        MmirScriptParser.text_return = function(){};
        org.antlr.lang.extend(MmirScriptParser.text_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
        });
        return;
    })(),

    // MmirScript.g:82:1: text : ( other | DoExit | DoExitStatement | DoEnter | DoEnterStatement | CHAR )* ;
    // $ANTLR start "text"
    text: function() {
        var retval = new MmirScriptParser.text_return();
        retval.start = this.input.LT(1);

        try {
            // MmirScript.g:83:2: ( ( other | DoExit | DoExitStatement | DoEnter | DoEnterStatement | CHAR )* )
            // MmirScript.g:83:4: ( other | DoExit | DoExitStatement | DoEnter | DoEnterStatement | CHAR )*
            // MmirScript.g:83:4: ( other | DoExit | DoExitStatement | DoEnter | DoEnterStatement | CHAR )*
            loop2:
            do {
                var alt2=7;
                switch ( this.input.LA(1) ) {
                case COMMENT:
                case STRING:
                case SSTRING:
                    alt2=1;
                    break;
                case DoExit:
                    alt2=2;
                    break;
                case DoExitStatement:
                    alt2=3;
                    break;
                case DoEnter:
                    alt2=4;
                    break;
                case DoEnterStatement:
                    alt2=5;
                    break;
                case CHAR:
                    alt2=6;
                    break;

                }

                switch (alt2) {
                case 1 :
                    // MmirScript.g:83:6: other
                    this.pushFollow(MmirScriptParser.FOLLOW_other_in_text88);
                    this.other();

                    this.state._fsp--;



                    break;
                case 2 :
                    // MmirScript.g:83:14: DoExit
                    this.match(this.input,DoExit,MmirScriptParser.FOLLOW_DoExit_in_text92); 


                    break;
                case 3 :
                    // MmirScript.g:83:23: DoExitStatement
                    this.match(this.input,DoExitStatement,MmirScriptParser.FOLLOW_DoExitStatement_in_text96); 


                    break;
                case 4 :
                    // MmirScript.g:83:41: DoEnter
                    this.match(this.input,DoEnter,MmirScriptParser.FOLLOW_DoEnter_in_text100); 


                    break;
                case 5 :
                    // MmirScript.g:83:51: DoEnterStatement
                    this.match(this.input,DoEnterStatement,MmirScriptParser.FOLLOW_DoEnterStatement_in_text104); 


                    break;
                case 6 :
                    // MmirScript.g:83:70: CHAR
                    this.match(this.input,CHAR,MmirScriptParser.FOLLOW_CHAR_in_text108); 


                    break;

                default :
                    break loop2;
                }
            } while (true);




            retval.stop = this.input.LT(-1);

        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },


    // MmirScript.g:86:1: other : ( COMMENT | STRING | SSTRING );
    // $ANTLR start "other"
    other: function() {
        var COMMENT1 = null;
        var STRING2 = null;
        var SSTRING3 = null;

        try {
            // MmirScript.g:86:7: ( COMMENT | STRING | SSTRING )
            var alt3=3;
            switch ( this.input.LA(1) ) {
            case COMMENT:
                alt3=1;
                break;
            case STRING:
                alt3=2;
                break;
            case SSTRING:
                alt3=3;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 3, 0, this.input);

                throw nvae;
            }

            switch (alt3) {
                case 1 :
                    // MmirScript.g:86:9: COMMENT
                    COMMENT1=this.match(this.input,COMMENT,MmirScriptParser.FOLLOW_COMMENT_in_other121); 
                    if(this.isDebug) this.printInfo('SCRIPT_BLOCK_comment',(COMMENT1?COMMENT1.getText():null));/*debug*/


                    break;
                case 2 :
                    // MmirScript.g:87:4: STRING
                    STRING2=this.match(this.input,STRING,MmirScriptParser.FOLLOW_STRING_in_other129); 
                    if(this.isDebug) this.printInfo('SCRIPT_BLOCK_String' ,(STRING2?STRING2.getText():null));/*debug*/


                    break;
                case 3 :
                    // MmirScript.g:88:4: SSTRING
                    SSTRING3=this.match(this.input,SSTRING,MmirScriptParser.FOLLOW_SSTRING_in_other138); 
                    if(this.isDebug) this.printInfo('SCRIPT_BLOCK_string' ,(SSTRING3?SSTRING3.getText():null));/*debug*/


                    break;

            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return ;
    },


    // MmirScript.g:91:1: line_end : ( NL | EOF );
    // $ANTLR start "line_end"
    line_end: function() {
        try {
            // MmirScript.g:91:9: ( NL | EOF )
            // MmirScript.g:
            if ( this.input.LA(1)==EOF||this.input.LA(1)==NL ) {
                this.input.consume();
                this.state.errorRecovery=false;
            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                throw mse;
            }




        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return ;
    }

    // Delegated rules




}, true); // important to pass true to overwrite default implementations

 

// public class variables
org.antlr.lang.augmentObject(MmirScriptParser, {
    tokenNames: ["<invalid>", "<EOR>", "<DOWN>", "<UP>", "CHAR", "NL", "END", "EscapeExit", "ESC_DoEnter", "COMMENT", "DoEnterBlock", "DoEnterStatement", "DoEnterIncludeScript", "DoEnterIncludeStyle", "DoEnterLocalize", "DoEnterYieldDeclaration", "DoEnterYieldContent", "DoEnterIfStatement", "DoEnterElseStatement", "DoEnterForStatement", "DoEnterDeclareVar", "DoEnterHelper", "DoEnterRender", "END_SCRIPT", "DoExit", "DoExitStatement", "DoEnter", "STRING", "SSTRING", "WS", "ESC_SEQ", "HEX_DIGIT", "UNICODE_ESC", "OCTAL_ESC"],
    FOLLOW_text_in_main62: new org.antlr.runtime.BitSet([0x00000022, 0x00000000]),
    FOLLOW_NL_in_main67: new org.antlr.runtime.BitSet([0x1F000A30, 0x00000000]),
    FOLLOW_text_in_main71: new org.antlr.runtime.BitSet([0x00000022, 0x00000000]),
    FOLLOW_other_in_text88: new org.antlr.runtime.BitSet([0x1F000A12, 0x00000000]),
    FOLLOW_DoExit_in_text92: new org.antlr.runtime.BitSet([0x1F000A12, 0x00000000]),
    FOLLOW_DoExitStatement_in_text96: new org.antlr.runtime.BitSet([0x1F000A12, 0x00000000]),
    FOLLOW_DoEnter_in_text100: new org.antlr.runtime.BitSet([0x1F000A12, 0x00000000]),
    FOLLOW_DoEnterStatement_in_text104: new org.antlr.runtime.BitSet([0x1F000A12, 0x00000000]),
    FOLLOW_CHAR_in_text108: new org.antlr.runtime.BitSet([0x1F000A12, 0x00000000]),
    FOLLOW_COMMENT_in_other121: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_STRING_in_other129: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_SSTRING_in_other138: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_set_in_line_end0: new org.antlr.runtime.BitSet([0x00000002, 0x00000000])
});

})();

return MmirScriptParser;

});
