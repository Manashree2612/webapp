const db = require('../models/index.js');
const user = require('../models/user.js');

const createUser = async (req, res, next) => {
    try {
        const hasQueryParams = req.query && Object.keys(req.query).length > 0;
        if (hasQueryParams) {
            return res.status(400).json();
        }

        const requiredFields = ['username', 'first_name', 'last_name', 'password'];
        const userDetails = req.body;

        // Check if all required fields are present in req.body
        const missingFields = requiredFields.filter(field => !(field in userDetails));

        if (missingFields.length > 0) {
            return res.status(400).json({ error: 'Bad Request', message: `Missing fields: ${missingFields.join(', ')}` });
        }

        if (typeof userDetails.first_name !== 'string' || typeof userDetails.last_name !== 'string') {
            return res.status(400).json({ error: 'Bad Request', message: 'First name and last name must be strings' });
        }


        // Check if username is not an email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userDetails.username)) {
            return res.status(400).json({ error: 'Bad Request', message: 'Username must be a valid email address' });
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

            return res.status(201).json({
                id: newUser.id,
                username: newUser.username,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
            });
        } else {
            return res.status(400).json({ error: 'Bad Request', message: `User already exists with username: ${existingUser.username}` });
        }

    } catch (error) {
        console.log(error, 'Error while creating a user');
        res.status(500).json({ error: 'Internal server error' });
    }
}

const fetchUser = async (req, res, next) => {
    try {
        const authUserId = req.user;
        const userDetails = await db.User.findOne({ where: { id: authUserId } });
        return res.status(200).json({
            id: userDetails.id,
            username: userDetails.username,
            first_name: userDetails.first_name,
            last_name: userDetails.last_name,
            account_created: userDetails.account_created,
            account_updated: userDetails.account_updated
        });

    } catch (error) {
        console.log(error, 'Error while fetching user details', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const updateUser = async (req, res, next) => {
    try {
        const hasQueryParams = req.query && Object.keys(req.query).length > 0;
        if (hasQueryParams) {
            return res.status(400).json();
        }


        const updatedFields = req.body;
        if (Object.keys(updatedFields).length === 0) {
            return res.status(204).json({ error: 'No Content', message: 'No fields provided for update' });
        }

        for (field in updatedFields) {
            if (field !== 'first_name' && field !== 'last_name' && field !== 'password') {
                return res.status(400).json({ error: 'Bad Request', message: `Attempted to update unathorized field: ${field}` });
            }
        }

        const userDetails = await db.User.findByPk(req.user);
        if (userDetails == null) {
            return res.status(404).json({ error: 'Data not found' });
        }

        userDetails.account_updated = new Date()

        await userDetails.update(updatedFields);
        await userDetails.save();

        const updatedData = {
            id: userDetails.id,
            first_name: userDetails.first_name,
            last_name: userDetails.last_name,
            account_created: userDetails.account_created,
            account_updated: userDetails.account_updated
        }
        return res.status(200).json(updatedData);

    } catch (error) {
        console.log(error, 'Error while updating user details');
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    createUser,
    fetchUser,
    updateUser
};