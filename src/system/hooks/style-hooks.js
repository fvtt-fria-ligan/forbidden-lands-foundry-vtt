export const declareHooks = () => {
	Hooks.on("collapseSceneNavigation", (app, collapsed) => {
		if (!collapsed) {
			app.element.find("#scene-list").attr("style", "display: flex;");
		}
	});
};
