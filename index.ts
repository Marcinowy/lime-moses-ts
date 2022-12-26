import { DatabaseClient } from './classes/database-client';
import { Rider } from './classes/rider';
import { Bike } from './interfaces/bike';
import { Position } from './interfaces/position';
import * as dotenv from 'dotenv';
dotenv.config();

(async () => {
  const callPosition: Position = { lat: 52.536566, lng: 13.420614 };
  const dbClient = new DatabaseClient({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  const rider: Rider = (await dbClient.getRiders(1))[0];
  const bikes: Bike[] = await rider.getClosestBikes(callPosition, .1);
  
  const ringRiders: Rider[] = await dbClient.getRiders(bikes.length);
  const promises: Promise<void>[] = ringRiders.map((el: Rider, index: number) => {
    return el.ringBike(bikes[index]);
  });

  await Promise.all(promises);

  console.log('Called bikes: ', bikes.map((el: Bike) => el.id).join(', '));
})()