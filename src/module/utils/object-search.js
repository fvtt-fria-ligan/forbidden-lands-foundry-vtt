export function objectSearch(object, string) {
	if (!validateObject(object) || !validateString(string)) throw new Error("Invalid arguments");
	const result = Object.entries(object).find((entries) => entries[1] === string);
	return result ? result[0] : null;
}

function validateObject(object) {
	return !!object && typeof object === "object" && !foundry.utils.isObjectEmpty(object);
}

function validateString(string) {
	return !!string && typeof string === "string";
}
