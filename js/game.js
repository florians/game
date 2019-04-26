// get the canvas
var canvas = document.getElementById('canvas');

// returns a drawing context
var context = canvas.getContext('2d');

var game = {
  /* debug
    - disable status fight / pause
  */
  debug: 0,
  // game language text > lang.js
  gameLangauge: "en",
  // actors object
  actors: {},
  // buttons in lobby stage
  lobbyButtons: [
    //{ name: "arena" },
    { name: "fight" },
  ],
  // buttons in fight stage
  fightButtons: [
    { name: "lobby" }
  ],
  // log array
  fightlog: [],

  // enemy config
  // sprite max enemy images in folder 1-N
  enemySpriteMax: 11,
  // starter sprite
  enemySpriteNr: 3,
  // names for random monster
  monsterNames: ["Giants", "Bomb", "Reptilian Humanoid", "Wolf", "Undead", "Ghosts", "Zombie", "Skeletons", "Spider", "Bats", "Flan", "Giant Rat", "Skeleton Warriors", "Ghoul", "Vampire", "Orcs", "Bears", "Cyclops", "Witch", "Wizards", "Warlock", "Spellcaster", "Demon", "Mummy", "Ogres", "Minotaurs", "Werewolves", "Gnolls", "Elementals", "Ants", "Chimera", "Beholder", "Snakes", "Harpy", "Bandit", "Scorpions", "Lich", "Hydra", "Basilisks", "Adamantoise", "Angel", "Evil Monk", "Soldier", "Cthulhu", "Necromancers", "Elves", "Dwarves", "Griffons", "Turtle", "Ninja", "Centipede", "Shaman", "Lions", "Cat", "Rogues", "Giant Enemy Crab", "Crab", "Centaurs", "Gremlins", "Halflings", "Hellhound", "Cockatrice", "Roc", "Lamia", "Merfolk", "Berserkers", "Barghest", "Arachnoid", "The Tuurngait", "Nymphs", "Amazon", "Ifrit", "Satyr", "Wyvern", "Gnomes", "Beastmen", "Titan", "Phoenix", "Unicorn", "Genie", "Werehog", "Worgen", "Slime Monster", "Boar", "Tonberry", "Cactuar", "Druids", "Succubus", "Owlbear", "Gorgons", "Sea Monster", "Dryads", "Manticore", "Dark Elves"],
  // attack delay so it feels more natural
  attackDelay: 500,

  // background points
  // sky
  sky: [
    { color: "#6BCCF260", points: generateTerrain(canvas.width, canvas.height, canvas.height * 0.4, 0.2) },
    { color: "#52B5F260", points: generateTerrain(canvas.width, canvas.height, canvas.height * 0.4, 0.4) },
    { color: "#22A2F260", points: generateTerrain(canvas.width, canvas.height, canvas.height * 0.4, 0.2) }
  ],
  // grass
  grass: [
    { color: "#00676695", points: generateTerrain(canvas.width, canvas.height * 1.5, canvas.height * 0.4, 0.5) },
    { color: "#7BC7BD95", points: generateTerrain(canvas.width, canvas.height * 1.5, canvas.height * 0.4, 0.3) },
    { color: "#D3E1B095", points: generateTerrain(canvas.width, canvas.height * 1.5, canvas.height * 0.4, 0.5) },
    { color: "#6F644695", points: generateTerrain(canvas.width, canvas.height * 1.5, canvas.height * 0.4, 0.3) }
  ],
  // is true when someone died
  end: false,

  draggedObj: {},
  infoBox: {}
}

// generate player 
newPlayer();
// debug click event replace with click and remove interval

if (game.debug) {
  var interval;
  canvas.addEventListener('mousedown', (e) => {
    const mPos = {
      x: e.clientX,
      y: e.clientY
    };
    interval = setInterval(function () {
      checkCollision(mPos, game.actors);
    }, 50);
  });
  canvas.addEventListener('mouseup', (e) => {
    clearInterval(interval);
  });
} else {
  canvas.addEventListener('click', (e) => {
    const mPos = {
      x: e.clientX,
      y: e.clientY
    };
    checkCollision(mPos);
  });
  canvas.addEventListener('mousedown', function (e) {
    var mPos = {
      x: e.clientX,
      y: e.clientY
    };
    game.draggedObj = getItemCollision(mPos);
  });
  canvas.addEventListener('mousemove', function (e) {
    var mPos = {
      x: e.clientX,
      y: e.clientY
    };
    if (game.draggedObj.index >= 0) {
      game.draggedObj.mPos = mPos;
      dragItem(game.draggedObj);
    }
    getInfoOnCollision(mPos);
  });
  canvas.addEventListener('mouseup', function (e) {
    var mPos = {
      x: e.clientX,
      y: e.clientY
    };
    if (game.draggedObj.index >= 0) {
      $.each(getPlayer().gear, function (index, gearSlot) {
        if (game.draggedObj.item && game.draggedObj.item.part == index) {
          if (isColliding(mPos, gearSlot.pos)) {
            addItemToGear(getPlayer(), game.draggedObj);
            game.draggedObj = {};
          }
        }
      });
      if (game.draggedObj.index >= 0) {
        game.actors.player.items[game.draggedObj.index].isDragged = false;
        game.draggedObj = {};
      }
    }
  });
}
function addItemToGear(actor, draggedObj) {
  $.each(actor.gear, function (index, gearSlot) {
    if (index == draggedObj.item.part) {
      getPlayer().gear[index] = draggedObj.item;
      delete actor.items[draggedObj.index];
      actor.items = actor.items.filter(Boolean);
    }
  });
  localStorage.player = JSON.stringify(getPlayer());
}
// debug click event replace with click and remove interval



// call draw function
draw();


