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
  $.each(actor.stats, function (index, line) {
    context.fillText(getLang(index) + ": " + line, elements.positions(actor.position).stats_x + 5, elements.positions(actor.position).statInfo_y + 20 * i);
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
    context.fillText(skill.name+" mp: "+skill.mp, elements.positions(actor.position).stats_x + 10, (elements.positions(actor.position).statInfo_y + textHeight + 2) + topMargin);
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