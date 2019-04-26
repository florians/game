function newPlayer(actor = null) {
  if (!actor) {
    if (typeof localStorage.player != "undefined") {
      actor = JSON.parse(localStorage.player);
    } else {
      actor = {
        name: prompt(getLang('enterName') + ":")
      }
    }
  }
  if (!actor.bar) {
    actor.bar = {}
  }
  if (!actor.bar.exp) {
    actor.bar.exp = {}
  }
  if (!actor.bar.hp) {
    actor.bar.hp = {}
  }
  if (!actor.bar.mp) {
    actor.bar.mp = {}
  }
  if (!actor.stats) {
    actor.stats = {}
  }
  spritePath = actor.spritePath || "sprites/player/player.png";
  newPlayerStats = {
    name: actor.name || "no name",
    role: actor.role || "player",
    status: actor.status || "fight",
    spritePath: spritePath,
    sprite: createSprite(spritePath),
    level: actor.level || 1,
    location: actor.location || "lobby",
    mySkills: actor.mySkills || [1, 4, 5],
    bar: {
      exp: {
        now: actor.bar.exp.now || 0,
        max: actor.bar.exp.max || 200
      },
      hp: {
        max: actor.bar.hp.now || 500,
        now: actor.bar.hp.max || 500
      },
      mp: {
        max: actor.bar.mp.now || 100,
        now: actor.bar.mp.max || 100
      }
    },
    stats: {
      str: actor.stats.str || 10,
      dex: actor.stats.dex || 10,
      int: actor.stats.int || 10
    }
  };
  // skills
  newPlayerStats.mergeSkills = actor.skills || [];
  newPlayerStats.skills = getSkillsFromDB(newPlayerStats);
  newPlayerStats.mergeSkills = [];

  if (newPlayerStats.role == "player") {
    newPlayerStats.location = "lobby";
    // gear
    newPlayerStats.gear = actor.gear || {};
    // items
    newPlayerStats.mergeItems = actor.items || [1, 2, 3, 4, 5, 6, 7, 8, 9];
    newPlayerStats.items = getItemsFromDB(newPlayerStats, 1);
    newPlayerStats.mergeItems = [];


    game.actors["player"] = newPlayerStats;
    localStorage.player = JSON.stringify(newPlayerStats);
    generateEqEnemy(newPlayerStats);
  } else {
    game.actors["target"] = newPlayerStats
    eqEnemySkillLevelUp(game.actors["target"]);
  }
}
function generateEqEnemy(player) {
  skillAmount = (Math.floor(Math.random() * Object.keys(skillsDB).length) + 1);
  skillsList = [];
  for (i = 0; i < skillAmount; i++) {
    nr = Math.floor(Math.random() * Object.keys(skillsDB).length + 1);
    if ($.inArray(nr, skillsList) === -1) {
      skillsList.push(nr);
    }
  }
  enemyHP = (15 * player.level) + statRandomizer(player.bar.hp.now);
  enemyMp = statRandomizer(player.bar.mp.now);
  enemy = {
    name: game.monsterNames[(Math.floor(Math.random() * game.monsterNames.length))],
    role: "target",
    status: "pause",
    spritePath: "sprites/enemy/enemy" + (Math.floor(Math.random() * game.enemySpriteMax) + 1) + ".png",
    location: "fight",
    mySkills: skillsList,
    level: statRandomizer(player.level),
    bar: {
      hp: {
        max: enemyHP,
        now: enemyHP
      },
      mp: {
        max: enemyMp,
        now: enemyMp
      },
    },
    stats: {
      str: statRandomizer(player.stats.str),
      dex: statRandomizer(player.stats.dex),
      int: statRandomizer(player.stats.int)
    }
  }
  newPlayer(enemy);
}