var WIDTH = document.body.clientWidth;
var CENTER_X = WIDTH / 2;
var MARGIN_LEFT = width / 12;
var MARGIN_RIGHT = width / 12;
var IMAGE_WIDTH = width - MARGIN_RIGHT - MARGIN_LEFT;
var IMAGE_SCALE = IMAGE_WIDTH / 720;
var HEIGHT = window.innerHeight;
var IMAGE_Y = 0.34 * HEIGHT;

function nextCard () {
  bar.angle = 0;
  bar.choice.reset();
  inputDisabled = false;
}

class Consequence {
  constructor (text, effect) {
    this.text = text;
    this.effect = effect;
  }

  activate () {
    // TODO: process this.effect
  }
}

class CardSprite {
  constructor (game, imageID) {
    this.imageID = imageID;
    this.game = game;
    this.addSpriteToGame();
  }

  addSpriteToGame (hidden=true) {
    this.image = this.game.add.sprite(CENTER_X, 0, this.imageID);
    this.image.anchor = new Phaser.Point(0.5, 3);
    this.image.y = this.image.height * 3 + HEIGHT * 0.34;

    var scale = (2 / 3) * (WIDTH / this.image.width);
    this.image.scale.setTo(scale, scale);

    if (hidden) {
      this.image.alpha = 0;
    }
  }

  hide () {
    this.image.alpha = 0;
  }

  show () {
    this.image.alpha = 1;
  }
}

class ReignsGame {
  constructor () {

  }
}
ReignsGame.getInstance = function () {
  if (ReignsGame.instance != undefined) {
    return ReignsGame.instance;
  }
  ReignsGame.instance = new ReignsGame();
}

class Choice {
  constructor (image, left_consequence, right_consequence) {
    this.left_consequence = left_consequence;
    this.right_consequence = right_consequence;
    this.cardSprite = new CardSprite(game, image);
  }

  activate () {
    var game = ReignsGame.getInstance();
    this.cardSprite.show();
    leftText.text = this.left_text;
    rightText.text = this.right_text;
    leftText.x = game.width / 2 - leftText.width / 2 + 140;
    rightText.x = game.width / 2 - rightText.width / 2 - 140;
    this.image.choice = this;
    return this.image;
  }

  reset () {
    this.image.y = this.image.height * 3 + HEIGHT * 0.34;
  }
}

    if (false) {
      var width = document.body.clientWidth;
      MARGIN_LEFT = width / 12;
      MARGIN_RIGHT = width / 12;
      IMAGE_WIDTH = width - MARGIN_RIGHT - MARGIN_LEFT;
      IMAGE_SCALE = IMAGE_WIDTH / 720;
    }

    var game = new Phaser.Game(document.body.clientWidth, window.innerHeight, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

    function preload() {
        game.load.image('cardback', 'bgcard.png');
        game.load.image('reigns_man2', 'reigns_man2.png');
    }

    var ball;

    function create() {
      game.stage.backgroundColor = "#bca56b";

      keyQ = game.input.keyboard.addKey(Phaser.Keyboard.Q)
      card = game.add.graphics();
      card.lineStyle(1, 0x291a0c, 1);
      card.beginFill(0x291a0c);
      card.drawRect(0, HEIGHT - 50, width, 50);
      card.drawRect(0, 0, width, 150);

      cardback = game.add.sprite(game.width / 2, 0, "cardback");
      var scale = 2 * width / cardback.width / 3;
      cardback.anchor.x = 0.5;
      cardback.scale.setTo(scale, scale);
      cardback.y = HEIGHT * 0.34;

      choices = [];

      style = { font: "bold 36px Arial", fill: "#000", boundsAlignH: "center", textAlign: "center" };

      total = 0;
      topText = game.add.text(0, 130, "", style);
      topText.x = game.width / 2 - topText.width / 2 + 140;
      topText.setTextBounds(-100, 0, 100, 100)

      leftText = game.add.text(0, 180, "RIGHT...", style);
      rightText = game.add.text(0, 180, "LEFT...", style);

      negative = true;
      pointer = game.input.pointer1;
      pointer = game.input.mousePointer;
      inputDisabled = false;

      choices.push(new Choice("reigns_man2", null, "I'M A CAT", null, "I'M A KITTY"));
      bar = choices[0].activate();
    }
    function update() {
      if (Math.abs(bar.angle) > 7.5) {
        console.log("gah");
      }
      if (!inputDisabled && pointer.isDown) {
        if (pointer.x > game.width / 2 + 100 || pointer.x < game.width / 2 - 100) {
          if (pointer.x > game.width / 2 + 100) {
            console.log("right")
            if (bar.angle < 10) {
            bar.angle += .5;
            }
          } else if (pointer.x < game.width / 2 - 100) {
            console.log("left")
            if (bar.angle > -10) {
              bar.angle -= .5;
            }
          }
        } else {
          if (bar.angle > 0) {
            bar.angle -= 0.5;
          } else if (bar.angle < 0) {
            bar.angle += 0.5;
          }
        }
        console.log(pointer.x + ", " + pointer.y);
      } else {
        if (Math.abs(bar.angle) > 7.5) {
          if (bar.y - bar.height * 3 < game.height) {
            bar.y += parseInt(bar.y / 110);
            bar.angle *= 1.05;
            inputDisabled = true;
          } else {
            if (bar.angle > 0) {
              total += 2; //right
              topText.text = "" + total;
              nextCard();
            } else {
              //left
              total -= 2;
              topText.text = "" + total;
              nextCard();
            }
          }
        } else {
          if (Math.abs(bar.angle) < 0.3) {
            bar.angle = 0;
          } else if (bar.angle > 0) {
            bar.angle -= 0.3;
          } else if (bar.angle < 0) {
            bar.angle += 0.3;
          }
        }
      }
      if (bar.angle > 7.5) {
        leftText.alpha = 1; // right
        rightText.alpha = 0;
      } else if (bar.angle < -7.5) {
        rightText.alpha = 1; // left
        leftText.alpha = 0;
      } else {
        leftText.alpha = 0;
        rightText.alpha = 0;
      }
    }
