var canvas = document.getElementById("canvas");
console.log(canvas);

var ctx = canvas.getContext("2d");
var canvasOffset = $("#canvas").offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;
var storedLines = [];
var startX = 0;
var startY = 0;
var isDown;

ctx.strokeStyle = "orange";
ctx.lineWidth = 3;

$("#canvas").mousedown(function (e) {
    handleMouseDown(e);
});
$("#canvas").mousemove(function (e) {
    handleMouseMove(e);
});
$("#canvas").mouseup(function (e) {
    handleMouseUp(e);
});

$("#clear").click(function () {
    storedLines.length = 0;
    redrawStoredLines();
});

function handleMouseDown(e) {
    var mouseX = parseInt(e.clientX - offsetX);
    var mouseY = parseInt(e.clientY - offsetY);

    isDown = true;
    startX = mouseX;
    startY = mouseY;

}

function handleMouseMove(e) {

    if (!isDown) {
        return;
    }

    redrawStoredLines();

    var mouseX = parseInt(e.clientX - offsetX);
    var mouseY = parseInt(e.clientY - offsetY);

    // draw the current line
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(mouseX, mouseY);
    ctx.stroke()

}


function handleMouseUp(e) {

    isDown = false;

    var mouseX = parseInt(e.clientX - offsetX);
    var mouseY = parseInt(e.clientY - offsetY);

    storedLines.push({
        x1: startX,
        y1: startY,
        x2: mouseX,
        y2: mouseY
    });

    redrawStoredLines();

}


function redrawStoredLines() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (storedLines.length == 0) {
        return;
    }

    // redraw each stored line
    for (var i = 0; i < storedLines.length; i++) {
        ctx.beginPath();
        ctx.moveTo(storedLines[i].x1, storedLines[i].y1);
        ctx.lineTo(storedLines[i].x2, storedLines[i].y2);
        ctx.stroke();
    }
}