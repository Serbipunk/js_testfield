let canvas = document.getElementById("canvas");


var window_width = window.innerWidth;
var window_height = window.innerHeight;

canvas.width = window_width;
canvas.height = window_height;

canvas.style.background = "#bbf";

class Circle {
    constructor(xpoint, ypoint, radius, color) {
        this.xpoint = xpoint;
        this.ypoint = ypoint;
        this.radius = radius;
        this.color = color;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.xpoint, this.ypoint, this.radius, 0, 2 * Math.PI);

        context.strokeStyle = "grey";
        context.linewidth= 3;
        context.fillStyle = this.color;
        context.fill();

        context.stroke();
        context.closePath();
    }

    changeColor(newColor) {
        this.color = newColor;
        this.draw(context);
    }

    clickCircle(xmouse, ymouse) {
        // console.log("xmouse: " + xmouse + " ymouse: " + ymouse);
        var distance = (xmouse - this.xpoint) * (xmouse - this.xpoint)
        + 
        (ymouse - this.ypoint) * (ymouse - this.ypoint);
        console.log("distance: " + distance);
        distance = Math.sqrt(distance);

        if(distance < this.radius) {
            this.changeColor("#56f");
            return true
        }
        else {
            this.changeColor("#f56");
            return false;
        }
    }
}

context = canvas.getContext("2d");
let circle = new Circle(200, 200, 100, "red");
circle.draw(context);

var e;
canvas.addEventListener("click", (event)=> {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    console.log("x: " + x + " y: " + y);
    console.log(event);

    circle.clickCircle(x, y);
})