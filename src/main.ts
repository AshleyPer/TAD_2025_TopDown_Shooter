import { Collider } from "../lib/Collider.js";
import { tad, shape, keys, camera, math, mouse, text, make, time } from "../lib/TeachAndDraw.js";
import { Stamp } from "../lib/Img";
import { IEnemy } from "./interfaces/IEnemy.js";
import { ICollider } from "./interfaces/ICollider.js";

tad.use(update);

tad.debug = false;

tad.width = 800;
tad.height = 600;

/* Gameplay stuff */
let lastFrameTime = window.performance.now();
/* End of Gameplay stuff */

/* Images */
const backgroundImage = tad.load.image(tad.width/2, (tad.height /4) - 790, "./src/assets/images/road.png");
const backgroundImageForDead = tad.load.image(tad.width/2, tad.height/2, "./src/assets/images/dead_background.png");
backgroundImageForDead.movedByCamera = false;
const backgroundImageForWin = tad.load.image(tad.width/2, tad.height/2, "./src/assets/images/win_background.png"); 
backgroundImageForWin.movedByCamera = false;
const enemyOne = tad.load.image(100, 100,"./src/assets/images/enemy_one.png");
const enemyVan = tad.load.image(100, 100,"./src/assets/images/van.png");
const turretImage = tad.load.image(100, 100,"./src/assets/images/turret.png");
const turretBulletImage = tad.load.image(0, 0, "./src/assets/images/bullet.png");
const playerImage = tad.load.image(0, 0, "./src/assets/images/player.png"); 
const playerHurtImage = tad.load.image(0, 0, "./src/assets/images/player_hurt.png"); 

const playerLifeImage = new Image();
playerLifeImage.src = "src/assets/images/car_life.png";
/* End of Images */

/* Player */
const player = make.boxCollider(tad.width/2, tad.height - 50, 50, 90) as ICollider;
player.friction = 0;
player.colour = "red";
player.movedByCamera = false;
// default maxlife and currentlife is 3 TODO: SET BACK TO 3!!!
player.maxLife = 20;
player.currentLife = 20;
player.asset = playerImage;
player.asset.movedByCamera = false;

let healthBarSection = document.getElementById("lifebar");
/* End of Player */

/* Enemies */
let enemies = Array<IEnemy>();
let enemyGroup = make.group();
let bulletGroup = make.group();
let randomDirectionArray = [270, 90];
let moverSpeed = 13;
/* End of Enemies */

/* Boundary walls */
let boundaryWallLeft = make.boxCollider(139, tad.height /2, 30, 600);
boundaryWallLeft.movedByCamera = false;
let boundaryWallRight = make.boxCollider(661, tad.height /2, 30, 600);
boundaryWallRight.movedByCamera = false;
let boundaryWallBottom = make.boxCollider(tad.width/2, tad.height + 15, 800, 30);
boundaryWallBottom.movedByCamera = false;
let boundaryWallTop = null;
/* End of Boundary walls */

/* Menu/Scene related */
let scene = "begin";
let previousScene = "";
let justChangedScene = false;

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
/* End of Menu/Scene related */

/* Audio related */
let menuThemeAudio = tad.load.sound("./src/assets/audio/Battletoads_(NES)_Music-Title_Theme_With_Drums.mp3");
menuThemeAudio.maxCopies = 1;
let playAudio = tad.load.sound("./src/assets/audio/Battletoads_(NES)_Music_Turbo_Tunnel_Part_2.mp3");
playAudio.maxCopies = 1;
let gameOverAudio = tad.load.sound("./src/assets/audio/Battletoads_(NES)_Music_Game_Over.mp3");
gameOverAudio.maxCopies = 1;
let settingsAudio = tad.load.sound("./src/assets/audio/Battletoads_(NES)_Music_Cut_Scenes.mp3");
settingsAudio.maxCopies = 1;
/* End of Audio related */

function update(): void{
    //change the scene
    if(scene === "begin"){
        BeginScene();
    }else if(scene === "menu"){
        MenuScene();
    }else if(scene === "play"){
        PlayGameScene();
    }else if(scene === "dead"){
        DeadScene();
    }else if (scene === "win"){
        WinScene();
    }else if (scene === "settings"){
        SettingsMenuScene();
    }
}

/* Player specific methods */
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

function DrawPlayerHealth(){
    healthBarSection!.innerHTML = "";
    for(let i = 0; i < player.currentLife; i++){
        healthBarSection?.append(playerLifeImage.cloneNode(true));
    }
}
/* End of Player specific methods */

/* Enemy specific methods */
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
        //randomly choose if the mover is going left or right
        let randomise = Math.floor(Math.random() * randomDirectionArray.length);
        console.log("randomise = ", randomise);
        newEnemy.direction = randomDirectionArray[randomise];
        console.log("newEnemy.direction = ", newEnemy.direction)
        newEnemy.speed = moverSpeed;
        console.log("newEnemy.x = ", newEnemy.x)
        newEnemy.friction = 0;
        newEnemy.type = "mover";
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
/* End of Enemy specific methods */

/* Collision checks */
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
            //bounce the enemy to the left
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
/* End of Collision checks */

/* Draw Scenes */
function BeginScene(){
    beginButton.draw();

    if(beginButton.released){
        scene = "menu";
        previousScene = "begin";
        justChangedScene = true;
        return;
    }

    justChangedScene = false;
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
        justChangedScene = true;
        ResetGameState();
        DrawPlayerHealth();
        return;
    }

    if(settingsButton.released){
        scene = "settings";
        previousScene = "menu";
        justChangedScene = true;
        return;
    }

    justChangedScene = false;
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

    //bring back drawing per frame if I want to
    /*
    let currentTime = window.performance.now();

    if(lastFrameTime+16.6 <= currentTime){
        console.log("yes performance now is active")
        console.log("lastFrameTime= ", lastFrameTime)
        console.log("currentTime= ", currentTime)
        lastFrameTime = currentTime;
        DrawGame();
    }*/

    DrawGame();
}

function DrawGame(){
    if(player.currentLife <= 0){
        ResetGameState();
        scene = "dead";
        previousScene = "play";
        justChangedScene = true;
        return;
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
        justChangedScene = true;
        return;
    }

    //hard coding the finish line, and checking if the player crosses it
    if(camera.screenToWorld(player.x, player.y).y <= -5000){
        scene = "win";
        previousScene = "play";
        justChangedScene = true;
        return;
    }

    justChangedScene = false;
}

function SettingsMenuScene(){
    if(justChangedScene){
        for(let i = 0; i < enemyGroup.length; i++){
            if(enemyGroup[i].type === "mover"){
                enemyGroup[i].speed = 0;
            }
        }
    }

    if(menuThemeAudio.isPlaying){
        menuThemeAudio.stop();
    }
    if(playAudio.isPlaying){
        playAudio.stop();
    }
    if(!settingsAudio.isPlaying){
        settingsAudio.play();
    }

    if(previousScene === "menu"){
        winButton.draw();
    }else if(previousScene === "play"){
        unpauseButton.draw();
        menuFromSettingsButton.draw();
    }

    if(winButton.released || menuFromSettingsButton.released){
        scene = "menu";
        previousScene = "settings";
        justChangedScene = true;
        return;
    }

    if(unpauseButton.released || keys.released("escape") || keys.released("p")){
        camera.y = cameraYPreviousPosition;
        scene = "play";
        previousScene = "settings";
        justChangedScene = true;
        for(let i = 0; i < enemyGroup.length; i++){
            if(enemyGroup[i].type === "mover"){
                enemyGroup[i].speed = moverSpeed;
            }
        }
        return;
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

    justChangedScene = false;
}

function DeadScene(){
    if(playAudio.isPlaying){
        playAudio.stop();
    }
    if(!gameOverAudio.isPlaying){
        gameOverAudio.play();
    }

    camera.y = cameraStartPosition;

    backgroundImageForDead.draw();
    deadButton.draw();
    text.size = 100;
    text.colour = "white";
    text.print(tad.w/2, tad.h/2, "You Lost :(");

    if(deadButton.released){
        scene = "menu";
        previousScene = "play";
        justChangedScene = true;
        return;
    }

    justChangedScene = false;
}

function WinScene(){
    if(playAudio.isPlaying){
        playAudio.stop();
    }
    camera.y = cameraStartPosition;

    backgroundImageForWin.draw();
    winButton.draw();
    text.size = 100;
    text.colour = "black";
    text.print(tad.w/2, tad.h/2, "You Win!");

    if(winButton.released){
        scene = "menu";
        previousScene = "play";
        justChangedScene = true;
        return;
    }

    justChangedScene = false;
}
/* End of Draw Scenes */

function ResetGameState(){
    enemies = [
        {id: 0, x: 200, y: -200, image: enemyOne, maxLife: 100, type: "mover"},
        {id: 1, x: 500, y: -400, image: enemyVan, maxLife: 100, type: "van", turret: turretImage},
        {id: 2, x: 300, y: -1000, image: enemyOne, maxLife: 100, type: "mover"},
        {id: 3, x: 500, y: -1300, image: enemyOne, maxLife: 100, type: "mover"},
        {id: 4, x: 440, y: -1600, image: enemyOne, maxLife: 100, type: "mover"},
        {id: 5, x: 300, y: -2000, image: enemyOne, maxLife: 100, type: "mover"},
        {id: 6, x: 500, y: -2400, image: enemyOne, maxLife: 100, type: "mover"},
        {id: 7, x: 210, y: -2900, image: enemyOne, maxLife: 100, type: "mover"},
        {id: 8, x: 360, y: -3350, image: enemyOne, maxLife: 100, type: "mover"},
        {id: 9, x: 640, y: -3640, image: enemyOne, maxLife: 100, type: "mover"},
        {id: 10, x: 200, y: -4000, image: enemyOne, maxLife: 100, type: "mover"},
        {id: 11, x: 300, y: -4000, image: enemyOne, maxLife: 100, type: "mover"},
        {id: 12, x: 540, y: -4000, image: enemyOne, maxLife: 100, type: "mover"},
        {id: 13, x: 200, y: -5000, image: enemyOne, maxLife: 100, type: "mover"},
        {id: 14, x: 300, y: -5000, image: enemyOne, maxLife: 100, type: "mover"},
        {id: 15, x: 440, y: -5000, image: enemyOne, maxLife: 100, type: "mover"},
        {id: 16, x: 600, y: -5000, image: enemyOne, maxLife: 100, type: "mover"},
    ];
    camera.x = 400;
    camera.y = cameraStartPosition;
    player.x = tad.width/2;
    player.y = tad.height - 50;
    player.currentLife = 3;
    enemyGroup = make.group();
    bulletGroup = make.group();
}