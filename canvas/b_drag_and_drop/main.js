let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

canvas.width = window.innerWidth - 30;
canvas.height = window.innerHeight - 30;

canvas.style.border = "5px solid red";

let canvas_width = canvas.width;
let canvas_height = canvas.height;

let shapes = [];
let current_shape_index = null;
let is_dragging = false;
shapes.push({x: 200, y: 0, width: 200, height: 200, color: "red"});
shapes.push({x: 10, y: 10, width: 100, height: 100, color: "blue"});


let mouse_down = function(event) {
    event.preventDefault();  // prevent scrolling
    console.log(event);
    let startX = parseInt(event.clientX);
    let startY = parseInt(event.clientY);

    let index = 0;

    for(let shape of shapes) {
        if (is_mouse_in_shape(startX, startY, shape)) {
            console.log("yes")
            current_shape_index = index;
            is_dragging = true;
            return;
        }
        else {
            console.log("no")
        }
        index += 1;
    }
}

let mouse_up = function(event) {
    if (!is_dragging) {
        return;
    }
    event.preventDefault();  // prevent scrolling
    is_dragging = false;
}

let mouse_out = function(event) {
    if (!is_dragging) {
        return;
    }
    event.preventDefault();  // prevent scrolling
    is_dragging = false;
}

let mouse_move = function(event) {
    if (!is_dragging) {
        return;
    }
    else {
        event.preventDefault();  // prevent scrolling
        let mouseX = parseInt(event.clientX);
        let mouseY = parseInt(event.clientY);
        let dx = mouseX - shapes[current_shape_index].x;
        let dy = mouseY - shapes[current_shape_index].y;
        shapes[current_shape_index].x += dx;
        shapes[current_shape_index].y += dy;
        draw_shape();
    }
}

canvas.onmousedown = mouse_down;
canvas.onmouseup = mouse_up;
canvas.onmouseout = mouse_out;
canvas.onmousemove = mouse_move;

let is_mouse_in_shape = function(x, y, shape) {
    let shape_left = shape.x;
    let shape_right = shape.x + shape.width;
    let shape_top = shape.y;
    let shape_bottom = shape.y + shape.height;

    if (x >= shape_left && x <= shape_right && y >= shape_top && y <= shape_bottom) {
        return true;
    }
    return false;
}

let draw_shape = function() {
    context.clearRect(0, 0, canvas_width, canvas_height);
    for(let shape of shapes) {
        context.fillStyle = shape.color;
        context.fillRect(shape.x, shape.y, shape.width, shape.height);
    }
}

draw_shape();
