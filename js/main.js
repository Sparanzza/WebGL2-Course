document.addEventListener("DOMContentLoaded" , start );

var gl;

function start(){
    console.log("started");
    var canvas = document.getElementById("renderCanvas");
    gl = canvas.getContext("webgl2");

    var triangleVertices = [
        1.0 ,-1.0 , 0.0 ,
        0.0 , 1.0 , 0.0 ,
        -1.0, -1.0 , 0.0
    ];

    var triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER , new Float32Array( triangleVertices ) 
, gl.STATIC_DRAW);

    var triangleColors = [
        1.0 , 0.0 , 0.0 , 1.0,
        0.0 , 1.0 , 0.0 , 1.0,
        0.0 , 0.0 , 1.0 , 1.0
    ];

    var triangleVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER , triangleVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER , new Float32Array(triangleColors), gl.STATIC_DRAW)

    var vertexShader =getAndCompileShader("vertexShader");
    getAndCompileShader("fragmentShader");
}

function getAndCompileShader (id){
    var shader;
    var shaderElement = document.getElementById(id);

    console.log(shaderElement);
    var shaderText = shaderElement.text.trim();
    
    if (id =="vertexShader"){
        shader = gl.createShader(gl.VERTEX_SHADER);
    }else if (id == "fragmentShader"){
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    }
    var vertexShader = gl.shaderSource(shader, shaderText);
    var fragmentShader = gl.compileShader(shader);

    var shaderProgram = 

    if ( !gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert (gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}
