document.addEventListener("DOMContentLoaded" , start );
function start(){
    console.log("started");
    var canvas = document.getElementById("renderCanvas");
    gl = canvas.getContext("webgl2");
}