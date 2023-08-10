const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth - 60;
canvas.height = 400;

let context = canvas.getContext('2d');
context.fillStyle = "white";
context.fillRect(0, 0, canvas.width, canvas.height);

let draw_color = "black";
let draw_width = "2";
let is_drawing = false;
let is_shape_new_created = true;

canvas.addEventListener("mousedown", mousedown, false);
canvas.addEventListener("mousemove", mousemove, false);
canvas.addEventListener("mouseup", mouseup, false);
canvas.addEventListener("dblclick", finish_this_shape, false);

let linestrip_obj_proto = {
    "shape_type": "linestrip",
    "points": [],
}
let linestrip_obj_proto_str = JSON.stringify(linestrip_obj_proto);

let shapes_list = []

function mousedown(event) {
    is_drawing = true;

    let x = event.clientX - canvas.offsetLeft;
    let y = event.clientY - canvas.offsetTop;

    if(is_shape_new_created) {
        // shapes_list.push( Object.assign({}, linestrip_obj_proto) );  // cannot deep copy [] in linestrip_obj_proto, so this deep-copy is wrong
        shapes_list.push( JSON.parse(linestrip_obj_proto_str) );
        // console.log("len = ", shapes_list.length)
        // shapes_list.forEach((shape_obj, index) => {
        //     console.log("# ", index, "  len=", shape_obj.points.length);
        // });
        shapes_list[shapes_list.length-1].points.push([x, y]);
    }
    is_shape_new_created = false;
}

function mousemove(event) {
    if(is_drawing) {
        let x_ = event.clientX - canvas.offsetLeft;
        let y_ = event.clientY - canvas.offsetTop;

        clear_canvas();

        draw_shapes(x_, y_);
    }
}

function mouseup(event) {
    let x = event.clientX - canvas.offsetLeft;
    let y = event.clientY - canvas.offsetTop;

    i_pts_len = shapes_list[shapes_list.length - 1].points.length;
    if (x != shapes_list[shapes_list.length - 1].points[i_pts_len - 1][0] || 
        y != shapes_list[shapes_list.length - 1].points[i_pts_len - 1][1]) {
        shapes_list[shapes_list.length - 1].points.push([x, y]);
    }

    draw_shapes();
}

function finish_this_shape(event) {
    if (is_drawing == true) {
        is_drawing = false;
        let i_shape = shapes_list.length - 1;
        shapes_list[i_shape].points.push(shapes_list[i_shape].points[0]);

        is_shape_new_created = true;
        draw_shapes();
    }
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

function draw_shapes(x_temp=null, y_temp=null) {
    clear_canvas();

    context.beginPath();
    context.strokeStyle = draw_color;
    context.lineWidth = draw_width;

    for(let i_shape=0; i_shape<shapes_list.length; i_shape++) {
        let shape = shapes_list[i_shape];
        if(shape.shape_type == "linestrip") {
            let points = shape.points;

            context.moveTo(points[0][0], points[0][1]);
            for(let i_point=0; i_point<points.length; i_point++) {
                if (i_point>0) {
                    context.lineTo(points[i_point][0], points[i_point][1]);
                }
                if(x_temp != null && y_temp != null && i_shape == shapes_list.length - 1) {
                    if(i_point == points.length - 1) {
                        context.lineTo(x_temp, y_temp);
                    }
                }
            }

        }
    }
    context.stroke();
    context.closePath();
}

function undo_last() {
    throw new Error("Not implemented yet");
}
