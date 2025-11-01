import { tad, shape, keys, camera, math, mouse, text, make } from "../lib/TeachAndDraw.js";

tad.use(update);

tad.debug = false;

tad.width = 800;
tad.height = 600;

const backgroundImage = tad.load.image(tad.width/2, (tad.height /4) - 790, "./src/assets/images/road.png");
//backgroundImage.movedByCamera = false;

const player = make.boxCollider(tad.width/2, tad.height - 50, 50, 50)
player.friction = 0;
player.colour = "red";

function update() {
    if(keys.down("a")){
        camera.x += 0.5;
        player.velocity.x = -7;
    }else if(keys.down("d")){
        camera.x -= 0.5;
        player.velocity.x = 7;
    }else if(!keys.down("d") && !keys.down("a")){
        player.velocity.x = 0;
    }

    if(keys.down("w")){
        camera.y -= 0.1;
        player.velocity.y = -10;
    }else if(keys.down("s")){
        camera.y +=  0.05;
        player.velocity.y = 10;
    }else if(!keys.down("w") && !keys.down("s")){
        player.velocity.y = 0;
    }

    //constantly move the image down
    backgroundImage.velocity.y = 10;
    backgroundImage.draw();
    player.draw();

    /*if(math.distance(camera.x, camera.y, tad.w/2, tad.h/2)){

    }*/
}

function movePlayerImage(){

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