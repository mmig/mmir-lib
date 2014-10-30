define(['constants', 'jquery', 'require'], function(constants, $, require){

//	var templatePath = //TODO add to constants: constants.getGrammarTemplatePath();
//						constants.getBasePath() + 'mmirf/semantic/grammarTemplate_reduced.tpl';
	
	var templatePath = require.toUrl('./semantic/grammarTemplate_reduced.tpl');
	
	var template;
	
	$.ajax({
		url: templatePath,
		dataType: 'text',
		async: false,				//load synchronously!
		success: function(data){
			template = data;
		},
		error: function(xhr, status, err){
			console.error('Failed to load grammar template file from "'+templatePath+'": '+status+', ERROR '+err);
		}
	});

	return template;

});