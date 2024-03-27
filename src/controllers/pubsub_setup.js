const { PubSub } = require('@google-cloud/pubsub');
const logger = require('../../logger');

const  publishMessage = async (topicNameOrId, data) => {
    // Creates a client; cache this for further use
    const pubSubClient = new PubSub();
    const dataBuffer = Buffer.from(JSON.stringify(data));

    try {
        const messageId = await pubSubClient.topic(topicNameOrId).publishMessage({ data: dataBuffer });
        logger.info(`Message ${messageId} published.`, 'databuffer', dataBuffer);
    } catch (error) {
        logger.error(`Received error while publishing: ${error.message}`);
        process.exitCode = 1;
    }
}

module.exports = publishMessage;

