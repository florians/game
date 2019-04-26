function actorDmg(actor, skill, type = "dmg") {
  var weight = {
    str: 1,
    dex: 0.2,
    int: 0.1
  }
  skillDmg = 0;
  if (skill) {
    if (type == "dot") {
      skillDmg = skill.val / 5;
    } else {
      skillDmg = skill.val;
    }
    switch (skill.base) {
      case "str":
        weight = {
          str: 1,
          dex: 0.2,
          int: 0.1
        }
        break;
      case "dex":
        weight = {
          str: 0.2,
          dex: 1,
          int: 0.1
        }
        break;
      case "int":
        weight = {
          str: 0.1,
          dex: 0.2,
          int: 1
        }
        break;
    }
  }
  stats = getGearStats(actor);
  stats.str = stats.str + actor.stats.str;
  stats.dex = stats.dex + actor.stats.dex;
  stats.int = stats.int + actor.stats.int;
  strDmg = (skillDmg + stats.str) * weight.str;
  dexDmg = (skillDmg + stats.dex) * weight.dex;
  intDmg = (skillDmg + stats.int) * weight.int;
  return Math.floor((strDmg + dexDmg + intDmg) * dmgMultiplier(stats));
}
function actorHeal(actor, skill) {
  skillHeal = skill.val;
  strHeal = (skillHeal + actor.stats.str) * 0.1;
  dexHeal = (skillHeal + actor.stats.dex) * 0.2;
  intHeal = (skillHeal + actor.stats.int);
  return Math.floor((strHeal + dexHeal + intHeal) * dmgMultiplier(actor.stats));
}
function dmgMultiplier(stats) {
  critBase = stats.dex * 0.2; // dex * 0.2
  missBase = 5; // later * hit chance
  normal = 100 - missBase - critBase;
  crit = Math.floor(100 - critBase + Math.floor(critBase * 0.98));
  multiplier = 1;
  nr = Math.floor(Math.random() * 100) + 1;
  switch (true) {
    case (nr < missBase):
      multiplier = 0;
      break;
    case (nr < normal):
      multiplier = 1;
      break;
    case (nr < crit):
      multiplier = 2;
      break;
    case (nr <= 100):
      multiplier = 3;
      break;
  }
  return multiplier;
}