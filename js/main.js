// player
let robot;

// items
let bag;

// constants
const speed = 180;
const frameRate = 40;
const instructions = 'Please use W, A, S, D to control the robot and collect all the items.'
let numberItems;
let cursors;

const dialog = document.getElementById('main-dialog');
const overlay = document.getElementById('overlay');

function preload() {
  // load logo and platform
  this.load.image("logo", "assets/logo.png");
  this.load.image("platform", "assets/grid.png");

  // load player
  this.load.atlas(
    "robot",
    "assets/robotSpritesheet.png",
    "assets/robotSprites.json"
  );

  // load items
  this.load.image("bag", "assets/bag.png");
  this.load.image("travelBag", "assets/travelBag.png");
  this.load.image("backpack", "assets/backpack.png");
  this.load.image("sling", "assets/sling.png");

}

function create() {
  this.add.image(80, 295, "logo").setScale(0.1);

  this.add.text(210, 40, instructions, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: '#000' });

  const platforms = this.physics.add.staticGroup();

  platforms.create(460, 320, "platform").setScale(0.25).refreshBody();

  const { anims } = this;

  anims.create({
    key: "left-walk",
    frames: anims.generateFrameNames("robot", {
      prefix: "left",
      end: 16,
      zeroPad: 2,
    }),
    frameRate,
    repeat: -1,
  });
  anims.create({
    key: "right-walk",
    frames: anims.generateFrameNames("robot", {
      prefix: "right",
      end: 16,
      zeroPad: 2,
    }),
    frameRate,
    repeat: -1,
  });
  anims.create({
    key: "up-walk",
    frames: anims.generateFrameNames("robot", {
      prefix: "up",
      end: 16,
      zeroPad: 2,
    }),
    frameRate,
    repeat: -1,
  });
  anims.create({
    key: "down-walk",
    frames: anims.generateFrameNames("robot", {
      prefix: "down",
      end: 16,
      zeroPad: 2,
    }),
    frameRate,
    repeat: -1,
  });

  robot = this.physics.add.sprite(460, 320, "robot").setScale(1.4);

  bag = this.physics.add.sprite(260, 320, "bag").setScale(0.15);
  travelBag = this.physics.add.sprite(660, 320, "travelBag").setScale(0.15);
  backpack = this.physics.add.sprite(460, 120, "backpack").setScale(0.15);
  sling = this.physics.add.sprite(460, 520, "sling").setScale(0.15);

  const items = [bag, travelBag, backpack, sling];
  numberItems = items.length;

  items.map(item => {
    this.physics.add.collider(robot, item, function (robot, item) {
      item.destroy();
      numberItems--;
    });
  })

  cursors = this.input.keyboard.addKeys({
    up: Phaser.Input.Keyboard.KeyCodes.W,
    down: Phaser.Input.Keyboard.KeyCodes.S,
    left: Phaser.Input.Keyboard.KeyCodes.A,
    right: Phaser.Input.Keyboard.KeyCodes.D,
  });

  robot.setCollideWorldBounds(true);
  this.physics.world.setBounds(190, 20, 520, 550);
}

function endGame() {
  dialog.style.visibility = 'visible';
  overlay.style.display = 'block';
}

function idleStateRobot(prevVelocity) {
    robot.anims.stop();
    if (prevVelocity.x < 0) robot.setTexture("robot", "left01");
    else if (prevVelocity.x > 0) robot.setTexture("robot", "right07");
    else if (prevVelocity.y < 0) robot.setTexture("robot", "up05");
    else if (prevVelocity.y > 0) robot.setTexture("robot", "down07");
}

function update() {


  const prevVelocity = robot.body.velocity.clone();

  robot.body.setVelocity(0);

  if (!numberItems) {
    idleStateRobot(prevVelocity)
    endGame();
    return;
  }

  if (cursors.left.isDown) {
    robot.body.setVelocityX(-speed);
  } else if (cursors.right.isDown) {
    robot.body.setVelocityX(speed);
  }

  if (cursors.up.isDown) {
    robot.body.setVelocityY(-speed);
  } else if (cursors.down.isDown) {
    robot.body.setVelocityY(speed);
  }

  if (cursors.left.isDown) {
    robot.anims.play("left-walk", true);
  } else if (cursors.right.isDown) {
    robot.anims.play("right-walk", true);
  } else if (cursors.up.isDown) {
    robot.anims.play("up-walk", true);
  } else if (cursors.down.isDown) {
    robot.anims.play("down-walk", true);
  } else {
    idleStateRobot(prevVelocity)
  }
}

var config = {
  type: Phaser.AUTO,
  backgroundColor: "ffffff",
  width: 820,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      enableBody: true,
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);
