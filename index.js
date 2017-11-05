require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const searchApi = require('./routes/search.js');
const latestApi = require('./routes/latest.js');

app.use('/search', searchApi);
app.use('/latest', latestApi)

app.listen(port, () => console.log(`Listening on port ${port}`));