import "phaser";

export class ScoreScene extends Phaser.Scene {
  endMusic: Phaser.Sound.BaseSound;
  score: number;
  result: Phaser.GameObjects.Text;
  hint: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: "ScoreScene",
    });
  }

  init(params: any): void {
    this.score = params.melonsCaught;
  }

  preload(): void {
    this.load.audio("gg-sound", "assets/oh-no-no-no-no-laugh.mp3");
  }

  create(): void {
    this.endMusic = this.sound.add("gg-sound", { volume: 1 });
    this.endMusic.play();
    const resultText: string = "Your score is " + this.score + "!";
    this.result = this.add.text(200, 250, resultText, {
      font: "48px Arial Bold",
      fill: "#FBFBAC",
    });

    const hintText: string = "Click to restart";
    this.hint = this.add.text(300, 350, hintText, {
      font: "24px Arial Bold",
      fill: "#FBFBAC",
    });

    this.input.on(
      "pointerdown",
      function (/*pointer*/) {
        this.endMusic.stop();
        this.scene.start("WelcomeScene");
      },
      this
    );
  }
}
