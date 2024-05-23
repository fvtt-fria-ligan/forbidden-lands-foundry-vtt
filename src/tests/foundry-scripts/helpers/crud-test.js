import Logger from "./logger";
export default async function (
	documentClassName,
	documentType,
	documentName,
	subtype = "",
) {
	try {
		Logger.init();
		const cls = getDocumentClass(documentClassName);
		const created = await cls.__proto__.create({
			type: documentType,
			documentName,
			name: documentName,
			["system.subtype.type"]: subtype,
		});
		await created.sheet.render(true);
		await created.update({ name: `${documentName}-updated` });
		await created.delete();
	} catch (error) {
		Logger.error(error);
	}
}
