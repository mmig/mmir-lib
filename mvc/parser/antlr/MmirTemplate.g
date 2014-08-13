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

grammar MmirTemplate;

options{
	language = JavaScript;
	output=AST;
}

@lexer::members {

	//FIXME
	//mmir.parser.extendMmirTemplateProcessor(this);
	var extendMmirTemplateProcessor = require('templateProcessor');
	extendMmirTemplateProcessor(this);
	
}

main
	: text
	;
	
text
	: line+
	;
	
line 	: (
		  other 
		//| STRING 
		//| SSTRING 
		| CHAR
	  )* 
	  (NL | END)
	;
	
other	: EscapeExit
	| ESC_DoEnter
	| COMMENT
	| DoEnterBlock
	| DoEnterStatement
	| DoEnterIncludeScript
	| DoEnterIncludeStyle
	| DoEnterLocalize
	| DoEnterYieldDeclaration
	| DoEnterYieldContent
	| DoEnterIfStatement
	| DoEnterElseStatement
	| DoEnterForStatement
	;

EscapeExit 
	:	s='}@@'
	{    //the 'functional' token definition for this is in MmirScriptContent
	     // (i.e. actually escaping the EXIT) ... we need the token here (again)
	     //  for creating a 'replacement-element', so that we know, we need
	     //  to replace '}@@' -> '}@'
             var result = this.processEscape('}@','ESCAPE_exit');
             result.start = $s.getStartIndex();
	     result.end   = $s.getStopIndex() + 1;
	     result.type  = this.INTERNAL_ESCAPE_EXIT;
	}
	;
	
ESC_DoEnter 	:	s='@@'
            {
             var result = this.processEscape('@', 'ESCAPE_enter');
             result.start = $s.getStartIndex();
             result.end   = $s.getStopIndex() + 1;
	     result.type  = this.INTERNAL_ESCAPE_ENTER;
            }
        ;

DoEnterBlock	:	s='@{'
            {
             var result = this.enterBlock($channel, 'main', this.processBlock, 'BLOCK');
             result.start = $s.getStartIndex();
	     result.end = result.end + 3;
	     result.type  = this.INTERNAL_BLOCK;
            }
            {$channel=HIDDEN;}
        ;

DoEnterStatement :   s='@('
            {
             var result = this.enterScript($channel, 'main', this.processStatement, 'STATEMENT');
             result.start = $s.getStartIndex();
	     result.end = result.end + 2;
	     result.type  = this.INTERNAL_STATEMENT;
            }
            {$channel=HIDDEN;}
        ;
        
DoEnterIncludeScript :   s='@script('
            {
             var result = this.enterJavaScript($channel, 'embeddedCallStatement', this.processIncludeScript, 'INCLUDE_SCRIPT');
             //correct start/end positions to include enclosing @script() statement
             result.start = $s.getStartIndex();
	     result.end = result.end + 2;
	     result.type  = this.INTERNAL_INCLUDE_SCRIPT;
            }
            {$channel=HIDDEN;}
        ;
        
DoEnterIncludeStyle :   s='@style('
            {
             var result = this.enterJavaScript($channel, 'embeddedCallStatement', this.processIncludeStyle, 'INCLUDE_STYLE');
             //correct start/end positions to include enclosing @style() statement
             result.start = $s.getStartIndex();
	     result.end = result.end + 2;
	     result.type  = this.INTERNAL_INCLUDE_STYLE;
            }
            {$channel=HIDDEN;}
        ;
        
DoEnterLocalize :   s='@localize('
            {
             var result = this.enterJavaScript($channel, 'embeddedCallStatement', this.processLocalize, 'LOCALIZE');
             //correct start/end positions to include enclosing @locale() statement
             result.start = $s.getStartIndex();
	     result.end = result.end + 2;
	     result.type  = this.INTERNAL_LOCALIZE;
            }
            {$channel=HIDDEN;}
        ;
        
DoEnterDeclareVar :   s='@var('
            {
             var result = this.enterJavaScript($channel, 'embeddedCallStatement', this.processDeclareVar, 'DECLARE_VAR');
             //correct start/end positions to include enclosing @locale() statement
             result.start = $s.getStartIndex();
	     result.end = result.end + 2;
	     result.type  = this.INTERNAL_VAR_DECLARATION;
            }
            {$channel=HIDDEN;}
        ;
        
DoEnterHelper :   s='@helper('
            {
             var result = this.enterJavaScript($channel, 'embeddedDataCallStatement', this.processHelperFunction, 'HELPER_FUNCTION');
             //correct start/end positions to include enclosing @helper() statement
             result.start = $s.getStartIndex();
	     result.end = result.end + 2;
	     result.type  = this.INTERNAL_HELPER;
            }
            {$channel=HIDDEN;}
        ;
        
DoEnterRender :   s='@render('
            {
             var result = this.enterJavaScript($channel, 'embeddedRenderControlStatement', this.processRenderPartial, 'RENDER_PARTIAL');
             //correct start/end positions to include enclosing @render() statement
             result.start = $s.getStartIndex();
	     result.end = result.end + 2;
	     result.type  = this.INTERNAL_RENDER;
            }
            {$channel=HIDDEN;}
        ;
        
DoEnterYieldDeclaration :   s='@yield('
            {
             var result = this.enterJavaScript($channel, 'embeddedCallStatement', this.processYieldDeclaration, 'YieldDeclaration');
             //correct start/end positions to include enclosing @yield() statement
             result.start = $s.getStartIndex();
	     result.end = result.end + 2;
	     result.type  = this.INTERNAL_YIELD_DECLARATION;
            }
            {$channel=HIDDEN;}
        ;
        
DoEnterYieldContent :   s='@contentFor('
            {
             var result = this.enterJavaScript($channel, 'embeddedCallStatement', this.processYieldContentParam, 'YieldContentParam');
             //correct start/end positions to include enclosing @contentFor(){ ... }@ statement
             result.start = $s.getStartIndex();
             
             result = this.enterContent($channel, 'content', this.processYieldContent, 'YieldContent', result);
             
	     result.end = result.end + 3;
	     result.type  = this.INTERNAL_YIELD_CONTENT;
	     
            }
            {$channel=HIDDEN;}
        ;
        
DoEnterIfStatement :   s='@if('
            {
             var result = this.enterJavaScript($channel, 'embeddedIfExpressionFragment', this.processIfExpr, 'IfExpr');
             //correct start/end positions to include enclosing @if(){ ... }@ statement
             result.start = $s.getStartIndex();
             
             result = this.enterContent($channel, 'content', this.processIfContent, 'IfContent', result);
             
	     result.end = result.end + 3;
	     result.type  = this.INTERNAL_IF;
	     
            }
            {$channel=HIDDEN;}
        ;
        
DoEnterElseStatement :   s='@else'
            {
             var result = this.enterContent($channel, 'content', this.processElse, 'ELSE', result);
             
             //correct start/end positions to include enclosing @else{ ... }@ statement
             result.start = $s.getStartIndex();
	     result.end = result.end + 3;
	     result.type  = this.INTERNAL_ELSE;
	     
            }
            {$channel=HIDDEN;}
        ;
        
DoEnterForStatement :   s='@for('
            {
             var result = this.enterJavaScript($channel, 'embeddedForControlStatement', this.processForControl, 'ForControl');
             //correct start/end positions to include enclosing @if(){ ... }@ statement
             result.start = $s.getStartIndex();
             
             result = this.enterContent($channel, 'content', this.processForContent, 'ForContent', result);
             
	     result.end = result.end + 3;
	     result.type  = this.INTERNAL_FOR;
	     
            }
            {$channel=HIDDEN;}
        ;

NL
	: '\r'? '\n'
	| '\r'		// Line feed.
	| '\u2028'	// Line separator.
	| '\u2029'	// Paragraph separator.
	;

END_SCRIPT :	'}@';

CHAR	:	~('\n'|'\r');

COMMENT
    :   start='@*' ( options {greedy=false;} : . )* end='*@'
    {
    	var result = this.processComment('COMMENT');
    	result.start = $start.getStartIndex();
    	result.end   = $end.getStopIndex() + 1;
    	result.type  = this.INTERNAL_COMMENT;
    }
    ;

/*
STRING
    :  '"' ( options {greedy=false;}: (ESC_SEQ | ~('\\'|'"') ))* '"'
    ;
    
SSTRING
    :  '\'' ( options {greedy=false;}: (ESC_SEQ | ~('\\'|'\'') ))* '\''
    ;
*/

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

/** When the template parser sees end-of-comment it just says 'I'm done', which
 *  consumes the tokens and forces this template parser (feeding
 *  off the input stream currently) to exit.
 */
END     : EOF {this.emit(org.antlr.runtime.Token.EOF_TOKEN);}
          {if(this.isDebug) this.printDebug("exit text");/*debug*/}
        ;