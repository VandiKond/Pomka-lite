module.exports = (sequelize, DataTypes) => {
    /**
     * Command sequelize model
     */
    const Command = sequelize.define('Command', {
        /**
         * Name of the command
         */
        Name: {
            type: DataTypes.TEXT,
            primaryKey: true
        },
        /**
         * The id of the owner of the command
         */
        OwnerId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'UserId'
            }
        },
        /**
         * The name of the action
         */
        ActionName: DataTypes.TEXT,
        /**
         * The time when the command was created
         */
        CreatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        /**
         * The number of thimes command used
         */
        TimesUsed: {
            type:DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
        timestamps: false
    });

    // Creating the command
    Command.sync()

    return Command;
};