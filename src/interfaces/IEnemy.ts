import { Stamp } from "../../lib/Img";

export interface IEnemy {
    x: number;
    y: number;
    w: number;
    h: number;
    image: Stamp;
    maxLife: number;
    turret?: Stamp;
    type: string;
}