let canvas = document.getElementById("canvas");

let context = canvas.getContext("2d");  // 获取绘图上下文

var window_width = window.innerWidth;
var window_height = window.innerHeight;

canvas.width = window_width;
canvas.height = window_height;

canvas.style.background = "#ff8";



context.fillRect(0, 0, 100, 100);

context.fillStyle = "#f00";
context.fillRect(100, 500, 100, 200);

context.beginPath();  // 开始绘制
context.strokeStyle = "#00f";  // 设置描边颜色
context.lineWidth = 20;  // 设置描边宽度
context.arc(400, 400, 50, 0, Math.PI * 2, false); // 绘制圆形

context.stroke();  // 描边
context.closePath();  // 结束绘制
