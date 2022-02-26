export default (() => {
	const args = process.argv.slice(2);
	if (args.length === 0) return;
	return args.reduce((acc, arg, index, arr) => {
		if (arg.startsWith("--")) {
			let [key, value] = arg.split("=");
			if (!value) {
				if (index + 1 < arr.length && !arr[index + 1].startsWith("--")) {
					value = arr.splice(index + 1, 1).join();
				} else value = true;
			}
			acc[key.replace("--", "")] = value;
		}

		return acc;
	}, {});
})();
