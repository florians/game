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
    }
  });
}
function isColliding(obj1, obj2) {
  if (obj1.x > obj2.x && obj1.x < obj2.x + obj2.w && obj1.y > obj2.y && obj1.y < obj2.y + obj2.h) {
    return true;
  } else {
    return false;
  }
}