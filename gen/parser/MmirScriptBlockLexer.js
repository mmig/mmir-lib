// $ANTLR 3.3 Nov 30, 2010 12:50:56 ../MmirScriptBlock.g 2013-08-13 18:04:02

var MmirScriptBlockLexer = function(input, state) {
// alternate constructor @todo
// public MmirScriptBlockLexer(CharStream input)
// public MmirScriptBlockLexer(CharStream input, RecognizerSharedState state) {
    if (!state) {
        state = new org.antlr.runtime.RecognizerSharedState();
    }

    (function(){


        	this.isDebug = true;
        	
        	this.nestingBlock = 0;
        	
        	this.isParseAsStatement = function(){
        		return typeof this.parseAsStatement !== 'undefined' && this.parseAsStatement === true;
        	};

    }).call(this);

    this.dfa15 = new MmirScriptBlockLexer.DFA15(this);
    MmirScriptBlockLexer.superclass.constructor.call(this, input, state);


};

org.antlr.lang.augmentObject(MmirScriptBlockLexer, {
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
    DoExitBlock: 28,
    STRING: 29,
    SSTRING: 30,
    WS: 31
});

(function(){
var HIDDEN = org.antlr.runtime.Token.HIDDEN_CHANNEL,
    EOF = org.antlr.runtime.Token.EOF;
org.antlr.lang.extend(MmirScriptBlockLexer, org.antlr.runtime.Lexer, {
    EOF : -1,
    CHAR : 4,
    NL : 5,
    END : 6,
    EscapeExit : 7,
    ESC_DoEnter : 8,
    COMMENT : 9,
    DoEnterBlock : 10,
    DoEnterStatement : 11,
    DoEnterIncludeScript : 12,
    DoEnterIncludeStyle : 13,
    DoEnterLocalize : 14,
    DoEnterYieldDeclaration : 15,
    DoEnterYieldContent : 16,
    DoEnterIfStatement : 17,
    DoEnterElseStatement : 18,
    DoEnterForStatement : 19,
    DoEnterDeclareVar : 20,
    DoEnterHelper : 21,
    DoEnterRender : 22,
    END_SCRIPT : 23,
    HEX_DIGIT : 24,
    UNICODE_ESC : 25,
    OCTAL_ESC : 26,
    ESC_SEQ : 27,
    DoExitBlock : 28,
    STRING : 29,
    SSTRING : 30,
    WS : 31,
    getGrammarFileName: function() { return "../MmirScriptBlock.g"; }
});
org.antlr.lang.augmentObject(MmirScriptBlockLexer.prototype, {
    // $ANTLR start DoEnterBlock
    mDoEnterBlock: function()  {
        try {
            var _type = this.DoEnterBlock;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirScriptBlock.g:79:2: ( '{' )
            // ../MmirScriptBlock.g:79:4: '{'
            this.match('{'); 
            this.nestingBlock++; if(this.isDebug) this.printDebug("opening level SCRIPT_BLOCK "+this.nestingBlock);/*debug*/



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DoEnterBlock",

    // $ANTLR start DoExitBlock
    mDoExitBlock: function()  {
        try {
            var _type = this.DoExitBlock;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirScriptBlock.g:83:2: ( '}' )
            // ../MmirScriptBlock.g:83:4: '}'
            this.match('}'); 

                      if ( this.nestingBlock <= 0 ) {
            		
                            this.emit(org.antlr.runtime.Token.EOF_TOKEN);
                            
                            if(this.isDebug) this.printDebug("exiting embedded SCRIPT_BLOCK");//debug
                      }
                      else {
                            if(this.isDebug) this.printDebug("closing level SCRIPT_BLOCK "+this.nestingBlock);//debug
                            
                            this.nestingBlock--;
                      }
                    



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DoExitBlock",

    // $ANTLR start NL
    mNL: function()  {
        try {
            var _type = this.NL;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirScriptBlock.g:100:2: ( ( '\\r' )? '\\n' | '\\r' | '\\u2028' | '\\u2029' )
            var alt2=4;
            switch ( this.input.LA(1) ) {
            case '\r':
                var LA2_1 = this.input.LA(2);

                if ( (LA2_1=='\n') ) {
                    alt2=1;
                }
                else {
                    alt2=2;}
                break;
            case '\n':
                alt2=1;
                break;
            case '\u2028':
                alt2=3;
                break;
            case '\u2029':
                alt2=4;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 2, 0, this.input);

                throw nvae;
            }

            switch (alt2) {
                case 1 :
                    // ../MmirScriptBlock.g:100:4: ( '\\r' )? '\\n'
                    // ../MmirScriptBlock.g:100:4: ( '\\r' )?
                    var alt1=2;
                    var LA1_0 = this.input.LA(1);

                    if ( (LA1_0=='\r') ) {
                        alt1=1;
                    }
                    switch (alt1) {
                        case 1 :
                            // ../MmirScriptBlock.g:100:4: '\\r'
                            this.match('\r'); 


                            break;

                    }

                    this.match('\n'); 


                    break;
                case 2 :
                    // ../MmirScriptBlock.g:101:4: '\\r'
                    this.match('\r'); 


                    break;
                case 3 :
                    // ../MmirScriptBlock.g:102:4: '\\u2028'
                    this.match('\u2028'); 


                    break;
                case 4 :
                    // ../MmirScriptBlock.g:103:4: '\\u2029'
                    this.match('\u2029'); 


                    break;

            }
            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "NL",

    // $ANTLR start WS
    mWS: function()  {
        try {
            var _type = this.WS;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirScriptBlock.g:108:5: ( ( ' ' | '\\t' | NL ) )
            // ../MmirScriptBlock.g:108:7: ( ' ' | '\\t' | NL )
            // ../MmirScriptBlock.g:108:7: ( ' ' | '\\t' | NL )
            var alt3=3;
            switch ( this.input.LA(1) ) {
            case ' ':
                alt3=1;
                break;
            case '\t':
                alt3=2;
                break;
            case '\n':
            case '\r':
            case '\u2028':
            case '\u2029':
                alt3=3;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 3, 0, this.input);

                throw nvae;
            }

            switch (alt3) {
                case 1 :
                    // ../MmirScriptBlock.g:108:8: ' '
                    this.match(' '); 


                    break;
                case 2 :
                    // ../MmirScriptBlock.g:108:12: '\\t'
                    this.match('\t'); 


                    break;
                case 3 :
                    // ../MmirScriptBlock.g:108:18: NL
                    this.mNL(); 


                    break;

            }

            _channel=HIDDEN;



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "WS",

    // $ANTLR start CHAR
    mCHAR: function()  {
        try {
            var _type = this.CHAR;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirScriptBlock.g:110:6: (~ ( '\\n' | '\\r' ) )
            // ../MmirScriptBlock.g:110:8: ~ ( '\\n' | '\\r' )
            if ( (this.input.LA(1)>='\u0000' && this.input.LA(1)<='\t')||(this.input.LA(1)>='\u000B' && this.input.LA(1)<='\f')||(this.input.LA(1)>='\u000E' && this.input.LA(1)<='\uFFFF') ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "CHAR",

    // $ANTLR start COMMENT
    mCOMMENT: function()  {
        try {
            var _type = this.COMMENT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirScriptBlock.g:113:5: ( '//' (~ ( '\\n' | '\\r' ) )* ( '\\r' )? '\\n' | '/*' ( options {greedy=false; } : . )* '*/' | '@*' ( options {greedy=false; } : . )* '*@' )
            var alt8=3;
            var LA8_0 = this.input.LA(1);

            if ( (LA8_0=='/') ) {
                var LA8_1 = this.input.LA(2);

                if ( (LA8_1=='/') ) {
                    alt8=1;
                }
                else if ( (LA8_1=='*') ) {
                    alt8=2;
                }
                else {
                    var nvae =
                        new org.antlr.runtime.NoViableAltException("", 8, 1, this.input);

                    throw nvae;
                }
            }
            else if ( (LA8_0=='@') ) {
                alt8=3;
            }
            else {
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 8, 0, this.input);

                throw nvae;
            }
            switch (alt8) {
                case 1 :
                    // ../MmirScriptBlock.g:113:9: '//' (~ ( '\\n' | '\\r' ) )* ( '\\r' )? '\\n'
                    this.match("//"); 

                    // ../MmirScriptBlock.g:113:14: (~ ( '\\n' | '\\r' ) )*
                    loop4:
                    do {
                        var alt4=2;
                        var LA4_0 = this.input.LA(1);

                        if ( ((LA4_0>='\u0000' && LA4_0<='\t')||(LA4_0>='\u000B' && LA4_0<='\f')||(LA4_0>='\u000E' && LA4_0<='\uFFFF')) ) {
                            alt4=1;
                        }


                        switch (alt4) {
                        case 1 :
                            // ../MmirScriptBlock.g:113:14: ~ ( '\\n' | '\\r' )
                            if ( (this.input.LA(1)>='\u0000' && this.input.LA(1)<='\t')||(this.input.LA(1)>='\u000B' && this.input.LA(1)<='\f')||(this.input.LA(1)>='\u000E' && this.input.LA(1)<='\uFFFF') ) {
                                this.input.consume();

                            }
                            else {
                                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                                this.recover(mse);
                                throw mse;}



                            break;

                        default :
                            break loop4;
                        }
                    } while (true);

                    // ../MmirScriptBlock.g:113:28: ( '\\r' )?
                    var alt5=2;
                    var LA5_0 = this.input.LA(1);

                    if ( (LA5_0=='\r') ) {
                        alt5=1;
                    }
                    switch (alt5) {
                        case 1 :
                            // ../MmirScriptBlock.g:113:28: '\\r'
                            this.match('\r'); 


                            break;

                    }

                    this.match('\n'); 
                    _channel=HIDDEN;


                    break;
                case 2 :
                    // ../MmirScriptBlock.g:114:9: '/*' ( options {greedy=false; } : . )* '*/'
                    this.match("/*"); 

                    // ../MmirScriptBlock.g:114:14: ( options {greedy=false; } : . )*
                    loop6:
                    do {
                        var alt6=2;
                        var LA6_0 = this.input.LA(1);

                        if ( (LA6_0=='*') ) {
                            var LA6_1 = this.input.LA(2);

                            if ( (LA6_1=='/') ) {
                                alt6=2;
                            }
                            else if ( ((LA6_1>='\u0000' && LA6_1<='.')||(LA6_1>='0' && LA6_1<='\uFFFF')) ) {
                                alt6=1;
                            }


                        }
                        else if ( ((LA6_0>='\u0000' && LA6_0<=')')||(LA6_0>='+' && LA6_0<='\uFFFF')) ) {
                            alt6=1;
                        }


                        switch (alt6) {
                        case 1 :
                            // ../MmirScriptBlock.g:114:42: .
                            this.matchAny(); 


                            break;

                        default :
                            break loop6;
                        }
                    } while (true);

                    this.match("*/"); 

                    _channel=HIDDEN;


                    break;
                case 3 :
                    // ../MmirScriptBlock.g:115:9: '@*' ( options {greedy=false; } : . )* '*@'
                    this.match("@*"); 

                    // ../MmirScriptBlock.g:115:14: ( options {greedy=false; } : . )*
                    loop7:
                    do {
                        var alt7=2;
                        var LA7_0 = this.input.LA(1);

                        if ( (LA7_0=='*') ) {
                            var LA7_1 = this.input.LA(2);

                            if ( (LA7_1=='@') ) {
                                alt7=2;
                            }
                            else if ( ((LA7_1>='\u0000' && LA7_1<='?')||(LA7_1>='A' && LA7_1<='\uFFFF')) ) {
                                alt7=1;
                            }


                        }
                        else if ( ((LA7_0>='\u0000' && LA7_0<=')')||(LA7_0>='+' && LA7_0<='\uFFFF')) ) {
                            alt7=1;
                        }


                        switch (alt7) {
                        case 1 :
                            // ../MmirScriptBlock.g:115:42: .
                            this.matchAny(); 


                            break;

                        default :
                            break loop7;
                        }
                    } while (true);

                    this.match("*@"); 

                    _channel=HIDDEN;


                    break;

            }
            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "COMMENT",

    // $ANTLR start STRING
    mSTRING: function()  {
        try {
            var _type = this.STRING;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirScriptBlock.g:119:5: ( '\"' ( options {greedy=false; } : ( ESC_SEQ | ~ ( '\\\\' | '\"' ) ) )* '\"' )
            // ../MmirScriptBlock.g:119:8: '\"' ( options {greedy=false; } : ( ESC_SEQ | ~ ( '\\\\' | '\"' ) ) )* '\"'
            this.match('\"'); 
            // ../MmirScriptBlock.g:119:12: ( options {greedy=false; } : ( ESC_SEQ | ~ ( '\\\\' | '\"' ) ) )*
            loop10:
            do {
                var alt10=2;
                var LA10_0 = this.input.LA(1);

                if ( ((LA10_0>='\u0000' && LA10_0<='!')||(LA10_0>='#' && LA10_0<='\uFFFF')) ) {
                    alt10=1;
                }
                else if ( (LA10_0=='\"') ) {
                    alt10=2;
                }


                switch (alt10) {
                case 1 :
                    // ../MmirScriptBlock.g:119:39: ( ESC_SEQ | ~ ( '\\\\' | '\"' ) )
                    // ../MmirScriptBlock.g:119:39: ( ESC_SEQ | ~ ( '\\\\' | '\"' ) )
                    var alt9=2;
                    var LA9_0 = this.input.LA(1);

                    if ( (LA9_0=='\\') ) {
                        alt9=1;
                    }
                    else if ( ((LA9_0>='\u0000' && LA9_0<='!')||(LA9_0>='#' && LA9_0<='[')||(LA9_0>=']' && LA9_0<='\uFFFF')) ) {
                        alt9=2;
                    }
                    else {
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 9, 0, this.input);

                        throw nvae;
                    }
                    switch (alt9) {
                        case 1 :
                            // ../MmirScriptBlock.g:119:40: ESC_SEQ
                            this.mESC_SEQ(); 


                            break;
                        case 2 :
                            // ../MmirScriptBlock.g:119:50: ~ ( '\\\\' | '\"' )
                            if ( (this.input.LA(1)>='\u0000' && this.input.LA(1)<='!')||(this.input.LA(1)>='#' && this.input.LA(1)<='[')||(this.input.LA(1)>=']' && this.input.LA(1)<='\uFFFF') ) {
                                this.input.consume();

                            }
                            else {
                                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                                this.recover(mse);
                                throw mse;}



                            break;

                    }



                    break;

                default :
                    break loop10;
                }
            } while (true);

            this.match('\"'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "STRING",

    // $ANTLR start SSTRING
    mSSTRING: function()  {
        try {
            var _type = this.SSTRING;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirScriptBlock.g:123:5: ( '\\'' ( options {greedy=false; } : ( ESC_SEQ | ~ ( '\\\\' | '\\'' ) ) )* '\\'' )
            // ../MmirScriptBlock.g:123:8: '\\'' ( options {greedy=false; } : ( ESC_SEQ | ~ ( '\\\\' | '\\'' ) ) )* '\\''
            this.match('\''); 
            // ../MmirScriptBlock.g:123:13: ( options {greedy=false; } : ( ESC_SEQ | ~ ( '\\\\' | '\\'' ) ) )*
            loop12:
            do {
                var alt12=2;
                var LA12_0 = this.input.LA(1);

                if ( ((LA12_0>='\u0000' && LA12_0<='&')||(LA12_0>='(' && LA12_0<='\uFFFF')) ) {
                    alt12=1;
                }
                else if ( (LA12_0=='\'') ) {
                    alt12=2;
                }


                switch (alt12) {
                case 1 :
                    // ../MmirScriptBlock.g:123:40: ( ESC_SEQ | ~ ( '\\\\' | '\\'' ) )
                    // ../MmirScriptBlock.g:123:40: ( ESC_SEQ | ~ ( '\\\\' | '\\'' ) )
                    var alt11=2;
                    var LA11_0 = this.input.LA(1);

                    if ( (LA11_0=='\\') ) {
                        alt11=1;
                    }
                    else if ( ((LA11_0>='\u0000' && LA11_0<='&')||(LA11_0>='(' && LA11_0<='[')||(LA11_0>=']' && LA11_0<='\uFFFF')) ) {
                        alt11=2;
                    }
                    else {
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 11, 0, this.input);

                        throw nvae;
                    }
                    switch (alt11) {
                        case 1 :
                            // ../MmirScriptBlock.g:123:41: ESC_SEQ
                            this.mESC_SEQ(); 


                            break;
                        case 2 :
                            // ../MmirScriptBlock.g:123:51: ~ ( '\\\\' | '\\'' )
                            if ( (this.input.LA(1)>='\u0000' && this.input.LA(1)<='&')||(this.input.LA(1)>='(' && this.input.LA(1)<='[')||(this.input.LA(1)>=']' && this.input.LA(1)<='\uFFFF') ) {
                                this.input.consume();

                            }
                            else {
                                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                                this.recover(mse);
                                throw mse;}



                            break;

                    }



                    break;

                default :
                    break loop12;
                }
            } while (true);

            this.match('\''); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "SSTRING",

    // $ANTLR start HEX_DIGIT
    mHEX_DIGIT: function()  {
        try {
            // ../MmirScriptBlock.g:127:11: ( ( '0' .. '9' | 'a' .. 'f' | 'A' .. 'F' ) )
            // ../MmirScriptBlock.g:127:13: ( '0' .. '9' | 'a' .. 'f' | 'A' .. 'F' )
            if ( (this.input.LA(1)>='0' && this.input.LA(1)<='9')||(this.input.LA(1)>='A' && this.input.LA(1)<='F')||(this.input.LA(1)>='a' && this.input.LA(1)<='f') ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "HEX_DIGIT",

    // $ANTLR start ESC_SEQ
    mESC_SEQ: function()  {
        try {
            // ../MmirScriptBlock.g:131:5: ( '\\\\' ( 'b' | 't' | 'n' | 'f' | 'r' | '\\\"' | '\\'' | '\\\\' ) | UNICODE_ESC | OCTAL_ESC )
            var alt13=3;
            var LA13_0 = this.input.LA(1);

            if ( (LA13_0=='\\') ) {
                switch ( this.input.LA(2) ) {
                case '\"':
                case '\'':
                case '\\':
                case 'b':
                case 'f':
                case 'n':
                case 'r':
                case 't':
                    alt13=1;
                    break;
                case 'u':
                    alt13=2;
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                    alt13=3;
                    break;
                default:
                    var nvae =
                        new org.antlr.runtime.NoViableAltException("", 13, 1, this.input);

                    throw nvae;
                }

            }
            else {
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 13, 0, this.input);

                throw nvae;
            }
            switch (alt13) {
                case 1 :
                    // ../MmirScriptBlock.g:131:9: '\\\\' ( 'b' | 't' | 'n' | 'f' | 'r' | '\\\"' | '\\'' | '\\\\' )
                    this.match('\\'); 
                    if ( this.input.LA(1)=='\"'||this.input.LA(1)=='\''||this.input.LA(1)=='\\'||this.input.LA(1)=='b'||this.input.LA(1)=='f'||this.input.LA(1)=='n'||this.input.LA(1)=='r'||this.input.LA(1)=='t' ) {
                        this.input.consume();

                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        this.recover(mse);
                        throw mse;}



                    break;
                case 2 :
                    // ../MmirScriptBlock.g:132:9: UNICODE_ESC
                    this.mUNICODE_ESC(); 


                    break;
                case 3 :
                    // ../MmirScriptBlock.g:133:9: OCTAL_ESC
                    this.mOCTAL_ESC(); 


                    break;

            }
        }
        finally {
        }
    },
    // $ANTLR end "ESC_SEQ",

    // $ANTLR start OCTAL_ESC
    mOCTAL_ESC: function()  {
        try {
            // ../MmirScriptBlock.g:138:5: ( '\\\\' ( '0' .. '3' ) ( '0' .. '7' ) ( '0' .. '7' ) | '\\\\' ( '0' .. '7' ) ( '0' .. '7' ) | '\\\\' ( '0' .. '7' ) )
            var alt14=3;
            var LA14_0 = this.input.LA(1);

            if ( (LA14_0=='\\') ) {
                var LA14_1 = this.input.LA(2);

                if ( ((LA14_1>='0' && LA14_1<='3')) ) {
                    var LA14_2 = this.input.LA(3);

                    if ( ((LA14_2>='0' && LA14_2<='7')) ) {
                        var LA14_4 = this.input.LA(4);

                        if ( ((LA14_4>='0' && LA14_4<='7')) ) {
                            alt14=1;
                        }
                        else {
                            alt14=2;}
                    }
                    else {
                        alt14=3;}
                }
                else if ( ((LA14_1>='4' && LA14_1<='7')) ) {
                    var LA14_3 = this.input.LA(3);

                    if ( ((LA14_3>='0' && LA14_3<='7')) ) {
                        alt14=2;
                    }
                    else {
                        alt14=3;}
                }
                else {
                    var nvae =
                        new org.antlr.runtime.NoViableAltException("", 14, 1, this.input);

                    throw nvae;
                }
            }
            else {
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 14, 0, this.input);

                throw nvae;
            }
            switch (alt14) {
                case 1 :
                    // ../MmirScriptBlock.g:138:9: '\\\\' ( '0' .. '3' ) ( '0' .. '7' ) ( '0' .. '7' )
                    this.match('\\'); 
                    // ../MmirScriptBlock.g:138:14: ( '0' .. '3' )
                    // ../MmirScriptBlock.g:138:15: '0' .. '3'
                    this.matchRange('0','3'); 



                    // ../MmirScriptBlock.g:138:25: ( '0' .. '7' )
                    // ../MmirScriptBlock.g:138:26: '0' .. '7'
                    this.matchRange('0','7'); 



                    // ../MmirScriptBlock.g:138:36: ( '0' .. '7' )
                    // ../MmirScriptBlock.g:138:37: '0' .. '7'
                    this.matchRange('0','7'); 





                    break;
                case 2 :
                    // ../MmirScriptBlock.g:139:9: '\\\\' ( '0' .. '7' ) ( '0' .. '7' )
                    this.match('\\'); 
                    // ../MmirScriptBlock.g:139:14: ( '0' .. '7' )
                    // ../MmirScriptBlock.g:139:15: '0' .. '7'
                    this.matchRange('0','7'); 



                    // ../MmirScriptBlock.g:139:25: ( '0' .. '7' )
                    // ../MmirScriptBlock.g:139:26: '0' .. '7'
                    this.matchRange('0','7'); 





                    break;
                case 3 :
                    // ../MmirScriptBlock.g:140:9: '\\\\' ( '0' .. '7' )
                    this.match('\\'); 
                    // ../MmirScriptBlock.g:140:14: ( '0' .. '7' )
                    // ../MmirScriptBlock.g:140:15: '0' .. '7'
                    this.matchRange('0','7'); 





                    break;

            }
        }
        finally {
        }
    },
    // $ANTLR end "OCTAL_ESC",

    // $ANTLR start UNICODE_ESC
    mUNICODE_ESC: function()  {
        try {
            // ../MmirScriptBlock.g:145:5: ( '\\\\' 'u' HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT )
            // ../MmirScriptBlock.g:145:9: '\\\\' 'u' HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT
            this.match('\\'); 
            this.match('u'); 
            this.mHEX_DIGIT(); 
            this.mHEX_DIGIT(); 
            this.mHEX_DIGIT(); 
            this.mHEX_DIGIT(); 



        }
        finally {
        }
    },
    // $ANTLR end "UNICODE_ESC",

    mTokens: function() {
        // ../MmirScriptBlock.g:1:8: ( DoEnterBlock | DoExitBlock | NL | WS | CHAR | COMMENT | STRING | SSTRING )
        var alt15=8;
        alt15 = this.dfa15.predict(this.input);
        switch (alt15) {
            case 1 :
                // ../MmirScriptBlock.g:1:10: DoEnterBlock
                this.mDoEnterBlock(); 


                break;
            case 2 :
                // ../MmirScriptBlock.g:1:23: DoExitBlock
                this.mDoExitBlock(); 


                break;
            case 3 :
                // ../MmirScriptBlock.g:1:35: NL
                this.mNL(); 


                break;
            case 4 :
                // ../MmirScriptBlock.g:1:38: WS
                this.mWS(); 


                break;
            case 5 :
                // ../MmirScriptBlock.g:1:41: CHAR
                this.mCHAR(); 


                break;
            case 6 :
                // ../MmirScriptBlock.g:1:46: COMMENT
                this.mCOMMENT(); 


                break;
            case 7 :
                // ../MmirScriptBlock.g:1:54: STRING
                this.mSTRING(); 


                break;
            case 8 :
                // ../MmirScriptBlock.g:1:61: SSTRING
                this.mSSTRING(); 


                break;

        }

    }

}, true); // important to pass true to overwrite default implementations

org.antlr.lang.augmentObject(MmirScriptBlockLexer, {
    DFA15_eotS:
        "\u0003\uffff\u0001\u0010\u0005\uffff\u0004\u000d\u0008\uffff",
    DFA15_eofS:
        "\u0015\uffff",
    DFA15_minS:
        "\u0001\u0000\u0002\uffff\u0001\u000a\u0005\uffff\u0002\u002a\u0002"+
    "\u0000\u0008\uffff",
    DFA15_maxS:
        "\u0001\uffff\u0002\uffff\u0001\u000a\u0005\uffff\u0001\u002f\u0001"+
    "\u002a\u0002\uffff\u0008\uffff",
    DFA15_acceptS:
        "\u0001\uffff\u0001\u0001\u0001\u0002\u0001\uffff\u0003\u0003\u0002"+
    "\u0004\u0004\uffff\u0001\u0005\u0001\u0001\u0001\u0002\u0001\u0003\u0001"+
    "\u0004\u0001\u0006\u0001\u0007\u0001\u0008",
    DFA15_specialS:
        "\u0001\u0000\u000a\uffff\u0001\u0002\u0001\u0001\u0008\uffff}>",
    DFA15_transitionS: [
            "\u0009\u000d\u0001\u0008\u0001\u0004\u0002\u000d\u0001\u0003"+
            "\u0012\u000d\u0001\u0007\u0001\u000d\u0001\u000b\u0004\u000d"+
            "\u0001\u000c\u0007\u000d\u0001\u0009\u0010\u000d\u0001\u000a"+
            "\u003a\u000d\u0001\u0001\u0001\u000d\u0001\u0002\u1faa\u000d"+
            "\u0001\u0005\u0001\u0006\udfd6\u000d",
            "",
            "",
            "\u0001\u0004",
            "",
            "",
            "",
            "",
            "",
            "\u0001\u0012\u0004\uffff\u0001\u0012",
            "\u0001\u0012",
            "\u0000\u0013",
            "\u0000\u0014",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            ""
    ]
});

org.antlr.lang.augmentObject(MmirScriptBlockLexer, {
    DFA15_eot:
        org.antlr.runtime.DFA.unpackEncodedString(MmirScriptBlockLexer.DFA15_eotS),
    DFA15_eof:
        org.antlr.runtime.DFA.unpackEncodedString(MmirScriptBlockLexer.DFA15_eofS),
    DFA15_min:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(MmirScriptBlockLexer.DFA15_minS),
    DFA15_max:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(MmirScriptBlockLexer.DFA15_maxS),
    DFA15_accept:
        org.antlr.runtime.DFA.unpackEncodedString(MmirScriptBlockLexer.DFA15_acceptS),
    DFA15_special:
        org.antlr.runtime.DFA.unpackEncodedString(MmirScriptBlockLexer.DFA15_specialS),
    DFA15_transition: (function() {
        var a = [],
            i,
            numStates = MmirScriptBlockLexer.DFA15_transitionS.length;
        for (i=0; i<numStates; i++) {
            a.push(org.antlr.runtime.DFA.unpackEncodedString(MmirScriptBlockLexer.DFA15_transitionS[i]));
        }
        return a;
    })()
});

MmirScriptBlockLexer.DFA15 = function(recognizer) {
    this.recognizer = recognizer;
    this.decisionNumber = 15;
    this.eot = MmirScriptBlockLexer.DFA15_eot;
    this.eof = MmirScriptBlockLexer.DFA15_eof;
    this.min = MmirScriptBlockLexer.DFA15_min;
    this.max = MmirScriptBlockLexer.DFA15_max;
    this.accept = MmirScriptBlockLexer.DFA15_accept;
    this.special = MmirScriptBlockLexer.DFA15_special;
    this.transition = MmirScriptBlockLexer.DFA15_transition;
};

org.antlr.lang.extend(MmirScriptBlockLexer.DFA15, org.antlr.runtime.DFA, {
    getDescription: function() {
        return "1:1: Tokens : ( DoEnterBlock | DoExitBlock | NL | WS | CHAR | COMMENT | STRING | SSTRING );";
    },
    specialStateTransition: function(s, input) {
        var _s = s;
        /* bind to recognizer so semantic predicates can be evaluated */
        var retval = (function(s, input) {
            switch ( s ) {
                        case 0 : 
                            var LA15_0 = input.LA(1);

                            s = -1;
                            if ( (LA15_0=='{') ) {s = 1;}

                            else if ( (LA15_0=='}') ) {s = 2;}

                            else if ( (LA15_0=='\r') ) {s = 3;}

                            else if ( (LA15_0=='\n') ) {s = 4;}

                            else if ( (LA15_0=='\u2028') ) {s = 5;}

                            else if ( (LA15_0=='\u2029') ) {s = 6;}

                            else if ( (LA15_0==' ') ) {s = 7;}

                            else if ( (LA15_0=='\t') ) {s = 8;}

                            else if ( (LA15_0=='/') ) {s = 9;}

                            else if ( (LA15_0=='@') ) {s = 10;}

                            else if ( (LA15_0=='\"') ) {s = 11;}

                            else if ( (LA15_0=='\'') ) {s = 12;}

                            else if ( ((LA15_0>='\u0000' && LA15_0<='\b')||(LA15_0>='\u000B' && LA15_0<='\f')||(LA15_0>='\u000E' && LA15_0<='\u001F')||LA15_0=='!'||(LA15_0>='#' && LA15_0<='&')||(LA15_0>='(' && LA15_0<='.')||(LA15_0>='0' && LA15_0<='?')||(LA15_0>='A' && LA15_0<='z')||LA15_0=='|'||(LA15_0>='~' && LA15_0<='\u2027')||(LA15_0>='\u202A' && LA15_0<='\uFFFF')) ) {s = 13;}

                            if ( s>=0 ) return s;
                            break;
                        case 1 : 
                            var LA15_12 = input.LA(1);

                            s = -1;
                            if ( ((LA15_12>='\u0000' && LA15_12<='\uFFFF')) ) {s = 20;}

                            else s = 13;

                            if ( s>=0 ) return s;
                            break;
                        case 2 : 
                            var LA15_11 = input.LA(1);

                            s = -1;
                            if ( ((LA15_11>='\u0000' && LA15_11<='\uFFFF')) ) {s = 19;}

                            else s = 13;

                            if ( s>=0 ) return s;
                            break;
            }
        }).call(this.recognizer, s, input);
        if (!org.antlr.lang.isUndefined(retval)) {
            return retval;
        }
        var nvae =
            new org.antlr.runtime.NoViableAltException(this.getDescription(), 15, _s, input);
        this.error(nvae);
        throw nvae;
    },
    dummy: null
});
 
})();