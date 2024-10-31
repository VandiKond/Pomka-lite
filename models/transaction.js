module.exports = (sequelize, DataTypes) => {
    /**
     * Transaction sequelize model
     */
    const Transaction = sequelize.define('Transaction', {
        /**
         * The id of the transaction
         */
        Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        /**
         * the type of the transaction
         */
        Type: DataTypes.TEXT,
        /**
         * the id of the user, whose transaction it is
         */
        UserId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'UserId'
            }
        },
        /**
         * The descrioption of the transaction
         */
        Description: DataTypes.TEXT,
        /**
         * The date, when the transaction was made
         */
        ProcessedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        timestamps: false
    });

    Transaction.associate = function (models) {
    };
    Transaction.sync()
    return Transaction;
};
