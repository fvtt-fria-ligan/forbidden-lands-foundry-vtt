---
"forbidden-lands": patch
---

- Removes the combat module in favour of Year Zero Combat which is now required. Fixes to slow fast actions are being implemented in https://github.com/fvtt-fria-ligan/yearzero-combat-fvtt/pull/38
- Fixes an issue where roll modifiers were not applied to rolls
- Fixes an issue where the fast and slow actions had the wrong icons (#389)

If a token i stuck with old icons, it is possible to create a script macro that deletes all active effects on the current scene:

```js
canvas.scene.tokens.map((token) => {
  const actor = token.actor;
  actor.deleteEmbeddedDocuments(
    "ActiveEffect",
    actor.effects.map((e) => e.id)
  );
});
```
