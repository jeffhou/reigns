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

const WIDTH = 808;
const HEIGHT = 917;
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
  constructor (character, text, leftOption, rightOption, restart=false) {
    this.character = character;
    this.text = text;
    this.left = leftOption;
    this.right = rightOption;
    this.restart = restart;
  }
}

class ReignsGame {

  constructor () {
    this.game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'reigns', { preload: this.preload, create: this.create, update: this.update });
  }

  processOption (option) {
    if (ReignsGame.getInstance().activeChoice.restart) {
      this.resetStats();
      this.nextCard();
    } else {
      var gameEnded = false;
      for (let i = 0; i < STATS.length; i++) {
        this.increaseStat(STATS[i], option.stats[STATS[i]]);
        if (this.stats[STATS[i]] < 0 || this.stats[STATS[i]] > 110) {
          gameEnded = true;
        }
      }

      if (gameEnded) {
        ReignsGame.getInstance().activeChoice.character.resetImage();
        this.setActiveChoice(this.restartCard);
        this.inputDisabled = false;
      } else {
        this.nextCard();
      }
    }
  }

  preload () {
    this.game.load.image('cardback', 'bgcard.png');
    this.game.load.image('reigns_man1', 'reigns_man1.png');
    this.game.load.image('reigns_man2', 'reigns_man2.png');
    this.game.load.image('reigns_man3', 'reigns_man3.png');
    this.game.load.image('reigns_man4', 'reigns_man4.png');
    this.game.load.image('reigns_woman1', 'reigns_woman1.png');
    this.game.load.image('reigns_woman2', 'reigns_woman2.png');
    this.game.load.image('reigns_woman3', 'reigns_woman3.png');
    this.game.load.image('topbar', 'topbar.png');
    this.game.load.image('rightshade', 'leftshade.png');
    this.game.load.image('leftshade', 'rightshade.png');
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
  }

  setUpText () {
    //setup text
    var game = this.game;
    var style = { font: "40px alegreyasans", fill: "#fff", boundsAlignH: "center", textAlign: "left" };
    this.rightText = game.add.text(WIDTH / 2 + 50, 400, "RIGHT...", style);
    style = { font: "40px alegreyasans", fill: "#fff", boundsAlignH: "center", textAlign: "right" };
    this.leftText = game.add.text(WIDTH / 2 - 350, 400, "LEFT...", style);
    style = { font: "40px alegreyasans", fill: "#000", boundsAlignH: "center", textAlign: "center" };
    this.mainText = game.add.text(0, 0, "LEFT...", style);
    this.mainText.setTextBounds(100, 200, WIDTH - 200, 100);
    this.mainText.wordWrap = true;
    this.mainText.wordWrapWidth = WIDTH - 200;

  }

  setUpChoices () {
    this.characters = {}
    this.characters["topher"] = new Character("Topher", "reigns_man1");
    this.characters["rayn"] = new Character("Rayn", "reigns_man2");
    this.characters["twitch"] = new Character("Twitch", "reigns_man3");
    this.characters["boba"] = new Character("Boba", "reigns_woman1");
    this.characters["titch"] = new Character("Titch", "reigns_woman2");
    this.characters["cleo"] = new Character("Cleo", "reigns_woman3");
    this.characters["sleepygary"] = new Character("Sleepy Gary", "reigns_man4");
    this.choices = [];
    //character, text, leftOption, rightOption
    this.choices.push(
      new Choice(
        this.characters["topher"],
        "Yo dude! I just got this fresh $5 bill from my apple pie sales!",
        new Option("Yoink!", -20, -10, 0, 10),
        new Option("Sweet bro, let's invest that moola.", 5, 20, 2, 0)
      )
    );
    this.choices.push(
      new Choice(
        this.characters["rayn"],
        "Did you hear the new T.Swift album?? I think I'm in love <3",
        new Option("Don't know, don't care.", 0, -2, 0, 0),
        new Option("Ahhhh (fangirls)", 0, 2, 0, -2)
      )
    );
    this.choices.push(
      new Choice(
        this.characters["twitch"],
        "I'm a wizard!",
        new Option("Wizards don't exist.", 5, -2, -10, 0),
        new Option("I've got my blacklist ready.", -10, 2, 10, -5)
      )
    );
    this.choices.push(
      new Choice(
        this.characters["boba"],
        "Help me plant tulips?",
        new Option("GAH! Nature!!", 0, -5, 0, 5),
        new Option("You are too adorable.", 2, 5, 0, 0)
      )
    );
    this.choices.push(
      new Choice(
        this.characters["titch"],
        "I put a spell on you!",
        new Option("Crazy lady with tongs!", 7, -2, -1, -5),
        new Option("I dare you.", -5, -1, -5, -5)
      )
    );
    this.choices.push(
      new Choice(
        this.characters["cleo"],
        "//The empress looks your way",
        new Option("//wiggle hips suggestively", -7, 7, -2, 0),
        new Option("//act disinterested", 2, -1, 0, 0)
      )
    );

    this.restartCard = new Choice(
      this.characters["sleepygary"],
      "Wake up! That was all a dream!",
      new Option("What...", 0, 0, 0, 0),
      new Option("What...", 0, 0, 0, 0),
      true
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

  resetStats () {
    for (let i = 0; i < STATS.length; i++) {
      this.setStat(STATS[i], 55);
    }
  }

  activate () {
    this.setActiveChoice(this.choices[0]);
  }

  setActiveCharacter (character) {
    this.activeCharacter = character;
  }

  setUpShades () {
    var game = this.game;
    this.leftshade = game.add.sprite(WIDTH / 2, 0, "leftshade");
    this.leftshade.anchor.setTo(ReignsGame.ANCHOR.x, ReignsGame.ANCHOR.y);
    this.leftshade.position.setTo(ReignsGame.POSITION.x, ReignsGame.POSITION.y);
    this.leftshade.scale.setTo(ReignsGame.SCALE);
    this.leftshade.angle = 0;
    this.leftshade.alpha = 0;

    this.rightshade = game.add.sprite(WIDTH / 2, 0, "rightshade");
    this.rightshade.anchor.setTo(ReignsGame.ANCHOR.x, ReignsGame.ANCHOR.y);
    this.rightshade.position.setTo(ReignsGame.POSITION.x, ReignsGame.POSITION.y);
    this.rightshade.scale.setTo(ReignsGame.SCALE);
    this.rightshade.angle = 0;
    this.rightshade.alpha = 0;
  }

  create () {
    ReignsGame.getInstance().createFoundationGraphics();
    ReignsGame.getInstance().setUpChoices();
    ReignsGame.getInstance().setUpShades();
    ReignsGame.getInstance().setUpText();
    ReignsGame.getInstance().activate();
    ReignsGame.getInstance().setUpStats();
  }

  turnCardLeft () {
    if (ReignsGame.getInstance().activeChoice.character.image.angle < 10) {
      ReignsGame.getInstance().activeChoice.character.image.angle += .5;
      ReignsGame.getInstance().leftshade.angle += .5;
      ReignsGame.getInstance().rightshade.angle += .5;
    }
  }

  turnCardRight () {
    if (ReignsGame.getInstance().activeChoice.character.image.angle > -10) {
      ReignsGame.getInstance().activeChoice.character.image.angle -= .5;
      ReignsGame.getInstance().leftshade.angle -= .5;
      ReignsGame.getInstance().rightshade.angle -= .5;
    }
  }

  turnCardCenter () {
    var image = ReignsGame.getInstance().activeChoice.character.image;
    var leftshade = ReignsGame.getInstance().leftshade;
    var rightshade = ReignsGame.getInstance().rightshade;
    if (image.angle > 0.5) {
      image.angle -= 0.5;
      rightshade.angle -= 0.5;
      leftshade.angle -= 0.5;
    } else if (image.angle < -0.5) {
      image.angle += 0.5;
      rightshade.angle += 0.5;
      leftshade.angle += 0.5;
    } else {
      image.angle = 0;
      rightshade.angle = 0;
      leftshade.angle = 0;
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
    this.leftshade.alpha = 0;
    this.rightshade.alpha = 0;
    this.leftText.alpha = 0;
    this.rightText.alpha = 0;
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
        // finished falling
        var option;
        if (image.angle > 0) {
          // right choice
          option = this.activeChoice.left;
        } else {
          // left choice
          option = this.activeChoice.right;
        }
        option.activate();
      }
    }
  }

  adjustTextDisplay () {
    var image = ReignsGame.getInstance().activeChoice.character.image;
    if (image.angle > 7.5) {
      this.leftText.alpha = 0; // right
      this.rightText.alpha = 1;
      this.leftshade.alpha = 1;
      this.rightshade.alpha = 0;
    } else if (image.angle < -7.5) {
      this.rightText.alpha = 0; // left
      this.leftText.alpha = 1;
      this.leftshade.alpha = 0;
      this.rightshade.alpha = 1;
    } else {
      this.leftText.alpha = 0;
      this.rightText.alpha = 0;
      this.leftshade.alpha = 0;
      this.rightshade.alpha = 0;
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
