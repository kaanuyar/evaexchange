const dbConfig = require("../config/db.config");

const Sequelize = require("sequelize");
/*const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    define: {
        timestamps: false
    }
});*/

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    define: {
        timestamps: false
    }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.shares = require("./share.model")(sequelize, Sequelize);
db.transactions = require("./transaction.model")(sequelize, Sequelize);
db.clients = require("./client.model")(sequelize, Sequelize);

db.transactions.belongsTo(db.shares);
db.transactions.belongsTo(db.clients);

module.exports = db;
