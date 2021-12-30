export default class Logger {
	static init() {
		Hooks.once("error", (error) => {
			console.log(error);
		});
	}
}
