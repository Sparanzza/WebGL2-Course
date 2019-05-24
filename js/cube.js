// <reference path="js/glMatrix-0.9.5.max.js" />


document.addEventListener("DOMContentLoaded", start);
var gl;


function createCube()
{

    var cube = {};

    cube.vertices = [
      -0.5, -0.5, -0.5,
      0.5, -0.5, -0.5,
      0.5, 0.5, -0.5,
      0.5, 0.5, -0.5,
     -0.5, 0.5, -0.5,
     -0.5, -0.5, -0.5,

     -0.5, -0.5, 0.5,
      0.5, -0.5, 0.5,
      0.5, 0.5, 0.5,
      0.5, 0.5, 0.5,
     -0.5, 0.5, 0.5,
     -0.5, -0.5, 0.5,

     -0.5, 0.5, 0.5,
     -0.5, 0.5, -0.5,
     -0.5, -0.5, -0.5,
     -0.5, -0.5, -0.5,
     -0.5, -0.5, 0.5,
     -0.5, 0.5, 0.5,

      0.5, 0.5, 0.5,
      0.5, 0.5, -0.5,
      0.5, -0.5, -0.5,
      0.5, -0.5, -0.5,
      0.5, -0.5, 0.5,
      0.5, 0.5, 0.5,

     -0.5, -0.5, -0.5,
      0.5, -0.5, -0.5,
      0.5, -0.5, 0.5,
      0.5, -0.5, 0.5,
     -0.5, -0.5, 0.5,
     -0.5, -0.5, -0.5,

     -0.5, 0.5, -0.5,
      0.5, 0.5, -0.5,
      0.5, 0.5, 0.5,
      0.5, 0.5, 0.5,
     -0.5, 0.5, 0.5,
     -0.5, 0.5, -0.5
    ];


    cube.colors = [];

    var faceColors = [
        [1.0, 0.0, 0.0, 1.0], // Front face
        [0.0, 1.0, 0.0, 1.0], // Back face
        [0.0, 0.0, 1.0, 1.0], // Top face
        [1.0, 1.0, 0.0, 1.0], // Bottom face
        [1.0, 0.0, 1.0, 1.0], // Right face
        [0.0, 1.0, 1.0, 1.0] // Left face
    ];

    faceColors.forEach(function (color) {
        for (var i = 0 ; i < 6 ; i++) {
            cube.colors = cube.colors.concat(color);
        }
    }
    );


    cube.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube.vertices), gl.STATIC_DRAW);



    cube.colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube.colors), gl.STATIC_DRAW);

    cube.vertexShader = getAndCompileShader("vertexShader");
    cube.fragmentshader = getAndCompileShader("fragmentShader");
    cube.shaderProgram = gl.createProgram();
    gl.attachShader(cube.shaderProgram, cube.vertexShader);
    gl.attachShader(cube.shaderProgram, cube.fragmentshader);
    gl.linkProgram(cube.shaderProgram);

    if (!gl.getProgramParameter(cube.shaderProgram, gl.LINK_STATUS)) {
        alert("Could not link shaders");
    }


    cube.vao = gl.createVertexArray();
    gl.bindVertexArray(cube.vao);

    cube.positionAttributeLocation = gl.getAttribLocation(cube.shaderProgram, "position");
    gl.enableVertexAttribArray(cube.positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.positionBuffer);
    gl.vertexAttribPointer(cube.positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    cube.colorAttributeLocation = gl.getAttribLocation(cube.shaderProgram, "color");
    gl.enableVertexAttribArray(cube.colorAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.colorBuffer);
    gl.vertexAttribPointer(cube.colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);


    cube.modelMatrix = glMatrix.mat4.create();
    cube.modelMatrixLocation = gl.getUniformLocation(cube.shaderProgram, "modelMatrix");
    return cube;
}


function start() {

    var canvas = document.getElementById("renderCanvas");
    gl = canvas.getContext("webgl2");
        
    var cube = createCube();

    var uniformColorsArray = [];
    var color = glMatrix.vec4.fromValues(1,0,0,1);
    uniformColorsArray.push(color);
    color = glMatrix.vec4.fromValues(0,1,0,1);
    uniformColorsArray.push(color);
    color = glMatrix.vec4.fromValues(0,0,1,1);
    uniformColorsArray.push(color);

    var offsetVector = glMatrix.vec3.fromValues(-2,0,2);
    
    gl.useProgram(cube.shaderProgram);

    var viewMatrix = glMatrix.mat4.create();
    var projectionMatrix = glMatrix.mat4.create();
    glMatrix.mat4.perspective(projectionMatrix, 45 * Math.PI / 180.0, canvas.width / canvas.height, 0.1, 10);
    var viewMatrixLocation = gl.getUniformLocation(cube.shaderProgram, "viewMatrix");
    var projectionMatrixLocation = gl.getUniformLocation(cube.shaderProgram, "projectionMatrix");
    
    var colorUniformArrayLocation0 = gl.getUniformLocation(cube.shaderProgram, "colorUniformArray[0]");
    var colorUniformArrayLocation1 = gl.getUniformLocation(cube.shaderProgram, "colorUniformArray[1]");
    var colorUniformArrayLocation2 = gl.getUniformLocation(cube.shaderProgram, "colorUniformArray[2]");

    var offsetUniformLocation = gl.getUniformLocation (cube.shaderProgram , "offsets");


    var angle = 0;

    function runRenderLoop() {
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);

        glMatrix.mat4.identity(cube.modelMatrix);

        glMatrix.mat4.translate(cube.modelMatrix, cube.modelMatrix, [0, 0, -7]);
        glMatrix.mat4.rotateY(cube.modelMatrix, cube.modelMatrix, angle);
        glMatrix.mat4.rotateX(cube.modelMatrix, cube.modelMatrix, .25);


        gl.uniformMatrix4fv(cube.modelMatrixLocation, false, cube.modelMatrix);
        gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);

        gl.uniform4fv(colorUniformArrayLocation0 , uniformColorsArray[0]);
        gl.uniform4fv(colorUniformArrayLocation1 ,  uniformColorsArray[2]);
        gl.uniform4fv(colorUniformArrayLocation2 ,  uniformColorsArray[2]);

        gl.uniform3fv(offsetUniformLocation , offsetVector);


        gl.useProgram(cube.shaderProgram);
        gl.bindVertexArray(cube.vao);
        gl.drawArrays(gl.TRIANGLES, 0, 36);

        gl.drawArraysInstanced(gl.TRIANGLES, 0,36,3);

        angle+= .01;
        requestAnimationFrame(runRenderLoop);
    }

    requestAnimationFrame(runRenderLoop);

}

function getAndCompileShader(id) {
    var shader;
    var shaderElement = document.getElementById(id);
    var shaderText = shaderElement.text.trim();
    if (id == "vertexShader")
        shader = gl.createShader(gl.VERTEX_SHADER);
    else if (id == "fragmentShader")
        shader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(shader, shaderText);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}
