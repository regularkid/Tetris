var GridSquareState =
{
    OFF: 0,     // Empty square
    ON: 1,      // Solid block locked into place
    TEMP: 2,    // A moving block (ie., the currently falling piece or a ghost block)
};

function GridSquare(x, y, size, group)
{
    this.x = x;
    this.y = y;
    this.size = size;
    this.state = GridSquareState.OFF;
    this.color = 0x333333;

    // Create sprite
    this.sprite = game.add.sprite(x, y, "square");
    this.sprite.width = size;
    this.sprite.height = size;
    this.sprite.tint = this.color;

    group.add(this.sprite);

    this.Set = function(state, color)
    {
        this.state = state;

        switch (this.state)
        {
            case GridSquareState.OFF:
            {
                this.color = 0x333333;
            } break;

            case GridSquareState.ON:
            case GridSquareState.TEMP:
            {
                this.color = color;
            } break;
        }

        this.sprite.tint = this.color;
    };
}