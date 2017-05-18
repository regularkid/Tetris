var keyReset = null;

var gameOverState =
{
    preload: function()
    {
        sfxGameOver = game.add.audio("gameOver");
        sfxGameOver.play();
    },

    create: function()
    {
        keyReset = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        keyReset.onDown.add(this.onResetPressed, this);

        var background = game.add.sprite(0, 0, "square");
        background.width = game.world.width;
        background.height = game.world.height;
        background.alpha = 0.85;
        background.tint = 0x000000;

        var textGameOver = game.add.text(game.world.centerX, game.world.centerY - 65, "Game Over");
        textGameOver.anchor.set(0.5);
        textGameOver.font = "Arial Black";
        textGameOver.fontSize = 75;
        textGameOver.fill = "#BB0000";
        textGameOver.stroke = "#000000";
        textGameOver.strokeThickness = 5;

        var textContinue = game.add.text(game.world.centerX, game.world.centerY, "Press [SPACE] to Play Again");
        textContinue.anchor.set(0.5);
        textContinue.font = "Arial Black";
        textContinue.fontSize = 25;
        textContinue.fill = "#FFFFFF";
        textContinue.stroke = "#000000";
        textContinue.strokeThickness = 3;

        music.volume = 0.2;
    },

    update: function()
    {
    },

    onResetPressed: function()
    {
        music.volume = 1.0;

        game.state.start("play");
    },
};