export function getSpeakerDocument(chatMessage) {
	const speakerObj = chatMessage.data.speaker;
	const scene = game.scenes.get(speakerObj.scene);
	const token = scene?.tokens?.get(speakerObj.token);
	if (!!token && !token?.isLinked) return token;
	else if (speakerObj.actor) return game.actors.get(speakerObj.actor);
	else return null;
}
