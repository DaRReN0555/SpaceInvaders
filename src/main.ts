import { Application, Assets, Sprite, Text, TextStyle } from 'pixi.js'
import playerUrl from './sprites/player.png'
import enemyUrl from './sprites/enemy.png'
import playerBulletUrl from './sprites/playerBullet.png'
import enemyBulletUrl from './sprites/enemyBullet.png'
import { player, levels, enemies} from './constants';
import playerHitUrl from './sprites/playerHit.png';
import wallUrl from './sprites/wall.png';

let enemyAssets = [enemyUrl]
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
livesText.x = app.screen.width - 150;
livesText.y = 10;
app.stage.addChild(livesText);

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

async function createWalls() {
    const wallTexture = await Assets.load(wallUrl);
    const wallWidth = 50;
    const wallHeight = 20;
    const wallSpacing = 100;
    const wallRows = 3;
    const wallColumns = 5;
    const startX = (app.screen.width - (wallColumns * wallWidth + (wallColumns - 1) * wallSpacing)) / 2;
    const startY = app.screen.height - 200;

    for (let row = 0; row < wallRows; row++) {
        for (let col = 0; col < wallColumns; col++) {
            const wall = new Sprite(wallTexture);
            wall.x = startX + col * (wallWidth + wallSpacing);
            wall.y = startY + row * (wallHeight + 10);
            wall.width = wallWidth;
            wall.height = wallHeight;
            app.stage.addChild(wall);
            walls.push(wall);
        }
    }
}

createWalls();

function checkWallCollision(bullet: Sprite) {
    for (let i = walls.length - 1; i >= 0; i--) {
        if (checkCollision(bullet, walls[i])) {
            app.stage.removeChild(walls[i]);
            walls.splice(i, 1);
            return true;
        }
    }
    return false;
}


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
        if (checkWallCollision(bullet)) {
            app.stage.removeChild(bullet);
            clearInterval(bulletInterval);
            return;
        }
        for (let enemy of enemies) {
            if (checkCollision(bullet, enemy)) {
                handleBulletCollision(bullet, enemy);
                clearInterval(bulletInterval);
                return;
            }
        }
        if (bullet.y < 0) {
            app.stage.removeChild(bullet);
            clearInterval(bulletInterval);
        }
    }, 10);
}



async function DrawEnemy() {
    const enemiesPerLine = 6;
    const enemySpacing = 100;
    const totalEnemyWidth = (enemiesPerLine - 1) * enemySpacing;
    let posX = (app.screen.width - totalEnemyWidth) / 2;
    let posY = 100;
    for (let i = 0; i < levels[player.level].enemies; i++) {
        let enemyTexture = await Assets.load(enemyAssets[randomEnemy()]);
        let enemySprite = new Sprite(enemyTexture);
        enemySprite.anchor.set(0.5);
        enemySprite.x = posX;
        enemySprite.y = posY;
        app.stage.addChild(enemySprite);
        enemies.push(enemySprite);
        posX += enemySpacing;
        if ((i + 1) % enemiesPerLine === 0) {
            posX = (app.screen.width - totalEnemyWidth) / 2;
            posY += 100;
        }
    }
}
DrawEnemy()

let enemyDirection = 1;
const enemySpeed = 0.2;
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
        for (let enemy of enemies) {
            enemy.y += enemyDrop;
        }
    }
}
app.ticker.add(() => {
    if (isGameActive) {
        moveEnemies();
    }
});


const enemyBulletTexture = await Assets.load(enemyBulletUrl);

function enemyShoot(enemy: Sprite) {
    let bullet = new Sprite(enemyBulletTexture);
    bullet.anchor.set(0.5);
    bullet.x = enemy.x;
    bullet.y = enemy.y + 25;
    app.stage.addChild(bullet);

    const bulletInterval = setInterval(() => {
        bullet.y += 5;
        if (checkWallCollision(bullet)) {
            app.stage.removeChild(bullet);
            clearInterval(bulletInterval);
            return;
        }
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
    await DrawEnemy();
}

function restartGame() {
    player.lives = 3;
    player.level = -1;
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
    startNewLevel();
    walls = [] 
    createWalls();
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
        isGameActive = true;
    });
    app.stage.addChild(restartText);
}