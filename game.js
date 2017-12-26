/*
* Real JS file for Reigns
*/
class Pointer {
  constructor () {
    // TODO: detect whether mobile or laptop/desktop
    this.pointer = ReignsGame.getInstance().game.input.pointer1;
    this.pointer = ReignsGame.getInstance().game.input.mousePointer;
    this.disabled = false;
  }
}
Pointer.getInstance = function () {
  if (Pointer.instance != undefined) {
    return Pointer.instance;
  }
  Pointer.instance = new Pointer();
  return Pointer.instance;
}

const WIDTH = document.body.clientWidth;
const HEIGHT = window.innerHeight;
const STATS = ["religion", "people", "military", "money"];
var SCALE;

class Character {
  constructor (name, imageID) {
    this.name = name;
    this.image = ReignsGame.getInstance().game.add.sprite(0, 0, imageID);
    this.resetImage();
  }

  activate () {
    this.image.alpha = 1;
  }

  deactivate () {
    this.image.alpha = 0;
  }

  resetImage () {
    this.image.anchor.setTo(ReignsGame.ANCHOR.x, ReignsGame.ANCHOR.y);
    this.image.position.setTo(ReignsGame.POSITION.x, ReignsGame.POSITION.y);
    this.image.scale.setTo(ReignsGame.SCALE);
    this.image.angle = 0;
    this.image.alpha = 0;
  }
}

class Option {
  constructor (text, religionChange, peopleChange, militaryChange, moneyChange) {
    this.stats = {};
    this.stats["religion"] = religionChange;
    this.stats["people"] = peopleChange;
    this.stats["military"] = militaryChange;
    this.stats["money"] = moneyChange;
    this.text = text;
  }

  activate () {
    ReignsGame.getInstance().processOption(this);
  }
}

class Choice {
  constructor (character, text, leftOption, rightOption) {
    this.character = character;
    this.text = text;
    this.left = leftOption;
    this.right = rightOption;
  }
}

class ReignsGame {

  constructor () {
    this.game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'reigns', { preload: this.preload, create: this.create, update: this.update });
  }

  processOption (option) {
    for (let i = 0; i < STATS.length; i++) {
      this.increaseStat(STATS[i], option.stats[STATS[i]]);
    }
    // TODO if not 0 - 100, gameover
  }

  preload () {
    this.game.load.image('cardback', 'bgcard.png');
    this.game.load.image('reigns_man2', 'reigns_man2.png');
    this.game.load.image('reigns_woman1', 'reigns_woman1.png');
    this.game.load.image('topbar', 'topbar.png');
  }

  setStat (stat, value) {
    if (!STATS.includes(stat)) {
      throw "[Error] Incorrect Stat '" + stat + "'";
    }
    this.stats[stat] = value;
    this.updateStatBar(stat);
  }

  increaseStat (stat, amount) {
    if (!STATS.includes(stat)) {
      throw "[Error] Incorrect Stat '" + stat + "'";
    }
    this.stats[stat] += amount;
    this.updateStatBar(stat);
  }

  updateStatBar (stat) {
    if (!STATS.includes(stat)) {
      throw "[Error] Incorrect Stat '" + stat + "'";
    }
    this.progressBars[stat].scale.y = 110 - this.stats[stat] + 1;
  }

  createFoundationGraphics () {
    var game = this.game;

    // setup bg color
    game.stage.backgroundColor = "#bca56b";

    // draw top and bottom
    this.card = game.add.graphics();
    var card = this.card;
    card.lineStyle(1, 0x291a0c, 1);
    card.beginFill(0x291a0c);
    card.drawRect(0, HEIGHT - 50, WIDTH, 50); // bottom
    card.beginFill(0xe8dfbe);
    card.drawRect(0, 0, WIDTH, 150); // bottom

    this.progressBars = {};
    this.progressBars["religion"] = game.add.graphics();
    this.progressBars["religion"].x = 124;
    this.progressBars["religion"].y = 19;
    this.progressBars["religion"].beginFill(0xbca56b);
    this.progressBars["religion"].drawRect(0, 0, 93, 1);

    this.progressBars["people"] = game.add.graphics();
    this.progressBars["people"].x = 279;
    this.progressBars["people"].y = 19;
    this.progressBars["people"].beginFill(0xbca56b);
    this.progressBars["people"].drawRect(0, 0, 93, 1);

    this.progressBars["military"] = game.add.graphics();
    this.progressBars["military"].x = 434;
    this.progressBars["military"].y = 19;
    this.progressBars["military"].beginFill(0xbca56b);
    this.progressBars["military"].drawRect(0, 0, 93, 1);

    this.progressBars["money"] = game.add.graphics();
    this.progressBars["money"].x = 589;
    this.progressBars["money"].y = 19;
    this.progressBars["money"].beginFill(0xbca56b);
    this.progressBars["money"].drawRect(0, 0, 93, 1);

    var topbar = game.add.sprite(WIDTH / 2, 0, "topbar");
    topbar.anchor.x = 0.5;

    //draw card back
    var cardback = game.add.sprite(WIDTH / 2, 0, "cardback");
    ReignsGame.SCALE = 2 * WIDTH / cardback.width / 3;
    cardback.anchor.x = 0.5;
    cardback.anchor.y = 3;
    ReignsGame.ANCHOR = cardback.anchor;
    cardback.scale.setTo(ReignsGame.SCALE, ReignsGame.SCALE);
    cardback.y = cardback.height * 3 + HEIGHT * 0.34;
    ReignsGame.POSITION = cardback.position;


    //setup text
    var style = { font: "bold 36px Arial", fill: "#000", boundsAlignH: "center", textAlign: "center" };
    this.leftText = game.add.text(0, 180, "RIGHT...", style);
    this.rightText = game.add.text(0, 280, "LEFT...", style);
    this.mainText = game.add.text(0, 380, "LEFT...", style);
  }

  setUpChoices () {
    this.characters = {}
    this.characters["dude"] = new Character("Rayn", "reigns_man2");
    this.characters["girl"] = new Character("Lana", "reigns_woman1");
    this.choices = [];
    //character, text, leftOption, rightOption
    this.choices.push(
      new Choice(
        this.characters["dude"],
        "We should play Hannah Montana for the masses!",
        new Option("I don't like music.", -10, -20, 5, 5),
        new Option("I love Miley Cyrus!", -10, +30, 0, -20)
      )
    );
    this.choices.push(
      new Choice(
        this.characters["girl"],
        "I like you a lot!",
        new Option("I don't like you.", -10, -20, 5, 5),
        new Option("I love you too!", -10, +30, 0, -20)
      )
    );
  }

  setActiveChoice (choice) {
    if (this.activeChoice != undefined) {
      this.activeChoice.character.deactivate();
    }
    this.activeChoice = choice;
    this.activeChoice.character.activate();
    this.leftText.text = choice.left.text;
    this.rightText.text = choice.right.text;
    this.mainText.text = choice.text;

  }

  setUpStats () {
    this.stats = {}
    for (let i = 0; i < STATS.length; i++) {
      this.stats[STATS[i]] = 0;
      this.setStat(STATS[i], 55);
    }
  }

  activate () {
    this.setActiveChoice(this.choices[0]);
  }

  setActiveCharacter (character) {
    this.activeCharacter = character;
  }

  create () {
    ReignsGame.getInstance().createFoundationGraphics();
    ReignsGame.getInstance().setUpChoices();
    ReignsGame.getInstance().activate();
    ReignsGame.getInstance().setUpStats();
  }

  turnCardLeft () {
    if (ReignsGame.getInstance().activeChoice.character.image.angle < 10) {
      ReignsGame.getInstance().activeChoice.character.image.angle += .5;
    }
  }

  turnCardRight () {
    if (ReignsGame.getInstance().activeChoice.character.image.angle > -10) {
      ReignsGame.getInstance().activeChoice.character.image.angle -= .5;
    }
  }

  turnCardCenter () {
    var image = ReignsGame.getInstance().activeChoice.character.image;
    if (image.angle > 0.5) {
      image.angle -= 0.5;
    } else if (image.angle < -0.5) {
      image.angle += 0.5;
    } else {
      image.angle = 0;
    }
  }

  processInput () {
    if (Pointer.getInstance().pointer.x > WIDTH / 2 + 100) {
      this.turnCardLeft();
    } else if (Pointer.getInstance().pointer.x < WIDTH / 2 - 100) {
      this.turnCardRight();
    } else {
      this.turnCardCenter();
    }
  }

  cardShouldFall (image) {
    return image.y - image.height * 3 < HEIGHT;
  }

  nextCard () {
    ReignsGame.getInstance().activeChoice.character.resetImage();
    this.setActiveChoice(this.choices[parseInt(Math.random() * this.choices.length)]);
    this.inputDisabled = false;
  }

  fall (image) {
    image.y += parseInt(image.y / 110);
    image.angle *= 1.05;
    this.inputDisabled = true;
  }

  shouldTurnCenter () {
    return Math.abs(ReignsGame.getInstance().activeChoice.character.image.angle) <= 7.5;
  }

  processImageAngle () {
    var image = ReignsGame.getInstance().activeChoice.character.image;
    if (this.shouldTurnCenter()) {
      this.turnCardCenter();
    } else {
      if (this.cardShouldFall(image)) {
        this.fall(image);
      } else {
        //
        var option;
        if (image.angle > 0) {
          // right choice
          option = this.activeChoice.left;
        } else {
          // left choice
          option = this.activeChoice.right;
        }
        option.activate();
        this.nextCard();
      }
    }
  }

  adjustTextDisplay () {
    var image = ReignsGame.getInstance().activeChoice.character.image;
    if (image.angle > 7.5) {
      this.leftText.alpha = 1; // right
      this.rightText.alpha = 0;
    } else if (image.angle < -7.5) {
      this.rightText.alpha = 1; // left
      this.leftText.alpha = 0;
    } else {
      this.leftText.alpha = 0;
      this.rightText.alpha = 0;
    }
  }

  update () {
    ReignsGame.getInstance().adjustTextDisplay();
    if (ReignsGame.getInstance().inputDisabled || !Pointer.getInstance().pointer.isDown) {
      /**
        In Motion OR User's finger is up.
      */
      ReignsGame.getInstance().processImageAngle();
    } else {
      ReignsGame.getInstance().processInput();
    }
  }
}
ReignsGame.getInstance = function () {
  if (ReignsGame.instance != undefined) {
    return ReignsGame.instance;
  }
  ReignsGame.instance = new ReignsGame();
  return ReignsGame.instance;
};
reigns = ReignsGame.getInstance();
