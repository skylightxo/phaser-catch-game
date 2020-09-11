import "phaser";

export class WelcomeScene extends Phaser.Scene {
  title: Phaser.GameObjects.Text;
  hint: Phaser.GameObjects.Text;
  controls: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: "WelcomeScene",
    });
  }

  create(): void {
    const titleText: string = "Иван ловит арбузы";
    this.title = this.add.text(150, 200, titleText, {
      font: "64px Arial Bold",
      fill: "#FBFBAC",
    });

    const hintText: string = "Click to start";
    this.hint = this.add.text(300, 350, hintText, {
      font: "24px Arial Bold",
      fill: "#FFF",
    });

    const controlsText: string =
      "Управление стрелочками, на шифт Иван доджит все объекты";
    this.controls = this.add.text(100, 450, controlsText, {
      font: "24px Arial Bold",
      fill: "#FBFBAC",
    });

    this.input.on(
      "pointerdown",
      function (/*pointer*/) {
        this.scene.start("GameScene");
      },
      this
    );
  }
}
