Generator = (function(){
	
	var SQL_TEMPLATES_LOCATION = "/templates/sql-templates/sql-templates.html";
	var HB_TEMPLATES_LOCATION = "/templates/handlebars-templates/templates.html";
	
	var sayHi = function(){
		console.log("HIII!");
	};
	
	var includeHtml = function(sId, sLocation){
		$(sId).load(sLocation);
	};
	
	var loadSqlTemplates = function() {
		includeHtml("#sqlTemplatesContainer", SQL_TEMPLATES_LOCATION);
	};
	
	var loadHandleBarsTemplates = function() {
		includeHtml("#pageStructureTemplatesContainer", HB_TEMPLATES_LOCATION);
	};
		
	return{
		loadSqlTemplates: loadSqlTemplates,
		loadHandleBarsTemplates: loadHandleBarsTemplates
	};
})();
