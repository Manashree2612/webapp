const dotenv = require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 8080; 

const server = app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`);
});

module.exports = server;