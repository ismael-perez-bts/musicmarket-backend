import { Client } from 'pg';
import { Sequelize } from 'sequelize';

// export const sequelize = new Sequelize('estore', 'ismaelperez', 'bts123', {
//   host: 'localhost',
//   dialect: 'postgres'
// });

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });

export class DatabaseService {
  client = new Client({
    host: '127.0.0.1',
    port: 5432,
    database: 'estore',
    user: 'ismaelperez',
    password: 'bts123',
  });

  constructor() {
    this.client.connect()
    .then(() => {
      console.log('Database is connected');
    })
    .catch((e) => {
      console.log('Error: ', e);
    });
  }
}