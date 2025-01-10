import { Application, Assets, Sprite } from 'pixi.js';
import playerUrl from './sprites/player.png'
import { player } from './constants';

(async () => 
{
    const app = new Application()

    await app.init({ background: '0x000000', width: 800, height: 800 });

    document.body.appendChild(app.canvas)
    const texture = await Assets.load(playerUrl)
    const playerTexture = new Sprite(texture)

    app.stage.addChild(playerTexture)

    playerTexture.anchor.set(0.5)
    playerTexture.x = app.screen.width / 2
    playerTexture.y = app.screen.height / 2
    
})()

console.log(playerUrl)