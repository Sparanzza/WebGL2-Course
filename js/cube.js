document.addEventListener("DOMContentLoaded" , start );

var gl;

function start(){
    console.log("started");
    var canvas = document.getElementById("renderCanvas");
    gl = canvas.getContext("webgl2"); 

    var vertices =[
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
    

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER , new Float32Array( vertices ) , gl.STATIC_DRAW);
    
    var colors = [ ];

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
            colors = colors.concat(color);
        }
    }
    );


    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER , colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER , new Float32Array(colors), gl.STATIC_DRAW);


    var vertexShader = getAndCompileShader("vertexShader");
    var fragmentShader = getAndCompileShader("fragmentShader");
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram , vertexShader);
    gl.attachShader(shaderProgram , fragmentShader);
    gl.linkProgram( shaderProgram );

    if (! gl.getProgramParameter(shaderProgram , gl.LINK_STATUS)){
        alert("Could not initializse shader");
    }

    gl.useProgram(shaderProgram);

    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    var positionAttributeLocation = gl.getAttribLocation(shaderProgram, "position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER , positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation , 3 , gl.FLOAT,false, 0,0);

    var colorAttributeLocation = gl.getAttribLocation(shaderProgram, "color");
    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER , colorBuffer);
    gl.vertexAttribPointer(colorAttributeLocation , 4 , gl.FLOAT,false, 0,0);


    var modelMatrix = glMatrix.mat4.create();
    var viewMatrix = glMatrix.mat4.create();
    var projectionMatrix = glMatrix.mat4.create();
    
    glMatrix.mat4.perspective(projectionMatrix , 45 * Math.PI / 180.0, canvas.width / canvas.height, .1 , 100);
    
    var modelMatrixLocation = gl.getUniformLocation(shaderProgram , "modelMatrix");
    var viewMatrixLocation = gl.getUniformLocation(shaderProgram , "viewMatrix");
    var projectionMatrixLocation = gl.getUniformLocation(shaderProgram , "projectionMatrix");
    
    var angle = 0;


    requestAnimationFrame(RunRenderLoop);

    function RunRenderLoop(){
        
        gl.clearColor(0,0,0,1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DETPH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);

        glMatrix.mat4.identity(modelMatrix);
        glMatrix.mat4.translate(modelMatrix, modelMatrix, [0,0,-10]);
        glMatrix.mat4.rotateY(modelMatrix , modelMatrix, angle);
        //glMatrix.mat4.translate(modelMatrix, modelMatrix, [0,0,-10]);
        glMatrix.mat4.rotateZ(modelMatrix , modelMatrix, angle / 3);
        angle += .05;

        gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);
        gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);

        gl.useProgram(shaderProgram);

        gl.bindVertexArray(vao);
        gl.drawArrays(gl.TRIANGLES , 0 , 36);
        requestAnimationFrame(RunRenderLoop);
    }
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
    gl.shaderSource(shader, shaderText);
    gl.compileShader(shader);

    if ( !gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert (gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}


