---
"forbidden-lands": patch
---

Somewhere a regression happened in Foundry, or YZUR where applying modifiers before a roll-object was rolled would make the object immutable. Fixed by moving the roll modification to after evaluating the roll.
