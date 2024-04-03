const db = require("../models/index");
const bcrypt = require("bcrypt");
const logger = require('../../logger');

const validateAuthToken = async (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken || !authToken.startsWith("Basic ")) {
    logger.error('Unauthorized: Authorization token missing or invalid');
    return res.status(401).send({ error: 'Unauthorized' });
  }

  const base64Credentials = authToken.split(' ')[1];
  const userCredentials = Buffer.from(base64Credentials, 'base64').toString('utf-8').split(':');

  const userVerificationStatus = await db.TrackEmail.findOne({
    where: { email: userCredentials[0] },
  });

  if (!userVerificationStatus || !userVerificationStatus.is_verified) {
    logger.error(`User's email is not verified yet`);
    return res.status(403).json({ error: 'Forbidden', message: 'Email not verified' });
  }

  try {

    const user = await db.User.findOne({
      where: { username: userCredentials[0] },
    });

    //check if user found or not
    if (user) {
      //check if the password matched with the provided credentials
      const isPasswordSame = await bcrypt.compare(userCredentials[1], user.password)
      if (!isPasswordSame) {
        logger.error('Unauthorized: Incorrect password for the provided username');
        return res.status(401).send({ error: 'Unauthorized', message: 'Incorrect password or username' });
      }
    } else {
      logger.error('Unauthorized: User not found with the provided username');
      return res.status(401).send({ error: 'Unauthorized', message: 'Incorrect password or username' });
    }

    req.user = user.id;
    logger.info('User authorized successfully');
    next();
  } catch (error) {
    // Handle any errors that occur during the authorization process
    logger.error('Internal Server Error:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

module.exports = validateAuthToken;
