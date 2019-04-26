function getLang(name, content) {
  if (content) {
    i = 0;
    replaceVal = replaceSpecialCharacters(lang[game.gameLangauge][name]);
    content.forEach(c => {
      replaceVal = replaceVal.replace("?", c);
      i++;
    });
    return replaceVal;
  } else {
    return replaceSpecialCharacters(lang[game.gameLangauge][name]);
  }
}
function replaceSpecialCharacters(line) {
  line = line.replace(/Ä/g, '\xC4');
  line = line.replace(/ä/g, '\xE4');
  line = line.replace(/Ö/g, '\xD6');
  line = line.replace(/ö/g, '\xF6');
  line = line.replace(/Ü/g, '\xDC');
  line = line.replace(/ü/g, '\xFC');
  return line;
}
lang = {}
lang["en"] = {
  str: "Strength",
  dex: "Dexterity",
  int: "Intelligence",
  exp: "Experience",
  mp: "Mp Cost",
  val_dmg: "Damage",
  val_dot: "Damage",
  val_heal: "Heal",
  turns: "Duration",
  part: "Part",
  rarity: "Rarity",
  critchance: "Crit Chance",
  lvl: "Level",
  level: "Level",
  enterName: "Please enter your Name",
  fight: "Fight",
  arena: "Arena",
  lobby: "Give up!",
  lost: "You Lost!!",
  // gear parts
  chest: "Body Armour",
  shoulders: "Shoulders",
  boots: "Boots",
  gloves: "Gloves",
  head: "Helmet",
  amulet: "Amulet",
  belt: "Belt",
  ring: "Ring",
  weapon: "Weapon",
  // replace texts
  dmg: "takes ? damage",
  dot: "takes ? damage from DoT",
  heal: "gets ? life from Heal",
  hot: "gets ? life from HoT",
  death: "died",
  win: "? won!!",
  expgain: "earns ? exp",
  lvlup: "reached Level ?"
}