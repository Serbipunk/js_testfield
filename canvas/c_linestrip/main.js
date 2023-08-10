const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth - 60;
canvas.height = 400;

let context = canvas.getContext('2d');
context.fillStyle = "white";
context.fillRect(0, 0, canvas.width, canvas.height);

let draw_color = "black";
let draw_width = "2";
let is_drawing = false;

let restore_array = [];
let index = -1;

canvas.addEventListener("touchstart", start, false);
canvas.addEventListener("touchmove", draw, false);
canvas.addEventListener("touchend", stop, false);

canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", draw, false);
canvas.addEventListener("mouseup", stop, false);

let shapes_list = []
let linestrip_obj_proto = {
    "shape_type": "linestrip",
    "points": [],
}
shapes_list.push( Object.assign({}, linestrip_obj_proto) );

let first_point = [0, 0];
let second_point = [0, 0];

context.beginPath();

context.lineWidth = 5;
context.strokeStyle = "black";


// context.closePath();
let last_canvas_list = [];
last_canvas_list.push(context.getImageData(0, 0, canvas.width, canvas.height));

context.moveTo(100, 100);
context.lineTo(300, 100);

context.stroke()
context.clothPath();

context.putImageData(last_canvas_list[0], 0, 0);

function start(event) {
    is_drawing = true;

    // context.beginPath();
    // context.moveTo(event.clientX - canvas.offsetLeft,
    //                event.clientY - canvas.offsetTop);
    // event.preventDefault();  // prevent scrolling                   
    
    first_point[0] = event.clientX - canvas.offsetLeft;
    first_point[1] = event.clientY - canvas.offsetTop;
    context.moveTo(first_point[0], first_point[1]);
    // context.save();
    last_canvas_list.push(context.getImageData(0, 0, canvas.width, canvas.height));

}

function draw(event) {
    // if (is_drawing) {
    //     context.lineTo(event.clientX - canvas.offsetLeft,
    //                    event.clientY - canvas.offsetTop);
    //     context.strokeStyle = draw_color;
    //     context.lineWidth = draw_width;
    //     context.lineCap = "round";
    //     context.lineJoin = "round";
    //     context.stroke();
    // }
    if(is_drawing) {
        let x_ = event.clientX - canvas.offsetLeft;
        let y_ = event.clientY - canvas.offsetTop;

        // context.putImageData(last_canvas_list[0], 0, 0);
        clear_canvas();

        context.beginPath();
        context.moveTo(first_point[0], first_point[1]);
        context.lineTo(x_, y_);
        context.stroke();
        context.closePath();
    }
}

function stop(event) {
    // if( is_drawing ) {
    //     context.stroke();
    //     context.closePath();
    //     is_drawing = false;
    // }
    // event.preventDefault();
    
    // if (event.type != 'mouseout') {
    //     restore_array.push(context.getImageData(0, 0, canvas.width, canvas.height));
    //     index += 1;
    // }
    // console.log(restore_array);
    second_point[0] = event.clientX - canvas.offsetLeft;
    second_point[1] = event.clientY - canvas.offsetTop;


    // context.lineTo(second_point[0], second_point[1]);
    // context.stroke();


    is_drawing = false;
}

function change_color(element) {
    draw_color = element.style.background;
}

function clear_canvas() {
    context.fillStyle = "white";
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);

    restore_array = [];
    index = -1;
}

function undo_last() {
    if(index <= 0) {
        clear_canvas();
    }
    else {
        index -= 1;
        restore_array.pop();
        context.putImageData(restore_array[index], 0, 0);
    }
}
