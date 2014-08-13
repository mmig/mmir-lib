// $ANTLR 3.3 Nov 30, 2010 12:50:56 ../MmirScriptStatement.g 2013-08-13 18:04:03

var MmirScriptStatementParser = function(input, state) {
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

    MmirScriptStatementParser.superclass.constructor.call(this, input, state);


         

    /* @todo only create adaptor if output=AST */
    this.adaptor = new org.antlr.runtime.tree.CommonTreeAdaptor();

};

org.antlr.lang.augmentObject(MmirScriptStatementParser, {
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
    HEX_DIGIT: 24,
    UNICODE_ESC: 25,
    OCTAL_ESC: 26,
    ESC_SEQ: 27,
    DoExitStatement: 28,
    STRING: 29,
    SSTRING: 30,
    WS: 31
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
    HEX_DIGIT= 24,
    UNICODE_ESC= 25,
    OCTAL_ESC= 26,
    ESC_SEQ= 27,
    DoExitStatement= 28,
    STRING= 29,
    SSTRING= 30,
    WS= 31;

// public instance methods/vars
org.antlr.lang.extend(MmirScriptStatementParser, org.antlr.runtime.Parser, {
        

    getTokenNames: function() { return MmirScriptStatementParser.tokenNames; },
    getGrammarFileName: function() { return "../MmirScriptStatement.g"; }
});
org.antlr.lang.augmentObject(MmirScriptStatementParser.prototype, {


    // ../MmirScriptStatement.g:60:1: main returns [String theText] : t= text ( NL t= text )* ;
    // $ANTLR start "main"
    main: function() {
        var theText = null;

         var t = null;

        try {
            // ../MmirScriptStatement.g:64:2: (t= text ( NL t= text )* )
            // ../MmirScriptStatement.g:64:4: t= text ( NL t= text )*
            this.pushFollow(MmirScriptStatementParser.FOLLOW_text_in_main62);
            t=this.text();

            this.state._fsp--;

             theText = ((t?this.input.toString(t.start,t.stop):null)?(t?this.input.toString(t.start,t.stop):null):''); 
            // ../MmirScriptStatement.g:64:48: ( NL t= text )*
            loop1:
            do {
                var alt1=2;
                var LA1_0 = this.input.LA(1);

                if ( (LA1_0==NL) ) {
                    alt1=1;
                }


                switch (alt1) {
                case 1 :
                    // ../MmirScriptStatement.g:64:49: NL t= text
                    this.match(this.input,NL,MmirScriptStatementParser.FOLLOW_NL_in_main67); 
                    this.pushFollow(MmirScriptStatementParser.FOLLOW_text_in_main71);
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
        MmirScriptStatementParser.text_return = function(){};
        org.antlr.lang.extend(MmirScriptStatementParser.text_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
        });
        return;
    })(),

    // ../MmirScriptStatement.g:67:1: text : ( other | DoExitStatement | DoEnterStatement | CHAR )* ;
    // $ANTLR start "text"
    text: function() {
        var retval = new MmirScriptStatementParser.text_return();
        retval.start = this.input.LT(1);

        try {
            // ../MmirScriptStatement.g:68:2: ( ( other | DoExitStatement | DoEnterStatement | CHAR )* )
            // ../MmirScriptStatement.g:68:4: ( other | DoExitStatement | DoEnterStatement | CHAR )*
            // ../MmirScriptStatement.g:68:4: ( other | DoExitStatement | DoEnterStatement | CHAR )*
            loop2:
            do {
                var alt2=5;
                switch ( this.input.LA(1) ) {
                case COMMENT:
                case STRING:
                case SSTRING:
                    alt2=1;
                    break;
                case DoExitStatement:
                    alt2=2;
                    break;
                case DoEnterStatement:
                    alt2=3;
                    break;
                case CHAR:
                    alt2=4;
                    break;

                }

                switch (alt2) {
                case 1 :
                    // ../MmirScriptStatement.g:68:6: other
                    this.pushFollow(MmirScriptStatementParser.FOLLOW_other_in_text88);
                    this.other();

                    this.state._fsp--;



                    break;
                case 2 :
                    // ../MmirScriptStatement.g:68:14: DoExitStatement
                    this.match(this.input,DoExitStatement,MmirScriptStatementParser.FOLLOW_DoExitStatement_in_text92); 


                    break;
                case 3 :
                    // ../MmirScriptStatement.g:68:32: DoEnterStatement
                    this.match(this.input,DoEnterStatement,MmirScriptStatementParser.FOLLOW_DoEnterStatement_in_text96); 


                    break;
                case 4 :
                    // ../MmirScriptStatement.g:68:51: CHAR
                    this.match(this.input,CHAR,MmirScriptStatementParser.FOLLOW_CHAR_in_text100); 


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


    // ../MmirScriptStatement.g:71:1: other : ( COMMENT | STRING | SSTRING );
    // $ANTLR start "other"
    other: function() {
        var COMMENT1 = null;
        var STRING2 = null;
        var SSTRING3 = null;

        try {
            // ../MmirScriptStatement.g:71:7: ( COMMENT | STRING | SSTRING )
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
                    // ../MmirScriptStatement.g:71:9: COMMENT
                    COMMENT1=this.match(this.input,COMMENT,MmirScriptStatementParser.FOLLOW_COMMENT_in_other113); 
                    if(this.isDebug) this.printInfo('SCRIPT_BLOCK_comment',(COMMENT1?COMMENT1.getText():null));/*debug*/


                    break;
                case 2 :
                    // ../MmirScriptStatement.g:72:4: STRING
                    STRING2=this.match(this.input,STRING,MmirScriptStatementParser.FOLLOW_STRING_in_other121); 
                    if(this.isDebug) this.printInfo('SCRIPT_BLOCK_String' ,(STRING2?STRING2.getText():null));/*debug*/


                    break;
                case 3 :
                    // ../MmirScriptStatement.g:73:4: SSTRING
                    SSTRING3=this.match(this.input,SSTRING,MmirScriptStatementParser.FOLLOW_SSTRING_in_other130); 
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


    // ../MmirScriptStatement.g:76:1: line_end : ( NL | EOF );
    // $ANTLR start "line_end"
    line_end: function() {
        try {
            // ../MmirScriptStatement.g:76:9: ( NL | EOF )
            // ../MmirScriptStatement.g:
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
org.antlr.lang.augmentObject(MmirScriptStatementParser, {
    tokenNames: ["<invalid>", "<EOR>", "<DOWN>", "<UP>", "CHAR", "NL", "END", "EscapeExit", "ESC_DoEnter", "COMMENT", "DoEnterBlock", "DoEnterStatement", "DoEnterIncludeScript", "DoEnterIncludeStyle", "DoEnterLocalize", "DoEnterYieldDeclaration", "DoEnterYieldContent", "DoEnterIfStatement", "DoEnterElseStatement", "DoEnterForStatement", "DoEnterDeclareVar", "DoEnterHelper", "DoEnterRender", "END_SCRIPT", "HEX_DIGIT", "UNICODE_ESC", "OCTAL_ESC", "ESC_SEQ", "DoExitStatement", "STRING", "SSTRING", "WS"],
    FOLLOW_text_in_main62: new org.antlr.runtime.BitSet([0x00000022, 0x00000000]),
    FOLLOW_NL_in_main67: new org.antlr.runtime.BitSet([0x70000A30, 0x00000000]),
    FOLLOW_text_in_main71: new org.antlr.runtime.BitSet([0x00000022, 0x00000000]),
    FOLLOW_other_in_text88: new org.antlr.runtime.BitSet([0x70000A12, 0x00000000]),
    FOLLOW_DoExitStatement_in_text92: new org.antlr.runtime.BitSet([0x70000A12, 0x00000000]),
    FOLLOW_DoEnterStatement_in_text96: new org.antlr.runtime.BitSet([0x70000A12, 0x00000000]),
    FOLLOW_CHAR_in_text100: new org.antlr.runtime.BitSet([0x70000A12, 0x00000000]),
    FOLLOW_COMMENT_in_other113: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_STRING_in_other121: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_SSTRING_in_other130: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_set_in_line_end0: new org.antlr.runtime.BitSet([0x00000002, 0x00000000])
});

})();