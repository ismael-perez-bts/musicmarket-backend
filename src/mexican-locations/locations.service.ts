import { Injectable, HttpService } from '@nestjs/common';
import { DatabaseService } from '../database/config.provider';
import * as locationsQueries from '../database/queries/locations.queries';


@Injectable()
export class LocationsService {

  constructor(private databaseService: DatabaseService, private readonly httpService: HttpService) {

  }

  public async getCitiesByState(id) {
    let results = await this.databaseService.client.query(locationsQueries.getCitiesByStateId, [id]);
    return results.rows;
  }

  public async getStateCityByCoordinates(lat, lng) {
    let parsedLat = parseFloat(lat);
    let parsedLng = parseFloat(lng);

    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      throw new Error('Not valid coordinates');
    }

    let queryLocation = locationsQueries.findNearestCity;
    let locationResult = await this.databaseService.client.query(queryLocation, [parsedLng, parsedLat]);
    locationResult = locationResult.rows[0];
    
    return locationResult;
  }

  public async getState(id) {
    // this.httpService.get(`http://inegifacil.com/cities/${id}`).subscribe(async data => {
    //   console.log('data...', data.data);
    //   data.data.shift();
    //   let cities = data.data;
    //   console.log('cities: ', cities);
    //   cities = Array.from(cities);

    //   cities = cities.map(city => (this.parseData(city)));
    //   let i = 0;
    //   let l = cities.length;

      
    //   for(i; i < l; i++) {
    //     console.log('in city...');
    //     let city = cities[i];
    //     await this.storeData(city);
    //   }
   

    // });

    return 'ok';
  }

  private async storeData(data) {
    // let query = locationsQueries.insertCity
    // let values = [];

    // let keys =Object.keys(data);
    // let i = 0;
    // let l = keys.length;

    // for (i; i < l; i++) {
    //   let key = keys[i];
    //   values.push(data[key]);
    // }

    // console.log('values', values);

    // let results = await this.databaseService.client.query(query, values);
    // console.log('results', results);
  }

  private parseData(data) {
    
    // let parsed = {
    //   id: parseInt(data.id, 10),
    //   clave_entidad: parseInt(data.clave_entidad, 10),
    //   clave_municipio: parseInt(data.clave_municipio, 10),
    //   nombre_municipio: data.nombre_municipio,
    //   clave_inegi: parseInt(data.clave_inegi, 10),
    //   nombre_inegi: data.nombre_entidad,
    //   minx: parseFloat(data.minx),
    //   miny: parseFloat(data.miny),
    //   maxx: parseFloat(data.maxx),
    //   maxy: parseFloat(data.maxy),
    //   lat: parseFloat(data.lat),
    //   lng: parseFloat(data.lng),
    //   latitude: parseFloat(data.lat),
    //   longitude: parseFloat(data.lng)
    // }

    // return parsed;
  }
}
