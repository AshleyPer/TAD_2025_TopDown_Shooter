import { Collider } from "../../lib/Collider";
export interface ICollider extends Collider{
    maxLife: number;
    type: string;
    lastBullet: number;
}