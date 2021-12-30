export class InfoDialog {
	/**
	 * Display informational message.
	 *
	 * @param  {string}   title
	 * @param  {string}   message
	 * @param  {Function} onClose
	 */
	static show(title, message, onClose) {
		let d = new Dialog({
			title: title,
			content: this.buildDivHtmlDialog(message),
			buttons: {
				ok: {
					icon: '<i class="fas fa-check"></i>',
					label: "OK",
					callback: onClose,
				},
			},
			default: "ok",
			close: onClose,
		});
		d.render(true);
	}

	/**
	 * @param  {string} divContent
	 */
	static buildDivHtmlDialog(divContent) {
		return "<div class='flex row roll-dialog'>" + divContent + "</div>";
	}
}
