// import { Model, STRING, TEXT, SMALLINT, BOOLEAN, DECIMAL, GEOMETRY } from 'sequelize';
// import { sequelize } from '../config.provider';

// class Item extends Model {}

// Item.init({
//   title: {
//     type: STRING(70),
//     allowNull: false
//   },
//   description: {
//     type: TEXT,
//     allowNull: false
//   },
//   condition: {
//     type: SMALLINT,
//     allowNull: false
//   },
//   price: {
//     type: DECIMAL(10,2),
//     allowNull: false
//   },
//   customFields: {
//     type: BOOLEAN,
//     allowNull: false
//   },
//   currency: {
//     type: STRING(3),
//     allowNull: false
//   },
//   location: {
//     type: GEOMETRY('POINT', 4326),
//     allowNull: false
//   }
// }, {
//   sequelize,
//   modelName: 'item'
// });