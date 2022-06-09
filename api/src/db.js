require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

// const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/food`, {
// const sequelize = new Sequelize(
//   `postgres://postgres:admin@localhost:5432/food`,

const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  {
    logging: false, // set to console.log to see the raw SQL queries
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  }
);

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

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
//<<<<<<< passport
// const { User  } = sequelize.models;

// Aca vendrian las relaciones
// Product.hasMany(Reviews);
// Recipe.belongsToMany(Diet, {
//   through: "recipeDiet",
// });
// Diet.belongsToMany(Recipe, {
//   through: "recipeDiet",
// });

//!---se mutea para generar las tablas en la base de datos
const {
  AgeRange,
  Cities,
  Commissions,
  Conditions,
  Contracts,
  Countries,
  Posts,
  Professional,
  Specialties,
  States,
  Taxes,
  Users,
} = sequelize.models;

// Professional.belongsToMany(AgeRange, { through: "ProfessionalsAgeranges" });
// AgeRange.belongsToMany(Professional, { through: "ProfessionalsAgeranges" });

// Professional.belongsToMany(Specialties, {
//   through: "ProfessionalsSpecialties",
// });
// Specialties.belongsToMany(Professional, {
//   through: "ProfessionalsSpecialties",
// });

// Users.hasOne(Cities);
// Cities.belongsToMany(Users, { through: "UsersCities" });

//1 User tiene un ESTADO. Y un ESTADO tiene muchos USUARIOS
// Users.hasOne(States, { through: "UsersStates" });
// States.belongsToMany(Users, { through: "UsersStates" });

//DANIMIR -->> Añade clave StateID a la tabla Users
States.hasMany(Users);
Users.belongsTo(States);

// Users.hasOne(Countries);
// Countries.belongsToMany(Users, { through: "UsersCountries" });

// Posts.hasOne(Cities);
// Cities.belongsToMany(Posts, { through: "PostsCities" });

// Posts.hasOne(States);
// States.belongsToMany(Posts, { through: "PostsStates" });

// Posts.hasOne(Countries);
// Countries.belongsToMany(Posts, { through: "PostsCountries" });

// Users.hasMany(Posts);
// Posts.belongsTo(Users);

// Posts.belongsToMany(Conditions, { through: "PostsConditions" });
// Conditions.belongsToMany(Posts, { through: "PostConditions" });

// Professional.hasMany(Contracts);
// Contracts.belongsTo(Professional);
//>>>>>>> back_end

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
