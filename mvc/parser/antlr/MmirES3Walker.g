/*

Modifications	:
Copyrights 2013 DFKI GmbH (German Research Center For Artificial Intelligence)
MIT license

 * modified the orginal grammar in order to generate Lexer/Parser for JavaScript as target language

Original Work	:

Copyrights 2008-2009 Xebic Reasearch BV. All rights reserved (see license.txt).
Original work by Patrick Hulsmeijer.

*/

tree grammar MmirES3Walker;

options
{
	ASTLabelType = CommonTree ;
	tokenVocab = ES3 ;
	language = JavaScript;
}

@members{
	//MODIFICATION: array for tracking ampersat-Identifiers
	this.ampersatIdentifiers = new Array();
	this.identifiers = new Array();
	this.varDeclarations = new Array();
	this.varAssignments = new Array();
}

/*
Note: functionDeclaration is reachable via statement->expression as functionExpression and functionDeclaration are combined.
*/
program
	: statement*
	;

statement
	: block
	| variableDeclaration
	| expression
	| ifStatement
	| doStatement
	| whileStatement
	| forStatement
	| continueStatement
	| breakStatement
	| returnStatement
	| withStatement
	| labelledStatement
	| switchStatement
	| throwStatement
	| tryStatement
	;

block
	: ^( BLOCK statement* )
	;

variableDeclaration
	: ^( VAR ( id=Identifier | ^( ASSIGN id=Identifier expr ) )+ )
	{ this.varDeclarations.push($id); /*MODIFICATION: keep trac of variable decplarations */}
	;

ifStatement
	: ^( IF expression statement+ )
	;

doStatement
	: ^( DO statement expression )
	;

whileStatement
	: ^( WHILE expression statement )
	;

/* MODIFICATION: split forStatement into control and statement parts, i.e. rules forStatement and forControl
 * orginal rule:
 
forStatement
	: ^(
	FOR 
	(
		^( FORSTEP ( exprOptClause | variableDeclaration ) exprOptClause exprOptClause )
		| ^( FORITER ( exprClause | variableDeclaration ) exprClause )
	)
	statement
	);
*/

forStatement
	: ^(FOR forControl statement);
	
forControl
	: (
	
		^( FORSTEP ( exprOptClause | variableDeclaration ) exprOptClause exprOptClause )
		| ^( FORITER ( exprClause | variableDeclaration ) exprClause )
	
	);

exprOptClause
	: ^( EXPR expression? )
	;

exprClause
	: ^( EXPR expression )
	;

continueStatement
	: ^( CONTINUE Identifier? )
	;

breakStatement
	: ^( BREAK Identifier? )
	;

returnStatement
	: ^( RETURN expression? )
	;

withStatement
	: ^( WITH expression statement )
	;

labelledStatement
	: ^( LABELLED Identifier statement )
	;

switchStatement
	: ^( SWITCH expression defaultClause? caseClause* )
	;

defaultClause
	: ^( DEFAULT statement* )
	;

caseClause
	: ^( CASE expression statement* )
	;

throwStatement
	: ^( THROW expression )
	;

tryStatement
	: ^( TRY block catchClause? finallyClause? )
	;
	
catchClause
	: ^( CATCH Identifier block )
	;
	
finallyClause
	: ^( FINALLY block )
	;

expression
	: expr 
	| ^( CEXPR expr+ )
	;

expr
	: leftHandSideExpression
	
	// Assignment operators
	| ^( ASSIGN expr expr )
	| ^( MULASS expr expr )
	| ^( DIVASS expr expr )
	| ^( MODASS expr expr )
	| ^( ADDASS expr expr )
	| ^( SUBASS expr expr )
	| ^( SHLASS expr expr )
	| ^( SHRASS expr expr )
	| ^( SHUASS expr expr )
	| ^( ANDASS expr expr )
	| ^( XORASS expr expr )
	| ^( ORASS expr expr )
	
	// Conditional operator
	| ^( QUE expr expr expr )
	
	// Logical operators
	| ^( LOR expr expr )
	| ^( LAND expr expr )
	
	// Binary bitwise operators
	| ^( AND expr expr )
	| ^( OR expr expr )
	| ^( XOR expr expr )
	
	// Equality operators
	| ^( EQ expr expr )
	| ^( NEQ expr expr )
	| ^( SAME expr expr )
	| ^( NSAME expr expr )
	
	// Relational operator
	| ^( LT expr expr )
	| ^( GT expr expr )
	| ^( LTE expr expr )
	| ^( GTE expr expr )
	| ^( INSTANCEOF expr expr )
	| ^( IN expr expr )
	
	// Bitwise shift operator
	| ^( SHL expr expr )
	| ^( SHR expr expr )
	| ^( SHU expr expr )
	
	// Additive operators
	| ^( ADD expr expr )
	| ^( SUB expr expr )
	
	// Multipiclative operators
	| ^( MUL expr expr )
	| ^( DIV expr expr )
	| ^( MOD expr expr )
	
	// Unary operator
	| ^( DELETE expr )
	| ^( VOID expr )
	| ^( TYPEOF expr )
	| ^( INC expr )
	| ^( DEC expr )
	| ^( POS expr )
	| ^( NEG expr )
	| ^( INV expr )
	| ^( NOT expr )
	
	// Postfix operators
	| ^( PINC expr )
	| ^( PDEC expr )
	;

leftHandSideExpression
	: primaryExpression
	| newExpression
	| functionDeclaration
	| callExpression
	| memberExpression
	;

newExpression
	: ^( NEW leftHandSideExpression )
	;

functionDeclaration
	: ^( FUNCTION Identifier? ^( ARGS Identifier* ) block )
	;

callExpression
	: ^( CALL leftHandSideExpression ^( ARGS expr* ) )
	;
	
memberExpression
	: ^( BYINDEX leftHandSideExpression expression )
	| ^( BYFIELD leftHandSideExpression Identifier )
	;

primaryExpression
	: id=Identifier { this.identifiers.push($id); /*MODIFICATION: keep trac of Identifier */}
	| amp=IdentifierNameAmpersatStart { this.ampersatIdentifiers.push($amp); /*MODIFICATION: keep trac of additional special ampersat-Identifier */}
	| literal
	;

literal
	: THIS
	| NULL
	| booleanLiteral
	| numericLiteral
	| StringLiteral
	| RegularExpressionLiteral
	| arrayLiteral
	| objectLiteral
	;

booleanLiteral
	: TRUE
	| FALSE
	;

numericLiteral
	: DecimalLiteral
	| OctalIntegerLiteral
	| HexIntegerLiteral
	;

arrayLiteral
	: ^( ARRAY ( ^( ITEM expr? ) )* )
	;

objectLiteral
	: ^( OBJECT ( ^( NAMEDVALUE propertyName expr ) )* )
	;

propertyName
	: Identifier
	| StringLiteral
	| numericLiteral
	;
	
/*
	 MODIFICATION:	rule for parsing the for-statement only, i.e. for(...), 
	 		wihtout the following expression-block
	 		i.e. not: for(...){...}
*/
embeddedForControlStatement
	: ^(FOR forControl)
	;
/*
	 MODIFICATION:	rule for parsing the if-expression only, i.e. if(...), 
	 		wihtout the following expression-block
	 		i.e. not: if(...){...}
*/
embeddedIfExpressionFragment
	: ^(IF expression)
	;
/*
	MODIFICATION: rule for an embedded RENDER statement, where the parser
			detecting the embedding consumes the beginning of the statement,
			i.e. RENDER LPAREN
*/
embeddedRenderControlStatement
	: ^( RENDER callParam callParam callData?)
	;

/* 
	MODIFICATION: Additional special case.
 */
callParam
	: amp=IdentifierNameAmpersatStart { this.ampersatIdentifiers.push($amp); /*MODIFICATION: keep trac of additional special ampersat-Identifier */}
	| id=Identifier { this.identifiers.push($id); /*MODIFICATION: keep trac of Identifier */}
	| StringLiteral  
	;
/* 
	MODIFICATION: Additional special case.
 */
callData
	: objectLiteral | callParam | numericLiteral
	;

