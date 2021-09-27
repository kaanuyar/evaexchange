const db = require("../models");
const Transaction = db.transactions;
const Share = db.shares;

exports.buy = async (req, res) => {

    if(!req.body.clientId || !req.body.shareId || !req.body.quantity) {
        res.status(400).send({ message: "Content can not be empty" });
        return;
    }

    if(req.body.quantity <= 0) {
        res.status(400).send({ message: "Quantity must be positive number" });
        return;
    }

    const transaction = {
        clientId: req.body.clientId,
        shareId: req.body.shareId,
        quantity: req.body.quantity,
        action: "BUY"
    }

    try {
        await Transaction.create(transaction);
        let buySum = await Transaction.sum("quantity", {
            where: {
                action: "BUY",
                clientId: req.body.clientId,
                shareId: req.body.shareId
            }
        });
        let sellSum = await Transaction.sum("quantity", {
            where: {
                action: "SELL",
                clientId: req.body.clientId,
                shareId: req.body.shareId
            }
        });
        buySum = (isNaN(buySum) ? 0 : buySum);
        sellSum = (isNaN(sellSum) ? 0 : sellSum);
        
        let sum = buySum - sellSum;
        let shareData = await Share.findByPk(req.body.shareId);

        res.send({
            clientId: req.body.clientId,
            share: shareData,
            quantitySum: sum
        });
    } catch(err) {
        res.status(500).send({ message: err.message || "Error while creating" })
    }
    

};

exports.sell = async (req, res) => {
    if(!req.body.clientId || !req.body.shareId || !req.body.quantity) {
        res.status(400).send({ message: "Content can not be empty" });
        return;
    }

    if(req.body.quantity <= 0) {
        res.status(400).send({ message: "Quantity must be positive number" });
        return;
    }

    const transaction = {
        clientId: req.body.clientId,
        shareId: req.body.shareId,
        quantity: req.body.quantity,
        action: "SELL"
    }

    try {
        let client = await Transaction.findAll({where: { clientId: req.body.clientId } });
        if(client.length === 0) {
            res.status(400).send({ message: "Client does not exist" });
            return;
        }


        let buySum = await Transaction.sum("quantity", {
            where: {
                action: "BUY",
                clientId: req.body.clientId,
                shareId: req.body.shareId
            }
        });
        let sellSum = await Transaction.sum("quantity", {
            where: {
                action: "SELL",
                clientId: req.body.clientId,
                shareId: req.body.shareId
            }
        });
        buySum = (isNaN(buySum) ? 0 : buySum);
        sellSum = (isNaN(sellSum) ? 0 : sellSum);
        
        let sum = buySum - sellSum - req.body.quantity;
        if(sum < 0) {
            res.status(400).send({ message: "Not sufficient shares to be sold" });
            return; 
        }

        await Transaction.create(transaction);
        let shareData = await Share.findByPk(req.body.shareId);

        res.send({
            clientId: req.body.clientId,
            share: shareData,
            quantitySum: sum
        });
    } catch(err) {
        res.status(500).send({ message: err.message || "Error while creating" });
    }

};