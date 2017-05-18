function GameBoard()
{
    this.x = 266;
    this.y = 30;
    this.width = 10;
    this.height = 20;

    this.grid = null;
    this.gridSquareSize = 25;
    this.gridSpacing = 2;

    this.group = game.add.group();

    // Create the grid array
    this.grid = new Array(this.width);
    for (var col = 0; col < this.width; col++)
    {
        this.grid[col] = new Array(this.height);

        for (var row = 0; row < this.height; row++)
        {
            var x = col * (this.gridSquareSize + this.gridSpacing);
            var y = row * (this.gridSquareSize + this.gridSpacing);

            this.grid[col][row] = new GridSquare(x, y, this.gridSquareSize, this.group);
        }
    }

    // Position board in scene
    this.group.x = this.x;
    this.group.y = this.y;

    this.GetGridSquare = function(col, row)
    {
        if (col < 0 || col >= this.width ||
            row < 0 || row >= this.height)
        {
            return null;
        }

        return this.grid[col][row];
    };

    this.SetGridSquare = function(col, row, state, color)
    {
        if (col < 0 || col >= this.width ||
            row < 0 || row >= this.height)
        {
            return;
        }

        this.grid[col][row].Set(state, color);
    };

    this.HighlightLines = function()
    {
        var numLines = 0;

        for (var row = this.height - 1; row > 0; row--)
        {
            var isRowComplete = true;
            for (var col = 0; col < this.width; col++)
            {
                if (this.grid[col][row].state != GridSquareState.ON)
                {
                    isRowComplete = false;
                }
            }

            if (isRowComplete)
            {
                numLines++;
                for (var col = 0; col < this.width; col++)
                {
                    this.grid[col][row].Set(GridSquareState.ON, 0xFFFFFF);
                }
            }
        }

        return numLines;
    };

    this.RemoveLines = function()
    {
        var numLines = 0;

        for (var row = this.height - 1; row > 0; row--)
        {
            var isRowComplete = true;
            for (var col = 0; col < this.width; col++)
            {
                if (this.grid[col][row].state != GridSquareState.ON)
                {
                    isRowComplete = false;
                }
            }

            if (isRowComplete)
            {
                this.ShiftGridSquaresDown(row);
                row++;
                numLines++;
            }
        }

        return numLines;
    };

    this.ShiftGridSquaresDown = function(endRow)
    {
        for (var col = 0; col < this.width; col++)
        {
            for (var row = endRow; row > 0; row--)
            {
                var gridSquareAbove = this.grid[col][row - 1];
                this.grid[col][row].Set(gridSquareAbove.state, gridSquareAbove.color);
            }

            this.grid[col][0].Set(GridSquareState.OFF);
        }
    };

    this.Reset = function()
    {
        for (var col = 0; col < this.width; col++)
        {
            for (var row = 0; row < this.height; row++)
            {
                this.grid[col][row].Set(GridSquareState.OFF);
            }
        }
    };
}