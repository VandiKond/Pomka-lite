module.exports = (sequelize, DataTypes) => {
    /**
     * User sequelize model
     */
    const User = sequelize.define('User', {
        /**
         * The id of a user
         */
        UserId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: false
        },
        /**
         * The nickname of the user
         */
        Nickname: DataTypes.TEXT,
        /**
         * The username of the user
         */
        Username: DataTypes.TEXT,
        /**
         * The date when user was created
         */
        CreatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        /**
         * Is the user in the black list
         */
        IsBlocked: DataTypes.BOOLEAN,
        /**
         * The number of times user is blocked
         */
        TimesBlocked: DataTypes.INTEGER
    }, {
        timestamps: false
    });

    User.associate = function (models) {
        User.hasMany(models.Command, { foreignKey: 'OwnerId' });
        User.hasMany(models.Transaction, { foreignKey: 'OwnerId'})
    };

    User.sync()

    return User;
};