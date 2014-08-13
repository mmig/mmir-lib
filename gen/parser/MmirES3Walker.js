// $ANTLR 3.3 Nov 30, 2010 12:50:56 ../MmirES3Walker.g 2013-08-13 18:04:05

var MmirES3Walker = function(input, state) {
    if (!state) {
        state = new org.antlr.runtime.RecognizerSharedState();
    }

    (function(){

        	//MODIFICATION: array for tracking ampersat-Identifiers
        	this.ampersatIdentifiers = new Array();
        	this.identifiers = new Array();
        	this.varDeclarations = new Array();
        	this.varAssignments = new Array();

    }).call(this);

    MmirES3Walker.superclass.constructor.call(this, input, state);


         

    /* @todo only create adaptor if output=AST */
    this.adaptor = new org.antlr.runtime.tree.CommonTreeAdaptor();

};

org.antlr.lang.augmentObject(MmirES3Walker, {
    EOF: -1,
    RENDER: 4,
    AMPERSAT: 5,
    NULL: 6,
    TRUE: 7,
    FALSE: 8,
    BREAK: 9,
    CASE: 10,
    CATCH: 11,
    CONTINUE: 12,
    DEFAULT: 13,
    DELETE: 14,
    DO: 15,
    ELSE: 16,
    FINALLY: 17,
    FOR: 18,
    FUNCTION: 19,
    IF: 20,
    IN: 21,
    INSTANCEOF: 22,
    NEW: 23,
    RETURN: 24,
    SWITCH: 25,
    THIS: 26,
    THROW: 27,
    TRY: 28,
    TYPEOF: 29,
    VAR: 30,
    VOID: 31,
    WHILE: 32,
    WITH: 33,
    ABSTRACT: 34,
    BOOLEAN: 35,
    BYTE: 36,
    CHAR: 37,
    CLASS: 38,
    CONST: 39,
    DEBUGGER: 40,
    DOUBLE: 41,
    ENUM: 42,
    EXPORT: 43,
    EXTENDS: 44,
    FINAL: 45,
    FLOAT: 46,
    GOTO: 47,
    IMPLEMENTS: 48,
    IMPORT: 49,
    INT: 50,
    INTERFACE: 51,
    LONG: 52,
    NATIVE: 53,
    PACKAGE: 54,
    PRIVATE: 55,
    PROTECTED: 56,
    PUBLIC: 57,
    SHORT: 58,
    STATIC: 59,
    SUPER: 60,
    SYNCHRONIZED: 61,
    THROWS: 62,
    TRANSIENT: 63,
    VOLATILE: 64,
    LBRACE: 65,
    RBRACE: 66,
    LBRACK: 67,
    RBRACK: 68,
    DOT: 69,
    SEMIC: 70,
    COMMA: 71,
    LT: 72,
    GT: 73,
    LTE: 74,
    GTE: 75,
    EQ: 76,
    NEQ: 77,
    SAME: 78,
    NSAME: 79,
    ADD: 80,
    SUB: 81,
    MUL: 82,
    MOD: 83,
    INC: 84,
    DEC: 85,
    SHL: 86,
    SHR: 87,
    SHU: 88,
    AND: 89,
    OR: 90,
    XOR: 91,
    NOT: 92,
    INV: 93,
    LAND: 94,
    LOR: 95,
    QUE: 96,
    COLON: 97,
    ASSIGN: 98,
    ADDASS: 99,
    SUBASS: 100,
    MULASS: 101,
    MODASS: 102,
    SHLASS: 103,
    SHRASS: 104,
    SHUASS: 105,
    ANDASS: 106,
    ORASS: 107,
    XORASS: 108,
    DIV: 109,
    DIVASS: 110,
    ARGS: 111,
    ARRAY: 112,
    BLOCK: 113,
    BYFIELD: 114,
    BYINDEX: 115,
    CALL: 116,
    CEXPR: 117,
    EXPR: 118,
    FORITER: 119,
    FORSTEP: 120,
    ITEM: 121,
    LABELLED: 122,
    NAMEDVALUE: 123,
    NEG: 124,
    OBJECT: 125,
    PAREXPR: 126,
    PDEC: 127,
    PINC: 128,
    POS: 129,
    BSLASH: 130,
    DQUOTE: 131,
    SQUOTE: 132,
    TAB: 133,
    VT: 134,
    FF: 135,
    SP: 136,
    NBSP: 137,
    USP: 138,
    WhiteSpace: 139,
    LF: 140,
    CR: 141,
    LS: 142,
    PS: 143,
    LineTerminator: 144,
    EOL: 145,
    MultiLineComment: 146,
    SingleLineComment: 147,
    Identifier: 148,
    StringLiteral: 149,
    HexDigit: 150,
    IdentifierStartASCII: 151,
    DecimalDigit: 152,
    IdentifierPart: 153,
    IdentifierNameASCIIStart: 154,
    IdentifierNameAmpersatStart: 155,
    LPAREN: 156,
    RPAREN: 157,
    RegularExpressionLiteral: 158,
    OctalDigit: 159,
    ExponentPart: 160,
    DecimalIntegerLiteral: 161,
    DecimalLiteral: 162,
    OctalIntegerLiteral: 163,
    HexIntegerLiteral: 164,
    CharacterEscapeSequence: 165,
    ZeroToThree: 166,
    OctalEscapeSequence: 167,
    HexEscapeSequence: 168,
    UnicodeEscapeSequence: 169,
    EscapeSequence: 170,
    BackslashSequence: 171,
    RegularExpressionFirstChar: 172,
    RegularExpressionChar: 173
});

(function(){
// public class variables
var EOF= -1,
    RENDER= 4,
    AMPERSAT= 5,
    NULL= 6,
    TRUE= 7,
    FALSE= 8,
    BREAK= 9,
    CASE= 10,
    CATCH= 11,
    CONTINUE= 12,
    DEFAULT= 13,
    DELETE= 14,
    DO= 15,
    ELSE= 16,
    FINALLY= 17,
    FOR= 18,
    FUNCTION= 19,
    IF= 20,
    IN= 21,
    INSTANCEOF= 22,
    NEW= 23,
    RETURN= 24,
    SWITCH= 25,
    THIS= 26,
    THROW= 27,
    TRY= 28,
    TYPEOF= 29,
    VAR= 30,
    VOID= 31,
    WHILE= 32,
    WITH= 33,
    ABSTRACT= 34,
    BOOLEAN= 35,
    BYTE= 36,
    CHAR= 37,
    CLASS= 38,
    CONST= 39,
    DEBUGGER= 40,
    DOUBLE= 41,
    ENUM= 42,
    EXPORT= 43,
    EXTENDS= 44,
    FINAL= 45,
    FLOAT= 46,
    GOTO= 47,
    IMPLEMENTS= 48,
    IMPORT= 49,
    INT= 50,
    INTERFACE= 51,
    LONG= 52,
    NATIVE= 53,
    PACKAGE= 54,
    PRIVATE= 55,
    PROTECTED= 56,
    PUBLIC= 57,
    SHORT= 58,
    STATIC= 59,
    SUPER= 60,
    SYNCHRONIZED= 61,
    THROWS= 62,
    TRANSIENT= 63,
    VOLATILE= 64,
    LBRACE= 65,
    RBRACE= 66,
    LBRACK= 67,
    RBRACK= 68,
    DOT= 69,
    SEMIC= 70,
    COMMA= 71,
    LT= 72,
    GT= 73,
    LTE= 74,
    GTE= 75,
    EQ= 76,
    NEQ= 77,
    SAME= 78,
    NSAME= 79,
    ADD= 80,
    SUB= 81,
    MUL= 82,
    MOD= 83,
    INC= 84,
    DEC= 85,
    SHL= 86,
    SHR= 87,
    SHU= 88,
    AND= 89,
    OR= 90,
    XOR= 91,
    NOT= 92,
    INV= 93,
    LAND= 94,
    LOR= 95,
    QUE= 96,
    COLON= 97,
    ASSIGN= 98,
    ADDASS= 99,
    SUBASS= 100,
    MULASS= 101,
    MODASS= 102,
    SHLASS= 103,
    SHRASS= 104,
    SHUASS= 105,
    ANDASS= 106,
    ORASS= 107,
    XORASS= 108,
    DIV= 109,
    DIVASS= 110,
    ARGS= 111,
    ARRAY= 112,
    BLOCK= 113,
    BYFIELD= 114,
    BYINDEX= 115,
    CALL= 116,
    CEXPR= 117,
    EXPR= 118,
    FORITER= 119,
    FORSTEP= 120,
    ITEM= 121,
    LABELLED= 122,
    NAMEDVALUE= 123,
    NEG= 124,
    OBJECT= 125,
    PAREXPR= 126,
    PDEC= 127,
    PINC= 128,
    POS= 129,
    BSLASH= 130,
    DQUOTE= 131,
    SQUOTE= 132,
    TAB= 133,
    VT= 134,
    FF= 135,
    SP= 136,
    NBSP= 137,
    USP= 138,
    WhiteSpace= 139,
    LF= 140,
    CR= 141,
    LS= 142,
    PS= 143,
    LineTerminator= 144,
    EOL= 145,
    MultiLineComment= 146,
    SingleLineComment= 147,
    Identifier= 148,
    StringLiteral= 149,
    HexDigit= 150,
    IdentifierStartASCII= 151,
    DecimalDigit= 152,
    IdentifierPart= 153,
    IdentifierNameASCIIStart= 154,
    IdentifierNameAmpersatStart= 155,
    LPAREN= 156,
    RPAREN= 157,
    RegularExpressionLiteral= 158,
    OctalDigit= 159,
    ExponentPart= 160,
    DecimalIntegerLiteral= 161,
    DecimalLiteral= 162,
    OctalIntegerLiteral= 163,
    HexIntegerLiteral= 164,
    CharacterEscapeSequence= 165,
    ZeroToThree= 166,
    OctalEscapeSequence= 167,
    HexEscapeSequence= 168,
    UnicodeEscapeSequence= 169,
    EscapeSequence= 170,
    BackslashSequence= 171,
    RegularExpressionFirstChar= 172,
    RegularExpressionChar= 173;
var UP = org.antlr.runtime.Token.UP,
    DOWN = org.antlr.runtime.Token.DOWN;

// public instance methods/vars
org.antlr.lang.extend(MmirES3Walker, org.antlr.runtime.tree.TreeParser, {
        

    getTokenNames: function() { return MmirES3Walker.tokenNames; },
    getGrammarFileName: function() { return "../MmirES3Walker.g"; }
});
org.antlr.lang.augmentObject(MmirES3Walker.prototype, {


    // ../MmirES3Walker.g:36:1: program : ( statement )* ;
    // $ANTLR start "program"
    program: function() {
        try {
            // ../MmirES3Walker.g:37:2: ( ( statement )* )
            // ../MmirES3Walker.g:37:4: ( statement )*
            // ../MmirES3Walker.g:37:4: ( statement )*
            loop1:
            do {
                var alt1=2;
                var LA1_0 = this.input.LA(1);

                if ( ((LA1_0>=NULL && LA1_0<=BREAK)||LA1_0==CONTINUE||(LA1_0>=DELETE && LA1_0<=DO)||(LA1_0>=FOR && LA1_0<=WITH)||(LA1_0>=LT && LA1_0<=QUE)||(LA1_0>=ASSIGN && LA1_0<=DIVASS)||(LA1_0>=ARRAY && LA1_0<=CEXPR)||LA1_0==LABELLED||(LA1_0>=NEG && LA1_0<=OBJECT)||(LA1_0>=PDEC && LA1_0<=POS)||(LA1_0>=Identifier && LA1_0<=StringLiteral)||LA1_0==IdentifierNameAmpersatStart||LA1_0==RegularExpressionLiteral||(LA1_0>=DecimalLiteral && LA1_0<=HexIntegerLiteral)) ) {
                    alt1=1;
                }


                switch (alt1) {
                case 1 :
                    // ../MmirES3Walker.g:37:4: statement
                    this.pushFollow(MmirES3Walker.FOLLOW_statement_in_program54);
                    this.statement();

                    this.state._fsp--;



                    break;

                default :
                    break loop1;
                }
            } while (true);




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


    // ../MmirES3Walker.g:40:1: statement : ( block | variableDeclaration | expression | ifStatement | doStatement | whileStatement | forStatement | continueStatement | breakStatement | returnStatement | withStatement | labelledStatement | switchStatement | throwStatement | tryStatement );
    // $ANTLR start "statement"
    statement: function() {
        try {
            // ../MmirES3Walker.g:41:2: ( block | variableDeclaration | expression | ifStatement | doStatement | whileStatement | forStatement | continueStatement | breakStatement | returnStatement | withStatement | labelledStatement | switchStatement | throwStatement | tryStatement )
            var alt2=15;
            switch ( this.input.LA(1) ) {
            case BLOCK:
                alt2=1;
                break;
            case VAR:
                alt2=2;
                break;
            case NULL:
            case TRUE:
            case FALSE:
            case DELETE:
            case FUNCTION:
            case IN:
            case INSTANCEOF:
            case NEW:
            case THIS:
            case TYPEOF:
            case VOID:
            case LT:
            case GT:
            case LTE:
            case GTE:
            case EQ:
            case NEQ:
            case SAME:
            case NSAME:
            case ADD:
            case SUB:
            case MUL:
            case MOD:
            case INC:
            case DEC:
            case SHL:
            case SHR:
            case SHU:
            case AND:
            case OR:
            case XOR:
            case NOT:
            case INV:
            case LAND:
            case LOR:
            case QUE:
            case ASSIGN:
            case ADDASS:
            case SUBASS:
            case MULASS:
            case MODASS:
            case SHLASS:
            case SHRASS:
            case SHUASS:
            case ANDASS:
            case ORASS:
            case XORASS:
            case DIV:
            case DIVASS:
            case ARRAY:
            case BYFIELD:
            case BYINDEX:
            case CALL:
            case CEXPR:
            case NEG:
            case OBJECT:
            case PDEC:
            case PINC:
            case POS:
            case Identifier:
            case StringLiteral:
            case IdentifierNameAmpersatStart:
            case RegularExpressionLiteral:
            case DecimalLiteral:
            case OctalIntegerLiteral:
            case HexIntegerLiteral:
                alt2=3;
                break;
            case IF:
                alt2=4;
                break;
            case DO:
                alt2=5;
                break;
            case WHILE:
                alt2=6;
                break;
            case FOR:
                alt2=7;
                break;
            case CONTINUE:
                alt2=8;
                break;
            case BREAK:
                alt2=9;
                break;
            case RETURN:
                alt2=10;
                break;
            case WITH:
                alt2=11;
                break;
            case LABELLED:
                alt2=12;
                break;
            case SWITCH:
                alt2=13;
                break;
            case THROW:
                alt2=14;
                break;
            case TRY:
                alt2=15;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 2, 0, this.input);

                throw nvae;
            }

            switch (alt2) {
                case 1 :
                    // ../MmirES3Walker.g:41:4: block
                    this.pushFollow(MmirES3Walker.FOLLOW_block_in_statement66);
                    this.block();

                    this.state._fsp--;



                    break;
                case 2 :
                    // ../MmirES3Walker.g:42:4: variableDeclaration
                    this.pushFollow(MmirES3Walker.FOLLOW_variableDeclaration_in_statement71);
                    this.variableDeclaration();

                    this.state._fsp--;



                    break;
                case 3 :
                    // ../MmirES3Walker.g:43:4: expression
                    this.pushFollow(MmirES3Walker.FOLLOW_expression_in_statement76);
                    this.expression();

                    this.state._fsp--;



                    break;
                case 4 :
                    // ../MmirES3Walker.g:44:4: ifStatement
                    this.pushFollow(MmirES3Walker.FOLLOW_ifStatement_in_statement81);
                    this.ifStatement();

                    this.state._fsp--;



                    break;
                case 5 :
                    // ../MmirES3Walker.g:45:4: doStatement
                    this.pushFollow(MmirES3Walker.FOLLOW_doStatement_in_statement86);
                    this.doStatement();

                    this.state._fsp--;



                    break;
                case 6 :
                    // ../MmirES3Walker.g:46:4: whileStatement
                    this.pushFollow(MmirES3Walker.FOLLOW_whileStatement_in_statement91);
                    this.whileStatement();

                    this.state._fsp--;



                    break;
                case 7 :
                    // ../MmirES3Walker.g:47:4: forStatement
                    this.pushFollow(MmirES3Walker.FOLLOW_forStatement_in_statement96);
                    this.forStatement();

                    this.state._fsp--;



                    break;
                case 8 :
                    // ../MmirES3Walker.g:48:4: continueStatement
                    this.pushFollow(MmirES3Walker.FOLLOW_continueStatement_in_statement101);
                    this.continueStatement();

                    this.state._fsp--;



                    break;
                case 9 :
                    // ../MmirES3Walker.g:49:4: breakStatement
                    this.pushFollow(MmirES3Walker.FOLLOW_breakStatement_in_statement106);
                    this.breakStatement();

                    this.state._fsp--;



                    break;
                case 10 :
                    // ../MmirES3Walker.g:50:4: returnStatement
                    this.pushFollow(MmirES3Walker.FOLLOW_returnStatement_in_statement111);
                    this.returnStatement();

                    this.state._fsp--;



                    break;
                case 11 :
                    // ../MmirES3Walker.g:51:4: withStatement
                    this.pushFollow(MmirES3Walker.FOLLOW_withStatement_in_statement116);
                    this.withStatement();

                    this.state._fsp--;



                    break;
                case 12 :
                    // ../MmirES3Walker.g:52:4: labelledStatement
                    this.pushFollow(MmirES3Walker.FOLLOW_labelledStatement_in_statement121);
                    this.labelledStatement();

                    this.state._fsp--;



                    break;
                case 13 :
                    // ../MmirES3Walker.g:53:4: switchStatement
                    this.pushFollow(MmirES3Walker.FOLLOW_switchStatement_in_statement126);
                    this.switchStatement();

                    this.state._fsp--;



                    break;
                case 14 :
                    // ../MmirES3Walker.g:54:4: throwStatement
                    this.pushFollow(MmirES3Walker.FOLLOW_throwStatement_in_statement131);
                    this.throwStatement();

                    this.state._fsp--;



                    break;
                case 15 :
                    // ../MmirES3Walker.g:55:4: tryStatement
                    this.pushFollow(MmirES3Walker.FOLLOW_tryStatement_in_statement136);
                    this.tryStatement();

                    this.state._fsp--;



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


    // ../MmirES3Walker.g:58:1: block : ^( BLOCK ( statement )* ) ;
    // $ANTLR start "block"
    block: function() {
        try {
            // ../MmirES3Walker.g:59:2: ( ^( BLOCK ( statement )* ) )
            // ../MmirES3Walker.g:59:4: ^( BLOCK ( statement )* )
            this.match(this.input,BLOCK,MmirES3Walker.FOLLOW_BLOCK_in_block149); 

            if ( this.input.LA(1)==org.antlr.runtime.Token.DOWN ) {
                this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                // ../MmirES3Walker.g:59:13: ( statement )*
                loop3:
                do {
                    var alt3=2;
                    var LA3_0 = this.input.LA(1);

                    if ( ((LA3_0>=NULL && LA3_0<=BREAK)||LA3_0==CONTINUE||(LA3_0>=DELETE && LA3_0<=DO)||(LA3_0>=FOR && LA3_0<=WITH)||(LA3_0>=LT && LA3_0<=QUE)||(LA3_0>=ASSIGN && LA3_0<=DIVASS)||(LA3_0>=ARRAY && LA3_0<=CEXPR)||LA3_0==LABELLED||(LA3_0>=NEG && LA3_0<=OBJECT)||(LA3_0>=PDEC && LA3_0<=POS)||(LA3_0>=Identifier && LA3_0<=StringLiteral)||LA3_0==IdentifierNameAmpersatStart||LA3_0==RegularExpressionLiteral||(LA3_0>=DecimalLiteral && LA3_0<=HexIntegerLiteral)) ) {
                        alt3=1;
                    }


                    switch (alt3) {
                    case 1 :
                        // ../MmirES3Walker.g:59:13: statement
                        this.pushFollow(MmirES3Walker.FOLLOW_statement_in_block151);
                        this.statement();

                        this.state._fsp--;



                        break;

                    default :
                        break loop3;
                    }
                } while (true);


                this.match(this.input, org.antlr.runtime.Token.UP, null); 
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


    // ../MmirES3Walker.g:62:1: variableDeclaration : ^( VAR (id= Identifier | ^( ASSIGN id= Identifier expr ) )+ ) ;
    // $ANTLR start "variableDeclaration"
    variableDeclaration: function() {
        var id = null;

        try {
            // ../MmirES3Walker.g:63:2: ( ^( VAR (id= Identifier | ^( ASSIGN id= Identifier expr ) )+ ) )
            // ../MmirES3Walker.g:63:4: ^( VAR (id= Identifier | ^( ASSIGN id= Identifier expr ) )+ )
            this.match(this.input,VAR,MmirES3Walker.FOLLOW_VAR_in_variableDeclaration167); 

            this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
            // ../MmirES3Walker.g:63:11: (id= Identifier | ^( ASSIGN id= Identifier expr ) )+
            var cnt4=0;
            loop4:
            do {
                var alt4=3;
                var LA4_0 = this.input.LA(1);

                if ( (LA4_0==Identifier) ) {
                    alt4=1;
                }
                else if ( (LA4_0==ASSIGN) ) {
                    alt4=2;
                }


                switch (alt4) {
                case 1 :
                    // ../MmirES3Walker.g:63:13: id= Identifier
                    id=this.match(this.input,Identifier,MmirES3Walker.FOLLOW_Identifier_in_variableDeclaration173); 


                    break;
                case 2 :
                    // ../MmirES3Walker.g:63:29: ^( ASSIGN id= Identifier expr )
                    this.match(this.input,ASSIGN,MmirES3Walker.FOLLOW_ASSIGN_in_variableDeclaration179); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    id=this.match(this.input,Identifier,MmirES3Walker.FOLLOW_Identifier_in_variableDeclaration183); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_variableDeclaration185);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;

                default :
                    if ( cnt4 >= 1 ) {
                        break loop4;
                    }
                        var eee = new org.antlr.runtime.EarlyExitException(4, this.input);
                        throw eee;
                }
                cnt4++;
            } while (true);


            this.match(this.input, org.antlr.runtime.Token.UP, null); 
             this.varDeclarations.push(id); /*MODIFICATION: keep trac of variable decplarations */



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


    // ../MmirES3Walker.g:67:1: ifStatement : ^( IF expression ( statement )+ ) ;
    // $ANTLR start "ifStatement"
    ifStatement: function() {
        try {
            // ../MmirES3Walker.g:68:2: ( ^( IF expression ( statement )+ ) )
            // ../MmirES3Walker.g:68:4: ^( IF expression ( statement )+ )
            this.match(this.input,IF,MmirES3Walker.FOLLOW_IF_in_ifStatement208); 

            this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
            this.pushFollow(MmirES3Walker.FOLLOW_expression_in_ifStatement210);
            this.expression();

            this.state._fsp--;

            // ../MmirES3Walker.g:68:21: ( statement )+
            var cnt5=0;
            loop5:
            do {
                var alt5=2;
                var LA5_0 = this.input.LA(1);

                if ( ((LA5_0>=NULL && LA5_0<=BREAK)||LA5_0==CONTINUE||(LA5_0>=DELETE && LA5_0<=DO)||(LA5_0>=FOR && LA5_0<=WITH)||(LA5_0>=LT && LA5_0<=QUE)||(LA5_0>=ASSIGN && LA5_0<=DIVASS)||(LA5_0>=ARRAY && LA5_0<=CEXPR)||LA5_0==LABELLED||(LA5_0>=NEG && LA5_0<=OBJECT)||(LA5_0>=PDEC && LA5_0<=POS)||(LA5_0>=Identifier && LA5_0<=StringLiteral)||LA5_0==IdentifierNameAmpersatStart||LA5_0==RegularExpressionLiteral||(LA5_0>=DecimalLiteral && LA5_0<=HexIntegerLiteral)) ) {
                    alt5=1;
                }


                switch (alt5) {
                case 1 :
                    // ../MmirES3Walker.g:68:21: statement
                    this.pushFollow(MmirES3Walker.FOLLOW_statement_in_ifStatement212);
                    this.statement();

                    this.state._fsp--;



                    break;

                default :
                    if ( cnt5 >= 1 ) {
                        break loop5;
                    }
                        var eee = new org.antlr.runtime.EarlyExitException(5, this.input);
                        throw eee;
                }
                cnt5++;
            } while (true);


            this.match(this.input, org.antlr.runtime.Token.UP, null); 



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


    // ../MmirES3Walker.g:71:1: doStatement : ^( DO statement expression ) ;
    // $ANTLR start "doStatement"
    doStatement: function() {
        try {
            // ../MmirES3Walker.g:72:2: ( ^( DO statement expression ) )
            // ../MmirES3Walker.g:72:4: ^( DO statement expression )
            this.match(this.input,DO,MmirES3Walker.FOLLOW_DO_in_doStatement228); 

            this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
            this.pushFollow(MmirES3Walker.FOLLOW_statement_in_doStatement230);
            this.statement();

            this.state._fsp--;

            this.pushFollow(MmirES3Walker.FOLLOW_expression_in_doStatement232);
            this.expression();

            this.state._fsp--;


            this.match(this.input, org.antlr.runtime.Token.UP, null); 



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


    // ../MmirES3Walker.g:75:1: whileStatement : ^( WHILE expression statement ) ;
    // $ANTLR start "whileStatement"
    whileStatement: function() {
        try {
            // ../MmirES3Walker.g:76:2: ( ^( WHILE expression statement ) )
            // ../MmirES3Walker.g:76:4: ^( WHILE expression statement )
            this.match(this.input,WHILE,MmirES3Walker.FOLLOW_WHILE_in_whileStatement247); 

            this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
            this.pushFollow(MmirES3Walker.FOLLOW_expression_in_whileStatement249);
            this.expression();

            this.state._fsp--;

            this.pushFollow(MmirES3Walker.FOLLOW_statement_in_whileStatement251);
            this.statement();

            this.state._fsp--;


            this.match(this.input, org.antlr.runtime.Token.UP, null); 



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


    // ../MmirES3Walker.g:93:1: forStatement : ^( FOR forControl statement ) ;
    // $ANTLR start "forStatement"
    forStatement: function() {
        try {
            // ../MmirES3Walker.g:94:2: ( ^( FOR forControl statement ) )
            // ../MmirES3Walker.g:94:4: ^( FOR forControl statement )
            this.match(this.input,FOR,MmirES3Walker.FOLLOW_FOR_in_forStatement268); 

            this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
            this.pushFollow(MmirES3Walker.FOLLOW_forControl_in_forStatement270);
            this.forControl();

            this.state._fsp--;

            this.pushFollow(MmirES3Walker.FOLLOW_statement_in_forStatement272);
            this.statement();

            this.state._fsp--;


            this.match(this.input, org.antlr.runtime.Token.UP, null); 



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


    // ../MmirES3Walker.g:96:1: forControl : ( ^( FORSTEP ( exprOptClause | variableDeclaration ) exprOptClause exprOptClause ) | ^( FORITER ( exprClause | variableDeclaration ) exprClause ) ) ;
    // $ANTLR start "forControl"
    forControl: function() {
        try {
            // ../MmirES3Walker.g:97:2: ( ( ^( FORSTEP ( exprOptClause | variableDeclaration ) exprOptClause exprOptClause ) | ^( FORITER ( exprClause | variableDeclaration ) exprClause ) ) )
            // ../MmirES3Walker.g:97:4: ( ^( FORSTEP ( exprOptClause | variableDeclaration ) exprOptClause exprOptClause ) | ^( FORITER ( exprClause | variableDeclaration ) exprClause ) )
            // ../MmirES3Walker.g:97:4: ( ^( FORSTEP ( exprOptClause | variableDeclaration ) exprOptClause exprOptClause ) | ^( FORITER ( exprClause | variableDeclaration ) exprClause ) )
            var alt8=2;
            var LA8_0 = this.input.LA(1);

            if ( (LA8_0==FORSTEP) ) {
                alt8=1;
            }
            else if ( (LA8_0==FORITER) ) {
                alt8=2;
            }
            else {
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 8, 0, this.input);

                throw nvae;
            }
            switch (alt8) {
                case 1 :
                    // ../MmirES3Walker.g:99:3: ^( FORSTEP ( exprOptClause | variableDeclaration ) exprOptClause exprOptClause )
                    this.match(this.input,FORSTEP,MmirES3Walker.FOLLOW_FORSTEP_in_forControl291); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    // ../MmirES3Walker.g:99:14: ( exprOptClause | variableDeclaration )
                    var alt6=2;
                    var LA6_0 = this.input.LA(1);

                    if ( (LA6_0==EXPR) ) {
                        alt6=1;
                    }
                    else if ( (LA6_0==VAR) ) {
                        alt6=2;
                    }
                    else {
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 6, 0, this.input);

                        throw nvae;
                    }
                    switch (alt6) {
                        case 1 :
                            // ../MmirES3Walker.g:99:16: exprOptClause
                            this.pushFollow(MmirES3Walker.FOLLOW_exprOptClause_in_forControl295);
                            this.exprOptClause();

                            this.state._fsp--;



                            break;
                        case 2 :
                            // ../MmirES3Walker.g:99:32: variableDeclaration
                            this.pushFollow(MmirES3Walker.FOLLOW_variableDeclaration_in_forControl299);
                            this.variableDeclaration();

                            this.state._fsp--;



                            break;

                    }

                    this.pushFollow(MmirES3Walker.FOLLOW_exprOptClause_in_forControl303);
                    this.exprOptClause();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_exprOptClause_in_forControl305);
                    this.exprOptClause();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 2 :
                    // ../MmirES3Walker.g:100:5: ^( FORITER ( exprClause | variableDeclaration ) exprClause )
                    this.match(this.input,FORITER,MmirES3Walker.FOLLOW_FORITER_in_forControl315); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    // ../MmirES3Walker.g:100:16: ( exprClause | variableDeclaration )
                    var alt7=2;
                    var LA7_0 = this.input.LA(1);

                    if ( (LA7_0==EXPR) ) {
                        alt7=1;
                    }
                    else if ( (LA7_0==VAR) ) {
                        alt7=2;
                    }
                    else {
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 7, 0, this.input);

                        throw nvae;
                    }
                    switch (alt7) {
                        case 1 :
                            // ../MmirES3Walker.g:100:18: exprClause
                            this.pushFollow(MmirES3Walker.FOLLOW_exprClause_in_forControl319);
                            this.exprClause();

                            this.state._fsp--;



                            break;
                        case 2 :
                            // ../MmirES3Walker.g:100:31: variableDeclaration
                            this.pushFollow(MmirES3Walker.FOLLOW_variableDeclaration_in_forControl323);
                            this.variableDeclaration();

                            this.state._fsp--;



                            break;

                    }

                    this.pushFollow(MmirES3Walker.FOLLOW_exprClause_in_forControl327);
                    this.exprClause();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


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


    // ../MmirES3Walker.g:104:1: exprOptClause : ^( EXPR ( expression )? ) ;
    // $ANTLR start "exprOptClause"
    exprOptClause: function() {
        try {
            // ../MmirES3Walker.g:105:2: ( ^( EXPR ( expression )? ) )
            // ../MmirES3Walker.g:105:4: ^( EXPR ( expression )? )
            this.match(this.input,EXPR,MmirES3Walker.FOLLOW_EXPR_in_exprOptClause345); 

            if ( this.input.LA(1)==org.antlr.runtime.Token.DOWN ) {
                this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                // ../MmirES3Walker.g:105:12: ( expression )?
                var alt9=2;
                var LA9_0 = this.input.LA(1);

                if ( ((LA9_0>=NULL && LA9_0<=FALSE)||LA9_0==DELETE||LA9_0==FUNCTION||(LA9_0>=IN && LA9_0<=NEW)||LA9_0==THIS||LA9_0==TYPEOF||LA9_0==VOID||(LA9_0>=LT && LA9_0<=QUE)||(LA9_0>=ASSIGN && LA9_0<=DIVASS)||LA9_0==ARRAY||(LA9_0>=BYFIELD && LA9_0<=CEXPR)||(LA9_0>=NEG && LA9_0<=OBJECT)||(LA9_0>=PDEC && LA9_0<=POS)||(LA9_0>=Identifier && LA9_0<=StringLiteral)||LA9_0==IdentifierNameAmpersatStart||LA9_0==RegularExpressionLiteral||(LA9_0>=DecimalLiteral && LA9_0<=HexIntegerLiteral)) ) {
                    alt9=1;
                }
                switch (alt9) {
                    case 1 :
                        // ../MmirES3Walker.g:105:12: expression
                        this.pushFollow(MmirES3Walker.FOLLOW_expression_in_exprOptClause347);
                        this.expression();

                        this.state._fsp--;



                        break;

                }


                this.match(this.input, org.antlr.runtime.Token.UP, null); 
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


    // ../MmirES3Walker.g:108:1: exprClause : ^( EXPR expression ) ;
    // $ANTLR start "exprClause"
    exprClause: function() {
        try {
            // ../MmirES3Walker.g:109:2: ( ^( EXPR expression ) )
            // ../MmirES3Walker.g:109:4: ^( EXPR expression )
            this.match(this.input,EXPR,MmirES3Walker.FOLLOW_EXPR_in_exprClause363); 

            this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
            this.pushFollow(MmirES3Walker.FOLLOW_expression_in_exprClause365);
            this.expression();

            this.state._fsp--;


            this.match(this.input, org.antlr.runtime.Token.UP, null); 



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


    // ../MmirES3Walker.g:112:1: continueStatement : ^( CONTINUE ( Identifier )? ) ;
    // $ANTLR start "continueStatement"
    continueStatement: function() {
        try {
            // ../MmirES3Walker.g:113:2: ( ^( CONTINUE ( Identifier )? ) )
            // ../MmirES3Walker.g:113:4: ^( CONTINUE ( Identifier )? )
            this.match(this.input,CONTINUE,MmirES3Walker.FOLLOW_CONTINUE_in_continueStatement380); 

            if ( this.input.LA(1)==org.antlr.runtime.Token.DOWN ) {
                this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                // ../MmirES3Walker.g:113:16: ( Identifier )?
                var alt10=2;
                var LA10_0 = this.input.LA(1);

                if ( (LA10_0==Identifier) ) {
                    alt10=1;
                }
                switch (alt10) {
                    case 1 :
                        // ../MmirES3Walker.g:113:16: Identifier
                        this.match(this.input,Identifier,MmirES3Walker.FOLLOW_Identifier_in_continueStatement382); 


                        break;

                }


                this.match(this.input, org.antlr.runtime.Token.UP, null); 
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


    // ../MmirES3Walker.g:116:1: breakStatement : ^( BREAK ( Identifier )? ) ;
    // $ANTLR start "breakStatement"
    breakStatement: function() {
        try {
            // ../MmirES3Walker.g:117:2: ( ^( BREAK ( Identifier )? ) )
            // ../MmirES3Walker.g:117:4: ^( BREAK ( Identifier )? )
            this.match(this.input,BREAK,MmirES3Walker.FOLLOW_BREAK_in_breakStatement398); 

            if ( this.input.LA(1)==org.antlr.runtime.Token.DOWN ) {
                this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                // ../MmirES3Walker.g:117:13: ( Identifier )?
                var alt11=2;
                var LA11_0 = this.input.LA(1);

                if ( (LA11_0==Identifier) ) {
                    alt11=1;
                }
                switch (alt11) {
                    case 1 :
                        // ../MmirES3Walker.g:117:13: Identifier
                        this.match(this.input,Identifier,MmirES3Walker.FOLLOW_Identifier_in_breakStatement400); 


                        break;

                }


                this.match(this.input, org.antlr.runtime.Token.UP, null); 
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


    // ../MmirES3Walker.g:120:1: returnStatement : ^( RETURN ( expression )? ) ;
    // $ANTLR start "returnStatement"
    returnStatement: function() {
        try {
            // ../MmirES3Walker.g:121:2: ( ^( RETURN ( expression )? ) )
            // ../MmirES3Walker.g:121:4: ^( RETURN ( expression )? )
            this.match(this.input,RETURN,MmirES3Walker.FOLLOW_RETURN_in_returnStatement416); 

            if ( this.input.LA(1)==org.antlr.runtime.Token.DOWN ) {
                this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                // ../MmirES3Walker.g:121:14: ( expression )?
                var alt12=2;
                var LA12_0 = this.input.LA(1);

                if ( ((LA12_0>=NULL && LA12_0<=FALSE)||LA12_0==DELETE||LA12_0==FUNCTION||(LA12_0>=IN && LA12_0<=NEW)||LA12_0==THIS||LA12_0==TYPEOF||LA12_0==VOID||(LA12_0>=LT && LA12_0<=QUE)||(LA12_0>=ASSIGN && LA12_0<=DIVASS)||LA12_0==ARRAY||(LA12_0>=BYFIELD && LA12_0<=CEXPR)||(LA12_0>=NEG && LA12_0<=OBJECT)||(LA12_0>=PDEC && LA12_0<=POS)||(LA12_0>=Identifier && LA12_0<=StringLiteral)||LA12_0==IdentifierNameAmpersatStart||LA12_0==RegularExpressionLiteral||(LA12_0>=DecimalLiteral && LA12_0<=HexIntegerLiteral)) ) {
                    alt12=1;
                }
                switch (alt12) {
                    case 1 :
                        // ../MmirES3Walker.g:121:14: expression
                        this.pushFollow(MmirES3Walker.FOLLOW_expression_in_returnStatement418);
                        this.expression();

                        this.state._fsp--;



                        break;

                }


                this.match(this.input, org.antlr.runtime.Token.UP, null); 
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


    // ../MmirES3Walker.g:124:1: withStatement : ^( WITH expression statement ) ;
    // $ANTLR start "withStatement"
    withStatement: function() {
        try {
            // ../MmirES3Walker.g:125:2: ( ^( WITH expression statement ) )
            // ../MmirES3Walker.g:125:4: ^( WITH expression statement )
            this.match(this.input,WITH,MmirES3Walker.FOLLOW_WITH_in_withStatement434); 

            this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
            this.pushFollow(MmirES3Walker.FOLLOW_expression_in_withStatement436);
            this.expression();

            this.state._fsp--;

            this.pushFollow(MmirES3Walker.FOLLOW_statement_in_withStatement438);
            this.statement();

            this.state._fsp--;


            this.match(this.input, org.antlr.runtime.Token.UP, null); 



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


    // ../MmirES3Walker.g:128:1: labelledStatement : ^( LABELLED Identifier statement ) ;
    // $ANTLR start "labelledStatement"
    labelledStatement: function() {
        try {
            // ../MmirES3Walker.g:129:2: ( ^( LABELLED Identifier statement ) )
            // ../MmirES3Walker.g:129:4: ^( LABELLED Identifier statement )
            this.match(this.input,LABELLED,MmirES3Walker.FOLLOW_LABELLED_in_labelledStatement453); 

            this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
            this.match(this.input,Identifier,MmirES3Walker.FOLLOW_Identifier_in_labelledStatement455); 
            this.pushFollow(MmirES3Walker.FOLLOW_statement_in_labelledStatement457);
            this.statement();

            this.state._fsp--;


            this.match(this.input, org.antlr.runtime.Token.UP, null); 



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


    // ../MmirES3Walker.g:132:1: switchStatement : ^( SWITCH expression ( defaultClause )? ( caseClause )* ) ;
    // $ANTLR start "switchStatement"
    switchStatement: function() {
        try {
            // ../MmirES3Walker.g:133:2: ( ^( SWITCH expression ( defaultClause )? ( caseClause )* ) )
            // ../MmirES3Walker.g:133:4: ^( SWITCH expression ( defaultClause )? ( caseClause )* )
            this.match(this.input,SWITCH,MmirES3Walker.FOLLOW_SWITCH_in_switchStatement472); 

            this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
            this.pushFollow(MmirES3Walker.FOLLOW_expression_in_switchStatement474);
            this.expression();

            this.state._fsp--;

            // ../MmirES3Walker.g:133:25: ( defaultClause )?
            var alt13=2;
            var LA13_0 = this.input.LA(1);

            if ( (LA13_0==DEFAULT) ) {
                alt13=1;
            }
            switch (alt13) {
                case 1 :
                    // ../MmirES3Walker.g:133:25: defaultClause
                    this.pushFollow(MmirES3Walker.FOLLOW_defaultClause_in_switchStatement476);
                    this.defaultClause();

                    this.state._fsp--;



                    break;

            }

            // ../MmirES3Walker.g:133:40: ( caseClause )*
            loop14:
            do {
                var alt14=2;
                var LA14_0 = this.input.LA(1);

                if ( (LA14_0==CASE) ) {
                    alt14=1;
                }


                switch (alt14) {
                case 1 :
                    // ../MmirES3Walker.g:133:40: caseClause
                    this.pushFollow(MmirES3Walker.FOLLOW_caseClause_in_switchStatement479);
                    this.caseClause();

                    this.state._fsp--;



                    break;

                default :
                    break loop14;
                }
            } while (true);


            this.match(this.input, org.antlr.runtime.Token.UP, null); 



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


    // ../MmirES3Walker.g:136:1: defaultClause : ^( DEFAULT ( statement )* ) ;
    // $ANTLR start "defaultClause"
    defaultClause: function() {
        try {
            // ../MmirES3Walker.g:137:2: ( ^( DEFAULT ( statement )* ) )
            // ../MmirES3Walker.g:137:4: ^( DEFAULT ( statement )* )
            this.match(this.input,DEFAULT,MmirES3Walker.FOLLOW_DEFAULT_in_defaultClause495); 

            if ( this.input.LA(1)==org.antlr.runtime.Token.DOWN ) {
                this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                // ../MmirES3Walker.g:137:15: ( statement )*
                loop15:
                do {
                    var alt15=2;
                    var LA15_0 = this.input.LA(1);

                    if ( ((LA15_0>=NULL && LA15_0<=BREAK)||LA15_0==CONTINUE||(LA15_0>=DELETE && LA15_0<=DO)||(LA15_0>=FOR && LA15_0<=WITH)||(LA15_0>=LT && LA15_0<=QUE)||(LA15_0>=ASSIGN && LA15_0<=DIVASS)||(LA15_0>=ARRAY && LA15_0<=CEXPR)||LA15_0==LABELLED||(LA15_0>=NEG && LA15_0<=OBJECT)||(LA15_0>=PDEC && LA15_0<=POS)||(LA15_0>=Identifier && LA15_0<=StringLiteral)||LA15_0==IdentifierNameAmpersatStart||LA15_0==RegularExpressionLiteral||(LA15_0>=DecimalLiteral && LA15_0<=HexIntegerLiteral)) ) {
                        alt15=1;
                    }


                    switch (alt15) {
                    case 1 :
                        // ../MmirES3Walker.g:137:15: statement
                        this.pushFollow(MmirES3Walker.FOLLOW_statement_in_defaultClause497);
                        this.statement();

                        this.state._fsp--;



                        break;

                    default :
                        break loop15;
                    }
                } while (true);


                this.match(this.input, org.antlr.runtime.Token.UP, null); 
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


    // ../MmirES3Walker.g:140:1: caseClause : ^( CASE expression ( statement )* ) ;
    // $ANTLR start "caseClause"
    caseClause: function() {
        try {
            // ../MmirES3Walker.g:141:2: ( ^( CASE expression ( statement )* ) )
            // ../MmirES3Walker.g:141:4: ^( CASE expression ( statement )* )
            this.match(this.input,CASE,MmirES3Walker.FOLLOW_CASE_in_caseClause513); 

            this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
            this.pushFollow(MmirES3Walker.FOLLOW_expression_in_caseClause515);
            this.expression();

            this.state._fsp--;

            // ../MmirES3Walker.g:141:23: ( statement )*
            loop16:
            do {
                var alt16=2;
                var LA16_0 = this.input.LA(1);

                if ( ((LA16_0>=NULL && LA16_0<=BREAK)||LA16_0==CONTINUE||(LA16_0>=DELETE && LA16_0<=DO)||(LA16_0>=FOR && LA16_0<=WITH)||(LA16_0>=LT && LA16_0<=QUE)||(LA16_0>=ASSIGN && LA16_0<=DIVASS)||(LA16_0>=ARRAY && LA16_0<=CEXPR)||LA16_0==LABELLED||(LA16_0>=NEG && LA16_0<=OBJECT)||(LA16_0>=PDEC && LA16_0<=POS)||(LA16_0>=Identifier && LA16_0<=StringLiteral)||LA16_0==IdentifierNameAmpersatStart||LA16_0==RegularExpressionLiteral||(LA16_0>=DecimalLiteral && LA16_0<=HexIntegerLiteral)) ) {
                    alt16=1;
                }


                switch (alt16) {
                case 1 :
                    // ../MmirES3Walker.g:141:23: statement
                    this.pushFollow(MmirES3Walker.FOLLOW_statement_in_caseClause517);
                    this.statement();

                    this.state._fsp--;



                    break;

                default :
                    break loop16;
                }
            } while (true);


            this.match(this.input, org.antlr.runtime.Token.UP, null); 



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


    // ../MmirES3Walker.g:144:1: throwStatement : ^( THROW expression ) ;
    // $ANTLR start "throwStatement"
    throwStatement: function() {
        try {
            // ../MmirES3Walker.g:145:2: ( ^( THROW expression ) )
            // ../MmirES3Walker.g:145:4: ^( THROW expression )
            this.match(this.input,THROW,MmirES3Walker.FOLLOW_THROW_in_throwStatement533); 

            this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
            this.pushFollow(MmirES3Walker.FOLLOW_expression_in_throwStatement535);
            this.expression();

            this.state._fsp--;


            this.match(this.input, org.antlr.runtime.Token.UP, null); 



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


    // ../MmirES3Walker.g:148:1: tryStatement : ^( TRY block ( catchClause )? ( finallyClause )? ) ;
    // $ANTLR start "tryStatement"
    tryStatement: function() {
        try {
            // ../MmirES3Walker.g:149:2: ( ^( TRY block ( catchClause )? ( finallyClause )? ) )
            // ../MmirES3Walker.g:149:4: ^( TRY block ( catchClause )? ( finallyClause )? )
            this.match(this.input,TRY,MmirES3Walker.FOLLOW_TRY_in_tryStatement550); 

            this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
            this.pushFollow(MmirES3Walker.FOLLOW_block_in_tryStatement552);
            this.block();

            this.state._fsp--;

            // ../MmirES3Walker.g:149:17: ( catchClause )?
            var alt17=2;
            var LA17_0 = this.input.LA(1);

            if ( (LA17_0==CATCH) ) {
                alt17=1;
            }
            switch (alt17) {
                case 1 :
                    // ../MmirES3Walker.g:149:17: catchClause
                    this.pushFollow(MmirES3Walker.FOLLOW_catchClause_in_tryStatement554);
                    this.catchClause();

                    this.state._fsp--;



                    break;

            }

            // ../MmirES3Walker.g:149:30: ( finallyClause )?
            var alt18=2;
            var LA18_0 = this.input.LA(1);

            if ( (LA18_0==FINALLY) ) {
                alt18=1;
            }
            switch (alt18) {
                case 1 :
                    // ../MmirES3Walker.g:149:30: finallyClause
                    this.pushFollow(MmirES3Walker.FOLLOW_finallyClause_in_tryStatement557);
                    this.finallyClause();

                    this.state._fsp--;



                    break;

            }


            this.match(this.input, org.antlr.runtime.Token.UP, null); 



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


    // ../MmirES3Walker.g:152:1: catchClause : ^( CATCH Identifier block ) ;
    // $ANTLR start "catchClause"
    catchClause: function() {
        try {
            // ../MmirES3Walker.g:153:2: ( ^( CATCH Identifier block ) )
            // ../MmirES3Walker.g:153:4: ^( CATCH Identifier block )
            this.match(this.input,CATCH,MmirES3Walker.FOLLOW_CATCH_in_catchClause574); 

            this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
            this.match(this.input,Identifier,MmirES3Walker.FOLLOW_Identifier_in_catchClause576); 
            this.pushFollow(MmirES3Walker.FOLLOW_block_in_catchClause578);
            this.block();

            this.state._fsp--;


            this.match(this.input, org.antlr.runtime.Token.UP, null); 



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


    // ../MmirES3Walker.g:156:1: finallyClause : ^( FINALLY block ) ;
    // $ANTLR start "finallyClause"
    finallyClause: function() {
        try {
            // ../MmirES3Walker.g:157:2: ( ^( FINALLY block ) )
            // ../MmirES3Walker.g:157:4: ^( FINALLY block )
            this.match(this.input,FINALLY,MmirES3Walker.FOLLOW_FINALLY_in_finallyClause594); 

            this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
            this.pushFollow(MmirES3Walker.FOLLOW_block_in_finallyClause596);
            this.block();

            this.state._fsp--;


            this.match(this.input, org.antlr.runtime.Token.UP, null); 



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


    // ../MmirES3Walker.g:160:1: expression : ( expr | ^( CEXPR ( expr )+ ) );
    // $ANTLR start "expression"
    expression: function() {
        try {
            // ../MmirES3Walker.g:161:2: ( expr | ^( CEXPR ( expr )+ ) )
            var alt20=2;
            var LA20_0 = this.input.LA(1);

            if ( ((LA20_0>=NULL && LA20_0<=FALSE)||LA20_0==DELETE||LA20_0==FUNCTION||(LA20_0>=IN && LA20_0<=NEW)||LA20_0==THIS||LA20_0==TYPEOF||LA20_0==VOID||(LA20_0>=LT && LA20_0<=QUE)||(LA20_0>=ASSIGN && LA20_0<=DIVASS)||LA20_0==ARRAY||(LA20_0>=BYFIELD && LA20_0<=CALL)||(LA20_0>=NEG && LA20_0<=OBJECT)||(LA20_0>=PDEC && LA20_0<=POS)||(LA20_0>=Identifier && LA20_0<=StringLiteral)||LA20_0==IdentifierNameAmpersatStart||LA20_0==RegularExpressionLiteral||(LA20_0>=DecimalLiteral && LA20_0<=HexIntegerLiteral)) ) {
                alt20=1;
            }
            else if ( (LA20_0==CEXPR) ) {
                alt20=2;
            }
            else {
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 20, 0, this.input);

                throw nvae;
            }
            switch (alt20) {
                case 1 :
                    // ../MmirES3Walker.g:161:4: expr
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expression609);
                    this.expr();

                    this.state._fsp--;



                    break;
                case 2 :
                    // ../MmirES3Walker.g:162:4: ^( CEXPR ( expr )+ )
                    this.match(this.input,CEXPR,MmirES3Walker.FOLLOW_CEXPR_in_expression617); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    // ../MmirES3Walker.g:162:13: ( expr )+
                    var cnt19=0;
                    loop19:
                    do {
                        var alt19=2;
                        var LA19_0 = this.input.LA(1);

                        if ( ((LA19_0>=NULL && LA19_0<=FALSE)||LA19_0==DELETE||LA19_0==FUNCTION||(LA19_0>=IN && LA19_0<=NEW)||LA19_0==THIS||LA19_0==TYPEOF||LA19_0==VOID||(LA19_0>=LT && LA19_0<=QUE)||(LA19_0>=ASSIGN && LA19_0<=DIVASS)||LA19_0==ARRAY||(LA19_0>=BYFIELD && LA19_0<=CALL)||(LA19_0>=NEG && LA19_0<=OBJECT)||(LA19_0>=PDEC && LA19_0<=POS)||(LA19_0>=Identifier && LA19_0<=StringLiteral)||LA19_0==IdentifierNameAmpersatStart||LA19_0==RegularExpressionLiteral||(LA19_0>=DecimalLiteral && LA19_0<=HexIntegerLiteral)) ) {
                            alt19=1;
                        }


                        switch (alt19) {
                        case 1 :
                            // ../MmirES3Walker.g:162:13: expr
                            this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expression619);
                            this.expr();

                            this.state._fsp--;



                            break;

                        default :
                            if ( cnt19 >= 1 ) {
                                break loop19;
                            }
                                var eee = new org.antlr.runtime.EarlyExitException(19, this.input);
                                throw eee;
                        }
                        cnt19++;
                    } while (true);


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


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


    // ../MmirES3Walker.g:165:1: expr : ( leftHandSideExpression | ^( ASSIGN expr expr ) | ^( MULASS expr expr ) | ^( DIVASS expr expr ) | ^( MODASS expr expr ) | ^( ADDASS expr expr ) | ^( SUBASS expr expr ) | ^( SHLASS expr expr ) | ^( SHRASS expr expr ) | ^( SHUASS expr expr ) | ^( ANDASS expr expr ) | ^( XORASS expr expr ) | ^( ORASS expr expr ) | ^( QUE expr expr expr ) | ^( LOR expr expr ) | ^( LAND expr expr ) | ^( AND expr expr ) | ^( OR expr expr ) | ^( XOR expr expr ) | ^( EQ expr expr ) | ^( NEQ expr expr ) | ^( SAME expr expr ) | ^( NSAME expr expr ) | ^( LT expr expr ) | ^( GT expr expr ) | ^( LTE expr expr ) | ^( GTE expr expr ) | ^( INSTANCEOF expr expr ) | ^( IN expr expr ) | ^( SHL expr expr ) | ^( SHR expr expr ) | ^( SHU expr expr ) | ^( ADD expr expr ) | ^( SUB expr expr ) | ^( MUL expr expr ) | ^( DIV expr expr ) | ^( MOD expr expr ) | ^( DELETE expr ) | ^( VOID expr ) | ^( TYPEOF expr ) | ^( INC expr ) | ^( DEC expr ) | ^( POS expr ) | ^( NEG expr ) | ^( INV expr ) | ^( NOT expr ) | ^( PINC expr ) | ^( PDEC expr ) );
    // $ANTLR start "expr"
    expr: function() {
        try {
            // ../MmirES3Walker.g:166:2: ( leftHandSideExpression | ^( ASSIGN expr expr ) | ^( MULASS expr expr ) | ^( DIVASS expr expr ) | ^( MODASS expr expr ) | ^( ADDASS expr expr ) | ^( SUBASS expr expr ) | ^( SHLASS expr expr ) | ^( SHRASS expr expr ) | ^( SHUASS expr expr ) | ^( ANDASS expr expr ) | ^( XORASS expr expr ) | ^( ORASS expr expr ) | ^( QUE expr expr expr ) | ^( LOR expr expr ) | ^( LAND expr expr ) | ^( AND expr expr ) | ^( OR expr expr ) | ^( XOR expr expr ) | ^( EQ expr expr ) | ^( NEQ expr expr ) | ^( SAME expr expr ) | ^( NSAME expr expr ) | ^( LT expr expr ) | ^( GT expr expr ) | ^( LTE expr expr ) | ^( GTE expr expr ) | ^( INSTANCEOF expr expr ) | ^( IN expr expr ) | ^( SHL expr expr ) | ^( SHR expr expr ) | ^( SHU expr expr ) | ^( ADD expr expr ) | ^( SUB expr expr ) | ^( MUL expr expr ) | ^( DIV expr expr ) | ^( MOD expr expr ) | ^( DELETE expr ) | ^( VOID expr ) | ^( TYPEOF expr ) | ^( INC expr ) | ^( DEC expr ) | ^( POS expr ) | ^( NEG expr ) | ^( INV expr ) | ^( NOT expr ) | ^( PINC expr ) | ^( PDEC expr ) )
            var alt21=48;
            switch ( this.input.LA(1) ) {
            case NULL:
            case TRUE:
            case FALSE:
            case FUNCTION:
            case NEW:
            case THIS:
            case ARRAY:
            case BYFIELD:
            case BYINDEX:
            case CALL:
            case OBJECT:
            case Identifier:
            case StringLiteral:
            case IdentifierNameAmpersatStart:
            case RegularExpressionLiteral:
            case DecimalLiteral:
            case OctalIntegerLiteral:
            case HexIntegerLiteral:
                alt21=1;
                break;
            case ASSIGN:
                alt21=2;
                break;
            case MULASS:
                alt21=3;
                break;
            case DIVASS:
                alt21=4;
                break;
            case MODASS:
                alt21=5;
                break;
            case ADDASS:
                alt21=6;
                break;
            case SUBASS:
                alt21=7;
                break;
            case SHLASS:
                alt21=8;
                break;
            case SHRASS:
                alt21=9;
                break;
            case SHUASS:
                alt21=10;
                break;
            case ANDASS:
                alt21=11;
                break;
            case XORASS:
                alt21=12;
                break;
            case ORASS:
                alt21=13;
                break;
            case QUE:
                alt21=14;
                break;
            case LOR:
                alt21=15;
                break;
            case LAND:
                alt21=16;
                break;
            case AND:
                alt21=17;
                break;
            case OR:
                alt21=18;
                break;
            case XOR:
                alt21=19;
                break;
            case EQ:
                alt21=20;
                break;
            case NEQ:
                alt21=21;
                break;
            case SAME:
                alt21=22;
                break;
            case NSAME:
                alt21=23;
                break;
            case LT:
                alt21=24;
                break;
            case GT:
                alt21=25;
                break;
            case LTE:
                alt21=26;
                break;
            case GTE:
                alt21=27;
                break;
            case INSTANCEOF:
                alt21=28;
                break;
            case IN:
                alt21=29;
                break;
            case SHL:
                alt21=30;
                break;
            case SHR:
                alt21=31;
                break;
            case SHU:
                alt21=32;
                break;
            case ADD:
                alt21=33;
                break;
            case SUB:
                alt21=34;
                break;
            case MUL:
                alt21=35;
                break;
            case DIV:
                alt21=36;
                break;
            case MOD:
                alt21=37;
                break;
            case DELETE:
                alt21=38;
                break;
            case VOID:
                alt21=39;
                break;
            case TYPEOF:
                alt21=40;
                break;
            case INC:
                alt21=41;
                break;
            case DEC:
                alt21=42;
                break;
            case POS:
                alt21=43;
                break;
            case NEG:
                alt21=44;
                break;
            case INV:
                alt21=45;
                break;
            case NOT:
                alt21=46;
                break;
            case PINC:
                alt21=47;
                break;
            case PDEC:
                alt21=48;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 21, 0, this.input);

                throw nvae;
            }

            switch (alt21) {
                case 1 :
                    // ../MmirES3Walker.g:166:4: leftHandSideExpression
                    this.pushFollow(MmirES3Walker.FOLLOW_leftHandSideExpression_in_expr633);
                    this.leftHandSideExpression();

                    this.state._fsp--;



                    break;
                case 2 :
                    // ../MmirES3Walker.g:169:4: ^( ASSIGN expr expr )
                    this.match(this.input,ASSIGN,MmirES3Walker.FOLLOW_ASSIGN_in_expr644); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr646);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr648);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 3 :
                    // ../MmirES3Walker.g:170:4: ^( MULASS expr expr )
                    this.match(this.input,MULASS,MmirES3Walker.FOLLOW_MULASS_in_expr657); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr659);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr661);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 4 :
                    // ../MmirES3Walker.g:171:4: ^( DIVASS expr expr )
                    this.match(this.input,DIVASS,MmirES3Walker.FOLLOW_DIVASS_in_expr670); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr672);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr674);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 5 :
                    // ../MmirES3Walker.g:172:4: ^( MODASS expr expr )
                    this.match(this.input,MODASS,MmirES3Walker.FOLLOW_MODASS_in_expr683); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr685);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr687);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 6 :
                    // ../MmirES3Walker.g:173:4: ^( ADDASS expr expr )
                    this.match(this.input,ADDASS,MmirES3Walker.FOLLOW_ADDASS_in_expr696); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr698);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr700);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 7 :
                    // ../MmirES3Walker.g:174:4: ^( SUBASS expr expr )
                    this.match(this.input,SUBASS,MmirES3Walker.FOLLOW_SUBASS_in_expr709); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr711);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr713);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 8 :
                    // ../MmirES3Walker.g:175:4: ^( SHLASS expr expr )
                    this.match(this.input,SHLASS,MmirES3Walker.FOLLOW_SHLASS_in_expr722); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr724);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr726);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 9 :
                    // ../MmirES3Walker.g:176:4: ^( SHRASS expr expr )
                    this.match(this.input,SHRASS,MmirES3Walker.FOLLOW_SHRASS_in_expr735); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr737);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr739);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 10 :
                    // ../MmirES3Walker.g:177:4: ^( SHUASS expr expr )
                    this.match(this.input,SHUASS,MmirES3Walker.FOLLOW_SHUASS_in_expr748); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr750);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr752);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 11 :
                    // ../MmirES3Walker.g:178:4: ^( ANDASS expr expr )
                    this.match(this.input,ANDASS,MmirES3Walker.FOLLOW_ANDASS_in_expr761); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr763);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr765);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 12 :
                    // ../MmirES3Walker.g:179:4: ^( XORASS expr expr )
                    this.match(this.input,XORASS,MmirES3Walker.FOLLOW_XORASS_in_expr774); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr776);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr778);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 13 :
                    // ../MmirES3Walker.g:180:4: ^( ORASS expr expr )
                    this.match(this.input,ORASS,MmirES3Walker.FOLLOW_ORASS_in_expr787); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr789);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr791);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 14 :
                    // ../MmirES3Walker.g:183:4: ^( QUE expr expr expr )
                    this.match(this.input,QUE,MmirES3Walker.FOLLOW_QUE_in_expr804); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr806);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr808);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr810);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 15 :
                    // ../MmirES3Walker.g:186:4: ^( LOR expr expr )
                    this.match(this.input,LOR,MmirES3Walker.FOLLOW_LOR_in_expr823); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr825);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr827);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 16 :
                    // ../MmirES3Walker.g:187:4: ^( LAND expr expr )
                    this.match(this.input,LAND,MmirES3Walker.FOLLOW_LAND_in_expr836); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr838);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr840);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 17 :
                    // ../MmirES3Walker.g:190:4: ^( AND expr expr )
                    this.match(this.input,AND,MmirES3Walker.FOLLOW_AND_in_expr853); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr855);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr857);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 18 :
                    // ../MmirES3Walker.g:191:4: ^( OR expr expr )
                    this.match(this.input,OR,MmirES3Walker.FOLLOW_OR_in_expr866); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr868);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr870);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 19 :
                    // ../MmirES3Walker.g:192:4: ^( XOR expr expr )
                    this.match(this.input,XOR,MmirES3Walker.FOLLOW_XOR_in_expr879); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr881);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr883);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 20 :
                    // ../MmirES3Walker.g:195:4: ^( EQ expr expr )
                    this.match(this.input,EQ,MmirES3Walker.FOLLOW_EQ_in_expr896); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr898);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr900);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 21 :
                    // ../MmirES3Walker.g:196:4: ^( NEQ expr expr )
                    this.match(this.input,NEQ,MmirES3Walker.FOLLOW_NEQ_in_expr909); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr911);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr913);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 22 :
                    // ../MmirES3Walker.g:197:4: ^( SAME expr expr )
                    this.match(this.input,SAME,MmirES3Walker.FOLLOW_SAME_in_expr922); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr924);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr926);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 23 :
                    // ../MmirES3Walker.g:198:4: ^( NSAME expr expr )
                    this.match(this.input,NSAME,MmirES3Walker.FOLLOW_NSAME_in_expr935); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr937);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr939);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 24 :
                    // ../MmirES3Walker.g:201:4: ^( LT expr expr )
                    this.match(this.input,LT,MmirES3Walker.FOLLOW_LT_in_expr952); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr954);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr956);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 25 :
                    // ../MmirES3Walker.g:202:4: ^( GT expr expr )
                    this.match(this.input,GT,MmirES3Walker.FOLLOW_GT_in_expr965); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr967);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr969);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 26 :
                    // ../MmirES3Walker.g:203:4: ^( LTE expr expr )
                    this.match(this.input,LTE,MmirES3Walker.FOLLOW_LTE_in_expr978); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr980);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr982);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 27 :
                    // ../MmirES3Walker.g:204:4: ^( GTE expr expr )
                    this.match(this.input,GTE,MmirES3Walker.FOLLOW_GTE_in_expr991); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr993);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr995);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 28 :
                    // ../MmirES3Walker.g:205:4: ^( INSTANCEOF expr expr )
                    this.match(this.input,INSTANCEOF,MmirES3Walker.FOLLOW_INSTANCEOF_in_expr1004); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr1006);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr1008);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 29 :
                    // ../MmirES3Walker.g:206:4: ^( IN expr expr )
                    this.match(this.input,IN,MmirES3Walker.FOLLOW_IN_in_expr1017); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr1019);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr1021);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 30 :
                    // ../MmirES3Walker.g:209:4: ^( SHL expr expr )
                    this.match(this.input,SHL,MmirES3Walker.FOLLOW_SHL_in_expr1034); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr1036);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr1038);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 31 :
                    // ../MmirES3Walker.g:210:4: ^( SHR expr expr )
                    this.match(this.input,SHR,MmirES3Walker.FOLLOW_SHR_in_expr1047); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr1049);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr1051);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 32 :
                    // ../MmirES3Walker.g:211:4: ^( SHU expr expr )
                    this.match(this.input,SHU,MmirES3Walker.FOLLOW_SHU_in_expr1060); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr1062);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr1064);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 33 :
                    // ../MmirES3Walker.g:214:4: ^( ADD expr expr )
                    this.match(this.input,ADD,MmirES3Walker.FOLLOW_ADD_in_expr1077); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr1079);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr1081);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 34 :
                    // ../MmirES3Walker.g:215:4: ^( SUB expr expr )
                    this.match(this.input,SUB,MmirES3Walker.FOLLOW_SUB_in_expr1090); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr1092);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr1094);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 35 :
                    // ../MmirES3Walker.g:218:4: ^( MUL expr expr )
                    this.match(this.input,MUL,MmirES3Walker.FOLLOW_MUL_in_expr1107); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr1109);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr1111);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 36 :
                    // ../MmirES3Walker.g:219:4: ^( DIV expr expr )
                    this.match(this.input,DIV,MmirES3Walker.FOLLOW_DIV_in_expr1120); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr1122);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr1124);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 37 :
                    // ../MmirES3Walker.g:220:4: ^( MOD expr expr )
                    this.match(this.input,MOD,MmirES3Walker.FOLLOW_MOD_in_expr1133); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr1135);
                    this.expr();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr1137);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 38 :
                    // ../MmirES3Walker.g:223:4: ^( DELETE expr )
                    this.match(this.input,DELETE,MmirES3Walker.FOLLOW_DELETE_in_expr1150); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr1152);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 39 :
                    // ../MmirES3Walker.g:224:4: ^( VOID expr )
                    this.match(this.input,VOID,MmirES3Walker.FOLLOW_VOID_in_expr1161); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr1163);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 40 :
                    // ../MmirES3Walker.g:225:4: ^( TYPEOF expr )
                    this.match(this.input,TYPEOF,MmirES3Walker.FOLLOW_TYPEOF_in_expr1172); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr1174);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 41 :
                    // ../MmirES3Walker.g:226:4: ^( INC expr )
                    this.match(this.input,INC,MmirES3Walker.FOLLOW_INC_in_expr1183); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr1185);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 42 :
                    // ../MmirES3Walker.g:227:4: ^( DEC expr )
                    this.match(this.input,DEC,MmirES3Walker.FOLLOW_DEC_in_expr1194); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr1196);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 43 :
                    // ../MmirES3Walker.g:228:4: ^( POS expr )
                    this.match(this.input,POS,MmirES3Walker.FOLLOW_POS_in_expr1205); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr1207);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 44 :
                    // ../MmirES3Walker.g:229:4: ^( NEG expr )
                    this.match(this.input,NEG,MmirES3Walker.FOLLOW_NEG_in_expr1216); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr1218);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 45 :
                    // ../MmirES3Walker.g:230:4: ^( INV expr )
                    this.match(this.input,INV,MmirES3Walker.FOLLOW_INV_in_expr1227); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr1229);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 46 :
                    // ../MmirES3Walker.g:231:4: ^( NOT expr )
                    this.match(this.input,NOT,MmirES3Walker.FOLLOW_NOT_in_expr1238); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr1240);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 47 :
                    // ../MmirES3Walker.g:234:4: ^( PINC expr )
                    this.match(this.input,PINC,MmirES3Walker.FOLLOW_PINC_in_expr1253); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr1255);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 48 :
                    // ../MmirES3Walker.g:235:4: ^( PDEC expr )
                    this.match(this.input,PDEC,MmirES3Walker.FOLLOW_PDEC_in_expr1264); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_expr1266);
                    this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


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


    // ../MmirES3Walker.g:238:1: leftHandSideExpression : ( primaryExpression | newExpression | functionDeclaration | callExpression | memberExpression );
    // $ANTLR start "leftHandSideExpression"
    leftHandSideExpression: function() {
        try {
            // ../MmirES3Walker.g:239:2: ( primaryExpression | newExpression | functionDeclaration | callExpression | memberExpression )
            var alt22=5;
            switch ( this.input.LA(1) ) {
            case NULL:
            case TRUE:
            case FALSE:
            case THIS:
            case ARRAY:
            case OBJECT:
            case Identifier:
            case StringLiteral:
            case IdentifierNameAmpersatStart:
            case RegularExpressionLiteral:
            case DecimalLiteral:
            case OctalIntegerLiteral:
            case HexIntegerLiteral:
                alt22=1;
                break;
            case NEW:
                alt22=2;
                break;
            case FUNCTION:
                alt22=3;
                break;
            case CALL:
                alt22=4;
                break;
            case BYFIELD:
            case BYINDEX:
                alt22=5;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 22, 0, this.input);

                throw nvae;
            }

            switch (alt22) {
                case 1 :
                    // ../MmirES3Walker.g:239:4: primaryExpression
                    this.pushFollow(MmirES3Walker.FOLLOW_primaryExpression_in_leftHandSideExpression1279);
                    this.primaryExpression();

                    this.state._fsp--;



                    break;
                case 2 :
                    // ../MmirES3Walker.g:240:4: newExpression
                    this.pushFollow(MmirES3Walker.FOLLOW_newExpression_in_leftHandSideExpression1284);
                    this.newExpression();

                    this.state._fsp--;



                    break;
                case 3 :
                    // ../MmirES3Walker.g:241:4: functionDeclaration
                    this.pushFollow(MmirES3Walker.FOLLOW_functionDeclaration_in_leftHandSideExpression1289);
                    this.functionDeclaration();

                    this.state._fsp--;



                    break;
                case 4 :
                    // ../MmirES3Walker.g:242:4: callExpression
                    this.pushFollow(MmirES3Walker.FOLLOW_callExpression_in_leftHandSideExpression1294);
                    this.callExpression();

                    this.state._fsp--;



                    break;
                case 5 :
                    // ../MmirES3Walker.g:243:4: memberExpression
                    this.pushFollow(MmirES3Walker.FOLLOW_memberExpression_in_leftHandSideExpression1299);
                    this.memberExpression();

                    this.state._fsp--;



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


    // ../MmirES3Walker.g:246:1: newExpression : ^( NEW leftHandSideExpression ) ;
    // $ANTLR start "newExpression"
    newExpression: function() {
        try {
            // ../MmirES3Walker.g:247:2: ( ^( NEW leftHandSideExpression ) )
            // ../MmirES3Walker.g:247:4: ^( NEW leftHandSideExpression )
            this.match(this.input,NEW,MmirES3Walker.FOLLOW_NEW_in_newExpression1312); 

            this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
            this.pushFollow(MmirES3Walker.FOLLOW_leftHandSideExpression_in_newExpression1314);
            this.leftHandSideExpression();

            this.state._fsp--;


            this.match(this.input, org.antlr.runtime.Token.UP, null); 



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


    // ../MmirES3Walker.g:250:1: functionDeclaration : ^( FUNCTION ( Identifier )? ^( ARGS ( Identifier )* ) block ) ;
    // $ANTLR start "functionDeclaration"
    functionDeclaration: function() {
        try {
            // ../MmirES3Walker.g:251:2: ( ^( FUNCTION ( Identifier )? ^( ARGS ( Identifier )* ) block ) )
            // ../MmirES3Walker.g:251:4: ^( FUNCTION ( Identifier )? ^( ARGS ( Identifier )* ) block )
            this.match(this.input,FUNCTION,MmirES3Walker.FOLLOW_FUNCTION_in_functionDeclaration1329); 

            this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
            // ../MmirES3Walker.g:251:16: ( Identifier )?
            var alt23=2;
            var LA23_0 = this.input.LA(1);

            if ( (LA23_0==Identifier) ) {
                alt23=1;
            }
            switch (alt23) {
                case 1 :
                    // ../MmirES3Walker.g:251:16: Identifier
                    this.match(this.input,Identifier,MmirES3Walker.FOLLOW_Identifier_in_functionDeclaration1331); 


                    break;

            }

            this.match(this.input,ARGS,MmirES3Walker.FOLLOW_ARGS_in_functionDeclaration1336); 

            if ( this.input.LA(1)==org.antlr.runtime.Token.DOWN ) {
                this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                // ../MmirES3Walker.g:251:36: ( Identifier )*
                loop24:
                do {
                    var alt24=2;
                    var LA24_0 = this.input.LA(1);

                    if ( (LA24_0==Identifier) ) {
                        alt24=1;
                    }


                    switch (alt24) {
                    case 1 :
                        // ../MmirES3Walker.g:251:36: Identifier
                        this.match(this.input,Identifier,MmirES3Walker.FOLLOW_Identifier_in_functionDeclaration1338); 


                        break;

                    default :
                        break loop24;
                    }
                } while (true);


                this.match(this.input, org.antlr.runtime.Token.UP, null); 
            }
            this.pushFollow(MmirES3Walker.FOLLOW_block_in_functionDeclaration1343);
            this.block();

            this.state._fsp--;


            this.match(this.input, org.antlr.runtime.Token.UP, null); 



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


    // ../MmirES3Walker.g:254:1: callExpression : ^( CALL leftHandSideExpression ^( ARGS ( expr )* ) ) ;
    // $ANTLR start "callExpression"
    callExpression: function() {
        try {
            // ../MmirES3Walker.g:255:2: ( ^( CALL leftHandSideExpression ^( ARGS ( expr )* ) ) )
            // ../MmirES3Walker.g:255:4: ^( CALL leftHandSideExpression ^( ARGS ( expr )* ) )
            this.match(this.input,CALL,MmirES3Walker.FOLLOW_CALL_in_callExpression1358); 

            this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
            this.pushFollow(MmirES3Walker.FOLLOW_leftHandSideExpression_in_callExpression1360);
            this.leftHandSideExpression();

            this.state._fsp--;

            this.match(this.input,ARGS,MmirES3Walker.FOLLOW_ARGS_in_callExpression1364); 

            if ( this.input.LA(1)==org.antlr.runtime.Token.DOWN ) {
                this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                // ../MmirES3Walker.g:255:43: ( expr )*
                loop25:
                do {
                    var alt25=2;
                    var LA25_0 = this.input.LA(1);

                    if ( ((LA25_0>=NULL && LA25_0<=FALSE)||LA25_0==DELETE||LA25_0==FUNCTION||(LA25_0>=IN && LA25_0<=NEW)||LA25_0==THIS||LA25_0==TYPEOF||LA25_0==VOID||(LA25_0>=LT && LA25_0<=QUE)||(LA25_0>=ASSIGN && LA25_0<=DIVASS)||LA25_0==ARRAY||(LA25_0>=BYFIELD && LA25_0<=CALL)||(LA25_0>=NEG && LA25_0<=OBJECT)||(LA25_0>=PDEC && LA25_0<=POS)||(LA25_0>=Identifier && LA25_0<=StringLiteral)||LA25_0==IdentifierNameAmpersatStart||LA25_0==RegularExpressionLiteral||(LA25_0>=DecimalLiteral && LA25_0<=HexIntegerLiteral)) ) {
                        alt25=1;
                    }


                    switch (alt25) {
                    case 1 :
                        // ../MmirES3Walker.g:255:43: expr
                        this.pushFollow(MmirES3Walker.FOLLOW_expr_in_callExpression1366);
                        this.expr();

                        this.state._fsp--;



                        break;

                    default :
                        break loop25;
                    }
                } while (true);


                this.match(this.input, org.antlr.runtime.Token.UP, null); 
            }

            this.match(this.input, org.antlr.runtime.Token.UP, null); 



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


    // ../MmirES3Walker.g:258:1: memberExpression : ( ^( BYINDEX leftHandSideExpression expression ) | ^( BYFIELD leftHandSideExpression Identifier ) );
    // $ANTLR start "memberExpression"
    memberExpression: function() {
        try {
            // ../MmirES3Walker.g:259:2: ( ^( BYINDEX leftHandSideExpression expression ) | ^( BYFIELD leftHandSideExpression Identifier ) )
            var alt26=2;
            var LA26_0 = this.input.LA(1);

            if ( (LA26_0==BYINDEX) ) {
                alt26=1;
            }
            else if ( (LA26_0==BYFIELD) ) {
                alt26=2;
            }
            else {
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 26, 0, this.input);

                throw nvae;
            }
            switch (alt26) {
                case 1 :
                    // ../MmirES3Walker.g:259:4: ^( BYINDEX leftHandSideExpression expression )
                    this.match(this.input,BYINDEX,MmirES3Walker.FOLLOW_BYINDEX_in_memberExpression1385); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_leftHandSideExpression_in_memberExpression1387);
                    this.leftHandSideExpression();

                    this.state._fsp--;

                    this.pushFollow(MmirES3Walker.FOLLOW_expression_in_memberExpression1389);
                    this.expression();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


                    break;
                case 2 :
                    // ../MmirES3Walker.g:260:4: ^( BYFIELD leftHandSideExpression Identifier )
                    this.match(this.input,BYFIELD,MmirES3Walker.FOLLOW_BYFIELD_in_memberExpression1398); 

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                    this.pushFollow(MmirES3Walker.FOLLOW_leftHandSideExpression_in_memberExpression1400);
                    this.leftHandSideExpression();

                    this.state._fsp--;

                    this.match(this.input,Identifier,MmirES3Walker.FOLLOW_Identifier_in_memberExpression1402); 

                    this.match(this.input, org.antlr.runtime.Token.UP, null); 


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


    // ../MmirES3Walker.g:263:1: primaryExpression : (id= Identifier | amp= IdentifierNameAmpersatStart | literal );
    // $ANTLR start "primaryExpression"
    primaryExpression: function() {
        var id = null;
        var amp = null;

        try {
            // ../MmirES3Walker.g:264:2: (id= Identifier | amp= IdentifierNameAmpersatStart | literal )
            var alt27=3;
            switch ( this.input.LA(1) ) {
            case Identifier:
                alt27=1;
                break;
            case IdentifierNameAmpersatStart:
                alt27=2;
                break;
            case NULL:
            case TRUE:
            case FALSE:
            case THIS:
            case ARRAY:
            case OBJECT:
            case StringLiteral:
            case RegularExpressionLiteral:
            case DecimalLiteral:
            case OctalIntegerLiteral:
            case HexIntegerLiteral:
                alt27=3;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 27, 0, this.input);

                throw nvae;
            }

            switch (alt27) {
                case 1 :
                    // ../MmirES3Walker.g:264:4: id= Identifier
                    id=this.match(this.input,Identifier,MmirES3Walker.FOLLOW_Identifier_in_primaryExpression1417); 
                     this.identifiers.push(id); /*MODIFICATION: keep trac of Identifier */


                    break;
                case 2 :
                    // ../MmirES3Walker.g:265:4: amp= IdentifierNameAmpersatStart
                    amp=this.match(this.input,IdentifierNameAmpersatStart,MmirES3Walker.FOLLOW_IdentifierNameAmpersatStart_in_primaryExpression1426); 
                     this.ampersatIdentifiers.push(amp); /*MODIFICATION: keep trac of additional special ampersat-Identifier */


                    break;
                case 3 :
                    // ../MmirES3Walker.g:266:4: literal
                    this.pushFollow(MmirES3Walker.FOLLOW_literal_in_primaryExpression1433);
                    this.literal();

                    this.state._fsp--;



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


    // ../MmirES3Walker.g:269:1: literal : ( THIS | NULL | booleanLiteral | numericLiteral | StringLiteral | RegularExpressionLiteral | arrayLiteral | objectLiteral );
    // $ANTLR start "literal"
    literal: function() {
        try {
            // ../MmirES3Walker.g:270:2: ( THIS | NULL | booleanLiteral | numericLiteral | StringLiteral | RegularExpressionLiteral | arrayLiteral | objectLiteral )
            var alt28=8;
            switch ( this.input.LA(1) ) {
            case THIS:
                alt28=1;
                break;
            case NULL:
                alt28=2;
                break;
            case TRUE:
            case FALSE:
                alt28=3;
                break;
            case DecimalLiteral:
            case OctalIntegerLiteral:
            case HexIntegerLiteral:
                alt28=4;
                break;
            case StringLiteral:
                alt28=5;
                break;
            case RegularExpressionLiteral:
                alt28=6;
                break;
            case ARRAY:
                alt28=7;
                break;
            case OBJECT:
                alt28=8;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 28, 0, this.input);

                throw nvae;
            }

            switch (alt28) {
                case 1 :
                    // ../MmirES3Walker.g:270:4: THIS
                    this.match(this.input,THIS,MmirES3Walker.FOLLOW_THIS_in_literal1444); 


                    break;
                case 2 :
                    // ../MmirES3Walker.g:271:4: NULL
                    this.match(this.input,NULL,MmirES3Walker.FOLLOW_NULL_in_literal1449); 


                    break;
                case 3 :
                    // ../MmirES3Walker.g:272:4: booleanLiteral
                    this.pushFollow(MmirES3Walker.FOLLOW_booleanLiteral_in_literal1454);
                    this.booleanLiteral();

                    this.state._fsp--;



                    break;
                case 4 :
                    // ../MmirES3Walker.g:273:4: numericLiteral
                    this.pushFollow(MmirES3Walker.FOLLOW_numericLiteral_in_literal1459);
                    this.numericLiteral();

                    this.state._fsp--;



                    break;
                case 5 :
                    // ../MmirES3Walker.g:274:4: StringLiteral
                    this.match(this.input,StringLiteral,MmirES3Walker.FOLLOW_StringLiteral_in_literal1464); 


                    break;
                case 6 :
                    // ../MmirES3Walker.g:275:4: RegularExpressionLiteral
                    this.match(this.input,RegularExpressionLiteral,MmirES3Walker.FOLLOW_RegularExpressionLiteral_in_literal1469); 


                    break;
                case 7 :
                    // ../MmirES3Walker.g:276:4: arrayLiteral
                    this.pushFollow(MmirES3Walker.FOLLOW_arrayLiteral_in_literal1474);
                    this.arrayLiteral();

                    this.state._fsp--;



                    break;
                case 8 :
                    // ../MmirES3Walker.g:277:4: objectLiteral
                    this.pushFollow(MmirES3Walker.FOLLOW_objectLiteral_in_literal1479);
                    this.objectLiteral();

                    this.state._fsp--;



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


    // ../MmirES3Walker.g:280:1: booleanLiteral : ( TRUE | FALSE );
    // $ANTLR start "booleanLiteral"
    booleanLiteral: function() {
        try {
            // ../MmirES3Walker.g:281:2: ( TRUE | FALSE )
            // ../MmirES3Walker.g:
            if ( (this.input.LA(1)>=TRUE && this.input.LA(1)<=FALSE) ) {
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
    },


    // ../MmirES3Walker.g:285:1: numericLiteral : ( DecimalLiteral | OctalIntegerLiteral | HexIntegerLiteral );
    // $ANTLR start "numericLiteral"
    numericLiteral: function() {
        try {
            // ../MmirES3Walker.g:286:2: ( DecimalLiteral | OctalIntegerLiteral | HexIntegerLiteral )
            // ../MmirES3Walker.g:
            if ( (this.input.LA(1)>=DecimalLiteral && this.input.LA(1)<=HexIntegerLiteral) ) {
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
    },


    // ../MmirES3Walker.g:291:1: arrayLiteral : ^( ARRAY ( ^( ITEM ( expr )? ) )* ) ;
    // $ANTLR start "arrayLiteral"
    arrayLiteral: function() {
        try {
            // ../MmirES3Walker.g:292:2: ( ^( ARRAY ( ^( ITEM ( expr )? ) )* ) )
            // ../MmirES3Walker.g:292:4: ^( ARRAY ( ^( ITEM ( expr )? ) )* )
            this.match(this.input,ARRAY,MmirES3Walker.FOLLOW_ARRAY_in_arrayLiteral1529); 

            if ( this.input.LA(1)==org.antlr.runtime.Token.DOWN ) {
                this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                // ../MmirES3Walker.g:292:13: ( ^( ITEM ( expr )? ) )*
                loop30:
                do {
                    var alt30=2;
                    var LA30_0 = this.input.LA(1);

                    if ( (LA30_0==ITEM) ) {
                        alt30=1;
                    }


                    switch (alt30) {
                    case 1 :
                        // ../MmirES3Walker.g:292:15: ^( ITEM ( expr )? )
                        this.match(this.input,ITEM,MmirES3Walker.FOLLOW_ITEM_in_arrayLiteral1535); 

                        if ( this.input.LA(1)==org.antlr.runtime.Token.DOWN ) {
                            this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                            // ../MmirES3Walker.g:292:23: ( expr )?
                            var alt29=2;
                            var LA29_0 = this.input.LA(1);

                            if ( ((LA29_0>=NULL && LA29_0<=FALSE)||LA29_0==DELETE||LA29_0==FUNCTION||(LA29_0>=IN && LA29_0<=NEW)||LA29_0==THIS||LA29_0==TYPEOF||LA29_0==VOID||(LA29_0>=LT && LA29_0<=QUE)||(LA29_0>=ASSIGN && LA29_0<=DIVASS)||LA29_0==ARRAY||(LA29_0>=BYFIELD && LA29_0<=CALL)||(LA29_0>=NEG && LA29_0<=OBJECT)||(LA29_0>=PDEC && LA29_0<=POS)||(LA29_0>=Identifier && LA29_0<=StringLiteral)||LA29_0==IdentifierNameAmpersatStart||LA29_0==RegularExpressionLiteral||(LA29_0>=DecimalLiteral && LA29_0<=HexIntegerLiteral)) ) {
                                alt29=1;
                            }
                            switch (alt29) {
                                case 1 :
                                    // ../MmirES3Walker.g:292:23: expr
                                    this.pushFollow(MmirES3Walker.FOLLOW_expr_in_arrayLiteral1537);
                                    this.expr();

                                    this.state._fsp--;



                                    break;

                            }


                            this.match(this.input, org.antlr.runtime.Token.UP, null); 
                        }


                        break;

                    default :
                        break loop30;
                    }
                } while (true);


                this.match(this.input, org.antlr.runtime.Token.UP, null); 
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


    // ../MmirES3Walker.g:295:1: objectLiteral : ^( OBJECT ( ^( NAMEDVALUE propertyName expr ) )* ) ;
    // $ANTLR start "objectLiteral"
    objectLiteral: function() {
        try {
            // ../MmirES3Walker.g:296:2: ( ^( OBJECT ( ^( NAMEDVALUE propertyName expr ) )* ) )
            // ../MmirES3Walker.g:296:4: ^( OBJECT ( ^( NAMEDVALUE propertyName expr ) )* )
            this.match(this.input,OBJECT,MmirES3Walker.FOLLOW_OBJECT_in_objectLiteral1558); 

            if ( this.input.LA(1)==org.antlr.runtime.Token.DOWN ) {
                this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                // ../MmirES3Walker.g:296:14: ( ^( NAMEDVALUE propertyName expr ) )*
                loop31:
                do {
                    var alt31=2;
                    var LA31_0 = this.input.LA(1);

                    if ( (LA31_0==NAMEDVALUE) ) {
                        alt31=1;
                    }


                    switch (alt31) {
                    case 1 :
                        // ../MmirES3Walker.g:296:16: ^( NAMEDVALUE propertyName expr )
                        this.match(this.input,NAMEDVALUE,MmirES3Walker.FOLLOW_NAMEDVALUE_in_objectLiteral1564); 

                        this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
                        this.pushFollow(MmirES3Walker.FOLLOW_propertyName_in_objectLiteral1566);
                        this.propertyName();

                        this.state._fsp--;

                        this.pushFollow(MmirES3Walker.FOLLOW_expr_in_objectLiteral1568);
                        this.expr();

                        this.state._fsp--;


                        this.match(this.input, org.antlr.runtime.Token.UP, null); 


                        break;

                    default :
                        break loop31;
                    }
                } while (true);


                this.match(this.input, org.antlr.runtime.Token.UP, null); 
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


    // ../MmirES3Walker.g:299:1: propertyName : ( Identifier | StringLiteral | numericLiteral );
    // $ANTLR start "propertyName"
    propertyName: function() {
        try {
            // ../MmirES3Walker.g:300:2: ( Identifier | StringLiteral | numericLiteral )
            var alt32=3;
            switch ( this.input.LA(1) ) {
            case Identifier:
                alt32=1;
                break;
            case StringLiteral:
                alt32=2;
                break;
            case DecimalLiteral:
            case OctalIntegerLiteral:
            case HexIntegerLiteral:
                alt32=3;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 32, 0, this.input);

                throw nvae;
            }

            switch (alt32) {
                case 1 :
                    // ../MmirES3Walker.g:300:4: Identifier
                    this.match(this.input,Identifier,MmirES3Walker.FOLLOW_Identifier_in_propertyName1586); 


                    break;
                case 2 :
                    // ../MmirES3Walker.g:301:4: StringLiteral
                    this.match(this.input,StringLiteral,MmirES3Walker.FOLLOW_StringLiteral_in_propertyName1591); 


                    break;
                case 3 :
                    // ../MmirES3Walker.g:302:4: numericLiteral
                    this.pushFollow(MmirES3Walker.FOLLOW_numericLiteral_in_propertyName1596);
                    this.numericLiteral();

                    this.state._fsp--;



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


    // ../MmirES3Walker.g:310:1: embeddedForControlStatement : ^( FOR forControl ) ;
    // $ANTLR start "embeddedForControlStatement"
    embeddedForControlStatement: function() {
        try {
            // ../MmirES3Walker.g:311:2: ( ^( FOR forControl ) )
            // ../MmirES3Walker.g:311:4: ^( FOR forControl )
            this.match(this.input,FOR,MmirES3Walker.FOLLOW_FOR_in_embeddedForControlStatement1611); 

            this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
            this.pushFollow(MmirES3Walker.FOLLOW_forControl_in_embeddedForControlStatement1613);
            this.forControl();

            this.state._fsp--;


            this.match(this.input, org.antlr.runtime.Token.UP, null); 



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


    // ../MmirES3Walker.g:318:1: embeddedIfExpressionFragment : ^( IF expression ) ;
    // $ANTLR start "embeddedIfExpressionFragment"
    embeddedIfExpressionFragment: function() {
        try {
            // ../MmirES3Walker.g:319:2: ( ^( IF expression ) )
            // ../MmirES3Walker.g:319:4: ^( IF expression )
            this.match(this.input,IF,MmirES3Walker.FOLLOW_IF_in_embeddedIfExpressionFragment1627); 

            this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
            this.pushFollow(MmirES3Walker.FOLLOW_expression_in_embeddedIfExpressionFragment1629);
            this.expression();

            this.state._fsp--;


            this.match(this.input, org.antlr.runtime.Token.UP, null); 



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


    // ../MmirES3Walker.g:326:1: embeddedRenderControlStatement : ^( RENDER callParam callParam ( callData )? ) ;
    // $ANTLR start "embeddedRenderControlStatement"
    embeddedRenderControlStatement: function() {
        try {
            // ../MmirES3Walker.g:327:2: ( ^( RENDER callParam callParam ( callData )? ) )
            // ../MmirES3Walker.g:327:4: ^( RENDER callParam callParam ( callData )? )
            this.match(this.input,RENDER,MmirES3Walker.FOLLOW_RENDER_in_embeddedRenderControlStatement1644); 

            this.match(this.input, org.antlr.runtime.Token.DOWN, null); 
            this.pushFollow(MmirES3Walker.FOLLOW_callParam_in_embeddedRenderControlStatement1646);
            this.callParam();

            this.state._fsp--;

            this.pushFollow(MmirES3Walker.FOLLOW_callParam_in_embeddedRenderControlStatement1648);
            this.callParam();

            this.state._fsp--;

            // ../MmirES3Walker.g:327:34: ( callData )?
            var alt33=2;
            var LA33_0 = this.input.LA(1);

            if ( (LA33_0==OBJECT||(LA33_0>=Identifier && LA33_0<=StringLiteral)||LA33_0==IdentifierNameAmpersatStart||(LA33_0>=DecimalLiteral && LA33_0<=HexIntegerLiteral)) ) {
                alt33=1;
            }
            switch (alt33) {
                case 1 :
                    // ../MmirES3Walker.g:327:34: callData
                    this.pushFollow(MmirES3Walker.FOLLOW_callData_in_embeddedRenderControlStatement1650);
                    this.callData();

                    this.state._fsp--;



                    break;

            }


            this.match(this.input, org.antlr.runtime.Token.UP, null); 



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


    // ../MmirES3Walker.g:333:1: callParam : (amp= IdentifierNameAmpersatStart | id= Identifier | StringLiteral );
    // $ANTLR start "callParam"
    callParam: function() {
        var amp = null;
        var id = null;

        try {
            // ../MmirES3Walker.g:334:2: (amp= IdentifierNameAmpersatStart | id= Identifier | StringLiteral )
            var alt34=3;
            switch ( this.input.LA(1) ) {
            case IdentifierNameAmpersatStart:
                alt34=1;
                break;
            case Identifier:
                alt34=2;
                break;
            case StringLiteral:
                alt34=3;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 34, 0, this.input);

                throw nvae;
            }

            switch (alt34) {
                case 1 :
                    // ../MmirES3Walker.g:334:4: amp= IdentifierNameAmpersatStart
                    amp=this.match(this.input,IdentifierNameAmpersatStart,MmirES3Walker.FOLLOW_IdentifierNameAmpersatStart_in_callParam1667); 
                     this.ampersatIdentifiers.push(amp); /*MODIFICATION: keep trac of additional special ampersat-Identifier */


                    break;
                case 2 :
                    // ../MmirES3Walker.g:335:4: id= Identifier
                    id=this.match(this.input,Identifier,MmirES3Walker.FOLLOW_Identifier_in_callParam1676); 
                     this.identifiers.push(id); /*MODIFICATION: keep trac of Identifier */


                    break;
                case 3 :
                    // ../MmirES3Walker.g:336:4: StringLiteral
                    this.match(this.input,StringLiteral,MmirES3Walker.FOLLOW_StringLiteral_in_callParam1683); 


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


    // ../MmirES3Walker.g:341:1: callData : ( objectLiteral | callParam | numericLiteral );
    // $ANTLR start "callData"
    callData: function() {
        try {
            // ../MmirES3Walker.g:342:2: ( objectLiteral | callParam | numericLiteral )
            var alt35=3;
            switch ( this.input.LA(1) ) {
            case OBJECT:
                alt35=1;
                break;
            case Identifier:
            case StringLiteral:
            case IdentifierNameAmpersatStart:
                alt35=2;
                break;
            case DecimalLiteral:
            case OctalIntegerLiteral:
            case HexIntegerLiteral:
                alt35=3;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 35, 0, this.input);

                throw nvae;
            }

            switch (alt35) {
                case 1 :
                    // ../MmirES3Walker.g:342:4: objectLiteral
                    this.pushFollow(MmirES3Walker.FOLLOW_objectLiteral_in_callData1697);
                    this.objectLiteral();

                    this.state._fsp--;



                    break;
                case 2 :
                    // ../MmirES3Walker.g:342:20: callParam
                    this.pushFollow(MmirES3Walker.FOLLOW_callParam_in_callData1701);
                    this.callParam();

                    this.state._fsp--;



                    break;
                case 3 :
                    // ../MmirES3Walker.g:342:32: numericLiteral
                    this.pushFollow(MmirES3Walker.FOLLOW_numericLiteral_in_callData1705);
                    this.numericLiteral();

                    this.state._fsp--;



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
    }

    // Delegated rules




}, true); // important to pass true to overwrite default implementations

 

// public class variables
org.antlr.lang.augmentObject(MmirES3Walker, {
    tokenNames: ["<invalid>", "<EOR>", "<DOWN>", "<UP>", "RENDER", "AMPERSAT", "NULL", "TRUE", "FALSE", "BREAK", "CASE", "CATCH", "CONTINUE", "DEFAULT", "DELETE", "DO", "ELSE", "FINALLY", "FOR", "FUNCTION", "IF", "IN", "INSTANCEOF", "NEW", "RETURN", "SWITCH", "THIS", "THROW", "TRY", "TYPEOF", "VAR", "VOID", "WHILE", "WITH", "ABSTRACT", "BOOLEAN", "BYTE", "CHAR", "CLASS", "CONST", "DEBUGGER", "DOUBLE", "ENUM", "EXPORT", "EXTENDS", "FINAL", "FLOAT", "GOTO", "IMPLEMENTS", "IMPORT", "INT", "INTERFACE", "LONG", "NATIVE", "PACKAGE", "PRIVATE", "PROTECTED", "PUBLIC", "SHORT", "STATIC", "SUPER", "SYNCHRONIZED", "THROWS", "TRANSIENT", "VOLATILE", "LBRACE", "RBRACE", "LBRACK", "RBRACK", "DOT", "SEMIC", "COMMA", "LT", "GT", "LTE", "GTE", "EQ", "NEQ", "SAME", "NSAME", "ADD", "SUB", "MUL", "MOD", "INC", "DEC", "SHL", "SHR", "SHU", "AND", "OR", "XOR", "NOT", "INV", "LAND", "LOR", "QUE", "COLON", "ASSIGN", "ADDASS", "SUBASS", "MULASS", "MODASS", "SHLASS", "SHRASS", "SHUASS", "ANDASS", "ORASS", "XORASS", "DIV", "DIVASS", "ARGS", "ARRAY", "BLOCK", "BYFIELD", "BYINDEX", "CALL", "CEXPR", "EXPR", "FORITER", "FORSTEP", "ITEM", "LABELLED", "NAMEDVALUE", "NEG", "OBJECT", "PAREXPR", "PDEC", "PINC", "POS", "BSLASH", "DQUOTE", "SQUOTE", "TAB", "VT", "FF", "SP", "NBSP", "USP", "WhiteSpace", "LF", "CR", "LS", "PS", "LineTerminator", "EOL", "MultiLineComment", "SingleLineComment", "Identifier", "StringLiteral", "HexDigit", "IdentifierStartASCII", "DecimalDigit", "IdentifierPart", "IdentifierNameASCIIStart", "IdentifierNameAmpersatStart", "LPAREN", "RPAREN", "RegularExpressionLiteral", "OctalDigit", "ExponentPart", "DecimalIntegerLiteral", "DecimalLiteral", "OctalIntegerLiteral", "HexIntegerLiteral", "CharacterEscapeSequence", "ZeroToThree", "OctalEscapeSequence", "HexEscapeSequence", "UnicodeEscapeSequence", "EscapeSequence", "BackslashSequence", "RegularExpressionFirstChar", "RegularExpressionChar"],
    FOLLOW_statement_in_program54: new org.antlr.runtime.BitSet([0xFFFCD3C2, 0x00000003,0xFFFFFF00, 0xB43F7FFD,0x48300003, 0x0000001C]),
    FOLLOW_block_in_statement66: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_variableDeclaration_in_statement71: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_expression_in_statement76: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_ifStatement_in_statement81: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_doStatement_in_statement86: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_whileStatement_in_statement91: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_forStatement_in_statement96: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_continueStatement_in_statement101: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_breakStatement_in_statement106: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_returnStatement_in_statement111: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_withStatement_in_statement116: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_labelledStatement_in_statement121: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_switchStatement_in_statement126: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_throwStatement_in_statement131: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_tryStatement_in_statement136: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_BLOCK_in_block149: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_statement_in_block151: new org.antlr.runtime.BitSet([0xFFFCD3C8, 0x00000003,0xFFFFFF00, 0xB43F7FFD,0x48300003, 0x0000001C]),
    FOLLOW_VAR_in_variableDeclaration167: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_Identifier_in_variableDeclaration173: new org.antlr.runtime.BitSet([0x00000008, 0x00000000,0x00000000, 0x00000004,0x00100000, 0x00000000]),
    FOLLOW_ASSIGN_in_variableDeclaration179: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_Identifier_in_variableDeclaration183: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_variableDeclaration185: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_IF_in_ifStatement208: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expression_in_ifStatement210: new org.antlr.runtime.BitSet([0xFFFCD3C8, 0x00000003,0xFFFFFF00, 0xB43F7FFD,0x48300003, 0x0000001C]),
    FOLLOW_statement_in_ifStatement212: new org.antlr.runtime.BitSet([0xFFFCD3C8, 0x00000003,0xFFFFFF00, 0xB43F7FFD,0x48300003, 0x0000001C]),
    FOLLOW_DO_in_doStatement228: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_statement_in_doStatement230: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB03D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expression_in_doStatement232: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_WHILE_in_whileStatement247: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expression_in_whileStatement249: new org.antlr.runtime.BitSet([0xFFFCD3C8, 0x00000003,0xFFFFFF00, 0xB43F7FFD,0x48300003, 0x0000001C]),
    FOLLOW_statement_in_whileStatement251: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_FOR_in_forStatement268: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_forControl_in_forStatement270: new org.antlr.runtime.BitSet([0xFFFCD3C8, 0x00000003,0xFFFFFF00, 0xB43F7FFD,0x48300003, 0x0000001C]),
    FOLLOW_statement_in_forStatement272: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_FORSTEP_in_forControl291: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_exprOptClause_in_forControl295: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00400000]),
    FOLLOW_variableDeclaration_in_forControl299: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00400000]),
    FOLLOW_exprOptClause_in_forControl303: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00400000]),
    FOLLOW_exprOptClause_in_forControl305: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_FORITER_in_forControl315: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_exprClause_in_forControl319: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00400000]),
    FOLLOW_variableDeclaration_in_forControl323: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00400000]),
    FOLLOW_exprClause_in_forControl327: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_EXPR_in_exprOptClause345: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expression_in_exprOptClause347: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_EXPR_in_exprClause363: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expression_in_exprClause365: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_CONTINUE_in_continueStatement380: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_Identifier_in_continueStatement382: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_BREAK_in_breakStatement398: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_Identifier_in_breakStatement400: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_RETURN_in_returnStatement416: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expression_in_returnStatement418: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_WITH_in_withStatement434: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expression_in_withStatement436: new org.antlr.runtime.BitSet([0xFFFCD3C8, 0x00000003,0xFFFFFF00, 0xB43F7FFD,0x48300003, 0x0000001C]),
    FOLLOW_statement_in_withStatement438: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_LABELLED_in_labelledStatement453: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_Identifier_in_labelledStatement455: new org.antlr.runtime.BitSet([0xFFFCD3C8, 0x00000003,0xFFFFFF00, 0xB43F7FFD,0x48300003, 0x0000001C]),
    FOLLOW_statement_in_labelledStatement457: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_SWITCH_in_switchStatement472: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expression_in_switchStatement474: new org.antlr.runtime.BitSet([0x00002408, 0x00000000]),
    FOLLOW_defaultClause_in_switchStatement476: new org.antlr.runtime.BitSet([0x00000408, 0x00000000]),
    FOLLOW_caseClause_in_switchStatement479: new org.antlr.runtime.BitSet([0x00000408, 0x00000000]),
    FOLLOW_DEFAULT_in_defaultClause495: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_statement_in_defaultClause497: new org.antlr.runtime.BitSet([0xFFFCD3C8, 0x00000003,0xFFFFFF00, 0xB43F7FFD,0x48300003, 0x0000001C]),
    FOLLOW_CASE_in_caseClause513: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expression_in_caseClause515: new org.antlr.runtime.BitSet([0xFFFCD3C8, 0x00000003,0xFFFFFF00, 0xB43F7FFD,0x48300003, 0x0000001C]),
    FOLLOW_statement_in_caseClause517: new org.antlr.runtime.BitSet([0xFFFCD3C8, 0x00000003,0xFFFFFF00, 0xB43F7FFD,0x48300003, 0x0000001C]),
    FOLLOW_THROW_in_throwStatement533: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expression_in_throwStatement535: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_TRY_in_tryStatement550: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_block_in_tryStatement552: new org.antlr.runtime.BitSet([0x00020808, 0x00000000]),
    FOLLOW_catchClause_in_tryStatement554: new org.antlr.runtime.BitSet([0x00020008, 0x00000000]),
    FOLLOW_finallyClause_in_tryStatement557: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_CATCH_in_catchClause574: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_Identifier_in_catchClause576: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00020000]),
    FOLLOW_block_in_catchClause578: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_FINALLY_in_finallyClause594: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_block_in_finallyClause596: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_expr_in_expression609: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_CEXPR_in_expression617: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expression619: new org.antlr.runtime.BitSet([0xA4E841C8, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_leftHandSideExpression_in_expr633: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_ASSIGN_in_expr644: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr646: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr648: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_MULASS_in_expr657: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr659: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr661: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_DIVASS_in_expr670: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr672: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr674: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_MODASS_in_expr683: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr685: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr687: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_ADDASS_in_expr696: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr698: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr700: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_SUBASS_in_expr709: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr711: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr713: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_SHLASS_in_expr722: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr724: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr726: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_SHRASS_in_expr735: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr737: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr739: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_SHUASS_in_expr748: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr750: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr752: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_ANDASS_in_expr761: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr763: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr765: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_XORASS_in_expr774: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr776: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr778: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_ORASS_in_expr787: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr789: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr791: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_QUE_in_expr804: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr806: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr808: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr810: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_LOR_in_expr823: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr825: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr827: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_LAND_in_expr836: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr838: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr840: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_AND_in_expr853: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr855: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr857: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_OR_in_expr866: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr868: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr870: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_XOR_in_expr879: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr881: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr883: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_EQ_in_expr896: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr898: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr900: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_NEQ_in_expr909: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr911: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr913: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_SAME_in_expr922: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr924: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr926: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_NSAME_in_expr935: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr937: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr939: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_LT_in_expr952: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr954: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr956: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_GT_in_expr965: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr967: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr969: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_LTE_in_expr978: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr980: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr982: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_GTE_in_expr991: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr993: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr995: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_INSTANCEOF_in_expr1004: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr1006: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr1008: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_IN_in_expr1017: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr1019: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr1021: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_SHL_in_expr1034: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr1036: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr1038: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_SHR_in_expr1047: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr1049: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr1051: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_SHU_in_expr1060: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr1062: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr1064: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_ADD_in_expr1077: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr1079: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr1081: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_SUB_in_expr1090: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr1092: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr1094: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_MUL_in_expr1107: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr1109: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr1111: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_DIV_in_expr1120: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr1122: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr1124: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_MOD_in_expr1133: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr1135: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_expr1137: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_DELETE_in_expr1150: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr1152: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_VOID_in_expr1161: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr1163: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_TYPEOF_in_expr1172: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr1174: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_INC_in_expr1183: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr1185: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_DEC_in_expr1194: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr1196: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_POS_in_expr1205: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr1207: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_NEG_in_expr1216: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr1218: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_INV_in_expr1227: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr1229: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_NOT_in_expr1238: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr1240: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_PINC_in_expr1253: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr1255: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_PDEC_in_expr1264: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr1266: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_primaryExpression_in_leftHandSideExpression1279: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_newExpression_in_leftHandSideExpression1284: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_functionDeclaration_in_leftHandSideExpression1289: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_callExpression_in_leftHandSideExpression1294: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_memberExpression_in_leftHandSideExpression1299: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_NEW_in_newExpression1312: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_leftHandSideExpression_in_newExpression1314: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_FUNCTION_in_functionDeclaration1329: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_Identifier_in_functionDeclaration1331: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00008000]),
    FOLLOW_ARGS_in_functionDeclaration1336: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_Identifier_in_functionDeclaration1338: new org.antlr.runtime.BitSet([0x00000008, 0x00000000,0x00000000, 0x00000000,0x00100000, 0x00000000]),
    FOLLOW_block_in_functionDeclaration1343: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_CALL_in_callExpression1358: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_leftHandSideExpression_in_callExpression1360: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00008000]),
    FOLLOW_ARGS_in_callExpression1364: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_callExpression1366: new org.antlr.runtime.BitSet([0xA4E841C8, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_BYINDEX_in_memberExpression1385: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_leftHandSideExpression_in_memberExpression1387: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB03D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expression_in_memberExpression1389: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_BYFIELD_in_memberExpression1398: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_leftHandSideExpression_in_memberExpression1400: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x00100000, 0x00000000]),
    FOLLOW_Identifier_in_memberExpression1402: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_Identifier_in_primaryExpression1417: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_IdentifierNameAmpersatStart_in_primaryExpression1426: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_literal_in_primaryExpression1433: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_THIS_in_literal1444: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_NULL_in_literal1449: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_booleanLiteral_in_literal1454: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_numericLiteral_in_literal1459: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_StringLiteral_in_literal1464: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_RegularExpressionLiteral_in_literal1469: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_arrayLiteral_in_literal1474: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_objectLiteral_in_literal1479: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_set_in_booleanLiteral0: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_set_in_numericLiteral0: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_ARRAY_in_arrayLiteral1529: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_ITEM_in_arrayLiteral1535: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_arrayLiteral1537: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_OBJECT_in_objectLiteral1558: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_NAMEDVALUE_in_objectLiteral1564: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_propertyName_in_objectLiteral1566: new org.antlr.runtime.BitSet([0xA4E841C0, 0x00000000,0xFFFFFF00, 0xB01D7FFD,0x48300003, 0x0000001C]),
    FOLLOW_expr_in_objectLiteral1568: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_Identifier_in_propertyName1586: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_StringLiteral_in_propertyName1591: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_numericLiteral_in_propertyName1596: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_FOR_in_embeddedForControlStatement1611: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_forControl_in_embeddedForControlStatement1613: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_IF_in_embeddedIfExpressionFragment1627: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expression_in_embeddedIfExpressionFragment1629: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_RENDER_in_embeddedRenderControlStatement1644: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_callParam_in_embeddedRenderControlStatement1646: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x08300000, 0x00000000]),
    FOLLOW_callParam_in_embeddedRenderControlStatement1648: new org.antlr.runtime.BitSet([0x040001C8, 0x00000000,0x00000000, 0x20010000,0x48300000, 0x0000001C]),
    FOLLOW_callData_in_embeddedRenderControlStatement1650: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_IdentifierNameAmpersatStart_in_callParam1667: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_Identifier_in_callParam1676: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_StringLiteral_in_callParam1683: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_objectLiteral_in_callData1697: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_callParam_in_callData1701: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_numericLiteral_in_callData1705: new org.antlr.runtime.BitSet([0x00000002, 0x00000000])
});

})();