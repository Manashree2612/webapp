const db = require('../models/index.js');

const testDbConnection = async (req, res, next) => {
    try {
        await db.sequelize.authenticate();
        console.log('Connected to db');
        next();
    } catch (error) {
        console.error('Unable to connect to the database.');
        return res.status(503).json();
    }
};

const syncDatabase = async () => {
    try {
        await db.sequelize.sync();
        console.log('Database synchronized successfully');
    } catch (error) {
        console.error('Error while synchronizing database ', error);
    }
};

const handleGetRequest = async (req, res, next) => {
    try {
        const hasQueryParams = req.query && Object.keys(req.query).length > 0;
        const hasBodyParams = req.body && Object.keys(req.body).length > 0;
        const hasContent = req.headers['content-length'] !== undefined && req.headers['content-length'] !== '0'
        if (hasQueryParams || hasBodyParams || hasContent) {
            return res.status(400).json();
        }
        return res.status(200).json();
    } catch (err) {
        return res.status(400).json();
    }
}

const handleRetrictedMethods = async (req, res) => {
    try {
        if (req.method !== 'GET') {
            return res.status(405).json();
        }
    } catch (error) {
        return res.status(400).json();
    }
}

module.exports = {
    testDbConnection,
    handleRetrictedMethods,
    handleGetRequest,
    syncDatabase
};
