// $ANTLR 3.3 Nov 30, 2010 12:50:56 D:\\git_repo\\mmir-starter-kit__public\\www\\mmirf\\mvc\\parser\\antlr\\MmirScriptContent.g 2014-08-27 22:02:39

var MmirScriptContentParser = function(input, state) {
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

    MmirScriptContentParser.superclass.constructor.call(this, input, state);


         

    /* @todo only create adaptor if output=AST */
    this.adaptor = new org.antlr.runtime.tree.CommonTreeAdaptor();

};

org.antlr.lang.augmentObject(MmirScriptContentParser, {
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
    T__33: 33,
    DoExit: 28,
    WS: 29,
    STRING: 30,
    SSTRING: 31,
    ScriptVar: 32
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
    T__33= 33,
    DoExit= 28,
    WS= 29,
    STRING= 30,
    SSTRING= 31,
    ScriptVar= 32;

// public instance methods/vars
org.antlr.lang.extend(MmirScriptContentParser, org.antlr.runtime.Parser, {
        

    getTokenNames: function() { return MmirScriptContentParser.tokenNames; },
    getGrammarFileName: function() { return "D:\\git_repo\\mmir-starter-kit__public\\www\\mmirf\\mvc\\parser\\antlr\\MmirScriptContent.g"; }
});
org.antlr.lang.augmentObject(MmirScriptContentParser.prototype, {


    // D:\\git_repo\\mmir-starter-kit__public\\www\\mmirf\\mvc\\parser\\antlr\\MmirScriptContent.g:55:1: main returns [String theText] : t= text ( NL t= text )* ;
    // $ANTLR start "main"
    main: function() {
        var theText = null;

         var t = null;

        try {
            // D:\\git_repo\\mmir-starter-kit__public\\www\\mmirf\\mvc\\parser\\antlr\\MmirScriptContent.g:59:2: (t= text ( NL t= text )* )
            // D:\\git_repo\\mmir-starter-kit__public\\www\\mmirf\\mvc\\parser\\antlr\\MmirScriptContent.g:59:4: t= text ( NL t= text )*
            this.pushFollow(MmirScriptContentParser.FOLLOW_text_in_main63);
            t=this.text();

            this.state._fsp--;

             theText = ((t?this.input.toString(t.start,t.stop):null)?(t?this.input.toString(t.start,t.stop):null):''); 
            // D:\\git_repo\\mmir-starter-kit__public\\www\\mmirf\\mvc\\parser\\antlr\\MmirScriptContent.g:59:48: ( NL t= text )*
            loop1:
            do {
                var alt1=2;
                var LA1_0 = this.input.LA(1);

                if ( (LA1_0==NL) ) {
                    alt1=1;
                }


                switch (alt1) {
                case 1 :
                    // D:\\git_repo\\mmir-starter-kit__public\\www\\mmirf\\mvc\\parser\\antlr\\MmirScriptContent.g:59:49: NL t= text
                    this.match(this.input,NL,MmirScriptContentParser.FOLLOW_NL_in_main68); 
                    this.pushFollow(MmirScriptContentParser.FOLLOW_text_in_main72);
                    t=this.text();

                    this.state._fsp--;

                     theText = theText + '\r\n' + ((t?this.input.toString(t.start,t.stop):null)?(t?this.input.toString(t.start,t.stop):null):''); 


                    break;

                default :
                    break loop1;
                }
            } while (true);





            		if(this.isDebug) this.printInfo('CONTENT_text', theText);//debug
            	
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
        MmirScriptContentParser.text_return = function(){};
        org.antlr.lang.extend(MmirScriptContentParser.text_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
        });
        return;
    })(),

    // D:\\git_repo\\mmir-starter-kit__public\\www\\mmirf\\mvc\\parser\\antlr\\MmirScriptContent.g:62:1: text : ( CHAR | EscapeExit | DoExit )* ( other ( CHAR | EscapeExit | DoExit )* )* ;
    // $ANTLR start "text"
    text: function() {
        var retval = new MmirScriptContentParser.text_return();
        retval.start = this.input.LT(1);

        try {
            // D:\\git_repo\\mmir-starter-kit__public\\www\\mmirf\\mvc\\parser\\antlr\\MmirScriptContent.g:63:2: ( ( CHAR | EscapeExit | DoExit )* ( other ( CHAR | EscapeExit | DoExit )* )* )
            // D:\\git_repo\\mmir-starter-kit__public\\www\\mmirf\\mvc\\parser\\antlr\\MmirScriptContent.g:63:4: ( CHAR | EscapeExit | DoExit )* ( other ( CHAR | EscapeExit | DoExit )* )*
            // D:\\git_repo\\mmir-starter-kit__public\\www\\mmirf\\mvc\\parser\\antlr\\MmirScriptContent.g:63:4: ( CHAR | EscapeExit | DoExit )*
            loop2:
            do {
                var alt2=2;
                var LA2_0 = this.input.LA(1);

                if ( (LA2_0==CHAR||LA2_0==EscapeExit||LA2_0==DoExit) ) {
                    alt2=1;
                }


                switch (alt2) {
                case 1 :
                    // D:\\git_repo\\mmir-starter-kit__public\\www\\mmirf\\mvc\\parser\\antlr\\MmirScriptContent.g:
                    if ( this.input.LA(1)==CHAR||this.input.LA(1)==EscapeExit||this.input.LA(1)==DoExit ) {
                        this.input.consume();
                        this.state.errorRecovery=false;
                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        throw mse;
                    }



                    break;

                default :
                    break loop2;
                }
            } while (true);

            // D:\\git_repo\\mmir-starter-kit__public\\www\\mmirf\\mvc\\parser\\antlr\\MmirScriptContent.g:63:34: ( other ( CHAR | EscapeExit | DoExit )* )*
            loop4:
            do {
                var alt4=2;
                var LA4_0 = this.input.LA(1);

                if ( (LA4_0==COMMENT||(LA4_0>=STRING && LA4_0<=SSTRING)) ) {
                    alt4=1;
                }


                switch (alt4) {
                case 1 :
                    // D:\\git_repo\\mmir-starter-kit__public\\www\\mmirf\\mvc\\parser\\antlr\\MmirScriptContent.g:63:36: other ( CHAR | EscapeExit | DoExit )*
                    this.pushFollow(MmirScriptContentParser.FOLLOW_other_in_text103);
                    this.other();

                    this.state._fsp--;

                    // D:\\git_repo\\mmir-starter-kit__public\\www\\mmirf\\mvc\\parser\\antlr\\MmirScriptContent.g:63:42: ( CHAR | EscapeExit | DoExit )*
                    loop3:
                    do {
                        var alt3=2;
                        var LA3_0 = this.input.LA(1);

                        if ( (LA3_0==CHAR||LA3_0==EscapeExit||LA3_0==DoExit) ) {
                            alt3=1;
                        }


                        switch (alt3) {
                        case 1 :
                            // D:\\git_repo\\mmir-starter-kit__public\\www\\mmirf\\mvc\\parser\\antlr\\MmirScriptContent.g:
                            if ( this.input.LA(1)==CHAR||this.input.LA(1)==EscapeExit||this.input.LA(1)==DoExit ) {
                                this.input.consume();
                                this.state.errorRecovery=false;
                            }
                            else {
                                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                                throw mse;
                            }



                            break;

                        default :
                            break loop3;
                        }
                    } while (true);



                    break;

                default :
                    break loop4;
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


    // D:\\git_repo\\mmir-starter-kit__public\\www\\mmirf\\mvc\\parser\\antlr\\MmirScriptContent.g:66:1: content returns [String theContent] : ( NL | WS )* start= '{' ( NL | CHAR | COMMENT | DoEnterBlock | DoEnterYieldContent | DoEnterIfStatement | DoEnterElseStatement | DoEnterForStatement )* ;
    // $ANTLR start "content"
    content: function() {
        var theContent = null;

        var start = null;


        		var startPos;
        	
        try {
            // D:\\git_repo\\mmir-starter-kit__public\\www\\mmirf\\mvc\\parser\\antlr\\MmirScriptContent.g:77:2: ( ( NL | WS )* start= '{' ( NL | CHAR | COMMENT | DoEnterBlock | DoEnterYieldContent | DoEnterIfStatement | DoEnterElseStatement | DoEnterForStatement )* )
            // D:\\git_repo\\mmir-starter-kit__public\\www\\mmirf\\mvc\\parser\\antlr\\MmirScriptContent.g:77:4: ( NL | WS )* start= '{' ( NL | CHAR | COMMENT | DoEnterBlock | DoEnterYieldContent | DoEnterIfStatement | DoEnterElseStatement | DoEnterForStatement )*
            // D:\\git_repo\\mmir-starter-kit__public\\www\\mmirf\\mvc\\parser\\antlr\\MmirScriptContent.g:77:4: ( NL | WS )*
            loop5:
            do {
                var alt5=2;
                var LA5_0 = this.input.LA(1);

                if ( (LA5_0==NL||LA5_0==WS) ) {
                    alt5=1;
                }


                switch (alt5) {
                case 1 :
                    // D:\\git_repo\\mmir-starter-kit__public\\www\\mmirf\\mvc\\parser\\antlr\\MmirScriptContent.g:
                    if ( this.input.LA(1)==NL||this.input.LA(1)==WS ) {
                        this.input.consume();
                        this.state.errorRecovery=false;
                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        throw mse;
                    }



                    break;

                default :
                    break loop5;
                }
            } while (true);

            start=this.match(this.input,33,MmirScriptContentParser.FOLLOW_33_in_content153); 
            // D:\\git_repo\\mmir-starter-kit__public\\www\\mmirf\\mvc\\parser\\antlr\\MmirScriptContent.g:78:3: ( NL | CHAR | COMMENT | DoEnterBlock | DoEnterYieldContent | DoEnterIfStatement | DoEnterElseStatement | DoEnterForStatement )*
            loop6:
            do {
                var alt6=2;
                var LA6_0 = this.input.LA(1);

                if ( ((LA6_0>=CHAR && LA6_0<=NL)||(LA6_0>=COMMENT && LA6_0<=DoEnterBlock)||(LA6_0>=DoEnterYieldContent && LA6_0<=DoEnterForStatement)) ) {
                    alt6=1;
                }


                switch (alt6) {
                case 1 :
                    // D:\\git_repo\\mmir-starter-kit__public\\www\\mmirf\\mvc\\parser\\antlr\\MmirScriptContent.g:
                    if ( (this.input.LA(1)>=CHAR && this.input.LA(1)<=NL)||(this.input.LA(1)>=COMMENT && this.input.LA(1)<=DoEnterBlock)||(this.input.LA(1)>=DoEnterYieldContent && this.input.LA(1)<=DoEnterForStatement) ) {
                        this.input.consume();
                        this.state.errorRecovery=false;
                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        throw mse;
                    }



                    break;

                default :
                    break loop6;
                }
            } while (true);


            		startPos = start.getStartIndex()+1;
            		
            		if(this.isDebug) this.printDebug('CONTENT_content -> start at '+startPos);//debug
            	




            		var end = this.input.getTokens()[this.input.size()-1].getStopIndex()+1;
            		var theString = this.input.getTokenSource().input.data;
            		theContent = theString.substring(startPos, end);
            		
            		if(this.isDebug) this.printDebug('CONTENT_content -> content= "'+theContent+'"');//debug
            	
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
        return theContent;
    },


    // D:\\git_repo\\mmir-starter-kit__public\\www\\mmirf\\mvc\\parser\\antlr\\MmirScriptContent.g:95:1: other : ( COMMENT | STRING | SSTRING );
    // $ANTLR start "other"
    other: function() {
        var COMMENT1 = null;
        var STRING2 = null;
        var SSTRING3 = null;

        try {
            // D:\\git_repo\\mmir-starter-kit__public\\www\\mmirf\\mvc\\parser\\antlr\\MmirScriptContent.g:95:7: ( COMMENT | STRING | SSTRING )
            var alt7=3;
            switch ( this.input.LA(1) ) {
            case COMMENT:
                alt7=1;
                break;
            case STRING:
                alt7=2;
                break;
            case SSTRING:
                alt7=3;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 7, 0, this.input);

                throw nvae;
            }

            switch (alt7) {
                case 1 :
                    // D:\\git_repo\\mmir-starter-kit__public\\www\\mmirf\\mvc\\parser\\antlr\\MmirScriptContent.g:95:9: COMMENT
                    COMMENT1=this.match(this.input,COMMENT,MmirScriptContentParser.FOLLOW_COMMENT_in_other225); 
                    if(this.isDebug) this.printInfo('CONTENT_comment',(COMMENT1?COMMENT1.getText():null));/*debug*/


                    break;
                case 2 :
                    // D:\\git_repo\\mmir-starter-kit__public\\www\\mmirf\\mvc\\parser\\antlr\\MmirScriptContent.g:96:4: STRING
                    STRING2=this.match(this.input,STRING,MmirScriptContentParser.FOLLOW_STRING_in_other233); 
                    if(this.isDebug) this.printInfo('CONTENT_String' ,(STRING2?STRING2.getText():null));/*debug*/


                    break;
                case 3 :
                    // D:\\git_repo\\mmir-starter-kit__public\\www\\mmirf\\mvc\\parser\\antlr\\MmirScriptContent.g:97:5: SSTRING
                    SSTRING3=this.match(this.input,SSTRING,MmirScriptContentParser.FOLLOW_SSTRING_in_other243); 
                    if(this.isDebug) this.printInfo('CONTENT_string' ,(SSTRING3?SSTRING3.getText():null));/*debug*/


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


    // D:\\git_repo\\mmir-starter-kit__public\\www\\mmirf\\mvc\\parser\\antlr\\MmirScriptContent.g:100:1: line_end : ( NL | EOF );
    // $ANTLR start "line_end"
    line_end: function() {
        try {
            // D:\\git_repo\\mmir-starter-kit__public\\www\\mmirf\\mvc\\parser\\antlr\\MmirScriptContent.g:100:9: ( NL | EOF )
            // D:\\git_repo\\mmir-starter-kit__public\\www\\mmirf\\mvc\\parser\\antlr\\MmirScriptContent.g:
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
org.antlr.lang.augmentObject(MmirScriptContentParser, {
    tokenNames: ["<invalid>", "<EOR>", "<DOWN>", "<UP>", "CHAR", "NL", "END", "EscapeExit", "ESC_DoEnter", "COMMENT", "DoEnterBlock", "DoEnterStatement", "DoEnterIncludeScript", "DoEnterIncludeStyle", "DoEnterLocalize", "DoEnterYieldDeclaration", "DoEnterYieldContent", "DoEnterIfStatement", "DoEnterElseStatement", "DoEnterForStatement", "DoEnterDeclareVar", "DoEnterHelper", "DoEnterRender", "END_SCRIPT", "HEX_DIGIT", "UNICODE_ESC", "OCTAL_ESC", "ESC_SEQ", "DoExit", "WS", "STRING", "SSTRING", "ScriptVar", "'{'"],
    FOLLOW_text_in_main63: new org.antlr.runtime.BitSet([0x00000022, 0x00000000]),
    FOLLOW_NL_in_main68: new org.antlr.runtime.BitSet([0xD00002B0, 0x00000000]),
    FOLLOW_text_in_main72: new org.antlr.runtime.BitSet([0x00000022, 0x00000000]),
    FOLLOW_set_in_text88: new org.antlr.runtime.BitSet([0xD0000292, 0x00000000]),
    FOLLOW_other_in_text103: new org.antlr.runtime.BitSet([0xD0000292, 0x00000000]),
    FOLLOW_set_in_text105: new org.antlr.runtime.BitSet([0xD0000292, 0x00000000]),
    FOLLOW_set_in_content144: new org.antlr.runtime.BitSet([0x20000020, 0x00000002]),
    FOLLOW_33_in_content153: new org.antlr.runtime.BitSet([0x000F0632, 0x00000000]),
    FOLLOW_set_in_content159: new org.antlr.runtime.BitSet([0x000F0632, 0x00000000]),
    FOLLOW_COMMENT_in_other225: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_STRING_in_other233: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_SSTRING_in_other243: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_set_in_line_end0: new org.antlr.runtime.BitSet([0x00000002, 0x00000000])
});

})();