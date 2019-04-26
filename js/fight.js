// handles a fight after clicking a skill
function handleFight(actor, skill) {
  if (actor.role == "player" && actor.bar.mp.now >= skill.mp) {
    handleSkillExp(actor, skill);
  }
  handleMp(actor, skill);
  handleSkillType(actor, skill);
}
// depending on skill type different stuff happens
function handleSkillType(actor, skill) {
  if (actor.bar.mp.now > skill.mp) {
    switch (skill.type) {
      case "dmg":
        handleDmg(actor, skill);
        break;
      case "dot":
        handleDmg(actor, skill);
        handleDot(actor, skill);
        break;
      case "heal":
        handleHeal(actor, skill);
        break;
    }
  } else {
    handleDmg(actor);
  }
  handleOverTimeEffects(actor);
}
// handle dmg
function handleDmg(actor, skill) {
  damage = actorDmg(actor, skill);
  removeHp(getTarget(actor), damage);
}
// remove hp > hp == 0 death
function removeHp(target, damage, logType = "dmg") {
  if (target.bar.hp.now > 0) {
    if (target.bar.hp.now >= damage && target.bar.hp.now - damage != 0) {
      target.bar.hp.now = target.bar.hp.now - damage
      // add dmg to log
      fightLog(getLang(logType, [damage]), target, logType);
    } else {
      target.bar.hp.now = 0;
    }
  }
  if (target.bar.hp.now == 0) {
    handleDeath(target, damage);
  }
}
// defines what happens when a actor dies
function handleDeath(actor, damage) {
  handleWin(getTarget(actor), damage);
  resetFight();
  newEnemy();
  if (actor.role == "target") {
    handleExp(getTarget(actor));
  } else {
    if (!game.debug) {
      getPlayer().location = "lobby";
      clearFightlog();
    }
  }
  if (getRandomItem() == true) {
    getPlayer().location = "lobby";
  }
  getPlayer().status = "fight";
  localStorage.player = JSON.stringify(getPlayer());
  game.end = true;
}
// resets a fight
function resetFight(location) {
  $.each(game.actors, function (index, actor) {
    actor.bar.hp.now = actor.bar.hp.max;
    actor.bar.mp.now = actor.bar.mp.max;
    actor.dot = null;
    actor.hot = null;
  });
}
function newEnemy() {
  // new enemy + sprite
  if (game.actors["target"]) {
    game.actors["target"] = null;
    generateEqEnemy(getPlayer());
    enemySpriteNr = Math.floor(Math.random() * game.enemySpriteMax) + 1;
    game.actors["target"].sprite = createSprite("sprites/enemy/enemy" + enemySpriteNr + ".png");
    drawSprite(game.actors["target"]);
  }
}
// handles dot / hot
function handleOverTimeEffects(actor) {
  if (actor.hot && actor.hot.delay == 0) {
    addHp(actor, actor.hot.val, "hot");
    if (actor.hot && actor.hot.turns > 1) {
      actor.hot.turns = actor.hot.turns - 1;
    } else {
      actor.hot = null;
    }
  }
  if (actor.dot && actor.dot.delay == 0) {
    removeHp(actor, actor.dot.val, "dot");
    if (actor.dot && actor.dot.turns > 1) {
      actor.dot.turns = actor.dot.turns - 1;
    } else {
      actor.dot = null;
    }
  }
  if (actor.hot) {
    if (actor.hot.delay <= 1) {
      actor.hot.delay = 0;
    } else {
      actor.hot.delay = actor.hot.delay - 1;
    }
  }
  if (actor.dot) {
    if (actor.dot.delay <= 1) {
      actor.dot.delay = 0;
    } else {
      actor.dot.delay = actor.dot.delay - 1;
    }
  }
}


// handle dots on target
function handleDot(actor, skill) {
  target = getTarget(actor);
  damage = actorDmg(actor, skill, "dot");
  if (target.dot) {
    oldDot = target.dot;
  } else {
    oldDot = 0;
  }
  target.dot = {
    val: oldDot.val > damage ? oldDot.val : damage,
    turns: skill.turns,
    delay: oldDot.delay < 1 ? oldDot.delay : 1,
  }
}
// handle a heal on target
function handleHeal(actor, skill) {
  heal = actorHeal(actor, skill);
  addHp(actor, heal);
  if (skill.turns) {
    if (actor.hot) {
      oldHot = actor.hot;
    } else {
      oldHot = 0;
    }
    actor.hot = {
      val: oldHot.val > Math.floor(heal / 5) ? oldHot.val : Math.floor(heal / 5),
      turns: skill.turns,
      delay: oldHot.delay < 1 ? oldHot.delay : 1,
    }
  }
}
// adds heal
function addHp(actor, heal, logType = "heal") {
  lostHp = actor.bar.hp.max - actor.bar.hp.now;
  if (lostHp >= heal) {
    actor.bar.hp.now = actor.bar.hp.now + heal;
  } else {
    actor.bar.hp.now = actor.bar.hp.max;
  }
  fightLog(getLang(logType, [heal]), actor, "heal");
}

// handle mp
function handleMp(actor, skill) {
  if (actor.bar.mp.now >= skill.mp) {
    actor.bar.mp.now = actor.bar.mp.now - skill.mp;
  }
}
// how to handle a win
function handleWin(actor, damage) {
  target = getTarget(actor);
  fightLog(getLang("dmg", [damage]), target, "dmg");
  fightLog(getLang("death"), target, "dmg");
}
// give out exp
function handleExp(actor) {
  expGain = Math.floor(actor.bar.exp.max / actor.level);
  expLeft = Math.floor((actor.bar.exp.max - actor.bar.exp.now) - expGain);
  if (expLeft > 0) {
    actor.bar.exp.now += expGain;
  } else {
    leftInLevel = expLeft == 0 ? 0 : expGain - Math.floor((actor.bar.exp.max - actor.bar.exp.now));
    levelUp(actor);
    actor.bar.exp.now = 0;
    actor.bar.exp.now += leftInLevel;
  }
  fightLog(getLang("expgain", [expGain]), actor, "exp");
}
function handleSkillExp(actor, skill) {
  if (skillHasExp(skill) == true) {
    $.each(actor.skills, function (index, aSkill) {
      if (aSkill.name === skill.name) {
        if (actor.skills[index].exp.now == actor.skills[index].exp.max) {
          actor.skills[index].level = actor.skills[index].level + 1;
          actor.skills[index].val = Math.floor(actor.skills[index].val * 1.1);
          actor.skills[index].mp = actor.skills[index].mp + 1;
          expNow = 0;
          maxExp = actor.skills[index].exp.max + 10;
        } else {
          expNow = actor.skills[index].exp.now + 1;
          maxExp = actor.skills[index].exp.max;
        }
        actor.skills[index].exp = {
          max: maxExp,
          now: expNow
        }
      }
    });
  } else {
    $.each(actor.skills, function (index, aSkill) {
      if (aSkill.name === skill.name) {
        actor.skills[index].level = 1;
        actor.skills[index].exp = {
          max: 10,
          now: 1
        }
      }
    });
  }
}
function skillHasExp(skill) {
  if (skill.exp) {
    return true;
  }
  return false;
}
// handle a lvl up
function levelUp(actor, multiplier = 1) {
  actor.level += 1 * multiplier;
  actor.stats.str += 5 * multiplier;
  actor.stats.dex += 5 * multiplier;
  actor.stats.int += 5 * multiplier;
  actor.bar.hp.max += (15 * actor.level) * multiplier;
  actor.bar.mp.max += 10 * multiplier;
  // fill up after lvl up
  actor.bar.hp.now = actor.bar.hp.max;
  actor.bar.mp.now = actor.bar.mp.max;
  actor.stats.critchance = Math.floor((actor.stats.dex * 0.2) * 100) / 100 + "%";
  for (var i = 1; i <= multiplier; i++) {
    actor.bar.exp.max = Math.floor(actor.bar.exp.max * (1.1));
  }
  fightLog(getLang("lvlup", [actor.level]), actor, "exp");
}
// np attack
function targetAutoAttack(actor) {
  attackNr = Math.floor(Math.random() * actor.mySkills.length) + 1;
  i = 1;
  var randomAttack = "";
  $.each(actor.skills, function (index, skill) {
    if (i == attackNr) {
      randomAttack = skill;
    }
    i++;
  });
  handleFight(actor, randomAttack);
  getPlayer().status = "fight";
}
function eqEnemySkillLevelUp(actor) {
  $.each(actor.skills, function (index, skill) {
    actor.skills[index].level = statRandomizer(actor.level);
    for (var i = 1; i <= statRandomizer(actor.level); i++) {
      actor.skills[index].val = Math.floor(actor.skills[index].val * 1.1);
    }
    for (var i = 1; i <= statRandomizer(actor.level); i++) {
      actor.skills[index].mp = actor.skills[index].mp + 1;
    }
  });
}