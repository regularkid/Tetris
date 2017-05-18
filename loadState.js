var music = null;
var sfxMove = null;
var sfxRotate = null;
var sfxTouchDown = null;
var sfxClear = null;
var sfxClearFour = null;
var sfxGameOver = null;

var loadState =
{
    preload: function()
    {
        game.load.image("square", "Square.png")

        game.load.audio("music", ["Music.ogg"]);
        game.load.audio("move", ["Move.wav"]);
        game.load.audio("rotate", ["Rotate.wav"]);
        game.load.audio("touchDown", ["TouchDown.wav"]);
        game.load.audio("clear", ["Clear.wav"]);
        game.load.audio("clearFour", ["ClearFour.wav"]);
        game.load.audio("gameOver", ["GameOver.wav"]);
    },

    create: function()
    {
        var keyStart = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        keyStart.onDown.add(this.onResetPressed, this);

        var background = game.add.sprite(0, 0, "square");
        background.width = game.world.width;
        background.height = game.world.height;
        background.alpha = 0.85;
        background.tint = 0x000000;

        var textGameOver = game.add.text(game.world.centerX, game.world.centerY - 65, "Tetris");
        textGameOver.anchor.set(0.5);
        textGameOver.font = "Arial Black";
        textGameOver.fontSize = 75;
        textGameOver.fill = "#00FFFF";
        textGameOver.stroke = "#000000";
        textGameOver.strokeThickness = 5;

        var textContinue = game.add.text(game.world.centerX, game.world.centerY, "Press [SPACE] to Begin");
        textContinue.anchor.set(0.5);
        textContinue.font = "Arial Black";
        textContinue.fontSize = 25;
        textContinue.fill = "#FFFFFF";
        textContinue.stroke = "#000000";
        textContinue.strokeThickness = 3;
    },

    onResetPressed: function()
    {
        game.state.start("play");
    },
};