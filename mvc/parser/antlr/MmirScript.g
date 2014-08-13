/*
 * 	Copyright (C) 2012-2013 DFKI GmbH
 * 	Deutsches Forschungszentrum fuer Kuenstliche Intelligenz
 * 	German Research Center for Artificial Intelligence
 * 	http://www.dfki.de
 * 
 * 	Permission is hereby granted, free of charge, to any person obtaining a 
 * 	copy of this software and associated documentation files (the 
 * 	"Software"), to deal in the Software without restriction, including 
 * 	without limitation the rights to use, copy, modify, merge, publish, 
 * 	distribute, sublicense, and/or sell copies of the Software, and to 
 * 	permit persons to whom the Software is furnished to do so, subject to 
 * 	the following conditions:
 * 
 * 	The above copyright notice and this permission notice shall be included 
 * 	in all copies or substantial portions of the Software.
 * 
 * 	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
 * 	OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
 * 	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * 	IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY 
 * 	CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
 * 	TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * 	SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

grammar MmirScript;

options {
	tokenVocab = MmirTemplate;
	language = JavaScript;
}

@lexer::members {

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
}

@parser::members {

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
}
main returns[String theText]
	@after{
		if(this.isDebug) this.printInfo('SCRIPT_main.text', $theText);//debug
	}
	: t=text { $theText = ($t.text?$t.text:''); } (NL t=text { $theText = $theText + '\r\n' + ($t.text?$t.text:''); })*
	;

text
	: ( other | DoExit | DoExitStatement | DoEnter | DoEnterStatement | CHAR )*
	;

other	: COMMENT  {if(this.isDebug) this.printInfo('SCRIPT_BLOCK_comment',$COMMENT.text);/*debug*/}
	| STRING   {if(this.isDebug) this.printInfo('SCRIPT_BLOCK_String' ,$STRING.text);/*debug*/}
	| SSTRING  {if(this.isDebug) this.printInfo('SCRIPT_BLOCK_string' ,$SSTRING.text);/*debug*/}
	;
	
line_end:	NL | EOF;

DoEnter
	:	'{' 
	{
	  if(this.isBlockMode()){
		this.nestingBlock++;
		if(this.isDebug) this.printDebug("opening level SCRIPT_BLOCK "+this.nestingBlock);//debug
	  }
	}
        ;
        
DoExit
	:	'}'
	{
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
        }
	;

DoEnterStatement 
	:	'('
	{
	  if(this.isStatementMode()){
	  	this.nesting++;
	  	if(this.isDebug) this.printDebug("opening level STATEMENT_BLOCK "+this.nesting);//debug
	  }
	}
        ;
        
DoExitStatement:	 ')'
	{
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
        }
	;

NL
	: '\r'? '\n'
	| '\r'		// Line feed.
	| '\u2028'	// Line separator.
	| '\u2029'	// Paragraph separator.
	;


WS
    : (' '|'\t'| NL ) {$channel=HIDDEN;};
    
CHAR	:	~('\n'|'\r');

COMMENT
    :   '//' ~('\n'|'\r')* '\r'? '\n'  {$channel=HIDDEN;}
    |   '/*' ( options {greedy=false;} : . )* '*/'  {$channel=HIDDEN;}
    |   '@*' ( options {greedy=false;} : . )* '*@'  {$channel=HIDDEN;}
    ;

STRING
    :  '"' ( options {greedy=false;}: (ESC_SEQ | ~('\\'|'"') ))* '"'
    ;
    
SSTRING
    :  '\'' ( options {greedy=false;}: (ESC_SEQ | ~('\\'|'\'') ))* '\''
    ;

fragment
HEX_DIGIT : ('0'..'9'|'a'..'f'|'A'..'F') ;

fragment
ESC_SEQ
    :   '\\' ('b'|'t'|'n'|'f'|'r'|'\"'|'\''|'\\')
    |   UNICODE_ESC
    |   OCTAL_ESC
    ;

fragment
OCTAL_ESC
    :   '\\' ('0'..'3') ('0'..'7') ('0'..'7')
    |   '\\' ('0'..'7') ('0'..'7')
    |   '\\' ('0'..'7')
    ;

fragment
UNICODE_ESC
    :   '\\' 'u' HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT
    ;