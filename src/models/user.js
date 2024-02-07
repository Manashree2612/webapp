'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
    }
    User.init({
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            readOnly: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            writeOnly: true,
            allowNull: false,
            set(value) {
                // Hash the password using bcrypt with a salt of 10 rounds
                const hashedPassword = bcrypt.hashSync(value, 10);
                this.setDataValue('password', hashedPassword);
            }
        },
        account_created: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        account_updated: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'User',
        timestamps: false, // Disable timestamps
    });

    return User;
};