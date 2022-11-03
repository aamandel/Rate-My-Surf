const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Weather extends Model { }

Weather.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        beach_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'beach',
                key: 'id'
            }
        },
        tide_info: {
            type: DataTypes.JSON,
        },
        weather_info: {
            type: DataTypes.JSON,
        }

    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'weather'
    }
);

module.exports = Weather