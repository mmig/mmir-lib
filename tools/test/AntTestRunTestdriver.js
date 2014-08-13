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


/*
 * Script for creating a java-task performing
 * the jstestdriver-run
 * 
 * This script required to run in the context of an ANT build script.
 */

importClass(java.io.File);
// function to provide a means of logging
function echo(text){
	var echo = project.createTask("echo");
	echo.setMessage(text);
	echo.perform();
}

// get file list as array
var filelist = project.getProperty("config.files");
var fileString = filelist.replace("\\", "/");
var fileArray = fileString.split(";");
echo("Filelist: " + filelist);

// execute the tests
for (var cfileIndex in fileArray){
	var configFile = project.getProperty("basedir").replace("\\","/") + "/" + project.getProperty("jstestdriver.config.dir");
	
	// build absolute path to config file
	if (configFile[configFile.length-1]!="/"){
		configFile = configFile+"/";
	}
	configFile = configFile + fileArray[cfileIndex];
	
	echo("=======================================================================");
	echo("Processing config file: " + configFile);
	var testDriverTask = project.createTask("java");
	var targetJar = new File(project.getProperty("jstestdriver.bin"));
	
	var workingDir = new File(project.getProperty("basedir").replace("\\","/")+"/..");
	
	testDriverTask.setDir(workingDir);
	testDriverTask.setJar(targetJar);
	testDriverTask.setFork(true);
	testDriverTask.setTimeout(60000);
	testDriverTask.setResultProperty("jstestdriver.result");
	testDriverTask.createArg().setValue("--runnerMode");
	testDriverTask.createArg().setValue(project.getProperty("config.jstestdriver.runnermode"));
	testDriverTask.createArg().setValue("--raiseOnFailure");
	testDriverTask.createArg().setValue("true");
	testDriverTask.createArg().setValue("--port");
	testDriverTask.createArg().setValue(project.getProperty("jstestdriver.port"));
	testDriverTask.createArg().setValue("--captureConsole");
	testDriverTask.createArg().setValue("--tests");
	testDriverTask.createArg().setValue("all");
	testDriverTask.createArg().setValue("--verbose");
	testDriverTask.createArg().setValue("--testOutput");
	testDriverTask.createArg().setValue(project.getProperty("basedir")+"/"+project.getProperty("jstestdriver.log.dir"));
	testDriverTask.createArg().setValue("--browser");
	testDriverTask.createArg().setValue(project.getProperty("config.browser.args"));
	testDriverTask.createArg().setValue("--config");
	testDriverTask.createArg().setValue(configFile);
	testDriverTask.execute();
}
