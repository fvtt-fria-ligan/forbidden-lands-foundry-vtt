export class ForbiddenLandsActor extends Actor {
  createEmbeddedEntity(embeddedName, data, options) {
    // Replace randomized attributes like "[[d6]] days" with a roll
    let newData = duplicate(data);
    const inlineRoll = /\[\[(\/[a-zA-Z]+\s)?([^\]]+)\]\]/gi;
    if (newData.data) {
      for (let key of Object.keys(newData.data)) {
        if (typeof newData.data[key] === "string") {
          newData.data[key] = newData.data[key].replace(
            inlineRoll,
            (match, contents, formula) => new Roll(formula).roll().total
          );
        }
      }
    }
    super.createEmbeddedEntity(embeddedName, newData, options);
  }
}
