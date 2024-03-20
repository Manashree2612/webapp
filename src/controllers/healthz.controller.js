const db = require('../models/index.js');
const logger = require('../../logger');

const testDbConnection = async (req, res, next) => {
    try {
        await db.sequelize.authenticate();
        logger.info('testDbConnection: Connected to database');
        next();
    } catch (error) {
        logger.error('testDbConnection: Unable to connect to the database', { error });
        return res.status(503).json();
    }
};

const syncDatabase = async () => {
    try {
        await db.sequelize.sync();
        logger.info('syncDatabase: Database synchronized successfully');
    } catch (error) {
        logger.error('syncDatabase: Error while synchronizing database', { error });
    }
};

const handleGetRequest = async (req, res, next) => {
    try {
        const hasQueryParams = req.query && Object.keys(req.query).length > 0;
        const hasBodyParams = req.body && Object.keys(req.body).length > 0;
        const hasContent = req.headers['content-length'] !== undefined && req.headers['content-length'] !== '0';
        if (hasQueryParams || hasBodyParams || hasContent) {
            logger.warn('handleGetRequest: Received request with unexpected parameters');
            return res.status(400).json();
        }
        logger.info('handleGetRequest: Successful GET request received');
        return res.status(200).json();
    } catch (err) {
        logger.error('handleGetRequest: Error processing GET request', { error: err });
        return res.status(400).json();
    }
};

const handleRestrictedMethods = async (req, res) => {
    try {
        if (req.method !== 'GET') {
            logger.warn('handleRestrictedMethods: Request method not allowed', { method: req.method });
            return res.status(405).json();
        }
    } catch (error) {
        logger.error('handleRestrictedMethods: Error processing request', { error });
        return res.status(400).json();
    }
};

module.exports = {
    testDbConnection,
    handleRestrictedMethods,
    handleGetRequest,
    syncDatabase
};
