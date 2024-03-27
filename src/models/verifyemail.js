'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class VerifyEmail extends Model {
    }
    VerifyEmail.init({
        token: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        is_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue:false,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'VerifyEmail',
        tableName: 'verifyemail',
        timestamps: false // Disable timestamps
    });

    return VerifyEmail;
};
