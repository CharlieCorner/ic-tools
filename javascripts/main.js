$(document).ready(function() {
	Generator.loadSqlTemplates();
	Generator.loadHandleBarsTemplates();
	Generator.loadSQLIntoDropdown();
	Generator.events.attachEvents();
});