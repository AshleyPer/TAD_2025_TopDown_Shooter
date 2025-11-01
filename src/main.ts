// @ts-ignore
import { tad, shape, keys, camera, math, mouse, text, make } from "../lib/TeachAndDraw.js";

tad.use(update);

tad.debug = false;

const player = make.boxCollider(tad.width/2, tad.height - 50, 30, 30)
player.colour = "blue";
function update() {
    if(keys.down("a")){
        camera.x += 1;
    }

    if(keys.down("d")){
        camera.x -= 1;
    }

    if(keys.down("w")){
        camera.y += 1;
    }

    if(keys.down("s")){
        camera.y -= 1;
    }

    player.draw();
    /*if(math.distance(camera.x, camera.y, tad.w/2, tad.h/2)){

    }*/
}

function movePlayer(){

}


// if you want to change the zoom of the camera
    /*if(mouse.wheel.up){
        console.log("wheel up")
        camera.zoom += 0.1;
    }

    if(mouse.wheel.down){
        console.log("wheel down")
        camera.zoom -= 0.1;
    }*/