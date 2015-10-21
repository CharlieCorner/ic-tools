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

		// Get TOOL Template to be worked
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
		var $toolLDiv = $("#toolDiv");
		var selectorValue = $("#templateSelect").val();
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

		$toolLDiv.show();
	};

	var attachEvents = function(){
		$("#templateSelect").change(onToolSelectorChange);
		$("#goButton").click(onClickGoButton);

	};

	return{
		attachEvents: attachEvents
	};
})();
