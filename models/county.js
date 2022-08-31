const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class County extends Model { }

County.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'county'
    }
);

module.exports = County;