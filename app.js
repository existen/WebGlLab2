var gl;
var boxColor;
var sliderWidth;
var isMousePressed = false;
var mousePrevPosition = null;
var maxNumVertices = 100000;
var index = 0;
window.onload = function () {
    var canvas = document.getElementById("gl-canvas");
    gl = setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    //gl.clearColor(0.0, 0.0, 0.0, 1.0);
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * maxNumVertices, gl.STATIC_DRAW);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 16 * maxNumVertices, gl.STATIC_DRAW);
    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
    //
    boxColor = document.getElementById("boxColor");
    sliderWidth = document.getElementById("sliderWidth");
    sliderWidth.onchange = boxColor.onchange = function () {
        render();
    };
    //
    canvas.onmousedown = function (event) {
        isMousePressed = true;
        //
        //if (first) {
        //    first = false;
        //    t1 = vec2(2 * event.offsetX / canvas.width - 1,
        //        2 * (canvas.height - event.offsetY) / canvas.height - 1);
        //}
        //else {
        //    first = true;
        //    t2 = vec2(2 * event.offsetX / canvas.width - 1,
        //        2 * (canvas.height - event.offsetY) / canvas.height - 1);
        //    t3 = vec2(t1[0], t2[1]);
        //    t4 = vec2(t2[0], t1[1]);
        //    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        //    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * index, flatten(t1));
        //    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + 1), flatten(t3));
        //    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + 2), flatten(t2));
        //    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + 3), flatten(t4));
        //    index += 4;
        //    var currentColor = vec3(+boxColor.value[0], +boxColor.value[1], +boxColor.value[2])
        //    var t = vec4(currentColor[0], currentColor[1], currentColor[2], 1);
        //    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        //    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index - 4), flatten(t));
        //    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index - 3), flatten(t));
        //    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index - 2), flatten(t));
        //    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index - 1), flatten(t));
        //}
    };
    canvas.onmouseup = function () {
        isMousePressed = false;
        mousePrevPosition = null;
    };
    function ToCanvasCoordinates(mousePos) {
        return vec2(2 * mousePos[0] / canvas.width - 1, 2 * (canvas.height - mousePos[1]) / canvas.height - 1);
    }
    function addLine(pos1, pos2) {
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * index, flatten(pos1));
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + 1), flatten(pos2));
        var currentColor = vec4(+boxColor.value[0], +boxColor.value[1], +boxColor.value[2], 1);
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * index, flatten(currentColor));
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index + 1), flatten(currentColor));
        index += 2;
    }
    function GetAngleOfLineBetweenTwoPoints(p1, p2) {
        return Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * (180.0 / Math.PI);
    }
    function sign(p) {
        return p < 0 ? -1 : (p > 0 ? 1 : 0);
    }
    canvas.onmousemove = function (event) {
        if (!isMousePressed)
            return;
        var mouseCurrentPosition = vec2(event.offsetX, event.offsetY);
        if (mousePrevPosition != null) {
            var lineWidth = +sliderWidth.value;
            var lineAngle = GetAngleOfLineBetweenTwoPoints(mouseCurrentPosition, mousePrevPosition);
            var dPixelsValue = 0.7;
            var getCoordinatesRight = function (mousePosition, dAngle, dPixels) {
                return ToCanvasCoordinates(vec2(mousePosition[0] + dPixels * Math.cos(radians(lineAngle + dAngle)), mousePosition[1] + dPixels * Math.sin(radians(lineAngle + dAngle))));
            };
            for (var i = -lineWidth + 1; i <= lineWidth - 1; ++i) {
                var dPixels = i * dPixelsValue;
                if (lineWidth > 4) {
                    var p1 = ToCanvasCoordinates(vec2(mousePrevPosition[0] + dPixels, mousePrevPosition[1] + dPixels));
                    var p2 = ToCanvasCoordinates(vec2(mouseCurrentPosition[0] + dPixels, mouseCurrentPosition[1] + dPixels));
                    addLine(p1, p2);
                }
                else {
                    var p1 = getCoordinatesRight(mousePrevPosition, sign(i) * 90.0, dPixels);
                    var p2 = getCoordinatesRight(mouseCurrentPosition, sign(i) * 90.0, dPixels);
                    addLine(p1, p2);
                }
            }
        }
        mousePrevPosition = mouseCurrentPosition;
    };
    render();
};
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    //for (var i = 0; i < index; i += 4)
    //    gl.drawArrays(gl.TRIANGLE_FAN, i, 4);
    //for (var i = 0; i < index; i += 2)
    //{
    //    gl.drawArrays(gl.LINES, i, 2)
    //}
    gl.drawArrays(gl.LINES, 0, index);
    window.requestAnimationFrame(render);
}
//# sourceMappingURL=app.js.map