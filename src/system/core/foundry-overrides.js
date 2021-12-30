/* eslint-disable no-unused-vars, no-shadow */
export default function FoundryOverrides() {
	FormApplication.prototype.activateEditor = function (name, options = {}, initialContent = "") {
		const editor = this.editors[name];
		if (!editor) throw new Error(`${name} is not a registered editor name!`);
		options = foundry.utils.mergeObject(editor.options, options);
		options.height = options.target.offsetHeight > 200 ? options.target.offsetHeight : 200;
		if (this instanceof ActorSheet || this instanceof ItemSheet) {
			options.toolbar = "bold italic bullist numlist hr removeformat save";
			options.plugins = "lists quickbars hr save";
			options.save_enablewhendirty = false;
		}
		TextEditor.create(options, initialContent || editor.initial).then((mce) => {
			editor.mce = mce;
			editor.changed = false;
			editor.active = true;
			mce.focus();
			mce.on("change", (ev) => (editor.changed = true));
		});
	};
}
