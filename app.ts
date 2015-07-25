var gl : WebGLRenderingContext

var boxColor: HTMLSelectElement
var sliderWidth: HTMLInputElement
var isMousePressed = false
var mousePrevPosition: any = null

var maxNumVertices = 50000;
var index = 0

window.onload = () => {

    var canvas = <HTMLCanvasElement>document.getElementById("gl-canvas");
    gl = setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    gl.viewport(0, 0, canvas.width, canvas.height)
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
    boxColor = <HTMLSelectElement>document.getElementById("boxColor")
    sliderWidth = <HTMLInputElement>document.getElementById("sliderWidth")
    sliderWidth.onchange = boxColor.onchange = () =>
    {
        render()
    }

    

    //
    canvas.onmousedown = (event) =>
    {
        isMousePressed = true

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
    }

    canvas.onmouseup = () =>
    {
        isMousePressed = false
        mousePrevPosition = null
    }

    function ToCanvasCoordinates(mousePos: number[]): number[]
    {
        return vec2(2 * mousePos[0] / canvas.width - 1,
            2 * (canvas.height - mousePos[1]) / canvas.height - 1)
    }

    function addLine(pos1: number[], pos2: number[])
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * index, flatten(pos1));
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + 1), flatten(pos2));

        var currentColor = vec4(+boxColor.value[0], +boxColor.value[1], +boxColor.value[2], 1)
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * index, flatten(currentColor));
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index + 1), flatten(currentColor));

        index += 2
    }

    canvas.onmousemove = event =>
    {
        if (!isMousePressed)
            return

        var mouseCurrentPosition = vec2(event.offsetX, event.offsetY)

        if (mousePrevPosition != null)
        {
            addLine(ToCanvasCoordinates(mousePrevPosition), ToCanvasCoordinates(mouseCurrentPosition))

            var lineWidth = +sliderWidth.value
        }

        mousePrevPosition = mouseCurrentPosition
    }

    render()
};


function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT);

    //for (var i = 0; i < index; i += 4)
    //    gl.drawArrays(gl.TRIANGLE_FAN, i, 4);

    for (var i = 0; i < index; i += 2)
    {
        gl.drawArrays(gl.LINES, i, 2)
    }

    window.requestAnimationFrame(render);
}