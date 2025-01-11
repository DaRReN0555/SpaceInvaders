import { Application, Assets, Sprite, Text, TextStyle } from 'pixi.js'
import { player, levels, enemies} from './constants';
import playerUrl from './sprites/playerSprite.png'
import enemy11Url from './sprites/enemySprite1-1.png'
import enemy12Url from './sprites/enemySprite1-2.png'
import enemy21Url from './sprites/enemySprite2-1.png'
import enemy22Url from './sprites/enemySprite2-2.png'
import enemy31Url from './sprites/enemySprite3-1.png'
import enemy32Url from './sprites/enemySprite3-2.png'
import playerBulletUrl from './sprites/playerBullet.png'
import enemyBulletUrl from './sprites/enemyBullet.png'
import playerHitUrl from './sprites/playerBoom.png';
import alienSpriteUrl from './sprites/alienSprite.png'
import alienBoomUrl from './sprites/alienBoom.png'
import wall1Url from './sprites/wallSprite1.png'
import wall12Url from './sprites/wallSprite1-2.png'
import wall13Url from './sprites/wallSprite1-3.png'
import wall14Url from './sprites/wallSprite1-4.png'
import wall2Url from './sprites/wallSprite2.png'
import wall22Url from './sprites/wallSprite2-2.png'
import wall23Url from './sprites/wallSprite2-3.png'
import wall24Url from './sprites/wallSprite2-4.png'
import wall3Url from './sprites/wallSprite3.png'
import wall32Url from './sprites/wallSprite3-2.png'
import wall33Url from './sprites/wallSprite3-3.png'
import wall34Url from './sprites/wallSprite3-4.png'
import wall4Url from './sprites/wallSprite4.png'
import wall42Url from './sprites/wallSprite4-2.png'
import wall43Url from './sprites/wallSprite4-3.png'
import wall44Url from './sprites/wallSprite4-4.png'

let enemy11 = await Assets.load(enemy11Url)
let enemy12 = await Assets.load(enemy12Url)
let enemy21 = await Assets.load(enemy21Url)
let enemy22 = await Assets.load(enemy22Url)
let enemy31 = await Assets.load(enemy31Url)
let enemy32 = await Assets.load(enemy32Url)

let wall1 = await Assets.load(wall1Url)
let wall12 = await Assets.load(wall12Url)
let wall13 = await Assets.load(wall13Url)
let wall14 = await Assets.load(wall14Url)
let wall2 = await Assets.load(wall2Url)
let wall22 = await Assets.load(wall22Url)
let wall23 = await Assets.load(wall23Url)
let wall24 = await Assets.load(wall24Url)
let wall3 = await Assets.load(wall3Url)
let wall32 = await Assets.load(wall32Url)
let wall33 = await Assets.load(wall33Url)
let wall34 = await Assets.load(wall34Url)
let wall4 = await Assets.load(wall4Url)
let wall42 = await Assets.load(wall42Url)
let wall43 = await Assets.load(wall43Url)
let wall44 = await Assets.load(wall44Url)

let enemyAssets = [enemy11, enemy21, enemy31];
function randomEnemy() {
    return Math.floor(Math.random() * enemyAssets.length)
} 

const keys: { [key: string]: boolean } = {};

let walls: Sprite[] = [];

const app = new Application()
await app.init({ background: 'black', width: 810, height: 800 });
document.body.appendChild(app.canvas);

const textStyle = new TextStyle({
    fontSize: 24,
    fill: 'white',
});

const livesText = new Text(`Lives: ${player.lives}`, textStyle);
livesText.x = app.screen.width - 90;
livesText.y = 10;
app.stage.addChild(livesText);

const scoreText = new Text(`Score: ${player.score}`, textStyle);
scoreText.x = 10;
scoreText.y = 10;
app.stage.addChild(scoreText);

app.ticker.add(() => {
    scoreText.text = `Score: ${player.score}`;
});

function updateLivesDisplay() {
    livesText.text = `Lives: ${player.lives}`;
}
const texture = await Assets.load(playerUrl)
const playerTexture = new Sprite(texture)
app.stage.addChild(playerTexture)
playerTexture.anchor.set(0.5)
playerTexture.x = app.screen.width / 2
playerTexture.y = app.screen.height - 50;
window.addEventListener('keypress', keyTrue)
window.addEventListener('keypress', keyFalse)
window.addEventListener('keypress', keySpace)



function checkBorders(from: number, dir: number): boolean {
    if (from + dir < 0) {
        playerTexture.x = 35
        return false
    }
    if (from + dir > app.screen.width) {
        playerTexture.x = app.screen.width - 35
        return false
    }
    return true
}


function keyFalse(e: KeyboardEvent) {
    keys[e.code] = false
};
let isGameActive = true;
function keyTrue(e: KeyboardEvent) {
    if (!isGameActive) return;
    keys[e.code] = true;
    if (keys['KeyA']) {
        player.direction = -10;
        if (checkBorders(playerTexture.x - 35, player.direction)) {
            playerTexture.x -= 10;
        }
    }
    if (keys['KeyD'] == true) {
        player.direction = 10;
        if (checkBorders(playerTexture.x + 35, player.direction)) {
            playerTexture.x += 10;
        }
    }
}

function keySpace(e: KeyboardEvent) {
    if (!isGameActive) return;
    keys[e.code] = false;
    if (e.code == 'Space') {
        shoot();
    }
}

async function shoot() {
    let texture = await Assets.load(playerBulletUrl);
    let bullet = new Sprite(texture);
    bullet.anchor.set(0.5);
    bullet.x = playerTexture.x;
    bullet.y = playerTexture.y - 25;
    app.stage.addChild(bullet);

    const bulletInterval = setInterval(() => {
        bullet.y -= 5;
        for (let enemy of enemies) {
            if (checkCollision(bullet, enemy)) {
                handleBulletCollision(bullet, enemy);
                clearInterval(bulletInterval);
                return;
            }
        }
        handleUFOCollision(bullet);
        if (bullet.y < 0) {
            app.stage.removeChild(bullet);
            clearInterval(bulletInterval);
        }
    }, 10);
}



async function DrawEnemy() {
    const enemiesPerLine = 11;
    const enemySpacing = 60;
    const totalEnemyWidth = (enemiesPerLine - 1) * enemySpacing;
    let posX = (app.screen.width - totalEnemyWidth) / 2;
    let posY = 100;
    for (let i = 0; i < 55; i++) {
        let enemyTexture = enemyAssets[randomEnemy()];
        let enemySprite = new Sprite(enemyTexture);
        enemySprite.anchor.set(0.5);
        enemySprite.x = posX;
        enemySprite.y = posY;
        app.stage.addChild(enemySprite);
        enemies.push(enemySprite);
        posX += enemySpacing;
        if ((i + 1) % enemiesPerLine === 0) {
            posX = (app.screen.width - totalEnemyWidth) / 2;
            posY += 50;
        }
    }
}
DrawEnemy()

let enemyDirection = 1;
let enemySpeed = 5;
const enemyDrop = 20;

function moveEnemies() {
    if (!isGameActive) return;
    let shouldChangeDirection = false;
    for (let enemy of enemies) {
        enemy.x += enemySpeed * enemyDirection;
        if (enemy.x >= app.screen.width - 35 || enemy.x <= 35) {
            shouldChangeDirection = true;
        }
    }
    if (shouldChangeDirection) {
        enemyDirection *= -1;
        enemySpeed += (10 / 81000) ^ 3 + player.level * 3;
        for (let enemy of enemies) {
            enemy.y += enemyDrop;
        }
    }
    
}
 setInterval(() => {
    if (isGameActive) {
        moveEnemies();
    }
 }, 500);

 function drawWalls() {
    let spaceBetweenWalls = 50;
    let wallSpace = 130
    for (let i = 0; i < 2; i++) {
        let wallSprite = new Sprite(wall1);
        wallSprite.anchor.set(0.5);
        wallSprite.x = spaceBetweenWalls + wallSpace;
        wallSprite.y = app.screen.height - 130;
        app.stage.addChild(wallSprite);
        walls.push(wallSprite);
        spaceBetweenWalls += 46
        
    }
    wallSpace += 200
    spaceBetweenWalls = 50
    for (let i = 0; i < 2; i++) {
        let wallSprite = new Sprite(wall1);
        wallSprite.anchor.set(0.5);
        wallSprite.x = spaceBetweenWalls + wallSpace;
        wallSprite.y = app.screen.height - 130;
        app.stage.addChild(wallSprite);
        walls.push(wallSprite);
        spaceBetweenWalls += 46
    }
    wallSpace += 200
    spaceBetweenWalls = 50
    for (let i = 0; i < 2; i++) {
        let wallSprite = new Sprite(wall1);
        wallSprite.anchor.set(0.5);
        wallSprite.x = spaceBetweenWalls + wallSpace;
        wallSprite.y = app.screen.height - 130;
        app.stage.addChild(wallSprite);
        walls.push(wallSprite);
        spaceBetweenWalls += 46
    }
    spaceBetweenWalls = 50
    wallSpace = 130
    for (let i = 0; i < 3; i++) {
        let wallSprite = new Sprite(wall2);
        wallSprite.anchor.set(0.5);
        wallSprite.x = spaceBetweenWalls + wallSpace;
        wallSprite.y = app.screen.height - 151;
        app.stage.addChild(wallSprite);
        walls.push(wallSprite);
        spaceBetweenWalls += 200
    }
    spaceBetweenWalls = 50
    wallSpace = 176
    for (let i = 0; i < 3; i++) {
        let wallSprite = new Sprite(wall4);
        wallSprite.anchor.set(0.5);
        wallSprite.x = spaceBetweenWalls + wallSpace;
        wallSprite.y = app.screen.height - 151;
        app.stage.addChild(wallSprite);
        walls.push(wallSprite);
        spaceBetweenWalls += 200
    }
    spaceBetweenWalls = 50
    wallSpace = 153
    for (let i = 0; i < 3; i++) {
        let wallSprite = new Sprite(wall3);
        wallSprite.anchor.set(0.5);
        wallSprite.x = spaceBetweenWalls + wallSpace;
        wallSprite.y = app.screen.height - 151;
        app.stage.addChild(wallSprite);
        walls.push(wallSprite);
        spaceBetweenWalls += 200
    }
}

drawWalls()

async function changeEnemyTexture(enemy: Sprite) {
    if (enemy.texture == enemy11) {
        enemy.texture = enemy12
    }
    else if (enemy.texture == enemy12) {
        enemy.texture = enemy11
    }
    if (enemy.texture == enemy21) {
        enemy.texture = enemy22
    }
    else if (enemy.texture == enemy22) {
        enemy.texture = enemy21
    }
    if (enemy.texture == enemy31) {
        enemy.texture = enemy32
    }
    else if (enemy.texture == enemy32) {
        enemy.texture = enemy31
    }


}
setInterval(() => {
    if (isGameActive) {
        for (let enemy of enemies) {
            changeEnemyTexture(enemy);
        }
    }
}, 500);

const enemyBulletTexture = await Assets.load(enemyBulletUrl);

function enemyShoot(enemy: Sprite) {
    let bullet = new Sprite(enemyBulletTexture);
    bullet.anchor.set(0.5);
    bullet.x = enemy.x;
    bullet.y = enemy.y + 25;
    app.stage.addChild(bullet);

    const bulletInterval = setInterval(() => {
        bullet.y += 5;
        if (checkCollision(bullet, playerTexture)) {
            handleBulletCollision(bullet, playerTexture);
            clearInterval(bulletInterval);
            return;
        }
        if (bullet.y > app.screen.height) {
            app.stage.removeChild(bullet);
            clearInterval(bulletInterval);
        }
    }, 10);
}


function randomEnemyShoot() {
    if (!isGameActive) return;
    if (enemies.length > 0) {
        const randomIndex = Math.floor(Math.random() * enemies.length);
        const randomEnemy = enemies[randomIndex];
        enemyShoot(randomEnemy);
    }
}
setInterval(() => {
    if (isGameActive) {
        randomEnemyShoot();
    }
}, 1000);

function checkCollision(bullet: Sprite, entity: Sprite): boolean {
    const bulletBounds = bullet.getBounds();
    const entityBounds = entity.getBounds();
    return bulletBounds.x < entityBounds.x + entityBounds.width &&
           bulletBounds.x + bulletBounds.width > entityBounds.x &&
           bulletBounds.y < entityBounds.y + entityBounds.height &&
           bulletBounds.y + bulletBounds.height > entityBounds.y;
}

function handleBulletCollision(bullet: Sprite, entity: Sprite) {
    app.stage.removeChild(bullet);
    if(entity !== playerTexture) app.stage.removeChild(entity);
    const entityIndex = enemies.indexOf(entity);
    if (entityIndex > -1) {
        enemies.splice(entityIndex, 1);
        player.score += 10
    }
    if (entity === playerTexture) {
        blinkPlayer();
        player.lives -= 1;
        updateLivesDisplay();
        if (player.lives <= 0) {
            displayEndScreen("GAME OVER");
            return;
        }
    }
    if (enemies.length === 0) {
        if (player.level >= levels.length - 1) {
            displayEndScreen("YOU WIN");
        } else {
            startNewLevel();
        }
    }
}

async function blinkPlayer() {
    const originalTexture = playerTexture.texture;
    const hitTexture = await Assets.load(playerHitUrl);

    let blinkCount = 0;
    const blinkInterval = setInterval(() => {
        playerTexture.texture = playerTexture.texture === originalTexture ? hitTexture : originalTexture;
        blinkCount++;
        if (blinkCount >= 4) {
            clearInterval(blinkInterval);
            playerTexture.texture = originalTexture;
        }
    }, 300);
}

async function startNewLevel() {
    player.level += 1;
    if(player.lives < 3) {
        player.lives += 1
        updateLivesDisplay();
    }
    
    await DrawEnemy();
}

function restartGame() {
    player.lives = 3;
    player.level = -1;
    player.score = 0;
    enemySpeed = 5
    updateLivesDisplay();
    
    playerTexture.x = app.screen.width / 2;
    playerTexture.y = app.screen.height - 50;
    for (let enemy of enemies) {
        app.stage.removeChild(enemy);
    }
    enemies.length = 0;
    app.stage.removeChildren();
    app.stage.addChild(playerTexture);
    app.stage.addChild(livesText);
    app.stage.addChild(scoreText);
    startNewLevel();
}

function displayEndScreen(message: string) {
    isGameActive = false;
    const overlay = new Sprite();
    overlay.width = app.screen.width;
    overlay.height = app.screen.height;
    overlay.tint = 'white';
    overlay.alpha = 0.7;
    app.stage.addChild(overlay);
    const endTextStyle = new TextStyle({
        fontSize: 48,
        fill: 'white',
        align: 'center',
    });
    const endText = new Text(message, endTextStyle);
    endText.anchor.set(0.5);
    endText.x = app.screen.width / 2;
    endText.y = app.screen.height / 2 - 50;
    app.stage.addChild(endText);
    const buttonTextStyle = new TextStyle({
        fontSize: 24,
        fill: 'white',
    });
    const restartText = new Text('RESTART', buttonTextStyle);
    restartText.anchor.set(0.5);
    restartText.x = app.screen.width / 2;
    restartText.y = app.screen.height / 2 + 50;
    restartText.interactive = true;
    restartText.on('pointerdown', () => {
        restartGame();
        drawWalls()
        isGameActive = true;
    });
    app.stage.addChild(restartText);
}

let ufo: Sprite | null = null;
const ufoSpeed = 2;
let isUfoMoving = true;

async function drawUFO() {
    const ufoTexture = await Assets.load(alienSpriteUrl);
    ufo = new Sprite(ufoTexture);
    ufo.anchor.set(0.5);
    ufo.x = app.screen.width + ufo.width / 2;
    ufo.y = 50;
    app.stage.addChild(ufo);
    isUfoMoving = true;
}
function moveUFO() {
    if (!ufo || !isUfoMoving) return;
    ufo.x -= ufoSpeed;
    if (ufo.x < -ufo.width / 2) {
        app.stage.removeChild(ufo);
        ufo = null;
    }
}
function handleUFOCollision(bullet: Sprite) {
    if (!ufo) return;
    const ufoBounds = ufo.getBounds();
    const bulletBounds = bullet.getBounds();
    if (
        bulletBounds.x < ufoBounds.x + ufoBounds.width &&
        bulletBounds.x + bulletBounds.width > ufoBounds.x &&
        bulletBounds.y < ufoBounds.y + ufoBounds.height &&
        bulletBounds.y + bulletBounds.height > ufoBounds.y
    ) {
        isUfoMoving = false;
        Assets.load(alienBoomUrl).then((explosionTexture) => {
            ufo!.texture = explosionTexture;
            setTimeout(() => {
                app.stage.removeChild(ufo!);
                ufo = null;
            }, 200);
        });
    }
}
setInterval(() => {
    if (isGameActive && !ufo) {
        drawUFO();
    }
}, 10000);
app.ticker.add(() => {
    if (isGameActive) {
        moveUFO();
    }
});

