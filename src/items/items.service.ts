import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DatabaseService } from '../database/config.provider';
import { AWSService } from '../aws/aws.provider';
import * as itemQueries from '../database/queries/items.queries';
import * as locationQueries from '../database/queries/locations.queries';
import * as categoriesQueries from '../database/queries/categories.queries';
import { S3Image } from '../models/s3-models';

@Injectable()
export class ItemsService {

  constructor(private databaseService: DatabaseService, private aws: AWSService) {

  }

  private getSearchQueryWithLocation(sortyBy: string) {
    switch(sortyBy) {
      case 'recent':
        return itemQueries.filteredItemsWithLocationSortByRecent;
      case 'distance':
        return itemQueries.filteredItemsWithLocationSortByDistance;
      case 'pricemin':
        return itemQueries.filteredItemsByPriceMin;
      case 'pricemax':
        return itemQueries.filteredItemsByPriceMax;
      default:
        return itemQueries.filteredItemsWithLocationSortByRecent;
    }
  }

  private getSearchQuery(sortyBy: string) {
    switch(sortyBy) {
      case 'recent':
        return itemQueries.filteredItems;
      case 'pricemin':
        return itemQueries.filteredItemsByPriceMin;
      case 'pricemax':
        return itemQueries.filteredItemsByPriceMax;
      default:
        return itemQueries.filteredItems;
    }
  }

  /**
   * Service to get items in order by distance. 
   * @param data 
   */
  public async getNearItems(data): Promise<any> {
    let latNum = parseFloat(data.latitude);
    let lngNum = parseFloat(data.longitude);
    let keywords;

    if (data.keywords) {
      keywords = data.keywords.replace(' ', ' | ');
    }
    
    let stateNum = parseInt(data.state);
    let state = !isNaN(stateNum) ? parseInt(data.state) : 1;
    let categoryNum = parseInt(data.category);
    let category = !isNaN(categoryNum) ? parseInt(data.category) : null;
    let conditionNum = parseInt(data.condition);
    let condition = !isNaN(conditionNum) ? parseInt(data.condition) : null;
    let distanceNum = parseInt(data.distance);
    let distance = !isNaN(distanceNum) ? distanceNum * 1000 : 10000000;
    let maxNum = parseInt(data.max);
    let max = !isNaN(maxNum) ? maxNum : 500000;
    let minNum = parseInt(data.min);
    let min = !isNaN(minNum) ? minNum : 0;
    let results;
    let locationResult;

    if (isNaN(latNum) || isNaN(lngNum)) {
      let values = [
        keywords || null,
        category,
        state,
        condition
      ];

      let query = this.getSearchQuery(data.sortyBy);
      results = await this.databaseService.client.query(query, values);
    } else {
      let values = [
        data.longitude || null,
        data.latitude || null,
        keywords || null,
        category,
        state,
        condition,
        distance,
        max,
        min
      ];

      let locationValues = [
        data.longitude || null,
        data.latitude || null,
      ];

      let queryLocation = locationQueries.findNearestCity;
      locationResult = await this.databaseService.client.query(queryLocation, locationValues);
      locationResult = locationResult.rows[0];

      let query = this.getSearchQueryWithLocation(data.sortyBy);
      results = await this.databaseService.client.query(query, values);
    }
    
    return { location: locationResult, items: results.rows };
  }

  public async getItemById(id) {
    let itemId = parseInt(id, 10);
    let results = await this.databaseService.client.query(itemQueries.itemById, [itemId]);

    if (results.rows.length) {
      return results.rows[0];
    }

    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  /**
   * Service to create a new item for sale.
   * @param data 
   * @param uid 
   * @param imageFile 
   */
  public async postItem(data, uid, imageFile):Promise<any> {
    let itemData = {
      title: data.title,
      description: data.description,
      condition: parseInt(data.condition, 10),
      price: parseInt(data.price, 10),
      currency: 'MXN',
      category: parseInt(data.category),
      state: 1,
      dateCreated: new Date(),
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
      tokens: `'${data.title}' || ' ' || '${data.description}'`,
      cityId: parseInt(data.cityId, 10),
      stateId:  parseInt(data.stateId, 10)
    };

    let imageData: S3Image = await this.aws.uploadItemImage(imageFile.buffer, uid, imageFile.originalname);

    if (isNaN(itemData.condition) || isNaN(itemData.price) || isNaN(itemData.category) || isNaN(itemData.latitude) || isNaN(itemData.longitude)
    || isNaN(itemData.cityId) || isNaN(itemData.stateId)) {
      throw 'Invalid numeric data. Check all values that should contain a numeric value.';
    }

    if (!itemData.title || !itemData.description) {
      throw 'Title and description are required values!';
    }

    let queryData = [
      itemData.title, 
      itemData.description, 
      itemData.condition, 
      itemData.price, 
      itemData.currency, 
      itemData.category, 
      itemData.state,
      itemData.latitude, 
      itemData.longitude,
      itemData.tokens,
      uid,
      imageData.Location,
      itemData.cityId,
      itemData.stateId
    ];

    let query = itemQueries.createNewItem;
    let results = await this.databaseService.client.query(query, queryData);

    return results.rows[0];
  }

  /**
   * Service to get categories.
   */
  public async getCategories() {
    let query = categoriesQueries.getCategories;
    let results = await this.databaseService.client.query(query);
    return results.rows;
  }
}
