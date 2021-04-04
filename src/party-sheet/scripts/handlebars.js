
function preloadHandlebarsTemplates() {
    const templatePaths = [
        "modules/forbidden-lands-party-sheet/templates/tab/main.html",
        "modules/forbidden-lands-party-sheet/templates/tab/travel.html",
        "modules/forbidden-lands-party-sheet/templates/partial/travel-action.html",
        "modules/forbidden-lands-party-sheet/templates/partial/party-member.html",
    ];
    return loadTemplates(templatePaths);
}

function registerHandlebarsHelpers() {
    Handlebars.registerHelper('flps_capitalize', function (value, options) {
        return typeof value === 'string' && value.length > 0 ? value[0].toUpperCase() + value.slice(1) : value;
    });
    Handlebars.registerHelper('flps_strconcat', function () {
        const args = Array.prototype.slice.call(arguments);
        args.pop(); // remove unrelated data
        return args.join("");
    });

    Handlebars.registerHelper('flps_enrich', function (content) {
        // Enrich the content
        content = TextEditor.enrichHTML(content, { entities: true });
        return new Handlebars.SafeString(content);
    });
}

export const initializeHandlebars = () => {
  registerHandlebarsHelpers();
  preloadHandlebarsTemplates();
};