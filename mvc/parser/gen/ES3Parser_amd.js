
define(['mmirf/antlr3'], function(org){

// $ANTLR 3.3 Nov 30, 2010 12:50:56 ES3.g3 2016-07-04 21:14:35

var ES3Parser = function(input, state) {
    if (!state) {
        state = new org.antlr.runtime.RecognizerSharedState();
    }

    (function(){

        //MODIFICATION: array for tracking ampersat-Identifiers
        this.ampersatIdentifiers = new Array();

        var theParser = ES3Parser;
        this.theParser = theParser;
        this.input = input;

        //private final boolean 
        function isLeftHandSideAssign(lhs, cached)//RuleReturnScope lhs, Object[] cached)
        {
        	if (cached[0] != null)
        	{
        		return cached[0] == true;//((Boolean)cached[0]).booleanValue();
        	}
        	
        //	boolean 
        	 var result;
        	if (this.isLeftHandSideExpression(lhs) == true)
        	{
        		switch (input.LA(1))
        		{
        			case theParser.ASSIGN:
        			case theParser.MULASS:
        			case theParser.DIVASS:
        			case theParser.MODASS:
        			case theParser.ADDASS:
        			case theParser.SUBASS:
        			case theParser.SHLASS:
        			case theParser.SHRASS:
        			case theParser.SHUASS:
        			case theParser.ANDASS:
        			case theParser.XORASS:
        			case theParser.ORASS:
        				result = true;
        				break;
        			default:
        				result = false;
        				break;
        		}
        	}
        	else
        	{
        		result = false;
        	}
        	
        	cached[0] = result;// new Boolean(result);
        	return result;
        }
        this.isLeftHandSideAssign = isLeftHandSideAssign;

        //private final static boolean 
        function isLeftHandSideExpression(lhs)//RuleReturnScope lhs)
        {
        	if (lhs.getTree() == null) // e.g. during backtracking
        	{
        		return true;
        	}
        	else
        	{
        		switch ((/*(Tree)*/lhs.getTree()).getType())
        		{
        		// primaryExpression
        			case theParser.THIS:
        			case theParser.Identifier:
        			case theParser.IdentifierNameAmpersatStart://MODIFICATION: do accept special amperat-Identifier as valid lhs
        			case theParser.NULL:
        			case theParser.TRUE:
        			case theParser.FALSE:
        			case theParser.DecimalLiteral:
        			case theParser.OctalIntegerLiteral:
        			case theParser.HexIntegerLiteral:
        			case theParser.StringLiteral:
        			case theParser.RegularExpressionLiteral:
        			case theParser.ARRAY:
        			case theParser.OBJECT:
        			case theParser.PAREXPR:
        		// functionExpression
        			case theParser.FUNCTION:
        		// newExpression
        			case theParser.NEW:
        		// leftHandSideExpression
        			case theParser.CALL:
        			case theParser.BYFIELD:
        			case theParser.BYINDEX:
        				return true;
        			
        			default:
        				return false;
        		}
        	}
        }
        this.isLeftHandSideExpression = isLeftHandSideExpression;
        	
        //private final boolean 
          function isLeftHandSideIn(lhs, cached)//RuleReturnScope lhs, Object[] cached)
        {
        	if (cached[0] != null)
        	{
        		return cached[0] == true;// ((Boolean)cached[0]).booleanValue();
        	}
        	
        	//boolean 
        	 var result = this.isLeftHandSideExpression(lhs) == true && (this.input.LA(1) == theParser.IN);
        	cached[0] = result;//new Boolean(result);
        	return result;
        }
        this.isLeftHandSideIn = isLeftHandSideIn;

        //private final void 
          function promoteEOL(rule)//ParserRuleReturnScope rule)
        {
        	// Get current token and its type (the possibly offending token).
        	//Token
        	var lt = this.input.LT(1);
        	//int
        	var la = lt.getType();
        	
        	// We only need to promote an EOL when the current token is offending (not a SEMIC, EOF, RBRACE, EOL or MultiLineComment).
        	// EOL and MultiLineComment are not offending as they're already promoted in a previous call to this method.
        	// Promoting an EOL means switching it from off channel to on channel.
        	// A MultiLineComment gets promoted when it contains an EOL.
        	if (!(la == theParser.SEMIC || la == theParser.EOF || la == theParser.RBRACE || la == theParser.EOL || la == theParser.MultiLineComment))
        	{
        		// Start on the possition before the current token and scan backwards off channel tokens until the previous on channel token.
        		for (/*int*/var ix = lt.getTokenIndex() - 1; ix > 0; ix--)
        		{
        			lt = this.input.get(ix);
        			if (lt.getChannel() == org.antlr.runtime.Token.DEFAULT_CHANNEL)
        			{
        				// On channel token found: stop scanning.
        				break;
        			}
        			else if (lt.getType() == theParser.EOL || (lt.getType() == theParser.MultiLineComment && lt.getText().matches("/.*\r\n|\r|\n")))
        			{
        				// We found our EOL: promote the token to on channel, position the input on it and reset the rule start.
        				lt.setChannel(org.antlr.runtime.Token.DEFAULT_CHANNEL);
        				this.input.seek(lt.getTokenIndex());
        				if (rule != null)
        				{
        					rule.start = lt;
        				}
        				break;
        			}
        		}
        	}
        }
        this.promoteEOL = promoteEOL

    }).call(this);

    ES3Parser.superclass.constructor.call(this, input, state);

    this.dfa43 = new ES3Parser.DFA43(this);
    this.dfa44 = new ES3Parser.DFA44(this);
    this.dfa74 = new ES3Parser.DFA74(this);

         

    /* @todo only create adaptor if output=AST */
    this.adaptor = new org.antlr.runtime.tree.CommonTreeAdaptor();

};

org.antlr.lang.augmentObject(ES3Parser, {
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

// public instance methods/vars
org.antlr.lang.extend(ES3Parser, org.antlr.runtime.Parser, {
        
    setTreeAdaptor: function(adaptor) {
        this.adaptor = adaptor;
    },
    getTreeAdaptor: function() {
        return this.adaptor;
    },

    getTokenNames: function() { return ES3Parser.tokenNames; },
    getGrammarFileName: function() { return "ES3.g3"; }
});
org.antlr.lang.augmentObject(ES3Parser.prototype, {

    // inline static return class
    token_return: (function() {
        ES3Parser.token_return = function(){};
        org.antlr.lang.extend(ES3Parser.token_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:830:1: token : ( reservedWord | Identifier | punctuator | numericLiteral | StringLiteral );
    // $ANTLR start "token"
    token: function() {
        var retval = new ES3Parser.token_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var Identifier2 = null;
        var StringLiteral5 = null;
         var reservedWord1 = null;
         var punctuator3 = null;
         var numericLiteral4 = null;

        var Identifier2_tree=null;
        var StringLiteral5_tree=null;

        try {
            // ES3.g3:831:2: ( reservedWord | Identifier | punctuator | numericLiteral | StringLiteral )
            var alt1=5;
            switch ( this.input.LA(1) ) {
            case NULL:
            case TRUE:
            case FALSE:
            case BREAK:
            case CASE:
            case CATCH:
            case CONTINUE:
            case DEFAULT:
            case DELETE:
            case DO:
            case ELSE:
            case FINALLY:
            case FOR:
            case FUNCTION:
            case IF:
            case IN:
            case INSTANCEOF:
            case NEW:
            case RETURN:
            case SWITCH:
            case THIS:
            case THROW:
            case TRY:
            case TYPEOF:
            case VAR:
            case VOID:
            case WHILE:
            case WITH:
            case ABSTRACT:
            case BOOLEAN:
            case BYTE:
            case CHAR:
            case CLASS:
            case CONST:
            case DEBUGGER:
            case DOUBLE:
            case ENUM:
            case EXPORT:
            case EXTENDS:
            case FINAL:
            case FLOAT:
            case GOTO:
            case IMPLEMENTS:
            case IMPORT:
            case INT:
            case INTERFACE:
            case LONG:
            case NATIVE:
            case PACKAGE:
            case PRIVATE:
            case PROTECTED:
            case PUBLIC:
            case SHORT:
            case STATIC:
            case SUPER:
            case SYNCHRONIZED:
            case THROWS:
            case TRANSIENT:
            case VOLATILE:
                alt1=1;
                break;
            case Identifier:
                alt1=2;
                break;
            case LBRACE:
            case RBRACE:
            case LBRACK:
            case RBRACK:
            case DOT:
            case SEMIC:
            case COMMA:
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
            case COLON:
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
            case LPAREN:
            case RPAREN:
                alt1=3;
                break;
            case DecimalLiteral:
            case OctalIntegerLiteral:
            case HexIntegerLiteral:
                alt1=4;
                break;
            case StringLiteral:
                alt1=5;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 1, 0, this.input);

                throw nvae;
            }

            switch (alt1) {
                case 1 :
                    // ES3.g3:831:4: reservedWord
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_reservedWord_in_token1735);
                    reservedWord1=this.reservedWord();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, reservedWord1.getTree());


                    break;
                case 2 :
                    // ES3.g3:832:4: Identifier
                    root_0 = this.adaptor.nil();

                    Identifier2=this.match(this.input,Identifier,ES3Parser.FOLLOW_Identifier_in_token1740); 
                    Identifier2_tree = this.adaptor.create(Identifier2);
                    this.adaptor.addChild(root_0, Identifier2_tree);



                    break;
                case 3 :
                    // ES3.g3:833:4: punctuator
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_punctuator_in_token1745);
                    punctuator3=this.punctuator();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, punctuator3.getTree());


                    break;
                case 4 :
                    // ES3.g3:834:4: numericLiteral
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_numericLiteral_in_token1750);
                    numericLiteral4=this.numericLiteral();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, numericLiteral4.getTree());


                    break;
                case 5 :
                    // ES3.g3:835:4: StringLiteral
                    root_0 = this.adaptor.nil();

                    StringLiteral5=this.match(this.input,StringLiteral,ES3Parser.FOLLOW_StringLiteral_in_token1755); 
                    StringLiteral5_tree = this.adaptor.create(StringLiteral5);
                    this.adaptor.addChild(root_0, StringLiteral5_tree);



                    break;

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
    reservedWord_return: (function() {
        ES3Parser.reservedWord_return = function(){};
        org.antlr.lang.extend(ES3Parser.reservedWord_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:840:1: reservedWord : ( keyword | futureReservedWord | NULL | booleanLiteral );
    // $ANTLR start "reservedWord"
    reservedWord: function() {
        var retval = new ES3Parser.reservedWord_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var NULL8 = null;
         var keyword6 = null;
         var futureReservedWord7 = null;
         var booleanLiteral9 = null;

        var NULL8_tree=null;

        try {
            // ES3.g3:841:2: ( keyword | futureReservedWord | NULL | booleanLiteral )
            var alt2=4;
            switch ( this.input.LA(1) ) {
            case BREAK:
            case CASE:
            case CATCH:
            case CONTINUE:
            case DEFAULT:
            case DELETE:
            case DO:
            case ELSE:
            case FINALLY:
            case FOR:
            case FUNCTION:
            case IF:
            case IN:
            case INSTANCEOF:
            case NEW:
            case RETURN:
            case SWITCH:
            case THIS:
            case THROW:
            case TRY:
            case TYPEOF:
            case VAR:
            case VOID:
            case WHILE:
            case WITH:
                alt2=1;
                break;
            case ABSTRACT:
            case BOOLEAN:
            case BYTE:
            case CHAR:
            case CLASS:
            case CONST:
            case DEBUGGER:
            case DOUBLE:
            case ENUM:
            case EXPORT:
            case EXTENDS:
            case FINAL:
            case FLOAT:
            case GOTO:
            case IMPLEMENTS:
            case IMPORT:
            case INT:
            case INTERFACE:
            case LONG:
            case NATIVE:
            case PACKAGE:
            case PRIVATE:
            case PROTECTED:
            case PUBLIC:
            case SHORT:
            case STATIC:
            case SUPER:
            case SYNCHRONIZED:
            case THROWS:
            case TRANSIENT:
            case VOLATILE:
                alt2=2;
                break;
            case NULL:
                alt2=3;
                break;
            case TRUE:
            case FALSE:
                alt2=4;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 2, 0, this.input);

                throw nvae;
            }

            switch (alt2) {
                case 1 :
                    // ES3.g3:841:4: keyword
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_keyword_in_reservedWord1768);
                    keyword6=this.keyword();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, keyword6.getTree());


                    break;
                case 2 :
                    // ES3.g3:842:4: futureReservedWord
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_futureReservedWord_in_reservedWord1773);
                    futureReservedWord7=this.futureReservedWord();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, futureReservedWord7.getTree());


                    break;
                case 3 :
                    // ES3.g3:843:4: NULL
                    root_0 = this.adaptor.nil();

                    NULL8=this.match(this.input,NULL,ES3Parser.FOLLOW_NULL_in_reservedWord1778); 
                    NULL8_tree = this.adaptor.create(NULL8);
                    this.adaptor.addChild(root_0, NULL8_tree);



                    break;
                case 4 :
                    // ES3.g3:844:4: booleanLiteral
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_booleanLiteral_in_reservedWord1783);
                    booleanLiteral9=this.booleanLiteral();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, booleanLiteral9.getTree());


                    break;

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
    keyword_return: (function() {
        ES3Parser.keyword_return = function(){};
        org.antlr.lang.extend(ES3Parser.keyword_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:851:1: keyword : ( BREAK | CASE | CATCH | CONTINUE | DEFAULT | DELETE | DO | ELSE | FINALLY | FOR | FUNCTION | IF | IN | INSTANCEOF | NEW | RETURN | SWITCH | THIS | THROW | TRY | TYPEOF | VAR | VOID | WHILE | WITH );
    // $ANTLR start "keyword"
    keyword: function() {
        var retval = new ES3Parser.keyword_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set10 = null;

        var set10_tree=null;

        try {
            // ES3.g3:852:2: ( BREAK | CASE | CATCH | CONTINUE | DEFAULT | DELETE | DO | ELSE | FINALLY | FOR | FUNCTION | IF | IN | INSTANCEOF | NEW | RETURN | SWITCH | THIS | THROW | TRY | TYPEOF | VAR | VOID | WHILE | WITH )
            // ES3.g3:
            root_0 = this.adaptor.nil();

            set10=this.input.LT(1);
            if ( (this.input.LA(1)>=BREAK && this.input.LA(1)<=WITH) ) {
                this.input.consume();
                this.adaptor.addChild(root_0, this.adaptor.create(set10));
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
    futureReservedWord_return: (function() {
        ES3Parser.futureReservedWord_return = function(){};
        org.antlr.lang.extend(ES3Parser.futureReservedWord_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:883:1: futureReservedWord : ( ABSTRACT | BOOLEAN | BYTE | CHAR | CLASS | CONST | DEBUGGER | DOUBLE | ENUM | EXPORT | EXTENDS | FINAL | FLOAT | GOTO | IMPLEMENTS | IMPORT | INT | INTERFACE | LONG | NATIVE | PACKAGE | PRIVATE | PROTECTED | PUBLIC | SHORT | STATIC | SUPER | SYNCHRONIZED | THROWS | TRANSIENT | VOLATILE );
    // $ANTLR start "futureReservedWord"
    futureReservedWord: function() {
        var retval = new ES3Parser.futureReservedWord_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set11 = null;

        var set11_tree=null;

        try {
            // ES3.g3:884:2: ( ABSTRACT | BOOLEAN | BYTE | CHAR | CLASS | CONST | DEBUGGER | DOUBLE | ENUM | EXPORT | EXTENDS | FINAL | FLOAT | GOTO | IMPLEMENTS | IMPORT | INT | INTERFACE | LONG | NATIVE | PACKAGE | PRIVATE | PROTECTED | PUBLIC | SHORT | STATIC | SUPER | SYNCHRONIZED | THROWS | TRANSIENT | VOLATILE )
            // ES3.g3:
            root_0 = this.adaptor.nil();

            set11=this.input.LT(1);
            if ( (this.input.LA(1)>=ABSTRACT && this.input.LA(1)<=VOLATILE) ) {
                this.input.consume();
                this.adaptor.addChild(root_0, this.adaptor.create(set11));
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
    punctuator_return: (function() {
        ES3Parser.punctuator_return = function(){};
        org.antlr.lang.extend(ES3Parser.punctuator_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:968:1: punctuator : ( LBRACE | RBRACE | LPAREN | RPAREN | LBRACK | RBRACK | DOT | SEMIC | COMMA | LT | GT | LTE | GTE | EQ | NEQ | SAME | NSAME | ADD | SUB | MUL | MOD | INC | DEC | SHL | SHR | SHU | AND | OR | XOR | NOT | INV | LAND | LOR | QUE | COLON | ASSIGN | ADDASS | SUBASS | MULASS | MODASS | SHLASS | SHRASS | SHUASS | ANDASS | ORASS | XORASS | DIV | DIVASS );
    // $ANTLR start "punctuator"
    punctuator: function() {
        var retval = new ES3Parser.punctuator_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set12 = null;

        var set12_tree=null;

        try {
            // ES3.g3:969:2: ( LBRACE | RBRACE | LPAREN | RPAREN | LBRACK | RBRACK | DOT | SEMIC | COMMA | LT | GT | LTE | GTE | EQ | NEQ | SAME | NSAME | ADD | SUB | MUL | MOD | INC | DEC | SHL | SHR | SHU | AND | OR | XOR | NOT | INV | LAND | LOR | QUE | COLON | ASSIGN | ADDASS | SUBASS | MULASS | MODASS | SHLASS | SHRASS | SHUASS | ANDASS | ORASS | XORASS | DIV | DIVASS )
            // ES3.g3:
            root_0 = this.adaptor.nil();

            set12=this.input.LT(1);
            if ( (this.input.LA(1)>=LBRACE && this.input.LA(1)<=DIVASS)||(this.input.LA(1)>=LPAREN && this.input.LA(1)<=RPAREN) ) {
                this.input.consume();
                this.adaptor.addChild(root_0, this.adaptor.create(set12));
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
    literal_return: (function() {
        ES3Parser.literal_return = function(){};
        org.antlr.lang.extend(ES3Parser.literal_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1023:1: literal : ( NULL | booleanLiteral | numericLiteral | StringLiteral | RegularExpressionLiteral );
    // $ANTLR start "literal"
    literal: function() {
        var retval = new ES3Parser.literal_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var NULL13 = null;
        var StringLiteral16 = null;
        var RegularExpressionLiteral17 = null;
         var booleanLiteral14 = null;
         var numericLiteral15 = null;

        var NULL13_tree=null;
        var StringLiteral16_tree=null;
        var RegularExpressionLiteral17_tree=null;

        try {
            // ES3.g3:1024:2: ( NULL | booleanLiteral | numericLiteral | StringLiteral | RegularExpressionLiteral )
            var alt3=5;
            switch ( this.input.LA(1) ) {
            case NULL:
                alt3=1;
                break;
            case TRUE:
            case FALSE:
                alt3=2;
                break;
            case DecimalLiteral:
            case OctalIntegerLiteral:
            case HexIntegerLiteral:
                alt3=3;
                break;
            case StringLiteral:
                alt3=4;
                break;
            case RegularExpressionLiteral:
                alt3=5;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 3, 0, this.input);

                throw nvae;
            }

            switch (alt3) {
                case 1 :
                    // ES3.g3:1024:4: NULL
                    root_0 = this.adaptor.nil();

                    NULL13=this.match(this.input,NULL,ES3Parser.FOLLOW_NULL_in_literal2480); 
                    NULL13_tree = this.adaptor.create(NULL13);
                    this.adaptor.addChild(root_0, NULL13_tree);



                    break;
                case 2 :
                    // ES3.g3:1025:4: booleanLiteral
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_booleanLiteral_in_literal2485);
                    booleanLiteral14=this.booleanLiteral();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, booleanLiteral14.getTree());


                    break;
                case 3 :
                    // ES3.g3:1026:4: numericLiteral
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_numericLiteral_in_literal2490);
                    numericLiteral15=this.numericLiteral();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, numericLiteral15.getTree());


                    break;
                case 4 :
                    // ES3.g3:1027:4: StringLiteral
                    root_0 = this.adaptor.nil();

                    StringLiteral16=this.match(this.input,StringLiteral,ES3Parser.FOLLOW_StringLiteral_in_literal2495); 
                    StringLiteral16_tree = this.adaptor.create(StringLiteral16);
                    this.adaptor.addChild(root_0, StringLiteral16_tree);



                    break;
                case 5 :
                    // ES3.g3:1028:4: RegularExpressionLiteral
                    root_0 = this.adaptor.nil();

                    RegularExpressionLiteral17=this.match(this.input,RegularExpressionLiteral,ES3Parser.FOLLOW_RegularExpressionLiteral_in_literal2500); 
                    RegularExpressionLiteral17_tree = this.adaptor.create(RegularExpressionLiteral17);
                    this.adaptor.addChild(root_0, RegularExpressionLiteral17_tree);



                    break;

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
    booleanLiteral_return: (function() {
        ES3Parser.booleanLiteral_return = function(){};
        org.antlr.lang.extend(ES3Parser.booleanLiteral_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1031:1: booleanLiteral : ( TRUE | FALSE );
    // $ANTLR start "booleanLiteral"
    booleanLiteral: function() {
        var retval = new ES3Parser.booleanLiteral_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set18 = null;

        var set18_tree=null;

        try {
            // ES3.g3:1032:2: ( TRUE | FALSE )
            // ES3.g3:
            root_0 = this.adaptor.nil();

            set18=this.input.LT(1);
            if ( (this.input.LA(1)>=TRUE && this.input.LA(1)<=FALSE) ) {
                this.input.consume();
                this.adaptor.addChild(root_0, this.adaptor.create(set18));
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
    numericLiteral_return: (function() {
        ES3Parser.numericLiteral_return = function(){};
        org.antlr.lang.extend(ES3Parser.numericLiteral_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1078:1: numericLiteral : ( DecimalLiteral | OctalIntegerLiteral | HexIntegerLiteral );
    // $ANTLR start "numericLiteral"
    numericLiteral: function() {
        var retval = new ES3Parser.numericLiteral_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set19 = null;

        var set19_tree=null;

        try {
            // ES3.g3:1079:2: ( DecimalLiteral | OctalIntegerLiteral | HexIntegerLiteral )
            // ES3.g3:
            root_0 = this.adaptor.nil();

            set19=this.input.LT(1);
            if ( (this.input.LA(1)>=DecimalLiteral && this.input.LA(1)<=HexIntegerLiteral) ) {
                this.input.consume();
                this.adaptor.addChild(root_0, this.adaptor.create(set19));
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
    primaryExpression_return: (function() {
        ES3Parser.primaryExpression_return = function(){};
        org.antlr.lang.extend(ES3Parser.primaryExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1185:1: primaryExpression : ( THIS | Identifier | amp= IdentifierNameAmpersatStart | literal | arrayLiteral | objectLiteral | lpar= LPAREN expression RPAREN -> ^( PAREXPR[$lpar, \"PAREXPR\"] expression ) );
    // $ANTLR start "primaryExpression"
    primaryExpression: function() {
        var retval = new ES3Parser.primaryExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var amp = null;
        var lpar = null;
        var THIS20 = null;
        var Identifier21 = null;
        var RPAREN26 = null;
         var literal22 = null;
         var arrayLiteral23 = null;
         var objectLiteral24 = null;
         var expression25 = null;

        var amp_tree=null;
        var lpar_tree=null;
        var THIS20_tree=null;
        var Identifier21_tree=null;
        var RPAREN26_tree=null;
        var stream_LPAREN=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token LPAREN");
        var stream_RPAREN=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token RPAREN");
        var stream_expression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule expression");
        try {
            // ES3.g3:1186:2: ( THIS | Identifier | amp= IdentifierNameAmpersatStart | literal | arrayLiteral | objectLiteral | lpar= LPAREN expression RPAREN -> ^( PAREXPR[$lpar, \"PAREXPR\"] expression ) )
            var alt4=7;
            switch ( this.input.LA(1) ) {
            case THIS:
                alt4=1;
                break;
            case Identifier:
                alt4=2;
                break;
            case IdentifierNameAmpersatStart:
                alt4=3;
                break;
            case NULL:
            case TRUE:
            case FALSE:
            case StringLiteral:
            case RegularExpressionLiteral:
            case DecimalLiteral:
            case OctalIntegerLiteral:
            case HexIntegerLiteral:
                alt4=4;
                break;
            case LBRACK:
                alt4=5;
                break;
            case LBRACE:
                alt4=6;
                break;
            case LPAREN:
                alt4=7;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 4, 0, this.input);

                throw nvae;
            }

            switch (alt4) {
                case 1 :
                    // ES3.g3:1186:4: THIS
                    root_0 = this.adaptor.nil();

                    THIS20=this.match(this.input,THIS,ES3Parser.FOLLOW_THIS_in_primaryExpression3138); 
                    THIS20_tree = this.adaptor.create(THIS20);
                    this.adaptor.addChild(root_0, THIS20_tree);



                    break;
                case 2 :
                    // ES3.g3:1187:4: Identifier
                    root_0 = this.adaptor.nil();

                    Identifier21=this.match(this.input,Identifier,ES3Parser.FOLLOW_Identifier_in_primaryExpression3143); 
                    Identifier21_tree = this.adaptor.create(Identifier21);
                    this.adaptor.addChild(root_0, Identifier21_tree);



                    break;
                case 3 :
                    // ES3.g3:1188:4: amp= IdentifierNameAmpersatStart
                    root_0 = this.adaptor.nil();

                    amp=this.match(this.input,IdentifierNameAmpersatStart,ES3Parser.FOLLOW_IdentifierNameAmpersatStart_in_primaryExpression3150); 
                    amp_tree = this.adaptor.create(amp);
                    this.adaptor.addChild(root_0, amp_tree);

                     this.ampersatIdentifiers.push(amp); /*MODIFICATION: keep trac of additional special ampersat-Identifier */


                    break;
                case 4 :
                    // ES3.g3:1189:4: literal
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_literal_in_primaryExpression3157);
                    literal22=this.literal();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, literal22.getTree());


                    break;
                case 5 :
                    // ES3.g3:1190:4: arrayLiteral
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_arrayLiteral_in_primaryExpression3162);
                    arrayLiteral23=this.arrayLiteral();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, arrayLiteral23.getTree());


                    break;
                case 6 :
                    // ES3.g3:1191:4: objectLiteral
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_objectLiteral_in_primaryExpression3167);
                    objectLiteral24=this.objectLiteral();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, objectLiteral24.getTree());


                    break;
                case 7 :
                    // ES3.g3:1192:4: lpar= LPAREN expression RPAREN
                    lpar=this.match(this.input,LPAREN,ES3Parser.FOLLOW_LPAREN_in_primaryExpression3174);  
                    stream_LPAREN.add(lpar);

                    this.pushFollow(ES3Parser.FOLLOW_expression_in_primaryExpression3176);
                    expression25=this.expression();

                    this.state._fsp--;

                    stream_expression.add(expression25.getTree());
                    RPAREN26=this.match(this.input,RPAREN,ES3Parser.FOLLOW_RPAREN_in_primaryExpression3178);  
                    stream_RPAREN.add(RPAREN26);



                    // AST REWRITE
                    // elements: expression
                    // token labels: 
                    // rule labels: retval
                    // token list labels: 
                    // rule list labels: 
                    retval.tree = root_0;
                    var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

                    root_0 = this.adaptor.nil();
                    // 1192:34: -> ^( PAREXPR[$lpar, \"PAREXPR\"] expression )
                    {
                        // ES3.g3:1192:37: ^( PAREXPR[$lpar, \"PAREXPR\"] expression )
                        {
                        var root_1 = this.adaptor.nil();
                        root_1 = this.adaptor.becomeRoot(this.adaptor.create(PAREXPR, lpar, "PAREXPR"), root_1);

                        this.adaptor.addChild(root_1, stream_expression.nextTree());

                        this.adaptor.addChild(root_0, root_1);
                        }

                    }

                    retval.tree = root_0;

                    break;

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
    arrayLiteral_return: (function() {
        ES3Parser.arrayLiteral_return = function(){};
        org.antlr.lang.extend(ES3Parser.arrayLiteral_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1195:1: arrayLiteral : lb= LBRACK ( arrayItem ( COMMA arrayItem )* )? RBRACK -> ^( ARRAY[$lb, \"ARRAY\"] ( arrayItem )* ) ;
    // $ANTLR start "arrayLiteral"
    arrayLiteral: function() {
        var retval = new ES3Parser.arrayLiteral_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var lb = null;
        var COMMA28 = null;
        var RBRACK30 = null;
         var arrayItem27 = null;
         var arrayItem29 = null;

        var lb_tree=null;
        var COMMA28_tree=null;
        var RBRACK30_tree=null;
        var stream_COMMA=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token COMMA");
        var stream_RBRACK=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token RBRACK");
        var stream_LBRACK=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token LBRACK");
        var stream_arrayItem=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule arrayItem");
        try {
            // ES3.g3:1196:2: (lb= LBRACK ( arrayItem ( COMMA arrayItem )* )? RBRACK -> ^( ARRAY[$lb, \"ARRAY\"] ( arrayItem )* ) )
            // ES3.g3:1196:4: lb= LBRACK ( arrayItem ( COMMA arrayItem )* )? RBRACK
            lb=this.match(this.input,LBRACK,ES3Parser.FOLLOW_LBRACK_in_arrayLiteral3202);  
            stream_LBRACK.add(lb);

            // ES3.g3:1196:14: ( arrayItem ( COMMA arrayItem )* )?
            var alt6=2;
            var LA6_0 = this.input.LA(1);

            if ( ((LA6_0>=NULL && LA6_0<=FALSE)||LA6_0==DELETE||LA6_0==FUNCTION||LA6_0==NEW||LA6_0==THIS||LA6_0==TYPEOF||LA6_0==VOID||LA6_0==LBRACE||LA6_0==LBRACK||LA6_0==COMMA||(LA6_0>=ADD && LA6_0<=SUB)||(LA6_0>=INC && LA6_0<=DEC)||(LA6_0>=NOT && LA6_0<=INV)||(LA6_0>=Identifier && LA6_0<=StringLiteral)||(LA6_0>=IdentifierNameAmpersatStart && LA6_0<=LPAREN)||LA6_0==RegularExpressionLiteral||(LA6_0>=DecimalLiteral && LA6_0<=HexIntegerLiteral)) ) {
                alt6=1;
            }
            else if ( (LA6_0==RBRACK) ) {
                var LA6_2 = this.input.LA(2);

                if ( (( this.input.LA(1) == COMMA )) ) {
                    alt6=1;
                }
            }
            switch (alt6) {
                case 1 :
                    // ES3.g3:1196:16: arrayItem ( COMMA arrayItem )*
                    this.pushFollow(ES3Parser.FOLLOW_arrayItem_in_arrayLiteral3206);
                    arrayItem27=this.arrayItem();

                    this.state._fsp--;

                    stream_arrayItem.add(arrayItem27.getTree());
                    // ES3.g3:1196:26: ( COMMA arrayItem )*
                    loop5:
                    do {
                        var alt5=2;
                        var LA5_0 = this.input.LA(1);

                        if ( (LA5_0==COMMA) ) {
                            alt5=1;
                        }


                        switch (alt5) {
                        case 1 :
                            // ES3.g3:1196:28: COMMA arrayItem
                            COMMA28=this.match(this.input,COMMA,ES3Parser.FOLLOW_COMMA_in_arrayLiteral3210);  
                            stream_COMMA.add(COMMA28);

                            this.pushFollow(ES3Parser.FOLLOW_arrayItem_in_arrayLiteral3212);
                            arrayItem29=this.arrayItem();

                            this.state._fsp--;

                            stream_arrayItem.add(arrayItem29.getTree());


                            break;

                        default :
                            break loop5;
                        }
                    } while (true);



                    break;

            }

            RBRACK30=this.match(this.input,RBRACK,ES3Parser.FOLLOW_RBRACK_in_arrayLiteral3220);  
            stream_RBRACK.add(RBRACK30);



            // AST REWRITE
            // elements: arrayItem
            // token labels: 
            // rule labels: retval
            // token list labels: 
            // rule list labels: 
            retval.tree = root_0;
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 1197:2: -> ^( ARRAY[$lb, \"ARRAY\"] ( arrayItem )* )
            {
                // ES3.g3:1197:5: ^( ARRAY[$lb, \"ARRAY\"] ( arrayItem )* )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(ARRAY, lb, "ARRAY"), root_1);

                // ES3.g3:1197:28: ( arrayItem )*
                while ( stream_arrayItem.hasNext() ) {
                    this.adaptor.addChild(root_1, stream_arrayItem.nextTree());

                }
                stream_arrayItem.reset();

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;


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
    arrayItem_return: (function() {
        ES3Parser.arrayItem_return = function(){};
        org.antlr.lang.extend(ES3Parser.arrayItem_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1200:1: arrayItem : (expr= assignmentExpression | {...}?) -> ^( ITEM ( $expr)? ) ;
    // $ANTLR start "arrayItem"
    arrayItem: function() {
        var retval = new ES3Parser.arrayItem_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

         var expr = null;

        var stream_assignmentExpression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule assignmentExpression");
        try {
            // ES3.g3:1201:2: ( (expr= assignmentExpression | {...}?) -> ^( ITEM ( $expr)? ) )
            // ES3.g3:1201:4: (expr= assignmentExpression | {...}?)
            // ES3.g3:1201:4: (expr= assignmentExpression | {...}?)
            var alt7=2;
            var LA7_0 = this.input.LA(1);

            if ( ((LA7_0>=NULL && LA7_0<=FALSE)||LA7_0==DELETE||LA7_0==FUNCTION||LA7_0==NEW||LA7_0==THIS||LA7_0==TYPEOF||LA7_0==VOID||LA7_0==LBRACE||LA7_0==LBRACK||(LA7_0>=ADD && LA7_0<=SUB)||(LA7_0>=INC && LA7_0<=DEC)||(LA7_0>=NOT && LA7_0<=INV)||(LA7_0>=Identifier && LA7_0<=StringLiteral)||(LA7_0>=IdentifierNameAmpersatStart && LA7_0<=LPAREN)||LA7_0==RegularExpressionLiteral||(LA7_0>=DecimalLiteral && LA7_0<=HexIntegerLiteral)) ) {
                alt7=1;
            }
            else if ( (LA7_0==RBRACK||LA7_0==COMMA) ) {
                alt7=2;
            }
            else {
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 7, 0, this.input);

                throw nvae;
            }
            switch (alt7) {
                case 1 :
                    // ES3.g3:1201:6: expr= assignmentExpression
                    this.pushFollow(ES3Parser.FOLLOW_assignmentExpression_in_arrayItem3248);
                    expr=this.assignmentExpression();

                    this.state._fsp--;

                    stream_assignmentExpression.add(expr.getTree());


                    break;
                case 2 :
                    // ES3.g3:1201:34: {...}?
                    if ( !(( this.input.LA(1) == COMMA )) ) {
                        throw new org.antlr.runtime.FailedPredicateException(this.input, "arrayItem", " this.input.LA(1) == COMMA ");
                    }


                    break;

            }



            // AST REWRITE
            // elements: expr
            // token labels: 
            // rule labels: expr, retval
            // token list labels: 
            // rule list labels: 
            retval.tree = root_0;
            var stream_expr=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token expr",expr!=null?expr.tree:null);
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 1202:2: -> ^( ITEM ( $expr)? )
            {
                // ES3.g3:1202:5: ^( ITEM ( $expr)? )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(ITEM, "ITEM"), root_1);

                // ES3.g3:1202:13: ( $expr)?
                if ( stream_expr.hasNext() ) {
                    this.adaptor.addChild(root_1, stream_expr.nextTree());

                }
                stream_expr.reset();

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;


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
    objectLiteral_return: (function() {
        ES3Parser.objectLiteral_return = function(){};
        org.antlr.lang.extend(ES3Parser.objectLiteral_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1205:1: objectLiteral : lb= LBRACE ( nameValuePair ( COMMA nameValuePair )* )? RBRACE -> ^( OBJECT[$lb, \"OBJECT\"] ( nameValuePair )* ) ;
    // $ANTLR start "objectLiteral"
    objectLiteral: function() {
        var retval = new ES3Parser.objectLiteral_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var lb = null;
        var COMMA32 = null;
        var RBRACE34 = null;
         var nameValuePair31 = null;
         var nameValuePair33 = null;

        var lb_tree=null;
        var COMMA32_tree=null;
        var RBRACE34_tree=null;
        var stream_COMMA=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token COMMA");
        var stream_RBRACE=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token RBRACE");
        var stream_LBRACE=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token LBRACE");
        var stream_nameValuePair=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule nameValuePair");
        try {
            // ES3.g3:1206:2: (lb= LBRACE ( nameValuePair ( COMMA nameValuePair )* )? RBRACE -> ^( OBJECT[$lb, \"OBJECT\"] ( nameValuePair )* ) )
            // ES3.g3:1206:4: lb= LBRACE ( nameValuePair ( COMMA nameValuePair )* )? RBRACE
            lb=this.match(this.input,LBRACE,ES3Parser.FOLLOW_LBRACE_in_objectLiteral3280);  
            stream_LBRACE.add(lb);

            // ES3.g3:1206:14: ( nameValuePair ( COMMA nameValuePair )* )?
            var alt9=2;
            var LA9_0 = this.input.LA(1);

            if ( ((LA9_0>=Identifier && LA9_0<=StringLiteral)||(LA9_0>=DecimalLiteral && LA9_0<=HexIntegerLiteral)) ) {
                alt9=1;
            }
            switch (alt9) {
                case 1 :
                    // ES3.g3:1206:16: nameValuePair ( COMMA nameValuePair )*
                    this.pushFollow(ES3Parser.FOLLOW_nameValuePair_in_objectLiteral3284);
                    nameValuePair31=this.nameValuePair();

                    this.state._fsp--;

                    stream_nameValuePair.add(nameValuePair31.getTree());
                    // ES3.g3:1206:30: ( COMMA nameValuePair )*
                    loop8:
                    do {
                        var alt8=2;
                        var LA8_0 = this.input.LA(1);

                        if ( (LA8_0==COMMA) ) {
                            alt8=1;
                        }


                        switch (alt8) {
                        case 1 :
                            // ES3.g3:1206:32: COMMA nameValuePair
                            COMMA32=this.match(this.input,COMMA,ES3Parser.FOLLOW_COMMA_in_objectLiteral3288);  
                            stream_COMMA.add(COMMA32);

                            this.pushFollow(ES3Parser.FOLLOW_nameValuePair_in_objectLiteral3290);
                            nameValuePair33=this.nameValuePair();

                            this.state._fsp--;

                            stream_nameValuePair.add(nameValuePair33.getTree());


                            break;

                        default :
                            break loop8;
                        }
                    } while (true);



                    break;

            }

            RBRACE34=this.match(this.input,RBRACE,ES3Parser.FOLLOW_RBRACE_in_objectLiteral3298);  
            stream_RBRACE.add(RBRACE34);



            // AST REWRITE
            // elements: nameValuePair
            // token labels: 
            // rule labels: retval
            // token list labels: 
            // rule list labels: 
            retval.tree = root_0;
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 1207:2: -> ^( OBJECT[$lb, \"OBJECT\"] ( nameValuePair )* )
            {
                // ES3.g3:1207:5: ^( OBJECT[$lb, \"OBJECT\"] ( nameValuePair )* )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(OBJECT, lb, "OBJECT"), root_1);

                // ES3.g3:1207:30: ( nameValuePair )*
                while ( stream_nameValuePair.hasNext() ) {
                    this.adaptor.addChild(root_1, stream_nameValuePair.nextTree());

                }
                stream_nameValuePair.reset();

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;


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
    nameValuePair_return: (function() {
        ES3Parser.nameValuePair_return = function(){};
        org.antlr.lang.extend(ES3Parser.nameValuePair_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1210:1: nameValuePair : propertyName COLON assignmentExpression -> ^( NAMEDVALUE propertyName assignmentExpression ) ;
    // $ANTLR start "nameValuePair"
    nameValuePair: function() {
        var retval = new ES3Parser.nameValuePair_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var COLON36 = null;
         var propertyName35 = null;
         var assignmentExpression37 = null;

        var COLON36_tree=null;
        var stream_COLON=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token COLON");
        var stream_propertyName=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule propertyName");
        var stream_assignmentExpression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule assignmentExpression");
        try {
            // ES3.g3:1211:2: ( propertyName COLON assignmentExpression -> ^( NAMEDVALUE propertyName assignmentExpression ) )
            // ES3.g3:1211:4: propertyName COLON assignmentExpression
            this.pushFollow(ES3Parser.FOLLOW_propertyName_in_nameValuePair3323);
            propertyName35=this.propertyName();

            this.state._fsp--;

            stream_propertyName.add(propertyName35.getTree());
            COLON36=this.match(this.input,COLON,ES3Parser.FOLLOW_COLON_in_nameValuePair3325);  
            stream_COLON.add(COLON36);

            this.pushFollow(ES3Parser.FOLLOW_assignmentExpression_in_nameValuePair3327);
            assignmentExpression37=this.assignmentExpression();

            this.state._fsp--;

            stream_assignmentExpression.add(assignmentExpression37.getTree());


            // AST REWRITE
            // elements: propertyName, assignmentExpression
            // token labels: 
            // rule labels: retval
            // token list labels: 
            // rule list labels: 
            retval.tree = root_0;
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 1212:2: -> ^( NAMEDVALUE propertyName assignmentExpression )
            {
                // ES3.g3:1212:5: ^( NAMEDVALUE propertyName assignmentExpression )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(NAMEDVALUE, "NAMEDVALUE"), root_1);

                this.adaptor.addChild(root_1, stream_propertyName.nextTree());
                this.adaptor.addChild(root_1, stream_assignmentExpression.nextTree());

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;


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
    propertyName_return: (function() {
        ES3Parser.propertyName_return = function(){};
        org.antlr.lang.extend(ES3Parser.propertyName_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1215:1: propertyName : ( Identifier | StringLiteral | numericLiteral );
    // $ANTLR start "propertyName"
    propertyName: function() {
        var retval = new ES3Parser.propertyName_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var Identifier38 = null;
        var StringLiteral39 = null;
         var numericLiteral40 = null;

        var Identifier38_tree=null;
        var StringLiteral39_tree=null;

        try {
            // ES3.g3:1216:2: ( Identifier | StringLiteral | numericLiteral )
            var alt10=3;
            switch ( this.input.LA(1) ) {
            case Identifier:
                alt10=1;
                break;
            case StringLiteral:
                alt10=2;
                break;
            case DecimalLiteral:
            case OctalIntegerLiteral:
            case HexIntegerLiteral:
                alt10=3;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 10, 0, this.input);

                throw nvae;
            }

            switch (alt10) {
                case 1 :
                    // ES3.g3:1216:4: Identifier
                    root_0 = this.adaptor.nil();

                    Identifier38=this.match(this.input,Identifier,ES3Parser.FOLLOW_Identifier_in_propertyName3351); 
                    Identifier38_tree = this.adaptor.create(Identifier38);
                    this.adaptor.addChild(root_0, Identifier38_tree);



                    break;
                case 2 :
                    // ES3.g3:1217:4: StringLiteral
                    root_0 = this.adaptor.nil();

                    StringLiteral39=this.match(this.input,StringLiteral,ES3Parser.FOLLOW_StringLiteral_in_propertyName3356); 
                    StringLiteral39_tree = this.adaptor.create(StringLiteral39);
                    this.adaptor.addChild(root_0, StringLiteral39_tree);



                    break;
                case 3 :
                    // ES3.g3:1218:4: numericLiteral
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_numericLiteral_in_propertyName3361);
                    numericLiteral40=this.numericLiteral();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, numericLiteral40.getTree());


                    break;

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
    memberExpression_return: (function() {
        ES3Parser.memberExpression_return = function(){};
        org.antlr.lang.extend(ES3Parser.memberExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1230:1: memberExpression : ( primaryExpression | functionExpression | newExpression );
    // $ANTLR start "memberExpression"
    memberExpression: function() {
        var retval = new ES3Parser.memberExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

         var primaryExpression41 = null;
         var functionExpression42 = null;
         var newExpression43 = null;


        try {
            // ES3.g3:1231:2: ( primaryExpression | functionExpression | newExpression )
            var alt11=3;
            switch ( this.input.LA(1) ) {
            case NULL:
            case TRUE:
            case FALSE:
            case THIS:
            case LBRACE:
            case LBRACK:
            case Identifier:
            case StringLiteral:
            case IdentifierNameAmpersatStart:
            case LPAREN:
            case RegularExpressionLiteral:
            case DecimalLiteral:
            case OctalIntegerLiteral:
            case HexIntegerLiteral:
                alt11=1;
                break;
            case FUNCTION:
                alt11=2;
                break;
            case NEW:
                alt11=3;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 11, 0, this.input);

                throw nvae;
            }

            switch (alt11) {
                case 1 :
                    // ES3.g3:1231:4: primaryExpression
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_primaryExpression_in_memberExpression3379);
                    primaryExpression41=this.primaryExpression();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, primaryExpression41.getTree());


                    break;
                case 2 :
                    // ES3.g3:1232:4: functionExpression
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_functionExpression_in_memberExpression3384);
                    functionExpression42=this.functionExpression();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, functionExpression42.getTree());


                    break;
                case 3 :
                    // ES3.g3:1233:4: newExpression
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_newExpression_in_memberExpression3389);
                    newExpression43=this.newExpression();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, newExpression43.getTree());


                    break;

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
    newExpression_return: (function() {
        ES3Parser.newExpression_return = function(){};
        org.antlr.lang.extend(ES3Parser.newExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1236:1: newExpression : NEW memberExpression ;
    // $ANTLR start "newExpression"
    newExpression: function() {
        var retval = new ES3Parser.newExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var NEW44 = null;
         var memberExpression45 = null;

        var NEW44_tree=null;

        try {
            // ES3.g3:1237:2: ( NEW memberExpression )
            // ES3.g3:1237:4: NEW memberExpression
            root_0 = this.adaptor.nil();

            NEW44=this.match(this.input,NEW,ES3Parser.FOLLOW_NEW_in_newExpression3400); 
            NEW44_tree = this.adaptor.create(NEW44);
            root_0 = this.adaptor.becomeRoot(NEW44_tree, root_0);

            this.pushFollow(ES3Parser.FOLLOW_memberExpression_in_newExpression3403);
            memberExpression45=this.memberExpression();

            this.state._fsp--;

            this.adaptor.addChild(root_0, memberExpression45.getTree());



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
    arguments_return: (function() {
        ES3Parser.arguments_return = function(){};
        org.antlr.lang.extend(ES3Parser.arguments_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1241:1: arguments : LPAREN ( assignmentExpression ( COMMA assignmentExpression )* )? RPAREN -> ^( ARGS ( assignmentExpression )* ) ;
    // $ANTLR start "arguments"
    arguments: function() {
        var retval = new ES3Parser.arguments_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var LPAREN46 = null;
        var COMMA48 = null;
        var RPAREN50 = null;
         var assignmentExpression47 = null;
         var assignmentExpression49 = null;

        var LPAREN46_tree=null;
        var COMMA48_tree=null;
        var RPAREN50_tree=null;
        var stream_COMMA=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token COMMA");
        var stream_LPAREN=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token LPAREN");
        var stream_RPAREN=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token RPAREN");
        var stream_assignmentExpression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule assignmentExpression");
        try {
            // ES3.g3:1242:2: ( LPAREN ( assignmentExpression ( COMMA assignmentExpression )* )? RPAREN -> ^( ARGS ( assignmentExpression )* ) )
            // ES3.g3:1242:4: LPAREN ( assignmentExpression ( COMMA assignmentExpression )* )? RPAREN
            LPAREN46=this.match(this.input,LPAREN,ES3Parser.FOLLOW_LPAREN_in_arguments3416);  
            stream_LPAREN.add(LPAREN46);

            // ES3.g3:1242:11: ( assignmentExpression ( COMMA assignmentExpression )* )?
            var alt13=2;
            var LA13_0 = this.input.LA(1);

            if ( ((LA13_0>=NULL && LA13_0<=FALSE)||LA13_0==DELETE||LA13_0==FUNCTION||LA13_0==NEW||LA13_0==THIS||LA13_0==TYPEOF||LA13_0==VOID||LA13_0==LBRACE||LA13_0==LBRACK||(LA13_0>=ADD && LA13_0<=SUB)||(LA13_0>=INC && LA13_0<=DEC)||(LA13_0>=NOT && LA13_0<=INV)||(LA13_0>=Identifier && LA13_0<=StringLiteral)||(LA13_0>=IdentifierNameAmpersatStart && LA13_0<=LPAREN)||LA13_0==RegularExpressionLiteral||(LA13_0>=DecimalLiteral && LA13_0<=HexIntegerLiteral)) ) {
                alt13=1;
            }
            switch (alt13) {
                case 1 :
                    // ES3.g3:1242:13: assignmentExpression ( COMMA assignmentExpression )*
                    this.pushFollow(ES3Parser.FOLLOW_assignmentExpression_in_arguments3420);
                    assignmentExpression47=this.assignmentExpression();

                    this.state._fsp--;

                    stream_assignmentExpression.add(assignmentExpression47.getTree());
                    // ES3.g3:1242:34: ( COMMA assignmentExpression )*
                    loop12:
                    do {
                        var alt12=2;
                        var LA12_0 = this.input.LA(1);

                        if ( (LA12_0==COMMA) ) {
                            alt12=1;
                        }


                        switch (alt12) {
                        case 1 :
                            // ES3.g3:1242:36: COMMA assignmentExpression
                            COMMA48=this.match(this.input,COMMA,ES3Parser.FOLLOW_COMMA_in_arguments3424);  
                            stream_COMMA.add(COMMA48);

                            this.pushFollow(ES3Parser.FOLLOW_assignmentExpression_in_arguments3426);
                            assignmentExpression49=this.assignmentExpression();

                            this.state._fsp--;

                            stream_assignmentExpression.add(assignmentExpression49.getTree());


                            break;

                        default :
                            break loop12;
                        }
                    } while (true);



                    break;

            }

            RPAREN50=this.match(this.input,RPAREN,ES3Parser.FOLLOW_RPAREN_in_arguments3434);  
            stream_RPAREN.add(RPAREN50);



            // AST REWRITE
            // elements: assignmentExpression
            // token labels: 
            // rule labels: retval
            // token list labels: 
            // rule list labels: 
            retval.tree = root_0;
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 1243:2: -> ^( ARGS ( assignmentExpression )* )
            {
                // ES3.g3:1243:5: ^( ARGS ( assignmentExpression )* )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(ARGS, "ARGS"), root_1);

                // ES3.g3:1243:13: ( assignmentExpression )*
                while ( stream_assignmentExpression.hasNext() ) {
                    this.adaptor.addChild(root_1, stream_assignmentExpression.nextTree());

                }
                stream_assignmentExpression.reset();

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;


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
    leftHandSideExpression_return: (function() {
        ES3Parser.leftHandSideExpression_return = function(){};
        org.antlr.lang.extend(ES3Parser.leftHandSideExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1246:1: leftHandSideExpression : ( memberExpression -> memberExpression ) ( arguments -> ^( CALL $leftHandSideExpression arguments ) | LBRACK expression RBRACK -> ^( BYINDEX $leftHandSideExpression expression ) | DOT Identifier -> ^( BYFIELD $leftHandSideExpression Identifier ) )* ;
    // $ANTLR start "leftHandSideExpression"
    leftHandSideExpression: function() {
        var retval = new ES3Parser.leftHandSideExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var LBRACK53 = null;
        var RBRACK55 = null;
        var DOT56 = null;
        var Identifier57 = null;
         var memberExpression51 = null;
         var arguments52 = null;
         var expression54 = null;

        var LBRACK53_tree=null;
        var RBRACK55_tree=null;
        var DOT56_tree=null;
        var Identifier57_tree=null;
        var stream_RBRACK=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token RBRACK");
        var stream_Identifier=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token Identifier");
        var stream_LBRACK=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token LBRACK");
        var stream_DOT=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token DOT");
        var stream_expression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule expression");
        var stream_arguments=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule arguments");
        var stream_memberExpression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule memberExpression");
        try {
            // ES3.g3:1247:2: ( ( memberExpression -> memberExpression ) ( arguments -> ^( CALL $leftHandSideExpression arguments ) | LBRACK expression RBRACK -> ^( BYINDEX $leftHandSideExpression expression ) | DOT Identifier -> ^( BYFIELD $leftHandSideExpression Identifier ) )* )
            // ES3.g3:1248:2: ( memberExpression -> memberExpression ) ( arguments -> ^( CALL $leftHandSideExpression arguments ) | LBRACK expression RBRACK -> ^( BYINDEX $leftHandSideExpression expression ) | DOT Identifier -> ^( BYFIELD $leftHandSideExpression Identifier ) )*
            // ES3.g3:1248:2: ( memberExpression -> memberExpression )
            // ES3.g3:1249:4: memberExpression
            this.pushFollow(ES3Parser.FOLLOW_memberExpression_in_leftHandSideExpression3464);
            memberExpression51=this.memberExpression();

            this.state._fsp--;

            stream_memberExpression.add(memberExpression51.getTree());


            // AST REWRITE
            // elements: memberExpression
            // token labels: 
            // rule labels: retval
            // token list labels: 
            // rule list labels: 
            retval.tree = root_0;
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 1249:23: -> memberExpression
            {
                this.adaptor.addChild(root_0, stream_memberExpression.nextTree());

            }

            retval.tree = root_0;


            // ES3.g3:1251:2: ( arguments -> ^( CALL $leftHandSideExpression arguments ) | LBRACK expression RBRACK -> ^( BYINDEX $leftHandSideExpression expression ) | DOT Identifier -> ^( BYFIELD $leftHandSideExpression Identifier ) )*
            loop14:
            do {
                var alt14=4;
                switch ( this.input.LA(1) ) {
                case LPAREN:
                    alt14=1;
                    break;
                case LBRACK:
                    alt14=2;
                    break;
                case DOT:
                    alt14=3;
                    break;

                }

                switch (alt14) {
                case 1 :
                    // ES3.g3:1252:3: arguments
                    this.pushFollow(ES3Parser.FOLLOW_arguments_in_leftHandSideExpression3480);
                    arguments52=this.arguments();

                    this.state._fsp--;

                    stream_arguments.add(arguments52.getTree());


                    // AST REWRITE
                    // elements: arguments, leftHandSideExpression
                    // token labels: 
                    // rule labels: retval
                    // token list labels: 
                    // rule list labels: 
                    retval.tree = root_0;
                    var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

                    root_0 = this.adaptor.nil();
                    // 1252:15: -> ^( CALL $leftHandSideExpression arguments )
                    {
                        // ES3.g3:1252:18: ^( CALL $leftHandSideExpression arguments )
                        {
                        var root_1 = this.adaptor.nil();
                        root_1 = this.adaptor.becomeRoot(this.adaptor.create(CALL, "CALL"), root_1);

                        this.adaptor.addChild(root_1, stream_retval.nextTree());
                        this.adaptor.addChild(root_1, stream_arguments.nextTree());

                        this.adaptor.addChild(root_0, root_1);
                        }

                    }

                    retval.tree = root_0;

                    break;
                case 2 :
                    // ES3.g3:1253:5: LBRACK expression RBRACK
                    LBRACK53=this.match(this.input,LBRACK,ES3Parser.FOLLOW_LBRACK_in_leftHandSideExpression3501);  
                    stream_LBRACK.add(LBRACK53);

                    this.pushFollow(ES3Parser.FOLLOW_expression_in_leftHandSideExpression3503);
                    expression54=this.expression();

                    this.state._fsp--;

                    stream_expression.add(expression54.getTree());
                    RBRACK55=this.match(this.input,RBRACK,ES3Parser.FOLLOW_RBRACK_in_leftHandSideExpression3505);  
                    stream_RBRACK.add(RBRACK55);



                    // AST REWRITE
                    // elements: expression, leftHandSideExpression
                    // token labels: 
                    // rule labels: retval
                    // token list labels: 
                    // rule list labels: 
                    retval.tree = root_0;
                    var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

                    root_0 = this.adaptor.nil();
                    // 1253:30: -> ^( BYINDEX $leftHandSideExpression expression )
                    {
                        // ES3.g3:1253:33: ^( BYINDEX $leftHandSideExpression expression )
                        {
                        var root_1 = this.adaptor.nil();
                        root_1 = this.adaptor.becomeRoot(this.adaptor.create(BYINDEX, "BYINDEX"), root_1);

                        this.adaptor.addChild(root_1, stream_retval.nextTree());
                        this.adaptor.addChild(root_1, stream_expression.nextTree());

                        this.adaptor.addChild(root_0, root_1);
                        }

                    }

                    retval.tree = root_0;

                    break;
                case 3 :
                    // ES3.g3:1254:5: DOT Identifier
                    DOT56=this.match(this.input,DOT,ES3Parser.FOLLOW_DOT_in_leftHandSideExpression3524);  
                    stream_DOT.add(DOT56);

                    Identifier57=this.match(this.input,Identifier,ES3Parser.FOLLOW_Identifier_in_leftHandSideExpression3526);  
                    stream_Identifier.add(Identifier57);



                    // AST REWRITE
                    // elements: leftHandSideExpression, Identifier
                    // token labels: 
                    // rule labels: retval
                    // token list labels: 
                    // rule list labels: 
                    retval.tree = root_0;
                    var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

                    root_0 = this.adaptor.nil();
                    // 1254:21: -> ^( BYFIELD $leftHandSideExpression Identifier )
                    {
                        // ES3.g3:1254:24: ^( BYFIELD $leftHandSideExpression Identifier )
                        {
                        var root_1 = this.adaptor.nil();
                        root_1 = this.adaptor.becomeRoot(this.adaptor.create(BYFIELD, "BYFIELD"), root_1);

                        this.adaptor.addChild(root_1, stream_retval.nextTree());
                        this.adaptor.addChild(root_1, stream_Identifier.nextNode());

                        this.adaptor.addChild(root_0, root_1);
                        }

                    }

                    retval.tree = root_0;

                    break;

                default :
                    break loop14;
                }
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
    postfixExpression_return: (function() {
        ES3Parser.postfixExpression_return = function(){};
        org.antlr.lang.extend(ES3Parser.postfixExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1268:1: postfixExpression : leftHandSideExpression ( postfixOperator )? ;
    // $ANTLR start "postfixExpression"
    postfixExpression: function() {
        var retval = new ES3Parser.postfixExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

         var leftHandSideExpression58 = null;
         var postfixOperator59 = null;


        try {
            // ES3.g3:1269:2: ( leftHandSideExpression ( postfixOperator )? )
            // ES3.g3:1269:4: leftHandSideExpression ( postfixOperator )?
            root_0 = this.adaptor.nil();

            this.pushFollow(ES3Parser.FOLLOW_leftHandSideExpression_in_postfixExpression3561);
            leftHandSideExpression58=this.leftHandSideExpression();

            this.state._fsp--;

            this.adaptor.addChild(root_0, leftHandSideExpression58.getTree());
             if (this.input.LA(1) == this.theParser.INC || this.input.LA(1) == this.theParser.DEC) this.promoteEOL(null); 
            // ES3.g3:1269:140: ( postfixOperator )?
            var alt15=2;
            var LA15_0 = this.input.LA(1);

            if ( ((LA15_0>=INC && LA15_0<=DEC)) ) {
                alt15=1;
            }
            switch (alt15) {
                case 1 :
                    // ES3.g3:1269:142: postfixOperator
                    this.pushFollow(ES3Parser.FOLLOW_postfixOperator_in_postfixExpression3567);
                    postfixOperator59=this.postfixOperator();

                    this.state._fsp--;

                    root_0 = this.adaptor.becomeRoot(postfixOperator59.getTree(), root_0);


                    break;

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
    postfixOperator_return: (function() {
        ES3Parser.postfixOperator_return = function(){};
        org.antlr.lang.extend(ES3Parser.postfixOperator_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1272:1: postfixOperator : (op= INC | op= DEC );
    // $ANTLR start "postfixOperator"
    postfixOperator: function() {
        var retval = new ES3Parser.postfixOperator_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var op = null;

        var op_tree=null;

        try {
            // ES3.g3:1273:2: (op= INC | op= DEC )
            var alt16=2;
            var LA16_0 = this.input.LA(1);

            if ( (LA16_0==INC) ) {
                alt16=1;
            }
            else if ( (LA16_0==DEC) ) {
                alt16=2;
            }
            else {
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 16, 0, this.input);

                throw nvae;
            }
            switch (alt16) {
                case 1 :
                    // ES3.g3:1273:4: op= INC
                    root_0 = this.adaptor.nil();

                    op=this.match(this.input,INC,ES3Parser.FOLLOW_INC_in_postfixOperator3585); 
                    op_tree = this.adaptor.create(op);
                    this.adaptor.addChild(root_0, op_tree);

                     op.setType(this.theParser.PINC); 


                    break;
                case 2 :
                    // ES3.g3:1274:4: op= DEC
                    root_0 = this.adaptor.nil();

                    op=this.match(this.input,DEC,ES3Parser.FOLLOW_DEC_in_postfixOperator3594); 
                    op_tree = this.adaptor.create(op);
                    this.adaptor.addChild(root_0, op_tree);

                     op.setType(this.theParser.PDEC); 


                    break;

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
    unaryExpression_return: (function() {
        ES3Parser.unaryExpression_return = function(){};
        org.antlr.lang.extend(ES3Parser.unaryExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1281:1: unaryExpression : ( postfixExpression | unaryOperator unaryExpression );
    // $ANTLR start "unaryExpression"
    unaryExpression: function() {
        var retval = new ES3Parser.unaryExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

         var postfixExpression60 = null;
         var unaryOperator61 = null;
         var unaryExpression62 = null;


        try {
            // ES3.g3:1282:2: ( postfixExpression | unaryOperator unaryExpression )
            var alt17=2;
            var LA17_0 = this.input.LA(1);

            if ( ((LA17_0>=NULL && LA17_0<=FALSE)||LA17_0==FUNCTION||LA17_0==NEW||LA17_0==THIS||LA17_0==LBRACE||LA17_0==LBRACK||(LA17_0>=Identifier && LA17_0<=StringLiteral)||(LA17_0>=IdentifierNameAmpersatStart && LA17_0<=LPAREN)||LA17_0==RegularExpressionLiteral||(LA17_0>=DecimalLiteral && LA17_0<=HexIntegerLiteral)) ) {
                alt17=1;
            }
            else if ( (LA17_0==DELETE||LA17_0==TYPEOF||LA17_0==VOID||(LA17_0>=ADD && LA17_0<=SUB)||(LA17_0>=INC && LA17_0<=DEC)||(LA17_0>=NOT && LA17_0<=INV)) ) {
                alt17=2;
            }
            else {
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 17, 0, this.input);

                throw nvae;
            }
            switch (alt17) {
                case 1 :
                    // ES3.g3:1282:4: postfixExpression
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_postfixExpression_in_unaryExpression3611);
                    postfixExpression60=this.postfixExpression();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, postfixExpression60.getTree());


                    break;
                case 2 :
                    // ES3.g3:1283:4: unaryOperator unaryExpression
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_unaryOperator_in_unaryExpression3616);
                    unaryOperator61=this.unaryOperator();

                    this.state._fsp--;

                    root_0 = this.adaptor.becomeRoot(unaryOperator61.getTree(), root_0);
                    this.pushFollow(ES3Parser.FOLLOW_unaryExpression_in_unaryExpression3619);
                    unaryExpression62=this.unaryExpression();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, unaryExpression62.getTree());


                    break;

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
    unaryOperator_return: (function() {
        ES3Parser.unaryOperator_return = function(){};
        org.antlr.lang.extend(ES3Parser.unaryOperator_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1286:1: unaryOperator : ( DELETE | VOID | TYPEOF | INC | DEC | op= ADD | op= SUB | INV | NOT );
    // $ANTLR start "unaryOperator"
    unaryOperator: function() {
        var retval = new ES3Parser.unaryOperator_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var op = null;
        var DELETE63 = null;
        var VOID64 = null;
        var TYPEOF65 = null;
        var INC66 = null;
        var DEC67 = null;
        var INV68 = null;
        var NOT69 = null;

        var op_tree=null;
        var DELETE63_tree=null;
        var VOID64_tree=null;
        var TYPEOF65_tree=null;
        var INC66_tree=null;
        var DEC67_tree=null;
        var INV68_tree=null;
        var NOT69_tree=null;

        try {
            // ES3.g3:1287:2: ( DELETE | VOID | TYPEOF | INC | DEC | op= ADD | op= SUB | INV | NOT )
            var alt18=9;
            switch ( this.input.LA(1) ) {
            case DELETE:
                alt18=1;
                break;
            case VOID:
                alt18=2;
                break;
            case TYPEOF:
                alt18=3;
                break;
            case INC:
                alt18=4;
                break;
            case DEC:
                alt18=5;
                break;
            case ADD:
                alt18=6;
                break;
            case SUB:
                alt18=7;
                break;
            case INV:
                alt18=8;
                break;
            case NOT:
                alt18=9;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 18, 0, this.input);

                throw nvae;
            }

            switch (alt18) {
                case 1 :
                    // ES3.g3:1287:4: DELETE
                    root_0 = this.adaptor.nil();

                    DELETE63=this.match(this.input,DELETE,ES3Parser.FOLLOW_DELETE_in_unaryOperator3631); 
                    DELETE63_tree = this.adaptor.create(DELETE63);
                    this.adaptor.addChild(root_0, DELETE63_tree);



                    break;
                case 2 :
                    // ES3.g3:1288:4: VOID
                    root_0 = this.adaptor.nil();

                    VOID64=this.match(this.input,VOID,ES3Parser.FOLLOW_VOID_in_unaryOperator3636); 
                    VOID64_tree = this.adaptor.create(VOID64);
                    this.adaptor.addChild(root_0, VOID64_tree);



                    break;
                case 3 :
                    // ES3.g3:1289:4: TYPEOF
                    root_0 = this.adaptor.nil();

                    TYPEOF65=this.match(this.input,TYPEOF,ES3Parser.FOLLOW_TYPEOF_in_unaryOperator3641); 
                    TYPEOF65_tree = this.adaptor.create(TYPEOF65);
                    this.adaptor.addChild(root_0, TYPEOF65_tree);



                    break;
                case 4 :
                    // ES3.g3:1290:4: INC
                    root_0 = this.adaptor.nil();

                    INC66=this.match(this.input,INC,ES3Parser.FOLLOW_INC_in_unaryOperator3646); 
                    INC66_tree = this.adaptor.create(INC66);
                    this.adaptor.addChild(root_0, INC66_tree);



                    break;
                case 5 :
                    // ES3.g3:1291:4: DEC
                    root_0 = this.adaptor.nil();

                    DEC67=this.match(this.input,DEC,ES3Parser.FOLLOW_DEC_in_unaryOperator3651); 
                    DEC67_tree = this.adaptor.create(DEC67);
                    this.adaptor.addChild(root_0, DEC67_tree);



                    break;
                case 6 :
                    // ES3.g3:1292:4: op= ADD
                    root_0 = this.adaptor.nil();

                    op=this.match(this.input,ADD,ES3Parser.FOLLOW_ADD_in_unaryOperator3658); 
                    op_tree = this.adaptor.create(op);
                    this.adaptor.addChild(root_0, op_tree);

                     op.setType(this.theParser.POS); 


                    break;
                case 7 :
                    // ES3.g3:1293:4: op= SUB
                    root_0 = this.adaptor.nil();

                    op=this.match(this.input,SUB,ES3Parser.FOLLOW_SUB_in_unaryOperator3667); 
                    op_tree = this.adaptor.create(op);
                    this.adaptor.addChild(root_0, op_tree);

                     op.setType(this.theParser.NEG); 


                    break;
                case 8 :
                    // ES3.g3:1294:4: INV
                    root_0 = this.adaptor.nil();

                    INV68=this.match(this.input,INV,ES3Parser.FOLLOW_INV_in_unaryOperator3674); 
                    INV68_tree = this.adaptor.create(INV68);
                    this.adaptor.addChild(root_0, INV68_tree);



                    break;
                case 9 :
                    // ES3.g3:1295:4: NOT
                    root_0 = this.adaptor.nil();

                    NOT69=this.match(this.input,NOT,ES3Parser.FOLLOW_NOT_in_unaryOperator3679); 
                    NOT69_tree = this.adaptor.create(NOT69);
                    this.adaptor.addChild(root_0, NOT69_tree);



                    break;

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
    multiplicativeExpression_return: (function() {
        ES3Parser.multiplicativeExpression_return = function(){};
        org.antlr.lang.extend(ES3Parser.multiplicativeExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1302:1: multiplicativeExpression : unaryExpression ( ( MUL | DIV | MOD ) unaryExpression )* ;
    // $ANTLR start "multiplicativeExpression"
    multiplicativeExpression: function() {
        var retval = new ES3Parser.multiplicativeExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set71 = null;
         var unaryExpression70 = null;
         var unaryExpression72 = null;

        var set71_tree=null;

         var input = this.input; 
        try {
            // ES3.g3:1304:2: ( unaryExpression ( ( MUL | DIV | MOD ) unaryExpression )* )
            // ES3.g3:1304:4: unaryExpression ( ( MUL | DIV | MOD ) unaryExpression )*
            root_0 = this.adaptor.nil();

            this.pushFollow(ES3Parser.FOLLOW_unaryExpression_in_multiplicativeExpression3698);
            unaryExpression70=this.unaryExpression();

            this.state._fsp--;

            this.adaptor.addChild(root_0, unaryExpression70.getTree());
            // ES3.g3:1304:20: ( ( MUL | DIV | MOD ) unaryExpression )*
            loop19:
            do {
                var alt19=2;
                var LA19_0 = this.input.LA(1);

                if ( ((LA19_0>=MUL && LA19_0<=MOD)||LA19_0==DIV) ) {
                    alt19=1;
                }


                switch (alt19) {
                case 1 :
                    // ES3.g3:1304:22: ( MUL | DIV | MOD ) unaryExpression
                    set71=input.LT(1);
                    set71=this.input.LT(1);
                    if ( (this.input.LA(1)>=MUL && this.input.LA(1)<=MOD)||this.input.LA(1)==DIV ) {
                        this.input.consume();
                        root_0 = this.adaptor.becomeRoot(this.adaptor.create(set71), root_0);
                        this.state.errorRecovery=false;
                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        throw mse;
                    }

                    this.pushFollow(ES3Parser.FOLLOW_unaryExpression_in_multiplicativeExpression3717);
                    unaryExpression72=this.unaryExpression();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, unaryExpression72.getTree());


                    break;

                default :
                    break loop19;
                }
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
    additiveExpression_return: (function() {
        ES3Parser.additiveExpression_return = function(){};
        org.antlr.lang.extend(ES3Parser.additiveExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1311:1: additiveExpression : multiplicativeExpression ( ( ADD | SUB ) multiplicativeExpression )* ;
    // $ANTLR start "additiveExpression"
    additiveExpression: function() {
        var retval = new ES3Parser.additiveExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set74 = null;
         var multiplicativeExpression73 = null;
         var multiplicativeExpression75 = null;

        var set74_tree=null;

         var input = this.input; 
        try {
            // ES3.g3:1313:2: ( multiplicativeExpression ( ( ADD | SUB ) multiplicativeExpression )* )
            // ES3.g3:1313:4: multiplicativeExpression ( ( ADD | SUB ) multiplicativeExpression )*
            root_0 = this.adaptor.nil();

            this.pushFollow(ES3Parser.FOLLOW_multiplicativeExpression_in_additiveExpression3739);
            multiplicativeExpression73=this.multiplicativeExpression();

            this.state._fsp--;

            this.adaptor.addChild(root_0, multiplicativeExpression73.getTree());
            // ES3.g3:1313:29: ( ( ADD | SUB ) multiplicativeExpression )*
            loop20:
            do {
                var alt20=2;
                var LA20_0 = this.input.LA(1);

                if ( ((LA20_0>=ADD && LA20_0<=SUB)) ) {
                    alt20=1;
                }


                switch (alt20) {
                case 1 :
                    // ES3.g3:1313:31: ( ADD | SUB ) multiplicativeExpression
                    set74=input.LT(1);
                    set74=this.input.LT(1);
                    if ( (this.input.LA(1)>=ADD && this.input.LA(1)<=SUB) ) {
                        this.input.consume();
                        root_0 = this.adaptor.becomeRoot(this.adaptor.create(set74), root_0);
                        this.state.errorRecovery=false;
                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        throw mse;
                    }

                    this.pushFollow(ES3Parser.FOLLOW_multiplicativeExpression_in_additiveExpression3754);
                    multiplicativeExpression75=this.multiplicativeExpression();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, multiplicativeExpression75.getTree());


                    break;

                default :
                    break loop20;
                }
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
    shiftExpression_return: (function() {
        ES3Parser.shiftExpression_return = function(){};
        org.antlr.lang.extend(ES3Parser.shiftExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1320:1: shiftExpression : additiveExpression ( ( SHL | SHR | SHU ) additiveExpression )* ;
    // $ANTLR start "shiftExpression"
    shiftExpression: function() {
        var retval = new ES3Parser.shiftExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set77 = null;
         var additiveExpression76 = null;
         var additiveExpression78 = null;

        var set77_tree=null;

         var input = this.input; 
        try {
            // ES3.g3:1322:2: ( additiveExpression ( ( SHL | SHR | SHU ) additiveExpression )* )
            // ES3.g3:1322:4: additiveExpression ( ( SHL | SHR | SHU ) additiveExpression )*
            root_0 = this.adaptor.nil();

            this.pushFollow(ES3Parser.FOLLOW_additiveExpression_in_shiftExpression3777);
            additiveExpression76=this.additiveExpression();

            this.state._fsp--;

            this.adaptor.addChild(root_0, additiveExpression76.getTree());
            // ES3.g3:1322:23: ( ( SHL | SHR | SHU ) additiveExpression )*
            loop21:
            do {
                var alt21=2;
                var LA21_0 = this.input.LA(1);

                if ( ((LA21_0>=SHL && LA21_0<=SHU)) ) {
                    alt21=1;
                }


                switch (alt21) {
                case 1 :
                    // ES3.g3:1322:25: ( SHL | SHR | SHU ) additiveExpression
                    set77=input.LT(1);
                    set77=this.input.LT(1);
                    if ( (this.input.LA(1)>=SHL && this.input.LA(1)<=SHU) ) {
                        this.input.consume();
                        root_0 = this.adaptor.becomeRoot(this.adaptor.create(set77), root_0);
                        this.state.errorRecovery=false;
                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        throw mse;
                    }

                    this.pushFollow(ES3Parser.FOLLOW_additiveExpression_in_shiftExpression3796);
                    additiveExpression78=this.additiveExpression();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, additiveExpression78.getTree());


                    break;

                default :
                    break loop21;
                }
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
    relationalExpression_return: (function() {
        ES3Parser.relationalExpression_return = function(){};
        org.antlr.lang.extend(ES3Parser.relationalExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1329:1: relationalExpression : shiftExpression ( ( LT | GT | LTE | GTE | INSTANCEOF | IN ) shiftExpression )* ;
    // $ANTLR start "relationalExpression"
    relationalExpression: function() {
        var retval = new ES3Parser.relationalExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set80 = null;
         var shiftExpression79 = null;
         var shiftExpression81 = null;

        var set80_tree=null;

         var input = this.input; 
        try {
            // ES3.g3:1331:2: ( shiftExpression ( ( LT | GT | LTE | GTE | INSTANCEOF | IN ) shiftExpression )* )
            // ES3.g3:1331:4: shiftExpression ( ( LT | GT | LTE | GTE | INSTANCEOF | IN ) shiftExpression )*
            root_0 = this.adaptor.nil();

            this.pushFollow(ES3Parser.FOLLOW_shiftExpression_in_relationalExpression3819);
            shiftExpression79=this.shiftExpression();

            this.state._fsp--;

            this.adaptor.addChild(root_0, shiftExpression79.getTree());
            // ES3.g3:1331:20: ( ( LT | GT | LTE | GTE | INSTANCEOF | IN ) shiftExpression )*
            loop22:
            do {
                var alt22=2;
                var LA22_0 = this.input.LA(1);

                if ( ((LA22_0>=IN && LA22_0<=INSTANCEOF)||(LA22_0>=LT && LA22_0<=GTE)) ) {
                    alt22=1;
                }


                switch (alt22) {
                case 1 :
                    // ES3.g3:1331:22: ( LT | GT | LTE | GTE | INSTANCEOF | IN ) shiftExpression
                    set80=input.LT(1);
                    set80=this.input.LT(1);
                    if ( (this.input.LA(1)>=IN && this.input.LA(1)<=INSTANCEOF)||(this.input.LA(1)>=LT && this.input.LA(1)<=GTE) ) {
                        this.input.consume();
                        root_0 = this.adaptor.becomeRoot(this.adaptor.create(set80), root_0);
                        this.state.errorRecovery=false;
                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        throw mse;
                    }

                    this.pushFollow(ES3Parser.FOLLOW_shiftExpression_in_relationalExpression3850);
                    shiftExpression81=this.shiftExpression();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, shiftExpression81.getTree());


                    break;

                default :
                    break loop22;
                }
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
    relationalExpressionNoIn_return: (function() {
        ES3Parser.relationalExpressionNoIn_return = function(){};
        org.antlr.lang.extend(ES3Parser.relationalExpressionNoIn_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1334:1: relationalExpressionNoIn : shiftExpression ( ( LT | GT | LTE | GTE | INSTANCEOF ) shiftExpression )* ;
    // $ANTLR start "relationalExpressionNoIn"
    relationalExpressionNoIn: function() {
        var retval = new ES3Parser.relationalExpressionNoIn_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set83 = null;
         var shiftExpression82 = null;
         var shiftExpression84 = null;

        var set83_tree=null;

         var input = this.input; 
        try {
            // ES3.g3:1336:2: ( shiftExpression ( ( LT | GT | LTE | GTE | INSTANCEOF ) shiftExpression )* )
            // ES3.g3:1336:4: shiftExpression ( ( LT | GT | LTE | GTE | INSTANCEOF ) shiftExpression )*
            root_0 = this.adaptor.nil();

            this.pushFollow(ES3Parser.FOLLOW_shiftExpression_in_relationalExpressionNoIn3868);
            shiftExpression82=this.shiftExpression();

            this.state._fsp--;

            this.adaptor.addChild(root_0, shiftExpression82.getTree());
            // ES3.g3:1336:20: ( ( LT | GT | LTE | GTE | INSTANCEOF ) shiftExpression )*
            loop23:
            do {
                var alt23=2;
                var LA23_0 = this.input.LA(1);

                if ( (LA23_0==INSTANCEOF||(LA23_0>=LT && LA23_0<=GTE)) ) {
                    alt23=1;
                }


                switch (alt23) {
                case 1 :
                    // ES3.g3:1336:22: ( LT | GT | LTE | GTE | INSTANCEOF ) shiftExpression
                    set83=input.LT(1);
                    set83=this.input.LT(1);
                    if ( this.input.LA(1)==INSTANCEOF||(this.input.LA(1)>=LT && this.input.LA(1)<=GTE) ) {
                        this.input.consume();
                        root_0 = this.adaptor.becomeRoot(this.adaptor.create(set83), root_0);
                        this.state.errorRecovery=false;
                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        throw mse;
                    }

                    this.pushFollow(ES3Parser.FOLLOW_shiftExpression_in_relationalExpressionNoIn3895);
                    shiftExpression84=this.shiftExpression();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, shiftExpression84.getTree());


                    break;

                default :
                    break loop23;
                }
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
    equalityExpression_return: (function() {
        ES3Parser.equalityExpression_return = function(){};
        org.antlr.lang.extend(ES3Parser.equalityExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1343:1: equalityExpression : relationalExpression ( ( EQ | NEQ | SAME | NSAME ) relationalExpression )* ;
    // $ANTLR start "equalityExpression"
    equalityExpression: function() {
        var retval = new ES3Parser.equalityExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set86 = null;
         var relationalExpression85 = null;
         var relationalExpression87 = null;

        var set86_tree=null;

         var input = this.input; 
        try {
            // ES3.g3:1345:2: ( relationalExpression ( ( EQ | NEQ | SAME | NSAME ) relationalExpression )* )
            // ES3.g3:1345:4: relationalExpression ( ( EQ | NEQ | SAME | NSAME ) relationalExpression )*
            root_0 = this.adaptor.nil();

            this.pushFollow(ES3Parser.FOLLOW_relationalExpression_in_equalityExpression3918);
            relationalExpression85=this.relationalExpression();

            this.state._fsp--;

            this.adaptor.addChild(root_0, relationalExpression85.getTree());
            // ES3.g3:1345:25: ( ( EQ | NEQ | SAME | NSAME ) relationalExpression )*
            loop24:
            do {
                var alt24=2;
                var LA24_0 = this.input.LA(1);

                if ( ((LA24_0>=EQ && LA24_0<=NSAME)) ) {
                    alt24=1;
                }


                switch (alt24) {
                case 1 :
                    // ES3.g3:1345:27: ( EQ | NEQ | SAME | NSAME ) relationalExpression
                    set86=input.LT(1);
                    set86=this.input.LT(1);
                    if ( (this.input.LA(1)>=EQ && this.input.LA(1)<=NSAME) ) {
                        this.input.consume();
                        root_0 = this.adaptor.becomeRoot(this.adaptor.create(set86), root_0);
                        this.state.errorRecovery=false;
                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        throw mse;
                    }

                    this.pushFollow(ES3Parser.FOLLOW_relationalExpression_in_equalityExpression3941);
                    relationalExpression87=this.relationalExpression();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, relationalExpression87.getTree());


                    break;

                default :
                    break loop24;
                }
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
    equalityExpressionNoIn_return: (function() {
        ES3Parser.equalityExpressionNoIn_return = function(){};
        org.antlr.lang.extend(ES3Parser.equalityExpressionNoIn_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1348:1: equalityExpressionNoIn : relationalExpressionNoIn ( ( EQ | NEQ | SAME | NSAME ) relationalExpressionNoIn )* ;
    // $ANTLR start "equalityExpressionNoIn"
    equalityExpressionNoIn: function() {
        var retval = new ES3Parser.equalityExpressionNoIn_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set89 = null;
         var relationalExpressionNoIn88 = null;
         var relationalExpressionNoIn90 = null;

        var set89_tree=null;

         var input = this.input; 
        try {
            // ES3.g3:1350:2: ( relationalExpressionNoIn ( ( EQ | NEQ | SAME | NSAME ) relationalExpressionNoIn )* )
            // ES3.g3:1350:4: relationalExpressionNoIn ( ( EQ | NEQ | SAME | NSAME ) relationalExpressionNoIn )*
            root_0 = this.adaptor.nil();

            this.pushFollow(ES3Parser.FOLLOW_relationalExpressionNoIn_in_equalityExpressionNoIn3959);
            relationalExpressionNoIn88=this.relationalExpressionNoIn();

            this.state._fsp--;

            this.adaptor.addChild(root_0, relationalExpressionNoIn88.getTree());
            // ES3.g3:1350:29: ( ( EQ | NEQ | SAME | NSAME ) relationalExpressionNoIn )*
            loop25:
            do {
                var alt25=2;
                var LA25_0 = this.input.LA(1);

                if ( ((LA25_0>=EQ && LA25_0<=NSAME)) ) {
                    alt25=1;
                }


                switch (alt25) {
                case 1 :
                    // ES3.g3:1350:31: ( EQ | NEQ | SAME | NSAME ) relationalExpressionNoIn
                    set89=input.LT(1);
                    set89=this.input.LT(1);
                    if ( (this.input.LA(1)>=EQ && this.input.LA(1)<=NSAME) ) {
                        this.input.consume();
                        root_0 = this.adaptor.becomeRoot(this.adaptor.create(set89), root_0);
                        this.state.errorRecovery=false;
                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        throw mse;
                    }

                    this.pushFollow(ES3Parser.FOLLOW_relationalExpressionNoIn_in_equalityExpressionNoIn3982);
                    relationalExpressionNoIn90=this.relationalExpressionNoIn();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, relationalExpressionNoIn90.getTree());


                    break;

                default :
                    break loop25;
                }
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
    bitwiseANDExpression_return: (function() {
        ES3Parser.bitwiseANDExpression_return = function(){};
        org.antlr.lang.extend(ES3Parser.bitwiseANDExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1357:1: bitwiseANDExpression : equalityExpression ( AND equalityExpression )* ;
    // $ANTLR start "bitwiseANDExpression"
    bitwiseANDExpression: function() {
        var retval = new ES3Parser.bitwiseANDExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var AND92 = null;
         var equalityExpression91 = null;
         var equalityExpression93 = null;

        var AND92_tree=null;

         var input = this.input; 
        try {
            // ES3.g3:1359:2: ( equalityExpression ( AND equalityExpression )* )
            // ES3.g3:1359:4: equalityExpression ( AND equalityExpression )*
            root_0 = this.adaptor.nil();

            this.pushFollow(ES3Parser.FOLLOW_equalityExpression_in_bitwiseANDExpression4006);
            equalityExpression91=this.equalityExpression();

            this.state._fsp--;

            this.adaptor.addChild(root_0, equalityExpression91.getTree());
            // ES3.g3:1359:23: ( AND equalityExpression )*
            loop26:
            do {
                var alt26=2;
                var LA26_0 = this.input.LA(1);

                if ( (LA26_0==AND) ) {
                    alt26=1;
                }


                switch (alt26) {
                case 1 :
                    // ES3.g3:1359:25: AND equalityExpression
                    AND92=this.match(this.input,AND,ES3Parser.FOLLOW_AND_in_bitwiseANDExpression4010); 
                    AND92_tree = this.adaptor.create(AND92);
                    root_0 = this.adaptor.becomeRoot(AND92_tree, root_0);

                    this.pushFollow(ES3Parser.FOLLOW_equalityExpression_in_bitwiseANDExpression4013);
                    equalityExpression93=this.equalityExpression();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, equalityExpression93.getTree());


                    break;

                default :
                    break loop26;
                }
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
    bitwiseANDExpressionNoIn_return: (function() {
        ES3Parser.bitwiseANDExpressionNoIn_return = function(){};
        org.antlr.lang.extend(ES3Parser.bitwiseANDExpressionNoIn_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1362:1: bitwiseANDExpressionNoIn : equalityExpressionNoIn ( AND equalityExpressionNoIn )* ;
    // $ANTLR start "bitwiseANDExpressionNoIn"
    bitwiseANDExpressionNoIn: function() {
        var retval = new ES3Parser.bitwiseANDExpressionNoIn_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var AND95 = null;
         var equalityExpressionNoIn94 = null;
         var equalityExpressionNoIn96 = null;

        var AND95_tree=null;

         var input = this.input; 
        try {
            // ES3.g3:1364:2: ( equalityExpressionNoIn ( AND equalityExpressionNoIn )* )
            // ES3.g3:1364:4: equalityExpressionNoIn ( AND equalityExpressionNoIn )*
            root_0 = this.adaptor.nil();

            this.pushFollow(ES3Parser.FOLLOW_equalityExpressionNoIn_in_bitwiseANDExpressionNoIn4031);
            equalityExpressionNoIn94=this.equalityExpressionNoIn();

            this.state._fsp--;

            this.adaptor.addChild(root_0, equalityExpressionNoIn94.getTree());
            // ES3.g3:1364:27: ( AND equalityExpressionNoIn )*
            loop27:
            do {
                var alt27=2;
                var LA27_0 = this.input.LA(1);

                if ( (LA27_0==AND) ) {
                    alt27=1;
                }


                switch (alt27) {
                case 1 :
                    // ES3.g3:1364:29: AND equalityExpressionNoIn
                    AND95=this.match(this.input,AND,ES3Parser.FOLLOW_AND_in_bitwiseANDExpressionNoIn4035); 
                    AND95_tree = this.adaptor.create(AND95);
                    root_0 = this.adaptor.becomeRoot(AND95_tree, root_0);

                    this.pushFollow(ES3Parser.FOLLOW_equalityExpressionNoIn_in_bitwiseANDExpressionNoIn4038);
                    equalityExpressionNoIn96=this.equalityExpressionNoIn();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, equalityExpressionNoIn96.getTree());


                    break;

                default :
                    break loop27;
                }
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
    bitwiseXORExpression_return: (function() {
        ES3Parser.bitwiseXORExpression_return = function(){};
        org.antlr.lang.extend(ES3Parser.bitwiseXORExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1367:1: bitwiseXORExpression : bitwiseANDExpression ( XOR bitwiseANDExpression )* ;
    // $ANTLR start "bitwiseXORExpression"
    bitwiseXORExpression: function() {
        var retval = new ES3Parser.bitwiseXORExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var XOR98 = null;
         var bitwiseANDExpression97 = null;
         var bitwiseANDExpression99 = null;

        var XOR98_tree=null;

         var input = this.input; 
        try {
            // ES3.g3:1369:2: ( bitwiseANDExpression ( XOR bitwiseANDExpression )* )
            // ES3.g3:1369:4: bitwiseANDExpression ( XOR bitwiseANDExpression )*
            root_0 = this.adaptor.nil();

            this.pushFollow(ES3Parser.FOLLOW_bitwiseANDExpression_in_bitwiseXORExpression4058);
            bitwiseANDExpression97=this.bitwiseANDExpression();

            this.state._fsp--;

            this.adaptor.addChild(root_0, bitwiseANDExpression97.getTree());
            // ES3.g3:1369:25: ( XOR bitwiseANDExpression )*
            loop28:
            do {
                var alt28=2;
                var LA28_0 = this.input.LA(1);

                if ( (LA28_0==XOR) ) {
                    alt28=1;
                }


                switch (alt28) {
                case 1 :
                    // ES3.g3:1369:27: XOR bitwiseANDExpression
                    XOR98=this.match(this.input,XOR,ES3Parser.FOLLOW_XOR_in_bitwiseXORExpression4062); 
                    XOR98_tree = this.adaptor.create(XOR98);
                    root_0 = this.adaptor.becomeRoot(XOR98_tree, root_0);

                    this.pushFollow(ES3Parser.FOLLOW_bitwiseANDExpression_in_bitwiseXORExpression4065);
                    bitwiseANDExpression99=this.bitwiseANDExpression();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, bitwiseANDExpression99.getTree());


                    break;

                default :
                    break loop28;
                }
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
    bitwiseXORExpressionNoIn_return: (function() {
        ES3Parser.bitwiseXORExpressionNoIn_return = function(){};
        org.antlr.lang.extend(ES3Parser.bitwiseXORExpressionNoIn_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1372:1: bitwiseXORExpressionNoIn : bitwiseANDExpressionNoIn ( XOR bitwiseANDExpressionNoIn )* ;
    // $ANTLR start "bitwiseXORExpressionNoIn"
    bitwiseXORExpressionNoIn: function() {
        var retval = new ES3Parser.bitwiseXORExpressionNoIn_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var XOR101 = null;
         var bitwiseANDExpressionNoIn100 = null;
         var bitwiseANDExpressionNoIn102 = null;

        var XOR101_tree=null;

         var input = this.input; 
        try {
            // ES3.g3:1374:2: ( bitwiseANDExpressionNoIn ( XOR bitwiseANDExpressionNoIn )* )
            // ES3.g3:1374:4: bitwiseANDExpressionNoIn ( XOR bitwiseANDExpressionNoIn )*
            root_0 = this.adaptor.nil();

            this.pushFollow(ES3Parser.FOLLOW_bitwiseANDExpressionNoIn_in_bitwiseXORExpressionNoIn4085);
            bitwiseANDExpressionNoIn100=this.bitwiseANDExpressionNoIn();

            this.state._fsp--;

            this.adaptor.addChild(root_0, bitwiseANDExpressionNoIn100.getTree());
            // ES3.g3:1374:29: ( XOR bitwiseANDExpressionNoIn )*
            loop29:
            do {
                var alt29=2;
                var LA29_0 = this.input.LA(1);

                if ( (LA29_0==XOR) ) {
                    alt29=1;
                }


                switch (alt29) {
                case 1 :
                    // ES3.g3:1374:31: XOR bitwiseANDExpressionNoIn
                    XOR101=this.match(this.input,XOR,ES3Parser.FOLLOW_XOR_in_bitwiseXORExpressionNoIn4089); 
                    XOR101_tree = this.adaptor.create(XOR101);
                    root_0 = this.adaptor.becomeRoot(XOR101_tree, root_0);

                    this.pushFollow(ES3Parser.FOLLOW_bitwiseANDExpressionNoIn_in_bitwiseXORExpressionNoIn4092);
                    bitwiseANDExpressionNoIn102=this.bitwiseANDExpressionNoIn();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, bitwiseANDExpressionNoIn102.getTree());


                    break;

                default :
                    break loop29;
                }
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
    bitwiseORExpression_return: (function() {
        ES3Parser.bitwiseORExpression_return = function(){};
        org.antlr.lang.extend(ES3Parser.bitwiseORExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1377:1: bitwiseORExpression : bitwiseXORExpression ( OR bitwiseXORExpression )* ;
    // $ANTLR start "bitwiseORExpression"
    bitwiseORExpression: function() {
        var retval = new ES3Parser.bitwiseORExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var OR104 = null;
         var bitwiseXORExpression103 = null;
         var bitwiseXORExpression105 = null;

        var OR104_tree=null;

         var input = this.input; 
        try {
            // ES3.g3:1379:2: ( bitwiseXORExpression ( OR bitwiseXORExpression )* )
            // ES3.g3:1379:4: bitwiseXORExpression ( OR bitwiseXORExpression )*
            root_0 = this.adaptor.nil();

            this.pushFollow(ES3Parser.FOLLOW_bitwiseXORExpression_in_bitwiseORExpression4111);
            bitwiseXORExpression103=this.bitwiseXORExpression();

            this.state._fsp--;

            this.adaptor.addChild(root_0, bitwiseXORExpression103.getTree());
            // ES3.g3:1379:25: ( OR bitwiseXORExpression )*
            loop30:
            do {
                var alt30=2;
                var LA30_0 = this.input.LA(1);

                if ( (LA30_0==OR) ) {
                    alt30=1;
                }


                switch (alt30) {
                case 1 :
                    // ES3.g3:1379:27: OR bitwiseXORExpression
                    OR104=this.match(this.input,OR,ES3Parser.FOLLOW_OR_in_bitwiseORExpression4115); 
                    OR104_tree = this.adaptor.create(OR104);
                    root_0 = this.adaptor.becomeRoot(OR104_tree, root_0);

                    this.pushFollow(ES3Parser.FOLLOW_bitwiseXORExpression_in_bitwiseORExpression4118);
                    bitwiseXORExpression105=this.bitwiseXORExpression();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, bitwiseXORExpression105.getTree());


                    break;

                default :
                    break loop30;
                }
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
    bitwiseORExpressionNoIn_return: (function() {
        ES3Parser.bitwiseORExpressionNoIn_return = function(){};
        org.antlr.lang.extend(ES3Parser.bitwiseORExpressionNoIn_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1382:1: bitwiseORExpressionNoIn : bitwiseXORExpressionNoIn ( OR bitwiseXORExpressionNoIn )* ;
    // $ANTLR start "bitwiseORExpressionNoIn"
    bitwiseORExpressionNoIn: function() {
        var retval = new ES3Parser.bitwiseORExpressionNoIn_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var OR107 = null;
         var bitwiseXORExpressionNoIn106 = null;
         var bitwiseXORExpressionNoIn108 = null;

        var OR107_tree=null;

         var input = this.input; 
        try {
            // ES3.g3:1384:2: ( bitwiseXORExpressionNoIn ( OR bitwiseXORExpressionNoIn )* )
            // ES3.g3:1384:4: bitwiseXORExpressionNoIn ( OR bitwiseXORExpressionNoIn )*
            root_0 = this.adaptor.nil();

            this.pushFollow(ES3Parser.FOLLOW_bitwiseXORExpressionNoIn_in_bitwiseORExpressionNoIn4137);
            bitwiseXORExpressionNoIn106=this.bitwiseXORExpressionNoIn();

            this.state._fsp--;

            this.adaptor.addChild(root_0, bitwiseXORExpressionNoIn106.getTree());
            // ES3.g3:1384:29: ( OR bitwiseXORExpressionNoIn )*
            loop31:
            do {
                var alt31=2;
                var LA31_0 = this.input.LA(1);

                if ( (LA31_0==OR) ) {
                    alt31=1;
                }


                switch (alt31) {
                case 1 :
                    // ES3.g3:1384:31: OR bitwiseXORExpressionNoIn
                    OR107=this.match(this.input,OR,ES3Parser.FOLLOW_OR_in_bitwiseORExpressionNoIn4141); 
                    OR107_tree = this.adaptor.create(OR107);
                    root_0 = this.adaptor.becomeRoot(OR107_tree, root_0);

                    this.pushFollow(ES3Parser.FOLLOW_bitwiseXORExpressionNoIn_in_bitwiseORExpressionNoIn4144);
                    bitwiseXORExpressionNoIn108=this.bitwiseXORExpressionNoIn();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, bitwiseXORExpressionNoIn108.getTree());


                    break;

                default :
                    break loop31;
                }
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
    logicalANDExpression_return: (function() {
        ES3Parser.logicalANDExpression_return = function(){};
        org.antlr.lang.extend(ES3Parser.logicalANDExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1391:1: logicalANDExpression : bitwiseORExpression ( LAND bitwiseORExpression )* ;
    // $ANTLR start "logicalANDExpression"
    logicalANDExpression: function() {
        var retval = new ES3Parser.logicalANDExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var LAND110 = null;
         var bitwiseORExpression109 = null;
         var bitwiseORExpression111 = null;

        var LAND110_tree=null;

         var input = this.input; 
        try {
            // ES3.g3:1393:2: ( bitwiseORExpression ( LAND bitwiseORExpression )* )
            // ES3.g3:1393:4: bitwiseORExpression ( LAND bitwiseORExpression )*
            root_0 = this.adaptor.nil();

            this.pushFollow(ES3Parser.FOLLOW_bitwiseORExpression_in_logicalANDExpression4167);
            bitwiseORExpression109=this.bitwiseORExpression();

            this.state._fsp--;

            this.adaptor.addChild(root_0, bitwiseORExpression109.getTree());
            // ES3.g3:1393:24: ( LAND bitwiseORExpression )*
            loop32:
            do {
                var alt32=2;
                var LA32_0 = this.input.LA(1);

                if ( (LA32_0==LAND) ) {
                    alt32=1;
                }


                switch (alt32) {
                case 1 :
                    // ES3.g3:1393:26: LAND bitwiseORExpression
                    LAND110=this.match(this.input,LAND,ES3Parser.FOLLOW_LAND_in_logicalANDExpression4171); 
                    LAND110_tree = this.adaptor.create(LAND110);
                    root_0 = this.adaptor.becomeRoot(LAND110_tree, root_0);

                    this.pushFollow(ES3Parser.FOLLOW_bitwiseORExpression_in_logicalANDExpression4174);
                    bitwiseORExpression111=this.bitwiseORExpression();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, bitwiseORExpression111.getTree());


                    break;

                default :
                    break loop32;
                }
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
    logicalANDExpressionNoIn_return: (function() {
        ES3Parser.logicalANDExpressionNoIn_return = function(){};
        org.antlr.lang.extend(ES3Parser.logicalANDExpressionNoIn_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1396:1: logicalANDExpressionNoIn : bitwiseORExpressionNoIn ( LAND bitwiseORExpressionNoIn )* ;
    // $ANTLR start "logicalANDExpressionNoIn"
    logicalANDExpressionNoIn: function() {
        var retval = new ES3Parser.logicalANDExpressionNoIn_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var LAND113 = null;
         var bitwiseORExpressionNoIn112 = null;
         var bitwiseORExpressionNoIn114 = null;

        var LAND113_tree=null;

         var input = this.input; 
        try {
            // ES3.g3:1398:2: ( bitwiseORExpressionNoIn ( LAND bitwiseORExpressionNoIn )* )
            // ES3.g3:1398:4: bitwiseORExpressionNoIn ( LAND bitwiseORExpressionNoIn )*
            root_0 = this.adaptor.nil();

            this.pushFollow(ES3Parser.FOLLOW_bitwiseORExpressionNoIn_in_logicalANDExpressionNoIn4192);
            bitwiseORExpressionNoIn112=this.bitwiseORExpressionNoIn();

            this.state._fsp--;

            this.adaptor.addChild(root_0, bitwiseORExpressionNoIn112.getTree());
            // ES3.g3:1398:28: ( LAND bitwiseORExpressionNoIn )*
            loop33:
            do {
                var alt33=2;
                var LA33_0 = this.input.LA(1);

                if ( (LA33_0==LAND) ) {
                    alt33=1;
                }


                switch (alt33) {
                case 1 :
                    // ES3.g3:1398:30: LAND bitwiseORExpressionNoIn
                    LAND113=this.match(this.input,LAND,ES3Parser.FOLLOW_LAND_in_logicalANDExpressionNoIn4196); 
                    LAND113_tree = this.adaptor.create(LAND113);
                    root_0 = this.adaptor.becomeRoot(LAND113_tree, root_0);

                    this.pushFollow(ES3Parser.FOLLOW_bitwiseORExpressionNoIn_in_logicalANDExpressionNoIn4199);
                    bitwiseORExpressionNoIn114=this.bitwiseORExpressionNoIn();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, bitwiseORExpressionNoIn114.getTree());


                    break;

                default :
                    break loop33;
                }
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
    logicalORExpression_return: (function() {
        ES3Parser.logicalORExpression_return = function(){};
        org.antlr.lang.extend(ES3Parser.logicalORExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1401:1: logicalORExpression : logicalANDExpression ( LOR logicalANDExpression )* ;
    // $ANTLR start "logicalORExpression"
    logicalORExpression: function() {
        var retval = new ES3Parser.logicalORExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var LOR116 = null;
         var logicalANDExpression115 = null;
         var logicalANDExpression117 = null;

        var LOR116_tree=null;

         var input = this.input; 
        try {
            // ES3.g3:1403:2: ( logicalANDExpression ( LOR logicalANDExpression )* )
            // ES3.g3:1403:4: logicalANDExpression ( LOR logicalANDExpression )*
            root_0 = this.adaptor.nil();

            this.pushFollow(ES3Parser.FOLLOW_logicalANDExpression_in_logicalORExpression4218);
            logicalANDExpression115=this.logicalANDExpression();

            this.state._fsp--;

            this.adaptor.addChild(root_0, logicalANDExpression115.getTree());
            // ES3.g3:1403:25: ( LOR logicalANDExpression )*
            loop34:
            do {
                var alt34=2;
                var LA34_0 = this.input.LA(1);

                if ( (LA34_0==LOR) ) {
                    alt34=1;
                }


                switch (alt34) {
                case 1 :
                    // ES3.g3:1403:27: LOR logicalANDExpression
                    LOR116=this.match(this.input,LOR,ES3Parser.FOLLOW_LOR_in_logicalORExpression4222); 
                    LOR116_tree = this.adaptor.create(LOR116);
                    root_0 = this.adaptor.becomeRoot(LOR116_tree, root_0);

                    this.pushFollow(ES3Parser.FOLLOW_logicalANDExpression_in_logicalORExpression4225);
                    logicalANDExpression117=this.logicalANDExpression();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, logicalANDExpression117.getTree());


                    break;

                default :
                    break loop34;
                }
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
    logicalORExpressionNoIn_return: (function() {
        ES3Parser.logicalORExpressionNoIn_return = function(){};
        org.antlr.lang.extend(ES3Parser.logicalORExpressionNoIn_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1406:1: logicalORExpressionNoIn : logicalANDExpressionNoIn ( LOR logicalANDExpressionNoIn )* ;
    // $ANTLR start "logicalORExpressionNoIn"
    logicalORExpressionNoIn: function() {
        var retval = new ES3Parser.logicalORExpressionNoIn_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var LOR119 = null;
         var logicalANDExpressionNoIn118 = null;
         var logicalANDExpressionNoIn120 = null;

        var LOR119_tree=null;

         var input = this.input; 
        try {
            // ES3.g3:1408:2: ( logicalANDExpressionNoIn ( LOR logicalANDExpressionNoIn )* )
            // ES3.g3:1408:4: logicalANDExpressionNoIn ( LOR logicalANDExpressionNoIn )*
            root_0 = this.adaptor.nil();

            this.pushFollow(ES3Parser.FOLLOW_logicalANDExpressionNoIn_in_logicalORExpressionNoIn4244);
            logicalANDExpressionNoIn118=this.logicalANDExpressionNoIn();

            this.state._fsp--;

            this.adaptor.addChild(root_0, logicalANDExpressionNoIn118.getTree());
            // ES3.g3:1408:29: ( LOR logicalANDExpressionNoIn )*
            loop35:
            do {
                var alt35=2;
                var LA35_0 = this.input.LA(1);

                if ( (LA35_0==LOR) ) {
                    alt35=1;
                }


                switch (alt35) {
                case 1 :
                    // ES3.g3:1408:31: LOR logicalANDExpressionNoIn
                    LOR119=this.match(this.input,LOR,ES3Parser.FOLLOW_LOR_in_logicalORExpressionNoIn4248); 
                    LOR119_tree = this.adaptor.create(LOR119);
                    root_0 = this.adaptor.becomeRoot(LOR119_tree, root_0);

                    this.pushFollow(ES3Parser.FOLLOW_logicalANDExpressionNoIn_in_logicalORExpressionNoIn4251);
                    logicalANDExpressionNoIn120=this.logicalANDExpressionNoIn();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, logicalANDExpressionNoIn120.getTree());


                    break;

                default :
                    break loop35;
                }
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
    conditionalExpression_return: (function() {
        ES3Parser.conditionalExpression_return = function(){};
        org.antlr.lang.extend(ES3Parser.conditionalExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1415:1: conditionalExpression : logicalORExpression ( QUE assignmentExpression COLON assignmentExpression )? ;
    // $ANTLR start "conditionalExpression"
    conditionalExpression: function() {
        var retval = new ES3Parser.conditionalExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var QUE122 = null;
        var COLON124 = null;
         var logicalORExpression121 = null;
         var assignmentExpression123 = null;
         var assignmentExpression125 = null;

        var QUE122_tree=null;
        var COLON124_tree=null;

         var input = this.input; 
        try {
            // ES3.g3:1417:2: ( logicalORExpression ( QUE assignmentExpression COLON assignmentExpression )? )
            // ES3.g3:1417:4: logicalORExpression ( QUE assignmentExpression COLON assignmentExpression )?
            root_0 = this.adaptor.nil();

            this.pushFollow(ES3Parser.FOLLOW_logicalORExpression_in_conditionalExpression4274);
            logicalORExpression121=this.logicalORExpression();

            this.state._fsp--;

            this.adaptor.addChild(root_0, logicalORExpression121.getTree());
            // ES3.g3:1417:24: ( QUE assignmentExpression COLON assignmentExpression )?
            var alt36=2;
            var LA36_0 = this.input.LA(1);

            if ( (LA36_0==QUE) ) {
                alt36=1;
            }
            switch (alt36) {
                case 1 :
                    // ES3.g3:1417:26: QUE assignmentExpression COLON assignmentExpression
                    QUE122=this.match(this.input,QUE,ES3Parser.FOLLOW_QUE_in_conditionalExpression4278); 
                    QUE122_tree = this.adaptor.create(QUE122);
                    root_0 = this.adaptor.becomeRoot(QUE122_tree, root_0);

                    this.pushFollow(ES3Parser.FOLLOW_assignmentExpression_in_conditionalExpression4281);
                    assignmentExpression123=this.assignmentExpression();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, assignmentExpression123.getTree());
                    COLON124=this.match(this.input,COLON,ES3Parser.FOLLOW_COLON_in_conditionalExpression4283); 
                    this.pushFollow(ES3Parser.FOLLOW_assignmentExpression_in_conditionalExpression4286);
                    assignmentExpression125=this.assignmentExpression();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, assignmentExpression125.getTree());


                    break;

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
    conditionalExpressionNoIn_return: (function() {
        ES3Parser.conditionalExpressionNoIn_return = function(){};
        org.antlr.lang.extend(ES3Parser.conditionalExpressionNoIn_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1420:1: conditionalExpressionNoIn : logicalORExpressionNoIn ( QUE assignmentExpressionNoIn COLON assignmentExpressionNoIn )? ;
    // $ANTLR start "conditionalExpressionNoIn"
    conditionalExpressionNoIn: function() {
        var retval = new ES3Parser.conditionalExpressionNoIn_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var QUE127 = null;
        var COLON129 = null;
         var logicalORExpressionNoIn126 = null;
         var assignmentExpressionNoIn128 = null;
         var assignmentExpressionNoIn130 = null;

        var QUE127_tree=null;
        var COLON129_tree=null;

         var input = this.input; 
        try {
            // ES3.g3:1422:2: ( logicalORExpressionNoIn ( QUE assignmentExpressionNoIn COLON assignmentExpressionNoIn )? )
            // ES3.g3:1422:4: logicalORExpressionNoIn ( QUE assignmentExpressionNoIn COLON assignmentExpressionNoIn )?
            root_0 = this.adaptor.nil();

            this.pushFollow(ES3Parser.FOLLOW_logicalORExpressionNoIn_in_conditionalExpressionNoIn4304);
            logicalORExpressionNoIn126=this.logicalORExpressionNoIn();

            this.state._fsp--;

            this.adaptor.addChild(root_0, logicalORExpressionNoIn126.getTree());
            // ES3.g3:1422:28: ( QUE assignmentExpressionNoIn COLON assignmentExpressionNoIn )?
            var alt37=2;
            var LA37_0 = this.input.LA(1);

            if ( (LA37_0==QUE) ) {
                alt37=1;
            }
            switch (alt37) {
                case 1 :
                    // ES3.g3:1422:30: QUE assignmentExpressionNoIn COLON assignmentExpressionNoIn
                    QUE127=this.match(this.input,QUE,ES3Parser.FOLLOW_QUE_in_conditionalExpressionNoIn4308); 
                    QUE127_tree = this.adaptor.create(QUE127);
                    root_0 = this.adaptor.becomeRoot(QUE127_tree, root_0);

                    this.pushFollow(ES3Parser.FOLLOW_assignmentExpressionNoIn_in_conditionalExpressionNoIn4311);
                    assignmentExpressionNoIn128=this.assignmentExpressionNoIn();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, assignmentExpressionNoIn128.getTree());
                    COLON129=this.match(this.input,COLON,ES3Parser.FOLLOW_COLON_in_conditionalExpressionNoIn4313); 
                    this.pushFollow(ES3Parser.FOLLOW_assignmentExpressionNoIn_in_conditionalExpressionNoIn4316);
                    assignmentExpressionNoIn130=this.assignmentExpressionNoIn();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, assignmentExpressionNoIn130.getTree());


                    break;

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
    assignmentExpression_return: (function() {
        ES3Parser.assignmentExpression_return = function(){};
        org.antlr.lang.extend(ES3Parser.assignmentExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1451:1: assignmentExpression : lhs= conditionalExpression ({...}? assignmentOperator assignmentExpression )? ;
    // $ANTLR start "assignmentExpression"
    assignmentExpression: function() {
        var retval = new ES3Parser.assignmentExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

         var lhs = null;
         var assignmentOperator131 = null;
         var assignmentExpression132 = null;



        //	Object[] 
        	  var isLhs = new Array();// Object[1];

        try {
            // ES3.g3:1457:2: (lhs= conditionalExpression ({...}? assignmentOperator assignmentExpression )? )
            // ES3.g3:1457:4: lhs= conditionalExpression ({...}? assignmentOperator assignmentExpression )?
            root_0 = this.adaptor.nil();

            this.pushFollow(ES3Parser.FOLLOW_conditionalExpression_in_assignmentExpression4344);
            lhs=this.conditionalExpression();

            this.state._fsp--;

            this.adaptor.addChild(root_0, lhs.getTree());
            // ES3.g3:1458:2: ({...}? assignmentOperator assignmentExpression )?
            var alt38=2;
            var LA38_0 = this.input.LA(1);

            if ( ((LA38_0>=ASSIGN && LA38_0<=XORASS)||LA38_0==DIVASS) ) {
                var LA38_1 = this.input.LA(2);

                if ( (( this.isLeftHandSideAssign(lhs, isLhs) )) ) {
                    alt38=1;
                }
            }
            switch (alt38) {
                case 1 :
                    // ES3.g3:1458:4: {...}? assignmentOperator assignmentExpression
                    if ( !(( this.isLeftHandSideAssign(lhs, isLhs) )) ) {
                        throw new org.antlr.runtime.FailedPredicateException(this.input, "assignmentExpression", " this.isLeftHandSideAssign(lhs, isLhs) ");
                    }
                    this.pushFollow(ES3Parser.FOLLOW_assignmentOperator_in_assignmentExpression4351);
                    assignmentOperator131=this.assignmentOperator();

                    this.state._fsp--;

                    root_0 = this.adaptor.becomeRoot(assignmentOperator131.getTree(), root_0);
                    this.pushFollow(ES3Parser.FOLLOW_assignmentExpression_in_assignmentExpression4354);
                    assignmentExpression132=this.assignmentExpression();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, assignmentExpression132.getTree());


                    break;

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
    assignmentOperator_return: (function() {
        ES3Parser.assignmentOperator_return = function(){};
        org.antlr.lang.extend(ES3Parser.assignmentOperator_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1461:1: assignmentOperator : ( ASSIGN | MULASS | DIVASS | MODASS | ADDASS | SUBASS | SHLASS | SHRASS | SHUASS | ANDASS | XORASS | ORASS );
    // $ANTLR start "assignmentOperator"
    assignmentOperator: function() {
        var retval = new ES3Parser.assignmentOperator_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set133 = null;

        var set133_tree=null;

        try {
            // ES3.g3:1462:2: ( ASSIGN | MULASS | DIVASS | MODASS | ADDASS | SUBASS | SHLASS | SHRASS | SHUASS | ANDASS | XORASS | ORASS )
            // ES3.g3:
            root_0 = this.adaptor.nil();

            set133=this.input.LT(1);
            if ( (this.input.LA(1)>=ASSIGN && this.input.LA(1)<=XORASS)||this.input.LA(1)==DIVASS ) {
                this.input.consume();
                this.adaptor.addChild(root_0, this.adaptor.create(set133));
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
    assignmentExpressionNoIn_return: (function() {
        ES3Parser.assignmentExpressionNoIn_return = function(){};
        org.antlr.lang.extend(ES3Parser.assignmentExpressionNoIn_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1465:1: assignmentExpressionNoIn : lhs= conditionalExpressionNoIn ({...}? assignmentOperator assignmentExpressionNoIn )? ;
    // $ANTLR start "assignmentExpressionNoIn"
    assignmentExpressionNoIn: function() {
        var retval = new ES3Parser.assignmentExpressionNoIn_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

         var lhs = null;
         var assignmentOperator134 = null;
         var assignmentExpressionNoIn135 = null;



        //	Object[] 
        	  var isLhs = new Array();//Object[1];

        try {
            // ES3.g3:1471:2: (lhs= conditionalExpressionNoIn ({...}? assignmentOperator assignmentExpressionNoIn )? )
            // ES3.g3:1471:4: lhs= conditionalExpressionNoIn ({...}? assignmentOperator assignmentExpressionNoIn )?
            root_0 = this.adaptor.nil();

            this.pushFollow(ES3Parser.FOLLOW_conditionalExpressionNoIn_in_assignmentExpressionNoIn4431);
            lhs=this.conditionalExpressionNoIn();

            this.state._fsp--;

            this.adaptor.addChild(root_0, lhs.getTree());
            // ES3.g3:1472:2: ({...}? assignmentOperator assignmentExpressionNoIn )?
            var alt39=2;
            var LA39_0 = this.input.LA(1);

            if ( ((LA39_0>=ASSIGN && LA39_0<=XORASS)||LA39_0==DIVASS) ) {
                var LA39_1 = this.input.LA(2);

                if ( (( this.isLeftHandSideAssign(lhs, isLhs) )) ) {
                    alt39=1;
                }
            }
            switch (alt39) {
                case 1 :
                    // ES3.g3:1472:4: {...}? assignmentOperator assignmentExpressionNoIn
                    if ( !(( this.isLeftHandSideAssign(lhs, isLhs) )) ) {
                        throw new org.antlr.runtime.FailedPredicateException(this.input, "assignmentExpressionNoIn", " this.isLeftHandSideAssign(lhs, isLhs) ");
                    }
                    this.pushFollow(ES3Parser.FOLLOW_assignmentOperator_in_assignmentExpressionNoIn4438);
                    assignmentOperator134=this.assignmentOperator();

                    this.state._fsp--;

                    root_0 = this.adaptor.becomeRoot(assignmentOperator134.getTree(), root_0);
                    this.pushFollow(ES3Parser.FOLLOW_assignmentExpressionNoIn_in_assignmentExpressionNoIn4441);
                    assignmentExpressionNoIn135=this.assignmentExpressionNoIn();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, assignmentExpressionNoIn135.getTree());


                    break;

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
    expression_return: (function() {
        ES3Parser.expression_return = function(){};
        org.antlr.lang.extend(ES3Parser.expression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1479:1: expression : exprs+= assignmentExpression ( COMMA exprs+= assignmentExpression )* -> { $exprs.length > 1 }? ^( CEXPR ( $exprs)+ ) -> $exprs;
    // $ANTLR start "expression"
    expression: function() {
        var retval = new ES3Parser.expression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var COMMA136 = null;
        var list_exprs=null;
        var exprs = null;
        var COMMA136_tree=null;
        var stream_COMMA=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token COMMA");
        var stream_assignmentExpression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule assignmentExpression");
        try {
            // ES3.g3:1480:2: (exprs+= assignmentExpression ( COMMA exprs+= assignmentExpression )* -> { $exprs.length > 1 }? ^( CEXPR ( $exprs)+ ) -> $exprs)
            // ES3.g3:1480:4: exprs+= assignmentExpression ( COMMA exprs+= assignmentExpression )*
            this.pushFollow(ES3Parser.FOLLOW_assignmentExpression_in_expression4463);
            exprs=this.assignmentExpression();

            this.state._fsp--;

            stream_assignmentExpression.add(exprs.getTree());
            if (org.antlr.lang.isNull(list_exprs)) list_exprs = [];
            list_exprs.push(exprs.getTree());

            // ES3.g3:1480:32: ( COMMA exprs+= assignmentExpression )*
            loop40:
            do {
                var alt40=2;
                var LA40_0 = this.input.LA(1);

                if ( (LA40_0==COMMA) ) {
                    alt40=1;
                }


                switch (alt40) {
                case 1 :
                    // ES3.g3:1480:34: COMMA exprs+= assignmentExpression
                    COMMA136=this.match(this.input,COMMA,ES3Parser.FOLLOW_COMMA_in_expression4467);  
                    stream_COMMA.add(COMMA136);

                    this.pushFollow(ES3Parser.FOLLOW_assignmentExpression_in_expression4471);
                    exprs=this.assignmentExpression();

                    this.state._fsp--;

                    stream_assignmentExpression.add(exprs.getTree());
                    if (org.antlr.lang.isNull(list_exprs)) list_exprs = [];
                    list_exprs.push(exprs.getTree());



                    break;

                default :
                    break loop40;
                }
            } while (true);



            // AST REWRITE
            // elements: exprs, exprs
            // token labels: 
            // rule labels: retval
            // token list labels: 
            // rule list labels: exprs
            retval.tree = root_0;
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);
            var stream_exprs=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token exprs",list_exprs);
            root_0 = this.adaptor.nil();
            // 1481:2: -> { $exprs.length > 1 }? ^( CEXPR ( $exprs)+ )
            if ( list_exprs.length > 1 ) {
                // ES3.g3:1481:28: ^( CEXPR ( $exprs)+ )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(CEXPR, "CEXPR"), root_1);

                if ( !(stream_exprs.hasNext()) ) {
                    throw new org.antlr.runtime.tree.RewriteEarlyExitException();
                }
                while ( stream_exprs.hasNext() ) {
                    this.adaptor.addChild(root_1, stream_exprs.nextTree());

                }
                stream_exprs.reset();

                this.adaptor.addChild(root_0, root_1);
                }

            }
            else // 1482:2: -> $exprs
            {
                this.adaptor.addChild(root_0, stream_exprs.nextTree());

            }

            retval.tree = root_0;


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
    expressionNoIn_return: (function() {
        ES3Parser.expressionNoIn_return = function(){};
        org.antlr.lang.extend(ES3Parser.expressionNoIn_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1485:1: expressionNoIn : exprs+= assignmentExpressionNoIn ( COMMA exprs+= assignmentExpressionNoIn )* -> { $exprs.length > 1 }? ^( CEXPR ( $exprs)+ ) -> $exprs;
    // $ANTLR start "expressionNoIn"
    expressionNoIn: function() {
        var retval = new ES3Parser.expressionNoIn_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var COMMA137 = null;
        var list_exprs=null;
        var exprs = null;
        var COMMA137_tree=null;
        var stream_COMMA=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token COMMA");
        var stream_assignmentExpressionNoIn=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule assignmentExpressionNoIn");
        try {
            // ES3.g3:1486:2: (exprs+= assignmentExpressionNoIn ( COMMA exprs+= assignmentExpressionNoIn )* -> { $exprs.length > 1 }? ^( CEXPR ( $exprs)+ ) -> $exprs)
            // ES3.g3:1486:4: exprs+= assignmentExpressionNoIn ( COMMA exprs+= assignmentExpressionNoIn )*
            this.pushFollow(ES3Parser.FOLLOW_assignmentExpressionNoIn_in_expressionNoIn4508);
            exprs=this.assignmentExpressionNoIn();

            this.state._fsp--;

            stream_assignmentExpressionNoIn.add(exprs.getTree());
            if (org.antlr.lang.isNull(list_exprs)) list_exprs = [];
            list_exprs.push(exprs.getTree());

            // ES3.g3:1486:36: ( COMMA exprs+= assignmentExpressionNoIn )*
            loop41:
            do {
                var alt41=2;
                var LA41_0 = this.input.LA(1);

                if ( (LA41_0==COMMA) ) {
                    alt41=1;
                }


                switch (alt41) {
                case 1 :
                    // ES3.g3:1486:38: COMMA exprs+= assignmentExpressionNoIn
                    COMMA137=this.match(this.input,COMMA,ES3Parser.FOLLOW_COMMA_in_expressionNoIn4512);  
                    stream_COMMA.add(COMMA137);

                    this.pushFollow(ES3Parser.FOLLOW_assignmentExpressionNoIn_in_expressionNoIn4516);
                    exprs=this.assignmentExpressionNoIn();

                    this.state._fsp--;

                    stream_assignmentExpressionNoIn.add(exprs.getTree());
                    if (org.antlr.lang.isNull(list_exprs)) list_exprs = [];
                    list_exprs.push(exprs.getTree());



                    break;

                default :
                    break loop41;
                }
            } while (true);



            // AST REWRITE
            // elements: exprs, exprs
            // token labels: 
            // rule labels: retval
            // token list labels: 
            // rule list labels: exprs
            retval.tree = root_0;
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);
            var stream_exprs=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token exprs",list_exprs);
            root_0 = this.adaptor.nil();
            // 1487:2: -> { $exprs.length > 1 }? ^( CEXPR ( $exprs)+ )
            if ( list_exprs.length > 1 ) {
                // ES3.g3:1487:28: ^( CEXPR ( $exprs)+ )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(CEXPR, "CEXPR"), root_1);

                if ( !(stream_exprs.hasNext()) ) {
                    throw new org.antlr.runtime.tree.RewriteEarlyExitException();
                }
                while ( stream_exprs.hasNext() ) {
                    this.adaptor.addChild(root_1, stream_exprs.nextTree());

                }
                stream_exprs.reset();

                this.adaptor.addChild(root_0, root_1);
                }

            }
            else // 1488:2: -> $exprs
            {
                this.adaptor.addChild(root_0, stream_exprs.nextTree());

            }

            retval.tree = root_0;


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
    semic_return: (function() {
        ES3Parser.semic_return = function(){};
        org.antlr.lang.extend(ES3Parser.semic_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1513:1: semic : ( SEMIC | EOF | RBRACE | EOL | MultiLineComment );
    // $ANTLR start "semic"
    semic: function() {
        var retval = new ES3Parser.semic_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var SEMIC138 = null;
        var EOF139 = null;
        var RBRACE140 = null;
        var EOL141 = null;
        var MultiLineComment142 = null;

        var SEMIC138_tree=null;
        var EOF139_tree=null;
        var RBRACE140_tree=null;
        var EOL141_tree=null;
        var MultiLineComment142_tree=null;


        	// Mark current position so we can unconsume a RBRACE.
        //	int 
        	  var marker = this.input.mark();
        	// Promote EOL if appropriate	
        	this.promoteEOL(retval);

        try {
            // ES3.g3:1522:2: ( SEMIC | EOF | RBRACE | EOL | MultiLineComment )
            var alt42=5;
            switch ( this.input.LA(1) ) {
            case SEMIC:
                alt42=1;
                break;
            case EOF:
                alt42=2;
                break;
            case RBRACE:
                alt42=3;
                break;
            case EOL:
                alt42=4;
                break;
            case MultiLineComment:
                alt42=5;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 42, 0, this.input);

                throw nvae;
            }

            switch (alt42) {
                case 1 :
                    // ES3.g3:1522:4: SEMIC
                    root_0 = this.adaptor.nil();

                    SEMIC138=this.match(this.input,SEMIC,ES3Parser.FOLLOW_SEMIC_in_semic4567); 
                    SEMIC138_tree = this.adaptor.create(SEMIC138);
                    this.adaptor.addChild(root_0, SEMIC138_tree);



                    break;
                case 2 :
                    // ES3.g3:1523:4: EOF
                    root_0 = this.adaptor.nil();

                    EOF139=this.match(this.input,EOF,ES3Parser.FOLLOW_EOF_in_semic4572); 
                    EOF139_tree = this.adaptor.create(EOF139);
                    this.adaptor.addChild(root_0, EOF139_tree);



                    break;
                case 3 :
                    // ES3.g3:1524:4: RBRACE
                    root_0 = this.adaptor.nil();

                    RBRACE140=this.match(this.input,RBRACE,ES3Parser.FOLLOW_RBRACE_in_semic4577); 
                    RBRACE140_tree = this.adaptor.create(RBRACE140);
                    this.adaptor.addChild(root_0, RBRACE140_tree);

                     this.input.rewind(marker); 


                    break;
                case 4 :
                    // ES3.g3:1525:4: EOL
                    root_0 = this.adaptor.nil();

                    EOL141=this.match(this.input,EOL,ES3Parser.FOLLOW_EOL_in_semic4584); 
                    EOL141_tree = this.adaptor.create(EOL141);
                    this.adaptor.addChild(root_0, EOL141_tree);



                    break;
                case 5 :
                    // ES3.g3:1525:10: MultiLineComment
                    root_0 = this.adaptor.nil();

                    MultiLineComment142=this.match(this.input,MultiLineComment,ES3Parser.FOLLOW_MultiLineComment_in_semic4588); 
                    MultiLineComment142_tree = this.adaptor.create(MultiLineComment142);
                    this.adaptor.addChild(root_0, MultiLineComment142_tree);



                    break;

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
    statement_return: (function() {
        ES3Parser.statement_return = function(){};
        org.antlr.lang.extend(ES3Parser.statement_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1533:1: statement options {k=1; } : ({...}? block | statementTail );
    // $ANTLR start "statement"
    statement: function() {
        var retval = new ES3Parser.statement_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

         var block143 = null;
         var statementTail144 = null;


        try {
            // ES3.g3:1538:2: ({...}? block | statementTail )
            var alt43=2;
            alt43 = this.dfa43.predict(this.input);
            switch (alt43) {
                case 1 :
                    // ES3.g3:1538:4: {...}? block
                    root_0 = this.adaptor.nil();

                    if ( !(( this.input.LA(1) == this.theParser.LBRACE )) ) {
                        throw new org.antlr.runtime.FailedPredicateException(this.input, "statement", " this.input.LA(1) == this.theParser.LBRACE ");
                    }
                    this.pushFollow(ES3Parser.FOLLOW_block_in_statement4617);
                    block143=this.block();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, block143.getTree());


                    break;
                case 2 :
                    // ES3.g3:1539:4: statementTail
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_statementTail_in_statement4622);
                    statementTail144=this.statementTail();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, statementTail144.getTree());


                    break;

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
    statementTail_return: (function() {
        ES3Parser.statementTail_return = function(){};
        org.antlr.lang.extend(ES3Parser.statementTail_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1542:1: statementTail : ( variableStatement | emptyStatement | expressionStatement | ifStatement | iterationStatement | continueStatement | breakStatement | returnStatement | withStatement | labelledStatement | switchStatement | throwStatement | tryStatement );
    // $ANTLR start "statementTail"
    statementTail: function() {
        var retval = new ES3Parser.statementTail_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

         var variableStatement145 = null;
         var emptyStatement146 = null;
         var expressionStatement147 = null;
         var ifStatement148 = null;
         var iterationStatement149 = null;
         var continueStatement150 = null;
         var breakStatement151 = null;
         var returnStatement152 = null;
         var withStatement153 = null;
         var labelledStatement154 = null;
         var switchStatement155 = null;
         var throwStatement156 = null;
         var tryStatement157 = null;


        try {
            // ES3.g3:1543:2: ( variableStatement | emptyStatement | expressionStatement | ifStatement | iterationStatement | continueStatement | breakStatement | returnStatement | withStatement | labelledStatement | switchStatement | throwStatement | tryStatement )
            var alt44=13;
            alt44 = this.dfa44.predict(this.input);
            switch (alt44) {
                case 1 :
                    // ES3.g3:1543:4: variableStatement
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_variableStatement_in_statementTail4634);
                    variableStatement145=this.variableStatement();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, variableStatement145.getTree());


                    break;
                case 2 :
                    // ES3.g3:1544:4: emptyStatement
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_emptyStatement_in_statementTail4639);
                    emptyStatement146=this.emptyStatement();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, emptyStatement146.getTree());


                    break;
                case 3 :
                    // ES3.g3:1545:4: expressionStatement
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_expressionStatement_in_statementTail4644);
                    expressionStatement147=this.expressionStatement();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, expressionStatement147.getTree());


                    break;
                case 4 :
                    // ES3.g3:1546:4: ifStatement
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_ifStatement_in_statementTail4649);
                    ifStatement148=this.ifStatement();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, ifStatement148.getTree());


                    break;
                case 5 :
                    // ES3.g3:1547:4: iterationStatement
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_iterationStatement_in_statementTail4654);
                    iterationStatement149=this.iterationStatement();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, iterationStatement149.getTree());


                    break;
                case 6 :
                    // ES3.g3:1548:4: continueStatement
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_continueStatement_in_statementTail4659);
                    continueStatement150=this.continueStatement();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, continueStatement150.getTree());


                    break;
                case 7 :
                    // ES3.g3:1549:4: breakStatement
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_breakStatement_in_statementTail4664);
                    breakStatement151=this.breakStatement();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, breakStatement151.getTree());


                    break;
                case 8 :
                    // ES3.g3:1550:4: returnStatement
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_returnStatement_in_statementTail4669);
                    returnStatement152=this.returnStatement();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, returnStatement152.getTree());


                    break;
                case 9 :
                    // ES3.g3:1551:4: withStatement
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_withStatement_in_statementTail4674);
                    withStatement153=this.withStatement();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, withStatement153.getTree());


                    break;
                case 10 :
                    // ES3.g3:1552:4: labelledStatement
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_labelledStatement_in_statementTail4679);
                    labelledStatement154=this.labelledStatement();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, labelledStatement154.getTree());


                    break;
                case 11 :
                    // ES3.g3:1553:4: switchStatement
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_switchStatement_in_statementTail4684);
                    switchStatement155=this.switchStatement();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, switchStatement155.getTree());


                    break;
                case 12 :
                    // ES3.g3:1554:4: throwStatement
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_throwStatement_in_statementTail4689);
                    throwStatement156=this.throwStatement();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, throwStatement156.getTree());


                    break;
                case 13 :
                    // ES3.g3:1555:4: tryStatement
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_tryStatement_in_statementTail4694);
                    tryStatement157=this.tryStatement();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, tryStatement157.getTree());


                    break;

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
    block_return: (function() {
        ES3Parser.block_return = function(){};
        org.antlr.lang.extend(ES3Parser.block_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1560:1: block : lb= LBRACE ( statement )* RBRACE -> ^( BLOCK[$lb, \"BLOCK\"] ( statement )* ) ;
    // $ANTLR start "block"
    block: function() {
        var retval = new ES3Parser.block_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var lb = null;
        var RBRACE159 = null;
         var statement158 = null;

        var lb_tree=null;
        var RBRACE159_tree=null;
        var stream_RBRACE=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token RBRACE");
        var stream_LBRACE=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token LBRACE");
        var stream_statement=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule statement");
        try {
            // ES3.g3:1561:2: (lb= LBRACE ( statement )* RBRACE -> ^( BLOCK[$lb, \"BLOCK\"] ( statement )* ) )
            // ES3.g3:1561:4: lb= LBRACE ( statement )* RBRACE
            lb=this.match(this.input,LBRACE,ES3Parser.FOLLOW_LBRACE_in_block4709);  
            stream_LBRACE.add(lb);

            // ES3.g3:1561:14: ( statement )*
            loop45:
            do {
                var alt45=2;
                var LA45_0 = this.input.LA(1);

                if ( ((LA45_0>=NULL && LA45_0<=BREAK)||LA45_0==CONTINUE||(LA45_0>=DELETE && LA45_0<=DO)||(LA45_0>=FOR && LA45_0<=IF)||(LA45_0>=NEW && LA45_0<=WITH)||LA45_0==LBRACE||LA45_0==LBRACK||LA45_0==SEMIC||(LA45_0>=ADD && LA45_0<=SUB)||(LA45_0>=INC && LA45_0<=DEC)||(LA45_0>=NOT && LA45_0<=INV)||(LA45_0>=Identifier && LA45_0<=StringLiteral)||(LA45_0>=IdentifierNameAmpersatStart && LA45_0<=LPAREN)||LA45_0==RegularExpressionLiteral||(LA45_0>=DecimalLiteral && LA45_0<=HexIntegerLiteral)) ) {
                    alt45=1;
                }


                switch (alt45) {
                case 1 :
                    // ES3.g3:1561:14: statement
                    this.pushFollow(ES3Parser.FOLLOW_statement_in_block4711);
                    statement158=this.statement();

                    this.state._fsp--;

                    stream_statement.add(statement158.getTree());


                    break;

                default :
                    break loop45;
                }
            } while (true);

            RBRACE159=this.match(this.input,RBRACE,ES3Parser.FOLLOW_RBRACE_in_block4714);  
            stream_RBRACE.add(RBRACE159);



            // AST REWRITE
            // elements: statement
            // token labels: 
            // rule labels: retval
            // token list labels: 
            // rule list labels: 
            retval.tree = root_0;
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 1562:2: -> ^( BLOCK[$lb, \"BLOCK\"] ( statement )* )
            {
                // ES3.g3:1562:5: ^( BLOCK[$lb, \"BLOCK\"] ( statement )* )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(BLOCK, lb, "BLOCK"), root_1);

                // ES3.g3:1562:28: ( statement )*
                while ( stream_statement.hasNext() ) {
                    this.adaptor.addChild(root_1, stream_statement.nextTree());

                }
                stream_statement.reset();

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;


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
    variableStatement_return: (function() {
        ES3Parser.variableStatement_return = function(){};
        org.antlr.lang.extend(ES3Parser.variableStatement_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1569:1: variableStatement : VAR variableDeclaration ( COMMA variableDeclaration )* semic -> ^( VAR ( variableDeclaration )+ ) ;
    // $ANTLR start "variableStatement"
    variableStatement: function() {
        var retval = new ES3Parser.variableStatement_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var VAR160 = null;
        var COMMA162 = null;
         var variableDeclaration161 = null;
         var variableDeclaration163 = null;
         var semic164 = null;

        var VAR160_tree=null;
        var COMMA162_tree=null;
        var stream_COMMA=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token COMMA");
        var stream_VAR=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token VAR");
        var stream_semic=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule semic");
        var stream_variableDeclaration=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule variableDeclaration");
        try {
            // ES3.g3:1570:2: ( VAR variableDeclaration ( COMMA variableDeclaration )* semic -> ^( VAR ( variableDeclaration )+ ) )
            // ES3.g3:1570:4: VAR variableDeclaration ( COMMA variableDeclaration )* semic
            VAR160=this.match(this.input,VAR,ES3Parser.FOLLOW_VAR_in_variableStatement4743);  
            stream_VAR.add(VAR160);

            this.pushFollow(ES3Parser.FOLLOW_variableDeclaration_in_variableStatement4745);
            variableDeclaration161=this.variableDeclaration();

            this.state._fsp--;

            stream_variableDeclaration.add(variableDeclaration161.getTree());
            // ES3.g3:1570:28: ( COMMA variableDeclaration )*
            loop46:
            do {
                var alt46=2;
                var LA46_0 = this.input.LA(1);

                if ( (LA46_0==COMMA) ) {
                    alt46=1;
                }


                switch (alt46) {
                case 1 :
                    // ES3.g3:1570:30: COMMA variableDeclaration
                    COMMA162=this.match(this.input,COMMA,ES3Parser.FOLLOW_COMMA_in_variableStatement4749);  
                    stream_COMMA.add(COMMA162);

                    this.pushFollow(ES3Parser.FOLLOW_variableDeclaration_in_variableStatement4751);
                    variableDeclaration163=this.variableDeclaration();

                    this.state._fsp--;

                    stream_variableDeclaration.add(variableDeclaration163.getTree());


                    break;

                default :
                    break loop46;
                }
            } while (true);

            this.pushFollow(ES3Parser.FOLLOW_semic_in_variableStatement4756);
            semic164=this.semic();

            this.state._fsp--;

            stream_semic.add(semic164.getTree());


            // AST REWRITE
            // elements: variableDeclaration, VAR
            // token labels: 
            // rule labels: retval
            // token list labels: 
            // rule list labels: 
            retval.tree = root_0;
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 1571:2: -> ^( VAR ( variableDeclaration )+ )
            {
                // ES3.g3:1571:5: ^( VAR ( variableDeclaration )+ )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(stream_VAR.nextNode(), root_1);

                if ( !(stream_variableDeclaration.hasNext()) ) {
                    throw new org.antlr.runtime.tree.RewriteEarlyExitException();
                }
                while ( stream_variableDeclaration.hasNext() ) {
                    this.adaptor.addChild(root_1, stream_variableDeclaration.nextTree());

                }
                stream_variableDeclaration.reset();

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;


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
    variableDeclaration_return: (function() {
        ES3Parser.variableDeclaration_return = function(){};
        org.antlr.lang.extend(ES3Parser.variableDeclaration_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1574:1: variableDeclaration : Identifier ( ASSIGN assignmentExpression )? ;
    // $ANTLR start "variableDeclaration"
    variableDeclaration: function() {
        var retval = new ES3Parser.variableDeclaration_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var Identifier165 = null;
        var ASSIGN166 = null;
         var assignmentExpression167 = null;

        var Identifier165_tree=null;
        var ASSIGN166_tree=null;

        try {
            // ES3.g3:1575:2: ( Identifier ( ASSIGN assignmentExpression )? )
            // ES3.g3:1575:4: Identifier ( ASSIGN assignmentExpression )?
            root_0 = this.adaptor.nil();

            Identifier165=this.match(this.input,Identifier,ES3Parser.FOLLOW_Identifier_in_variableDeclaration4779); 
            Identifier165_tree = this.adaptor.create(Identifier165);
            this.adaptor.addChild(root_0, Identifier165_tree);

            // ES3.g3:1575:15: ( ASSIGN assignmentExpression )?
            var alt47=2;
            var LA47_0 = this.input.LA(1);

            if ( (LA47_0==ASSIGN) ) {
                alt47=1;
            }
            switch (alt47) {
                case 1 :
                    // ES3.g3:1575:17: ASSIGN assignmentExpression
                    ASSIGN166=this.match(this.input,ASSIGN,ES3Parser.FOLLOW_ASSIGN_in_variableDeclaration4783); 
                    ASSIGN166_tree = this.adaptor.create(ASSIGN166);
                    root_0 = this.adaptor.becomeRoot(ASSIGN166_tree, root_0);

                    this.pushFollow(ES3Parser.FOLLOW_assignmentExpression_in_variableDeclaration4786);
                    assignmentExpression167=this.assignmentExpression();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, assignmentExpression167.getTree());


                    break;

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
    variableDeclarationNoIn_return: (function() {
        ES3Parser.variableDeclarationNoIn_return = function(){};
        org.antlr.lang.extend(ES3Parser.variableDeclarationNoIn_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1578:1: variableDeclarationNoIn : Identifier ( ASSIGN assignmentExpressionNoIn )? ;
    // $ANTLR start "variableDeclarationNoIn"
    variableDeclarationNoIn: function() {
        var retval = new ES3Parser.variableDeclarationNoIn_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var Identifier168 = null;
        var ASSIGN169 = null;
         var assignmentExpressionNoIn170 = null;

        var Identifier168_tree=null;
        var ASSIGN169_tree=null;

        try {
            // ES3.g3:1579:2: ( Identifier ( ASSIGN assignmentExpressionNoIn )? )
            // ES3.g3:1579:4: Identifier ( ASSIGN assignmentExpressionNoIn )?
            root_0 = this.adaptor.nil();

            Identifier168=this.match(this.input,Identifier,ES3Parser.FOLLOW_Identifier_in_variableDeclarationNoIn4801); 
            Identifier168_tree = this.adaptor.create(Identifier168);
            this.adaptor.addChild(root_0, Identifier168_tree);

            // ES3.g3:1579:15: ( ASSIGN assignmentExpressionNoIn )?
            var alt48=2;
            var LA48_0 = this.input.LA(1);

            if ( (LA48_0==ASSIGN) ) {
                alt48=1;
            }
            switch (alt48) {
                case 1 :
                    // ES3.g3:1579:17: ASSIGN assignmentExpressionNoIn
                    ASSIGN169=this.match(this.input,ASSIGN,ES3Parser.FOLLOW_ASSIGN_in_variableDeclarationNoIn4805); 
                    ASSIGN169_tree = this.adaptor.create(ASSIGN169);
                    root_0 = this.adaptor.becomeRoot(ASSIGN169_tree, root_0);

                    this.pushFollow(ES3Parser.FOLLOW_assignmentExpressionNoIn_in_variableDeclarationNoIn4808);
                    assignmentExpressionNoIn170=this.assignmentExpressionNoIn();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, assignmentExpressionNoIn170.getTree());


                    break;

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
    emptyStatement_return: (function() {
        ES3Parser.emptyStatement_return = function(){};
        org.antlr.lang.extend(ES3Parser.emptyStatement_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1586:1: emptyStatement : SEMIC ;
    // $ANTLR start "emptyStatement"
    emptyStatement: function() {
        var retval = new ES3Parser.emptyStatement_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var SEMIC171 = null;

        var SEMIC171_tree=null;

        try {
            // ES3.g3:1587:2: ( SEMIC )
            // ES3.g3:1587:4: SEMIC
            root_0 = this.adaptor.nil();

            SEMIC171=this.match(this.input,SEMIC,ES3Parser.FOLLOW_SEMIC_in_emptyStatement4827); 



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
    expressionStatement_return: (function() {
        ES3Parser.expressionStatement_return = function(){};
        org.antlr.lang.extend(ES3Parser.expressionStatement_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1600:1: expressionStatement : expression semic ;
    // $ANTLR start "expressionStatement"
    expressionStatement: function() {
        var retval = new ES3Parser.expressionStatement_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

         var expression172 = null;
         var semic173 = null;


        try {
            // ES3.g3:1601:2: ( expression semic )
            // ES3.g3:1601:4: expression semic
            root_0 = this.adaptor.nil();

            this.pushFollow(ES3Parser.FOLLOW_expression_in_expressionStatement4846);
            expression172=this.expression();

            this.state._fsp--;

            this.adaptor.addChild(root_0, expression172.getTree());
            this.pushFollow(ES3Parser.FOLLOW_semic_in_expressionStatement4848);
            semic173=this.semic();

            this.state._fsp--;




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
    ifStatement_return: (function() {
        ES3Parser.ifStatement_return = function(){};
        org.antlr.lang.extend(ES3Parser.ifStatement_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1608:1: ifStatement : IF LPAREN expression RPAREN statement ({...}? ELSE statement )? -> ^( IF expression ( statement )+ ) ;
    // $ANTLR start "ifStatement"
    ifStatement: function() {
        var retval = new ES3Parser.ifStatement_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var IF174 = null;
        var LPAREN175 = null;
        var RPAREN177 = null;
        var ELSE179 = null;
         var expression176 = null;
         var statement178 = null;
         var statement180 = null;

        var IF174_tree=null;
        var LPAREN175_tree=null;
        var RPAREN177_tree=null;
        var ELSE179_tree=null;
        var stream_LPAREN=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token LPAREN");
        var stream_ELSE=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token ELSE");
        var stream_RPAREN=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token RPAREN");
        var stream_IF=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token IF");
        var stream_expression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule expression");
        var stream_statement=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule statement");
        try {
            // ES3.g3:1610:2: ( IF LPAREN expression RPAREN statement ({...}? ELSE statement )? -> ^( IF expression ( statement )+ ) )
            // ES3.g3:1610:4: IF LPAREN expression RPAREN statement ({...}? ELSE statement )?
            IF174=this.match(this.input,IF,ES3Parser.FOLLOW_IF_in_ifStatement4866);  
            stream_IF.add(IF174);

            LPAREN175=this.match(this.input,LPAREN,ES3Parser.FOLLOW_LPAREN_in_ifStatement4868);  
            stream_LPAREN.add(LPAREN175);

            this.pushFollow(ES3Parser.FOLLOW_expression_in_ifStatement4870);
            expression176=this.expression();

            this.state._fsp--;

            stream_expression.add(expression176.getTree());
            RPAREN177=this.match(this.input,RPAREN,ES3Parser.FOLLOW_RPAREN_in_ifStatement4872);  
            stream_RPAREN.add(RPAREN177);

            this.pushFollow(ES3Parser.FOLLOW_statement_in_ifStatement4874);
            statement178=this.statement();

            this.state._fsp--;

            stream_statement.add(statement178.getTree());
            // ES3.g3:1610:42: ({...}? ELSE statement )?
            var alt49=2;
            var LA49_0 = this.input.LA(1);

            if ( (LA49_0==ELSE) ) {
                var LA49_1 = this.input.LA(2);

                if ( (( this.input.LA(1) == this.theParser.ELSE )) ) {
                    alt49=1;
                }
            }
            switch (alt49) {
                case 1 :
                    // ES3.g3:1610:44: {...}? ELSE statement
                    if ( !(( this.input.LA(1) == this.theParser.ELSE )) ) {
                        throw new org.antlr.runtime.FailedPredicateException(this.input, "ifStatement", " this.input.LA(1) == this.theParser.ELSE ");
                    }
                    ELSE179=this.match(this.input,ELSE,ES3Parser.FOLLOW_ELSE_in_ifStatement4880);  
                    stream_ELSE.add(ELSE179);

                    this.pushFollow(ES3Parser.FOLLOW_statement_in_ifStatement4882);
                    statement180=this.statement();

                    this.state._fsp--;

                    stream_statement.add(statement180.getTree());


                    break;

            }



            // AST REWRITE
            // elements: statement, expression, IF
            // token labels: 
            // rule labels: retval
            // token list labels: 
            // rule list labels: 
            retval.tree = root_0;
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 1611:2: -> ^( IF expression ( statement )+ )
            {
                // ES3.g3:1611:5: ^( IF expression ( statement )+ )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(stream_IF.nextNode(), root_1);

                this.adaptor.addChild(root_1, stream_expression.nextTree());
                if ( !(stream_statement.hasNext()) ) {
                    throw new org.antlr.runtime.tree.RewriteEarlyExitException();
                }
                while ( stream_statement.hasNext() ) {
                    this.adaptor.addChild(root_1, stream_statement.nextTree());

                }
                stream_statement.reset();

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;


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
    iterationStatement_return: (function() {
        ES3Parser.iterationStatement_return = function(){};
        org.antlr.lang.extend(ES3Parser.iterationStatement_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1618:1: iterationStatement : ( doStatement | whileStatement | forStatement );
    // $ANTLR start "iterationStatement"
    iterationStatement: function() {
        var retval = new ES3Parser.iterationStatement_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

         var doStatement181 = null;
         var whileStatement182 = null;
         var forStatement183 = null;


        try {
            // ES3.g3:1619:2: ( doStatement | whileStatement | forStatement )
            var alt50=3;
            switch ( this.input.LA(1) ) {
            case DO:
                alt50=1;
                break;
            case WHILE:
                alt50=2;
                break;
            case FOR:
                alt50=3;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 50, 0, this.input);

                throw nvae;
            }

            switch (alt50) {
                case 1 :
                    // ES3.g3:1619:4: doStatement
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_doStatement_in_iterationStatement4915);
                    doStatement181=this.doStatement();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, doStatement181.getTree());


                    break;
                case 2 :
                    // ES3.g3:1620:4: whileStatement
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_whileStatement_in_iterationStatement4920);
                    whileStatement182=this.whileStatement();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, whileStatement182.getTree());


                    break;
                case 3 :
                    // ES3.g3:1621:4: forStatement
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_forStatement_in_iterationStatement4925);
                    forStatement183=this.forStatement();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, forStatement183.getTree());


                    break;

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
    doStatement_return: (function() {
        ES3Parser.doStatement_return = function(){};
        org.antlr.lang.extend(ES3Parser.doStatement_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1624:1: doStatement : DO statement WHILE LPAREN expression RPAREN semic -> ^( DO statement expression ) ;
    // $ANTLR start "doStatement"
    doStatement: function() {
        var retval = new ES3Parser.doStatement_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var DO184 = null;
        var WHILE186 = null;
        var LPAREN187 = null;
        var RPAREN189 = null;
         var statement185 = null;
         var expression188 = null;
         var semic190 = null;

        var DO184_tree=null;
        var WHILE186_tree=null;
        var LPAREN187_tree=null;
        var RPAREN189_tree=null;
        var stream_LPAREN=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token LPAREN");
        var stream_WHILE=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token WHILE");
        var stream_DO=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token DO");
        var stream_RPAREN=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token RPAREN");
        var stream_semic=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule semic");
        var stream_expression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule expression");
        var stream_statement=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule statement");
        try {
            // ES3.g3:1625:2: ( DO statement WHILE LPAREN expression RPAREN semic -> ^( DO statement expression ) )
            // ES3.g3:1625:4: DO statement WHILE LPAREN expression RPAREN semic
            DO184=this.match(this.input,DO,ES3Parser.FOLLOW_DO_in_doStatement4937);  
            stream_DO.add(DO184);

            this.pushFollow(ES3Parser.FOLLOW_statement_in_doStatement4939);
            statement185=this.statement();

            this.state._fsp--;

            stream_statement.add(statement185.getTree());
            WHILE186=this.match(this.input,WHILE,ES3Parser.FOLLOW_WHILE_in_doStatement4941);  
            stream_WHILE.add(WHILE186);

            LPAREN187=this.match(this.input,LPAREN,ES3Parser.FOLLOW_LPAREN_in_doStatement4943);  
            stream_LPAREN.add(LPAREN187);

            this.pushFollow(ES3Parser.FOLLOW_expression_in_doStatement4945);
            expression188=this.expression();

            this.state._fsp--;

            stream_expression.add(expression188.getTree());
            RPAREN189=this.match(this.input,RPAREN,ES3Parser.FOLLOW_RPAREN_in_doStatement4947);  
            stream_RPAREN.add(RPAREN189);

            this.pushFollow(ES3Parser.FOLLOW_semic_in_doStatement4949);
            semic190=this.semic();

            this.state._fsp--;

            stream_semic.add(semic190.getTree());


            // AST REWRITE
            // elements: statement, expression, DO
            // token labels: 
            // rule labels: retval
            // token list labels: 
            // rule list labels: 
            retval.tree = root_0;
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 1626:2: -> ^( DO statement expression )
            {
                // ES3.g3:1626:5: ^( DO statement expression )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(stream_DO.nextNode(), root_1);

                this.adaptor.addChild(root_1, stream_statement.nextTree());
                this.adaptor.addChild(root_1, stream_expression.nextTree());

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;


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
    whileStatement_return: (function() {
        ES3Parser.whileStatement_return = function(){};
        org.antlr.lang.extend(ES3Parser.whileStatement_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1629:1: whileStatement : WHILE LPAREN expression RPAREN statement ;
    // $ANTLR start "whileStatement"
    whileStatement: function() {
        var retval = new ES3Parser.whileStatement_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var WHILE191 = null;
        var LPAREN192 = null;
        var RPAREN194 = null;
         var expression193 = null;
         var statement195 = null;

        var WHILE191_tree=null;
        var LPAREN192_tree=null;
        var RPAREN194_tree=null;

        try {
            // ES3.g3:1630:2: ( WHILE LPAREN expression RPAREN statement )
            // ES3.g3:1630:4: WHILE LPAREN expression RPAREN statement
            root_0 = this.adaptor.nil();

            WHILE191=this.match(this.input,WHILE,ES3Parser.FOLLOW_WHILE_in_whileStatement4974); 
            WHILE191_tree = this.adaptor.create(WHILE191);
            root_0 = this.adaptor.becomeRoot(WHILE191_tree, root_0);

            LPAREN192=this.match(this.input,LPAREN,ES3Parser.FOLLOW_LPAREN_in_whileStatement4977); 
            this.pushFollow(ES3Parser.FOLLOW_expression_in_whileStatement4980);
            expression193=this.expression();

            this.state._fsp--;

            this.adaptor.addChild(root_0, expression193.getTree());
            RPAREN194=this.match(this.input,RPAREN,ES3Parser.FOLLOW_RPAREN_in_whileStatement4982); 
            this.pushFollow(ES3Parser.FOLLOW_statement_in_whileStatement4985);
            statement195=this.statement();

            this.state._fsp--;

            this.adaptor.addChild(root_0, statement195.getTree());



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
    forStatement_return: (function() {
        ES3Parser.forStatement_return = function(){};
        org.antlr.lang.extend(ES3Parser.forStatement_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1674:1: forStatement : FOR LPAREN forControl RPAREN statement ;
    // $ANTLR start "forStatement"
    forStatement: function() {
        var retval = new ES3Parser.forStatement_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var FOR196 = null;
        var LPAREN197 = null;
        var RPAREN199 = null;
         var forControl198 = null;
         var statement200 = null;

        var FOR196_tree=null;
        var LPAREN197_tree=null;
        var RPAREN199_tree=null;

        try {
            // ES3.g3:1675:2: ( FOR LPAREN forControl RPAREN statement )
            // ES3.g3:1675:4: FOR LPAREN forControl RPAREN statement
            root_0 = this.adaptor.nil();

            FOR196=this.match(this.input,FOR,ES3Parser.FOLLOW_FOR_in_forStatement4998); 
            FOR196_tree = this.adaptor.create(FOR196);
            root_0 = this.adaptor.becomeRoot(FOR196_tree, root_0);

            LPAREN197=this.match(this.input,LPAREN,ES3Parser.FOLLOW_LPAREN_in_forStatement5001); 
            this.pushFollow(ES3Parser.FOLLOW_forControl_in_forStatement5004);
            forControl198=this.forControl();

            this.state._fsp--;

            this.adaptor.addChild(root_0, forControl198.getTree());
            RPAREN199=this.match(this.input,RPAREN,ES3Parser.FOLLOW_RPAREN_in_forStatement5006); 
            this.pushFollow(ES3Parser.FOLLOW_statement_in_forStatement5009);
            statement200=this.statement();

            this.state._fsp--;

            this.adaptor.addChild(root_0, statement200.getTree());



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
    forControl_return: (function() {
        ES3Parser.forControl_return = function(){};
        org.antlr.lang.extend(ES3Parser.forControl_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1678:1: forControl : ( forControlVar | forControlExpression | forControlSemic );
    // $ANTLR start "forControl"
    forControl: function() {
        var retval = new ES3Parser.forControl_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

         var forControlVar201 = null;
         var forControlExpression202 = null;
         var forControlSemic203 = null;


        try {
            // ES3.g3:1679:2: ( forControlVar | forControlExpression | forControlSemic )
            var alt51=3;
            switch ( this.input.LA(1) ) {
            case VAR:
                alt51=1;
                break;
            case NULL:
            case TRUE:
            case FALSE:
            case DELETE:
            case FUNCTION:
            case NEW:
            case THIS:
            case TYPEOF:
            case VOID:
            case LBRACE:
            case LBRACK:
            case ADD:
            case SUB:
            case INC:
            case DEC:
            case NOT:
            case INV:
            case Identifier:
            case StringLiteral:
            case IdentifierNameAmpersatStart:
            case LPAREN:
            case RegularExpressionLiteral:
            case DecimalLiteral:
            case OctalIntegerLiteral:
            case HexIntegerLiteral:
                alt51=2;
                break;
            case SEMIC:
                alt51=3;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 51, 0, this.input);

                throw nvae;
            }

            switch (alt51) {
                case 1 :
                    // ES3.g3:1679:4: forControlVar
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_forControlVar_in_forControl5021);
                    forControlVar201=this.forControlVar();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, forControlVar201.getTree());


                    break;
                case 2 :
                    // ES3.g3:1680:4: forControlExpression
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_forControlExpression_in_forControl5026);
                    forControlExpression202=this.forControlExpression();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, forControlExpression202.getTree());


                    break;
                case 3 :
                    // ES3.g3:1681:4: forControlSemic
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_forControlSemic_in_forControl5031);
                    forControlSemic203=this.forControlSemic();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, forControlSemic203.getTree());


                    break;

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
    forControlVar_return: (function() {
        ES3Parser.forControlVar_return = function(){};
        org.antlr.lang.extend(ES3Parser.forControlVar_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1684:1: forControlVar : VAR variableDeclarationNoIn ( ( IN expression -> ^( FORITER ^( VAR variableDeclarationNoIn ) ^( EXPR expression ) ) ) | ( ( COMMA variableDeclarationNoIn )* SEMIC (ex1= expression )? SEMIC (ex2= expression )? -> ^( FORSTEP ^( VAR ( variableDeclarationNoIn )+ ) ^( EXPR ( $ex1)? ) ^( EXPR ( $ex2)? ) ) ) ) ;
    // $ANTLR start "forControlVar"
    forControlVar: function() {
        var retval = new ES3Parser.forControlVar_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var VAR204 = null;
        var IN206 = null;
        var COMMA208 = null;
        var SEMIC210 = null;
        var SEMIC211 = null;
         var ex1 = null;
         var ex2 = null;
         var variableDeclarationNoIn205 = null;
         var expression207 = null;
         var variableDeclarationNoIn209 = null;

        var VAR204_tree=null;
        var IN206_tree=null;
        var COMMA208_tree=null;
        var SEMIC210_tree=null;
        var SEMIC211_tree=null;
        var stream_COMMA=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token COMMA");
        var stream_IN=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token IN");
        var stream_VAR=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token VAR");
        var stream_SEMIC=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token SEMIC");
        var stream_expression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule expression");
        var stream_variableDeclarationNoIn=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule variableDeclarationNoIn");
        try {
            // ES3.g3:1685:2: ( VAR variableDeclarationNoIn ( ( IN expression -> ^( FORITER ^( VAR variableDeclarationNoIn ) ^( EXPR expression ) ) ) | ( ( COMMA variableDeclarationNoIn )* SEMIC (ex1= expression )? SEMIC (ex2= expression )? -> ^( FORSTEP ^( VAR ( variableDeclarationNoIn )+ ) ^( EXPR ( $ex1)? ) ^( EXPR ( $ex2)? ) ) ) ) )
            // ES3.g3:1685:4: VAR variableDeclarationNoIn ( ( IN expression -> ^( FORITER ^( VAR variableDeclarationNoIn ) ^( EXPR expression ) ) ) | ( ( COMMA variableDeclarationNoIn )* SEMIC (ex1= expression )? SEMIC (ex2= expression )? -> ^( FORSTEP ^( VAR ( variableDeclarationNoIn )+ ) ^( EXPR ( $ex1)? ) ^( EXPR ( $ex2)? ) ) ) )
            VAR204=this.match(this.input,VAR,ES3Parser.FOLLOW_VAR_in_forControlVar5042);  
            stream_VAR.add(VAR204);

            this.pushFollow(ES3Parser.FOLLOW_variableDeclarationNoIn_in_forControlVar5044);
            variableDeclarationNoIn205=this.variableDeclarationNoIn();

            this.state._fsp--;

            stream_variableDeclarationNoIn.add(variableDeclarationNoIn205.getTree());
            // ES3.g3:1686:2: ( ( IN expression -> ^( FORITER ^( VAR variableDeclarationNoIn ) ^( EXPR expression ) ) ) | ( ( COMMA variableDeclarationNoIn )* SEMIC (ex1= expression )? SEMIC (ex2= expression )? -> ^( FORSTEP ^( VAR ( variableDeclarationNoIn )+ ) ^( EXPR ( $ex1)? ) ^( EXPR ( $ex2)? ) ) ) )
            var alt55=2;
            var LA55_0 = this.input.LA(1);

            if ( (LA55_0==IN) ) {
                alt55=1;
            }
            else if ( ((LA55_0>=SEMIC && LA55_0<=COMMA)) ) {
                alt55=2;
            }
            else {
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 55, 0, this.input);

                throw nvae;
            }
            switch (alt55) {
                case 1 :
                    // ES3.g3:1687:3: ( IN expression -> ^( FORITER ^( VAR variableDeclarationNoIn ) ^( EXPR expression ) ) )
                    // ES3.g3:1687:3: ( IN expression -> ^( FORITER ^( VAR variableDeclarationNoIn ) ^( EXPR expression ) ) )
                    // ES3.g3:1688:4: IN expression
                    IN206=this.match(this.input,IN,ES3Parser.FOLLOW_IN_in_forControlVar5056);  
                    stream_IN.add(IN206);

                    this.pushFollow(ES3Parser.FOLLOW_expression_in_forControlVar5058);
                    expression207=this.expression();

                    this.state._fsp--;

                    stream_expression.add(expression207.getTree());


                    // AST REWRITE
                    // elements: variableDeclarationNoIn, VAR, expression
                    // token labels: 
                    // rule labels: retval
                    // token list labels: 
                    // rule list labels: 
                    retval.tree = root_0;
                    var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

                    root_0 = this.adaptor.nil();
                    // 1689:4: -> ^( FORITER ^( VAR variableDeclarationNoIn ) ^( EXPR expression ) )
                    {
                        // ES3.g3:1689:7: ^( FORITER ^( VAR variableDeclarationNoIn ) ^( EXPR expression ) )
                        {
                        var root_1 = this.adaptor.nil();
                        root_1 = this.adaptor.becomeRoot(this.adaptor.create(FORITER, "FORITER"), root_1);

                        // ES3.g3:1689:18: ^( VAR variableDeclarationNoIn )
                        {
                        var root_2 = this.adaptor.nil();
                        root_2 = this.adaptor.becomeRoot(stream_VAR.nextNode(), root_2);

                        this.adaptor.addChild(root_2, stream_variableDeclarationNoIn.nextTree());

                        this.adaptor.addChild(root_1, root_2);
                        }
                        // ES3.g3:1689:51: ^( EXPR expression )
                        {
                        var root_2 = this.adaptor.nil();
                        root_2 = this.adaptor.becomeRoot(this.adaptor.create(EXPR, "EXPR"), root_2);

                        this.adaptor.addChild(root_2, stream_expression.nextTree());

                        this.adaptor.addChild(root_1, root_2);
                        }

                        this.adaptor.addChild(root_0, root_1);
                        }

                    }

                    retval.tree = root_0;




                    break;
                case 2 :
                    // ES3.g3:1692:3: ( ( COMMA variableDeclarationNoIn )* SEMIC (ex1= expression )? SEMIC (ex2= expression )? -> ^( FORSTEP ^( VAR ( variableDeclarationNoIn )+ ) ^( EXPR ( $ex1)? ) ^( EXPR ( $ex2)? ) ) )
                    // ES3.g3:1692:3: ( ( COMMA variableDeclarationNoIn )* SEMIC (ex1= expression )? SEMIC (ex2= expression )? -> ^( FORSTEP ^( VAR ( variableDeclarationNoIn )+ ) ^( EXPR ( $ex1)? ) ^( EXPR ( $ex2)? ) ) )
                    // ES3.g3:1693:4: ( COMMA variableDeclarationNoIn )* SEMIC (ex1= expression )? SEMIC (ex2= expression )?
                    // ES3.g3:1693:4: ( COMMA variableDeclarationNoIn )*
                    loop52:
                    do {
                        var alt52=2;
                        var LA52_0 = this.input.LA(1);

                        if ( (LA52_0==COMMA) ) {
                            alt52=1;
                        }


                        switch (alt52) {
                        case 1 :
                            // ES3.g3:1693:6: COMMA variableDeclarationNoIn
                            COMMA208=this.match(this.input,COMMA,ES3Parser.FOLLOW_COMMA_in_forControlVar5104);  
                            stream_COMMA.add(COMMA208);

                            this.pushFollow(ES3Parser.FOLLOW_variableDeclarationNoIn_in_forControlVar5106);
                            variableDeclarationNoIn209=this.variableDeclarationNoIn();

                            this.state._fsp--;

                            stream_variableDeclarationNoIn.add(variableDeclarationNoIn209.getTree());


                            break;

                        default :
                            break loop52;
                        }
                    } while (true);

                    SEMIC210=this.match(this.input,SEMIC,ES3Parser.FOLLOW_SEMIC_in_forControlVar5111);  
                    stream_SEMIC.add(SEMIC210);

                    // ES3.g3:1693:48: (ex1= expression )?
                    var alt53=2;
                    var LA53_0 = this.input.LA(1);

                    if ( ((LA53_0>=NULL && LA53_0<=FALSE)||LA53_0==DELETE||LA53_0==FUNCTION||LA53_0==NEW||LA53_0==THIS||LA53_0==TYPEOF||LA53_0==VOID||LA53_0==LBRACE||LA53_0==LBRACK||(LA53_0>=ADD && LA53_0<=SUB)||(LA53_0>=INC && LA53_0<=DEC)||(LA53_0>=NOT && LA53_0<=INV)||(LA53_0>=Identifier && LA53_0<=StringLiteral)||(LA53_0>=IdentifierNameAmpersatStart && LA53_0<=LPAREN)||LA53_0==RegularExpressionLiteral||(LA53_0>=DecimalLiteral && LA53_0<=HexIntegerLiteral)) ) {
                        alt53=1;
                    }
                    switch (alt53) {
                        case 1 :
                            // ES3.g3:1693:48: ex1= expression
                            this.pushFollow(ES3Parser.FOLLOW_expression_in_forControlVar5115);
                            ex1=this.expression();

                            this.state._fsp--;

                            stream_expression.add(ex1.getTree());


                            break;

                    }

                    SEMIC211=this.match(this.input,SEMIC,ES3Parser.FOLLOW_SEMIC_in_forControlVar5118);  
                    stream_SEMIC.add(SEMIC211);

                    // ES3.g3:1693:70: (ex2= expression )?
                    var alt54=2;
                    var LA54_0 = this.input.LA(1);

                    if ( ((LA54_0>=NULL && LA54_0<=FALSE)||LA54_0==DELETE||LA54_0==FUNCTION||LA54_0==NEW||LA54_0==THIS||LA54_0==TYPEOF||LA54_0==VOID||LA54_0==LBRACE||LA54_0==LBRACK||(LA54_0>=ADD && LA54_0<=SUB)||(LA54_0>=INC && LA54_0<=DEC)||(LA54_0>=NOT && LA54_0<=INV)||(LA54_0>=Identifier && LA54_0<=StringLiteral)||(LA54_0>=IdentifierNameAmpersatStart && LA54_0<=LPAREN)||LA54_0==RegularExpressionLiteral||(LA54_0>=DecimalLiteral && LA54_0<=HexIntegerLiteral)) ) {
                        alt54=1;
                    }
                    switch (alt54) {
                        case 1 :
                            // ES3.g3:1693:70: ex2= expression
                            this.pushFollow(ES3Parser.FOLLOW_expression_in_forControlVar5122);
                            ex2=this.expression();

                            this.state._fsp--;

                            stream_expression.add(ex2.getTree());


                            break;

                    }



                    // AST REWRITE
                    // elements: ex2, VAR, variableDeclarationNoIn, ex1
                    // token labels: 
                    // rule labels: ex2, retval, ex1
                    // token list labels: 
                    // rule list labels: 
                    retval.tree = root_0;
                    var stream_ex2=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token ex2",ex2!=null?ex2.tree:null);
                    var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);
                    var stream_ex1=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token ex1",ex1!=null?ex1.tree:null);

                    root_0 = this.adaptor.nil();
                    // 1694:4: -> ^( FORSTEP ^( VAR ( variableDeclarationNoIn )+ ) ^( EXPR ( $ex1)? ) ^( EXPR ( $ex2)? ) )
                    {
                        // ES3.g3:1694:7: ^( FORSTEP ^( VAR ( variableDeclarationNoIn )+ ) ^( EXPR ( $ex1)? ) ^( EXPR ( $ex2)? ) )
                        {
                        var root_1 = this.adaptor.nil();
                        root_1 = this.adaptor.becomeRoot(this.adaptor.create(FORSTEP, "FORSTEP"), root_1);

                        // ES3.g3:1694:18: ^( VAR ( variableDeclarationNoIn )+ )
                        {
                        var root_2 = this.adaptor.nil();
                        root_2 = this.adaptor.becomeRoot(stream_VAR.nextNode(), root_2);

                        if ( !(stream_variableDeclarationNoIn.hasNext()) ) {
                            throw new org.antlr.runtime.tree.RewriteEarlyExitException();
                        }
                        while ( stream_variableDeclarationNoIn.hasNext() ) {
                            this.adaptor.addChild(root_2, stream_variableDeclarationNoIn.nextTree());

                        }
                        stream_variableDeclarationNoIn.reset();

                        this.adaptor.addChild(root_1, root_2);
                        }
                        // ES3.g3:1694:52: ^( EXPR ( $ex1)? )
                        {
                        var root_2 = this.adaptor.nil();
                        root_2 = this.adaptor.becomeRoot(this.adaptor.create(EXPR, "EXPR"), root_2);

                        // ES3.g3:1694:60: ( $ex1)?
                        if ( stream_ex1.hasNext() ) {
                            this.adaptor.addChild(root_2, stream_ex1.nextTree());

                        }
                        stream_ex1.reset();

                        this.adaptor.addChild(root_1, root_2);
                        }
                        // ES3.g3:1694:68: ^( EXPR ( $ex2)? )
                        {
                        var root_2 = this.adaptor.nil();
                        root_2 = this.adaptor.becomeRoot(this.adaptor.create(EXPR, "EXPR"), root_2);

                        // ES3.g3:1694:76: ( $ex2)?
                        if ( stream_ex2.hasNext() ) {
                            this.adaptor.addChild(root_2, stream_ex2.nextTree());

                        }
                        stream_ex2.reset();

                        this.adaptor.addChild(root_1, root_2);
                        }

                        this.adaptor.addChild(root_0, root_1);
                        }

                    }

                    retval.tree = root_0;




                    break;

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
    forControlExpression_return: (function() {
        ES3Parser.forControlExpression_return = function(){};
        org.antlr.lang.extend(ES3Parser.forControlExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1699:1: forControlExpression : ex1= expressionNoIn ({...}? ( IN ex2= expression -> ^( FORITER ^( EXPR $ex1) ^( EXPR $ex2) ) ) | ( SEMIC (ex2= expression )? SEMIC (ex3= expression )? -> ^( FORSTEP ^( EXPR $ex1) ^( EXPR ( $ex2)? ) ^( EXPR ( $ex3)? ) ) ) ) ;
    // $ANTLR start "forControlExpression"
    forControlExpression: function() {
        var retval = new ES3Parser.forControlExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var IN212 = null;
        var SEMIC213 = null;
        var SEMIC214 = null;
         var ex1 = null;
         var ex2 = null;
         var ex3 = null;

        var IN212_tree=null;
        var SEMIC213_tree=null;
        var SEMIC214_tree=null;
        var stream_IN=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token IN");
        var stream_SEMIC=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token SEMIC");
        var stream_expression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule expression");
        var stream_expressionNoIn=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule expressionNoIn");

        //	Object[] 
        	  var isLhs = new Array();//Object[1];

        try {
            // ES3.g3:1705:2: (ex1= expressionNoIn ({...}? ( IN ex2= expression -> ^( FORITER ^( EXPR $ex1) ^( EXPR $ex2) ) ) | ( SEMIC (ex2= expression )? SEMIC (ex3= expression )? -> ^( FORSTEP ^( EXPR $ex1) ^( EXPR ( $ex2)? ) ^( EXPR ( $ex3)? ) ) ) ) )
            // ES3.g3:1705:4: ex1= expressionNoIn ({...}? ( IN ex2= expression -> ^( FORITER ^( EXPR $ex1) ^( EXPR $ex2) ) ) | ( SEMIC (ex2= expression )? SEMIC (ex3= expression )? -> ^( FORSTEP ^( EXPR $ex1) ^( EXPR ( $ex2)? ) ^( EXPR ( $ex3)? ) ) ) )
            this.pushFollow(ES3Parser.FOLLOW_expressionNoIn_in_forControlExpression5188);
            ex1=this.expressionNoIn();

            this.state._fsp--;

            stream_expressionNoIn.add(ex1.getTree());
            // ES3.g3:1706:2: ({...}? ( IN ex2= expression -> ^( FORITER ^( EXPR $ex1) ^( EXPR $ex2) ) ) | ( SEMIC (ex2= expression )? SEMIC (ex3= expression )? -> ^( FORSTEP ^( EXPR $ex1) ^( EXPR ( $ex2)? ) ^( EXPR ( $ex3)? ) ) ) )
            var alt58=2;
            var LA58_0 = this.input.LA(1);

            if ( (LA58_0==IN) ) {
                alt58=1;
            }
            else if ( (LA58_0==SEMIC) ) {
                alt58=2;
            }
            else {
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 58, 0, this.input);

                throw nvae;
            }
            switch (alt58) {
                case 1 :
                    // ES3.g3:1707:3: {...}? ( IN ex2= expression -> ^( FORITER ^( EXPR $ex1) ^( EXPR $ex2) ) )
                    if ( !(( this.isLeftHandSideIn(ex1, isLhs) )) ) {
                        throw new org.antlr.runtime.FailedPredicateException(this.input, "forControlExpression", " this.isLeftHandSideIn(ex1, isLhs) ");
                    }
                    // ES3.g3:1707:42: ( IN ex2= expression -> ^( FORITER ^( EXPR $ex1) ^( EXPR $ex2) ) )
                    // ES3.g3:1708:4: IN ex2= expression
                    IN212=this.match(this.input,IN,ES3Parser.FOLLOW_IN_in_forControlExpression5203);  
                    stream_IN.add(IN212);

                    this.pushFollow(ES3Parser.FOLLOW_expression_in_forControlExpression5207);
                    ex2=this.expression();

                    this.state._fsp--;

                    stream_expression.add(ex2.getTree());


                    // AST REWRITE
                    // elements: ex1, ex2
                    // token labels: 
                    // rule labels: ex2, retval, ex1
                    // token list labels: 
                    // rule list labels: 
                    retval.tree = root_0;
                    var stream_ex2=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token ex2",ex2!=null?ex2.tree:null);
                    var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);
                    var stream_ex1=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token ex1",ex1!=null?ex1.tree:null);

                    root_0 = this.adaptor.nil();
                    // 1709:4: -> ^( FORITER ^( EXPR $ex1) ^( EXPR $ex2) )
                    {
                        // ES3.g3:1709:7: ^( FORITER ^( EXPR $ex1) ^( EXPR $ex2) )
                        {
                        var root_1 = this.adaptor.nil();
                        root_1 = this.adaptor.becomeRoot(this.adaptor.create(FORITER, "FORITER"), root_1);

                        // ES3.g3:1709:18: ^( EXPR $ex1)
                        {
                        var root_2 = this.adaptor.nil();
                        root_2 = this.adaptor.becomeRoot(this.adaptor.create(EXPR, "EXPR"), root_2);

                        this.adaptor.addChild(root_2, stream_ex1.nextTree());

                        this.adaptor.addChild(root_1, root_2);
                        }
                        // ES3.g3:1709:33: ^( EXPR $ex2)
                        {
                        var root_2 = this.adaptor.nil();
                        root_2 = this.adaptor.becomeRoot(this.adaptor.create(EXPR, "EXPR"), root_2);

                        this.adaptor.addChild(root_2, stream_ex2.nextTree());

                        this.adaptor.addChild(root_1, root_2);
                        }

                        this.adaptor.addChild(root_0, root_1);
                        }

                    }

                    retval.tree = root_0;




                    break;
                case 2 :
                    // ES3.g3:1712:3: ( SEMIC (ex2= expression )? SEMIC (ex3= expression )? -> ^( FORSTEP ^( EXPR $ex1) ^( EXPR ( $ex2)? ) ^( EXPR ( $ex3)? ) ) )
                    // ES3.g3:1712:3: ( SEMIC (ex2= expression )? SEMIC (ex3= expression )? -> ^( FORSTEP ^( EXPR $ex1) ^( EXPR ( $ex2)? ) ^( EXPR ( $ex3)? ) ) )
                    // ES3.g3:1713:4: SEMIC (ex2= expression )? SEMIC (ex3= expression )?
                    SEMIC213=this.match(this.input,SEMIC,ES3Parser.FOLLOW_SEMIC_in_forControlExpression5253);  
                    stream_SEMIC.add(SEMIC213);

                    // ES3.g3:1713:13: (ex2= expression )?
                    var alt56=2;
                    var LA56_0 = this.input.LA(1);

                    if ( ((LA56_0>=NULL && LA56_0<=FALSE)||LA56_0==DELETE||LA56_0==FUNCTION||LA56_0==NEW||LA56_0==THIS||LA56_0==TYPEOF||LA56_0==VOID||LA56_0==LBRACE||LA56_0==LBRACK||(LA56_0>=ADD && LA56_0<=SUB)||(LA56_0>=INC && LA56_0<=DEC)||(LA56_0>=NOT && LA56_0<=INV)||(LA56_0>=Identifier && LA56_0<=StringLiteral)||(LA56_0>=IdentifierNameAmpersatStart && LA56_0<=LPAREN)||LA56_0==RegularExpressionLiteral||(LA56_0>=DecimalLiteral && LA56_0<=HexIntegerLiteral)) ) {
                        alt56=1;
                    }
                    switch (alt56) {
                        case 1 :
                            // ES3.g3:1713:13: ex2= expression
                            this.pushFollow(ES3Parser.FOLLOW_expression_in_forControlExpression5257);
                            ex2=this.expression();

                            this.state._fsp--;

                            stream_expression.add(ex2.getTree());


                            break;

                    }

                    SEMIC214=this.match(this.input,SEMIC,ES3Parser.FOLLOW_SEMIC_in_forControlExpression5260);  
                    stream_SEMIC.add(SEMIC214);

                    // ES3.g3:1713:35: (ex3= expression )?
                    var alt57=2;
                    var LA57_0 = this.input.LA(1);

                    if ( ((LA57_0>=NULL && LA57_0<=FALSE)||LA57_0==DELETE||LA57_0==FUNCTION||LA57_0==NEW||LA57_0==THIS||LA57_0==TYPEOF||LA57_0==VOID||LA57_0==LBRACE||LA57_0==LBRACK||(LA57_0>=ADD && LA57_0<=SUB)||(LA57_0>=INC && LA57_0<=DEC)||(LA57_0>=NOT && LA57_0<=INV)||(LA57_0>=Identifier && LA57_0<=StringLiteral)||(LA57_0>=IdentifierNameAmpersatStart && LA57_0<=LPAREN)||LA57_0==RegularExpressionLiteral||(LA57_0>=DecimalLiteral && LA57_0<=HexIntegerLiteral)) ) {
                        alt57=1;
                    }
                    switch (alt57) {
                        case 1 :
                            // ES3.g3:1713:35: ex3= expression
                            this.pushFollow(ES3Parser.FOLLOW_expression_in_forControlExpression5264);
                            ex3=this.expression();

                            this.state._fsp--;

                            stream_expression.add(ex3.getTree());


                            break;

                    }



                    // AST REWRITE
                    // elements: ex1, ex3, ex2
                    // token labels: 
                    // rule labels: ex3, ex2, retval, ex1
                    // token list labels: 
                    // rule list labels: 
                    retval.tree = root_0;
                    var stream_ex3=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token ex3",ex3!=null?ex3.tree:null);
                    var stream_ex2=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token ex2",ex2!=null?ex2.tree:null);
                    var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);
                    var stream_ex1=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token ex1",ex1!=null?ex1.tree:null);

                    root_0 = this.adaptor.nil();
                    // 1714:4: -> ^( FORSTEP ^( EXPR $ex1) ^( EXPR ( $ex2)? ) ^( EXPR ( $ex3)? ) )
                    {
                        // ES3.g3:1714:7: ^( FORSTEP ^( EXPR $ex1) ^( EXPR ( $ex2)? ) ^( EXPR ( $ex3)? ) )
                        {
                        var root_1 = this.adaptor.nil();
                        root_1 = this.adaptor.becomeRoot(this.adaptor.create(FORSTEP, "FORSTEP"), root_1);

                        // ES3.g3:1714:18: ^( EXPR $ex1)
                        {
                        var root_2 = this.adaptor.nil();
                        root_2 = this.adaptor.becomeRoot(this.adaptor.create(EXPR, "EXPR"), root_2);

                        this.adaptor.addChild(root_2, stream_ex1.nextTree());

                        this.adaptor.addChild(root_1, root_2);
                        }
                        // ES3.g3:1714:33: ^( EXPR ( $ex2)? )
                        {
                        var root_2 = this.adaptor.nil();
                        root_2 = this.adaptor.becomeRoot(this.adaptor.create(EXPR, "EXPR"), root_2);

                        // ES3.g3:1714:41: ( $ex2)?
                        if ( stream_ex2.hasNext() ) {
                            this.adaptor.addChild(root_2, stream_ex2.nextTree());

                        }
                        stream_ex2.reset();

                        this.adaptor.addChild(root_1, root_2);
                        }
                        // ES3.g3:1714:49: ^( EXPR ( $ex3)? )
                        {
                        var root_2 = this.adaptor.nil();
                        root_2 = this.adaptor.becomeRoot(this.adaptor.create(EXPR, "EXPR"), root_2);

                        // ES3.g3:1714:57: ( $ex3)?
                        if ( stream_ex3.hasNext() ) {
                            this.adaptor.addChild(root_2, stream_ex3.nextTree());

                        }
                        stream_ex3.reset();

                        this.adaptor.addChild(root_1, root_2);
                        }

                        this.adaptor.addChild(root_0, root_1);
                        }

                    }

                    retval.tree = root_0;




                    break;

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
    forControlSemic_return: (function() {
        ES3Parser.forControlSemic_return = function(){};
        org.antlr.lang.extend(ES3Parser.forControlSemic_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1719:1: forControlSemic : SEMIC (ex1= expression )? SEMIC (ex2= expression )? -> ^( FORSTEP ^( EXPR ) ^( EXPR ( $ex1)? ) ^( EXPR ( $ex2)? ) ) ;
    // $ANTLR start "forControlSemic"
    forControlSemic: function() {
        var retval = new ES3Parser.forControlSemic_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var SEMIC215 = null;
        var SEMIC216 = null;
         var ex1 = null;
         var ex2 = null;

        var SEMIC215_tree=null;
        var SEMIC216_tree=null;
        var stream_SEMIC=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token SEMIC");
        var stream_expression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule expression");
        try {
            // ES3.g3:1720:2: ( SEMIC (ex1= expression )? SEMIC (ex2= expression )? -> ^( FORSTEP ^( EXPR ) ^( EXPR ( $ex1)? ) ^( EXPR ( $ex2)? ) ) )
            // ES3.g3:1720:4: SEMIC (ex1= expression )? SEMIC (ex2= expression )?
            SEMIC215=this.match(this.input,SEMIC,ES3Parser.FOLLOW_SEMIC_in_forControlSemic5323);  
            stream_SEMIC.add(SEMIC215);

            // ES3.g3:1720:13: (ex1= expression )?
            var alt59=2;
            var LA59_0 = this.input.LA(1);

            if ( ((LA59_0>=NULL && LA59_0<=FALSE)||LA59_0==DELETE||LA59_0==FUNCTION||LA59_0==NEW||LA59_0==THIS||LA59_0==TYPEOF||LA59_0==VOID||LA59_0==LBRACE||LA59_0==LBRACK||(LA59_0>=ADD && LA59_0<=SUB)||(LA59_0>=INC && LA59_0<=DEC)||(LA59_0>=NOT && LA59_0<=INV)||(LA59_0>=Identifier && LA59_0<=StringLiteral)||(LA59_0>=IdentifierNameAmpersatStart && LA59_0<=LPAREN)||LA59_0==RegularExpressionLiteral||(LA59_0>=DecimalLiteral && LA59_0<=HexIntegerLiteral)) ) {
                alt59=1;
            }
            switch (alt59) {
                case 1 :
                    // ES3.g3:1720:13: ex1= expression
                    this.pushFollow(ES3Parser.FOLLOW_expression_in_forControlSemic5327);
                    ex1=this.expression();

                    this.state._fsp--;

                    stream_expression.add(ex1.getTree());


                    break;

            }

            SEMIC216=this.match(this.input,SEMIC,ES3Parser.FOLLOW_SEMIC_in_forControlSemic5330);  
            stream_SEMIC.add(SEMIC216);

            // ES3.g3:1720:35: (ex2= expression )?
            var alt60=2;
            var LA60_0 = this.input.LA(1);

            if ( ((LA60_0>=NULL && LA60_0<=FALSE)||LA60_0==DELETE||LA60_0==FUNCTION||LA60_0==NEW||LA60_0==THIS||LA60_0==TYPEOF||LA60_0==VOID||LA60_0==LBRACE||LA60_0==LBRACK||(LA60_0>=ADD && LA60_0<=SUB)||(LA60_0>=INC && LA60_0<=DEC)||(LA60_0>=NOT && LA60_0<=INV)||(LA60_0>=Identifier && LA60_0<=StringLiteral)||(LA60_0>=IdentifierNameAmpersatStart && LA60_0<=LPAREN)||LA60_0==RegularExpressionLiteral||(LA60_0>=DecimalLiteral && LA60_0<=HexIntegerLiteral)) ) {
                alt60=1;
            }
            switch (alt60) {
                case 1 :
                    // ES3.g3:1720:35: ex2= expression
                    this.pushFollow(ES3Parser.FOLLOW_expression_in_forControlSemic5334);
                    ex2=this.expression();

                    this.state._fsp--;

                    stream_expression.add(ex2.getTree());


                    break;

            }



            // AST REWRITE
            // elements: ex1, ex2
            // token labels: 
            // rule labels: ex2, retval, ex1
            // token list labels: 
            // rule list labels: 
            retval.tree = root_0;
            var stream_ex2=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token ex2",ex2!=null?ex2.tree:null);
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);
            var stream_ex1=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token ex1",ex1!=null?ex1.tree:null);

            root_0 = this.adaptor.nil();
            // 1721:2: -> ^( FORSTEP ^( EXPR ) ^( EXPR ( $ex1)? ) ^( EXPR ( $ex2)? ) )
            {
                // ES3.g3:1721:5: ^( FORSTEP ^( EXPR ) ^( EXPR ( $ex1)? ) ^( EXPR ( $ex2)? ) )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(FORSTEP, "FORSTEP"), root_1);

                // ES3.g3:1721:16: ^( EXPR )
                {
                var root_2 = this.adaptor.nil();
                root_2 = this.adaptor.becomeRoot(this.adaptor.create(EXPR, "EXPR"), root_2);

                this.adaptor.addChild(root_1, root_2);
                }
                // ES3.g3:1721:26: ^( EXPR ( $ex1)? )
                {
                var root_2 = this.adaptor.nil();
                root_2 = this.adaptor.becomeRoot(this.adaptor.create(EXPR, "EXPR"), root_2);

                // ES3.g3:1721:34: ( $ex1)?
                if ( stream_ex1.hasNext() ) {
                    this.adaptor.addChild(root_2, stream_ex1.nextTree());

                }
                stream_ex1.reset();

                this.adaptor.addChild(root_1, root_2);
                }
                // ES3.g3:1721:42: ^( EXPR ( $ex2)? )
                {
                var root_2 = this.adaptor.nil();
                root_2 = this.adaptor.becomeRoot(this.adaptor.create(EXPR, "EXPR"), root_2);

                // ES3.g3:1721:50: ( $ex2)?
                if ( stream_ex2.hasNext() ) {
                    this.adaptor.addChild(root_2, stream_ex2.nextTree());

                }
                stream_ex2.reset();

                this.adaptor.addChild(root_1, root_2);
                }

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;


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
    continueStatement_return: (function() {
        ES3Parser.continueStatement_return = function(){};
        org.antlr.lang.extend(ES3Parser.continueStatement_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1733:1: continueStatement : CONTINUE ( Identifier )? semic ;
    // $ANTLR start "continueStatement"
    continueStatement: function() {
        var retval = new ES3Parser.continueStatement_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var CONTINUE217 = null;
        var Identifier218 = null;
         var semic219 = null;

        var CONTINUE217_tree=null;
        var Identifier218_tree=null;

        try {
            // ES3.g3:1734:2: ( CONTINUE ( Identifier )? semic )
            // ES3.g3:1734:4: CONTINUE ( Identifier )? semic
            root_0 = this.adaptor.nil();

            CONTINUE217=this.match(this.input,CONTINUE,ES3Parser.FOLLOW_CONTINUE_in_continueStatement5388); 
            CONTINUE217_tree = this.adaptor.create(CONTINUE217);
            root_0 = this.adaptor.becomeRoot(CONTINUE217_tree, root_0);

             if (this.input.LA(1) == this.theParser.Identifier) this.promoteEOL(null); 
            // ES3.g3:1734:92: ( Identifier )?
            var alt61=2;
            var LA61_0 = this.input.LA(1);

            if ( (LA61_0==Identifier) ) {
                alt61=1;
            }
            switch (alt61) {
                case 1 :
                    // ES3.g3:1734:92: Identifier
                    Identifier218=this.match(this.input,Identifier,ES3Parser.FOLLOW_Identifier_in_continueStatement5393); 
                    Identifier218_tree = this.adaptor.create(Identifier218);
                    this.adaptor.addChild(root_0, Identifier218_tree);



                    break;

            }

            this.pushFollow(ES3Parser.FOLLOW_semic_in_continueStatement5396);
            semic219=this.semic();

            this.state._fsp--;




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
    breakStatement_return: (function() {
        ES3Parser.breakStatement_return = function(){};
        org.antlr.lang.extend(ES3Parser.breakStatement_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1746:1: breakStatement : BREAK ( Identifier )? semic ;
    // $ANTLR start "breakStatement"
    breakStatement: function() {
        var retval = new ES3Parser.breakStatement_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var BREAK220 = null;
        var Identifier221 = null;
         var semic222 = null;

        var BREAK220_tree=null;
        var Identifier221_tree=null;

        try {
            // ES3.g3:1747:2: ( BREAK ( Identifier )? semic )
            // ES3.g3:1747:4: BREAK ( Identifier )? semic
            root_0 = this.adaptor.nil();

            BREAK220=this.match(this.input,BREAK,ES3Parser.FOLLOW_BREAK_in_breakStatement5415); 
            BREAK220_tree = this.adaptor.create(BREAK220);
            root_0 = this.adaptor.becomeRoot(BREAK220_tree, root_0);

             if (this.input.LA(1) == this.theParser.Identifier) this.promoteEOL(null); 
            // ES3.g3:1747:89: ( Identifier )?
            var alt62=2;
            var LA62_0 = this.input.LA(1);

            if ( (LA62_0==Identifier) ) {
                alt62=1;
            }
            switch (alt62) {
                case 1 :
                    // ES3.g3:1747:89: Identifier
                    Identifier221=this.match(this.input,Identifier,ES3Parser.FOLLOW_Identifier_in_breakStatement5420); 
                    Identifier221_tree = this.adaptor.create(Identifier221);
                    this.adaptor.addChild(root_0, Identifier221_tree);



                    break;

            }

            this.pushFollow(ES3Parser.FOLLOW_semic_in_breakStatement5423);
            semic222=this.semic();

            this.state._fsp--;




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
    returnStatement_return: (function() {
        ES3Parser.returnStatement_return = function(){};
        org.antlr.lang.extend(ES3Parser.returnStatement_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1767:1: returnStatement : RETURN ( expression )? semic ;
    // $ANTLR start "returnStatement"
    returnStatement: function() {
        var retval = new ES3Parser.returnStatement_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var RETURN223 = null;
         var expression224 = null;
         var semic225 = null;

        var RETURN223_tree=null;

        try {
            // ES3.g3:1768:2: ( RETURN ( expression )? semic )
            // ES3.g3:1768:4: RETURN ( expression )? semic
            root_0 = this.adaptor.nil();

            RETURN223=this.match(this.input,RETURN,ES3Parser.FOLLOW_RETURN_in_returnStatement5442); 
            RETURN223_tree = this.adaptor.create(RETURN223);
            root_0 = this.adaptor.becomeRoot(RETURN223_tree, root_0);

             this.promoteEOL(null); 
            // ES3.g3:1768:39: ( expression )?
            var alt63=2;
            var LA63_0 = this.input.LA(1);

            if ( ((LA63_0>=NULL && LA63_0<=FALSE)||LA63_0==DELETE||LA63_0==FUNCTION||LA63_0==NEW||LA63_0==THIS||LA63_0==TYPEOF||LA63_0==VOID||LA63_0==LBRACE||LA63_0==LBRACK||(LA63_0>=ADD && LA63_0<=SUB)||(LA63_0>=INC && LA63_0<=DEC)||(LA63_0>=NOT && LA63_0<=INV)||(LA63_0>=Identifier && LA63_0<=StringLiteral)||(LA63_0>=IdentifierNameAmpersatStart && LA63_0<=LPAREN)||LA63_0==RegularExpressionLiteral||(LA63_0>=DecimalLiteral && LA63_0<=HexIntegerLiteral)) ) {
                alt63=1;
            }
            switch (alt63) {
                case 1 :
                    // ES3.g3:1768:39: expression
                    this.pushFollow(ES3Parser.FOLLOW_expression_in_returnStatement5447);
                    expression224=this.expression();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, expression224.getTree());


                    break;

            }

            this.pushFollow(ES3Parser.FOLLOW_semic_in_returnStatement5450);
            semic225=this.semic();

            this.state._fsp--;




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
    withStatement_return: (function() {
        ES3Parser.withStatement_return = function(){};
        org.antlr.lang.extend(ES3Parser.withStatement_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1775:1: withStatement : WITH LPAREN expression RPAREN statement ;
    // $ANTLR start "withStatement"
    withStatement: function() {
        var retval = new ES3Parser.withStatement_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var WITH226 = null;
        var LPAREN227 = null;
        var RPAREN229 = null;
         var expression228 = null;
         var statement230 = null;

        var WITH226_tree=null;
        var LPAREN227_tree=null;
        var RPAREN229_tree=null;

        try {
            // ES3.g3:1776:2: ( WITH LPAREN expression RPAREN statement )
            // ES3.g3:1776:4: WITH LPAREN expression RPAREN statement
            root_0 = this.adaptor.nil();

            WITH226=this.match(this.input,WITH,ES3Parser.FOLLOW_WITH_in_withStatement5467); 
            WITH226_tree = this.adaptor.create(WITH226);
            root_0 = this.adaptor.becomeRoot(WITH226_tree, root_0);

            LPAREN227=this.match(this.input,LPAREN,ES3Parser.FOLLOW_LPAREN_in_withStatement5470); 
            this.pushFollow(ES3Parser.FOLLOW_expression_in_withStatement5473);
            expression228=this.expression();

            this.state._fsp--;

            this.adaptor.addChild(root_0, expression228.getTree());
            RPAREN229=this.match(this.input,RPAREN,ES3Parser.FOLLOW_RPAREN_in_withStatement5475); 
            this.pushFollow(ES3Parser.FOLLOW_statement_in_withStatement5478);
            statement230=this.statement();

            this.state._fsp--;

            this.adaptor.addChild(root_0, statement230.getTree());



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
    switchStatement_return: (function() {
        ES3Parser.switchStatement_return = function(){};
        org.antlr.lang.extend(ES3Parser.switchStatement_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1783:1: switchStatement : SWITCH LPAREN expression RPAREN LBRACE ({...}? => defaultClause | caseClause )* RBRACE -> ^( SWITCH expression ( defaultClause )? ( caseClause )* ) ;
    // $ANTLR start "switchStatement"
    switchStatement: function() {
        var retval = new ES3Parser.switchStatement_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var SWITCH231 = null;
        var LPAREN232 = null;
        var RPAREN234 = null;
        var LBRACE235 = null;
        var RBRACE238 = null;
         var expression233 = null;
         var defaultClause236 = null;
         var caseClause237 = null;

        var SWITCH231_tree=null;
        var LPAREN232_tree=null;
        var RPAREN234_tree=null;
        var LBRACE235_tree=null;
        var RBRACE238_tree=null;
        var stream_RBRACE=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token RBRACE");
        var stream_LPAREN=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token LPAREN");
        var stream_SWITCH=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token SWITCH");
        var stream_RPAREN=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token RPAREN");
        var stream_LBRACE=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token LBRACE");
        var stream_expression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule expression");
        var stream_defaultClause=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule defaultClause");
        var stream_caseClause=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule caseClause");

        //	int 
        	  var defaultClauseCount = 0;

        try {
            // ES3.g3:1789:2: ( SWITCH LPAREN expression RPAREN LBRACE ({...}? => defaultClause | caseClause )* RBRACE -> ^( SWITCH expression ( defaultClause )? ( caseClause )* ) )
            // ES3.g3:1789:4: SWITCH LPAREN expression RPAREN LBRACE ({...}? => defaultClause | caseClause )* RBRACE
            SWITCH231=this.match(this.input,SWITCH,ES3Parser.FOLLOW_SWITCH_in_switchStatement5499);  
            stream_SWITCH.add(SWITCH231);

            LPAREN232=this.match(this.input,LPAREN,ES3Parser.FOLLOW_LPAREN_in_switchStatement5501);  
            stream_LPAREN.add(LPAREN232);

            this.pushFollow(ES3Parser.FOLLOW_expression_in_switchStatement5503);
            expression233=this.expression();

            this.state._fsp--;

            stream_expression.add(expression233.getTree());
            RPAREN234=this.match(this.input,RPAREN,ES3Parser.FOLLOW_RPAREN_in_switchStatement5505);  
            stream_RPAREN.add(RPAREN234);

            LBRACE235=this.match(this.input,LBRACE,ES3Parser.FOLLOW_LBRACE_in_switchStatement5507);  
            stream_LBRACE.add(LBRACE235);

            // ES3.g3:1789:43: ({...}? => defaultClause | caseClause )*
            loop64:
            do {
                var alt64=3;
                var LA64_0 = this.input.LA(1);

                if ( (LA64_0==DEFAULT) && (( defaultClauseCount == 0 ))) {
                    alt64=1;
                }
                else if ( (LA64_0==CASE) ) {
                    alt64=2;
                }


                switch (alt64) {
                case 1 :
                    // ES3.g3:1789:45: {...}? => defaultClause
                    if ( !(( defaultClauseCount == 0 )) ) {
                        throw new org.antlr.runtime.FailedPredicateException(this.input, "switchStatement", " defaultClauseCount == 0 ");
                    }
                    this.pushFollow(ES3Parser.FOLLOW_defaultClause_in_switchStatement5514);
                    defaultClause236=this.defaultClause();

                    this.state._fsp--;

                    stream_defaultClause.add(defaultClause236.getTree());
                     defaultClauseCount++; 


                    break;
                case 2 :
                    // ES3.g3:1789:118: caseClause
                    this.pushFollow(ES3Parser.FOLLOW_caseClause_in_switchStatement5520);
                    caseClause237=this.caseClause();

                    this.state._fsp--;

                    stream_caseClause.add(caseClause237.getTree());


                    break;

                default :
                    break loop64;
                }
            } while (true);

            RBRACE238=this.match(this.input,RBRACE,ES3Parser.FOLLOW_RBRACE_in_switchStatement5525);  
            stream_RBRACE.add(RBRACE238);



            // AST REWRITE
            // elements: SWITCH, defaultClause, caseClause, expression
            // token labels: 
            // rule labels: retval
            // token list labels: 
            // rule list labels: 
            retval.tree = root_0;
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 1790:2: -> ^( SWITCH expression ( defaultClause )? ( caseClause )* )
            {
                // ES3.g3:1790:5: ^( SWITCH expression ( defaultClause )? ( caseClause )* )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(stream_SWITCH.nextNode(), root_1);

                this.adaptor.addChild(root_1, stream_expression.nextTree());
                // ES3.g3:1790:26: ( defaultClause )?
                if ( stream_defaultClause.hasNext() ) {
                    this.adaptor.addChild(root_1, stream_defaultClause.nextTree());

                }
                stream_defaultClause.reset();
                // ES3.g3:1790:41: ( caseClause )*
                while ( stream_caseClause.hasNext() ) {
                    this.adaptor.addChild(root_1, stream_caseClause.nextTree());

                }
                stream_caseClause.reset();

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;


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
    caseClause_return: (function() {
        ES3Parser.caseClause_return = function(){};
        org.antlr.lang.extend(ES3Parser.caseClause_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1793:1: caseClause : CASE expression COLON ( statement )* ;
    // $ANTLR start "caseClause"
    caseClause: function() {
        var retval = new ES3Parser.caseClause_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var CASE239 = null;
        var COLON241 = null;
         var expression240 = null;
         var statement242 = null;

        var CASE239_tree=null;
        var COLON241_tree=null;

        try {
            // ES3.g3:1794:2: ( CASE expression COLON ( statement )* )
            // ES3.g3:1794:4: CASE expression COLON ( statement )*
            root_0 = this.adaptor.nil();

            CASE239=this.match(this.input,CASE,ES3Parser.FOLLOW_CASE_in_caseClause5553); 
            CASE239_tree = this.adaptor.create(CASE239);
            root_0 = this.adaptor.becomeRoot(CASE239_tree, root_0);

            this.pushFollow(ES3Parser.FOLLOW_expression_in_caseClause5556);
            expression240=this.expression();

            this.state._fsp--;

            this.adaptor.addChild(root_0, expression240.getTree());
            COLON241=this.match(this.input,COLON,ES3Parser.FOLLOW_COLON_in_caseClause5558); 
            // ES3.g3:1794:28: ( statement )*
            loop65:
            do {
                var alt65=2;
                var LA65_0 = this.input.LA(1);

                if ( ((LA65_0>=NULL && LA65_0<=BREAK)||LA65_0==CONTINUE||(LA65_0>=DELETE && LA65_0<=DO)||(LA65_0>=FOR && LA65_0<=IF)||(LA65_0>=NEW && LA65_0<=WITH)||LA65_0==LBRACE||LA65_0==LBRACK||LA65_0==SEMIC||(LA65_0>=ADD && LA65_0<=SUB)||(LA65_0>=INC && LA65_0<=DEC)||(LA65_0>=NOT && LA65_0<=INV)||(LA65_0>=Identifier && LA65_0<=StringLiteral)||(LA65_0>=IdentifierNameAmpersatStart && LA65_0<=LPAREN)||LA65_0==RegularExpressionLiteral||(LA65_0>=DecimalLiteral && LA65_0<=HexIntegerLiteral)) ) {
                    alt65=1;
                }


                switch (alt65) {
                case 1 :
                    // ES3.g3:1794:28: statement
                    this.pushFollow(ES3Parser.FOLLOW_statement_in_caseClause5561);
                    statement242=this.statement();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, statement242.getTree());


                    break;

                default :
                    break loop65;
                }
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
    defaultClause_return: (function() {
        ES3Parser.defaultClause_return = function(){};
        org.antlr.lang.extend(ES3Parser.defaultClause_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1797:1: defaultClause : DEFAULT COLON ( statement )* ;
    // $ANTLR start "defaultClause"
    defaultClause: function() {
        var retval = new ES3Parser.defaultClause_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var DEFAULT243 = null;
        var COLON244 = null;
         var statement245 = null;

        var DEFAULT243_tree=null;
        var COLON244_tree=null;

        try {
            // ES3.g3:1798:2: ( DEFAULT COLON ( statement )* )
            // ES3.g3:1798:4: DEFAULT COLON ( statement )*
            root_0 = this.adaptor.nil();

            DEFAULT243=this.match(this.input,DEFAULT,ES3Parser.FOLLOW_DEFAULT_in_defaultClause5574); 
            DEFAULT243_tree = this.adaptor.create(DEFAULT243);
            root_0 = this.adaptor.becomeRoot(DEFAULT243_tree, root_0);

            COLON244=this.match(this.input,COLON,ES3Parser.FOLLOW_COLON_in_defaultClause5577); 
            // ES3.g3:1798:20: ( statement )*
            loop66:
            do {
                var alt66=2;
                var LA66_0 = this.input.LA(1);

                if ( ((LA66_0>=NULL && LA66_0<=BREAK)||LA66_0==CONTINUE||(LA66_0>=DELETE && LA66_0<=DO)||(LA66_0>=FOR && LA66_0<=IF)||(LA66_0>=NEW && LA66_0<=WITH)||LA66_0==LBRACE||LA66_0==LBRACK||LA66_0==SEMIC||(LA66_0>=ADD && LA66_0<=SUB)||(LA66_0>=INC && LA66_0<=DEC)||(LA66_0>=NOT && LA66_0<=INV)||(LA66_0>=Identifier && LA66_0<=StringLiteral)||(LA66_0>=IdentifierNameAmpersatStart && LA66_0<=LPAREN)||LA66_0==RegularExpressionLiteral||(LA66_0>=DecimalLiteral && LA66_0<=HexIntegerLiteral)) ) {
                    alt66=1;
                }


                switch (alt66) {
                case 1 :
                    // ES3.g3:1798:20: statement
                    this.pushFollow(ES3Parser.FOLLOW_statement_in_defaultClause5580);
                    statement245=this.statement();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, statement245.getTree());


                    break;

                default :
                    break loop66;
                }
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
    labelledStatement_return: (function() {
        ES3Parser.labelledStatement_return = function(){};
        org.antlr.lang.extend(ES3Parser.labelledStatement_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1805:1: labelledStatement : Identifier COLON statement -> ^( LABELLED Identifier statement ) ;
    // $ANTLR start "labelledStatement"
    labelledStatement: function() {
        var retval = new ES3Parser.labelledStatement_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var Identifier246 = null;
        var COLON247 = null;
         var statement248 = null;

        var Identifier246_tree=null;
        var COLON247_tree=null;
        var stream_Identifier=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token Identifier");
        var stream_COLON=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token COLON");
        var stream_statement=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule statement");
        try {
            // ES3.g3:1806:2: ( Identifier COLON statement -> ^( LABELLED Identifier statement ) )
            // ES3.g3:1806:4: Identifier COLON statement
            Identifier246=this.match(this.input,Identifier,ES3Parser.FOLLOW_Identifier_in_labelledStatement5597);  
            stream_Identifier.add(Identifier246);

            COLON247=this.match(this.input,COLON,ES3Parser.FOLLOW_COLON_in_labelledStatement5599);  
            stream_COLON.add(COLON247);

            this.pushFollow(ES3Parser.FOLLOW_statement_in_labelledStatement5601);
            statement248=this.statement();

            this.state._fsp--;

            stream_statement.add(statement248.getTree());


            // AST REWRITE
            // elements: statement, Identifier
            // token labels: 
            // rule labels: retval
            // token list labels: 
            // rule list labels: 
            retval.tree = root_0;
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 1807:2: -> ^( LABELLED Identifier statement )
            {
                // ES3.g3:1807:5: ^( LABELLED Identifier statement )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(LABELLED, "LABELLED"), root_1);

                this.adaptor.addChild(root_1, stream_Identifier.nextNode());
                this.adaptor.addChild(root_1, stream_statement.nextTree());

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;


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
    throwStatement_return: (function() {
        ES3Parser.throwStatement_return = function(){};
        org.antlr.lang.extend(ES3Parser.throwStatement_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1829:1: throwStatement : THROW expression semic ;
    // $ANTLR start "throwStatement"
    throwStatement: function() {
        var retval = new ES3Parser.throwStatement_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var THROW249 = null;
         var expression250 = null;
         var semic251 = null;

        var THROW249_tree=null;

        try {
            // ES3.g3:1830:2: ( THROW expression semic )
            // ES3.g3:1830:4: THROW expression semic
            root_0 = this.adaptor.nil();

            THROW249=this.match(this.input,THROW,ES3Parser.FOLLOW_THROW_in_throwStatement5632); 
            THROW249_tree = this.adaptor.create(THROW249);
            root_0 = this.adaptor.becomeRoot(THROW249_tree, root_0);

             this.promoteEOL(null); 
            this.pushFollow(ES3Parser.FOLLOW_expression_in_throwStatement5637);
            expression250=this.expression();

            this.state._fsp--;

            this.adaptor.addChild(root_0, expression250.getTree());
            this.pushFollow(ES3Parser.FOLLOW_semic_in_throwStatement5639);
            semic251=this.semic();

            this.state._fsp--;




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
    tryStatement_return: (function() {
        ES3Parser.tryStatement_return = function(){};
        org.antlr.lang.extend(ES3Parser.tryStatement_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1837:1: tryStatement : TRY block ( catchClause ( finallyClause )? | finallyClause ) ;
    // $ANTLR start "tryStatement"
    tryStatement: function() {
        var retval = new ES3Parser.tryStatement_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var TRY252 = null;
         var block253 = null;
         var catchClause254 = null;
         var finallyClause255 = null;
         var finallyClause256 = null;

        var TRY252_tree=null;

        try {
            // ES3.g3:1838:2: ( TRY block ( catchClause ( finallyClause )? | finallyClause ) )
            // ES3.g3:1838:4: TRY block ( catchClause ( finallyClause )? | finallyClause )
            root_0 = this.adaptor.nil();

            TRY252=this.match(this.input,TRY,ES3Parser.FOLLOW_TRY_in_tryStatement5656); 
            TRY252_tree = this.adaptor.create(TRY252);
            root_0 = this.adaptor.becomeRoot(TRY252_tree, root_0);

            this.pushFollow(ES3Parser.FOLLOW_block_in_tryStatement5659);
            block253=this.block();

            this.state._fsp--;

            this.adaptor.addChild(root_0, block253.getTree());
            // ES3.g3:1838:15: ( catchClause ( finallyClause )? | finallyClause )
            var alt68=2;
            var LA68_0 = this.input.LA(1);

            if ( (LA68_0==CATCH) ) {
                alt68=1;
            }
            else if ( (LA68_0==FINALLY) ) {
                alt68=2;
            }
            else {
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 68, 0, this.input);

                throw nvae;
            }
            switch (alt68) {
                case 1 :
                    // ES3.g3:1838:17: catchClause ( finallyClause )?
                    this.pushFollow(ES3Parser.FOLLOW_catchClause_in_tryStatement5663);
                    catchClause254=this.catchClause();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, catchClause254.getTree());
                    // ES3.g3:1838:29: ( finallyClause )?
                    var alt67=2;
                    var LA67_0 = this.input.LA(1);

                    if ( (LA67_0==FINALLY) ) {
                        alt67=1;
                    }
                    switch (alt67) {
                        case 1 :
                            // ES3.g3:1838:29: finallyClause
                            this.pushFollow(ES3Parser.FOLLOW_finallyClause_in_tryStatement5665);
                            finallyClause255=this.finallyClause();

                            this.state._fsp--;

                            this.adaptor.addChild(root_0, finallyClause255.getTree());


                            break;

                    }



                    break;
                case 2 :
                    // ES3.g3:1838:46: finallyClause
                    this.pushFollow(ES3Parser.FOLLOW_finallyClause_in_tryStatement5670);
                    finallyClause256=this.finallyClause();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, finallyClause256.getTree());


                    break;

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
    catchClause_return: (function() {
        ES3Parser.catchClause_return = function(){};
        org.antlr.lang.extend(ES3Parser.catchClause_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1841:1: catchClause : CATCH LPAREN Identifier RPAREN block ;
    // $ANTLR start "catchClause"
    catchClause: function() {
        var retval = new ES3Parser.catchClause_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var CATCH257 = null;
        var LPAREN258 = null;
        var Identifier259 = null;
        var RPAREN260 = null;
         var block261 = null;

        var CATCH257_tree=null;
        var LPAREN258_tree=null;
        var Identifier259_tree=null;
        var RPAREN260_tree=null;

        try {
            // ES3.g3:1842:2: ( CATCH LPAREN Identifier RPAREN block )
            // ES3.g3:1842:4: CATCH LPAREN Identifier RPAREN block
            root_0 = this.adaptor.nil();

            CATCH257=this.match(this.input,CATCH,ES3Parser.FOLLOW_CATCH_in_catchClause5684); 
            CATCH257_tree = this.adaptor.create(CATCH257);
            root_0 = this.adaptor.becomeRoot(CATCH257_tree, root_0);

            LPAREN258=this.match(this.input,LPAREN,ES3Parser.FOLLOW_LPAREN_in_catchClause5687); 
            Identifier259=this.match(this.input,Identifier,ES3Parser.FOLLOW_Identifier_in_catchClause5690); 
            Identifier259_tree = this.adaptor.create(Identifier259);
            this.adaptor.addChild(root_0, Identifier259_tree);

            RPAREN260=this.match(this.input,RPAREN,ES3Parser.FOLLOW_RPAREN_in_catchClause5692); 
            this.pushFollow(ES3Parser.FOLLOW_block_in_catchClause5695);
            block261=this.block();

            this.state._fsp--;

            this.adaptor.addChild(root_0, block261.getTree());



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
    finallyClause_return: (function() {
        ES3Parser.finallyClause_return = function(){};
        org.antlr.lang.extend(ES3Parser.finallyClause_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1845:1: finallyClause : FINALLY block ;
    // $ANTLR start "finallyClause"
    finallyClause: function() {
        var retval = new ES3Parser.finallyClause_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var FINALLY262 = null;
         var block263 = null;

        var FINALLY262_tree=null;

        try {
            // ES3.g3:1846:2: ( FINALLY block )
            // ES3.g3:1846:4: FINALLY block
            root_0 = this.adaptor.nil();

            FINALLY262=this.match(this.input,FINALLY,ES3Parser.FOLLOW_FINALLY_in_finallyClause5707); 
            FINALLY262_tree = this.adaptor.create(FINALLY262);
            root_0 = this.adaptor.becomeRoot(FINALLY262_tree, root_0);

            this.pushFollow(ES3Parser.FOLLOW_block_in_finallyClause5710);
            block263=this.block();

            this.state._fsp--;

            this.adaptor.addChild(root_0, block263.getTree());



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
    functionDeclaration_return: (function() {
        ES3Parser.functionDeclaration_return = function(){};
        org.antlr.lang.extend(ES3Parser.functionDeclaration_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1859:1: functionDeclaration : FUNCTION name= Identifier formalParameterList functionBody -> ^( FUNCTION $name formalParameterList functionBody ) ;
    // $ANTLR start "functionDeclaration"
    functionDeclaration: function() {
        var retval = new ES3Parser.functionDeclaration_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var name = null;
        var FUNCTION264 = null;
         var formalParameterList265 = null;
         var functionBody266 = null;

        var name_tree=null;
        var FUNCTION264_tree=null;
        var stream_Identifier=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token Identifier");
        var stream_FUNCTION=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token FUNCTION");
        var stream_functionBody=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule functionBody");
        var stream_formalParameterList=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule formalParameterList");
        try {
            // ES3.g3:1860:2: ( FUNCTION name= Identifier formalParameterList functionBody -> ^( FUNCTION $name formalParameterList functionBody ) )
            // ES3.g3:1860:4: FUNCTION name= Identifier formalParameterList functionBody
            FUNCTION264=this.match(this.input,FUNCTION,ES3Parser.FOLLOW_FUNCTION_in_functionDeclaration5731);  
            stream_FUNCTION.add(FUNCTION264);

            name=this.match(this.input,Identifier,ES3Parser.FOLLOW_Identifier_in_functionDeclaration5735);  
            stream_Identifier.add(name);

            this.pushFollow(ES3Parser.FOLLOW_formalParameterList_in_functionDeclaration5737);
            formalParameterList265=this.formalParameterList();

            this.state._fsp--;

            stream_formalParameterList.add(formalParameterList265.getTree());
            this.pushFollow(ES3Parser.FOLLOW_functionBody_in_functionDeclaration5739);
            functionBody266=this.functionBody();

            this.state._fsp--;

            stream_functionBody.add(functionBody266.getTree());


            // AST REWRITE
            // elements: formalParameterList, functionBody, FUNCTION, name
            // token labels: name
            // rule labels: retval
            // token list labels: 
            // rule list labels: 
            retval.tree = root_0;
            var stream_name=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token name",name);
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 1861:2: -> ^( FUNCTION $name formalParameterList functionBody )
            {
                // ES3.g3:1861:5: ^( FUNCTION $name formalParameterList functionBody )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(stream_FUNCTION.nextNode(), root_1);

                this.adaptor.addChild(root_1, stream_name.nextNode());
                this.adaptor.addChild(root_1, stream_formalParameterList.nextTree());
                this.adaptor.addChild(root_1, stream_functionBody.nextTree());

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;


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
    functionExpression_return: (function() {
        ES3Parser.functionExpression_return = function(){};
        org.antlr.lang.extend(ES3Parser.functionExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1864:1: functionExpression : FUNCTION (name= Identifier )? formalParameterList functionBody -> ^( FUNCTION ( $name)? formalParameterList functionBody ) ;
    // $ANTLR start "functionExpression"
    functionExpression: function() {
        var retval = new ES3Parser.functionExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var name = null;
        var FUNCTION267 = null;
         var formalParameterList268 = null;
         var functionBody269 = null;

        var name_tree=null;
        var FUNCTION267_tree=null;
        var stream_Identifier=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token Identifier");
        var stream_FUNCTION=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token FUNCTION");
        var stream_functionBody=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule functionBody");
        var stream_formalParameterList=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule formalParameterList");
        try {
            // ES3.g3:1865:2: ( FUNCTION (name= Identifier )? formalParameterList functionBody -> ^( FUNCTION ( $name)? formalParameterList functionBody ) )
            // ES3.g3:1865:4: FUNCTION (name= Identifier )? formalParameterList functionBody
            FUNCTION267=this.match(this.input,FUNCTION,ES3Parser.FOLLOW_FUNCTION_in_functionExpression5766);  
            stream_FUNCTION.add(FUNCTION267);

            // ES3.g3:1865:17: (name= Identifier )?
            var alt69=2;
            var LA69_0 = this.input.LA(1);

            if ( (LA69_0==Identifier) ) {
                alt69=1;
            }
            switch (alt69) {
                case 1 :
                    // ES3.g3:1865:17: name= Identifier
                    name=this.match(this.input,Identifier,ES3Parser.FOLLOW_Identifier_in_functionExpression5770);  
                    stream_Identifier.add(name);



                    break;

            }

            this.pushFollow(ES3Parser.FOLLOW_formalParameterList_in_functionExpression5773);
            formalParameterList268=this.formalParameterList();

            this.state._fsp--;

            stream_formalParameterList.add(formalParameterList268.getTree());
            this.pushFollow(ES3Parser.FOLLOW_functionBody_in_functionExpression5775);
            functionBody269=this.functionBody();

            this.state._fsp--;

            stream_functionBody.add(functionBody269.getTree());


            // AST REWRITE
            // elements: name, functionBody, FUNCTION, formalParameterList
            // token labels: name
            // rule labels: retval
            // token list labels: 
            // rule list labels: 
            retval.tree = root_0;
            var stream_name=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token name",name);
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 1866:2: -> ^( FUNCTION ( $name)? formalParameterList functionBody )
            {
                // ES3.g3:1866:5: ^( FUNCTION ( $name)? formalParameterList functionBody )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(stream_FUNCTION.nextNode(), root_1);

                // ES3.g3:1866:17: ( $name)?
                if ( stream_name.hasNext() ) {
                    this.adaptor.addChild(root_1, stream_name.nextNode());

                }
                stream_name.reset();
                this.adaptor.addChild(root_1, stream_formalParameterList.nextTree());
                this.adaptor.addChild(root_1, stream_functionBody.nextTree());

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;


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
    formalParameterList_return: (function() {
        ES3Parser.formalParameterList_return = function(){};
        org.antlr.lang.extend(ES3Parser.formalParameterList_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1869:1: formalParameterList : LPAREN ( Identifier ( COMMA Identifier )* )? RPAREN -> ^( ARGS ( Identifier )* ) ;
    // $ANTLR start "formalParameterList"
    formalParameterList: function() {
        var retval = new ES3Parser.formalParameterList_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var LPAREN270 = null;
        var Identifier271 = null;
        var COMMA272 = null;
        var Identifier273 = null;
        var RPAREN274 = null;

        var LPAREN270_tree=null;
        var Identifier271_tree=null;
        var COMMA272_tree=null;
        var Identifier273_tree=null;
        var RPAREN274_tree=null;
        var stream_COMMA=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token COMMA");
        var stream_Identifier=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token Identifier");
        var stream_LPAREN=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token LPAREN");
        var stream_RPAREN=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token RPAREN");

        try {
            // ES3.g3:1870:2: ( LPAREN ( Identifier ( COMMA Identifier )* )? RPAREN -> ^( ARGS ( Identifier )* ) )
            // ES3.g3:1870:4: LPAREN ( Identifier ( COMMA Identifier )* )? RPAREN
            LPAREN270=this.match(this.input,LPAREN,ES3Parser.FOLLOW_LPAREN_in_formalParameterList5803);  
            stream_LPAREN.add(LPAREN270);

            // ES3.g3:1870:11: ( Identifier ( COMMA Identifier )* )?
            var alt71=2;
            var LA71_0 = this.input.LA(1);

            if ( (LA71_0==Identifier) ) {
                alt71=1;
            }
            switch (alt71) {
                case 1 :
                    // ES3.g3:1870:13: Identifier ( COMMA Identifier )*
                    Identifier271=this.match(this.input,Identifier,ES3Parser.FOLLOW_Identifier_in_formalParameterList5807);  
                    stream_Identifier.add(Identifier271);

                    // ES3.g3:1870:24: ( COMMA Identifier )*
                    loop70:
                    do {
                        var alt70=2;
                        var LA70_0 = this.input.LA(1);

                        if ( (LA70_0==COMMA) ) {
                            alt70=1;
                        }


                        switch (alt70) {
                        case 1 :
                            // ES3.g3:1870:26: COMMA Identifier
                            COMMA272=this.match(this.input,COMMA,ES3Parser.FOLLOW_COMMA_in_formalParameterList5811);  
                            stream_COMMA.add(COMMA272);

                            Identifier273=this.match(this.input,Identifier,ES3Parser.FOLLOW_Identifier_in_formalParameterList5813);  
                            stream_Identifier.add(Identifier273);



                            break;

                        default :
                            break loop70;
                        }
                    } while (true);



                    break;

            }

            RPAREN274=this.match(this.input,RPAREN,ES3Parser.FOLLOW_RPAREN_in_formalParameterList5821);  
            stream_RPAREN.add(RPAREN274);



            // AST REWRITE
            // elements: Identifier
            // token labels: 
            // rule labels: retval
            // token list labels: 
            // rule list labels: 
            retval.tree = root_0;
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 1871:2: -> ^( ARGS ( Identifier )* )
            {
                // ES3.g3:1871:5: ^( ARGS ( Identifier )* )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(ARGS, "ARGS"), root_1);

                // ES3.g3:1871:13: ( Identifier )*
                while ( stream_Identifier.hasNext() ) {
                    this.adaptor.addChild(root_1, stream_Identifier.nextNode());

                }
                stream_Identifier.reset();

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;


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
    functionBody_return: (function() {
        ES3Parser.functionBody_return = function(){};
        org.antlr.lang.extend(ES3Parser.functionBody_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1874:1: functionBody : lb= LBRACE ( sourceElement )* RBRACE -> ^( BLOCK[$lb, \"BLOCK\"] ( sourceElement )* ) ;
    // $ANTLR start "functionBody"
    functionBody: function() {
        var retval = new ES3Parser.functionBody_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var lb = null;
        var RBRACE276 = null;
         var sourceElement275 = null;

        var lb_tree=null;
        var RBRACE276_tree=null;
        var stream_RBRACE=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token RBRACE");
        var stream_LBRACE=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token LBRACE");
        var stream_sourceElement=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule sourceElement");
        try {
            // ES3.g3:1875:2: (lb= LBRACE ( sourceElement )* RBRACE -> ^( BLOCK[$lb, \"BLOCK\"] ( sourceElement )* ) )
            // ES3.g3:1875:4: lb= LBRACE ( sourceElement )* RBRACE
            lb=this.match(this.input,LBRACE,ES3Parser.FOLLOW_LBRACE_in_functionBody5846);  
            stream_LBRACE.add(lb);

            // ES3.g3:1875:14: ( sourceElement )*
            loop72:
            do {
                var alt72=2;
                var LA72_0 = this.input.LA(1);

                if ( ((LA72_0>=NULL && LA72_0<=BREAK)||LA72_0==CONTINUE||(LA72_0>=DELETE && LA72_0<=DO)||(LA72_0>=FOR && LA72_0<=IF)||(LA72_0>=NEW && LA72_0<=WITH)||LA72_0==LBRACE||LA72_0==LBRACK||LA72_0==SEMIC||(LA72_0>=ADD && LA72_0<=SUB)||(LA72_0>=INC && LA72_0<=DEC)||(LA72_0>=NOT && LA72_0<=INV)||(LA72_0>=Identifier && LA72_0<=StringLiteral)||(LA72_0>=IdentifierNameAmpersatStart && LA72_0<=LPAREN)||LA72_0==RegularExpressionLiteral||(LA72_0>=DecimalLiteral && LA72_0<=HexIntegerLiteral)) ) {
                    alt72=1;
                }


                switch (alt72) {
                case 1 :
                    // ES3.g3:1875:14: sourceElement
                    this.pushFollow(ES3Parser.FOLLOW_sourceElement_in_functionBody5848);
                    sourceElement275=this.sourceElement();

                    this.state._fsp--;

                    stream_sourceElement.add(sourceElement275.getTree());


                    break;

                default :
                    break loop72;
                }
            } while (true);

            RBRACE276=this.match(this.input,RBRACE,ES3Parser.FOLLOW_RBRACE_in_functionBody5851);  
            stream_RBRACE.add(RBRACE276);



            // AST REWRITE
            // elements: sourceElement
            // token labels: 
            // rule labels: retval
            // token list labels: 
            // rule list labels: 
            retval.tree = root_0;
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 1876:2: -> ^( BLOCK[$lb, \"BLOCK\"] ( sourceElement )* )
            {
                // ES3.g3:1876:5: ^( BLOCK[$lb, \"BLOCK\"] ( sourceElement )* )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(BLOCK, lb, "BLOCK"), root_1);

                // ES3.g3:1876:28: ( sourceElement )*
                while ( stream_sourceElement.hasNext() ) {
                    this.adaptor.addChild(root_1, stream_sourceElement.nextTree());

                }
                stream_sourceElement.reset();

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;


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
    program_return: (function() {
        ES3Parser.program_return = function(){};
        org.antlr.lang.extend(ES3Parser.program_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1883:1: program : ( sourceElement )* ;
    // $ANTLR start "program"
    program: function() {
        var retval = new ES3Parser.program_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

         var sourceElement277 = null;


        try {
            // ES3.g3:1884:2: ( ( sourceElement )* )
            // ES3.g3:1884:4: ( sourceElement )*
            root_0 = this.adaptor.nil();

            // ES3.g3:1884:4: ( sourceElement )*
            loop73:
            do {
                var alt73=2;
                var LA73_0 = this.input.LA(1);

                if ( ((LA73_0>=NULL && LA73_0<=BREAK)||LA73_0==CONTINUE||(LA73_0>=DELETE && LA73_0<=DO)||(LA73_0>=FOR && LA73_0<=IF)||(LA73_0>=NEW && LA73_0<=WITH)||LA73_0==LBRACE||LA73_0==LBRACK||LA73_0==SEMIC||(LA73_0>=ADD && LA73_0<=SUB)||(LA73_0>=INC && LA73_0<=DEC)||(LA73_0>=NOT && LA73_0<=INV)||(LA73_0>=Identifier && LA73_0<=StringLiteral)||(LA73_0>=IdentifierNameAmpersatStart && LA73_0<=LPAREN)||LA73_0==RegularExpressionLiteral||(LA73_0>=DecimalLiteral && LA73_0<=HexIntegerLiteral)) ) {
                    alt73=1;
                }


                switch (alt73) {
                case 1 :
                    // ES3.g3:1884:4: sourceElement
                    this.pushFollow(ES3Parser.FOLLOW_sourceElement_in_program5880);
                    sourceElement277=this.sourceElement();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, sourceElement277.getTree());


                    break;

                default :
                    break loop73;
                }
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
    sourceElement_return: (function() {
        ES3Parser.sourceElement_return = function(){};
        org.antlr.lang.extend(ES3Parser.sourceElement_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1892:1: sourceElement options {k=1; } : ({...}? functionDeclaration | statement );
    // $ANTLR start "sourceElement"
    sourceElement: function() {
        var retval = new ES3Parser.sourceElement_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

         var functionDeclaration278 = null;
         var statement279 = null;


        try {
            // ES3.g3:1897:2: ({...}? functionDeclaration | statement )
            var alt74=2;
            alt74 = this.dfa74.predict(this.input);
            switch (alt74) {
                case 1 :
                    // ES3.g3:1897:4: {...}? functionDeclaration
                    root_0 = this.adaptor.nil();

                    if ( !(( this.input.LA(1) == this.theParser.FUNCTION )) ) {
                        throw new org.antlr.runtime.FailedPredicateException(this.input, "sourceElement", " this.input.LA(1) == this.theParser.FUNCTION ");
                    }
                    this.pushFollow(ES3Parser.FOLLOW_functionDeclaration_in_sourceElement5909);
                    functionDeclaration278=this.functionDeclaration();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, functionDeclaration278.getTree());


                    break;
                case 2 :
                    // ES3.g3:1898:4: statement
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_statement_in_sourceElement5914);
                    statement279=this.statement();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, statement279.getTree());


                    break;

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
    forControlStatement_return: (function() {
        ES3Parser.forControlStatement_return = function(){};
        org.antlr.lang.extend(ES3Parser.forControlStatement_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1911:1: forControlStatement : FOR LPAREN forControl RPAREN ;
    // $ANTLR start "forControlStatement"
    forControlStatement: function() {
        var retval = new ES3Parser.forControlStatement_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var FOR280 = null;
        var LPAREN281 = null;
        var RPAREN283 = null;
         var forControl282 = null;

        var FOR280_tree=null;
        var LPAREN281_tree=null;
        var RPAREN283_tree=null;

        try {
            // ES3.g3:1912:2: ( FOR LPAREN forControl RPAREN )
            // ES3.g3:1912:4: FOR LPAREN forControl RPAREN
            root_0 = this.adaptor.nil();

            FOR280=this.match(this.input,FOR,ES3Parser.FOLLOW_FOR_in_forControlStatement5932); 
            FOR280_tree = this.adaptor.create(FOR280);
            root_0 = this.adaptor.becomeRoot(FOR280_tree, root_0);

            LPAREN281=this.match(this.input,LPAREN,ES3Parser.FOLLOW_LPAREN_in_forControlStatement5935); 
            this.pushFollow(ES3Parser.FOLLOW_forControl_in_forControlStatement5938);
            forControl282=this.forControl();

            this.state._fsp--;

            this.adaptor.addChild(root_0, forControl282.getTree());
            RPAREN283=this.match(this.input,RPAREN,ES3Parser.FOLLOW_RPAREN_in_forControlStatement5940); 



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
    embeddedForControlStatement_return: (function() {
        ES3Parser.embeddedForControlStatement_return = function(){};
        org.antlr.lang.extend(ES3Parser.embeddedForControlStatement_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1914:1: embeddedForControlStatement : forControl EOF -> ^( FOR forControl ) ;
    // $ANTLR start "embeddedForControlStatement"
    embeddedForControlStatement: function() {
        var retval = new ES3Parser.embeddedForControlStatement_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var EOF285 = null;
         var forControl284 = null;

        var EOF285_tree=null;
        var stream_EOF=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token EOF");
        var stream_forControl=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule forControl");
        try {
            // ES3.g3:1915:2: ( forControl EOF -> ^( FOR forControl ) )
            // ES3.g3:1915:4: forControl EOF
            this.pushFollow(ES3Parser.FOLLOW_forControl_in_embeddedForControlStatement5951);
            forControl284=this.forControl();

            this.state._fsp--;

            stream_forControl.add(forControl284.getTree());
            EOF285=this.match(this.input,EOF,ES3Parser.FOLLOW_EOF_in_embeddedForControlStatement5953);  
            stream_EOF.add(EOF285);



            // AST REWRITE
            // elements: forControl
            // token labels: 
            // rule labels: retval
            // token list labels: 
            // rule list labels: 
            retval.tree = root_0;
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 1916:2: -> ^( FOR forControl )
            {
                // ES3.g3:1916:5: ^( FOR forControl )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(FOR, "FOR"), root_1);

                this.adaptor.addChild(root_1, stream_forControl.nextTree());

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;


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
    ifExpressionStatement_return: (function() {
        ES3Parser.ifExpressionStatement_return = function(){};
        org.antlr.lang.extend(ES3Parser.ifExpressionStatement_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1923:1: ifExpressionStatement : IF LPAREN expression RPAREN ;
    // $ANTLR start "ifExpressionStatement"
    ifExpressionStatement: function() {
        var retval = new ES3Parser.ifExpressionStatement_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var IF286 = null;
        var LPAREN287 = null;
        var RPAREN289 = null;
         var expression288 = null;

        var IF286_tree=null;
        var LPAREN287_tree=null;
        var RPAREN289_tree=null;

        try {
            // ES3.g3:1924:2: ( IF LPAREN expression RPAREN )
            // ES3.g3:1924:4: IF LPAREN expression RPAREN
            root_0 = this.adaptor.nil();

            IF286=this.match(this.input,IF,ES3Parser.FOLLOW_IF_in_ifExpressionStatement5974); 
            IF286_tree = this.adaptor.create(IF286);
            root_0 = this.adaptor.becomeRoot(IF286_tree, root_0);

            LPAREN287=this.match(this.input,LPAREN,ES3Parser.FOLLOW_LPAREN_in_ifExpressionStatement5977); 
            this.pushFollow(ES3Parser.FOLLOW_expression_in_ifExpressionStatement5980);
            expression288=this.expression();

            this.state._fsp--;

            this.adaptor.addChild(root_0, expression288.getTree());
            RPAREN289=this.match(this.input,RPAREN,ES3Parser.FOLLOW_RPAREN_in_ifExpressionStatement5982); 



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
    embeddedIfExpressionFragment_return: (function() {
        ES3Parser.embeddedIfExpressionFragment_return = function(){};
        org.antlr.lang.extend(ES3Parser.embeddedIfExpressionFragment_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1926:1: embeddedIfExpressionFragment : expression EOF -> ^( IF expression ) ;
    // $ANTLR start "embeddedIfExpressionFragment"
    embeddedIfExpressionFragment: function() {
        var retval = new ES3Parser.embeddedIfExpressionFragment_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var EOF291 = null;
         var expression290 = null;

        var EOF291_tree=null;
        var stream_EOF=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token EOF");
        var stream_expression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule expression");
        try {
            // ES3.g3:1927:2: ( expression EOF -> ^( IF expression ) )
            // ES3.g3:1927:4: expression EOF
            this.pushFollow(ES3Parser.FOLLOW_expression_in_embeddedIfExpressionFragment5993);
            expression290=this.expression();

            this.state._fsp--;

            stream_expression.add(expression290.getTree());
            EOF291=this.match(this.input,EOF,ES3Parser.FOLLOW_EOF_in_embeddedIfExpressionFragment5995);  
            stream_EOF.add(EOF291);



            // AST REWRITE
            // elements: expression
            // token labels: 
            // rule labels: retval
            // token list labels: 
            // rule list labels: 
            retval.tree = root_0;
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 1928:2: -> ^( IF expression )
            {
                // ES3.g3:1928:5: ^( IF expression )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(IF, "IF"), root_1);

                this.adaptor.addChild(root_1, stream_expression.nextTree());

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;


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
    renderControlStatement_return: (function() {
        ES3Parser.renderControlStatement_return = function(){};
        org.antlr.lang.extend(ES3Parser.renderControlStatement_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1937:1: renderControlStatement : RENDER LPAREN callParam COMMA callParam ( COMMA callData )? RPAREN -> ^( RENDER callParam callParam ( callData )? ) ;
    // $ANTLR start "renderControlStatement"
    renderControlStatement: function() {
        var retval = new ES3Parser.renderControlStatement_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var RENDER292 = null;
        var LPAREN293 = null;
        var COMMA295 = null;
        var COMMA297 = null;
        var RPAREN299 = null;
         var callParam294 = null;
         var callParam296 = null;
         var callData298 = null;

        var RENDER292_tree=null;
        var LPAREN293_tree=null;
        var COMMA295_tree=null;
        var COMMA297_tree=null;
        var RPAREN299_tree=null;
        var stream_COMMA=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token COMMA");
        var stream_RENDER=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token RENDER");
        var stream_LPAREN=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token LPAREN");
        var stream_RPAREN=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token RPAREN");
        var stream_callParam=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule callParam");
        var stream_callData=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule callData");
        try {
            // ES3.g3:1938:2: ( RENDER LPAREN callParam COMMA callParam ( COMMA callData )? RPAREN -> ^( RENDER callParam callParam ( callData )? ) )
            // ES3.g3:1938:4: RENDER LPAREN callParam COMMA callParam ( COMMA callData )? RPAREN
            RENDER292=this.match(this.input,RENDER,ES3Parser.FOLLOW_RENDER_in_renderControlStatement6016);  
            stream_RENDER.add(RENDER292);

            LPAREN293=this.match(this.input,LPAREN,ES3Parser.FOLLOW_LPAREN_in_renderControlStatement6018);  
            stream_LPAREN.add(LPAREN293);

            this.pushFollow(ES3Parser.FOLLOW_callParam_in_renderControlStatement6020);
            callParam294=this.callParam();

            this.state._fsp--;

            stream_callParam.add(callParam294.getTree());
            COMMA295=this.match(this.input,COMMA,ES3Parser.FOLLOW_COMMA_in_renderControlStatement6022);  
            stream_COMMA.add(COMMA295);

            this.pushFollow(ES3Parser.FOLLOW_callParam_in_renderControlStatement6024);
            callParam296=this.callParam();

            this.state._fsp--;

            stream_callParam.add(callParam296.getTree());
            // ES3.g3:1938:44: ( COMMA callData )?
            var alt75=2;
            var LA75_0 = this.input.LA(1);

            if ( (LA75_0==COMMA) ) {
                alt75=1;
            }
            switch (alt75) {
                case 1 :
                    // ES3.g3:1938:45: COMMA callData
                    COMMA297=this.match(this.input,COMMA,ES3Parser.FOLLOW_COMMA_in_renderControlStatement6027);  
                    stream_COMMA.add(COMMA297);

                    this.pushFollow(ES3Parser.FOLLOW_callData_in_renderControlStatement6029);
                    callData298=this.callData();

                    this.state._fsp--;

                    stream_callData.add(callData298.getTree());


                    break;

            }

            RPAREN299=this.match(this.input,RPAREN,ES3Parser.FOLLOW_RPAREN_in_renderControlStatement6033);  
            stream_RPAREN.add(RPAREN299);



            // AST REWRITE
            // elements: callData, RENDER, callParam, callParam
            // token labels: 
            // rule labels: retval
            // token list labels: 
            // rule list labels: 
            retval.tree = root_0;
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 1939:2: -> ^( RENDER callParam callParam ( callData )? )
            {
                // ES3.g3:1939:5: ^( RENDER callParam callParam ( callData )? )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(stream_RENDER.nextNode(), root_1);

                this.adaptor.addChild(root_1, stream_callParam.nextTree());
                this.adaptor.addChild(root_1, stream_callParam.nextTree());
                // ES3.g3:1939:35: ( callData )?
                if ( stream_callData.hasNext() ) {
                    this.adaptor.addChild(root_1, stream_callData.nextTree());

                }
                stream_callData.reset();

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;


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
    embeddedRenderControlStatement_return: (function() {
        ES3Parser.embeddedRenderControlStatement_return = function(){};
        org.antlr.lang.extend(ES3Parser.embeddedRenderControlStatement_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1946:1: embeddedRenderControlStatement : callParam COMMA callParam ( COMMA callData )? EOF -> ^( RENDER callParam callParam ( callData )? ) ;
    // $ANTLR start "embeddedRenderControlStatement"
    embeddedRenderControlStatement: function() {
        var retval = new ES3Parser.embeddedRenderControlStatement_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var COMMA301 = null;
        var COMMA303 = null;
        var EOF305 = null;
         var callParam300 = null;
         var callParam302 = null;
         var callData304 = null;

        var COMMA301_tree=null;
        var COMMA303_tree=null;
        var EOF305_tree=null;
        var stream_COMMA=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token COMMA");
        var stream_EOF=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token EOF");
        var stream_callParam=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule callParam");
        var stream_callData=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule callData");
        try {
            // ES3.g3:1947:2: ( callParam COMMA callParam ( COMMA callData )? EOF -> ^( RENDER callParam callParam ( callData )? ) )
            // ES3.g3:1947:4: callParam COMMA callParam ( COMMA callData )? EOF
            this.pushFollow(ES3Parser.FOLLOW_callParam_in_embeddedRenderControlStatement6060);
            callParam300=this.callParam();

            this.state._fsp--;

            stream_callParam.add(callParam300.getTree());
            COMMA301=this.match(this.input,COMMA,ES3Parser.FOLLOW_COMMA_in_embeddedRenderControlStatement6062);  
            stream_COMMA.add(COMMA301);

            this.pushFollow(ES3Parser.FOLLOW_callParam_in_embeddedRenderControlStatement6064);
            callParam302=this.callParam();

            this.state._fsp--;

            stream_callParam.add(callParam302.getTree());
            // ES3.g3:1947:30: ( COMMA callData )?
            var alt76=2;
            var LA76_0 = this.input.LA(1);

            if ( (LA76_0==COMMA) ) {
                alt76=1;
            }
            switch (alt76) {
                case 1 :
                    // ES3.g3:1947:31: COMMA callData
                    COMMA303=this.match(this.input,COMMA,ES3Parser.FOLLOW_COMMA_in_embeddedRenderControlStatement6067);  
                    stream_COMMA.add(COMMA303);

                    this.pushFollow(ES3Parser.FOLLOW_callData_in_embeddedRenderControlStatement6069);
                    callData304=this.callData();

                    this.state._fsp--;

                    stream_callData.add(callData304.getTree());


                    break;

            }

            EOF305=this.match(this.input,EOF,ES3Parser.FOLLOW_EOF_in_embeddedRenderControlStatement6073);  
            stream_EOF.add(EOF305);



            // AST REWRITE
            // elements: callParam, callParam, callData
            // token labels: 
            // rule labels: retval
            // token list labels: 
            // rule list labels: 
            retval.tree = root_0;
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 1948:2: -> ^( RENDER callParam callParam ( callData )? )
            {
                // ES3.g3:1948:5: ^( RENDER callParam callParam ( callData )? )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(RENDER, "RENDER"), root_1);

                this.adaptor.addChild(root_1, stream_callParam.nextTree());
                this.adaptor.addChild(root_1, stream_callParam.nextTree());
                // ES3.g3:1948:35: ( callData )?
                if ( stream_callData.hasNext() ) {
                    this.adaptor.addChild(root_1, stream_callData.nextTree());

                }
                stream_callData.reset();

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;


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
    embeddedCallStatement_return: (function() {
        ES3Parser.embeddedCallStatement_return = function(){};
        org.antlr.lang.extend(ES3Parser.embeddedCallStatement_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1953:1: embeddedCallStatement : callParam EOF -> ^( ARGS callParam ) ;
    // $ANTLR start "embeddedCallStatement"
    embeddedCallStatement: function() {
        var retval = new ES3Parser.embeddedCallStatement_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var EOF307 = null;
         var callParam306 = null;

        var EOF307_tree=null;
        var stream_EOF=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token EOF");
        var stream_callParam=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule callParam");
        try {
            // ES3.g3:1954:2: ( callParam EOF -> ^( ARGS callParam ) )
            // ES3.g3:1954:4: callParam EOF
            this.pushFollow(ES3Parser.FOLLOW_callParam_in_embeddedCallStatement6100);
            callParam306=this.callParam();

            this.state._fsp--;

            stream_callParam.add(callParam306.getTree());
            EOF307=this.match(this.input,EOF,ES3Parser.FOLLOW_EOF_in_embeddedCallStatement6102);  
            stream_EOF.add(EOF307);



            // AST REWRITE
            // elements: callParam
            // token labels: 
            // rule labels: retval
            // token list labels: 
            // rule list labels: 
            retval.tree = root_0;
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 1955:2: -> ^( ARGS callParam )
            {
                // ES3.g3:1955:5: ^( ARGS callParam )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(ARGS, "ARGS"), root_1);

                this.adaptor.addChild(root_1, stream_callParam.nextTree());

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;


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
    embeddedDataCallStatement_return: (function() {
        ES3Parser.embeddedDataCallStatement_return = function(){};
        org.antlr.lang.extend(ES3Parser.embeddedDataCallStatement_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1961:1: embeddedDataCallStatement : callParam ( COMMA callData )? EOF -> ^( ARGS callParam ( callData )? ) ;
    // $ANTLR start "embeddedDataCallStatement"
    embeddedDataCallStatement: function() {
        var retval = new ES3Parser.embeddedDataCallStatement_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var COMMA309 = null;
        var EOF311 = null;
         var callParam308 = null;
         var callData310 = null;

        var COMMA309_tree=null;
        var EOF311_tree=null;
        var stream_COMMA=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token COMMA");
        var stream_EOF=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token EOF");
        var stream_callParam=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule callParam");
        var stream_callData=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule callData");
        try {
            // ES3.g3:1962:2: ( callParam ( COMMA callData )? EOF -> ^( ARGS callParam ( callData )? ) )
            // ES3.g3:1962:4: callParam ( COMMA callData )? EOF
            this.pushFollow(ES3Parser.FOLLOW_callParam_in_embeddedDataCallStatement6126);
            callParam308=this.callParam();

            this.state._fsp--;

            stream_callParam.add(callParam308.getTree());
            // ES3.g3:1962:14: ( COMMA callData )?
            var alt77=2;
            var LA77_0 = this.input.LA(1);

            if ( (LA77_0==COMMA) ) {
                alt77=1;
            }
            switch (alt77) {
                case 1 :
                    // ES3.g3:1962:15: COMMA callData
                    COMMA309=this.match(this.input,COMMA,ES3Parser.FOLLOW_COMMA_in_embeddedDataCallStatement6129);  
                    stream_COMMA.add(COMMA309);

                    this.pushFollow(ES3Parser.FOLLOW_callData_in_embeddedDataCallStatement6131);
                    callData310=this.callData();

                    this.state._fsp--;

                    stream_callData.add(callData310.getTree());


                    break;

            }

            EOF311=this.match(this.input,EOF,ES3Parser.FOLLOW_EOF_in_embeddedDataCallStatement6135);  
            stream_EOF.add(EOF311);



            // AST REWRITE
            // elements: callParam, callData
            // token labels: 
            // rule labels: retval
            // token list labels: 
            // rule list labels: 
            retval.tree = root_0;
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 1963:2: -> ^( ARGS callParam ( callData )? )
            {
                // ES3.g3:1963:5: ^( ARGS callParam ( callData )? )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(ARGS, "ARGS"), root_1);

                this.adaptor.addChild(root_1, stream_callParam.nextTree());
                // ES3.g3:1963:23: ( callData )?
                if ( stream_callData.hasNext() ) {
                    this.adaptor.addChild(root_1, stream_callData.nextTree());

                }
                stream_callData.reset();

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;


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
    embeddedControllerCallStatement_return: (function() {
        ES3Parser.embeddedControllerCallStatement_return = function(){};
        org.antlr.lang.extend(ES3Parser.embeddedControllerCallStatement_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1968:1: embeddedControllerCallStatement : callParam COMMA callParam EOF -> ^( ARGS callParam callParam ) ;
    // $ANTLR start "embeddedControllerCallStatement"
    embeddedControllerCallStatement: function() {
        var retval = new ES3Parser.embeddedControllerCallStatement_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var COMMA313 = null;
        var EOF315 = null;
         var callParam312 = null;
         var callParam314 = null;

        var COMMA313_tree=null;
        var EOF315_tree=null;
        var stream_COMMA=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token COMMA");
        var stream_EOF=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token EOF");
        var stream_callParam=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule callParam");
        try {
            // ES3.g3:1969:2: ( callParam COMMA callParam EOF -> ^( ARGS callParam callParam ) )
            // ES3.g3:1969:4: callParam COMMA callParam EOF
            this.pushFollow(ES3Parser.FOLLOW_callParam_in_embeddedControllerCallStatement6160);
            callParam312=this.callParam();

            this.state._fsp--;

            stream_callParam.add(callParam312.getTree());
            COMMA313=this.match(this.input,COMMA,ES3Parser.FOLLOW_COMMA_in_embeddedControllerCallStatement6162);  
            stream_COMMA.add(COMMA313);

            this.pushFollow(ES3Parser.FOLLOW_callParam_in_embeddedControllerCallStatement6164);
            callParam314=this.callParam();

            this.state._fsp--;

            stream_callParam.add(callParam314.getTree());
            EOF315=this.match(this.input,EOF,ES3Parser.FOLLOW_EOF_in_embeddedControllerCallStatement6166);  
            stream_EOF.add(EOF315);



            // AST REWRITE
            // elements: callParam, callParam
            // token labels: 
            // rule labels: retval
            // token list labels: 
            // rule list labels: 
            retval.tree = root_0;
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 1970:2: -> ^( ARGS callParam callParam )
            {
                // ES3.g3:1970:5: ^( ARGS callParam callParam )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(ARGS, "ARGS"), root_1);

                this.adaptor.addChild(root_1, stream_callParam.nextTree());
                this.adaptor.addChild(root_1, stream_callParam.nextTree());

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;


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
    embeddedControllerDataCallStatement_return: (function() {
        ES3Parser.embeddedControllerDataCallStatement_return = function(){};
        org.antlr.lang.extend(ES3Parser.embeddedControllerDataCallStatement_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1975:1: embeddedControllerDataCallStatement : callParam COMMA callParam ( COMMA callData )? EOF -> ^( ARGS callParam callParam ( callData )? ) ;
    // $ANTLR start "embeddedControllerDataCallStatement"
    embeddedControllerDataCallStatement: function() {
        var retval = new ES3Parser.embeddedControllerDataCallStatement_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var COMMA317 = null;
        var COMMA319 = null;
        var EOF321 = null;
         var callParam316 = null;
         var callParam318 = null;
         var callData320 = null;

        var COMMA317_tree=null;
        var COMMA319_tree=null;
        var EOF321_tree=null;
        var stream_COMMA=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token COMMA");
        var stream_EOF=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token EOF");
        var stream_callParam=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule callParam");
        var stream_callData=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule callData");
        try {
            // ES3.g3:1976:2: ( callParam COMMA callParam ( COMMA callData )? EOF -> ^( ARGS callParam callParam ( callData )? ) )
            // ES3.g3:1976:4: callParam COMMA callParam ( COMMA callData )? EOF
            this.pushFollow(ES3Parser.FOLLOW_callParam_in_embeddedControllerDataCallStatement6190);
            callParam316=this.callParam();

            this.state._fsp--;

            stream_callParam.add(callParam316.getTree());
            COMMA317=this.match(this.input,COMMA,ES3Parser.FOLLOW_COMMA_in_embeddedControllerDataCallStatement6192);  
            stream_COMMA.add(COMMA317);

            this.pushFollow(ES3Parser.FOLLOW_callParam_in_embeddedControllerDataCallStatement6194);
            callParam318=this.callParam();

            this.state._fsp--;

            stream_callParam.add(callParam318.getTree());
            // ES3.g3:1976:30: ( COMMA callData )?
            var alt78=2;
            var LA78_0 = this.input.LA(1);

            if ( (LA78_0==COMMA) ) {
                alt78=1;
            }
            switch (alt78) {
                case 1 :
                    // ES3.g3:1976:31: COMMA callData
                    COMMA319=this.match(this.input,COMMA,ES3Parser.FOLLOW_COMMA_in_embeddedControllerDataCallStatement6197);  
                    stream_COMMA.add(COMMA319);

                    this.pushFollow(ES3Parser.FOLLOW_callData_in_embeddedControllerDataCallStatement6199);
                    callData320=this.callData();

                    this.state._fsp--;

                    stream_callData.add(callData320.getTree());


                    break;

            }

            EOF321=this.match(this.input,EOF,ES3Parser.FOLLOW_EOF_in_embeddedControllerDataCallStatement6203);  
            stream_EOF.add(EOF321);



            // AST REWRITE
            // elements: callData, callParam, callParam
            // token labels: 
            // rule labels: retval
            // token list labels: 
            // rule list labels: 
            retval.tree = root_0;
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 1977:2: -> ^( ARGS callParam callParam ( callData )? )
            {
                // ES3.g3:1977:5: ^( ARGS callParam callParam ( callData )? )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(ARGS, "ARGS"), root_1);

                this.adaptor.addChild(root_1, stream_callParam.nextTree());
                this.adaptor.addChild(root_1, stream_callParam.nextTree());
                // ES3.g3:1977:33: ( callData )?
                if ( stream_callData.hasNext() ) {
                    this.adaptor.addChild(root_1, stream_callData.nextTree());

                }
                stream_callData.reset();

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;


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
    embeddedStatementTail_return: (function() {
        ES3Parser.embeddedStatementTail_return = function(){};
        org.antlr.lang.extend(ES3Parser.embeddedStatementTail_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1982:1: embeddedStatementTail : statementTail EOF ;
    // $ANTLR start "embeddedStatementTail"
    embeddedStatementTail: function() {
        var retval = new ES3Parser.embeddedStatementTail_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var EOF323 = null;
         var statementTail322 = null;

        var EOF323_tree=null;

        try {
            // ES3.g3:1983:2: ( statementTail EOF )
            // ES3.g3:1983:4: statementTail EOF
            root_0 = this.adaptor.nil();

            this.pushFollow(ES3Parser.FOLLOW_statementTail_in_embeddedStatementTail6230);
            statementTail322=this.statementTail();

            this.state._fsp--;

            this.adaptor.addChild(root_0, statementTail322.getTree());
            EOF323=this.match(this.input,EOF,ES3Parser.FOLLOW_EOF_in_embeddedStatementTail6232); 
            EOF323_tree = this.adaptor.create(EOF323);
            this.adaptor.addChild(root_0, EOF323_tree);




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
    callParam_return: (function() {
        ES3Parser.callParam_return = function(){};
        org.antlr.lang.extend(ES3Parser.callParam_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1988:1: callParam : (amp= IdentifierNameAmpersatStart | id= Identifier | StringLiteral );
    // $ANTLR start "callParam"
    callParam: function() {
        var retval = new ES3Parser.callParam_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var amp = null;
        var id = null;
        var StringLiteral324 = null;

        var amp_tree=null;
        var id_tree=null;
        var StringLiteral324_tree=null;

        try {
            // ES3.g3:1989:2: (amp= IdentifierNameAmpersatStart | id= Identifier | StringLiteral )
            var alt79=3;
            switch ( this.input.LA(1) ) {
            case IdentifierNameAmpersatStart:
                alt79=1;
                break;
            case Identifier:
                alt79=2;
                break;
            case StringLiteral:
                alt79=3;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 79, 0, this.input);

                throw nvae;
            }

            switch (alt79) {
                case 1 :
                    // ES3.g3:1989:4: amp= IdentifierNameAmpersatStart
                    root_0 = this.adaptor.nil();

                    amp=this.match(this.input,IdentifierNameAmpersatStart,ES3Parser.FOLLOW_IdentifierNameAmpersatStart_in_callParam6246); 
                    amp_tree = this.adaptor.create(amp);
                    this.adaptor.addChild(root_0, amp_tree);

                     this.ampersatIdentifiers.push(amp); /*MODIFICATION: keep trac of additional special ampersat-Identifier */


                    break;
                case 2 :
                    // ES3.g3:1990:4: id= Identifier
                    root_0 = this.adaptor.nil();

                    id=this.match(this.input,Identifier,ES3Parser.FOLLOW_Identifier_in_callParam6255); 
                    id_tree = this.adaptor.create(id);
                    this.adaptor.addChild(root_0, id_tree);

                     this.ampersatIdentifiers.push(id); /*MODIFICATION: keep trac of identifiers ("interpreted" ampersat-Identifier) */


                    break;
                case 3 :
                    // ES3.g3:1991:4: StringLiteral
                    root_0 = this.adaptor.nil();

                    StringLiteral324=this.match(this.input,StringLiteral,ES3Parser.FOLLOW_StringLiteral_in_callParam6262); 
                    StringLiteral324_tree = this.adaptor.create(StringLiteral324);
                    this.adaptor.addChild(root_0, StringLiteral324_tree);



                    break;

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
    callData_return: (function() {
        ES3Parser.callData_return = function(){};
        org.antlr.lang.extend(ES3Parser.callData_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ES3.g3:1996:1: callData : ( objectLiteral | callParam | numericLiteral | booleanLiteral );
    // $ANTLR start "callData"
    callData: function() {
        var retval = new ES3Parser.callData_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

         var objectLiteral325 = null;
         var callParam326 = null;
         var numericLiteral327 = null;
         var booleanLiteral328 = null;


        try {
            // ES3.g3:1997:2: ( objectLiteral | callParam | numericLiteral | booleanLiteral )
            var alt80=4;
            switch ( this.input.LA(1) ) {
            case LBRACE:
                alt80=1;
                break;
            case Identifier:
            case StringLiteral:
            case IdentifierNameAmpersatStart:
                alt80=2;
                break;
            case DecimalLiteral:
            case OctalIntegerLiteral:
            case HexIntegerLiteral:
                alt80=3;
                break;
            case TRUE:
            case FALSE:
                alt80=4;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 80, 0, this.input);

                throw nvae;
            }

            switch (alt80) {
                case 1 :
                    // ES3.g3:1997:4: objectLiteral
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_objectLiteral_in_callData6276);
                    objectLiteral325=this.objectLiteral();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, objectLiteral325.getTree());


                    break;
                case 2 :
                    // ES3.g3:1997:20: callParam
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_callParam_in_callData6280);
                    callParam326=this.callParam();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, callParam326.getTree());


                    break;
                case 3 :
                    // ES3.g3:1997:32: numericLiteral
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_numericLiteral_in_callData6284);
                    numericLiteral327=this.numericLiteral();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, numericLiteral327.getTree());


                    break;
                case 4 :
                    // ES3.g3:1997:49: booleanLiteral
                    root_0 = this.adaptor.nil();

                    this.pushFollow(ES3Parser.FOLLOW_booleanLiteral_in_callData6288);
                    booleanLiteral328=this.booleanLiteral();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, booleanLiteral328.getTree());


                    break;

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

org.antlr.lang.augmentObject(ES3Parser, {
    DFA43_eotS:
        "\u0025\uffff",
    DFA43_eofS:
        "\u0025\uffff",
    DFA43_minS:
        "\u0001\u0006\u0001\u0000\u0023\uffff",
    DFA43_maxS:
        "\u0001\u00a4\u0001\u0000\u0023\uffff",
    DFA43_acceptS:
        "\u0002\uffff\u0001\u0002\u0021\uffff\u0001\u0001",
    DFA43_specialS:
        "\u0001\uffff\u0001\u0000\u0023\uffff}>",
    DFA43_transitionS: [
            "\u0004\u0002\u0002\uffff\u0001\u0002\u0001\uffff\u0002\u0002"+
            "\u0002\uffff\u0003\u0002\u0002\uffff\u000b\u0002\u001f\uffff"+
            "\u0001\u0001\u0001\uffff\u0001\u0002\u0002\uffff\u0001\u0002"+
            "\u0009\uffff\u0002\u0002\u0002\uffff\u0002\u0002\u0006\uffff"+
            "\u0002\u0002\u0036\uffff\u0002\u0002\u0005\uffff\u0002\u0002"+
            "\u0001\uffff\u0001\u0002\u0003\uffff\u0003\u0002",
            "\u0001\uffff",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
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

org.antlr.lang.augmentObject(ES3Parser, {
    DFA43_eot:
        org.antlr.runtime.DFA.unpackEncodedString(ES3Parser.DFA43_eotS),
    DFA43_eof:
        org.antlr.runtime.DFA.unpackEncodedString(ES3Parser.DFA43_eofS),
    DFA43_min:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(ES3Parser.DFA43_minS),
    DFA43_max:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(ES3Parser.DFA43_maxS),
    DFA43_accept:
        org.antlr.runtime.DFA.unpackEncodedString(ES3Parser.DFA43_acceptS),
    DFA43_special:
        org.antlr.runtime.DFA.unpackEncodedString(ES3Parser.DFA43_specialS),
    DFA43_transition: (function() {
        var a = [],
            i,
            numStates = ES3Parser.DFA43_transitionS.length;
        for (i=0; i<numStates; i++) {
            a.push(org.antlr.runtime.DFA.unpackEncodedString(ES3Parser.DFA43_transitionS[i]));
        }
        return a;
    })()
});

ES3Parser.DFA43 = function(recognizer) {
    this.recognizer = recognizer;
    this.decisionNumber = 43;
    this.eot = ES3Parser.DFA43_eot;
    this.eof = ES3Parser.DFA43_eof;
    this.min = ES3Parser.DFA43_min;
    this.max = ES3Parser.DFA43_max;
    this.accept = ES3Parser.DFA43_accept;
    this.special = ES3Parser.DFA43_special;
    this.transition = ES3Parser.DFA43_transition;
};

org.antlr.lang.extend(ES3Parser.DFA43, org.antlr.runtime.DFA, {
    getDescription: function() {
        return "1533:1: statement options {k=1; } : ({...}? block | statementTail );";
    },
    specialStateTransition: function(s, input) {
        var _s = s;
        /* bind to recognizer so semantic predicates can be evaluated */
        var retval = (function(s, input) {
            switch ( s ) {
                        case 0 : 
                            var LA43_1 = input.LA(1);

                             
                            var index43_1 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (( this.input.LA(1) == this.theParser.LBRACE )) ) {s = 36;}

                            else if ( (true) ) {s = 2;}

                             
                            input.seek(index43_1);
                            if ( s>=0 ) return s;
                            break;
            }
        }).call(this.recognizer, s, input);
        if (!org.antlr.lang.isUndefined(retval)) {
            return retval;
        }
        var nvae =
            new org.antlr.runtime.NoViableAltException(this.getDescription(), 43, _s, input);
        this.error(nvae);
        throw nvae;
    },
    dummy: null
});
org.antlr.lang.augmentObject(ES3Parser, {
    DFA44_eotS:
        "\u000f\uffff",
    DFA44_eofS:
        "\u0004\uffff\u0001\u0003\u000a\uffff",
    DFA44_minS:
        "\u0001\u0006\u0003\uffff\u0001\u0015\u000a\uffff",
    DFA44_maxS:
        "\u0001\u00a4\u0003\uffff\u0001\u009c\u000a\uffff",
    DFA44_acceptS:
        "\u0001\uffff\u0001\u0001\u0001\u0002\u0001\u0003\u0001\uffff\u0001"+
    "\u0004\u0001\u0005\u0001\u0006\u0001\u0007\u0001\u0008\u0001\u0009\u0001"+
    "\u000b\u0001\u000c\u0001\u000d\u0001\u000a",
    DFA44_specialS:
        "\u000f\uffff}>",
    DFA44_transitionS: [
            "\u0003\u0003\u0001\u0008\u0002\uffff\u0001\u0007\u0001\uffff"+
            "\u0001\u0003\u0001\u0006\u0002\uffff\u0001\u0006\u0001\u0003"+
            "\u0001\u0005\u0002\uffff\u0001\u0003\u0001\u0009\u0001\u000b"+
            "\u0001\u0003\u0001\u000c\u0001\u000d\u0001\u0003\u0001\u0001"+
            "\u0001\u0003\u0001\u0006\u0001\u000a\u001f\uffff\u0001\u0003"+
            "\u0001\uffff\u0001\u0003\u0002\uffff\u0001\u0002\u0009\uffff"+
            "\u0002\u0003\u0002\uffff\u0002\u0003\u0006\uffff\u0002\u0003"+
            "\u0036\uffff\u0001\u0004\u0001\u0003\u0005\uffff\u0002\u0003"+
            "\u0001\uffff\u0001\u0003\u0003\uffff\u0003\u0003",
            "",
            "",
            "",
            "\u0002\u0003\u002b\uffff\u0002\u0003\u0001\uffff\u0017\u0003"+
            "\u0002\uffff\u0003\u0003\u0001\u000e\u000d\u0003\u0022\uffff"+
            "\u0002\u0003\u0009\uffff\u0001\u0003",
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

org.antlr.lang.augmentObject(ES3Parser, {
    DFA44_eot:
        org.antlr.runtime.DFA.unpackEncodedString(ES3Parser.DFA44_eotS),
    DFA44_eof:
        org.antlr.runtime.DFA.unpackEncodedString(ES3Parser.DFA44_eofS),
    DFA44_min:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(ES3Parser.DFA44_minS),
    DFA44_max:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(ES3Parser.DFA44_maxS),
    DFA44_accept:
        org.antlr.runtime.DFA.unpackEncodedString(ES3Parser.DFA44_acceptS),
    DFA44_special:
        org.antlr.runtime.DFA.unpackEncodedString(ES3Parser.DFA44_specialS),
    DFA44_transition: (function() {
        var a = [],
            i,
            numStates = ES3Parser.DFA44_transitionS.length;
        for (i=0; i<numStates; i++) {
            a.push(org.antlr.runtime.DFA.unpackEncodedString(ES3Parser.DFA44_transitionS[i]));
        }
        return a;
    })()
});

ES3Parser.DFA44 = function(recognizer) {
    this.recognizer = recognizer;
    this.decisionNumber = 44;
    this.eot = ES3Parser.DFA44_eot;
    this.eof = ES3Parser.DFA44_eof;
    this.min = ES3Parser.DFA44_min;
    this.max = ES3Parser.DFA44_max;
    this.accept = ES3Parser.DFA44_accept;
    this.special = ES3Parser.DFA44_special;
    this.transition = ES3Parser.DFA44_transition;
};

org.antlr.lang.extend(ES3Parser.DFA44, org.antlr.runtime.DFA, {
    getDescription: function() {
        return "1542:1: statementTail : ( variableStatement | emptyStatement | expressionStatement | ifStatement | iterationStatement | continueStatement | breakStatement | returnStatement | withStatement | labelledStatement | switchStatement | throwStatement | tryStatement );";
    },
    dummy: null
});
org.antlr.lang.augmentObject(ES3Parser, {
    DFA74_eotS:
        "\u0025\uffff",
    DFA74_eofS:
        "\u0025\uffff",
    DFA74_minS:
        "\u0001\u0006\u0001\u0000\u0023\uffff",
    DFA74_maxS:
        "\u0001\u00a4\u0001\u0000\u0023\uffff",
    DFA74_acceptS:
        "\u0002\uffff\u0001\u0002\u0021\uffff\u0001\u0001",
    DFA74_specialS:
        "\u0001\uffff\u0001\u0000\u0023\uffff}>",
    DFA74_transitionS: [
            "\u0004\u0002\u0002\uffff\u0001\u0002\u0001\uffff\u0002\u0002"+
            "\u0002\uffff\u0001\u0002\u0001\u0001\u0001\u0002\u0002\uffff"+
            "\u000b\u0002\u001f\uffff\u0001\u0002\u0001\uffff\u0001\u0002"+
            "\u0002\uffff\u0001\u0002\u0009\uffff\u0002\u0002\u0002\uffff"+
            "\u0002\u0002\u0006\uffff\u0002\u0002\u0036\uffff\u0002\u0002"+
            "\u0005\uffff\u0002\u0002\u0001\uffff\u0001\u0002\u0003\uffff"+
            "\u0003\u0002",
            "\u0001\uffff",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
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

org.antlr.lang.augmentObject(ES3Parser, {
    DFA74_eot:
        org.antlr.runtime.DFA.unpackEncodedString(ES3Parser.DFA74_eotS),
    DFA74_eof:
        org.antlr.runtime.DFA.unpackEncodedString(ES3Parser.DFA74_eofS),
    DFA74_min:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(ES3Parser.DFA74_minS),
    DFA74_max:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(ES3Parser.DFA74_maxS),
    DFA74_accept:
        org.antlr.runtime.DFA.unpackEncodedString(ES3Parser.DFA74_acceptS),
    DFA74_special:
        org.antlr.runtime.DFA.unpackEncodedString(ES3Parser.DFA74_specialS),
    DFA74_transition: (function() {
        var a = [],
            i,
            numStates = ES3Parser.DFA74_transitionS.length;
        for (i=0; i<numStates; i++) {
            a.push(org.antlr.runtime.DFA.unpackEncodedString(ES3Parser.DFA74_transitionS[i]));
        }
        return a;
    })()
});

ES3Parser.DFA74 = function(recognizer) {
    this.recognizer = recognizer;
    this.decisionNumber = 74;
    this.eot = ES3Parser.DFA74_eot;
    this.eof = ES3Parser.DFA74_eof;
    this.min = ES3Parser.DFA74_min;
    this.max = ES3Parser.DFA74_max;
    this.accept = ES3Parser.DFA74_accept;
    this.special = ES3Parser.DFA74_special;
    this.transition = ES3Parser.DFA74_transition;
};

org.antlr.lang.extend(ES3Parser.DFA74, org.antlr.runtime.DFA, {
    getDescription: function() {
        return "1892:1: sourceElement options {k=1; } : ({...}? functionDeclaration | statement );";
    },
    specialStateTransition: function(s, input) {
        var _s = s;
        /* bind to recognizer so semantic predicates can be evaluated */
        var retval = (function(s, input) {
            switch ( s ) {
                        case 0 : 
                            var LA74_1 = input.LA(1);

                             
                            var index74_1 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (( this.input.LA(1) == this.theParser.FUNCTION )) ) {s = 36;}

                            else if ( (true) ) {s = 2;}

                             
                            input.seek(index74_1);
                            if ( s>=0 ) return s;
                            break;
            }
        }).call(this.recognizer, s, input);
        if (!org.antlr.lang.isUndefined(retval)) {
            return retval;
        }
        var nvae =
            new org.antlr.runtime.NoViableAltException(this.getDescription(), 74, _s, input);
        this.error(nvae);
        throw nvae;
    },
    dummy: null
});
 

// public class variables
org.antlr.lang.augmentObject(ES3Parser, {
    tokenNames: ["<invalid>", "<EOR>", "<DOWN>", "<UP>", "RENDER", "AMPERSAT", "NULL", "TRUE", "FALSE", "BREAK", "CASE", "CATCH", "CONTINUE", "DEFAULT", "DELETE", "DO", "ELSE", "FINALLY", "FOR", "FUNCTION", "IF", "IN", "INSTANCEOF", "NEW", "RETURN", "SWITCH", "THIS", "THROW", "TRY", "TYPEOF", "VAR", "VOID", "WHILE", "WITH", "ABSTRACT", "BOOLEAN", "BYTE", "CHAR", "CLASS", "CONST", "DEBUGGER", "DOUBLE", "ENUM", "EXPORT", "EXTENDS", "FINAL", "FLOAT", "GOTO", "IMPLEMENTS", "IMPORT", "INT", "INTERFACE", "LONG", "NATIVE", "PACKAGE", "PRIVATE", "PROTECTED", "PUBLIC", "SHORT", "STATIC", "SUPER", "SYNCHRONIZED", "THROWS", "TRANSIENT", "VOLATILE", "LBRACE", "RBRACE", "LBRACK", "RBRACK", "DOT", "SEMIC", "COMMA", "LT", "GT", "LTE", "GTE", "EQ", "NEQ", "SAME", "NSAME", "ADD", "SUB", "MUL", "MOD", "INC", "DEC", "SHL", "SHR", "SHU", "AND", "OR", "XOR", "NOT", "INV", "LAND", "LOR", "QUE", "COLON", "ASSIGN", "ADDASS", "SUBASS", "MULASS", "MODASS", "SHLASS", "SHRASS", "SHUASS", "ANDASS", "ORASS", "XORASS", "DIV", "DIVASS", "ARGS", "ARRAY", "BLOCK", "BYFIELD", "BYINDEX", "CALL", "CEXPR", "EXPR", "FORITER", "FORSTEP", "ITEM", "LABELLED", "NAMEDVALUE", "NEG", "OBJECT", "PAREXPR", "PDEC", "PINC", "POS", "BSLASH", "DQUOTE", "SQUOTE", "TAB", "VT", "FF", "SP", "NBSP", "USP", "WhiteSpace", "LF", "CR", "LS", "PS", "LineTerminator", "EOL", "MultiLineComment", "SingleLineComment", "Identifier", "StringLiteral", "HexDigit", "IdentifierStartASCII", "DecimalDigit", "IdentifierPart", "IdentifierNameASCIIStart", "IdentifierNameAmpersatStart", "LPAREN", "RPAREN", "RegularExpressionLiteral", "OctalDigit", "ExponentPart", "DecimalIntegerLiteral", "DecimalLiteral", "OctalIntegerLiteral", "HexIntegerLiteral", "CharacterEscapeSequence", "ZeroToThree", "OctalEscapeSequence", "HexEscapeSequence", "UnicodeEscapeSequence", "EscapeSequence", "BackslashSequence", "RegularExpressionFirstChar", "RegularExpressionChar"],
    FOLLOW_reservedWord_in_token1735: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_Identifier_in_token1740: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_punctuator_in_token1745: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_numericLiteral_in_token1750: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_StringLiteral_in_token1755: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_keyword_in_reservedWord1768: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_futureReservedWord_in_reservedWord1773: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_NULL_in_reservedWord1778: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_booleanLiteral_in_reservedWord1783: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_set_in_keyword0: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_set_in_futureReservedWord0: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_set_in_punctuator0: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_NULL_in_literal2480: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_booleanLiteral_in_literal2485: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_numericLiteral_in_literal2490: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_StringLiteral_in_literal2495: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_RegularExpressionLiteral_in_literal2500: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_set_in_booleanLiteral0: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_set_in_numericLiteral0: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_THIS_in_primaryExpression3138: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_Identifier_in_primaryExpression3143: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_IdentifierNameAmpersatStart_in_primaryExpression3150: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_literal_in_primaryExpression3157: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_arrayLiteral_in_primaryExpression3162: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_objectLiteral_in_primaryExpression3167: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_LPAREN_in_primaryExpression3174: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_expression_in_primaryExpression3176: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x20000000, 0x00000000]),
    FOLLOW_RPAREN_in_primaryExpression3178: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_LBRACK_in_arrayLiteral3202: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033009A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_arrayItem_in_arrayLiteral3206: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000090, 0x00000000]),
    FOLLOW_COMMA_in_arrayLiteral3210: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033009A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_arrayItem_in_arrayLiteral3212: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000090, 0x00000000]),
    FOLLOW_RBRACK_in_arrayLiteral3220: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_assignmentExpression_in_arrayItem3248: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_LBRACE_in_objectLiteral3280: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000004, 0x00000000,0x00300000, 0x0000001C]),
    FOLLOW_nameValuePair_in_objectLiteral3284: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000084, 0x00000000]),
    FOLLOW_COMMA_in_objectLiteral3288: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x00300000, 0x0000001C]),
    FOLLOW_nameValuePair_in_objectLiteral3290: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000084, 0x00000000]),
    FOLLOW_RBRACE_in_objectLiteral3298: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_propertyName_in_nameValuePair3323: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000002]),
    FOLLOW_COLON_in_nameValuePair3325: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_assignmentExpression_in_nameValuePair3327: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_Identifier_in_propertyName3351: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_StringLiteral_in_propertyName3356: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_numericLiteral_in_propertyName3361: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_primaryExpression_in_memberExpression3379: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_functionExpression_in_memberExpression3384: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_newExpression_in_memberExpression3389: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_NEW_in_newExpression3400: new org.antlr.runtime.BitSet([0x048801C0, 0x00000000,0x0000000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_memberExpression_in_newExpression3403: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_LPAREN_in_arguments3416: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x78300000, 0x0000001C]),
    FOLLOW_assignmentExpression_in_arguments3420: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000080, 0x00000000,0x20000000, 0x00000000]),
    FOLLOW_COMMA_in_arguments3424: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_assignmentExpression_in_arguments3426: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000080, 0x00000000,0x20000000, 0x00000000]),
    FOLLOW_RPAREN_in_arguments3434: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_memberExpression_in_leftHandSideExpression3464: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00000028, 0x00000000,0x10000000, 0x00000000]),
    FOLLOW_arguments_in_leftHandSideExpression3480: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00000028, 0x00000000,0x10000000, 0x00000000]),
    FOLLOW_LBRACK_in_leftHandSideExpression3501: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_expression_in_leftHandSideExpression3503: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000010, 0x00000000]),
    FOLLOW_RBRACK_in_leftHandSideExpression3505: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00000028, 0x00000000,0x10000000, 0x00000000]),
    FOLLOW_DOT_in_leftHandSideExpression3524: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x00100000, 0x00000000]),
    FOLLOW_Identifier_in_leftHandSideExpression3526: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00000028, 0x00000000,0x10000000, 0x00000000]),
    FOLLOW_leftHandSideExpression_in_postfixExpression3561: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00300000, 0x00000000]),
    FOLLOW_postfixOperator_in_postfixExpression3567: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_INC_in_postfixOperator3585: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_DEC_in_postfixOperator3594: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_postfixExpression_in_unaryExpression3611: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_unaryOperator_in_unaryExpression3616: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_unaryExpression_in_unaryExpression3619: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_DELETE_in_unaryOperator3631: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_VOID_in_unaryOperator3636: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_TYPEOF_in_unaryOperator3641: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_INC_in_unaryOperator3646: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_DEC_in_unaryOperator3651: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_ADD_in_unaryOperator3658: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_SUB_in_unaryOperator3667: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_INV_in_unaryOperator3674: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_NOT_in_unaryOperator3679: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_unaryExpression_in_multiplicativeExpression3698: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x000C0000, 0x00002000]),
    FOLLOW_set_in_multiplicativeExpression3702: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_unaryExpression_in_multiplicativeExpression3717: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x000C0000, 0x00002000]),
    FOLLOW_multiplicativeExpression_in_additiveExpression3739: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00030000, 0x00000000]),
    FOLLOW_set_in_additiveExpression3743: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_multiplicativeExpression_in_additiveExpression3754: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00030000, 0x00000000]),
    FOLLOW_additiveExpression_in_shiftExpression3777: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x01C00000, 0x00000000]),
    FOLLOW_set_in_shiftExpression3781: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_additiveExpression_in_shiftExpression3796: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x01C00000, 0x00000000]),
    FOLLOW_shiftExpression_in_relationalExpression3819: new org.antlr.runtime.BitSet([0x00600002, 0x00000000,0x00000F00, 0x00000000]),
    FOLLOW_set_in_relationalExpression3823: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_shiftExpression_in_relationalExpression3850: new org.antlr.runtime.BitSet([0x00600002, 0x00000000,0x00000F00, 0x00000000]),
    FOLLOW_shiftExpression_in_relationalExpressionNoIn3868: new org.antlr.runtime.BitSet([0x00400002, 0x00000000,0x00000F00, 0x00000000]),
    FOLLOW_set_in_relationalExpressionNoIn3872: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_shiftExpression_in_relationalExpressionNoIn3895: new org.antlr.runtime.BitSet([0x00400002, 0x00000000,0x00000F00, 0x00000000]),
    FOLLOW_relationalExpression_in_equalityExpression3918: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x0000F000, 0x00000000]),
    FOLLOW_set_in_equalityExpression3922: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_relationalExpression_in_equalityExpression3941: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x0000F000, 0x00000000]),
    FOLLOW_relationalExpressionNoIn_in_equalityExpressionNoIn3959: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x0000F000, 0x00000000]),
    FOLLOW_set_in_equalityExpressionNoIn3963: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_relationalExpressionNoIn_in_equalityExpressionNoIn3982: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x0000F000, 0x00000000]),
    FOLLOW_equalityExpression_in_bitwiseANDExpression4006: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x02000000, 0x00000000]),
    FOLLOW_AND_in_bitwiseANDExpression4010: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_equalityExpression_in_bitwiseANDExpression4013: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x02000000, 0x00000000]),
    FOLLOW_equalityExpressionNoIn_in_bitwiseANDExpressionNoIn4031: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x02000000, 0x00000000]),
    FOLLOW_AND_in_bitwiseANDExpressionNoIn4035: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_equalityExpressionNoIn_in_bitwiseANDExpressionNoIn4038: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x02000000, 0x00000000]),
    FOLLOW_bitwiseANDExpression_in_bitwiseXORExpression4058: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x08000000, 0x00000000]),
    FOLLOW_XOR_in_bitwiseXORExpression4062: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_bitwiseANDExpression_in_bitwiseXORExpression4065: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x08000000, 0x00000000]),
    FOLLOW_bitwiseANDExpressionNoIn_in_bitwiseXORExpressionNoIn4085: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x08000000, 0x00000000]),
    FOLLOW_XOR_in_bitwiseXORExpressionNoIn4089: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_bitwiseANDExpressionNoIn_in_bitwiseXORExpressionNoIn4092: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x08000000, 0x00000000]),
    FOLLOW_bitwiseXORExpression_in_bitwiseORExpression4111: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x04000000, 0x00000000]),
    FOLLOW_OR_in_bitwiseORExpression4115: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_bitwiseXORExpression_in_bitwiseORExpression4118: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x04000000, 0x00000000]),
    FOLLOW_bitwiseXORExpressionNoIn_in_bitwiseORExpressionNoIn4137: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x04000000, 0x00000000]),
    FOLLOW_OR_in_bitwiseORExpressionNoIn4141: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_bitwiseXORExpressionNoIn_in_bitwiseORExpressionNoIn4144: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x04000000, 0x00000000]),
    FOLLOW_bitwiseORExpression_in_logicalANDExpression4167: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x40000000, 0x00000000]),
    FOLLOW_LAND_in_logicalANDExpression4171: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_bitwiseORExpression_in_logicalANDExpression4174: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x40000000, 0x00000000]),
    FOLLOW_bitwiseORExpressionNoIn_in_logicalANDExpressionNoIn4192: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x40000000, 0x00000000]),
    FOLLOW_LAND_in_logicalANDExpressionNoIn4196: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_bitwiseORExpressionNoIn_in_logicalANDExpressionNoIn4199: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x40000000, 0x00000000]),
    FOLLOW_logicalANDExpression_in_logicalORExpression4218: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x80000000, 0x00000000]),
    FOLLOW_LOR_in_logicalORExpression4222: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_logicalANDExpression_in_logicalORExpression4225: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x80000000, 0x00000000]),
    FOLLOW_logicalANDExpressionNoIn_in_logicalORExpressionNoIn4244: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x80000000, 0x00000000]),
    FOLLOW_LOR_in_logicalORExpressionNoIn4248: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_logicalANDExpressionNoIn_in_logicalORExpressionNoIn4251: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x80000000, 0x00000000]),
    FOLLOW_logicalORExpression_in_conditionalExpression4274: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00000000, 0x00000001]),
    FOLLOW_QUE_in_conditionalExpression4278: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_assignmentExpression_in_conditionalExpression4281: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000002]),
    FOLLOW_COLON_in_conditionalExpression4283: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_assignmentExpression_in_conditionalExpression4286: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_logicalORExpressionNoIn_in_conditionalExpressionNoIn4304: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00000000, 0x00000001]),
    FOLLOW_QUE_in_conditionalExpressionNoIn4308: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_assignmentExpressionNoIn_in_conditionalExpressionNoIn4311: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000002]),
    FOLLOW_COLON_in_conditionalExpressionNoIn4313: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_assignmentExpressionNoIn_in_conditionalExpressionNoIn4316: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_conditionalExpression_in_assignmentExpression4344: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00000000, 0x00005FFC]),
    FOLLOW_assignmentOperator_in_assignmentExpression4351: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_assignmentExpression_in_assignmentExpression4354: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_set_in_assignmentOperator0: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_conditionalExpressionNoIn_in_assignmentExpressionNoIn4431: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00000000, 0x00005FFC]),
    FOLLOW_assignmentOperator_in_assignmentExpressionNoIn4438: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_assignmentExpressionNoIn_in_assignmentExpressionNoIn4441: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_assignmentExpression_in_expression4463: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00000080, 0x00000000]),
    FOLLOW_COMMA_in_expression4467: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_assignmentExpression_in_expression4471: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00000080, 0x00000000]),
    FOLLOW_assignmentExpressionNoIn_in_expressionNoIn4508: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00000080, 0x00000000]),
    FOLLOW_COMMA_in_expressionNoIn4512: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_assignmentExpressionNoIn_in_expressionNoIn4516: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00000080, 0x00000000]),
    FOLLOW_SEMIC_in_semic4567: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_EOF_in_semic4572: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_RBRACE_in_semic4577: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_EOL_in_semic4584: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_MultiLineComment_in_semic4588: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_block_in_statement4617: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_statementTail_in_statement4622: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_variableStatement_in_statementTail4634: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_emptyStatement_in_statementTail4639: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_expressionStatement_in_statementTail4644: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_ifStatement_in_statementTail4649: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_iterationStatement_in_statementTail4654: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_continueStatement_in_statementTail4659: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_breakStatement_in_statementTail4664: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_returnStatement_in_statementTail4669: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_withStatement_in_statementTail4674: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_labelledStatement_in_statementTail4679: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_switchStatement_in_statementTail4684: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_throwStatement_in_statementTail4689: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_tryStatement_in_statementTail4694: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_LBRACE_in_block4709: new org.antlr.runtime.BitSet([0xFF9CD3C0, 0x00000003,0x3033004E, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_statement_in_block4711: new org.antlr.runtime.BitSet([0xFF9CD3C0, 0x00000003,0x3033004E, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_RBRACE_in_block4714: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_VAR_in_variableStatement4743: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x00100000, 0x00000000]),
    FOLLOW_variableDeclaration_in_variableStatement4745: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x000000C4, 0x00000000,0x00060000, 0x00000000]),
    FOLLOW_COMMA_in_variableStatement4749: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x00100000, 0x00000000]),
    FOLLOW_variableDeclaration_in_variableStatement4751: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x000000C4, 0x00000000,0x00060000, 0x00000000]),
    FOLLOW_semic_in_variableStatement4756: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_Identifier_in_variableDeclaration4779: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00000000, 0x00000004]),
    FOLLOW_ASSIGN_in_variableDeclaration4783: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_assignmentExpression_in_variableDeclaration4786: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_Identifier_in_variableDeclarationNoIn4801: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00000000, 0x00000004]),
    FOLLOW_ASSIGN_in_variableDeclarationNoIn4805: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_assignmentExpressionNoIn_in_variableDeclarationNoIn4808: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_SEMIC_in_emptyStatement4827: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_expression_in_expressionStatement4846: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x000000C4, 0x00000000,0x00060000, 0x00000000]),
    FOLLOW_semic_in_expressionStatement4848: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_IF_in_ifStatement4866: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x10000000, 0x00000000]),
    FOLLOW_LPAREN_in_ifStatement4868: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_expression_in_ifStatement4870: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x20000000, 0x00000000]),
    FOLLOW_RPAREN_in_ifStatement4872: new org.antlr.runtime.BitSet([0xFF9CD3C0, 0x00000003,0x3033004A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_statement_in_ifStatement4874: new org.antlr.runtime.BitSet([0x00010002, 0x00000000]),
    FOLLOW_ELSE_in_ifStatement4880: new org.antlr.runtime.BitSet([0xFF9CD3C0, 0x00000003,0x3033004A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_statement_in_ifStatement4882: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_doStatement_in_iterationStatement4915: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_whileStatement_in_iterationStatement4920: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_forStatement_in_iterationStatement4925: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_DO_in_doStatement4937: new org.antlr.runtime.BitSet([0xFF9CD3C0, 0x00000003,0x3033004A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_statement_in_doStatement4939: new org.antlr.runtime.BitSet([0x00000000, 0x00000001]),
    FOLLOW_WHILE_in_doStatement4941: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x10000000, 0x00000000]),
    FOLLOW_LPAREN_in_doStatement4943: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_expression_in_doStatement4945: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x20000000, 0x00000000]),
    FOLLOW_RPAREN_in_doStatement4947: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x000000C4, 0x00000000,0x00060000, 0x00000000]),
    FOLLOW_semic_in_doStatement4949: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_WHILE_in_whileStatement4974: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x10000000, 0x00000000]),
    FOLLOW_LPAREN_in_whileStatement4977: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_expression_in_whileStatement4980: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x20000000, 0x00000000]),
    FOLLOW_RPAREN_in_whileStatement4982: new org.antlr.runtime.BitSet([0xFF9CD3C0, 0x00000003,0x3033004A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_statement_in_whileStatement4985: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_FOR_in_forStatement4998: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x10000000, 0x00000000]),
    FOLLOW_LPAREN_in_forStatement5001: new org.antlr.runtime.BitSet([0xE48841C0, 0x00000000,0x3033004A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_forControl_in_forStatement5004: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x20000000, 0x00000000]),
    FOLLOW_RPAREN_in_forStatement5006: new org.antlr.runtime.BitSet([0xFF9CD3C0, 0x00000003,0x3033004A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_statement_in_forStatement5009: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_forControlVar_in_forControl5021: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_forControlExpression_in_forControl5026: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_forControlSemic_in_forControl5031: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_VAR_in_forControlVar5042: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x00100000, 0x00000000]),
    FOLLOW_variableDeclarationNoIn_in_forControlVar5044: new org.antlr.runtime.BitSet([0x00200000, 0x00000000,0x000000C0, 0x00000000]),
    FOLLOW_IN_in_forControlVar5056: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_expression_in_forControlVar5058: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_COMMA_in_forControlVar5104: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x00100000, 0x00000000]),
    FOLLOW_variableDeclarationNoIn_in_forControlVar5106: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x000000C0, 0x00000000]),
    FOLLOW_SEMIC_in_forControlVar5111: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033004A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_expression_in_forControlVar5115: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000040, 0x00000000]),
    FOLLOW_SEMIC_in_forControlVar5118: new org.antlr.runtime.BitSet([0xA48841C2, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_expression_in_forControlVar5122: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_expressionNoIn_in_forControlExpression5188: new org.antlr.runtime.BitSet([0x00200000, 0x00000000,0x00000040, 0x00000000]),
    FOLLOW_IN_in_forControlExpression5203: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_expression_in_forControlExpression5207: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_SEMIC_in_forControlExpression5253: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033004A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_expression_in_forControlExpression5257: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000040, 0x00000000]),
    FOLLOW_SEMIC_in_forControlExpression5260: new org.antlr.runtime.BitSet([0xA48841C2, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_expression_in_forControlExpression5264: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_SEMIC_in_forControlSemic5323: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033004A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_expression_in_forControlSemic5327: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000040, 0x00000000]),
    FOLLOW_SEMIC_in_forControlSemic5330: new org.antlr.runtime.BitSet([0xA48841C2, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_expression_in_forControlSemic5334: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_CONTINUE_in_continueStatement5388: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x000000C4, 0x00000000,0x00160000, 0x00000000]),
    FOLLOW_Identifier_in_continueStatement5393: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x000000C4, 0x00000000,0x00060000, 0x00000000]),
    FOLLOW_semic_in_continueStatement5396: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_BREAK_in_breakStatement5415: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x000000C4, 0x00000000,0x00160000, 0x00000000]),
    FOLLOW_Identifier_in_breakStatement5420: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x000000C4, 0x00000000,0x00060000, 0x00000000]),
    FOLLOW_semic_in_breakStatement5423: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_RETURN_in_returnStatement5442: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x303300CE, 0x00000000,0x58360000, 0x0000001C]),
    FOLLOW_expression_in_returnStatement5447: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x000000C4, 0x00000000,0x00060000, 0x00000000]),
    FOLLOW_semic_in_returnStatement5450: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_WITH_in_withStatement5467: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x10000000, 0x00000000]),
    FOLLOW_LPAREN_in_withStatement5470: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_expression_in_withStatement5473: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x20000000, 0x00000000]),
    FOLLOW_RPAREN_in_withStatement5475: new org.antlr.runtime.BitSet([0xFF9CD3C0, 0x00000003,0x3033004A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_statement_in_withStatement5478: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_SWITCH_in_switchStatement5499: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x10000000, 0x00000000]),
    FOLLOW_LPAREN_in_switchStatement5501: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_expression_in_switchStatement5503: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x20000000, 0x00000000]),
    FOLLOW_RPAREN_in_switchStatement5505: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000002, 0x00000000]),
    FOLLOW_LBRACE_in_switchStatement5507: new org.antlr.runtime.BitSet([0x00002400, 0x00000000,0x00000004, 0x00000000]),
    FOLLOW_defaultClause_in_switchStatement5514: new org.antlr.runtime.BitSet([0x00002400, 0x00000000,0x00000004, 0x00000000]),
    FOLLOW_caseClause_in_switchStatement5520: new org.antlr.runtime.BitSet([0x00002400, 0x00000000,0x00000004, 0x00000000]),
    FOLLOW_RBRACE_in_switchStatement5525: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_CASE_in_caseClause5553: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_expression_in_caseClause5556: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000002]),
    FOLLOW_COLON_in_caseClause5558: new org.antlr.runtime.BitSet([0xFF9CD3C2, 0x00000003,0x3033004A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_statement_in_caseClause5561: new org.antlr.runtime.BitSet([0xFF9CD3C2, 0x00000003,0x3033004A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_DEFAULT_in_defaultClause5574: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000002]),
    FOLLOW_COLON_in_defaultClause5577: new org.antlr.runtime.BitSet([0xFF9CD3C2, 0x00000003,0x3033004A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_statement_in_defaultClause5580: new org.antlr.runtime.BitSet([0xFF9CD3C2, 0x00000003,0x3033004A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_Identifier_in_labelledStatement5597: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000002]),
    FOLLOW_COLON_in_labelledStatement5599: new org.antlr.runtime.BitSet([0xFF9CD3C0, 0x00000003,0x3033004A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_statement_in_labelledStatement5601: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_THROW_in_throwStatement5632: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_expression_in_throwStatement5637: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x000000C4, 0x00000000,0x00060000, 0x00000000]),
    FOLLOW_semic_in_throwStatement5639: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_TRY_in_tryStatement5656: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000002, 0x00000000]),
    FOLLOW_block_in_tryStatement5659: new org.antlr.runtime.BitSet([0x00020800, 0x00000000]),
    FOLLOW_catchClause_in_tryStatement5663: new org.antlr.runtime.BitSet([0x00020802, 0x00000000]),
    FOLLOW_finallyClause_in_tryStatement5665: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_finallyClause_in_tryStatement5670: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_CATCH_in_catchClause5684: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x10000000, 0x00000000]),
    FOLLOW_LPAREN_in_catchClause5687: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x00100000, 0x00000000]),
    FOLLOW_Identifier_in_catchClause5690: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x20000000, 0x00000000]),
    FOLLOW_RPAREN_in_catchClause5692: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000002, 0x00000000]),
    FOLLOW_block_in_catchClause5695: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_FINALLY_in_finallyClause5707: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000002, 0x00000000]),
    FOLLOW_block_in_finallyClause5710: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_FUNCTION_in_functionDeclaration5731: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x00100000, 0x00000000]),
    FOLLOW_Identifier_in_functionDeclaration5735: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x10000000, 0x00000000]),
    FOLLOW_formalParameterList_in_functionDeclaration5737: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000002, 0x00000000]),
    FOLLOW_functionBody_in_functionDeclaration5739: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_FUNCTION_in_functionExpression5766: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x10100000, 0x00000000]),
    FOLLOW_Identifier_in_functionExpression5770: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x10000000, 0x00000000]),
    FOLLOW_formalParameterList_in_functionExpression5773: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000002, 0x00000000]),
    FOLLOW_functionBody_in_functionExpression5775: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_LPAREN_in_formalParameterList5803: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x20100000, 0x00000000]),
    FOLLOW_Identifier_in_formalParameterList5807: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000080, 0x00000000,0x20000000, 0x00000000]),
    FOLLOW_COMMA_in_formalParameterList5811: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x00100000, 0x00000000]),
    FOLLOW_Identifier_in_formalParameterList5813: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000080, 0x00000000,0x20000000, 0x00000000]),
    FOLLOW_RPAREN_in_formalParameterList5821: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_LBRACE_in_functionBody5846: new org.antlr.runtime.BitSet([0xFF9CD3C0, 0x00000003,0x3033004E, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_sourceElement_in_functionBody5848: new org.antlr.runtime.BitSet([0xFF9CD3C0, 0x00000003,0x3033004E, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_RBRACE_in_functionBody5851: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_sourceElement_in_program5880: new org.antlr.runtime.BitSet([0xFF9CD3C2, 0x00000003,0x3033004A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_functionDeclaration_in_sourceElement5909: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_statement_in_sourceElement5914: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_FOR_in_forControlStatement5932: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x10000000, 0x00000000]),
    FOLLOW_LPAREN_in_forControlStatement5935: new org.antlr.runtime.BitSet([0xE48841C0, 0x00000000,0x3033004A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_forControl_in_forControlStatement5938: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x20000000, 0x00000000]),
    FOLLOW_RPAREN_in_forControlStatement5940: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_forControl_in_embeddedForControlStatement5951: new org.antlr.runtime.BitSet([0x00000000, 0x00000000]),
    FOLLOW_EOF_in_embeddedForControlStatement5953: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_IF_in_ifExpressionStatement5974: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x10000000, 0x00000000]),
    FOLLOW_LPAREN_in_ifExpressionStatement5977: new org.antlr.runtime.BitSet([0xA48841C0, 0x00000000,0x3033000A, 0x00000000,0x58300000, 0x0000001C]),
    FOLLOW_expression_in_ifExpressionStatement5980: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x20000000, 0x00000000]),
    FOLLOW_RPAREN_in_ifExpressionStatement5982: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_expression_in_embeddedIfExpressionFragment5993: new org.antlr.runtime.BitSet([0x00000000, 0x00000000]),
    FOLLOW_EOF_in_embeddedIfExpressionFragment5995: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_RENDER_in_renderControlStatement6016: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x10000000, 0x00000000]),
    FOLLOW_LPAREN_in_renderControlStatement6018: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x08300000, 0x00000000]),
    FOLLOW_callParam_in_renderControlStatement6020: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000080, 0x00000000]),
    FOLLOW_COMMA_in_renderControlStatement6022: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x08300000, 0x00000000]),
    FOLLOW_callParam_in_renderControlStatement6024: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000080, 0x00000000,0x20000000, 0x00000000]),
    FOLLOW_COMMA_in_renderControlStatement6027: new org.antlr.runtime.BitSet([0x00000180, 0x00000000,0x00000002, 0x00000000,0x08300000, 0x0000001C]),
    FOLLOW_callData_in_renderControlStatement6029: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x20000000, 0x00000000]),
    FOLLOW_RPAREN_in_renderControlStatement6033: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_callParam_in_embeddedRenderControlStatement6060: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000080, 0x00000000]),
    FOLLOW_COMMA_in_embeddedRenderControlStatement6062: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x08300000, 0x00000000]),
    FOLLOW_callParam_in_embeddedRenderControlStatement6064: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000080, 0x00000000]),
    FOLLOW_COMMA_in_embeddedRenderControlStatement6067: new org.antlr.runtime.BitSet([0x00000180, 0x00000000,0x00000002, 0x00000000,0x08300000, 0x0000001C]),
    FOLLOW_callData_in_embeddedRenderControlStatement6069: new org.antlr.runtime.BitSet([0x00000000, 0x00000000]),
    FOLLOW_EOF_in_embeddedRenderControlStatement6073: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_callParam_in_embeddedCallStatement6100: new org.antlr.runtime.BitSet([0x00000000, 0x00000000]),
    FOLLOW_EOF_in_embeddedCallStatement6102: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_callParam_in_embeddedDataCallStatement6126: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000080, 0x00000000]),
    FOLLOW_COMMA_in_embeddedDataCallStatement6129: new org.antlr.runtime.BitSet([0x00000180, 0x00000000,0x00000002, 0x00000000,0x08300000, 0x0000001C]),
    FOLLOW_callData_in_embeddedDataCallStatement6131: new org.antlr.runtime.BitSet([0x00000000, 0x00000000]),
    FOLLOW_EOF_in_embeddedDataCallStatement6135: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_callParam_in_embeddedControllerCallStatement6160: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000080, 0x00000000]),
    FOLLOW_COMMA_in_embeddedControllerCallStatement6162: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x08300000, 0x00000000]),
    FOLLOW_callParam_in_embeddedControllerCallStatement6164: new org.antlr.runtime.BitSet([0x00000000, 0x00000000]),
    FOLLOW_EOF_in_embeddedControllerCallStatement6166: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_callParam_in_embeddedControllerDataCallStatement6190: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000080, 0x00000000]),
    FOLLOW_COMMA_in_embeddedControllerDataCallStatement6192: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000000, 0x00000000,0x08300000, 0x00000000]),
    FOLLOW_callParam_in_embeddedControllerDataCallStatement6194: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000080, 0x00000000]),
    FOLLOW_COMMA_in_embeddedControllerDataCallStatement6197: new org.antlr.runtime.BitSet([0x00000180, 0x00000000,0x00000002, 0x00000000,0x08300000, 0x0000001C]),
    FOLLOW_callData_in_embeddedControllerDataCallStatement6199: new org.antlr.runtime.BitSet([0x00000000, 0x00000000]),
    FOLLOW_EOF_in_embeddedControllerDataCallStatement6203: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_statementTail_in_embeddedStatementTail6230: new org.antlr.runtime.BitSet([0x00000000, 0x00000000]),
    FOLLOW_EOF_in_embeddedStatementTail6232: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_IdentifierNameAmpersatStart_in_callParam6246: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_Identifier_in_callParam6255: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_StringLiteral_in_callParam6262: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_objectLiteral_in_callData6276: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_callParam_in_callData6280: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_numericLiteral_in_callData6284: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_booleanLiteral_in_callData6288: new org.antlr.runtime.BitSet([0x00000002, 0x00000000])
});

})();

return ES3Parser;

});
