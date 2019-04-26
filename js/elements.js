function setBaseElements() {
  // set canvas size
  canvas.width = window.innerWidth > 500 ? window.innerWidth : 500;
  canvas.height = window.innerHeight > 500 ? window.innerHeight : 500;

  // define element container basics
  var elements = {
    smallFont: "15px Arial",
    normalFont: "15px Arial",
    bigFont: "20px Arial",
    hp: {
      w: canvas.width * 0.3,
      h: 30,
      bg: "#ff000045",
      fg: "#FF0000",
      fontcolor: "#FFF"
    },
    mp: {
      w: canvas.width * 0.3,
      h: 30,
      bg: "#000fff45",
      fg: "#000fff",
      fontcolor: "#FFF"
    },
    exp: {
      w: canvas.width,
      h: 30,
      bg: "#ffd60045",
      fg: "#ffd600",
      fontcolor: "#FFF"
    },
    spriteSize: {
      w: canvas.width * 0.3,
      h: canvas.width * 0.3 < canvas.height / 5 ? canvas.width * 0.3 : canvas.height / 5,
    },
    stats: {
      fight_w: canvas.width * 0.3,
      lobby_w: canvas.width,
      get h() { return canvas.height - (elements.spriteSize.h + elements.hp.h * 3) },
      bg: "#00b4ff"
    },
    gear: {
      x: canvas.width * 0.3,
      get y() { return elements.spriteSize.h + elements.hp.h * 2 },
      parts: ["chest", "shoulders", "boots", "gloves", "head", "amulet", "belt", "ring", "weapon"]
    },
    inventory: {
      x: canvas.width * 0.3,
      w: canvas.width * 0.7,
      bg: "#00b44f40"
    },
    log: {
      player: "#ff7800",
      target: "#FFFFFF60",
      type: {
        dmg: "#f44336",
        dot: "#7c48da",
        heal: "#4caf50",
        exp: "#ffd600"
      },
      default: "#000",
      bg: "#00000070"
    },
    lobbyButtons: {
      x: canvas.width * 0.7,
      y: 0,
      get h() { return elements.hp.h },
      w: canvas.width * 0.3
    },
    fightButtons: {
      x: 0,
      get y() { return canvas.height - elements.hp.h * 2 },
      get h() { return elements.hp.h },
      w: canvas.width * 0.3,
      font: "15px Arial"
    },
    // positions when left or right character
    positions: function (direction) {
      var position = {};
      if (direction == "l") {
        position = {
          name_x: 5,
          player_x: 0,
          player_y: 0,
          hp_x: 0,
          mp_x: 0,
          exp_x: 0,
          stats_x: 0,
        }
      } else if (direction == "r") {
        position = {
          name_x: canvas.width * 0.7 + 5,
          player_x: canvas.width * 0.7,
          player_y: 0,
          hp_x: canvas.width * 0.7,
          mp_x: canvas.width * 0.7,
          stats_x: canvas.width * 0.7,
        }
      }
      positionCalc = {
        get name_y() { return elements.spriteSize.h + elements.hp.h * 3 },
        get hp_y() { return elements.spriteSize.h },
        get mp_y() { return elements.spriteSize.h + elements.mp.h },
        get exp_y() { return canvas.height - elements.mp.h },
        get stats_y() { return elements.spriteSize.h + elements.hp.h * 2 },
        get statInfo_y() { return elements.spriteSize.h + elements.hp.h * 3 + 10 },
      }
      // merge obj
      positions = { ...position, ...positionCalc };
      return positions;
    }
  };
  return elements;
}
elements = setBaseElements();