import { Stamp } from "../../lib/Img";
import { ITurret } from "./ITurret";

export interface IEnemy {
    id: number;
    x: number;
    y: number;
    image: Stamp;
    maxLife: number;
    turret?: Stamp;
    type: string;
}