Generator = (function(){
	
	var SQL_TEMPLATES_LOCATION = "templates/sql-templates.html";
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
				loadSQLIntoDropdown();
			} else {
				hasTheOtherTemplateFileLoadedYet = true;
			}
		});
	};
	
	var loadSqlTemplates = function() {
		includeHtml("#sqlTemplatesContainer", SQL_TEMPLATES_LOCATION);
	};
	
	var loadHandleBarsTemplates = function() {
		includeHtml("#pageStructureTemplatesContainer", HB_TEMPLATES_LOCATION);
	};

	var buildHBSQLObject = function($sqlTemplateTags){
		var sqlObject = {
			sqlList: []
		};

		$.each($sqlTemplateTags, function(index, tag){
			var $tag = $(tag);
			var sql = {
				SQLId: $(tag).attr("id"),
				SqlDescription : $(tag).attr("title")
			};
			
			sqlObject.sqlList.push(sql);
		});

		return sqlObject;
	};

	var loadSQLIntoDropdown = function() {
		var $sqlSelector = $("#templateSelect");
		// Get the SQL template tags as jQuery objects
		//  So I can loop through them
		var $sqlTemplates = $("template.sqlTemplate");
		var sqlObjects = buildHBSQLObject($sqlTemplates);

		// Compile the templates
		//  For each template tag, feed it to HandleBars
		// Attach it to the selector
		var hbTemplate = compileTemplate($("#selectorTemplate"));
		$sqlSelector.html(hbTemplate(sqlObjects));
		
	};
		
	return{
		loadSqlTemplates: loadSqlTemplates,
		loadHandleBarsTemplates: loadHandleBarsTemplates,
		loadSQLIntoDropdown: loadSQLIntoDropdown,
		getAllRegexMatches: getAllRegexMatches,
		compileTemplate: compileTemplate
	};
})();

/*
 * -------------- Events -----------------------
*/

Generator.events = (function(){

	var onSqlSelectorChange = function(){
		var $fieldDiv = $("#fieldDiv");
		var $sqlDiv = $("#sqlDiv")
		var $fieldTable = $("#inputFieldTable");

		var selectorValue = $(this).val();
		var fieldsRegex = /\{\{([^}]+)\}\}/gi;

		$fieldDiv.hide();
		$sqlDiv.hide();

		if(-1 == selectorValue){
			$fieldTable.html("");
			return;
		}

		// Get SQL Template to be worked
		var templateHtml = $("#" + selectorValue).html();

		// Strip the fields in it
		var listOfFields = Generator.getAllRegexMatches(templateHtml, fieldsRegex);

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
		var hbTemplate = Generator.compileTemplate($("#fieldValuesRows"));
		var html = hbTemplate(handleBarsObject);
		$fieldTable.html(html);


		$fieldDiv.show();
	};

	var attachEvents = function(){
		$("#templateSelect").change(onSqlSelectorChange);

	};

	return{
		attachEvents: attachEvents
	};
})();
