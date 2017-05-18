// Official piece names (http://tetris.wikia.com/wiki/Tetromino)
var PieceTypes =
{
    O: 0,
    T: 1,
    S: 2,
    Z: 3,
    L: 4,
    J: 5,
    I: 6,

    COUNT: 7,
};

var PieceDefinitions =
[
    // O
    {
        grid:
        [
            [1, 1],
            [1, 1],
        ],

        color: 0xFFFF00,
        ghostColor: 0x6F6F24,
        startCol: 4,
        startRow: 0,
    },

    // T
    {
        grid:
        [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0],
        ],

        color: 0x00FFFF,
        ghostColor: 0x246F6F,
        startCol: 3,
        startRow: -1,
    },

    // S
    {
        grid:
        [
            [0, 0, 0],
            [0, 1, 1],
            [1, 1, 0],
        ],

        color: 0xFF00FF,
        ghostColor: 0x6F246F,
        startCol: 3,
        startRow: -1,
    },

    // Z
    {
        grid:
        [
            [0, 0, 0],
            [1, 1, 0],
            [0, 1, 1],
        ],

        color: 0x00FF00,
        ghostColor: 0x246F24,
        startCol: 3,
        startRow: -1,
    },

    // L
    {
        grid:
        [
            [0, 0, 0],
            [1, 1, 1],
            [1, 0, 0],
        ],

        color: 0x0000FF,
        ghostColor: 0x1F1F97,
        startCol: 3,
        startRow: -1,
    },

    // J
    {
        grid:
        [
            [0, 0, 0],
            [1, 1, 1],
            [0, 0, 1],
        ],

        color: 0xFF8800,
        ghostColor: 0x6F4C24,
        startCol: 3,
        startRow: -1,
    },

    // I
    {
        grid:
        [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
        ],

        color: 0xFF0000,
        ghostColor: 0x8F1717,
        startCol: 3,
        startRow: -2,
    }
];

function GamePiece(x, y, type)
{
    this.x = x;
    this.y = y;
    this.type = type;

    // Create grid square array
    this.grid = CopyArray(PieceDefinitions[type].grid);
    this.color = PieceDefinitions[type].color;
    this.ghostColor = PieceDefinitions[type].ghostColor;

    this.ForEachGrid = function(func)
    {
        for (var row = 0; row < this.grid.length; row++)
        {
            for (var col = 0; col < this.grid[row].length; col++)
            {
                func(this, col, row);
            }
        }
    };

    this.IsCollidingWithGameBoard = function()
    {
        for (var yOffset = 0; yOffset < this.grid.length; yOffset++)
        {
            for (var xOffset = 0; xOffset < this.grid[yOffset].length; xOffset++)
            {
                if (this.grid[yOffset][xOffset] == 1)
                {
                    gameBoardCol = this.x + xOffset;
                    gameBoardRow = this.y + yOffset;
                    if (gameBoardCol < 0 || gameBoardCol >= gameBoard.width ||
                        gameBoardRow >= gameBoard.height)
                    {
                        return true;
                    }

                    var gridSquare = gameBoard.GetGridSquare(gameBoardCol, gameBoardRow);
                    if (gridSquare != null && gridSquare.state == GridSquareState.ON)
                    {
                        return true;
                    }
                }
            }
        }

        return false;
    };

    this.DrawToGameBoard = function()
    {
        var ghostYPos = this.GetGhostYPos();

        this.ForEachGrid(function(gamePiece, col, row)
        {
            if (gamePiece.grid[row][col] == 1)
            {
                gameBoard.SetGridSquare(gamePiece.x + col, ghostYPos + row, GridSquareState.TEMP, gamePiece.ghostColor);
                gameBoard.SetGridSquare(gamePiece.x + col, gamePiece.y + row, GridSquareState.TEMP, gamePiece.color);
            }
        });
    };

    this.RemoveFromGameBoard = function()
    {
        var ghostYPos = this.GetGhostYPos();

        this.ForEachGrid(function(gamePiece, col, row)
        {
            if (gamePiece.grid[row][col] == 1)
            {
                var gridSquare = gameBoard.GetGridSquare(gamePiece.x + col, ghostYPos + row);
                if (gridSquare != null && gridSquare.state == GridSquareState.TEMP)
                {
                    gameBoard.SetGridSquare(gamePiece.x + col, ghostYPos + row, GridSquareState.OFF);
                }

                gridSquare = gameBoard.GetGridSquare(gamePiece.x + col, gamePiece.y + row);
                if (gridSquare != null && gridSquare.state == GridSquareState.TEMP)
                {
                    gameBoard.SetGridSquare(gamePiece.x + col, gamePiece.y + row, GridSquareState.OFF);
                }
            }
        });
    };

    this.Move = function(xDelta, yDelta)
    {
        this.RemoveFromGameBoard();

        this.x += xDelta;
        this.y += yDelta;

        var moveSuccessful = true;
        if (this.IsCollidingWithGameBoard())
        {
            this.x -= xDelta;
            this.y -= yDelta;
            moveSuccessful = false;
        }
        else
        {
            if (yDelta == 0)
            {
                sfxMove.play();
            }
        }

        this.DrawToGameBoard();
        return moveSuccessful;
    };

    this.RotateClockwise = function()
    {
        this.RemoveFromGameBoard();

        var tempGrid = CopyArray(this.grid);
        this.ForEachGrid(function(gamePiece, col, row)
        {
            gamePiece.grid[row][col] = tempGrid[gamePiece.grid.length - col - 1][row];
        });

        var xSave = this.x;
        var rotationSuccessful = false;
        var offsetsToTry = [0, 1, -1];
        if (this.type == PieceTypes.I)
        {
            offsetsToTry.push(2);
            offsetsToTry.push(-2);
        }

        for (var i = 0; i < offsetsToTry.length; i++)
        {
            this.x = xSave + offsetsToTry[i];
            if (!this.IsCollidingWithGameBoard())
            {
                rotationSuccessful = true;
                break;
            }
        }

        if (rotationSuccessful == false)
        {
            this.x = xSave;
            this.RotateCounterClockwise();
        }
        else
        {
            sfxRotate.play();
        }

        this.DrawToGameBoard();
    };

    this.RotateCounterClockwise = function()
    {
        this.RemoveFromGameBoard();

        var tempGrid = CopyArray(this.grid);
        this.ForEachGrid(function(gamePiece, col, row)
        {
            gamePiece.grid[row][col] = tempGrid[col][gamePiece.grid.length - row - 1];
        });

        var xSave = this.x;
        var rotationSuccessful = false;
        var offsetsToTry = [0, 1, -1];
        if (this.type == PieceTypes.I)
        {
            offsetsToTry.push(2);
            offsetsToTry.push(-2);
        }

        for (var i = 0; i < offsetsToTry.length; i++)
        {
            this.x = xSave + offsetsToTry[i];
            if (!this.IsCollidingWithGameBoard())
            {
                rotationSuccessful = true;
                break;
            }
        }

        if (rotationSuccessful == false)
        {
            this.x = xSave;
            this.RotateClockwise();
        }
        else
        {
            sfxRotate.play();
            //game.add.audio("rotate").play();
        }

        this.DrawToGameBoard();
    };

    this.SolidifyOnGameBoard = function()
    {
        this.ForEachGrid(function(gamePiece, col, row)
        {
            if (gamePiece.grid[row][col] == 1)
            {
                gameBoard.SetGridSquare(gamePiece.x + col, gamePiece.y + row, GridSquareState.ON, gamePiece.color);
            }
        });

        sfxTouchDown.play();
    };

    this.Drop = function()
    {
        while (true)
        {
            if (this.Move(0, 1) == false)
            {
                break;
            }
        }
    };

    this.GetGhostYPos = function()
    {
        var ySave = this.y;

        do
        {
            this.y++;
        } while (!this.IsCollidingWithGameBoard());

        var yGhost = this.y - 1;
        this.y = ySave;
        return yGhost;
    };
}