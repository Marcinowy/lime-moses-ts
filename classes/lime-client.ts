import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { Bike } from '../interfaces/bike';
import { Position } from '../interfaces/position';

export class LimeClient {

  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async ringBike(bike: Bike): Promise<void> {
    await this.setUserLocation(bike.position);

    const response = await this.callBikeApi(bike);
    if (response.bike_missing_report) {
      await this.callBikeApi(bike);
    }
  }

  protected async getMap(position: Position): Promise<Bike[]> {
    const serverData = await this.callApi<any>('/v2/map/bike_pins', 'get', {
      params: {
        ne_lat: position.lat + 0.001,
        ne_lng: position.lng + 0.001,
        sw_lat: position.lat - 0.001,
        sw_lng: position.lng - 0.001,
        user_latitude: position.lat,
        user_longitude: position.lng,
        zoom: 15.0,
      }
    });
    return serverData.data.data.attributes.bike_pins.map((el: any) => {
      return {
        id: el.id,
        position: {
          lat: el.location.latitude,
          lng: el.location.longitude,
        },
      } as Bike;
    });
  }

  private async setUserLocation(position: Position): Promise<void> {
    await this.callApi<any>('/v1/bikes/area_rate_plan', 'get', {
      params: {
        latitude: position.lat,
        longitude: position.lng,
        accuracy: 23,
      }
    });
  }

  private callBikeApi(bike: Bike): Promise<any> {
    return this.callApi<any>(`/v1/bikes/${bike.id}/ring`, 'post');
  }

  private callApi<T>(path: string, method: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
    return axios.request<T>({
      url: `https://web-production.lime.bike/api/rider${path}`,
      method,
      headers: {
        'User-Agent': 'Android Lime/3.13.0; (com.limebike; build:3.13.0; Android 27) 4.9.1',
        'authorization': `Bearer ${this.token}`,
      },
      ...config,
    });
  }
}