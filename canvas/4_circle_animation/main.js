let canvas = document.getElementById("canvas");


var window_width = window.innerWidth;
var window_height = window.innerHeight;

canvas.width = window_width;
canvas.height = window_height;

canvas.style.background = "#ff8";

// context.fillRect(0, 0, 100, 100);

// context.fillStyle = "#f00";
// context.fillRect(100, 500, 100, 200);

// context.beginPath();  // 开始绘制
// context.strokeStyle = "#00f";  // 设置描边颜色
// context.lineWidth = 20;  // 设置描边宽度
// context.arc(400, 400, 50, 0, Math.PI * 2, false); // 绘制圆形

// context.stroke();  // 描边
// context.closePath();  // 结束绘制


class Circle {
    constructor(xpos, ypos, radius, color, text, speed) {
        this.xpos = xpos;
        this.ypos = ypos;
        this.radius = radius;
        this.color = color;
        this.text = text;
        this.speed = speed;

        this.dx = 1 * this.speed
        this.dy = 1 * this.speed
    }

    draw() {
        context.beginPath();

        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        // context.fillText(this.text, this.xpos, this.ypos);
        context.strokeText(this.text, this.xpos, this.ypos);

        context.lineWidth = 2;
        context.arc(this.xpos, this.ypos, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    update() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        this.draw(context);

        if(this.xpos + this.radius > canvas.width || this.xpos - this.radius < 0) {
            this.dx = -this.dx;
        }
        if(this.ypos + this.radius > canvas.height || this.ypos - this.radius < 0) {
            this.dy = -this.dy;
        }

        this.xpos += this.dx;
        this.ypos += this.dy;
    }
}

let context = canvas.getContext("2d");  // 获取绘图上下文

// let my_circle = new Circle(100, 100, 50, "#f00", "text");
// my_circle.draw(context);

let createCircle = function(circle) {
    circle.draw(context);
}

let all_circles = [];


let my_circle = new Circle(100, 100, 50, "black", "text", 10);

let updateCircle = function() {
    requestAnimationFrame(updateCircle);  // 递归调用
    my_circle.update();
}

updateCircle();
