const dotenv = require('dotenv').config();
const app = require('./src/app');
const logger = require('./logger');

const PORT = process.env.PORT || 8080; 

const server = app.listen(PORT, () => {
    logger.info(`App listening on ${PORT}`);
});

module.exports = server;