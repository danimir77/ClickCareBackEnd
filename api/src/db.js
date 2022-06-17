require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

// const sequelize = new Sequelize(
//   `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
//   {
//     logging: false, // set to console.log to see the raw SQL queries
//     native: false, // lets Sequelize know we can use pg-native for ~30% more speed
//   }
// );

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  logging: false, // true para ver logs de creacion de tablas y otros
  host: DB_HOST,
  dialect: "mysql",
  port: DB_PORT,
  dialectOptions: {
    mysql2: "^2.3.3",
  },
});

const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

const {
  Users,
  States,
  Cities,
  Countries,
  Professionals,
  Posts,
  Specialties,
  Auctions,
} = sequelize.models;
// console.log(sequelize.models);
States.hasMany(Users);
Users.belongsTo(States);

Cities.hasMany(Users);
Users.belongsTo(Cities);

Countries.hasMany(Users);
Users.belongsTo(Countries);

Users.hasMany(Professionals);
Professionals.belongsTo(Users);

Countries.hasMany(States, {
  foreignKey: "id_country",
});
States.hasMany(Cities, {
  foreignKey: "id_state",
});

Users.hasMany(Posts);
Posts.belongsTo(Users);

Cities.hasMany(Posts);
Posts.belongsTo(Cities);

States.hasMany(Posts);
Posts.belongsTo(States);

Countries.hasMany(Posts);
Posts.belongsTo(Countries);

Posts.hasMany(Auctions);
Auctions.belongsTo(Posts);

Professionals.hasMany(Auctions);
Auctions.belongsTo(Professionals);

Users.hasMany(Auctions);
Auctions.belongsTo(Users);

Specialties.hasMany(Posts);
Posts.belongsTo(Specialties);

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
