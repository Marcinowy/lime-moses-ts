import { Bike } from '../interfaces/bike';
import { DbRider } from '../interfaces/db-rider';
import { Position } from '../interfaces/position';
import { LimeClient } from './lime-client';

export class Rider extends LimeClient {
  private id: number;

  constructor(dbRider: DbRider) {
    super(dbRider.token);
    this.id = dbRider.id;
  }

  getId(): number {
    return this.id;
  }

  async getClosestBikes(position: Position, maxDistance: number): Promise<Bike[]> {
    return (await this.getMap(position)).reduce((prev: Bike[], curr: Bike) => {
      if (this.calculateDistance(position, curr.position) <= maxDistance) {
        prev.push(curr);
      }
      return prev;
    }, []);
  }

  private calculateDistance(pos1: Position, pos2: Position): number {
    const latTheta: number = this.deg2Rad(pos2.lat - pos1.lat) / 2;
    const lngTheta: number = this.deg2Rad(pos2.lng - pos1.lng) / 2;
    const a: number = Math.sin(latTheta) * Math.sin(latTheta) + Math.cos(this.deg2Rad(pos1.lat)) * Math.cos(this.deg2Rad(pos2.lat)) * Math.sin(lngTheta) * Math.sin(lngTheta);
    return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 6371;
  }

  private deg2Rad(deg: number): number {
    return deg * Math.PI / 180;
  }
}