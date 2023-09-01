export function objectSearch(object, string) {
	if (!validateObject(object) || !validateString(string))
		return console.error("Invalid arguments");
	const result = Object.entries(object).find(
		(entries) => entries[1] === string,
	);
	return result ? result[0] : null;
}

function validateObject(object) {
	return (
		!!object && typeof object === "object" && !foundry.utils.isEmpty(object)
	);
}

function validateString(string) {
	return !!string && typeof string === "string";
}
