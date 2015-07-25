

function flatten(v: number[]): Float32Array
{
    var n = v.length;
    var floats = new Float32Array(n);

    for (var i = 0; i < v.length; ++i)
    {
        floats[i] = v[i];
    }

    return floats;
}