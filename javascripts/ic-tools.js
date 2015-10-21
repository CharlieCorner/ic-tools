ICTools = (function(){
	
	var TOOL_TEMPLATES_LOCATION = "templates/tool-templates.html";
	var HB_TEMPLATES_LOCATION = "templates/templates.html";
	var hasTheOtherTemplateFileLoadedYet = false;
	
	var sayHi = function(){
		console.log("HIII!");
	};

	var getAllRegexMatches = function(sString, rRegex){
		var matches = [];
		var m;

		do {
			m = rRegex.exec(sString);
			
			if (m) {
				matches.push(m[1]);
			}
		} while (m);

		return matches;
	};

	var compileTemplate = function($templateToBeCompiled){
		return Handlebars.compile($templateToBeCompiled.html())
	};
	
	var includeHtml = function(sId, sLocation){
		$.get(sLocation, function(data) {
			$(sId).html(data);

			if(hasTheOtherTemplateFileLoadedYet){
				loadToolIntoDropdown();
			} else {
				hasTheOtherTemplateFileLoadedYet = true;
			}
		});
	};
	
	var loadToolTemplates = function() {
		includeHtml("#toolTemplatesContainer", TOOL_TEMPLATES_LOCATION);
	};
	
	var loadHandleBarsTemplates = function() {
		includeHtml("#pageStructureTemplatesContainer", HB_TEMPLATES_LOCATION);
	};

	var buildHBToolObject = function($toolTemplateTags){
		var toolObject = {
			toolList: []
		};

		$.each($toolTemplateTags, function(index, tag){
			var $tag = $(tag);
			var tool = {
				toolId: $(tag).attr("id"),
				toolDescription : $(tag).attr("title")
			};
			
			toolObject.toolList.push(tool);
		});

		return toolObject;
	};

	var loadToolIntoDropdown = function() {
		var $toolSelector = $("#templateSelect");
		// Get the SQL and TOOL template tags as jQuery objects
		//  So I can loop through them
		var $toolTemplates = $("template.sqlTemplate");
		$toolTemplates.push($("template.toolTemplate"));
		var toolObjects = buildHBToolObject($toolTemplates);

		// Compile the templates
		//  For each template tag, feed it to HandleBars
		// Attach it to the selector
		var hbTemplate = compileTemplate($("#selectorTemplate"));
		$toolSelector.html(hbTemplate(toolObjects));
		
	};
		
	return{
		loadToolTemplates: loadToolTemplates,
		loadHandleBarsTemplates: loadHandleBarsTemplates,
		loadToolIntoDropdown: loadToolIntoDropdown,
		getAllRegexMatches: getAllRegexMatches,
		compileTemplate: compileTemplate
	};
})();

/*
 * -------------- Events -----------------------
*/

ICTools.events = (function(){

	var onToolSelectorChange = function(){
		var $fieldDiv = $("#fieldDiv");
		var $toolDiv = $("#toolDiv");
		var $fieldTable = $("#inputFieldTable");

		var selectorValue = $(this).val();
		var fieldsRegex = /\{\{([^}]+)\}\}/gi;

		$fieldDiv.hide();
		$toolDiv.hide();

		if(-1 == selectorValue){
			$fieldTable.html("");
			return;
		}

		// Get the TOOL Template to be worked
		var templateHtml = $("#" + selectorValue).html();

		// Strip the fields in it
		var listOfFields = ICTools.getAllRegexMatches(templateHtml, fieldsRegex);

		//Build and object from each of the fields
		var handleBarsObject = {
			fieldsArray : []
		};

		$.each(listOfFields, function(index, element){
			var field = {
				fieldName : element
			};
			handleBarsObject.fieldsArray.push(field);
		});	

		// Compile template and add it to the table
		var hbTemplate = ICTools.compileTemplate($("#fieldValuesRows"));
		var html = hbTemplate(handleBarsObject);
		$fieldTable.html(html);


		$fieldDiv.show();
	};

	var onClickGoButton = function(){
		var $toolDiv = $("#toolDiv");
		var selectorValue = $("#templateSelect").val();

		// If the tool selected is not an SQL template, but an actual tool, look for
		//  its associated logic, otherwise just compile the SQL template
		if(selectorValue.toLowerCase().indexOf("tool") > -1){
			// It is a tool!
			//  Execute it!
			ICTools.appData[selectorValue].execute();

		} else {
			// It is an SQL template

			var $textArea = $("#toolTextAreaResult");
			$textArea.val("");

			// Obtain the fields values and build the object
			var inputs = $("#inputFieldTable input");
			var valuesObject = {};

			$.each(inputs, function(index, elm){
				var $elm = $(elm);
				valuesObject[$elm.attr("id")] = $elm.val();
			});

			var hbTemplate = ICTools.compileTemplate($("#" + selectorValue));
			var toolContent = hbTemplate(valuesObject).trim();
			$textArea.val(toolContent);
			$toolDiv.show();
		}
	};

	var attachEvents = function(){
		$("#templateSelect").change(onToolSelectorChange);
		$("#goButton").click(onClickGoButton);

	};

	return{
		attachEvents: attachEvents
	};
})();

// The logic associated with the tools
ICTools.appData = (function(){
	
	var decodingEncodingTool = {
		execute : function(){
			var $userIdField = $("#inputFieldTable #user_id");
			var $passwordField = $("#inputFieldTable #password");
			var $hashField = $("#inputFieldTable #basic_authentication_hash");
			
			// Determine to enconde or decode
			
			if($hashField.val().trim()){
				//There's a hash, let's decode it
				var hash = $hashField.val().trim();

				try {
					var sDecoded = window.atob(hash);
					var arrayPair = sDecoded.split(":");
					$userIdField.val(arrayPair[0]);
					$passwordField.val(arrayPair[1]);

				} catch(exception){
					$userIdField.val("INVALID");
					$passwordField.val("BASE64 HASH!");
				}
				

			} else {
				//There's not a hash, let's encode it!
				var sUser = $userIdField.val();
				var sPassword = $passwordField.val();
				$hashField.val(window.btoa(sUser + ":" + sPassword));


			}

		}
	};

	var anotherTestTool = {
		execute: function(){
			alert("Callate!");
		}
	};

	return {
		decodingEncodingTool: decodingEncodingTool,
		anotherTestTool: anotherTestTool
	};

})();
