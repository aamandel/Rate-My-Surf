const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Beach extends Model { }

Beach.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        longitude: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        latitude: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        county_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'county',
                key: 'id'
            }
        }

    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'beach'
    }
);

module.exports = Beach