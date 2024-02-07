const app = require('./app');
const dotenv = require('dotenv').config();

const PORT = process.env.PORT || 8080; 

app.listen(PORT, () => console.log(` app listening on port ${PORT}`));