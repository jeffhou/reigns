
    class Choice {
        constructor (image, left_consequence, left_text, right_consequence, right_text) {
            this.left_consequence = left_consequence;
            this.left_text = left_text;
            this.right_consequence = right_consequence;
            this.right_text = right_text;
            this.image = game.add.sprite(game.width / 2, 1120, image);
            this.image.anchor = new Phaser.Point(0.5, 3);
            this.image.alpha = 0;
        }

        activate () {
            this.image.alpha = 1;
            leftText.text = this.left_text;
            rightText.text = this.right_text;
            leftText.x = game.width / 2 - leftText.width / 2 + 140;
            rightText.x = game.width / 2 - rightText.width / 2 - 140;
            return this.image;
        }
    }

    

    var game = new Phaser.Game(800, 700, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

    function preload() {
        game.load.image('cardback', 'cardback.png');
        game.load.image('squirrel', 'squirrel.png');
    }

    var ball;

    function create() {
        game.stage.backgroundColor = "#f5f5dc";

        keyQ = game.input.keyboard.addKey(Phaser.Keyboard.Q)
        card = game.add.graphics();
        card.lineStyle(10, 0xb318ab, 1);
        card.drawRoundedRect(-270, 20, 540, 600);
        /*
        card.lineStyle(10, 0xcccccc, 1);
        card.beginFill(0xcccccc);
        card.drawRoundedRect(-140, 250, 280, 280);
        */
        card.x = game.width / 2;

        game.add.sprite(game.width / 2 - 140, 250, "cardback");

        choices = [];

        /*
        bar = game.add.graphics();
        bar.lineStyle(10, 0x39aaab, 1);
        bar.beginFill(0x222222, 0.95);
        bar.drawRoundedRect(-140, -650, 280, 280);
        bar.angle = 0;
        bar.x = game.width / 2;
        bar.y = 900; */

        style = { font: "bold 36px Arial", fill: "#000", boundsAlignH: "center", textAlign: "center" };

        
        total = 0;
        topText = game.add.text(0, 130, "", style);
        topText.x = game.width / 2 - topText.width / 2 + 140;
        topText.setTextBounds(-100, 0, 100, 100)

        leftText = game.add.text(0, 180, "RIGHT...", style);
        rightText = game.add.text(0, 180, "LEFT...", style);
        //text.setTextBounds(0, 0, 800, 150);

        negative = true;
        pointer = game.input.pointer1;
        pointer = game.input.mousePointer;
        inputDisabled = false;

        choices.push(new Choice("squirrel", null, "I'M A CAT", null, "I'M A KITTY"));
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
        if (bar.y - 750 < game.height) {
            bar.y += parseInt(bar.y / 110);
            bar.angle *= 1.05;
            inputDisabled = true;
        } else {
            if (bar.angle > 0) {
            total += 2; //right
            topText.text = "" + total;
            bar.angle = 0;
            bar.y = 1120;
            inputDisabled = false;
            } else {
            //left
            total -= 2;
            topText.text = "" + total;
            bar.angle = 0;
            bar.y = 1120;
            inputDisabled = false;
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

    /*
    if (bar.angle > 10) {
        negative = !negative;
    } else if (bar.angle < -10) {
        negative = !negative;
    }

    if (negative) {
        bar.angle -= .1
    } else {
        bar.angle += .1
    }
    */
    }