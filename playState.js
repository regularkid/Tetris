var curPiece = null;

var keyUp = null;
var keyDown = null;
var keyLeft = null;
var keyRight = null;
var keySpace = null;
var keyA = null;
var keyD = null;
var keyM = null;

var gameTimer = 0.0;
var gameSpeedInterval = 0.5;

var lineRemovalTimer = 0.0;
var lineRemovalTime = 0.5;

var horzInputTimer = 0.0;
var horzInputSpeedInterval = 0.07;

var vertInputTimer = 0.0;
var vertInputSpeedInterval = 0.07;

var spawnBag = {};

var numLines = 0;
var textNumLines = null;
var textNumLinesTitle = null;

var level = 1;
var textLevel = null;
var textLevelTitle = null;

var playState =
{
    preload: function()
    {
        if (music != null)
        {
            music.stop();
        }

        music = game.add.audio("music");
        music.loop = true;
        music.play();

        sfxMove = game.add.audio("move");
        sfxRotate = game.add.audio("rotate");
        sfxTouchDown = game.add.audio("touchDown");
        sfxClear = game.add.audio("clear");
        sfxClearFour = game.add.audio("clearFour");
    },

    create: function()
    {
        keyUp = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        keyDown = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        keyLeft = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        keyRight = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        keySpace = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        keyA = game.input.keyboard.addKey(Phaser.Keyboard.A);
        keyD = game.input.keyboard.addKey(Phaser.Keyboard.D);
        keyM = game.input.keyboard.addKey(Phaser.Keyboard.M);

        keyUp.onDown.add(this.onUpPressed, this);
        keyDown.onDown.add(this.onDownPressed, this);
        keyLeft.onDown.add(this.onLeftPressed, this);
        keyRight.onDown.add(this.onRightPressed, this);
        keySpace.onDown.add(this.onDPressed, this);
        keyA.onDown.add(this.onAPressed, this);
        keyD.onDown.add(this.onDPressed, this);
        keyM.onDown.add(this.onMPressed, this);

        gameBoard = new GameBoard();
        gameBoard.Reset();

        gameSpeedInterval = 0.5;
        gameTimer = gameSpeedInterval;
        lineRemovalTimer = 0.0;        
        numLines = 0;
        level = 1;

        spawnBag = {};
        this.spawnNextPiece();

        textNumLinesTitle = this.CreateTextObj(666, 75, "Lines", 50, "center");
        textNumLines = this.CreateTextObj(666, 125, "0", 50, "center");
        textLevelTitle = this.CreateTextObj(666, 250, "Level", 50, "center");
        textLevel = this.CreateTextObj(666, 300, "1", 50, "center");

        this.CreateTextObj(25, 50, "Controls", 35, "left");
        this.CreateTextObj(25, 100, "Arrows - Move", 20, "left");
        this.CreateTextObj(25, 130, "Up - Drop", 20, "left");
        this.CreateTextObj(25, 160, "A - Rotate Left", 20, "left");
        this.CreateTextObj(25, 190, "D - Rotate Right", 20, "left");
        this.CreateTextObj(25, 220, "M - Toggle Sound", 20, "left");
    },

    CreateTextObj: function(x, y, text, fontSize, align)
    {
        textObj = game.add.text(x, y, text);

        if (align == "center")
        {
            textObj.anchor.set(0.5);
        }
        textObj.font = 'Arial Black';
        textObj.fontSize = fontSize;
        textObj.fill = '#FFFFFF';

        return textObj;
    },

    update: function()
    {
        var elapsedSec = game.time.physicsElapsed;

        if (lineRemovalTimer > 0.0)
        {
            lineRemovalTimer -= elapsedSec;
            if (lineRemovalTimer <= 0.0)
            {
                numLines += gameBoard.RemoveLines();
                textNumLines.setText(numLines.toString());

                var newLevel = Math.floor(numLines / 10) + 1;
                if (newLevel > level)
                {
                    level = newLevel;
                    textLevel.setText(level.toString());

                    gameSpeedInterval = ((11 - level) * 0.05);
                }

                this.spawnNextPiece();
            }
        }
        else
        {
            if (curPiece != null)
            {
                if (keyDown.isDown)
                {
                    vertInputTimer -= elapsedSec;
                    if (vertInputTimer <= 0.0)
                    {
                        vertInputTimer += vertInputSpeedInterval;
                        if (curPiece.Move(0, 1))
                        {
                            gameTimer = gameSpeedInterval;
                        }
                    }
                }

                if (keyLeft.isDown)
                {
                    horzInputTimer -= elapsedSec;
                    if (horzInputTimer <= 0.0)
                    {
                        horzInputTimer += horzInputSpeedInterval;
                        if (curPiece.Move(-1, 0))
                        {
                            gameTimer = gameSpeedInterval;
                        }
                    }
                }
                else if (keyRight.isDown)
                {
                    horzInputTimer -= elapsedSec;
                    if (horzInputTimer <= 0.0)
                    {
                        horzInputTimer += horzInputSpeedInterval;
                        if (curPiece.Move(1, 0))
                        {
                            gameTimer = gameSpeedInterval;
                        }
                    }
                }
            }

            gameTimer -= elapsedSec;
            if (gameTimer <= 0.0)
            {
                if (curPiece != null)
                {
                    if (curPiece.Move(0, 1) == false)
                    {
                        curPiece.SolidifyOnGameBoard();
                        curPiece = null;

                        var numLinesHighlighted = gameBoard.HighlightLines();
                        if (numLinesHighlighted > 0)
                        {
                            lineRemovalTimer = lineRemovalTime;

                            if (numLinesHighlighted == 4)
                            {
                                sfxClearFour.play();
                            }
                            else
                            {
                                sfxClear.play();
                            }
                        }
                        else
                        {
                            this.spawnNextPiece();
                        }
                    }
                }

                gameTimer += gameSpeedInterval;
            }
        }
    },

    onUpPressed: function()
    {
        if (curPiece != null)
        {
            curPiece.Drop();
            gameTimer = 0.0;
        }
    },

    onDownPressed: function()
    {
        if (curPiece != null)
        {
            curPiece.Move(0, 1);
        }
    },

    onLeftPressed: function()
    {
        if (curPiece != null)
        {
            horzInputTimer = horzInputSpeedInterval * 3;
            curPiece.Move(-1, 0);
        }
    },

    onRightPressed: function()
    {
        if (curPiece != null)
        {
            horzInputTimer = horzInputSpeedInterval * 3;
            curPiece.Move(1, 0);
        }
    },

    onSpacePressed: function()
    {
        if (curPiece != null)
        {
            curPiece.RemoveFromGameBoard();
        }

        this.spawnNextPiece();
    },

    onAPressed: function()
    {
        if (curPiece != null)
        {
            curPiece.RotateCounterClockwise();
        }
    },

    onDPressed: function()
    {
        if (curPiece != null)
        {
            curPiece.RotateClockwise();
        }
    },

    onMPressed: function()
    {
        game.sound.mute = !game.sound.mute;
    },

    spawnNextPiece: function()
    {
        do
        {
            var pieceType = game.rnd.integerInRange(0, PieceTypes.COUNT - 1);
            curPiece = new GamePiece(PieceDefinitions[pieceType].startCol, PieceDefinitions[pieceType].startRow, pieceType);
        } while (pieceType in spawnBag)

        spawnBag[pieceType] = true;
        if (Object.keys(spawnBag).length == 7)
        {
            spawnBag = {};
        }

        if (curPiece.IsCollidingWithGameBoard())
        {
            curPiece.DrawToGameBoard();
            curPiece = null;
            game.state.start("gameOver", false);
        }
        else
        {
            curPiece.DrawToGameBoard();
        }
    },
};