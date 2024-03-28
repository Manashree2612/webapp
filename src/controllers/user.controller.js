const db = require('../models/index.js');
const user = require('../models/user.js');
const logger = require('../../logger');
const publishMessage = require('./pubsub_setup');

const createUser = async (req, res, next) => {
    try {
        const hasQueryParams = req.query && Object.keys(req.query).length > 0;
        if (hasQueryParams) {
            logger.warn('createUser: Received request with query parameters');
            return res.status(400).json();
        }

        const requiredFields = ['username', 'first_name', 'last_name', 'password'];
        const userDetails = req.body;

        // Check if all required fields are present in req.body
        const missingFields = requiredFields.filter(field => !(field in userDetails));

        if (missingFields.length > 0) {
            logger.warn('createUser: Missing required fields', { missingFields });
            return res.status(400).json({ error: 'Bad Request', message: `Missing fields: ${missingFields.join(', ')}` });
        }

        // Check if any field is blank
        const blankFields = requiredFields.filter(field => userDetails[field].trim() === '');

        if (blankFields.length > 0) {
            logger.warn('createUser: Blank fields found', { blankFields });
            return res.status(400).json({ error: 'Bad Request', message: `Fields cannot be left blank: ${blankFields.join(', ')}` });
        }

        if (typeof userDetails.first_name !== 'string' || typeof userDetails.last_name !== 'string') {
            logger.warn('createUser: First name or last name is not a string');
            return res.status(400).json({ error: 'Bad Request', message: 'First name and last name must be strings' });
        }


        // Check if username is not an email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userDetails.username)) {
            logger.warn('createUser: Username is not a valid email address');
            return res.status(400).json({ error: 'Bad Request', message: 'Username must be a valid email address' });
        }

        // Check if password is empty
        if (!userDetails.password.trim()) {
            logger.warn('createUser: Password is empty');
            return res.status(400).json({ error: 'Bad Request', message: 'Password cannot be empty' });
        }

        //Check if a user with same username exists or not
        const existingUser = await db.User.findOne({ where: { username: userDetails.username } })
        if (existingUser === null) {

            //Create new user as no user with same username found
            const newUser = await db.User.create({
                username: userDetails.username,
                first_name: userDetails.first_name,
                last_name: userDetails.last_name,
                password: userDetails.password
            });

            logger.info('createUser: New user created', { userId: newUser.id });
            // Construct the user info object


            await publishMessage('verify_email', {
                id: newUser.id,
                username: newUser.username,
                first_name: newUser.first_name,
                last_name: newUser.last_name
            });

            return res.status(201).json({
                id: newUser.id,
                username: newUser.username,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                account_created: newUser.account_created,
                account_updated: newUser.account_updated,
            });
        } else {
            logger.warn('createUser: User already exists', { existingUsername: existingUser.username });
            return res.status(400).json({ error: 'Bad Request', message: `User already exists with username: ${existingUser.username}` });
        }

    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            logger.error('createUser: Validation error', { error });
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        } else if (error.name === 'PermissionError') {
            logger.error('createUser: Permission denied', { error });
            return res.status(403).json({ error: 'Permission denied' });
        }
        logger.error('createUser: Internal Server Error', { error });
        console.error('An error occurred:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const fetchUser = async (req, res, next) => {
    try {
        const hasQueryParams = req.query && Object.keys(req.query).length > 0;
        if (hasQueryParams) {
            logger.warn('fetchUser: Received request with query parameters');
            return res.status(400).json();
        }
        const authUserId = req.user;
        const userDetails = await db.User.findOne({ where: { id: authUserId } });
        logger.info('fetchUser: User details fetched', { userId: userDetails.id });
        return res.status(200).json({
            id: userDetails.id,
            username: userDetails.username,
            first_name: userDetails.first_name,
            last_name: userDetails.last_name,
            account_created: userDetails.account_created,
            account_updated: userDetails.account_updated
        });

    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            logger.error('fetchUser: Validation error', { error });
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        } else if (error.name === 'PermissionError') {
            logger.error('fetchUser: Permission denied', { error });
            return res.status(403).json({ error: 'Permission denied' });
        }
        logger.error('fetchUser: Internal Server Error', { error });
        console.error('An error occurred:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const updateUser = async (req, res, next) => {
    try {
        const hasQueryParams = req.query && Object.keys(req.query).length > 0;
        if (hasQueryParams) {
            logger.warn('updateUser: Received request with query parameters');
            return res.status(400).json();
        }

        const updatedFields = req.body;
        if (Object.keys(updatedFields).length === 0) {
            logger.warn('updateUser: No fields provided for update');
            return res.status(400).json({ error: 'No Content', message: 'No fields provided for update' });
        }

        // Check if any field is blank
        const blankUpdatedFields = Object.keys(updatedFields).filter(field => updatedFields[field].trim() === '');
        if (blankUpdatedFields.length > 0) {
            logger.warn('updateUser: Blank fields found', { blankUpdatedFields });
            return res.status(400).json({ error: 'Bad Request', message: `Fields cannot be left blank: ${blankUpdatedFields.join(', ')}` });
        }


        for (field in updatedFields) {
            if (field !== 'first_name' && field !== 'last_name' && field !== 'password') {
                logger.warn('updateUser: Attempted to update unauthorized field', { field });
                return res.status(400).json({ error: 'Bad Request', message: `Attempted to update unauthorized field: ${field}` });
            }
        }

        const userDetails = await db.User.findByPk(req.user);
        if (userDetails == null) {
            logger.warn('updateUser: User details not found', { userId: req.user });
            return res.status(404).json({ error: 'Data not found' });
        }

        userDetails.account_updated = new Date();

        await userDetails.update(updatedFields);
        await userDetails.save();

        logger.info('updateUser: User details updated', { userId: userDetails.id });
        const updatedData = {
            id: userDetails.id,
            first_name: userDetails.first_name,
            last_name: userDetails.last_name,
            account_created: userDetails.account_created,
            account_updated: userDetails.account_updated
        };

        return res.status(200).json(updatedData);

    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            logger.error('updateUser: Validation error', { error });
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        } else if (error.name === 'PermissionError') {
            logger.error('updateUser: Permission denied', { error });
            return res.status(403).json({ error: 'Permission denied' });
        }
        logger.error('updateUser: Internal Server Error', { error });
        console.error('An error occurred:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const verifyUserEmail = async (req, res, next) => {
    try {
        // Extract the token from the query parameters
        const token = req.query.token;

        // Decode the token from base64
        const decodedToken = Buffer.from(token, 'base64').toString('utf-8');

        // Parse the JSON string into an object
        const userInfo = JSON.parse(decodedToken);

        // Fetch the created_at time from the VerifyEmail table based on the user email
        const verifyEmailRecord = await db.TrackEmail.findOne({
            where: {
                email: userInfo.username, 
            }
        });

        logger.info('verifyEmailRecord',verifyEmailRecord);

        if (!verifyEmailRecord) {
            logger.error('Verification record not found')
            return res.status(404).send('Verification record not found');
        }

        // Check if the token is expired (2 min validity)
        const expirationTime = 2 * 60 * 1000; // 2 min in milliseconds
        const currentTime = Date.now();
        const linkCreatedAt = verifyEmailRecord.created_at.getTime();

        if (currentTime - linkCreatedAt > expirationTime) {
            logger.error('Verification link has expired')
            return res.status(410).send('Verification link has expired');
        }

        // Update user account as verified
        await verifyEmailRecord.update({
            is_verified: true
        });
        await verifyEmailRecord.save();

        // Send response indicating successful verification
        logger.info('Email verified successfully');
        res.status(200).send('Email verified successfully');
    } catch (error) {
        // Handle errors
        logger.error('Error verifying email:', error.message);
        res.status(400).send('Error verifying email: ' + error.message);
    }
}
module.exports = {
    createUser,
    fetchUser,
    updateUser,
    verifyUserEmail
};