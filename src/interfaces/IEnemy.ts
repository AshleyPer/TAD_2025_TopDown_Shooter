import { Stamp } from "../../lib/Img";

export interface IEnemy {
    id: number;
    x: number;
    y: number;
    image: Stamp;
    maxLife: number;
    turret?: Stamp;
    type: string;
}