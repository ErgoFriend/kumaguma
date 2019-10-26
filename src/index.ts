import {Engine, Actor, Color, CollisionType} from "excalibur";

const game = new Engine({
  canvasElementId: "game"
});

// Create an actor with x position of 150px,
// y position of 40px from the bottom of the screen,
// width of 200px, height and a height of 20px
const paddle = new Actor(150, game.drawHeight - 40, 200, 20);

// Let's give it some color with one of the predefined
// color constants
paddle.color = Color.Chartreuse;

// Make sure the paddle can partipate in collisions, by default excalibur actors do not collide
paddle.collisionType = CollisionType.Fixed;

// `game.add` is the same as calling
// `game.currentScene.add`
game.add(paddle);

// Add a mouse move listener
game.input.pointers.primary.on("move", function(evt) {
  paddle.pos.x = evt.target.lastWorldPos.x;
});

// Create a ball
const ball = new Actor(100, 300, 20, 20);

// Set the color
ball.color = Color.Red;

// Set the velocity in pixels per second
ball.vel.setTo(100, 100);

// Set the collision Type to passive
// This means "tell me when I collide with an emitted event, but don't let excalibur do anything automatically"
ball.collisionType = CollisionType.Passive;
// Other possible collision types:
// "CollisionType.PreventCollision - this means do not participate in any collision notification at all"
// "CollisionType.Active - this means participate and let excalibur resolve the positions/velocities of actors after collision"
// "CollisionType.Fixed - this means participate, but this object is unmovable"

// On collision bounce the ball
ball.on("precollision", function(ev) {
  // reverse course after any collision
  // intersections are the direction body A has to move to not be clipping body B
  // `ev.intersection` is a vector `normalize()` will make the length of it 1
  // `negate()` flips the direction of the vector
  var intersection = ev.intersection.normalize();

  // The largest component of intersection is our axis to flip
  if (Math.abs(intersection.x) > Math.abs(intersection.y)) {
    ball.vel.x *= -1;
  } else {
    ball.vel.y *= -1;
  }
});

// Add the ball to the current scene
game.add(ball);

// Wire up to the postupdate event
ball.on("postupdate", function() {
  // If the ball collides with the left side
  // of the screen reverse the x velocity
  if (this.pos.x < this.width / 2) {
    this.vel.x *= -1;
  }

  // If the ball collides with the right side
  // of the screen reverse the x velocity
  if (this.pos.x + this.width / 2 > game.drawWidth) {
    this.vel.x *= -1;
  }

  // If the ball collides with the top
  // of the screen reverse the y velocity
  if (this.pos.y < this.height / 2) {
    this.vel.y *= -1;
  }
});

// Draw is passed a rendering context and a delta in milliseconds since the last frame
ball.draw = function(ctx, delta) {
  // Optionally call original 'base' method
  // Actor.prototype.draw.call(this, ctx, delta)

  // Custom draw code
  ctx.fillStyle = this.color.toString();
  ctx.beginPath();
  ctx.arc(this.pos.x, this.pos.y, 10, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
};

// Build Bricks

// Padding between bricks
var padding = 20; // px
var xoffset = 65; // x-offset
var yoffset = 20; // y-offset
var columns = 5;
var rows = 3;

var brickColor = [Color.Violet, Color.Orange, Color.Yellow];

// Individual brick width with padding factored in
var brickWidth = game.drawWidth / columns - padding - padding / columns; // px
var brickHeight = 30; // px
var bricks = [];
for (var j = 0; j < rows; j++) {
  for (var i = 0; i < columns; i++) {
    bricks.push(
      new Actor(
        xoffset + i * (brickWidth + padding) + padding,
        yoffset + j * (brickHeight + padding) + padding,
        brickWidth,
        brickHeight,
        brickColor[j % brickColor.length]
      )
    );
  }
}

bricks.forEach(function(brick) {
  // Make sure that bricks can participate in collisions
  brick.collisionType = CollisionType.Active;

  // Add the brick to the current scene to be drawn
  game.add(brick);
});

// On collision remove the brick, bounce the ball
ball.on("precollision", function(ev) {
  if (bricks.indexOf(ev.other) > -1) {
    // kill removes an actor from the current scene
    // therefore it will no longer be drawn or updated
    ev.other.kill();
  }

  // reverse course after any collision
  // intersections are the direction body A has to move to not be clipping body B
  // `ev.intersection` is a vector `normalize()` will make the length of it 1
  // `negate()` flips the direction of the vector
  var intersection = ev.intersection.normalize();

  // The largest component of intersection is our axis to flip
  if (Math.abs(intersection.x) > Math.abs(intersection.y)) {
    ball.vel.x *= -1;
  } else {
    ball.vel.y *= -1;
  }
});

ball.on("exitviewport", function() {
  alert("You lose!");
});

game.start();
