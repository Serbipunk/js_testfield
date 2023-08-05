let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

var window_width = window.innerWidth;
var window_height = window.innerHeight;

canvas.width = window_width;
canvas.height = window_height;

canvas.style.background = "#bbf";

context.beginPath();

// context.moveTo(0, 0);
// context.lineTo(0, 250);
// context.lineTo(50, 180);

const data = [200, 150, 180, 100, 80, 50, 350, 200, 200, 230];

const start_value = data[0]
const distance = canvas.width / data.length;
const start_point = 0;

context.beginPath();

context.lineWidth = 5;
context.strokeStyle = "#f56";

context.moveTo(start_point, start_value);

data.forEach( (element, index) => {
    const new_distance = start_point + distance * (index + 1);
    context.lineTo(new_distance, element);
}
);
context.fillStyle = "grey";
context.fill();

context.stroke();

context.closePath();