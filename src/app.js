const express = require('express');
require('dotenv').config();
const db = require('./models/index');
const router = require('./routes/index');
const { testDbConnection, syncDatabase } = require('./controllers/healthz.controller.js');

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Cache-Control', 'no-cache');
    next();
});
app.use((err, req, res, next) => {
    res.header('Cache-Control', 'no-cache');
    if (err.status == 400 || err.type == 'entity.parse.failed' || err.body) {
        return res.status(400).json();
    }
    next();
});

app.use(testDbConnection);
syncDatabase();

app.use('/', router);
app.use('*', (req, res) => {
    res.status(404).json();
});

module.exports = app;
