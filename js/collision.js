function checkCollision(mPos) {
  if (getPlayer().location == "fight") {
    getFightCollisions(mPos);
  }
  if (getPlayer().location == "lobby") {
    resetFight();
    clearFightlog();
    getLobbyCollisions(mPos);
  }
}
function getFightCollisions(mPos) {
  $.each(getPlayer().skills, function () {
    if (isColliding(mPos, this.pos) && getPlayer().status == "fight") {
      handleFight(getPlayer(), this);
      if (game.end == false) {
        if (!game.debug)
          getPlayer().status = "pause";
        setTimeout(function () {
          targetAutoAttack(getTarget(getPlayer()));
        }, game.attackDelay);
      }
      game.end = false;
    }
  });
  // collision on buttons in a fight
  $.each(game.fightButtons, function () {
    if (isColliding(mPos, this)) {
      getPlayer().location = this.name;
    }
  });
}
// collision on buttons in lobby
function getLobbyCollisions(mPos) {
  $.each(game.lobbyButtons, function () {
    if (isColliding(mPos, this)) {
      getPlayer().location = this.name;
      localStorage.player = JSON.stringify(getPlayer());
    }
  });
}
function getItemCollision(mPos) {
  draggedObj = {};
  $.each(getPlayer().items, function (index, item) {
    if (item && item.pos && isColliding(mPos, item.pos)) {
      if (item.draggable == true) {
        draggedObj.mPos = mPos;
        draggedObj.index = index;
        draggedObj.item = item;
        draggedObj.isDragged = true;
      }
    }
  });
  return draggedObj;
}
function getInfoOnCollision(mPos) {
  var info, type;
  $.each(game.actors, function (index, actor) {
    //skills
    $.each(actor.skills, function (index, skill) {
      if (skill.pos && isColliding(mPos, skill.pos)) {
        info = skill;
        type = "skill";
      }
    });
    // items
    if (actor.items) {
      $.each(actor.items, function (index, item) {
        if (item && item.pos && isColliding(mPos, item.pos)) {
          info = item;
          type = "item";
          if (item.isDragged == true) {
            return false;
          }
        }
      });
    }
    if (actor.gear) {
      $.each(actor.gear, function (index, item) {
        if (item && item.pos && isColliding(mPos, item.pos)) {
          if (item.name) {
            info = item;
            type = "item";
            if (item.isDragged == true) {
              return false;
            }
          }
        }
      });
    }
  });
  game.infoBox = {
    obj: info,
    mPos: mPos,
    type: type
  }
}
function dragItem(obj) {
  game.actors.player.items[obj.index].isDragged = true;
  game.actors.player.items[obj.index].pos.x = obj.mPos.x - game.actors.player.items[obj.index].pos.h / 2;
  game.actors.player.items[obj.index].pos.y = obj.mPos.y - game.actors.player.items[obj.index].pos.w / 2;
}
function isColliding(obj1, obj2) {
  if (obj1.x > obj2.x && obj1.x < obj2.x + obj2.w && obj1.y > obj2.y && obj1.y < obj2.y + obj2.h) {
    return true;
  } else {
    return false;
  }
}