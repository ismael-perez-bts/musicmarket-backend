import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/config.provider';
import * as itemQueries from '../database/queries/items.queries';

@Injectable()
export class ItemsService {

  constructor(private databaseService: DatabaseService) {

  }

  public async getNearItems(data): Promise<any> {
    let latNum = parseInt(data.latitude);
    let lngNum = parseInt(data.longitude);
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
    let results;

    if (isNaN(latNum) || isNaN(lngNum)) {
      let values = [
        keywords || null,
        category,
        state,
        condition
      ];

      let query = itemQueries.filteredItems;
      results = await this.databaseService.client.query(query, values);
    } else {
      let values = [
        data.latitude || null,
        data.longitude || null,
        keywords || null,
        category,
        state,
        condition
      ];

      let query = itemQueries.filteredItemsWithLocation;
      results = await this.databaseService.client.query(query, values);
    }
    
    return results.rows;
  }

  public async postItem(data):Promise<any> {
    let itemData = {
      title: data.title,
      description: data.description,
      condition: parseInt(data.condition, 10),
      price: parseInt(data.price, 10),
      currency: 'MXN',
      category: parseInt(data.category),
      state: 1,
      dateCreated: new Date(),
      latitude: parseInt(data.latitude),
      longitude: parseInt(data.longitude),
      tokens: `'${data.title}' || ' ' || '${data.description}'`
    };

    if (isNaN(itemData.condition) || isNaN(itemData.price) || isNaN(itemData.category) || isNaN(itemData.latitude) || isNaN(itemData.longitude)) {
      throw 'Invalid numberic data. Check all values that should contain a numeric value.';
    }

    if (!itemData.title || itemData.description) {
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
      itemData.tokens
    ];
    let query = itemQueries.createNewItem;
    let results = this.databaseService.client.query(query, queryData);

    return results;
  }
}
