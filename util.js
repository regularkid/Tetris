function CopyArray(array)
{
    var copy;

    if (Array.isArray(array))
    {
        copy = array.slice( 0 );
        for (var i = 0; i < copy.length; i++)
        {
            copy[i] = CopyArray(copy[i]);
        }

        return copy;
    }
    
    return array;
}