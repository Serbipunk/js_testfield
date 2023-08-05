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
    constructor(xpos, ypos, radius, color, text) {
        this.xpos = xpos;
        this.ypos = ypos;
        this.radius = radius;
        this.color = color;
        this.text = text;
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
}

let context = canvas.getContext("2d");  // 获取绘图上下文

let my_circle = new Circle(100, 100, 50, "#f00", "text");
my_circle.draw(context);

let createCircle = function(circle) {
    circle.draw(context);
}

let all_circles = [];

let random_x = Math.random() * window_width;
for(var number=0; number < 10; number++) {
    let random_x = Math.random() * window_width;
    let random_y = Math.random() * window_height;

    let my_circle = new Circle(random_x, random_y, 50, "black", number);
    all_circles.push(my_circle);
    createCircle(all_circles[number]);
}
