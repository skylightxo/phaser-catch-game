import "phaser";

export class GameScene extends Phaser.Scene {
  music: Phaser.Sound.BaseSound;
  catchSound: Phaser.Sound.BaseSound;
  deathSound: Phaser.Sound.BaseSound;
  delta: number;
  direction: string;
  superState: boolean;
  background: any;
  ivan: Phaser.Physics.Arcade.Sprite;
  lastMelonTime: number;
  melonsCaught: number;
  melonsFallen: number;
  sand: Phaser.Physics.Arcade.StaticGroup;
  arrow: Phaser.Input.Keyboard.CursorKeys;
  shift: Phaser.Input.Keyboard.Key;
  info: Phaser.GameObjects.Text;
  highscoreText: Phaser.GameObjects.Text;
  highscore: number | string;

  constructor() {
    super({
      key: "GameScene",
    });
  }

  init(/*params: any*/): void {
    this.delta = 1000;
    this.lastMelonTime = 0;
    this.melonsCaught = 0;
    this.melonsFallen = 0;
  }

  preload(): void {
    this.load.image("background", "assets/ricardo.gif");
    this.load.image("watermelon", "assets/watermelon.png");
    this.load.image("bomb", "assets/bomb.png");
    this.load.image("sand", "assets/sand.jpg");
    this.load.image("ivan", "assets/ivan-stormrage.png");
    this.load.audio("bg-music", "assets/bg-music.mp3");
    this.load.audio("death-sound", "assets/roblox-death-sound_1.mp3");
    this.load.audio("catch-sound", "assets/iam-cumming.mp3");
  }

  create(): void {
    // this.background = this.add.image(0, 0, "background").setOrigin(0, 0);
    this.catchSound = this.sound.add("catch-sound", { volume: 1 });
    this.deathSound = this.sound.add("death-sound", { volume: 1 });
    this.music = this.sound.add("bg-music", { volume: 0.3 });
    this.music.play();
    this.superState = false;
    this.arrow = this.input.keyboard.createCursorKeys();
    this.shift = this.input.keyboard.addKey("SHIFT");
    this.sand = this.physics.add.staticGroup({
      key: "sand",
      frameQuantity: 20,
    });
    this.ivan = this.physics.add.sprite(100, 525, "ivan").setScale(0.3);
    this.ivan.body.setSize(this.ivan.width, this.ivan.height);
    Phaser.Actions.PlaceOnLine(
      this.sand.getChildren(),
      new Phaser.Geom.Line(20, 580, 820, 580)
    );
    this.sand.refresh();

    this.highscore = localStorage.getItem("highscore") || 0;

    this.info = this.add.text(10, 10, "", {
      font: "24px Arial Bold",
      fill: "#FBFBAC",
    });

    this.highscoreText = this.add.text(660, 10, "", {
      font: "24px Arial Bold",
      fill: "#FBFBAC",
    });
  }

  update(time: number): void {
    if (this.arrow.right.isDown) {
      this.direction = "right";
      this.ivan.x += 5;
      this.ivan.y = 525;
      this.ivan.setFlipX(true);
    } else if (this.arrow.left.isDown) {
      this.direction = "left";
      this.ivan.x -= 5;
      this.ivan.y = 525;
      this.ivan.setFlipX(false);
    }
    if (this.shift.isDown) {
      this.direction === "left" ? (this.ivan.x -= 15) : (this.ivan.x += 15);
      this.superState = true;
      this.ivan.setTint(0x00ff00);
    }
    if (this.shift.isUp) {
      this.superState = false;
      this.ivan.clearTint();
    }
    var diff: number = time - this.lastMelonTime;
    if (diff > this.delta) {
      this.lastMelonTime = time;
      if (this.delta > 500) {
        this.delta -= 20;
      }
      this.emitWatermelon();
    }
    this.info.text =
      this.melonsCaught + " caught - " + this.melonsFallen + " fallen (max 3)";

    this.highscoreText.text = "highscore: " + this.highscore.toString();
  }

  private onCatch(watermelon: Phaser.Physics.Arcade.Image): () => void {
    return function () {
      if (this.superState) return;
      this.catchSound.play();
      watermelon.setTint(0x00ff00);
      watermelon.setVelocity(0, 0);

      this.melonsCaught += 1;
      this.time.delayedCall(
        5,
        function (watermelon) {
          watermelon.destroy();
        },
        [watermelon],
        this
      );
    };
  }

  protected gameOver(): () => void {
    if (this.highscore < this.melonsCaught)
      localStorage.setItem("highscore", this.melonsCaught.toString());
    this.scene.start("ScoreScene", {
      melonsCaught: this.melonsCaught,
    });
  }

  private onFall(watermelon: Phaser.Physics.Arcade.Image): () => void {
    return function () {
      watermelon.setTint(0xff0000);
      this.melonsFallen += 1;
      this.time.delayedCall(
        100,
        function (watermelon) {
          watermelon.destroy();
          if (this.melonsFallen > 2) {
            this.music.stop();
            this.gameOver();
          }
        },
        [watermelon],
        this
      );
    };
  }
  private onDeath(bomb: Phaser.Physics.Arcade.Image): () => void {
    return function () {
      if (this.superState) return;
      this.deathSound.play();
      bomb.setTint(0xff0000);
      this.ivan.setTint(0xff0000);
      this.ivan.setFlipY(true);
      this.time.delayedCall(500, () => {
        this.music.stop();
        this.gameOver();
      });
    };
  }

  private emitWatermelon(): void {
    var watermelon: Phaser.Physics.Arcade.Image;
    var bomb: Phaser.Physics.Arcade.Image;
    var melonX = Phaser.Math.Between(25, 775);
    var bombX = Phaser.Math.Between(25, 775);

    if (Math.abs(melonX - bombX) <= 30) {
      bombX += 50;
    }
    var y = 26;
    watermelon = this.physics.add.image(melonX, y, "watermelon");
    bomb = this.physics.add.image(bombX, y, "bomb");

    watermelon.setDisplaySize(50, 50);
    watermelon.setVelocity(0, 200);
    watermelon.setInteractive();

    bomb.setDisplaySize(50, 50);
    bomb.setVelocity(0, 200);
    bomb.setInteractive();

    watermelon.on("start", this.onCatch(watermelon), this);
    this.physics.add.overlap(
      watermelon,
      this.ivan,
      this.onCatch(watermelon),
      null,
      this
    );
    this.physics.add.overlap(bomb, this.ivan, this.onDeath(bomb), null, this);
    this.physics.add.collider(
      watermelon,
      this.sand,
      this.onFall(watermelon),
      null,
      this
    );
  }
}
