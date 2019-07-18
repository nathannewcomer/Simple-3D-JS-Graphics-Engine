//Draw a three-dimensional cube in the browser
//Author: Nathan Newcomer
//Based off One lone Coder's 3D Graphics Engine (https://youtu.be/ih20l3pJoeU)

//Size the canvas
var canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
canvas.width = 640;
canvas.height = 480;

//Represents a point in 3d space
function vector3() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
}

//A triangle made out of three 3d points
function triangle() {
    this.p1 = new vector3();
    this.p2 = new vector3();
    this.p3 = new vector3();
}

//A 4x4 matrix
function matrix4x4() {
    this.m = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
}

//The cube
let mesh = [];

//4x4 projection matrix
let matProj = new matrix4x4;

let fNear = 0.1;
let fFar = 1000.0;
let fFov = 90.0;
let fAspectRatio = canvas.height / canvas.width;
let fFovRad = 1.0 / Math.tan(fFov * 0.5 / 180 * Math.PI);

//Rotation matrix for x and z
let matRotZ = new matrix4x4;
let matRotX = new matrix4x4;

let fTheta = 0;

matProj.m[0][0] = fAspectRatio * fFovRad;
matProj.m[1][1] = fFovRad;
matProj.m[2][2] = fFar / (fFar - fNear);
matProj.m[3][2] = (-fFar * fNear) / (fFar - fNear);
matProj.m[2][3] = 1.0;
matProj.m[3][3] = 0.0;

//Make 12 triangles (2 triangles for each side + 6 sides on a cube)
for (let i = 0; i < 12; i++) {
    mesh[i] = new triangle();
}

//Add the points to the mesh (maybe put into file?)

//South
mesh[0].p1.x = 0; mesh[0].p1.y = 0, mesh[0].p1.z = 0;
mesh[0].p2.x = 0; mesh[0].p2.y = 1; mesh[0].p2.z = 0;
mesh[0].p3.x = 1; mesh[0].p3.y = 1; mesh[0].p3.z = 0;
//console.log("mesh[0].p2.y = " + mesh[0].p2.y);

mesh[1].p1.x = 0; mesh[1].p1.y = 0; mesh[1].p1.z = 0;
mesh[1].p2.x = 1; mesh[1].p2.y = 1; mesh[1].p2.z = 0;
mesh[1].p3.x = 1; mesh[1].p3.y = 0; mesh[1].p3.z = 0;

//East
mesh[2].p1.x = 1; mesh[2].p1.y = 0; mesh[2].p1.z = 0;
mesh[2].p2.x = 1; mesh[2].p2.y = 1; mesh[2].p2.z = 0;
mesh[2].p3.x = 1; mesh[2].p3.y = 1; mesh[2].p3.z = 1;

mesh[3].p1.x = 1; mesh[3].p1.y = 0; mesh[3].p1.z = 0;
mesh[3].p2.x = 1; mesh[3].p2.y = 1; mesh[3].p2.z = 1;
mesh[3].p3.x = 1; mesh[3].p3.y = 0; mesh[3].p3.z = 1;

//North
mesh[4].p1.x = 1; mesh[4].p1.y = 0; mesh[4].p1.z = 1;
mesh[4].p2.x = 1; mesh[4].p2.y = 1; mesh[4].p2.z = 1;
mesh[4].p3.x = 0; mesh[4].p3.y = 1; mesh[4].p3.z = 1;

mesh[5].p1.x = 1; mesh[5].p1.y = 0; mesh[5].p1.z = 1;
mesh[5].p2.x = 0; mesh[5].p2.y = 1; mesh[5].p2.z = 1;
mesh[5].p3.x = 0; mesh[5].p3.y = 0; mesh[5].p3.z = 1;

//West
mesh[6].p1.x = 0; mesh[6].p1.y = 0; mesh[6].p1.z = 1;
mesh[6].p2.x = 0; mesh[6].p2.y = 1; mesh[6].p2.z = 1;
mesh[6].p3.x = 0; mesh[6].p3.y = 1; mesh[6].p3.z = 0;

mesh[7].p1.x = 0; mesh[7].p1.y = 0; mesh[7].p1.z = 1;
mesh[7].p2.x = 0; mesh[7].p2.y = 1; mesh[7].p2.z = 0;
mesh[7].p3.x = 0; mesh[7].p3.y = 0; mesh[7].p3.z = 0;

//Top
mesh[8].p1.x = 0; mesh[8].p1.y = 1; mesh[8].p1.z = 0;
mesh[8].p2.x = 0; mesh[8].p2.y = 1; mesh[8].p2.z = 1;
mesh[8].p3.x = 1; mesh[8].p3.y = 1; mesh[8].p3.z = 1;

mesh[9].p1.x = 0; mesh[9].p1.y = 1; mesh[9].p1.z = 0;
mesh[9].p2.x = 1; mesh[9].p2.y = 1; mesh[9].p2.z = 1;
mesh[9].p3.x = 1; mesh[9].p3.y = 1; mesh[9].p3.z = 0;

//Bottom
mesh[10].p1.x = 1; mesh[10].p1.y = 0; mesh[10].p1.z = 1;
mesh[10].p2.x = 0; mesh[10].p2.y = 0; mesh[10].p2.z = 1;
mesh[10].p3.x = 0; mesh[10].p3.y = 0; mesh[10].p3.z = 0;

mesh[11].p1.x = 1; mesh[11].p1.y = 0; mesh[11].p1.z = 1;
mesh[11].p2.x = 0; mesh[11].p2.y = 0; mesh[11].p2.z = 0;
mesh[11].p3.x = 1; mesh[11].p3.y = 0; mesh[11].p3.z = 0;

function multiplyMatrixVector(vector3d, vecOut, matrix) {
    vecOut.x = vector3d.x * matrix.m[0][0] + vector3d.y * matrix.m[1][0] + vector3d.z * matrix.m[2][0] + matrix.m[3][0];
    vecOut.y = vector3d.x * matrix.m[0][1] + vector3d.y * matrix.m[1][1] + vector3d.z * matrix.m[2][1] + matrix.m[3][1];

    //console.log("vecOut.y = " + vector3d.x * matrix[0][1] /*+ vector3d.y * matrix[1][1] + vector3d.z * matrix[2][1] + matrix[3][1]*/);

    vecOut.z = vector3d.x * matrix.m[0][2] + vector3d.y * matrix.m[1][2] + vector3d.z * matrix.m[2][2] + matrix.m[3][2];

    w = vector3d.x * matrix.m[0][3] + vector3d.y * matrix.m[1][3] + vector3d.z * matrix.m[2][3] + matrix.m[3][3];

    if (w != 0) {
        vecOut.x /= w;
        vecOut.y /= w;
        vecOut.z /= w;
    }
}

function update() {

    //Clear the screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //50 is the elapsed times in milliseconds
    fTheta += 1.0 * .05;

    //Rotation Z
    matRotZ.m[0][0] = Math.cos(fTheta);
    matRotZ.m[0][1] = Math.sin(fTheta);
    matRotZ.m[1][0] = -Math.sin(fTheta);
    matRotZ.m[1][1] = Math.cos(fTheta);
    matRotZ.m[2][2] = 1;
    matRotZ.m[3][3] = 1;

    //Rotation X
    matRotX.m[0][0] = 1;
    matRotX.m[1][1] = Math.cos(fTheta * 0.5);
    matRotX.m[1][2] = Math.sin(fTheta * 0.5);
    matRotX.m[2][1] = -Math.sin(fTheta * 0.5);
    matRotX.m[2][2] = Math.cos(fTheta * 0.5);
    matRotX.m[3][3] = 1;

    //Draw the lines
    draw();
}

//Draws everything to the screen
function draw() {

    //console.log("Test");

    ctx.beginPath();

    for (let i = 0; i < 12; i++) {
        
        let triProjected = new triangle();
        //let triTranslated = mesh[i];
        let triRotatedZ = new triangle();
        let triRotatedZX = new triangle();

        multiplyMatrixVector(mesh[i].p1, triRotatedZ.p1, matRotZ);
        multiplyMatrixVector(mesh[i].p2, triRotatedZ.p2, matRotZ);
        multiplyMatrixVector(mesh[i].p3, triRotatedZ.p3, matRotZ);

        multiplyMatrixVector(triRotatedZ.p1, triRotatedZX.p1, matRotX);
        multiplyMatrixVector(triRotatedZ.p2, triRotatedZX.p2, matRotX);
        multiplyMatrixVector(triRotatedZ.p3, triRotatedZX.p3, matRotX);

        let triTranslated = triRotatedZX;

        triTranslated.p1.z = triRotatedZX.p1.z + 3;
        triTranslated.p2.z = triRotatedZX.p2.z + 3;
        triTranslated.p3.z = triRotatedZX.p3.z + 3;

        multiplyMatrixVector(triTranslated.p1, triProjected.p1, matProj);
        multiplyMatrixVector(triTranslated.p2, triProjected.p2, matProj);
        multiplyMatrixVector(triTranslated.p3, triProjected.p3, matProj);

        //scale into view
        triProjected.p1.x += 1.0;
        triProjected.p1.y += 1.0;
        triProjected.p2.x += 1.0;
        triProjected.p2.y += 1.0;
        triProjected.p3.x += 1.0;
        triProjected.p3.y += 1.0;

        triProjected.p1.x *= 0.5 * canvas.width;
        triProjected.p1.y *= 0.5 * canvas.height;
        triProjected.p2.x *= 0.5 * canvas.width;
        triProjected.p2.y *= 0.5 * canvas.height;
        triProjected.p3.x *= 0.5 * canvas.width;
        triProjected.p3.y *= 0.5 * canvas.height;

        drawLine(triProjected.p1.x, triProjected.p1.y, triProjected.p2.x, triProjected.p2.y);
        drawLine(triProjected.p2.x, triProjected.p2.y, triProjected.p3.x, triProjected.p3.y);
        drawLine(triProjected.p3.x, triProjected.p3.y, triProjected.p1.x, triProjected.p1.y);

    }


    //Draw the rectangle

    //ctx.rect(x, y, width, height);
    //ctx.fillStyle = "black";
    //ctx.fill();
    ctx.closePath();
}

function drawLine(x1, y1, x2, y2) {
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}


//The game loop
setInterval(update, 50);
//update();