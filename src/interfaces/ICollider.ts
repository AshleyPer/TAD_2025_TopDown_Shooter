import { Collider } from "../../lib/Collider";
export interface ICollider extends Collider{
    maxLife: number;
    currentLife: number;
    type: string;
    lastBullet: number;
    invincible: boolean;
    lastTimeHit: number;
    startedInvincibility: number;
}