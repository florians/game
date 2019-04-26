// create a sprite image
function createSprite(link) {
  sprite = new Image();
  sprite.src = link;
  return sprite
}

// return the local player
function getPlayer() {
  $.each(game.actors, function (index, actor) {
    if (actor != null && actor.role == "player") {
      player = actor;
    }
  });
  return player;
}
// get the target
function getTarget(target) {
  var enemy = target;
  $.each(game.actors, function (index, actor) {
    if (actor != null && actor.role != target.role) {
      enemy = actor;
    }
  });
  return enemy;
}
// fightlog
function fightLog(line, actor, type) {
  pushArray = [];
  pushArray[0] = actor;
  pushArray[1] = line;
  pushArray[2] = type;
  if (game.fightlog.length < 15) {
    game.fightlog.push(pushArray);
  } else {
    game.fightlog.shift();
    game.fightlog.push(pushArray);
  }
}

// merge local skills with skill from DB
function getSkillsFromDB(actor) {
  skillArray = {};
  $.each(actor.mySkills, function (aIndex, aVal) {
    if (actor.mergeSkills != "") {
      $.each(actor.mergeSkills, function (bIndex, bVal) {
        if (aIndex == bIndex) {
          skillArray[aIndex] = true;
        }
      });
      // clone skill for player or merge from local skills
      if (skillArray[aIndex] == true) {
        skillArray[aIndex] = $.extend(true, {}, actor.mergeSkills[aIndex]);
      } else {
        skillArray[aIndex] = $.extend(true, {}, skillsDB[aVal]);
      }
    } else {
      skillArray[aIndex] = $.extend(true, {}, skillsDB[aVal]);
    }
  });
  return skillArray;
}
function getItemsFromDB(actor, rarity) {
  itemArray = [];
  $.each(actor.mergeItems, function (aIndex, aVal) {
    // if local take that else new from itemsDB
    if (!isNaN(aVal)) {
      itemArray[aIndex] = addItemRarity(actor, $.extend(true, {}, itemsDB.base[aVal]), rarity);
    } else {
      itemArray[aIndex] = aVal;
    }
  });
  return itemArray;
}

function addItemRarity(actor, item, rarity) {
  newItem = {};
  if (item) {
    if (rarity) {
      rarityMultiplier = getRarity(rarity).multiplier;
      rarityName = getRarity(rarity).name;
      rarityColor = getRarity(rarity).color;
    } else {
      nr = Math.floor(Math.random() * 100) + 1;
      $.each(itemsDB.rarity, function (index, rarity) {
        min = rarity.range.split("-")[0];
        max = rarity.range.split("-")[1];
        if (nr >= min && nr <= max) {
          rarityMultiplier = rarity.multiplier;
          rarityName = rarity.name;
          rarityColor = rarity.color;
        }
      });
    }
    newItem = item;
    newItem.stats = {
      str: statRandomizer(actor.level) * rarityMultiplier,
      dex: statRandomizer(actor.level) * rarityMultiplier,
      int: statRandomizer(actor.level) * rarityMultiplier
    }
    newItem.rarity = rarityName;
    newItem.color = rarityColor;
  }

  return newItem;
}
function getRandomItem() {
  chance = Math.floor(Math.random() * 10) + 1;
  if (chance > 8) {
    gearType = Math.floor(Math.random() * elements.gear.parts.length) + 1;
    rarity = Math.floor(Math.random() * 5) + 1;
    getPlayer().items[getPlayer().items.length] = addItemRarity(getPlayer(), $.extend(true, {}, itemsDB.base[gearType]), rarity);
    return true;
  }
  return false;
}
function getRarity(nr) {
  var newRarity;
  $.each(itemsDB.rarity, function (index, rarity) {
    if (nr == rarity.nr) {
      newRarity = rarity;
    }
  });
  return newRarity;
}
function getRarityByName(name) {
  var newRarity;
  $.each(itemsDB.rarity, function (index, rarity) {
    if (name == rarity.name) {
      newRarity = rarity;
    }
  });
  return newRarity;
}
// returns stats + random amount
function statRandomizer(stat, max = 3) {
  seed = (Math.floor(Math.random() * max))
  if (Math.random() > 0.5) {
    stat = Math.abs(stat + seed);
  } else {
    stat = Math.abs(stat - seed);
  }
  return stat
}

function getGearStats(actor, type) {
  var stats = {
    str: 0,
    dex: 0,
    int: 0
  }
  $.each(actor.stats, function (aIndex, line) {
    statFromGear = 0;
    if (actor.gear) {
      $.each(actor.gear, function (bIndex, gear) {
        if (gear.name) {
          $.each(gear.stats, function (cIndex, stat) {
            if (aIndex == cIndex) {
              stats[aIndex] += stat;
            }
          });
        }
      });
    }
  });
  if (type) {
    return stats[type];
  } else {
    return stats;
  }
}

// clear fightlog
function clearFightlog() {
  game.fightlog = [];
}
// gets last occurence of 
function findLastNumberSize() {
  return parseInt(context.font.match(/(\d+)(?!.*\d)/))
}
function isObject(value) {
  return value && typeof value === 'object' && value.constructor === Object;
}