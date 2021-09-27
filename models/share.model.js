module.exports = (sequelize, Sequelize) => {
    const Share = sequelize.define("share", {
        symbol: {
            type: Sequelize.STRING(3)
        },
        rate: {
            type: Sequelize.DECIMAL(10, 2)
        }
    });

    return Share;
}