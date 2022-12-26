import { DatabaseClient } from './classes/database-client';
import { Rider } from './classes/rider';
import { Bike } from './interfaces/bike';

(async () => {
  const dbClient = new DatabaseClient({host:'localhost', user: 'root', database: 'test'});

  const rider: Rider = (await dbClient.getRiders(1))[0];
  const bikes: Bike[] = await rider.getClosestBikes({lat: 52.536566, lng: 13.420614}, .1);
  
  const ringRiders: Rider[] = await dbClient.getRiders(bikes.length);
  const promises: Promise<void>[] = ringRiders.map((el: Rider, index: number) => {
    return el.ringBike(bikes[index]);
  });

  await Promise.all(promises);

  console.log('Called bikes: ', bikes.map((el: Bike) => el.id).join(', '));
})()