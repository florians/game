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
    // clone skill for player specific change to it
    if (actor.mergeSkills != "") {
      $.each(actor.mergeSkills, function (bIndex, bVal) {
        if (aIndex == bIndex) {
          skillArray[aIndex] = true;
        }
      });
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
// clear fightlog
function clearFightlog() {
  game.fightlog = [];
}
// gets last occurence of 
function findLastNumberSize() {
  return parseInt(context.font.match(/(\d+)(?!.*\d)/))
}