function draw() {
  elements = setBaseElements();
  generateElements(game.actors);
  requestAnimationFrame(draw);
}

function generateElements(actors) {
  actor = getPlayer();
  actor.position = actor.role == "player" ? "l" : "r";
  switch (actor.location) {
    case "lobby":
      drawBackground(actor);
      drawLobbyButtons(game.lobbyButtons, 'lobby');
      drawSprite(actor);
      drawBars(actor);
      drawResourceContainer(actor);
      drawName(actor);
      drawStatInfo(actor);
      drawSkills(actor);
      drawGearContainer(actor);
      drawInventory(actor);
      break;
    case "fight":
      drawBackground(actor);
      $.each(actors, function (index, actor) {
        actor.position = actor.role == "player" ? "l" : "r";
        drawSprite(actor);
        drawBars(actor);
        drawResourceContainer(actor);
        drawName(actor);
        drawStatInfo(actor);
        drawSkills(actor);
        drawLog(game.fightlog);
      });
      drawLobbyButtons(game.fightButtons, 'fight');
      break;
  }
  if (game.infoBox.obj) {
    drawInfoBox();
  }
}

function drawLobbyButtons(buttons, name) {
  i = 0;
  $.each(buttons, function (index, location) {
    spacer = i == 0 ? i : 5
    rect_x = elements[name + "Buttons"].x;
    rect_y = elements[name + "Buttons"].y + spacer * i + elements[name + "Buttons"].h * i;
    rect_w = elements[name + "Buttons"].w;
    rect_h = elements[name + "Buttons"].h;
    context.fillStyle = "#00000080";
    context.fillRect(rect_x, rect_y, rect_w, rect_h);
    context.fillStyle = "#FFF";
    context.font = elements.normalFont;
    context.fillText(getLang(location.name), rect_x + rect_w / 2 - (context.measureText(getLang(location.name)).width / 2), elements[name + "Buttons"].y + (rect_h / 1.5) + (spacer * i * 7));
    buttons[i] = {
      name: location.name,
      x: rect_x,
      y: rect_y,
      w: rect_w,
      h: rect_h
    }
    i++;
  });
}

function drawName(actor) {
  context.font = elements.bigFont;
  context.fillStyle = "#000";
  context.textAlign = "left";
  context.fillText(actor.name, elements.positions(actor.position).name_x, elements.positions(actor.position).name_y);
}
function drawBars(actor) {
  context.font = elements.normalFont;
  $.each(actor.bar, function (index, bar) {
    if (actor.role == "player" || (actor.role == "target" && index != "exp")) {
      // bar background
      context.fillStyle = elements[index].bg;
      context.fillRect(elements.positions(actor.position)[index + "_x"], elements.positions(actor.position)[index + "_y"], elements[index].w, elements[index].h);
      // bar forground
      context.fillStyle = elements[index].fg;
      context.fillRect(elements.positions(actor.position)[index + "_x"], elements.positions(actor.position)[index + "_y"], (elements[index].w / bar.max) * bar.now, elements[index].h);
      // text on bar
      context.font = elements.normal;
      context.fillStyle = elements[index].fontcolor;
      txt = bar.max + ' | ' + bar.max;
      context.textAlign = "right";
      context.fillText(bar.now + ' | ' + bar.max, elements.positions(actor.position)[index + "_x"] + (elements[index].w / 2) + context.measureText(txt).width / 2, elements.positions(actor.position)[index + "_y"] + elements[index].h / 1.5);
    }
  });
}
function drawSprite(actor) {
  context.fillStyle = "#FFFFFF00";
  context.fillRect(elements.positions(actor.position).player_x, elements.positions(actor.position).player_y, elements.spriteSize.w, elements.spriteSize.h);
  h = elements.spriteSize.w > elements.spriteSize.h ? elements.spriteSize.h : elements.spriteSize.w;
  w = elements.spriteSize.h > elements.spriteSize.w ? elements.spriteSize.w : elements.spriteSize.h;
  y = elements.positions(actor.position).player_y + (elements.spriteSize.h - w);
  x = elements.positions(actor.position).player_x + (elements.spriteSize.w / 2) - w / 2;
  context.drawImage(actor.sprite, x, y, w, h);
}

function drawResourceContainer(actor) {
  context.textAlign = "left";
  context.fillStyle = elements.stats.bg;
  context.fillRect(elements.positions(actor.position).stats_x, elements.positions(actor.position).stats_y, elements.stats[actor.location + "_w"], elements.stats.h);
}
function drawStatInfo(actor) {
  context.font = elements.normalFont;
  context.fillStyle = "#000";
  context.fillText(getLang("lvl") + ": " + actor.level, elements.positions(actor.position).stats_x + 5, elements.positions(actor.position).statInfo_y + 20);
  i = 2;
  // add crit chance to it
  actor.stats.critchance = Math.floor((actor.stats.dex * 0.2) * 100) / 100 + "%";
  critChance = 0;
  stats = getGearStats(actor);
  $.each(actor.stats, function (aIndex, line) {
    if (aIndex == "dex") {
      critChance = Math.floor(((line + stats.dex) * 0.2) * 100) / 100 + "%";
    }
    newStat = aIndex == "critchance" ? critChance : (line + stats[aIndex]);
    context.fillText(getLang(aIndex) + ": " + newStat, elements.positions(actor.position).stats_x + 5, elements.positions(actor.position).statInfo_y + 20 * i);
    i++;
  });
}
function drawSkills(actor) {
  context.font = elements.bigFont;
  textHeight = findLastNumberSize();
  i = 1;
  $.each(actor.skills, function (index, skill) {
    topMargin = (textHeight * Object.keys(actor.stats).length) + (textHeight * 2) * i;
    rect_x = elements.positions(actor.position).stats_x + 5;
    rect_y = elements.positions(actor.position).statInfo_y + topMargin;
    rect_w = elements.stats.fight_w - 10;
    rect_h = textHeight + 10;
    context.fillStyle = "#00000045";
    context.fillRect(rect_x, rect_y, rect_w, rect_h);
    context.fillStyle = "#000";
    context.fillText(skill.name, elements.positions(actor.position).stats_x + 10, (elements.positions(actor.position).statInfo_y + textHeight + 2) + topMargin);
    context.fillStyle = elements.exp.fg;
    skillExp = skill.exp ? (rect_w / skill.exp.max) * skill.exp.now : 0;
    context.fillRect(rect_x, rect_y + (rect_h - 5), skillExp, 5);
    i++;
    actor.skills[index].pos = {
      x: rect_x,
      y: rect_y,
      w: rect_w,
      h: rect_h
    };
  });
}
function drawGearContainer(actor) {
  // draw gear
  context.font = elements.bigFont;
  context.fillStyle = "#000";
  context.fillText("Gear", elements.gear.x + 5, elements.positions(actor.position).name_y);
  // draw itmes
  if (actor.gear) {
    col = 0;
    row = 0;
    spacer = 5;
    rect_s = 50;
    maxElement = Math.floor((canvas.width * 0.7) / (rect_s + spacer)) - 1;
    $.each(elements.gear.parts, function (index, part) {
      rect_x = elements.gear.x + spacer + ((rect_s + spacer) * col);
      rect_y = elements.positions(actor.position).name_y + 10 + ((rect_s + spacer) * row);
      if (col == maxElement) {
        col = 0;
        row++;
      } else {
        col++;
      }
      context.fillStyle = "#000";
      color = "#FFF";
      if (game.draggedObj.index >= 0) {
        if (game.draggedObj.item.part == part) {
          color = "#ff0000";
          context.fillStyle = "#FFFFFF";
        }
      }
      if (actor.gear[part] && actor.gear[part].part == part) {
        color = actor.gear[part].color;
        context.fillRect(rect_x, rect_y, rect_s, rect_s);
      }
      drawLineSquare(rect_x, rect_y, rect_s, color, 3);
      if (!actor.gear[part]) {
        actor.gear[part] = {};
      }
      actor.gear[part].pos = {
        x: rect_x,
        y: rect_y,
        h: rect_s,
        w: rect_s
      }
    });
    elements.inventory.end_y = rect_y + rect_s * 3;
  }
}
function drawInventory(actor) {
  // draw inventory background
  context.fillStyle = elements.inventory.bg;
  // draw inventory name
  context.font = elements.bigFont;
  context.fillStyle = "#000";
  context.fillText("Inventory", elements.inventory.x + 5, elements.inventory.end_y);

  // draw itmes
  if (actor.items) {
    col = 0;
    row = 0;
    spacer = 5;
    rect_s = 30;
    maxElement = Math.floor((canvas.width * 0.7) / (rect_s + spacer)) - 1;
    draggedObj = [];
    $.each(actor.items, function (index, item) {
      if (item != null && item.isDragged == true) {
        item.draggable = true;
        draggedObj = item;
      }
    });
    $.each(actor.items, function (index, item) {
      if (item && item.isDragged != true) {
        rect_x = elements.inventory.x + spacer + ((rect_s + spacer) * col);
        rect_y = elements.inventory.end_y + 40 + ((rect_s + spacer) * row);
        if (col == maxElement) {
          col = 0;
          row++;
        } else {
          col++;
        }
        context.fillStyle = "#000";
        context.fillRect(rect_x, rect_y, rect_s, rect_s);
        drawLineSquare(rect_x, rect_y, rect_s, item.color);
        item.pos = {
          x: rect_x,
          y: rect_y,
          h: rect_s,
          w: rect_s
        }
        item.draggable = true;
      }
    });
    if (draggedObj.pos) {
      rect_x = draggedObj.pos.x;
      rect_y = draggedObj.pos.y;
      context.fillStyle = "#000";
      context.fillRect(rect_x, rect_y, rect_s, rect_s);
      drawLineSquare(rect_x, rect_y, rect_s, draggedObj.color);
      draggedObj.pos = {
        x: rect_x,
        y: rect_y,
        h: rect_s,
        w: rect_s
      }
      draggedObj.draggable = true;
    }
    draggedObj = [];
  }
}
function drawInfoBox() {
  context.fillStyle = "#000";
  filter = ["pos", "draggable", "isDragged", "color", "base", "type"];
  if (game.infoBox.obj) {
    boxX = (game.infoBox.mPos.x + 200) > canvas.width ? game.infoBox.mPos.x - 200 : game.infoBox.mPos.x;
    context.fillRect(boxX, game.infoBox.mPos.y, 200, 200);
    if (game.infoBox["type"] == "item") {
      drawLineSquare(boxX, game.infoBox.mPos.y, 200, getRarityByName(game.infoBox.obj.rarity).color);
    }
    i = 0;
    if (game.infoBox.obj.rarity) {
      context.fillStyle = getRarityByName(game.infoBox.obj.rarity).color;
    } else {
      context.fillStyle = "#FFF";
    }
    for (var property in game.infoBox.obj) {
      context.font = elements.normalFont;
      textHeight = findLastNumberSize();
      if ($.inArray(property, filter) === -1) {
        if (isObject(game.infoBox.obj[property])) {
          if (property == "exp") {
            context.fillText(getLang("exp") + ": " + game.infoBox.obj[property].now + " / " + game.infoBox.obj[property].max, boxX + 5, game.infoBox.mPos.y + textHeight + 10 + (textHeight * i));
          } else {
            $.each(game.infoBox.obj[property], function (index, propertyChild) {
              i++;
              context.fillText(getLang(index) + ": " + propertyChild, boxX + 5, game.infoBox.mPos.y + textHeight + 10 + (textHeight * i));
            });
            i++;
          }
        } else {
          if (property == "val") {
            propertyName = property + "_" + game.infoBox.obj["type"];
          } else {
            propertyName = property;
          }
          if (property != "name" && property != "part") {
            context.fillText(getLang(propertyName) + ": " + game.infoBox.obj[property], boxX + 5, game.infoBox.mPos.y + textHeight + 10 + (textHeight * i));
          } else if (property == "part") {
            context.fillText(getLang(propertyName) + ": " + getLang(game.infoBox.obj[property]), boxX + 5, game.infoBox.mPos.y + textHeight + 10 + (textHeight * i));
          } else {
            context.font = elements.bigFont;
            context.fillText(game.infoBox.obj[property], boxX + 5, game.infoBox.mPos.y + 25 + (textHeight * i));
          }
        }
        i++;
      }
    }
  }
}
function drawLineSquare(x, y, s, bg, lineWidth = 1) {
  context.lineWidth = lineWidth;
  context.beginPath();
  context.strokeStyle = bg;
  context.moveTo(x, y);
  context.lineTo(x + s, y);
  context.lineTo(x + s, y + s);
  context.lineTo(x, y + s);
  context.lineTo(x, y);
  context.stroke();
}
function drawLog(fightlog) {
  context.font = elements.smallFont;
  context.fillStyle = elements.log.bg;
  if (fightlog) {
    textHeight = findLastNumberSize();
    i = 1;
    if (fightlog.length >= 1) {
      context.fillRect(canvas.width * 0.3, canvas.height - (elements.exp.h + textHeight) - (textHeight * fightlog.length), canvas.width * 0.4, (textHeight * fightlog.length) + elements.exp.h / 2);
    }

    fightlog.forEach(line => {
      // color of name
      context.fillStyle = elements.log[line[0].role] ? elements.log[line[0].role] : elements.log["default"];
      context.fillText(line[0].name + ": ", canvas.width * 0.3 + 5, canvas.height - textHeight * 1.5 - textHeight * i);
      // color of rest
      context.fillStyle = elements.log.type[line[2]] ? elements.log.type[line[2]] : elements.log["default"];
      context.fillText(line[1], canvas.width * 0.3 + 5 + context.measureText(line[0].name + ": ").width, canvas.height - textHeight * 1.5 - textHeight * i);
      i++;
    });
  }
}