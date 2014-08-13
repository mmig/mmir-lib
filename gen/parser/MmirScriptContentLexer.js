// $ANTLR 3.3 Nov 30, 2010 12:50:56 ../MmirScriptContent.g 2013-08-13 18:04:03

var MmirScriptContentLexer = function(input, state) {
// alternate constructor @todo
// public MmirScriptContentLexer(CharStream input)
// public MmirScriptContentLexer(CharStream input, RecognizerSharedState state) {
    if (!state) {
        state = new org.antlr.runtime.RecognizerSharedState();
    }

    (function(){

        	this.isDebug = true;
        	this.nesting = 0;

    }).call(this);

    this.dfa12 = new MmirScriptContentLexer.DFA12(this);
    MmirScriptContentLexer.superclass.constructor.call(this, input, state);


};

org.antlr.lang.augmentObject(MmirScriptContentLexer, {
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
var HIDDEN = org.antlr.runtime.Token.HIDDEN_CHANNEL,
    EOF = org.antlr.runtime.Token.EOF;
org.antlr.lang.extend(MmirScriptContentLexer, org.antlr.runtime.Lexer, {
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
    T__33 : 33,
    DoExit : 28,
    WS : 29,
    STRING : 30,
    SSTRING : 31,
    ScriptVar : 32,
    getGrammarFileName: function() { return "../MmirScriptContent.g"; }
});
org.antlr.lang.augmentObject(MmirScriptContentLexer.prototype, {
    // $ANTLR start T__33
    mT__33: function()  {
        try {
            var _type = this.T__33;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirScriptContent.g:13:7: ( '{' )
            // ../MmirScriptContent.g:13:9: '{'
            this.match('{'); if (this.state.failed) return ;



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "T__33",

    // $ANTLR start EscapeExit
    mEscapeExit: function()  {
        try {
            var _type = this.EscapeExit;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirScriptContent.g:102:12: ( '}@@' )
            // ../MmirScriptContent.g:102:14: '}@@'
            this.match("}@@"); if (this.state.failed) return ;




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "EscapeExit",

    // $ANTLR start DoEnterBlock
    mDoEnterBlock: function()  {
        try {
            var _type = this.DoEnterBlock;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirScriptContent.g:104:14: ( '@{' )
            // ../MmirScriptContent.g:104:16: '@{'
            this.match("@{"); if (this.state.failed) return ;

            if ( this.state.backtracking===0 ) {
              ++this.nesting;
            }
            if ( this.state.backtracking===0 ) {
              _channel=HIDDEN;
            }



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DoEnterBlock",

    // $ANTLR start DoEnterYieldContent
    mDoEnterYieldContent: function()  {
        try {
            var _type = this.DoEnterYieldContent;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirScriptContent.g:109:21: ( '@contentFor(' )
            // ../MmirScriptContent.g:109:25: '@contentFor('
            this.match("@contentFor("); if (this.state.failed) return ;

            if ( this.state.backtracking===0 ) {
              ++this.nesting;
            }
            if ( this.state.backtracking===0 ) {
              _channel=HIDDEN;
            }



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DoEnterYieldContent",

    // $ANTLR start DoEnterRender
    mDoEnterRender: function()  {
        try {
            var _type = this.DoEnterRender;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirScriptContent.g:114:15: ( '@render(' )
            // ../MmirScriptContent.g:114:19: '@render('
            this.match("@render("); if (this.state.failed) return ;

            if ( this.state.backtracking===0 ) {
              ++this.nesting;
            }
            if ( this.state.backtracking===0 ) {
              _channel=HIDDEN;
            }



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DoEnterRender",

    // $ANTLR start DoEnterIfStatement
    mDoEnterIfStatement: function()  {
        try {
            var _type = this.DoEnterIfStatement;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirScriptContent.g:119:20: ( '@if(' )
            // ../MmirScriptContent.g:119:24: '@if('
            this.match("@if("); if (this.state.failed) return ;

            if ( this.state.backtracking===0 ) {
              ++this.nesting;
            }
            if ( this.state.backtracking===0 ) {
              _channel=HIDDEN;
            }



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DoEnterIfStatement",

    // $ANTLR start DoEnterElseStatement
    mDoEnterElseStatement: function()  {
        try {
            var _type = this.DoEnterElseStatement;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirScriptContent.g:124:22: ( '@else' )
            // ../MmirScriptContent.g:124:26: '@else'
            this.match("@else"); if (this.state.failed) return ;

            if ( this.state.backtracking===0 ) {
              ++this.nesting;
            }
            if ( this.state.backtracking===0 ) {
              _channel=HIDDEN;
            }



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DoEnterElseStatement",

    // $ANTLR start DoEnterForStatement
    mDoEnterForStatement: function()  {
        try {
            var _type = this.DoEnterForStatement;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirScriptContent.g:129:21: ( '@for(' )
            // ../MmirScriptContent.g:129:25: '@for('
            this.match("@for("); if (this.state.failed) return ;

            if ( this.state.backtracking===0 ) {
              ++this.nesting;
            }
            if ( this.state.backtracking===0 ) {
              _channel=HIDDEN;
            }



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DoEnterForStatement",

    // $ANTLR start DoExit
    mDoExit: function()  {
        try {
            var _type = this.DoExit;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirScriptContent.g:134:8: ( '}@' )
            // ../MmirScriptContent.g:134:10: '}@'
            this.match("}@"); if (this.state.failed) return ;

            if ( this.state.backtracking===0 ) {

              		if(this.nesting == 0){
              	                this.emit(org.antlr.runtime.Token.EOF_TOKEN);
              	                
              	                if(this.isDebug) this.printDebug("exiting embedded CONTENT");//debug
                              }
                              else {
                              	--this.nesting;
                              }
                        
                      
            }



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DoExit",

    // $ANTLR start NL
    mNL: function()  {
        try {
            var _type = this.NL;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirScriptContent.g:148:2: ( ( '\\r' )? '\\n' | '\\r' | '\\u2028' | '\\u2029' )
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
                if (this.state.backtracking>0) {this.state.failed=true; return ;}
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 2, 0, this.input);

                throw nvae;
            }

            switch (alt2) {
                case 1 :
                    // ../MmirScriptContent.g:148:4: ( '\\r' )? '\\n'
                    // ../MmirScriptContent.g:148:4: ( '\\r' )?
                    var alt1=2;
                    var LA1_0 = this.input.LA(1);

                    if ( (LA1_0=='\r') ) {
                        alt1=1;
                    }
                    switch (alt1) {
                        case 1 :
                            // ../MmirScriptContent.g:148:4: '\\r'
                            this.match('\r'); if (this.state.failed) return ;


                            break;

                    }

                    this.match('\n'); if (this.state.failed) return ;


                    break;
                case 2 :
                    // ../MmirScriptContent.g:149:4: '\\r'
                    this.match('\r'); if (this.state.failed) return ;


                    break;
                case 3 :
                    // ../MmirScriptContent.g:150:4: '\\u2028'
                    this.match('\u2028'); if (this.state.failed) return ;


                    break;
                case 4 :
                    // ../MmirScriptContent.g:151:4: '\\u2029'
                    this.match('\u2029'); if (this.state.failed) return ;


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
            // ../MmirScriptContent.g:155:5: ( ( ' ' | '\\t' | NL ) )
            // ../MmirScriptContent.g:155:7: ( ' ' | '\\t' | NL )
            // ../MmirScriptContent.g:155:7: ( ' ' | '\\t' | NL )
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
                if (this.state.backtracking>0) {this.state.failed=true; return ;}
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 3, 0, this.input);

                throw nvae;
            }

            switch (alt3) {
                case 1 :
                    // ../MmirScriptContent.g:155:8: ' '
                    this.match(' '); if (this.state.failed) return ;


                    break;
                case 2 :
                    // ../MmirScriptContent.g:155:12: '\\t'
                    this.match('\t'); if (this.state.failed) return ;


                    break;
                case 3 :
                    // ../MmirScriptContent.g:155:18: NL
                    this.mNL(); if (this.state.failed) return ;


                    break;

            }

            if ( this.state.backtracking===0 ) {
              _channel=HIDDEN;
            }



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
            // ../MmirScriptContent.g:157:6: (~ ( '\\n' | '\\r' ) )
            // ../MmirScriptContent.g:157:8: ~ ( '\\n' | '\\r' )
            if ( (this.input.LA(1)>='\u0000' && this.input.LA(1)<='\t')||(this.input.LA(1)>='\u000B' && this.input.LA(1)<='\f')||(this.input.LA(1)>='\u000E' && this.input.LA(1)<='\uFFFF') ) {
                this.input.consume();
            this.state.failed=false;
            }
            else {
                if (this.state.backtracking>0) {this.state.failed=true; return ;}
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
            // ../MmirScriptContent.g:160:5: ( '@*' ( options {greedy=false; } : . )* '*@' )
            // ../MmirScriptContent.g:164:6: '@*' ( options {greedy=false; } : . )* '*@'
            this.match("@*"); if (this.state.failed) return ;

            // ../MmirScriptContent.g:164:11: ( options {greedy=false; } : . )*
            loop4:
            do {
                var alt4=2;
                var LA4_0 = this.input.LA(1);

                if ( (LA4_0=='*') ) {
                    var LA4_1 = this.input.LA(2);

                    if ( (LA4_1=='@') ) {
                        alt4=2;
                    }
                    else if ( ((LA4_1>='\u0000' && LA4_1<='?')||(LA4_1>='A' && LA4_1<='\uFFFF')) ) {
                        alt4=1;
                    }


                }
                else if ( ((LA4_0>='\u0000' && LA4_0<=')')||(LA4_0>='+' && LA4_0<='\uFFFF')) ) {
                    alt4=1;
                }


                switch (alt4) {
                case 1 :
                    // ../MmirScriptContent.g:164:39: .
                    this.matchAny(); if (this.state.failed) return ;


                    break;

                default :
                    break loop4;
                }
            } while (true);

            this.match("*@"); if (this.state.failed) return ;

            if ( this.state.backtracking===0 ) {
              _channel=HIDDEN;
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
            // ../MmirScriptContent.g:169:5: ( '\"' ( options {greedy=false; } : ( ( EscapeExit )=> EscapeExit | ( DoExit )=> DoExit | ESC_SEQ | ~ ( '\\\\' | '\"' ) ) )* '\"' )
            // ../MmirScriptContent.g:169:8: '\"' ( options {greedy=false; } : ( ( EscapeExit )=> EscapeExit | ( DoExit )=> DoExit | ESC_SEQ | ~ ( '\\\\' | '\"' ) ) )* '\"'
            this.match('\"'); if (this.state.failed) return ;
            // ../MmirScriptContent.g:169:12: ( options {greedy=false; } : ( ( EscapeExit )=> EscapeExit | ( DoExit )=> DoExit | ESC_SEQ | ~ ( '\\\\' | '\"' ) ) )*
            loop6:
            do {
                var alt6=2;
                var LA6_0 = this.input.LA(1);

                if ( (LA6_0=='\"') ) {
                    alt6=2;
                }
                else if ( ((LA6_0>='\u0000' && LA6_0<='!')||(LA6_0>='#' && LA6_0<='\uFFFF')) ) {
                    alt6=1;
                }


                switch (alt6) {
                case 1 :
                    // ../MmirScriptContent.g:169:39: ( ( EscapeExit )=> EscapeExit | ( DoExit )=> DoExit | ESC_SEQ | ~ ( '\\\\' | '\"' ) )
                    // ../MmirScriptContent.g:169:39: ( ( EscapeExit )=> EscapeExit | ( DoExit )=> DoExit | ESC_SEQ | ~ ( '\\\\' | '\"' ) )
                    var alt5=4;
                    var LA5_0 = this.input.LA(1);

                    if ( (LA5_0=='}') ) {
                        var LA5_1 = this.input.LA(2);

                        if ( (LA5_1=='@') ) {
                            var LA5_4 = this.input.LA(3);

                            if ( (LA5_4=='@') && (this.synpred1_MmirScriptContent())) {
                                alt5=1;
                            }
                            else if ( (this.synpred2_MmirScriptContent()) ) {
                                alt5=2;
                            }
                            else if ( (true) ) {
                                alt5=4;
                            }
                            else {
                                if (this.state.backtracking>0) {this.state.failed=true; return ;}
                                var nvae =
                                    new org.antlr.runtime.NoViableAltException("", 5, 4, this.input);

                                throw nvae;
                            }
                        }
                        else if ( ((LA5_1>='\u0000' && LA5_1<='?')||(LA5_1>='A' && LA5_1<='\uFFFF')) ) {
                            alt5=4;
                        }
                        else {
                            if (this.state.backtracking>0) {this.state.failed=true; return ;}
                            var nvae =
                                new org.antlr.runtime.NoViableAltException("", 5, 1, this.input);

                            throw nvae;
                        }
                    }
                    else if ( (LA5_0=='\\') ) {
                        alt5=3;
                    }
                    else if ( ((LA5_0>='\u0000' && LA5_0<='!')||(LA5_0>='#' && LA5_0<='[')||(LA5_0>=']' && LA5_0<='|')||(LA5_0>='~' && LA5_0<='\uFFFF')) ) {
                        alt5=4;
                    }
                    else {
                        if (this.state.backtracking>0) {this.state.failed=true; return ;}
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 5, 0, this.input);

                        throw nvae;
                    }
                    switch (alt5) {
                        case 1 :
                            // ../MmirScriptContent.g:169:40: ( EscapeExit )=> EscapeExit
                            this.mEscapeExit(); if (this.state.failed) return ;


                            break;
                        case 2 :
                            // ../MmirScriptContent.g:169:67: ( DoExit )=> DoExit
                            this.mDoExit(); if (this.state.failed) return ;


                            break;
                        case 3 :
                            // ../MmirScriptContent.g:169:86: ESC_SEQ
                            this.mESC_SEQ(); if (this.state.failed) return ;


                            break;
                        case 4 :
                            // ../MmirScriptContent.g:169:96: ~ ( '\\\\' | '\"' )
                            if ( (this.input.LA(1)>='\u0000' && this.input.LA(1)<='!')||(this.input.LA(1)>='#' && this.input.LA(1)<='[')||(this.input.LA(1)>=']' && this.input.LA(1)<='\uFFFF') ) {
                                this.input.consume();
                            this.state.failed=false;
                            }
                            else {
                                if (this.state.backtracking>0) {this.state.failed=true; return ;}
                                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                                this.recover(mse);
                                throw mse;}



                            break;

                    }



                    break;

                default :
                    break loop6;
                }
            } while (true);

            this.match('\"'); if (this.state.failed) return ;



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
            // ../MmirScriptContent.g:173:5: ( '\\'' ( options {greedy=false; } : ( ( EscapeExit )=> EscapeExit | ( DoExit )=> DoExit | ESC_SEQ | ~ ( '\\\\' | '\\'' ) ) )* '\\'' )
            // ../MmirScriptContent.g:173:8: '\\'' ( options {greedy=false; } : ( ( EscapeExit )=> EscapeExit | ( DoExit )=> DoExit | ESC_SEQ | ~ ( '\\\\' | '\\'' ) ) )* '\\''
            this.match('\''); if (this.state.failed) return ;
            // ../MmirScriptContent.g:173:13: ( options {greedy=false; } : ( ( EscapeExit )=> EscapeExit | ( DoExit )=> DoExit | ESC_SEQ | ~ ( '\\\\' | '\\'' ) ) )*
            loop8:
            do {
                var alt8=2;
                var LA8_0 = this.input.LA(1);

                if ( (LA8_0=='\'') ) {
                    alt8=2;
                }
                else if ( ((LA8_0>='\u0000' && LA8_0<='&')||(LA8_0>='(' && LA8_0<='\uFFFF')) ) {
                    alt8=1;
                }


                switch (alt8) {
                case 1 :
                    // ../MmirScriptContent.g:173:40: ( ( EscapeExit )=> EscapeExit | ( DoExit )=> DoExit | ESC_SEQ | ~ ( '\\\\' | '\\'' ) )
                    // ../MmirScriptContent.g:173:40: ( ( EscapeExit )=> EscapeExit | ( DoExit )=> DoExit | ESC_SEQ | ~ ( '\\\\' | '\\'' ) )
                    var alt7=4;
                    var LA7_0 = this.input.LA(1);

                    if ( (LA7_0=='}') ) {
                        var LA7_1 = this.input.LA(2);

                        if ( (LA7_1=='@') ) {
                            var LA7_4 = this.input.LA(3);

                            if ( (LA7_4=='@') && (this.synpred3_MmirScriptContent())) {
                                alt7=1;
                            }
                            else if ( (this.synpred4_MmirScriptContent()) ) {
                                alt7=2;
                            }
                            else if ( (true) ) {
                                alt7=4;
                            }
                            else {
                                if (this.state.backtracking>0) {this.state.failed=true; return ;}
                                var nvae =
                                    new org.antlr.runtime.NoViableAltException("", 7, 4, this.input);

                                throw nvae;
                            }
                        }
                        else if ( ((LA7_1>='\u0000' && LA7_1<='?')||(LA7_1>='A' && LA7_1<='\uFFFF')) ) {
                            alt7=4;
                        }
                        else {
                            if (this.state.backtracking>0) {this.state.failed=true; return ;}
                            var nvae =
                                new org.antlr.runtime.NoViableAltException("", 7, 1, this.input);

                            throw nvae;
                        }
                    }
                    else if ( (LA7_0=='\\') ) {
                        alt7=3;
                    }
                    else if ( ((LA7_0>='\u0000' && LA7_0<='&')||(LA7_0>='(' && LA7_0<='[')||(LA7_0>=']' && LA7_0<='|')||(LA7_0>='~' && LA7_0<='\uFFFF')) ) {
                        alt7=4;
                    }
                    else {
                        if (this.state.backtracking>0) {this.state.failed=true; return ;}
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 7, 0, this.input);

                        throw nvae;
                    }
                    switch (alt7) {
                        case 1 :
                            // ../MmirScriptContent.g:173:41: ( EscapeExit )=> EscapeExit
                            this.mEscapeExit(); if (this.state.failed) return ;


                            break;
                        case 2 :
                            // ../MmirScriptContent.g:173:68: ( DoExit )=> DoExit
                            this.mDoExit(); if (this.state.failed) return ;


                            break;
                        case 3 :
                            // ../MmirScriptContent.g:173:87: ESC_SEQ
                            this.mESC_SEQ(); if (this.state.failed) return ;


                            break;
                        case 4 :
                            // ../MmirScriptContent.g:173:97: ~ ( '\\\\' | '\\'' )
                            if ( (this.input.LA(1)>='\u0000' && this.input.LA(1)<='&')||(this.input.LA(1)>='(' && this.input.LA(1)<='[')||(this.input.LA(1)>=']' && this.input.LA(1)<='\uFFFF') ) {
                                this.input.consume();
                            this.state.failed=false;
                            }
                            else {
                                if (this.state.backtracking>0) {this.state.failed=true; return ;}
                                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                                this.recover(mse);
                                throw mse;}



                            break;

                    }



                    break;

                default :
                    break loop8;
                }
            } while (true);

            this.match('\''); if (this.state.failed) return ;



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
            // ../MmirScriptContent.g:177:11: ( ( '0' .. '9' | 'a' .. 'f' | 'A' .. 'F' ) )
            // ../MmirScriptContent.g:177:13: ( '0' .. '9' | 'a' .. 'f' | 'A' .. 'F' )
            if ( (this.input.LA(1)>='0' && this.input.LA(1)<='9')||(this.input.LA(1)>='A' && this.input.LA(1)<='F')||(this.input.LA(1)>='a' && this.input.LA(1)<='f') ) {
                this.input.consume();
            this.state.failed=false;
            }
            else {
                if (this.state.backtracking>0) {this.state.failed=true; return ;}
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
            // ../MmirScriptContent.g:181:5: ( '\\\\' ( 'b' | 't' | 'n' | 'f' | 'r' | '\\\"' | '\\'' | '\\\\' ) | UNICODE_ESC | OCTAL_ESC )
            var alt9=3;
            var LA9_0 = this.input.LA(1);

            if ( (LA9_0=='\\') ) {
                switch ( this.input.LA(2) ) {
                case '\"':
                case '\'':
                case '\\':
                case 'b':
                case 'f':
                case 'n':
                case 'r':
                case 't':
                    alt9=1;
                    break;
                case 'u':
                    alt9=2;
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                    alt9=3;
                    break;
                default:
                    if (this.state.backtracking>0) {this.state.failed=true; return ;}
                    var nvae =
                        new org.antlr.runtime.NoViableAltException("", 9, 1, this.input);

                    throw nvae;
                }

            }
            else {
                if (this.state.backtracking>0) {this.state.failed=true; return ;}
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 9, 0, this.input);

                throw nvae;
            }
            switch (alt9) {
                case 1 :
                    // ../MmirScriptContent.g:181:9: '\\\\' ( 'b' | 't' | 'n' | 'f' | 'r' | '\\\"' | '\\'' | '\\\\' )
                    this.match('\\'); if (this.state.failed) return ;
                    if ( this.input.LA(1)=='\"'||this.input.LA(1)=='\''||this.input.LA(1)=='\\'||this.input.LA(1)=='b'||this.input.LA(1)=='f'||this.input.LA(1)=='n'||this.input.LA(1)=='r'||this.input.LA(1)=='t' ) {
                        this.input.consume();
                    this.state.failed=false;
                    }
                    else {
                        if (this.state.backtracking>0) {this.state.failed=true; return ;}
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        this.recover(mse);
                        throw mse;}



                    break;
                case 2 :
                    // ../MmirScriptContent.g:182:9: UNICODE_ESC
                    this.mUNICODE_ESC(); if (this.state.failed) return ;


                    break;
                case 3 :
                    // ../MmirScriptContent.g:183:9: OCTAL_ESC
                    this.mOCTAL_ESC(); if (this.state.failed) return ;


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
            // ../MmirScriptContent.g:188:5: ( '\\\\' ( '0' .. '3' ) ( '0' .. '7' ) ( '0' .. '7' ) | '\\\\' ( '0' .. '7' ) ( '0' .. '7' ) | '\\\\' ( '0' .. '7' ) )
            var alt10=3;
            var LA10_0 = this.input.LA(1);

            if ( (LA10_0=='\\') ) {
                var LA10_1 = this.input.LA(2);

                if ( ((LA10_1>='0' && LA10_1<='3')) ) {
                    var LA10_2 = this.input.LA(3);

                    if ( ((LA10_2>='0' && LA10_2<='7')) ) {
                        var LA10_4 = this.input.LA(4);

                        if ( ((LA10_4>='0' && LA10_4<='7')) ) {
                            alt10=1;
                        }
                        else {
                            alt10=2;}
                    }
                    else {
                        alt10=3;}
                }
                else if ( ((LA10_1>='4' && LA10_1<='7')) ) {
                    var LA10_3 = this.input.LA(3);

                    if ( ((LA10_3>='0' && LA10_3<='7')) ) {
                        alt10=2;
                    }
                    else {
                        alt10=3;}
                }
                else {
                    if (this.state.backtracking>0) {this.state.failed=true; return ;}
                    var nvae =
                        new org.antlr.runtime.NoViableAltException("", 10, 1, this.input);

                    throw nvae;
                }
            }
            else {
                if (this.state.backtracking>0) {this.state.failed=true; return ;}
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 10, 0, this.input);

                throw nvae;
            }
            switch (alt10) {
                case 1 :
                    // ../MmirScriptContent.g:188:9: '\\\\' ( '0' .. '3' ) ( '0' .. '7' ) ( '0' .. '7' )
                    this.match('\\'); if (this.state.failed) return ;
                    // ../MmirScriptContent.g:188:14: ( '0' .. '3' )
                    // ../MmirScriptContent.g:188:15: '0' .. '3'
                    this.matchRange('0','3'); if (this.state.failed) return ;



                    // ../MmirScriptContent.g:188:25: ( '0' .. '7' )
                    // ../MmirScriptContent.g:188:26: '0' .. '7'
                    this.matchRange('0','7'); if (this.state.failed) return ;



                    // ../MmirScriptContent.g:188:36: ( '0' .. '7' )
                    // ../MmirScriptContent.g:188:37: '0' .. '7'
                    this.matchRange('0','7'); if (this.state.failed) return ;





                    break;
                case 2 :
                    // ../MmirScriptContent.g:189:9: '\\\\' ( '0' .. '7' ) ( '0' .. '7' )
                    this.match('\\'); if (this.state.failed) return ;
                    // ../MmirScriptContent.g:189:14: ( '0' .. '7' )
                    // ../MmirScriptContent.g:189:15: '0' .. '7'
                    this.matchRange('0','7'); if (this.state.failed) return ;



                    // ../MmirScriptContent.g:189:25: ( '0' .. '7' )
                    // ../MmirScriptContent.g:189:26: '0' .. '7'
                    this.matchRange('0','7'); if (this.state.failed) return ;





                    break;
                case 3 :
                    // ../MmirScriptContent.g:190:9: '\\\\' ( '0' .. '7' )
                    this.match('\\'); if (this.state.failed) return ;
                    // ../MmirScriptContent.g:190:14: ( '0' .. '7' )
                    // ../MmirScriptContent.g:190:15: '0' .. '7'
                    this.matchRange('0','7'); if (this.state.failed) return ;





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
            // ../MmirScriptContent.g:195:5: ( '\\\\' 'u' HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT )
            // ../MmirScriptContent.g:195:9: '\\\\' 'u' HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT
            this.match('\\'); if (this.state.failed) return ;
            this.match('u'); if (this.state.failed) return ;
            this.mHEX_DIGIT(); if (this.state.failed) return ;
            this.mHEX_DIGIT(); if (this.state.failed) return ;
            this.mHEX_DIGIT(); if (this.state.failed) return ;
            this.mHEX_DIGIT(); if (this.state.failed) return ;



        }
        finally {
        }
    },
    // $ANTLR end "UNICODE_ESC",

    // $ANTLR start ScriptVar
    mScriptVar: function()  {
        try {
            var _type = this.ScriptVar;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            var theText;

            // ../MmirScriptContent.g:199:11: ( '@' (theText=~ ( '\\t' | ' ' | '(' | ')' | '[' | ']' | '{' | '}' | '\\r' | '\\n' ) )+ )
            // ../MmirScriptContent.g:199:14: '@' (theText=~ ( '\\t' | ' ' | '(' | ')' | '[' | ']' | '{' | '}' | '\\r' | '\\n' ) )+
            this.match('@'); if (this.state.failed) return ;
            // ../MmirScriptContent.g:199:25: (theText=~ ( '\\t' | ' ' | '(' | ')' | '[' | ']' | '{' | '}' | '\\r' | '\\n' ) )+
            var cnt11=0;
            loop11:
            do {
                var alt11=2;
                var LA11_0 = this.input.LA(1);

                if ( ((LA11_0>='\u0000' && LA11_0<='\b')||(LA11_0>='\u000B' && LA11_0<='\f')||(LA11_0>='\u000E' && LA11_0<='\u001F')||(LA11_0>='!' && LA11_0<='\'')||(LA11_0>='*' && LA11_0<='Z')||LA11_0=='\\'||(LA11_0>='^' && LA11_0<='z')||LA11_0=='|'||(LA11_0>='~' && LA11_0<='\uFFFF')) ) {
                    alt11=1;
                }


                switch (alt11) {
                case 1 :
                    // ../MmirScriptContent.g:199:25: theText=~ ( '\\t' | ' ' | '(' | ')' | '[' | ']' | '{' | '}' | '\\r' | '\\n' )
                    theText= this.input.LA(1);
                    if ( (this.input.LA(1)>='\u0000' && this.input.LA(1)<='\b')||(this.input.LA(1)>='\u000B' && this.input.LA(1)<='\f')||(this.input.LA(1)>='\u000E' && this.input.LA(1)<='\u001F')||(this.input.LA(1)>='!' && this.input.LA(1)<='\'')||(this.input.LA(1)>='*' && this.input.LA(1)<='Z')||this.input.LA(1)=='\\'||(this.input.LA(1)>='^' && this.input.LA(1)<='z')||this.input.LA(1)=='|'||(this.input.LA(1)>='~' && this.input.LA(1)<='\uFFFF') ) {
                        this.input.consume();
                    this.state.failed=false;
                    }
                    else {
                        if (this.state.backtracking>0) {this.state.failed=true; return ;}
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        this.recover(mse);
                        throw mse;}



                    break;

                default :
                    if ( cnt11 >= 1 ) {
                        break loop11;
                    }
                    if (this.state.backtracking>0) {this.state.failed=true; return ;}
                        var eee = new org.antlr.runtime.EarlyExitException(11, this.input);
                        throw eee;
                }
                cnt11++;
            } while (true);

            if ( this.state.backtracking===0 ) {
              _channel=HIDDEN;
            }



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "ScriptVar",

    mTokens: function() {
        // ../MmirScriptContent.g:1:8: ( T__33 | EscapeExit | DoEnterBlock | DoEnterYieldContent | DoEnterRender | DoEnterIfStatement | DoEnterElseStatement | DoEnterForStatement | DoExit | NL | WS | CHAR | COMMENT | STRING | SSTRING | ScriptVar )
        var alt12=16;
        alt12 = this.dfa12.predict(this.input);
        switch (alt12) {
            case 1 :
                // ../MmirScriptContent.g:1:10: T__33
                this.mT__33(); if (this.state.failed) return ;


                break;
            case 2 :
                // ../MmirScriptContent.g:1:16: EscapeExit
                this.mEscapeExit(); if (this.state.failed) return ;


                break;
            case 3 :
                // ../MmirScriptContent.g:1:27: DoEnterBlock
                this.mDoEnterBlock(); if (this.state.failed) return ;


                break;
            case 4 :
                // ../MmirScriptContent.g:1:40: DoEnterYieldContent
                this.mDoEnterYieldContent(); if (this.state.failed) return ;


                break;
            case 5 :
                // ../MmirScriptContent.g:1:60: DoEnterRender
                this.mDoEnterRender(); if (this.state.failed) return ;


                break;
            case 6 :
                // ../MmirScriptContent.g:1:74: DoEnterIfStatement
                this.mDoEnterIfStatement(); if (this.state.failed) return ;


                break;
            case 7 :
                // ../MmirScriptContent.g:1:93: DoEnterElseStatement
                this.mDoEnterElseStatement(); if (this.state.failed) return ;


                break;
            case 8 :
                // ../MmirScriptContent.g:1:114: DoEnterForStatement
                this.mDoEnterForStatement(); if (this.state.failed) return ;


                break;
            case 9 :
                // ../MmirScriptContent.g:1:134: DoExit
                this.mDoExit(); if (this.state.failed) return ;


                break;
            case 10 :
                // ../MmirScriptContent.g:1:141: NL
                this.mNL(); if (this.state.failed) return ;


                break;
            case 11 :
                // ../MmirScriptContent.g:1:144: WS
                this.mWS(); if (this.state.failed) return ;


                break;
            case 12 :
                // ../MmirScriptContent.g:1:147: CHAR
                this.mCHAR(); if (this.state.failed) return ;


                break;
            case 13 :
                // ../MmirScriptContent.g:1:152: COMMENT
                this.mCOMMENT(); if (this.state.failed) return ;


                break;
            case 14 :
                // ../MmirScriptContent.g:1:160: STRING
                this.mSTRING(); if (this.state.failed) return ;


                break;
            case 15 :
                // ../MmirScriptContent.g:1:167: SSTRING
                this.mSSTRING(); if (this.state.failed) return ;


                break;
            case 16 :
                // ../MmirScriptContent.g:1:175: ScriptVar
                this.mScriptVar(); if (this.state.failed) return ;


                break;

        }

    },

    // $ANTLR start "synpred1_MmirScriptContent"
    synpred1_MmirScriptContent_fragment: function() {
        // ../MmirScriptContent.g:169:40: ( EscapeExit )
        // ../MmirScriptContent.g:169:41: EscapeExit
        this.mEscapeExit(); if (this.state.failed) return ;


    },
    // $ANTLR end "synpred1_MmirScriptContent",

    // $ANTLR start "synpred2_MmirScriptContent"
    synpred2_MmirScriptContent_fragment: function() {
        // ../MmirScriptContent.g:169:67: ( DoExit )
        // ../MmirScriptContent.g:169:68: DoExit
        this.mDoExit(); if (this.state.failed) return ;


    },
    // $ANTLR end "synpred2_MmirScriptContent",

    // $ANTLR start "synpred3_MmirScriptContent"
    synpred3_MmirScriptContent_fragment: function() {
        // ../MmirScriptContent.g:173:41: ( EscapeExit )
        // ../MmirScriptContent.g:173:42: EscapeExit
        this.mEscapeExit(); if (this.state.failed) return ;


    },
    // $ANTLR end "synpred3_MmirScriptContent",

    // $ANTLR start "synpred4_MmirScriptContent"
    synpred4_MmirScriptContent_fragment: function() {
        // ../MmirScriptContent.g:173:68: ( DoExit )
        // ../MmirScriptContent.g:173:69: DoExit
        this.mDoExit(); if (this.state.failed) return ;


    },
    // $ANTLR end "synpred4_MmirScriptContent"

    synpred3_MmirScriptContent: function() {
        this.state.backtracking++;
        var start = this.input.mark();
        try {
            this.synpred3_MmirScriptContent_fragment(); // can never throw exception
        } catch (re) {
            alert("impossible: "+re.toString());
        }
        var success = !this.state.failed;
        this.input.rewind(start);
        this.state.backtracking--;
        this.state.failed=false;
        return success;
    },
    synpred1_MmirScriptContent: function() {
        this.state.backtracking++;
        var start = this.input.mark();
        try {
            this.synpred1_MmirScriptContent_fragment(); // can never throw exception
        } catch (re) {
            alert("impossible: "+re.toString());
        }
        var success = !this.state.failed;
        this.input.rewind(start);
        this.state.backtracking--;
        this.state.failed=false;
        return success;
    },
    synpred2_MmirScriptContent: function() {
        this.state.backtracking++;
        var start = this.input.mark();
        try {
            this.synpred2_MmirScriptContent_fragment(); // can never throw exception
        } catch (re) {
            alert("impossible: "+re.toString());
        }
        var success = !this.state.failed;
        this.input.rewind(start);
        this.state.backtracking--;
        this.state.failed=false;
        return success;
    },
    synpred4_MmirScriptContent: function() {
        this.state.backtracking++;
        var start = this.input.mark();
        try {
            this.synpred4_MmirScriptContent_fragment(); // can never throw exception
        } catch (re) {
            alert("impossible: "+re.toString());
        }
        var success = !this.state.failed;
        this.input.rewind(start);
        this.state.backtracking--;
        this.state.failed=false;
        return success;
    }
}, true); // important to pass true to overwrite default implementations

org.antlr.lang.augmentObject(MmirScriptContentLexer, {
    DFA12_eotS:
        "\u0002\uffff\u0002\u000c\u0001\u0017\u0005\uffff\u0002\u000c\u0002"+
    "\uffff\u0001\u001c\u0001\uffff\u0006\u0016\u0007\uffff\u0007\u0016\u0001"+
    "\uffff\u0002\u0016\u0001\uffff\u0002\u0016\u0001\u0024\u0002\u0016\u0001"+
    "\u0031\u0001\uffff\u0002\u0016\u0001\uffff\u0003\u0016\u0001\uffff\u0003"+
    "\u0016\u0001\uffff",
    DFA12_eofS:
        "\u003a\uffff",
    DFA12_minS:
        "\u0001\u0000\u0001\uffff\u0001\u0040\u0001\u0000\u0001\u000a\u0005"+
    "\uffff\u0002\u0000\u0002\uffff\u0001\u0040\u0001\uffff\u0001\u006f\u0001"+
    "\u0065\u0001\u0066\u0001\u006c\u0001\u006f\u0001\u0000\u0007\uffff\u0002"+
    "\u006e\u0001\u0028\u0001\u0073\u0001\u0072\u0002\u0000\u0001\uffff\u0001"+
    "\u0074\u0001\u0064\u0001\uffff\u0001\u0065\u0001\u0028\u0001\u0000\u0002"+
    "\u0065\u0001\u0000\u0001\uffff\u0001\u006e\u0001\u0072\u0001\uffff\u0001"+
    "\u0074\u0001\u0028\u0001\u0046\u0001\uffff\u0001\u006f\u0001\u0072\u0001"+
    "\u0028\u0001\uffff",
    DFA12_maxS:
        "\u0001\uffff\u0001\uffff\u0001\u0040\u0001\uffff\u0001\u000a\u0005"+
    "\uffff\u0002\uffff\u0002\uffff\u0001\u0040\u0001\uffff\u0001\u006f\u0001"+
    "\u0065\u0001\u0066\u0001\u006c\u0001\u006f\u0001\uffff\u0007\uffff\u0002"+
    "\u006e\u0001\u0028\u0001\u0073\u0001\u0072\u0002\uffff\u0001\uffff\u0001"+
    "\u0074\u0001\u0064\u0001\uffff\u0001\u0065\u0001\u0028\u0001\uffff\u0002"+
    "\u0065\u0001\uffff\u0001\uffff\u0001\u006e\u0001\u0072\u0001\uffff\u0001"+
    "\u0074\u0001\u0028\u0001\u0046\u0001\uffff\u0001\u006f\u0001\u0072\u0001"+
    "\u0028\u0001\uffff",
    DFA12_acceptS:
        "\u0001\uffff\u0001\u0001\u0003\uffff\u0003\u000a\u0002\u000b\u0002"+
    "\uffff\u0001\u000c\u0001\u0001\u0001\uffff\u0001\u0003\u0006\uffff\u0001"+
    "\u0010\u0001\u000a\u0001\u000b\u0001\u000e\u0001\u000f\u0001\u0002\u0001"+
    "\u0009\u0007\uffff\u0001\u000d\u0002\uffff\u0001\u0006\u0006\uffff\u0001"+
    "\u0008\u0002\uffff\u0001\u0007\u0003\uffff\u0001\u0005\u0003\uffff\u0001"+
    "\u0004",
    DFA12_specialS:
        "\u0001\u0006\u0002\uffff\u0001\u0007\u0006\uffff\u0001\u0008\u0001"+
    "\u0000\u0009\uffff\u0001\u0005\u000c\uffff\u0001\u0001\u0001\u0003\u0006"+
    "\uffff\u0001\u0002\u0002\uffff\u0001\u0004\u000c\uffff}>",
    DFA12_transitionS: [
            "\u0009\u000c\u0001\u0009\u0001\u0005\u0002\u000c\u0001\u0004"+
            "\u0012\u000c\u0001\u0008\u0001\u000c\u0001\u000a\u0004\u000c"+
            "\u0001\u000b\u0018\u000c\u0001\u0003\u003a\u000c\u0001\u0001"+
            "\u0001\u000c\u0001\u0002\u1faa\u000c\u0001\u0006\u0001\u0007"+
            "\udfd6\u000c",
            "",
            "\u0001\u000e",
            "\u0009\u0016\u0002\uffff\u0002\u0016\u0001\uffff\u0012\u0016"+
            "\u0001\uffff\u0007\u0016\u0002\uffff\u0001\u0015\u0030\u0016"+
            "\u0001\uffff\u0001\u0016\u0001\uffff\u0005\u0016\u0001\u0010"+
            "\u0001\u0016\u0001\u0013\u0001\u0014\u0002\u0016\u0001\u0012"+
            "\u0008\u0016\u0001\u0011\u0008\u0016\u0001\u000f\u0001\u0016"+
            "\u0001\uffff\uff82\u0016",
            "\u0001\u0005",
            "",
            "",
            "",
            "",
            "",
            "\u0000\u0019",
            "\u0000\u001a",
            "",
            "",
            "\u0001\u001b",
            "",
            "\u0001\u001d",
            "\u0001\u001e",
            "\u0001\u001f",
            "\u0001\u0020",
            "\u0001\u0021",
            "\u0009\u0023\u0002\u0024\u0002\u0023\u0001\u0024\u0012\u0023"+
            "\u0001\u0024\u0007\u0023\u0002\u0024\u0001\u0022\u0030\u0023"+
            "\u0001\u0024\u0001\u0023\u0001\u0024\u001d\u0023\u0001\u0024"+
            "\u0001\u0023\u0001\u0024\uff82\u0023",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "\u0001\u0025",
            "\u0001\u0026",
            "\u0001\u0027",
            "\u0001\u0028",
            "\u0001\u0029",
            "\u0009\u0023\u0002\u0024\u0002\u0023\u0001\u0024\u0012\u0023"+
            "\u0001\u0024\u0007\u0023\u0002\u0024\u0001\u0022\u0015\u0023"+
            "\u0001\u002a\u001a\u0023\u0001\u0024\u0001\u0023\u0001\u0024"+
            "\u001d\u0023\u0001\u0024\u0001\u0023\u0001\u0024\uff82\u0023",
            "\u0009\u0023\u0002\u0024\u0002\u0023\u0001\u0024\u0012\u0023"+
            "\u0001\u0024\u0007\u0023\u0002\u0024\u0001\u0022\u0030\u0023"+
            "\u0001\u0024\u0001\u0023\u0001\u0024\u001d\u0023\u0001\u0024"+
            "\u0001\u0023\u0001\u0024\uff82\u0023",
            "",
            "\u0001\u002b",
            "\u0001\u002c",
            "",
            "\u0001\u002d",
            "\u0001\u002e",
            "\u0009\u0023\u0002\uffff\u0002\u0023\u0001\uffff\u0012\u0023"+
            "\u0001\uffff\u0007\u0023\u0002\uffff\u0001\u0022\u0030\u0023"+
            "\u0001\uffff\u0001\u0023\u0001\uffff\u001d\u0023\u0001\uffff"+
            "\u0001\u0023\u0001\uffff\uff82\u0023",
            "\u0001\u002f",
            "\u0001\u0030",
            "\u0009\u0016\u0002\uffff\u0002\u0016\u0001\uffff\u0012\u0016"+
            "\u0001\uffff\u0007\u0016\u0002\uffff\u0031\u0016\u0001\uffff"+
            "\u0001\u0016\u0001\uffff\u001d\u0016\u0001\uffff\u0001\u0016"+
            "\u0001\uffff\uff82\u0016",
            "",
            "\u0001\u0032",
            "\u0001\u0033",
            "",
            "\u0001\u0034",
            "\u0001\u0035",
            "\u0001\u0036",
            "",
            "\u0001\u0037",
            "\u0001\u0038",
            "\u0001\u0039",
            ""
    ]
});

org.antlr.lang.augmentObject(MmirScriptContentLexer, {
    DFA12_eot:
        org.antlr.runtime.DFA.unpackEncodedString(MmirScriptContentLexer.DFA12_eotS),
    DFA12_eof:
        org.antlr.runtime.DFA.unpackEncodedString(MmirScriptContentLexer.DFA12_eofS),
    DFA12_min:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(MmirScriptContentLexer.DFA12_minS),
    DFA12_max:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(MmirScriptContentLexer.DFA12_maxS),
    DFA12_accept:
        org.antlr.runtime.DFA.unpackEncodedString(MmirScriptContentLexer.DFA12_acceptS),
    DFA12_special:
        org.antlr.runtime.DFA.unpackEncodedString(MmirScriptContentLexer.DFA12_specialS),
    DFA12_transition: (function() {
        var a = [],
            i,
            numStates = MmirScriptContentLexer.DFA12_transitionS.length;
        for (i=0; i<numStates; i++) {
            a.push(org.antlr.runtime.DFA.unpackEncodedString(MmirScriptContentLexer.DFA12_transitionS[i]));
        }
        return a;
    })()
});

MmirScriptContentLexer.DFA12 = function(recognizer) {
    this.recognizer = recognizer;
    this.decisionNumber = 12;
    this.eot = MmirScriptContentLexer.DFA12_eot;
    this.eof = MmirScriptContentLexer.DFA12_eof;
    this.min = MmirScriptContentLexer.DFA12_min;
    this.max = MmirScriptContentLexer.DFA12_max;
    this.accept = MmirScriptContentLexer.DFA12_accept;
    this.special = MmirScriptContentLexer.DFA12_special;
    this.transition = MmirScriptContentLexer.DFA12_transition;
};

org.antlr.lang.extend(MmirScriptContentLexer.DFA12, org.antlr.runtime.DFA, {
    getDescription: function() {
        return "1:1: Tokens : ( T__33 | EscapeExit | DoEnterBlock | DoEnterYieldContent | DoEnterRender | DoEnterIfStatement | DoEnterElseStatement | DoEnterForStatement | DoExit | NL | WS | CHAR | COMMENT | STRING | SSTRING | ScriptVar );";
    },
    specialStateTransition: function(s, input) {
        var _s = s;
        /* bind to recognizer so semantic predicates can be evaluated */
        var retval = (function(s, input) {
            switch ( s ) {
                        case 0 : 
                            var LA12_11 = input.LA(1);

                            s = -1;
                            if ( ((LA12_11>='\u0000' && LA12_11<='\uFFFF')) ) {s = 26;}

                            else s = 12;

                            if ( s>=0 ) return s;
                            break;
                        case 1 : 
                            var LA12_34 = input.LA(1);

                            s = -1;
                            if ( (LA12_34=='@') ) {s = 42;}

                            else if ( (LA12_34=='*') ) {s = 34;}

                            else if ( ((LA12_34>='\u0000' && LA12_34<='\b')||(LA12_34>='\u000B' && LA12_34<='\f')||(LA12_34>='\u000E' && LA12_34<='\u001F')||(LA12_34>='!' && LA12_34<='\'')||(LA12_34>='+' && LA12_34<='?')||(LA12_34>='A' && LA12_34<='Z')||LA12_34=='\\'||(LA12_34>='^' && LA12_34<='z')||LA12_34=='|'||(LA12_34>='~' && LA12_34<='\uFFFF')) ) {s = 35;}

                            else if ( ((LA12_34>='\t' && LA12_34<='\n')||LA12_34=='\r'||LA12_34==' '||(LA12_34>='(' && LA12_34<=')')||LA12_34=='['||LA12_34==']'||LA12_34=='{'||LA12_34=='}') ) {s = 36;}

                            else s = 22;

                            if ( s>=0 ) return s;
                            break;
                        case 2 : 
                            var LA12_42 = input.LA(1);

                            s = -1;
                            if ( (LA12_42=='*') ) {s = 34;}

                            else if ( ((LA12_42>='\u0000' && LA12_42<='\b')||(LA12_42>='\u000B' && LA12_42<='\f')||(LA12_42>='\u000E' && LA12_42<='\u001F')||(LA12_42>='!' && LA12_42<='\'')||(LA12_42>='+' && LA12_42<='Z')||LA12_42=='\\'||(LA12_42>='^' && LA12_42<='z')||LA12_42=='|'||(LA12_42>='~' && LA12_42<='\uFFFF')) ) {s = 35;}

                            else s = 36;

                            if ( s>=0 ) return s;
                            break;
                        case 3 : 
                            var LA12_35 = input.LA(1);

                            s = -1;
                            if ( (LA12_35=='*') ) {s = 34;}

                            else if ( ((LA12_35>='\u0000' && LA12_35<='\b')||(LA12_35>='\u000B' && LA12_35<='\f')||(LA12_35>='\u000E' && LA12_35<='\u001F')||(LA12_35>='!' && LA12_35<='\'')||(LA12_35>='+' && LA12_35<='Z')||LA12_35=='\\'||(LA12_35>='^' && LA12_35<='z')||LA12_35=='|'||(LA12_35>='~' && LA12_35<='\uFFFF')) ) {s = 35;}

                            else if ( ((LA12_35>='\t' && LA12_35<='\n')||LA12_35=='\r'||LA12_35==' '||(LA12_35>='(' && LA12_35<=')')||LA12_35=='['||LA12_35==']'||LA12_35=='{'||LA12_35=='}') ) {s = 36;}

                            else s = 22;

                            if ( s>=0 ) return s;
                            break;
                        case 4 : 
                            var LA12_45 = input.LA(1);

                            s = -1;
                            if ( ((LA12_45>='\u0000' && LA12_45<='\b')||(LA12_45>='\u000B' && LA12_45<='\f')||(LA12_45>='\u000E' && LA12_45<='\u001F')||(LA12_45>='!' && LA12_45<='\'')||(LA12_45>='*' && LA12_45<='Z')||LA12_45=='\\'||(LA12_45>='^' && LA12_45<='z')||LA12_45=='|'||(LA12_45>='~' && LA12_45<='\uFFFF')) ) {s = 22;}

                            else s = 49;

                            if ( s>=0 ) return s;
                            break;
                        case 5 : 
                            var LA12_21 = input.LA(1);

                            s = -1;
                            if ( (LA12_21=='*') ) {s = 34;}

                            else if ( ((LA12_21>='\u0000' && LA12_21<='\b')||(LA12_21>='\u000B' && LA12_21<='\f')||(LA12_21>='\u000E' && LA12_21<='\u001F')||(LA12_21>='!' && LA12_21<='\'')||(LA12_21>='+' && LA12_21<='Z')||LA12_21=='\\'||(LA12_21>='^' && LA12_21<='z')||LA12_21=='|'||(LA12_21>='~' && LA12_21<='\uFFFF')) ) {s = 35;}

                            else if ( ((LA12_21>='\t' && LA12_21<='\n')||LA12_21=='\r'||LA12_21==' '||(LA12_21>='(' && LA12_21<=')')||LA12_21=='['||LA12_21==']'||LA12_21=='{'||LA12_21=='}') ) {s = 36;}

                            else s = 22;

                            if ( s>=0 ) return s;
                            break;
                        case 6 : 
                            var LA12_0 = input.LA(1);

                            s = -1;
                            if ( (LA12_0=='{') ) {s = 1;}

                            else if ( (LA12_0=='}') ) {s = 2;}

                            else if ( (LA12_0=='@') ) {s = 3;}

                            else if ( (LA12_0=='\r') ) {s = 4;}

                            else if ( (LA12_0=='\n') ) {s = 5;}

                            else if ( (LA12_0=='\u2028') ) {s = 6;}

                            else if ( (LA12_0=='\u2029') ) {s = 7;}

                            else if ( (LA12_0==' ') ) {s = 8;}

                            else if ( (LA12_0=='\t') ) {s = 9;}

                            else if ( (LA12_0=='\"') ) {s = 10;}

                            else if ( (LA12_0=='\'') ) {s = 11;}

                            else if ( ((LA12_0>='\u0000' && LA12_0<='\b')||(LA12_0>='\u000B' && LA12_0<='\f')||(LA12_0>='\u000E' && LA12_0<='\u001F')||LA12_0=='!'||(LA12_0>='#' && LA12_0<='&')||(LA12_0>='(' && LA12_0<='?')||(LA12_0>='A' && LA12_0<='z')||LA12_0=='|'||(LA12_0>='~' && LA12_0<='\u2027')||(LA12_0>='\u202A' && LA12_0<='\uFFFF')) ) {s = 12;}

                            if ( s>=0 ) return s;
                            break;
                        case 7 : 
                            var LA12_3 = input.LA(1);

                            s = -1;
                            if ( (LA12_3=='{') ) {s = 15;}

                            else if ( (LA12_3=='c') ) {s = 16;}

                            else if ( (LA12_3=='r') ) {s = 17;}

                            else if ( (LA12_3=='i') ) {s = 18;}

                            else if ( (LA12_3=='e') ) {s = 19;}

                            else if ( (LA12_3=='f') ) {s = 20;}

                            else if ( (LA12_3=='*') ) {s = 21;}

                            else if ( ((LA12_3>='\u0000' && LA12_3<='\b')||(LA12_3>='\u000B' && LA12_3<='\f')||(LA12_3>='\u000E' && LA12_3<='\u001F')||(LA12_3>='!' && LA12_3<='\'')||(LA12_3>='+' && LA12_3<='Z')||LA12_3=='\\'||(LA12_3>='^' && LA12_3<='b')||LA12_3=='d'||(LA12_3>='g' && LA12_3<='h')||(LA12_3>='j' && LA12_3<='q')||(LA12_3>='s' && LA12_3<='z')||LA12_3=='|'||(LA12_3>='~' && LA12_3<='\uFFFF')) ) {s = 22;}

                            else s = 12;

                            if ( s>=0 ) return s;
                            break;
                        case 8 : 
                            var LA12_10 = input.LA(1);

                            s = -1;
                            if ( ((LA12_10>='\u0000' && LA12_10<='\uFFFF')) ) {s = 25;}

                            else s = 12;

                            if ( s>=0 ) return s;
                            break;
            }
        }).call(this.recognizer, s, input);
        if (!org.antlr.lang.isUndefined(retval)) {
            return retval;
        }
        if (this.recognizer.state.backtracking>0) {this.recognizer.state.failed=true; return -1;}
        var nvae =
            new org.antlr.runtime.NoViableAltException(this.getDescription(), 12, _s, input);
        this.error(nvae);
        throw nvae;
    },
    dummy: null
});
 
})();