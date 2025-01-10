import { Sprite } from 'pixi.js';
export const player = {
    score: 0,
    direction: 0,
    level: 0,
    lives: 3,
};

export class Enemy {
    x: number
    y: number
    speed: number
    constructor(x: number, y: number, speed: number) {
        this.x = x
        this.y = y
        this.speed = speed
    }
}

export const levels = [
    {enemies: 2},
    {enemies: 4},
    {enemies: 6},
    {enemies: 8},
    {enemies: 10},
    {enemies: 12},
    {enemies: 14},
    {enemies: 16},
    {enemies: 18},
    {enemies: 20}
]
    
export const enemies: Sprite[] = []