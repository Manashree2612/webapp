const db = require("../models/index");
const bcrypt = require("bcrypt");

const validateAuthToken = async (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken || !authToken.startsWith("Basic ")) {
    return res.status(401).send({ error: 'Unauthorized' });
  }

  const base64Credentials = authToken.split(' ')[1];
  const userCredentials = Buffer.from(base64Credentials, 'base64').toString('utf-8').split(':');

  try {

    const user = await db.User.findOne({
      where: { username: userCredentials[0] },
    });

    //check if user found or not
    if (user) {
      //check if the password matched with the provided credentials
      const isPasswordSame = await bcrypt.compare(userCredentials[1], user.password)
      if (!isPasswordSame) {
        return res.status(401).send({ error: 'Unauthorized', message: 'Incorrect password or username' });
      }
    } else {
      return res.status(401).send({ error: 'Unauthorized', message: 'Incorrect password or username' });
    }

    req.user = user.id;
    next();
  } catch (error) {
    // Handle any errors that occur during the authorization process
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

module.exports = validateAuthToken;
