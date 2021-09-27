const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./models");
db.sequelize.sync({ force: true })
    .then(() => {
        db.shares.bulkCreate([
            { symbol: "AAA", rate: 34.35 },
            { symbol: "BBB", rate: 65 },
            { symbol: "CCC", rate: 21.12 },
        ]).then(() => console.log("shares bulk creation combleted"));
    })
    .then(() => {
        db.clients.bulkCreate([
            {}, {}, {}
        ]).then(() => console.log("clients bulk creation combleted"));
    })
    .then(() => {
        db.transactions.bulkCreate([
            { clientId: 1, shareId: 1, action: "BUY", quantity: 1 },
            { clientId: 1, shareId: 2, action: "BUY", quantity: 3 },
            { clientId: 1, shareId: 2, action: "SELL", quantity: 2 },
            { clientId: 1, shareId: 3, action: "BUY", quantity: 6 },
            { clientId: 2, shareId: 1, action: "BUY", quantity: 3 },
            { clientId: 2, shareId: 3, action: "BUY", quantity: 1 },
            { clientId: 3, shareId: 1, action: "BUY", quantity: 4 },
            { clientId: 3, shareId: 3, action: "BUY", quantity: 2 },
            { clientId: 3, shareId: 3, action: "SELL", quantity: 1 },
        ]).then(() => console.log("transaction bulk creation combleted"));
    });

require("./routes/transaction.routes")(app);

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});