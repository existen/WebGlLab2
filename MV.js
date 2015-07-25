//////////////////////////////////////////////////////////////////////////////
//
//  Angel.js
//
//////////////////////////////////////////////////////////////////////////////
//----------------------------------------------------------------------------
//
//  Helper functions
//
function _argumentsToArray(args) {
    return [].concat.apply([], Array.prototype.slice.apply(args));
}
//----------------------------------------------------------------------------
function radians(degrees) {
    return degrees * Math.PI / 180.0;
}
//----------------------------------------------------------------------------
//
//  Vector Constructors
//
function vec2() {
    var numbers = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        numbers[_i - 0] = arguments[_i];
    }
    var result = numbers;
    switch (result.length) {
        case 0: result.push(0.0);
        case 1: result.push(0.0);
    }
    return result.splice(0, 2);
}
function vec3() {
    var numbers = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        numbers[_i - 0] = arguments[_i];
    }
    var result = numbers;
    switch (result.length) {
        case 0: result.push(0.0);
        case 1: result.push(0.0);
        case 2: result.push(0.0);
    }
    return result.splice(0, 3);
}
function vec4() {
    var numbers = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        numbers[_i - 0] = arguments[_i];
    }
    var result = numbers;
    switch (result.length) {
        case 0: result.push(0.0);
        case 1: result.push(0.0);
        case 2: result.push(0.0);
        case 3: result.push(1.0);
    }
    return result.splice(0, 4);
}
//----------------------------------------------------------------------------
//
//  Matrix Functions
//
function transpose(m) {
    if (!m.matrix) {
        return "transpose(): trying to transpose a non-matrix";
    }
    var result = [];
    for (var i = 0; i < m.length; ++i) {
        result.push([]);
        for (var j = 0; j < m[i].length; ++j) {
            result[i].push(m[j][i]);
        }
    }
    result.matrix = true;
    return result;
}
function mix(u, v, s) {
    if (u.length != v.length) {
        throw "vector dimension mismatch";
    }
    var result = [];
    for (var i = 0; i < u.length; ++i) {
        result.push(s * u[i] + (1.0 - s) * v[i]);
    }
    return result;
}
function flatten1(v) {
    if (v.matrix === true) {
        v = transpose(v);
    }
    var n = v.length;
    var elemsAreArrays = false;
    if (Array.isArray(v[0])) {
        elemsAreArrays = true;
        n *= v[0].length;
    }
    var floats = new Float32Array(n);
    if (elemsAreArrays) {
        var idx = 0;
        for (var i = 0; i < v.length; ++i) {
            for (var j = 0; j < v[i].length; ++j) {
                floats[idx++] = v[i][j];
            }
        }
    }
    else {
        for (var i = 0; i < v.length; ++i) {
            floats[i] = v[i];
        }
    }
    return floats;
}
//----------------------------------------------------------------------------
var sizeof = {
    'vec2': new Float32Array(flatten1(vec2())).byteLength,
    'vec3': new Float32Array(flatten1(vec3())).byteLength,
    'vec4': new Float32Array(flatten1(vec4())).byteLength,
};
//# sourceMappingURL=MV.js.map