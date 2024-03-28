'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class TrackEmail extends Model {
    }
    TrackEmail.init({
        id: {
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
        is_verfied: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        verificationToken: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        verificationLink: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'TrackEmail',
        tableName: 'TrackEmail',
        timestamps: false // Disable timestamps
    });

    return TrackEmail;
};
