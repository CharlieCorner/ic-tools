Generator = (function(){
	
	var SQL_TEMPLATES_LOCATION = "templates/sql-templates.html";
	var HB_TEMPLATES_LOCATION = "templates/templates.html";
	var hasTheOtherTemplateFileLoadedYet = false;
	
	var sayHi = function(){
		console.log("HIII!");
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
		var hbTemplate = Handlebars.compile($("#selectorTemplate").html());
		$sqlSelector.html(hbTemplate(sqlObjects));
		
	};
		
	return{
		loadSqlTemplates: loadSqlTemplates,
		loadHandleBarsTemplates: loadHandleBarsTemplates,
		loadSQLIntoDropdown: loadSQLIntoDropdown
	};
})();

/*
 * -------------- Events -----------------------
*/

Generator.events = (function(){

	// Event onSelectorChange

	var attachEvents = function(){

	};

	return{
		attachEvents: attachEvents
	};
})();
