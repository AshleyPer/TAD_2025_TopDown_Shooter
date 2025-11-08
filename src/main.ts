import { Collider } from "../lib/Collider.js";
import { tad, shape, keys, camera, math, mouse, text, make, time } from "../lib/TeachAndDraw.js";
import { Stamp } from "../lib/Img";
import { IEnemy } from "./interfaces/IEnemy.js";
import { ICollider } from "./interfaces/ICollider.js";
import { Group } from "../lib/Group.js";

tad.use(update);

//tad.debug = false;
tad.debug = true;

tad.width = 800;
tad.height = 600;

/* Gameplay stuff */
let timeBeforePause = -5000;
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

const playerLifeImage = new Image();
playerLifeImage.src = "src/assets/images/car_life.png";

const playerLifeInvincibleImage = new Image();
playerLifeInvincibleImage.src = "src/assets/images/car_life_invincible.png";

const invincibilityPickupImage = tad.load.image(tad.width/2, tad.height/2, "./src/assets/images/invincibility_pickup.png");
invincibilityPickupImage.movedByCamera = false;
invincibilityPickupImage.scale = 80;

const playerHealthPickupImage = tad.load.image(tad.width/2, tad.height/2, "./src/assets/images/player_health_pickup.png");
playerHealthPickupImage.movedByCamera = false;
playerHealthPickupImage.scale = 80;

const bulletImage = tad.load.image(tad.width/2, tad.height/2, "./src/assets/images/player_bullet.png");
bulletImage.movedByCamera = false;
bulletImage.scale = 120;

/* End of Images */

/* Player */
const playerHit = tad.load.animation(
	tad.w/2, tad.h/2,
	"./src/assets/images/player_hurt.png",
	"./src/assets/images/player.png",
	"./src/assets/images/player_hurt.png",
	"./src/assets/images/player.png",
	"./src/assets/images/player_hurt.png",
	"./src/assets/images/player.png"
);
playerHit.duration = 2;
playerHit.movedByCamera = false;
playerHit.looping = true;

const playerInvincible = tad.load.animation(
	tad.w/2, tad.h/2,
	"./src/assets/images/player_invincible.png",
	"./src/assets/images/player_invincible_two.png",
	"./src/assets/images/player_invincible.png",
	"./src/assets/images/player_invincible_two.png",
);
playerInvincible.duration = 1;
playerInvincible.movedByCamera = false;
playerInvincible.looping = true;

let player = CreatePlayerCollider();
function CreatePlayerCollider(): ICollider{
    let player = make.boxCollider(tad.width/2, tad.height - 50, 50, 90) as ICollider;
    player.friction = 0;
    player.movedByCamera = false;
    player.maxLife = 3;
    player.currentLife = 3;
    player.invincible = false;
    player.lastTimeHit = -5000;
    player.startedInvincibility = -5000;
    player.lastBullet = -5000; 
    return player;
}

let healthBarSection = document.getElementById("lifebar");

const playerBulletGroup = make.group();
/* End of Player */

/* Enemies */
let enemies = Array<IEnemy>();
let starterEnemies:Array<IEnemy> = [
    {x:200, y:-200, w:50, h:100, image:enemyOne, maxLife:100, type:"mover"},
    {x:300, y:-400, w:50, h:100, image:enemyVan, maxLife:100, type:"van", turret:turretImage},
    {x:300, y:-1000, w:50, h:100, image:enemyOne, maxLife:100, type:"mover"},
    {x:500, y:-1300, w:50, h:100, image:enemyOne, maxLife:100, type:"mover"},
    {x:200, y:-1400, w:50, h:100, image:enemyVan, maxLife:100, type:"van", turret:turretImage},
    {x:440, y:-1600, w:50, h:100, image:enemyOne, maxLife:100, type:"mover"},
    {x:300, y:-2000, w:50, h:100, image:enemyOne, maxLife:100, type:"mover"},
    {x:500, y:-2100, w:50, h:100, image:enemyVan, maxLife:100, type:"van", turret:turretImage},
    {x:250, y:-2100, w:50, h:100, image:enemyVan, maxLife:100, type:"van", turret:turretImage},
    {x:340, y:-2100, w:50, h:100, image:enemyVan, maxLife:100, type:"van", turret:turretImage},
    {x:500, y:-2400, w:50, h:100, image:enemyOne, maxLife:100, type:"mover"},
    {x:210, y:-2900, w:50, h:100, image:enemyOne, maxLife:100, type:"mover"},
    {x:360, y:-3350, w:50, h:100, image:enemyOne, maxLife:100, type:"mover"},
    {x:640, y:-3640, w:50, h:100, image:enemyOne, maxLife:100, type:"mover"},
    {x:200, y:-4000, w:50, h:100, image:enemyOne, maxLife:100, type:"mover"},
    {x:300, y:-4000, w:50, h:100, image:enemyOne, maxLife:100, type:"mover"},
    {x:540, y:-4000, w:50, h:100, image:enemyOne, maxLife:100, type:"mover"},
    {x:200, y:-4500, w:50, h:100, image:enemyVan, maxLife:100, type:"van", turret:turretImage},
    {x:350, y:-4500, w:50, h:100, image:enemyVan, maxLife:100, type:"van", turret:turretImage},
    {x:450, y:-4500, w:50, h:100, image:enemyVan, maxLife:100, type:"van", turret:turretImage},
    {x:650, y:-4500, w:50, h:100, image:enemyVan, maxLife:100, type:"van", turret:turretImage},
    {x:200, y:-5000, w:50, h:100, image:enemyOne, maxLife:100, type:"mover"},
    {x:300, y:-5000, w:50, h:100, image:enemyOne, maxLife:100, type:"mover"},
    {x:440, y:-5000, w:50, h:100, image:enemyOne, maxLife:100, type:"mover"},
    {x:600, y:-5000, w:50, h:100, image:enemyOne, maxLife:100, type:"mover"},
];

let enemyGroup = make.group();
let bulletGroup = make.group();
let randomDirectionArray = [270, 90];
let moverSpeed = 13;

const enemyDeadAnimation = tad.load.animation(
	tad.w/2, tad.h/2,
	"./src/assets/images/enemy_one_explosion.png",
	"./src/assets/images/enemy_one_explosion_two.png",
	"./src/assets/images/enemy_one_explosion_three.png",
	"./src/assets/images/enemy_one_explosion_four.png",
);
enemyDeadAnimation.duration = 1;
enemyDeadAnimation.movedByCamera = false;
enemyDeadAnimation.playing = false;
enemyDeadAnimation.looping = false;
/* End of Enemies */

/* Boundary walls */
let boundaryWallLeft = make.boxCollider(139, tad.height /2, 30, 600);
boundaryWallLeft.movedByCamera = false;
let boundaryWallRight = make.boxCollider(661, tad.height /2, 30, 600);
boundaryWallRight.movedByCamera = false;
let boundaryWallBottom = make.boxCollider(tad.width/2, tad.height + 15, 800, 30);
boundaryWallBottom.movedByCamera = false;
let boundaryWallTop = make.boxCollider(tad.width/2, -16, 550, 30);
boundaryWallTop.movedByCamera = false;
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
cameraSpeedSlider.value = 200;
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

/* Pickup related */
let invincibilityPickupCollider = CreateInvisibilityPickupCollider();

function CreateInvisibilityPickupCollider(): ICollider{
    let invincibilityPickupCollider = make.boxCollider(tad.width/2, tad.height/2, 62, 60) as ICollider;
    invincibilityPickupCollider.movedByCamera = false;
    invincibilityPickupCollider.asset = invincibilityPickupImage;
    invincibilityPickupCollider.asset.movedByCamera = false;
    return invincibilityPickupCollider;
}

let playerHealthPickupCollider = CreateHealthPickupCollider();

function CreateHealthPickupCollider(): ICollider{
    let playerHealthPickupCollider = make.boxCollider(200, 200, 52, 30) as ICollider;
    playerHealthPickupCollider.movedByCamera = false;
    playerHealthPickupCollider.asset = playerHealthPickupImage;
    playerHealthPickupCollider.asset.movedByCamera = false;
    return playerHealthPickupCollider;
}
/* End of Pickup related */

function update(): void{
    //console.log("camera.y in update() = ", camera.y)
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
        if(!player.invincible){
            healthBarSection?.append(playerLifeImage.cloneNode(true));
        }else{
            healthBarSection?.append(playerLifeInvincibleImage.cloneNode(true));
        }
    }
}

function ShouldPlayerShoot(){
    if(mouse.leftDown){
        if(player.lastBullet + 0.3 < time.seconds){
            console.log("create player bullet")
            CreatePlayerBullet();
        }
    }
}

function CreatePlayerBullet(){
    const angleToFace = player.getAngleToPoint(mouse.x,mouse.y);
    const newBullet = make.boxCollider(player.x, player.y- 50, 20, 20) as ICollider;
    newBullet.asset = bulletImage;
    newBullet.asset.movedByCamera = false;
    newBullet.movedByCamera = false;
    newBullet.rotation = angleToFace;
    newBullet.direction = angleToFace;
    newBullet.friction = 0;
    newBullet.speed = 12;
    newBullet.lifespan = 3;
    player.lastBullet = time.seconds;
    playerBulletGroup.push(newBullet);
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
        enemyGroup.push(CreateEnemyTurretCollider(enemy.x, enemy.y));
    }
}

function CreateEnemyCollider(enemy: IEnemy): ICollider{
    const newEnemy = make.boxCollider(enemy.x, enemy.y, enemy.w, enemy.h) as ICollider;
    newEnemy.maxLife = enemy.maxLife;
    newEnemy.type = enemy.type;
    if(enemy.type === "mover"){
        //randomly choose if the mover is going left or right
        let randomise = Math.floor(Math.random() * randomDirectionArray.length);
        console.log("randomise = ", randomise);
        newEnemy.direction = randomDirectionArray[randomise];
        console.log("newEnemy.direction = ", newEnemy.direction)
        newEnemy.speed = moverSpeed;
        console.log("newEnemy.x = ", newEnemy.x)
        newEnemy.friction = 0;
        newEnemy.asset = enemyOne;
    }else if(enemy.type === "van"){
        newEnemy.asset = enemyVan;
    }
    return newEnemy;
}

function CreateEnemyTurretCollider(enemyX:number, enemyY:number): ICollider{
    const newTurret = make.boxCollider(enemyX, enemyY+10, 50, 50) as ICollider;
    newTurret.asset = turretImage;
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

    if(turret.lastBullet + 0.2 < time.seconds){
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
        if(CheckIfCollisionScreenToWorld(player, enemyGroup[i])){
            console.log("enemy hit player")
            if(!player.invincible){
                let currentTime = window.performance.now();
                if(player.lastTimeHit+2000 <= currentTime){
                    player.currentLife--;
                    DrawPlayerHealth();
                    player.lastTimeHit = currentTime;
                }
            }else{
                console.log("remove enemy")
                let vector = camera.worldToScreen(enemyGroup[i].x, enemyGroup[i].y)
                enemyGroup[i].remove();
                enemyDeadAnimation.x = vector.x;
                enemyDeadAnimation.y = vector.y;
                enemyDeadAnimation.playing = true;
                enemyDeadAnimation.movedByCamera = false;
            }
            return;
        }
        console.log("????, enemyGroup[i].type = ", enemyGroup[i].type)
        if(enemyGroup[i].type === "van"){
            console.log("yes enemy type is van, and playerBulletGroup.length = ", playerBulletGroup.length)
            for(let i = 0; i < playerBulletGroup.length; i++){
                console.log("playerbulletgrouplengthparty")
                // TODO : check why the bullets are not colliding with the enemy as expected
                // and fix the bullet direction
                if(CheckIfCollisionScreenToWorld(playerBulletGroup[i], enemyGroup[i])){
                    console.log("player bullet hit enemy van")
                    let vector = camera.worldToScreen(enemyGroup[i].x, enemyGroup[i].y)
                    bulletGroup[i].remove();
                    enemyGroup[i].remove();
                    enemyDeadAnimation.x = vector.x;
                    enemyDeadAnimation.y = vector.y;
                    enemyDeadAnimation.playing = true;
                    enemyDeadAnimation.movedByCamera = false;
                    return;
                }
            }
        }
    }

    //check if player collides with walls
    //check bottom wall collision
    if(CheckIfWIthinBounds(boundaryWallBottom, player, "down")){
        //bounce the player up
        console.log("player collided with bottom wall");
        player.y -= 10;
    }else if(CheckIfWIthinBounds(boundaryWallTop, player, "up")){
        //bounce the player up
        console.log("player collided with bottom wall");
        player.y += 10;
    //check left wall
    }else if(CheckIfWIthinBounds(boundaryWallLeft, player, "left")){
        //bounce the player to the right
        player.x += 10;
        console.log("player collided with left wall");
    //check right wall
    }else if(CheckIfWIthinBounds(boundaryWallRight, player, "right")){
        //bounce the player to the right
        console.log("player collided with right wall");
        player.x -= 10;
    }
}

function CheckForBulletGroupCollision(){
    for(let i = 0; i < bulletGroup.length; i++){
        if(CheckIfCollisionScreenToWorld(player, bulletGroup[i])){
            console.log("bullet hit player")
            bulletGroup[i].remove();
            if(!player.invincible){
                let currentTime = window.performance.now();
                if(player.lastTimeHit+2000 <= currentTime){
                    player.currentLife--;
                    DrawPlayerHealth();
                    player.lastTimeHit = currentTime;
                }
            }
            return;
        }
    }
}

function CheckIfCollisionScreenToWorld(object:Collider, bullet:Collider): boolean{
    let objectVector = camera.screenToWorld(object.x, object.y)
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

    DrawGame();
}

function DrawGame(){
    //console.log("camera.y start = ", camera.y)
    if(player.currentLife <= 0){
        scene = "dead";
        previousScene = "play";
        justChangedScene = true;
        return;
    }

    MovePlayer();
    CheckToSpawnEnemy();

    camera.y -= cameraMoveSpeed;

    backgroundImage.draw();

    invincibilityPickupCollider.draw();

    ShouldPlayerShoot();
    playerBulletGroup.draw();

    playerHealthPickupCollider.draw();
    if(playerHealthPickupCollider.collides(player)){
        playerHealthPickupCollider.remove();
        player.currentLife++;
        DrawPlayerHealth();
    }
    
    let currentTime = window.performance.now();
    if(invincibilityPickupCollider.collides(player)){
        console.log("player collided with invincibility pickup")
        //@ts-ignore
        player.asset.playing = false;
        player.invincible = true;
        player.startedInvincibility = currentTime;
        player.lastTimeHit = -5000;
        invincibilityPickupCollider.remove();
        DrawPlayerHealth();
    }

    if(player.invincible && player.startedInvincibility+8000 >= currentTime){
        //@ts-ignore
        if(!player.asset?.playing){
            player.asset = playerInvincible;
            player.asset.movedByCamera = false;
            //@ts-ignore
            player.asset.playing = true;
        }
    }else if(!player.invincible && player.lastTimeHit+2000 >= currentTime){
        console.log("in IFRAMES window")
        //@ts-ignore
        if(!player.asset?.playing){
            player.asset = playerHit;
            player.asset.movedByCamera = false;
            //@ts-ignore
            player.asset.playing = true;
        }
    }else{
        console.log("I AM VINCIBLE")
        //@ts-ignore
        if(player.asset?.playing){
            //@ts-ignore
            player.asset.playing = false;
        }
        player.invincible = false;
        player.asset = playerImage;
        player.asset.movedByCamera = false;
        if(healthBarSection?.children[0].getAttribute("src") === "src/assets/images/car_life_invincible.png"){
            DrawPlayerHealth();
        }
    }

    player.draw();

    if(enemyDeadAnimation.playing){
        console.log("yes draw animation")
        enemyDeadAnimation.draw();
    }

    LoopThroughEnemyGroup();
    enemyGroup.draw();
    bulletGroup.draw();
    CheckForEnemyGroupCollision();
    CheckForBulletGroupCollision();

    if(keys.released("escape") || keys.released("p")){
        timeBeforePause = currentTime;
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
        let deltaLastTimeHit = timeBeforePause - player.lastTimeHit;
        let deltaStartedInvincibility = timeBeforePause - player.startedInvincibility;
        let actualTime = window.performance.now();
        player.lastTimeHit = actualTime - deltaLastTimeHit;
        player.startedInvincibility = actualTime - deltaStartedInvincibility;
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
    if(justChangedScene){
        camera.y = cameraStartPosition;
    }
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
    ClearGroup(enemyGroup);
    ClearGroup(bulletGroup);
    ClearGroup(playerBulletGroup);
    enemies = [...starterEnemies];
    invincibilityPickupCollider.remove();
    invincibilityPickupCollider = CreateInvisibilityPickupCollider();
    playerHealthPickupCollider.remove();
    playerHealthPickupCollider = CreateHealthPickupCollider();
    camera.x = 400;
    camera.y = cameraStartPosition;
    player.remove();
    player = CreatePlayerCollider();
}

function ClearGroup(group:Group){
    for(let i = 0; i < group.length; i++){
        group[i].remove();
    }
}