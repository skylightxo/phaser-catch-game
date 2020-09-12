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
  isRunning: boolean;

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
    this.load.image("background", "assets/back.png");
    this.load.image("watermelon", "assets/MelonWater.png");
    this.load.image("bomb", "assets/bomb.png");
    this.load.image("sand", "assets/sand.jpg");
    //idle
    this.load.image("idle0", "assets/hero/idle/adventurer-idle-00.png");
    this.load.image("idle1", "assets/hero/idle/adventurer-idle-01.png");
    this.load.image("idle2", "assets/hero/idle/adventurer-idle-02.png");
    //idle
    this.load.image("death0", "assets/hero/death/adventurer-die-04.png");
    this.load.image("death1", "assets/hero/death/adventurer-die-05.png");
    this.load.image("death2", "assets/hero/death/adventurer-die-06.png");
    //run
    this.load.image("run0", "assets/hero/run/adventurer-run-00.png");
    this.load.image("run1", "assets/hero/run/adventurer-run-01.png");
    this.load.image("run2", "assets/hero/run/adventurer-run-02.png");
    this.load.image("run3", "assets/hero/run/adventurer-run-03.png");
    this.load.image("run4", "assets/hero/run/adventurer-run-04.png");
    this.load.image("run5", "assets/hero/run/adventurer-run-05.png");
    //audio
    this.load.audio("bg-music", "assets/main-theme.mp3");
    this.load.audio("death-sound", "assets/death.mp3");
    this.load.audio("catch-sound", "assets/collect.mp3");
  }

  create(): void {
    this.background = this.add
      .image(
        this.game.renderer.width / 2,
        this.game.renderer.height * 0.2,
        "background"
      )
      .setScale(5);
    this.catchSound = this.sound.add("catch-sound", { volume: 0.4 });
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
    const idleFrameNames = this.anims.generateFrameNames("idle", {
      start: 0,
      end: 2,
      zeroPad: 1,
      prefix: "assets/hero/idle/adventurer-idle-",
      suffix: ".png",
    });
    const runFrameNames = this.anims.generateFrameNames("run", {
      start: 0,
      end: 2,
      zeroPad: 1,
      prefix: "assets/hero/run/adventurer-run-",
      suffix: ".png",
    });
    console.log(idleFrameNames);
    console.log(runFrameNames);

    // this.anims.create({
    //   key: "idle",
    //   frameRate: 3,
    //   repeat: -1,
    //   frames: idleFrameNames,
    // });

    this.anims.create({
      key: "idle",
      frameRate: 3,
      repeat: -1,
      frames: [
        { key: "idle0", frame: "assets/hero/idle/adventurer-idle-00" },
        { key: "idle1", frame: "assets/hero/idle/adventurer-idle-01" },
        { key: "idle2", frame: "assets/hero/idle/adventurer-idle-02" },
      ],
    });

    this.anims.create({
      key: "death",
      frameRate: 2,
      repeat: 0,
      frames: [
        { key: "death0", frame: "assets/hero/death/adventurer-die-03" },
        { key: "death1", frame: "assets/hero/death/adventurer-die-06" },
      ],
    });

    // this.anims.create({
    //   key: "run",
    //   frameRate: 6,
    //   repeat: -1,
    //   frames: runFrameNames,
    // });
    this.anims.create({
      key: "run",
      frameRate: 6,
      repeat: -1,
      frames: [
        { key: "run0", frame: "run0" },
        { key: "run1", frame: "run1" },
        { key: "run2", frame: "run2" },
        { key: "run3", frame: "run3" },
        { key: "run4", frame: "run4" },
        { key: "run5", frame: "run5" },
      ],
    });
    this.ivan = this.physics.add.sprite(100, 525, "idle0").setScale(3);
    this.ivan.body.setSize(this.ivan.width, this.ivan.height);
    this.ivan.anims.play("idle");
    Phaser.Actions.PlaceOnLine(
      this.sand.getChildren(),
      new Phaser.Geom.Line(20, 580, 820, 580)
    );
    this.sand.refresh();

    this.highscore = localStorage.getItem("highscore") || 0;

    this.info = this.add.text(10, 10, "", {
      font: "24px Arial Bold",
      fill: "#000",
    });

    this.highscoreText = this.add.text(660, 10, "", {
      font: "24px Arial Bold",
      fill: "#000",
    });
  }

  update(time: number): void {
    if (this.arrow.right.isDown) {
      this.direction = "right";
      this.ivan.x += 5;
      this.ivan.setFlipX(false);
      if (this.isRunning !== true) {
        this.isRunning = true;
        this.ivan.anims.play("run");
      }
    } else if (this.arrow.left.isDown) {
      this.direction = "left";
      this.ivan.x -= 5;
      this.ivan.setFlipX(true);
      if (this.isRunning !== true) {
        this.isRunning = true;
        this.ivan.anims.play("run");
      }
    } else if (this.arrow.left.isUp) {
      if (this.isRunning === true) {
        this.isRunning = false;
        this.ivan.anims.play("idle");
      }
    } else if (this.arrow.right.isUp) {
      if (this.isRunning === true) {
        this.isRunning = false;
        this.ivan.anims.play("idle");
      }
    }
    if (this.shift.isDown) {
      this.direction === "left" ? (this.ivan.x -= 15) : (this.ivan.x += 15);
      this.superState = true;
      this.ivan.setTint(0x00ff00);
      // if (this.isRunning !== true) {
      //   this.isRunning = true;
      //   this.ivan.anims.play("run");
      // }
    } else {
      this.superState = false;
      this.ivan.clearTint();
      // if (this.isRunning === true) {
      //   this.isRunning = false;
      //   this.ivan.anims.play("idle");
      // }
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

  protected gameOver(): void {
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
      this.ivan.anims.play("death");
      this.ivan.setTint(0xff0000);
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

    if (melonX - bombX <= 30) {
      bombX += 25;
    }
    if (bombX - melonX <= 30) {
      melonX += 25;
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
