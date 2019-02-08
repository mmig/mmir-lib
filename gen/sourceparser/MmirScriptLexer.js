// $ANTLR 3.3 Nov 30, 2010 12:50:56 MmirScript.g 2016-07-04 21:14:34

var MmirScriptLexer = function(input, state) {
// alternate constructor @todo
// public MmirScriptLexer(CharStream input)
// public MmirScriptLexer(CharStream input, RecognizerSharedState state) {
    if (!state) {
        state = new org.antlr.runtime.RecognizerSharedState();
    }

    (function(){


        	this.isDebug = true;
        	
        	this.isInStatementMode = false;
        	
        	this.nesting = 0;
        	this.nestingBlock = 0;
        	
        	this.setStatementMode = function(){
        		this.isInStatementMode = true;
        	};
        	
        	this.setBlockMode = function(){
        		this.isInStatementMode = false;
        	};
        	
        	this.isStatementMode = function(){
        		return this.isInStatementMode === true;
        	};
        	
        	this.isBlockMode = function(){
        		return this.isInStatementMode === false;
        	};

    }).call(this);

    this.dfa15 = new MmirScriptLexer.DFA15(this);
    MmirScriptLexer.superclass.constructor.call(this, input, state);


};

org.antlr.lang.augmentObject(MmirScriptLexer, {
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
var HIDDEN = org.antlr.runtime.Token.HIDDEN_CHANNEL,
    EOF = org.antlr.runtime.Token.EOF;
org.antlr.lang.extend(MmirScriptLexer, org.antlr.runtime.Lexer, {
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
    DoExit : 24,
    DoExitStatement : 25,
    DoEnter : 26,
    STRING : 27,
    SSTRING : 28,
    WS : 29,
    ESC_SEQ : 30,
    HEX_DIGIT : 31,
    UNICODE_ESC : 32,
    OCTAL_ESC : 33,
    getGrammarFileName: function() { return "MmirScript.g"; }
});
org.antlr.lang.augmentObject(MmirScriptLexer.prototype, {
    // $ANTLR start DoEnter
    mDoEnter: function()  {
        try {
            var _type = this.DoEnter;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // MmirScript.g:94:2: ( '{' )
            // MmirScript.g:94:4: '{'
            this.match('{'); 

            	  if(this.isBlockMode()){
            		this.nestingBlock++;
            		if(this.isDebug) this.printDebug("opening level SCRIPT_BLOCK "+this.nestingBlock);//debug
            	  }
            	



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DoEnter",

    // $ANTLR start DoExit
    mDoExit: function()  {
        try {
            var _type = this.DoExit;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // MmirScript.g:104:2: ( '}' )
            // MmirScript.g:104:4: '}'
            this.match('}'); 

            	  if(this.isBlockMode()){
            	          if ( this.nestingBlock <= 0 ) {
            			
            	                this.emit(org.antlr.runtime.Token.EOF_TOKEN);
            	                
            	                if(this.isDebug) this.printDebug("exiting embedded SCRIPT_BLOCK");//debug
            	          }
            	          else {
            	                if(this.isDebug) this.printDebug("closing level SCRIPT_BLOCK "+this.nestingBlock);//debug
            	                
            	                this.nestingBlock--;
            	          }
            	   }
                    



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DoExit",

    // $ANTLR start DoEnterStatement
    mDoEnterStatement: function()  {
        try {
            var _type = this.DoEnterStatement;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // MmirScript.g:123:2: ( '(' )
            // MmirScript.g:123:4: '('
            this.match('('); 

            	  if(this.isStatementMode()){
            	  	this.nesting++;
            	  	if(this.isDebug) this.printDebug("opening level STATEMENT_BLOCK "+this.nesting);//debug
            	  }
            	



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DoEnterStatement",

    // $ANTLR start DoExitStatement
    mDoExitStatement: function()  {
        try {
            var _type = this.DoExitStatement;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // MmirScript.g:132:16: ( ')' )
            // MmirScript.g:132:19: ')'
            this.match(')'); 

            	  if(this.isStatementMode()){
            	          if ( this.nesting <= 0 ) {
            	          
            	                this.emit(org.antlr.runtime.Token.EOF_TOKEN);
            	                
            	                if(this.isDebug) this.printDebug("exiting embedded SCRIPT_STATEMENT");//debug
            	          }
            	          else {
            	                if(this.isDebug) this.printDebug("closing level SCRIPT_STATEMENT "+this.nesting);//debug
            	                
            	                this.nesting--;
            	          }
            	   }
                    



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DoExitStatement",

    // $ANTLR start NL
    mNL: function()  {
        try {
            var _type = this.NL;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // MmirScript.g:151:2: ( ( '\\r' )? '\\n' | '\\r' | '\\u2028' | '\\u2029' )
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
                    // MmirScript.g:151:4: ( '\\r' )? '\\n'
                    // MmirScript.g:151:4: ( '\\r' )?
                    var alt1=2;
                    var LA1_0 = this.input.LA(1);

                    if ( (LA1_0=='\r') ) {
                        alt1=1;
                    }
                    switch (alt1) {
                        case 1 :
                            // MmirScript.g:151:4: '\\r'
                            this.match('\r'); 


                            break;

                    }

                    this.match('\n'); 


                    break;
                case 2 :
                    // MmirScript.g:152:4: '\\r'
                    this.match('\r'); 


                    break;
                case 3 :
                    // MmirScript.g:153:4: '\\u2028'
                    this.match('\u2028'); 


                    break;
                case 4 :
                    // MmirScript.g:154:4: '\\u2029'
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
            // MmirScript.g:159:5: ( ( ' ' | '\\t' | NL ) )
            // MmirScript.g:159:7: ( ' ' | '\\t' | NL )
            // MmirScript.g:159:7: ( ' ' | '\\t' | NL )
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
                    // MmirScript.g:159:8: ' '
                    this.match(' '); 


                    break;
                case 2 :
                    // MmirScript.g:159:12: '\\t'
                    this.match('\t'); 


                    break;
                case 3 :
                    // MmirScript.g:159:18: NL
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
            // MmirScript.g:161:6: (~ ( '\\n' | '\\r' ) )
            // MmirScript.g:161:8: ~ ( '\\n' | '\\r' )
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
            // MmirScript.g:164:5: ( '//' (~ ( '\\n' | '\\r' ) )* ( '\\r' )? '\\n' | '/*' ( options {greedy=false; } : . )* '*/' | '@*' ( options {greedy=false; } : . )* '*@' )
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
                    // MmirScript.g:164:9: '//' (~ ( '\\n' | '\\r' ) )* ( '\\r' )? '\\n'
                    this.match("//"); 

                    // MmirScript.g:164:14: (~ ( '\\n' | '\\r' ) )*
                    loop4:
                    do {
                        var alt4=2;
                        var LA4_0 = this.input.LA(1);

                        if ( ((LA4_0>='\u0000' && LA4_0<='\t')||(LA4_0>='\u000B' && LA4_0<='\f')||(LA4_0>='\u000E' && LA4_0<='\uFFFF')) ) {
                            alt4=1;
                        }


                        switch (alt4) {
                        case 1 :
                            // MmirScript.g:164:14: ~ ( '\\n' | '\\r' )
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

                    // MmirScript.g:164:28: ( '\\r' )?
                    var alt5=2;
                    var LA5_0 = this.input.LA(1);

                    if ( (LA5_0=='\r') ) {
                        alt5=1;
                    }
                    switch (alt5) {
                        case 1 :
                            // MmirScript.g:164:28: '\\r'
                            this.match('\r'); 


                            break;

                    }

                    this.match('\n'); 
                    _channel=HIDDEN;


                    break;
                case 2 :
                    // MmirScript.g:165:9: '/*' ( options {greedy=false; } : . )* '*/'
                    this.match("/*"); 

                    // MmirScript.g:165:14: ( options {greedy=false; } : . )*
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
                            // MmirScript.g:165:42: .
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
                    // MmirScript.g:166:9: '@*' ( options {greedy=false; } : . )* '*@'
                    this.match("@*"); 

                    // MmirScript.g:166:14: ( options {greedy=false; } : . )*
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
                            // MmirScript.g:166:42: .
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
            // MmirScript.g:170:5: ( '\"' ( options {greedy=false; } : ( ESC_SEQ | ~ ( '\\\\' | '\"' ) ) )* '\"' )
            // MmirScript.g:170:8: '\"' ( options {greedy=false; } : ( ESC_SEQ | ~ ( '\\\\' | '\"' ) ) )* '\"'
            this.match('\"'); 
            // MmirScript.g:170:12: ( options {greedy=false; } : ( ESC_SEQ | ~ ( '\\\\' | '\"' ) ) )*
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
                    // MmirScript.g:170:39: ( ESC_SEQ | ~ ( '\\\\' | '\"' ) )
                    // MmirScript.g:170:39: ( ESC_SEQ | ~ ( '\\\\' | '\"' ) )
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
                            // MmirScript.g:170:40: ESC_SEQ
                            this.mESC_SEQ(); 


                            break;
                        case 2 :
                            // MmirScript.g:170:50: ~ ( '\\\\' | '\"' )
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
            // MmirScript.g:174:5: ( '\\'' ( options {greedy=false; } : ( ESC_SEQ | ~ ( '\\\\' | '\\'' ) ) )* '\\'' )
            // MmirScript.g:174:8: '\\'' ( options {greedy=false; } : ( ESC_SEQ | ~ ( '\\\\' | '\\'' ) ) )* '\\''
            this.match('\''); 
            // MmirScript.g:174:13: ( options {greedy=false; } : ( ESC_SEQ | ~ ( '\\\\' | '\\'' ) ) )*
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
                    // MmirScript.g:174:40: ( ESC_SEQ | ~ ( '\\\\' | '\\'' ) )
                    // MmirScript.g:174:40: ( ESC_SEQ | ~ ( '\\\\' | '\\'' ) )
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
                            // MmirScript.g:174:41: ESC_SEQ
                            this.mESC_SEQ(); 


                            break;
                        case 2 :
                            // MmirScript.g:174:51: ~ ( '\\\\' | '\\'' )
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
            // MmirScript.g:178:11: ( ( '0' .. '9' | 'a' .. 'f' | 'A' .. 'F' ) )
            // MmirScript.g:178:13: ( '0' .. '9' | 'a' .. 'f' | 'A' .. 'F' )
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
            // MmirScript.g:182:5: ( '\\\\' ( 'b' | 't' | 'n' | 'f' | 'r' | '\\\"' | '\\'' | '\\\\' ) | UNICODE_ESC | OCTAL_ESC )
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
                    // MmirScript.g:182:9: '\\\\' ( 'b' | 't' | 'n' | 'f' | 'r' | '\\\"' | '\\'' | '\\\\' )
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
                    // MmirScript.g:183:9: UNICODE_ESC
                    this.mUNICODE_ESC(); 


                    break;
                case 3 :
                    // MmirScript.g:184:9: OCTAL_ESC
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
            // MmirScript.g:189:5: ( '\\\\' ( '0' .. '3' ) ( '0' .. '7' ) ( '0' .. '7' ) | '\\\\' ( '0' .. '7' ) ( '0' .. '7' ) | '\\\\' ( '0' .. '7' ) )
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
                    // MmirScript.g:189:9: '\\\\' ( '0' .. '3' ) ( '0' .. '7' ) ( '0' .. '7' )
                    this.match('\\'); 
                    // MmirScript.g:189:14: ( '0' .. '3' )
                    // MmirScript.g:189:15: '0' .. '3'
                    this.matchRange('0','3'); 



                    // MmirScript.g:189:25: ( '0' .. '7' )
                    // MmirScript.g:189:26: '0' .. '7'
                    this.matchRange('0','7'); 



                    // MmirScript.g:189:36: ( '0' .. '7' )
                    // MmirScript.g:189:37: '0' .. '7'
                    this.matchRange('0','7'); 





                    break;
                case 2 :
                    // MmirScript.g:190:9: '\\\\' ( '0' .. '7' ) ( '0' .. '7' )
                    this.match('\\'); 
                    // MmirScript.g:190:14: ( '0' .. '7' )
                    // MmirScript.g:190:15: '0' .. '7'
                    this.matchRange('0','7'); 



                    // MmirScript.g:190:25: ( '0' .. '7' )
                    // MmirScript.g:190:26: '0' .. '7'
                    this.matchRange('0','7'); 





                    break;
                case 3 :
                    // MmirScript.g:191:9: '\\\\' ( '0' .. '7' )
                    this.match('\\'); 
                    // MmirScript.g:191:14: ( '0' .. '7' )
                    // MmirScript.g:191:15: '0' .. '7'
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
            // MmirScript.g:196:5: ( '\\\\' 'u' HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT )
            // MmirScript.g:196:9: '\\\\' 'u' HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT
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
        // MmirScript.g:1:8: ( DoEnter | DoExit | DoEnterStatement | DoExitStatement | NL | WS | CHAR | COMMENT | STRING | SSTRING )
        var alt15=10;
        alt15 = this.dfa15.predict(this.input);
        switch (alt15) {
            case 1 :
                // MmirScript.g:1:10: DoEnter
                this.mDoEnter(); 


                break;
            case 2 :
                // MmirScript.g:1:18: DoExit
                this.mDoExit(); 


                break;
            case 3 :
                // MmirScript.g:1:25: DoEnterStatement
                this.mDoEnterStatement(); 


                break;
            case 4 :
                // MmirScript.g:1:42: DoExitStatement
                this.mDoExitStatement(); 


                break;
            case 5 :
                // MmirScript.g:1:58: NL
                this.mNL(); 


                break;
            case 6 :
                // MmirScript.g:1:61: WS
                this.mWS(); 


                break;
            case 7 :
                // MmirScript.g:1:64: CHAR
                this.mCHAR(); 


                break;
            case 8 :
                // MmirScript.g:1:69: COMMENT
                this.mCOMMENT(); 


                break;
            case 9 :
                // MmirScript.g:1:77: STRING
                this.mSTRING(); 


                break;
            case 10 :
                // MmirScript.g:1:84: SSTRING
                this.mSSTRING(); 


                break;

        }

    }

}, true); // important to pass true to overwrite default implementations

org.antlr.lang.augmentObject(MmirScriptLexer, {
    DFA15_eotS:
        "\u0005\uffff\u0001\u0014\u0005\uffff\u0004\u000f\u000a\uffff",
    DFA15_eofS:
        "\u0019\uffff",
    DFA15_minS:
        "\u0001\u0000\u0004\uffff\u0001\u000a\u0005\uffff\u0002\u002a\u0002"+
    "\u0000\u000a\uffff",
    DFA15_maxS:
        "\u0001\uffff\u0004\uffff\u0001\u000a\u0005\uffff\u0001\u002f\u0001"+
    "\u002a\u0002\uffff\u000a\uffff",
    DFA15_acceptS:
        "\u0001\uffff\u0001\u0001\u0001\u0002\u0001\u0003\u0001\u0004\u0001"+
    "\uffff\u0003\u0005\u0002\u0006\u0004\uffff\u0001\u0007\u0001\u0001\u0001"+
    "\u0002\u0001\u0003\u0001\u0004\u0001\u0005\u0001\u0006\u0001\u0008\u0001"+
    "\u0009\u0001\u000a",
    DFA15_specialS:
        "\u0001\u0002\u000c\uffff\u0001\u0001\u0001\u0000\u000a\uffff}>",
    DFA15_transitionS: [
            "\u0009\u000f\u0001\u000a\u0001\u0006\u0002\u000f\u0001\u0005"+
            "\u0012\u000f\u0001\u0009\u0001\u000f\u0001\u000d\u0004\u000f"+
            "\u0001\u000e\u0001\u0003\u0001\u0004\u0005\u000f\u0001\u000b"+
            "\u0010\u000f\u0001\u000c\u003a\u000f\u0001\u0001\u0001\u000f"+
            "\u0001\u0002\u1faa\u000f\u0001\u0007\u0001\u0008\udfd6\u000f",
            "",
            "",
            "",
            "",
            "\u0001\u0006",
            "",
            "",
            "",
            "",
            "",
            "\u0001\u0016\u0004\uffff\u0001\u0016",
            "\u0001\u0016",
            "\u0000\u0017",
            "\u0000\u0018",
            "",
            "",
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

org.antlr.lang.augmentObject(MmirScriptLexer, {
    DFA15_eot:
        org.antlr.runtime.DFA.unpackEncodedString(MmirScriptLexer.DFA15_eotS),
    DFA15_eof:
        org.antlr.runtime.DFA.unpackEncodedString(MmirScriptLexer.DFA15_eofS),
    DFA15_min:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(MmirScriptLexer.DFA15_minS),
    DFA15_max:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(MmirScriptLexer.DFA15_maxS),
    DFA15_accept:
        org.antlr.runtime.DFA.unpackEncodedString(MmirScriptLexer.DFA15_acceptS),
    DFA15_special:
        org.antlr.runtime.DFA.unpackEncodedString(MmirScriptLexer.DFA15_specialS),
    DFA15_transition: (function() {
        var a = [],
            i,
            numStates = MmirScriptLexer.DFA15_transitionS.length;
        for (i=0; i<numStates; i++) {
            a.push(org.antlr.runtime.DFA.unpackEncodedString(MmirScriptLexer.DFA15_transitionS[i]));
        }
        return a;
    })()
});

MmirScriptLexer.DFA15 = function(recognizer) {
    this.recognizer = recognizer;
    this.decisionNumber = 15;
    this.eot = MmirScriptLexer.DFA15_eot;
    this.eof = MmirScriptLexer.DFA15_eof;
    this.min = MmirScriptLexer.DFA15_min;
    this.max = MmirScriptLexer.DFA15_max;
    this.accept = MmirScriptLexer.DFA15_accept;
    this.special = MmirScriptLexer.DFA15_special;
    this.transition = MmirScriptLexer.DFA15_transition;
};

org.antlr.lang.extend(MmirScriptLexer.DFA15, org.antlr.runtime.DFA, {
    getDescription: function() {
        return "1:1: Tokens : ( DoEnter | DoExit | DoEnterStatement | DoExitStatement | NL | WS | CHAR | COMMENT | STRING | SSTRING );";
    },
    specialStateTransition: function(s, input) {
        var _s = s;
        /* bind to recognizer so semantic predicates can be evaluated */
        var retval = (function(s, input) {
            switch ( s ) {
                        case 0 : 
                            var LA15_14 = input.LA(1);

                            s = -1;
                            if ( ((LA15_14>='\u0000' && LA15_14<='\uFFFF')) ) {s = 24;}

                            else s = 15;

                            if ( s>=0 ) return s;
                            break;
                        case 1 : 
                            var LA15_13 = input.LA(1);

                            s = -1;
                            if ( ((LA15_13>='\u0000' && LA15_13<='\uFFFF')) ) {s = 23;}

                            else s = 15;

                            if ( s>=0 ) return s;
                            break;
                        case 2 : 
                            var LA15_0 = input.LA(1);

                            s = -1;
                            if ( (LA15_0=='{') ) {s = 1;}

                            else if ( (LA15_0=='}') ) {s = 2;}

                            else if ( (LA15_0=='(') ) {s = 3;}

                            else if ( (LA15_0==')') ) {s = 4;}

                            else if ( (LA15_0=='\r') ) {s = 5;}

                            else if ( (LA15_0=='\n') ) {s = 6;}

                            else if ( (LA15_0=='\u2028') ) {s = 7;}

                            else if ( (LA15_0=='\u2029') ) {s = 8;}

                            else if ( (LA15_0==' ') ) {s = 9;}

                            else if ( (LA15_0=='\t') ) {s = 10;}

                            else if ( (LA15_0=='/') ) {s = 11;}

                            else if ( (LA15_0=='@') ) {s = 12;}

                            else if ( (LA15_0=='\"') ) {s = 13;}

                            else if ( (LA15_0=='\'') ) {s = 14;}

                            else if ( ((LA15_0>='\u0000' && LA15_0<='\b')||(LA15_0>='\u000B' && LA15_0<='\f')||(LA15_0>='\u000E' && LA15_0<='\u001F')||LA15_0=='!'||(LA15_0>='#' && LA15_0<='&')||(LA15_0>='*' && LA15_0<='.')||(LA15_0>='0' && LA15_0<='?')||(LA15_0>='A' && LA15_0<='z')||LA15_0=='|'||(LA15_0>='~' && LA15_0<='\u2027')||(LA15_0>='\u202A' && LA15_0<='\uFFFF')) ) {s = 15;}

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