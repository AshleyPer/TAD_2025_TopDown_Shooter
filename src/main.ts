import { Collider } from "../lib/Collider.js";
import { tad, shape, keys, camera, math, mouse, text, make, time } from "../lib/TeachAndDraw.js";
import { Stamp } from "../lib/Img";
import { IEnemy } from "./interfaces/IEnemy.js";
import { ICollider } from "./interfaces/ICollider.js";

tad.use(update);

tad.debug = false;

tad.width = 800;
tad.height = 600;

const backgroundImage = tad.load.image(tad.width/2, (tad.height /4) - 790, "./src/assets/images/road.png");
const backgroundImageForDead = tad.load.image(tad.width/2, tad.height/2, "./src/assets/images/dead_background.png"); 
const backgroundImageForWin = tad.load.image(tad.width/2, tad.height/2, "./src/assets/images/win_background.png"); 
const enemyOne = tad.load.image(100, 100,"./src/assets/images/enemy_one.png");
const enemyVan = tad.load.image(100, 100,"./src/assets/images/van.png");
const turretImage = tad.load.image(100, 100,"./src/assets/images/turret.png");
const turretBulletImage = tad.load.image(0, 0, "./src/assets/images/bullet.png");
const playerImage = tad.load.image(0, 0, "./src/assets/images/player.png"); 
const playerHurtImage = tad.load.image(0, 0, "./src/assets/images/player_hurt.png"); 

const playerLifeImage = new Image();
playerLifeImage.src = "src/assets/images/car_life.png";

const player = make.boxCollider(tad.width/2, tad.height - 50, 50, 90) as ICollider;
player.friction = 0;
player.colour = "red";
player.movedByCamera = false;
player.maxLife = 3;
player.currentLife = 3;
player.asset = playerImage;
player.asset.movedByCamera = false;
//const playerLifeImage = tad.load.image(-100, -100, "./src/assets/images/car_life.png");
//playerLifeImage.movedByCamera = false;

let enemies = Array<IEnemy>();

let enemyGroup = make.group();
let bulletGroup = make.group();

let boundaryWallLeft = make.boxCollider(139, tad.height /2, 30, 600);
boundaryWallLeft.movedByCamera = false;
let boundaryWallRight = make.boxCollider(661, tad.height /2, 30, 600);
boundaryWallRight.movedByCamera = false;
let boundaryWallBottom = make.boxCollider(tad.width/2, tad.height + 15, 800, 30);
boundaryWallBottom.movedByCamera = false;
let boundaryWallTop = null;

let healthBarSection = document.getElementById("lifebar");

//"begin" is the default scene, change this to see the other screens easily
let scene = "begin";
let previousScene = "";

let menuButton = make.button(tad.width/2, 100, 140, 40, "Play Game");
menuButton.background = "#2148FF";
menuButton.textColour = "white";
menuButton.movedByCamera = false;

let beginButton = make.button(tad.width/2, 100, 140, 40, "Begin!");
beginButton.background = "#2148FF";
beginButton.textColour = "white";
beginButton.movedByCamera = false;

let deadButton = make.button(tad.width/2, 100, 140, 40, "Menu");
deadButton.movedByCamera = false;
deadButton.background = "red";
deadButton.textColour = "white";

let winButton = make.button(tad.width/2, 100, 140, 40, "Menu");
winButton.movedByCamera = false;
winButton.background = "black";
winButton.textColour = "white";

let settingsButton = make.button(tad.width/2, 230, 140, 40, "Settings");
settingsButton.movedByCamera = false;
settingsButton.background = "black";
settingsButton.textColour = "white";

let unpauseButton = make.button(tad.width/2, 100, 140, 40, "Unpause");
unpauseButton.movedByCamera = false;
unpauseButton.background = "black";
unpauseButton.textColour = "white";

let menuFromSettingsButton = make.button(tad.width/2, 440, 140, 40, "Menu");
menuFromSettingsButton.movedByCamera = false;
menuFromSettingsButton.background = "black";
menuFromSettingsButton.textColour = "white";

let cameraSpeedSlider = make.slider(tad.width/2, 230, 140);
cameraSpeedSlider.movedByCamera = false;
cameraSpeedSlider.max = 500;
cameraSpeedSlider.value = 300;
cameraSpeedSlider.min = 1;

let cameraMoveSpeed = cameraSpeedSlider.value / 100;
let cameraStartPosition = 300;
let cameraYPreviousPosition = cameraStartPosition;

let muteCheckbox = make.checkbox(tad.width/2, 340, 30);

let menuThemeAudio = tad.load.sound("./src/assets/audio/Battletoads_(NES)_Music-Title_Theme_With_Drums.mp3");
menuThemeAudio.maxCopies = 1;
let playAudio = tad.load.sound("./src/assets/audio/Battletoads_(NES)_Music_Turbo_Tunnel_Part_2.mp3");
playAudio.maxCopies = 1;
let gameOverAudio = tad.load.sound("./src/assets/audio/Battletoads_(NES)_Music_Game_Over.mp3");
gameOverAudio.maxCopies = 1;
let settingsAudio = tad.load.sound("./src/assets/audio/Battletoads_(NES)_Music_Cut_Scenes.mp3");
settingsAudio.maxCopies = 1;

function update(): void{
    if(scene === "begin"){
        BeginScene();
    }
    else if(scene === "menu"){
        MenuScene();
    }else if(scene === "play"){
        PlayGameScene();
    }else if(scene === "dead"){
        DeadScene();
    // TODO: create a way for the player to win (how to make them cross the finish line?)
    }else if (scene === "win"){
        WinScene();
    }else if (scene === "settings"){
        SettingsMenuScene();
    }

}

function MovePlayer(): void{
    if(keys.down("a") || keys.down("arrowleft")){
        player.velocity.x = -10;
    }else if(keys.down("d") || keys.down("arrowright")){
        player.velocity.x = 10;
    }else if((!keys.down("d") || keys.down("arrowright")) && (!keys.down("a") || keys.down("arrowleft"))){
        player.velocity.x = 0;
    }

    if(keys.down("w")){
        player.velocity.y = -10;
    }else if(keys.down("s")){
        player.velocity.y = 10;
    }else if(!keys.down("w") && !keys.down("s")){
        player.velocity.y = 0;
    }
}

function CheckToSpawnEnemy(): void{
    console.log(`enemies.length = ${enemies.length}`)
    for(let i = 0; i < enemies.length; i++){
        if(camera.y - 400 <= enemies[i].y){
            SpawnEnemy(enemies[i]);
            enemies.splice(i,1);
            console.log("yes spawn enemy")
            return;
        }
    }
}

function SpawnEnemy(enemy: IEnemy): void{
    enemyGroup.push(CreateEnemyCollider(enemy));
    if(enemy.turret){
        console.log("yes turret")
        enemyGroup.push(CreateEnemyTurretCollider(enemy.x, enemy.y, enemy.turret));
    }
}

function CreateEnemyCollider(enemy: IEnemy): ICollider{
    const newEnemy = make.boxCollider(enemy.x, enemy.y, 50, 50) as ICollider;
    newEnemy.asset = enemy.image;
    newEnemy.maxLife = enemy.maxLife;
    if(enemy.type === "mover"){
        newEnemy.velocity.x = 15;
        newEnemy.friction = 0;
    }
    return newEnemy;
}

function CreateEnemyTurretCollider(enemyX:number, enemyY:number, image:Stamp): ICollider{
    const newTurret = make.boxCollider(enemyX, enemyY+10, 50, 50) as ICollider;
    newTurret.asset = image;
    newTurret.type = "turret";
    newTurret.lastBullet = 0;
    return newTurret;
}

function LoopThroughEnemyGroup(){
    for(let i = 0; i < enemyGroup.length; i++){
        if(enemyGroup[i].type === "turret"){
            TurretAimAtPlayer(enemyGroup[i]);
        }  
    }
}

function TurretAimAtPlayer(turret:ICollider){
    let vector = camera.screenToWorld(player.x, player.y)
    const angleToFace = turret.getAngleToPoint(vector.x,vector.y);
    turret.rotation = angleToFace;

    if(turret.lastBullet + 2 < time.seconds){
        console.log("create bullet")
        CreateBullet(turret, angleToFace, vector.x, vector.y);
    }
}

function CreateBullet(turret:ICollider, rotation:number, playerX:number, playerY:number){
    const newBullet = make.boxCollider(turret.x, turret.y, 50, 50) as ICollider;
    newBullet.asset = turretBulletImage;
    newBullet.rotation = rotation;
    newBullet.direction = rotation;
    newBullet.friction = 0;
    newBullet.speed = 50;
    //newBullet.velocity.x = playerX;
    //newBullet.velocity.y = playerY;
    newBullet.lifespan = 5;
    turret.lastBullet = time.seconds;
    bulletGroup.push(newBullet);
}

function CheckForEnemyGroupCollision(){
    //check if enemy collides with walls
    for(let i = 0; i < enemyGroup.length; i++){
        /* TODO: consider the fact that the turret is not connected to the van, so if the van dies, the turret should die with it
            Also, the logic for the boundaries is (almost) perfect, down to the pixel of instantly hitting the object, which means the enemy disappears before they are fully off screen.
            ^ need to consider how to fix this       
        */
        //check bottom wall collision
        if(CheckIfWIthinBoundsScreenToWorld(boundaryWallBottom, enemyGroup[i], "down")){
            console.log("enemy collided with bottom wall");
            enemyGroup[i].remove();
            return;
        //check left wall
        }else if(CheckIfWIthinBoundsScreenToWorld(boundaryWallLeft, enemyGroup[i], "left")){
            //bounce the enemy to the right
            console.log("enemy collided with left wall");
            enemyGroup[i].direction = 90;
            return;
        //check right wall
        }else if(CheckIfWIthinBoundsScreenToWorld(boundaryWallRight, enemyGroup[i], "right")){
            //bounce the enemy to the righ
            console.log("enemy collided with right wall");
            enemyGroup[i].direction = 270;
            return;
        }
        if(CheckIfWIthinBoundsScreenToWorldBullet(player, enemyGroup[i])){
            console.log("enemy hit player")
            player.currentLife--;
            DrawPlayerHealth();
            return;
        }
    }
    
    //check if player collides with walls
    //check bottom wall collision
    if(CheckIfWIthinBounds(boundaryWallBottom, player, "down")){
        //bounce the player up
        console.log("player collided with bottom wall");
    //check left wall
    }else if(CheckIfWIthinBounds(boundaryWallLeft, player, "left")){
        //bounce the player to the right
        console.log("player collided with left wall");
    //check right wall
    }else if(CheckIfWIthinBounds(boundaryWallRight, player, "right")){
        //bounce the player to the right
        console.log("player collided with right wall");
    }
}

function CheckForBulletGroupCollision(){
    for(let i = 0; i < bulletGroup.length; i++){
        if(CheckIfWIthinBoundsScreenToWorldBullet(player, bulletGroup[i])){
            console.log("bullet hit player")
            bulletGroup[i].remove();
            player.currentLife--;
            DrawPlayerHealth();
            return;
        }
    }
}

function CheckIfWIthinBoundsScreenToWorldBullet(object:Collider, bullet:Collider): boolean{
    let objectVector = camera.screenToWorld(object.x, object.y)

    // TODO: fix targeting, the bullets hit the centre of the player before they will delete themselves
    if ((bullet.x <= objectVector.x + (object.w/2)) && (bullet.x >= objectVector.x - (object.w/2)) && (bullet.y <= objectVector.y + (object.h/2)) && (bullet.y >= objectVector.y - (object.h/2))){
        return true;
    }
    return false;
}

//definitely a way to refactor these two methods, and the CheckForEnemyGroupCollision() method to reduce duplicate code. need to figure out that solution, but it is a low priority
function CheckIfWIthinBoundsScreenToWorld(object:Collider, collidedObject:Collider, directionOfTravel:string): boolean{
    let objectVector = camera.screenToWorld(object.x, object.y)
    /* 
    you then want to check if the bullets x value is within the players x + and - the width of the player 
    and then you want to check if the bullets y value is with the players y + and - the height of the player.
    */
    if(directionOfTravel === "down" && object.h && (objectVector.y - (object.h/2)  <= collidedObject.y + (collidedObject.h/2))){
        return true;
    }else if(directionOfTravel === "up" && object.h && (objectVector.y + (object.h/2) >= collidedObject.y - (collidedObject.h/2))){
        return true;
    }else if(directionOfTravel === "left" && object.w && (objectVector.x + (object.w/2) >= collidedObject.x - (collidedObject.w/2))){
        return true;
    }else if(directionOfTravel === "right" && object.w && (objectVector.x - (object.w/2) <= collidedObject.x + (collidedObject.w/2))){
        return true;
    }
    return false;
}

function CheckIfWIthinBounds(object:Collider, collidedObject:Collider, directionOfTravel:string): boolean{
    if(directionOfTravel === "down" && object.h && (object.y - (object.h/2) <= collidedObject.y + (collidedObject.h/2))){
        return true;
    }else if(directionOfTravel === "up" && object.h && (object.y + (object.h/2) >= collidedObject.y - (collidedObject.h/2))){
        return true;
    }else if(directionOfTravel === "left" && object.w && (object.x + (object.w/2) >= collidedObject.x - (collidedObject.w/2))){
        return true;
    }else if(directionOfTravel === "right" && object.w && (object.x - (object.w/2) <= collidedObject.x + (collidedObject.w/2))){
        return true;
    }
    return false;
}

function DrawPlayerHealth(){
    healthBarSection!.innerHTML = "";
    for(let i = 0; i < player.currentLife; i++){
        healthBarSection?.append(playerLifeImage.cloneNode(true));
    }
}

function BeginScene(){
    beginButton.draw();

    if(beginButton.released){
        scene = "menu";
        previousScene = "begin";
    }
}

function MenuScene(){
    if(settingsAudio.isPlaying){
        settingsAudio.stop();
    }
    if(gameOverAudio.isPlaying){
        gameOverAudio.stop();
    }
    if(!menuThemeAudio.isPlaying){
        menuThemeAudio.play();
    }

    menuButton.draw();
    settingsButton.draw();

    if(menuButton.released){
        scene = "play";
        previousScene = "menu";
        ResetGameState();
        DrawPlayerHealth();
    }

    if(settingsButton.released){
        scene = "settings";
        previousScene = "menu";
    }
}

function SettingsMenuScene(){
    if(menuThemeAudio.isPlaying){
        menuThemeAudio.stop();
    }
    if(playAudio.isPlaying){
        playAudio.stop();
    }
    if(!settingsAudio.isPlaying){
        settingsAudio.play();
    }

    console.log("settingsAudio.volume = ", settingsAudio.volume)

    if(previousScene === "menu"){
        winButton.draw();
    }else if(previousScene === "play"){
        unpauseButton.draw();
        menuFromSettingsButton.draw();
    }

    if(winButton.released || menuFromSettingsButton.released){
        scene = "menu";
        previousScene = "settings";
    }

    if(unpauseButton.released || keys.released("escape") || keys.released("p")){
        camera.y = cameraYPreviousPosition;
        scene = "play";
        previousScene = "settings";
    }

    text.size = 20;
    text.colour = "white";
    text.print(tad.w/2, 200, "Camera speed");

    cameraSpeedSlider.draw();
    cameraMoveSpeed = cameraSpeedSlider.value / 100;

    text.size = 20;
    text.colour = "white";
    text.print(tad.w/2, 300, "Mute audio?");
    muteCheckbox.draw();

    if(muteCheckbox.checked){
        menuThemeAudio.volume = 0;
        playAudio.volume = 0;
        gameOverAudio.volume = 0;
        settingsAudio.volume = 0;
    }else{
        menuThemeAudio.volume = 100;
        playAudio.volume = 100;
        gameOverAudio.volume = 100;
        settingsAudio.volume = 100;
    }
}

function PlayGameScene(){
    if(menuThemeAudio.isPlaying){
        menuThemeAudio.stop();
    }
    if(settingsAudio.isPlaying){
        settingsAudio.stop();
    }
    if(!playAudio.isPlaying){
        playAudio.play();
    }

    if(player.currentLife <= 0){
        ResetGameState();
        scene = "dead";
        previousScene = "play";
    }

    MovePlayer();
    CheckToSpawnEnemy();

    camera.y -= cameraMoveSpeed;

    backgroundImage.draw();
    player.draw();
    LoopThroughEnemyGroup();
    enemyGroup.draw();
    bulletGroup.draw();
    CheckForEnemyGroupCollision();
    CheckForBulletGroupCollision();

    if(keys.released("escape") || keys.released("p")){
        cameraYPreviousPosition = camera.y;
        camera.y = cameraStartPosition;
        scene = "settings";
        previousScene = "play";
    }
}

function DeadScene(){
    if(playAudio.isPlaying){
        playAudio.stop();
    }
    if(!gameOverAudio.isPlaying){
        gameOverAudio.play();
    }

    backgroundImageForDead.draw();
    deadButton.draw();
    text.size = 100;
    text.colour = "white";
    text.print(tad.w/2, tad.h/2, "You Lost :(");

    if(deadButton.released){
        scene = "menu";
        previousScene = "play";
    }
}

function WinScene(){
    if(playAudio.isPlaying){
        playAudio.stop();
    }
    backgroundImageForWin.draw();
    winButton.draw();
    text.size = 100;
    text.colour = "black";
    text.print(tad.w/2, tad.h/2, "You Win!");

    if(winButton.released){
        scene = "menu";
        previousScene = "play";
    }
}

function ResetGameState(){
    enemies = [
        {id: 0, x: 200, y: -200, image: enemyOne, maxLife: 100, type: "mover"},
        {id: 1, x: 500, y: -400, image: enemyVan, maxLife: 100, type: "van", turret: turretImage},
        {id: 0, x: 300, y: -1000, image: enemyOne, maxLife: 100, type: "mover"},
        {id: 0, x: 500, y: -1300, image: enemyOne, maxLife: 100, type: "mover"},
        {id: 0, x: 440, y: -1600, image: enemyOne, maxLife: 100, type: "mover"},
        {id: 0, x: 300, y: -2000, image: enemyOne, maxLife: 100, type: "mover"},
        {id: 0, x: 500, y: -2400, image: enemyOne, maxLife: 100, type: "mover"},
        {id: 0, x: 210, y: -2900, image: enemyOne, maxLife: 100, type: "mover"},
        {id: 0, x: 360, y: -3350, image: enemyOne, maxLife: 100, type: "mover"},
        {id: 0, x: 640, y: -3640, image: enemyOne, maxLife: 100, type: "mover"},
        {id: 0, x: 200, y: -4000, image: enemyOne, maxLife: 100, type: "mover"},
        {id: 0, x: 300, y: -4000, image: enemyOne, maxLife: 100, type: "mover"},
        {id: 0, x: 540, y: -4000, image: enemyOne, maxLife: 100, type: "mover"},
        {id: 0, x: 200, y: -5000, image: enemyOne, maxLife: 100, type: "mover"},
        {id: 0, x: 300, y: -5000, image: enemyOne, maxLife: 100, type: "mover"},
        {id: 0, x: 440, y: -5000, image: enemyOne, maxLife: 100, type: "mover"},
        {id: 0, x: 600, y: -5000, image: enemyOne, maxLife: 100, type: "mover"},
    ];
    camera.x = 400;
    camera.y = cameraStartPosition;
    player.x = tad.width/2;
    player.y = tad.height - 50;
    player.currentLife = 3;
    enemyGroup = make.group();
    bulletGroup = make.group();
}