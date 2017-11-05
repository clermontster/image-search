const express = require('express');
const latestApi = express.Router();

const dbUtils = require('../utils/db.js');

latestApi.get('/', (req, res) =>{ 
	dbUtils.getRecords(res);
});

module.exports = latestApi;