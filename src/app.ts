import "phaser";
import { WelcomeScene } from "./welcomeScene";
import { GameScene } from "./gameScene";
import { ScoreScene } from "./scoreScene";

const config = {
  title: "Ivan catches watermelons",
  width: 800,
  height: 600,
  parent: "game",
  pixelArt: true,
  scene: [WelcomeScene, GameScene, ScoreScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  backgroundColor: "#18216D",
};

export class WatermelonCatch extends Phaser.Game {
  constructor(config) {
    super(config);
  }
}

window.onload = () => {
  var game = new WatermelonCatch(config);
};
