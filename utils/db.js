const mongoClient = require('mongodb').MongoClient;
const mongoUrl = process.env.PROD_MONGODB || 'mongodb://localhost:27017/image-search';

function createRecord(searchToAdd) {
	mongoClient.connect(mongoUrl, (err, db) => {
		if (err) {
			console.log('createRecords error', err);
			throw err;	
		}
		const searches = db.collection('searches');
		const now = new Date(Date.now());
		searches.insertOne({
			term: searchToAdd,
			when: now.toISOString(),
		}, (err) => {
			if (err) {
				console.log('createRecords insert error', error);
				throw error;
			}
			db.close();
		}); 
	});
}

function getRecords(res) {
	return mongoClient.connect(mongoUrl, (err, db) => {
		if (err) {
			console.log('getRecords error', err);
			throw err;	
		}
		const searches = db.collection('searches');
		searches.find({}, { _id: 0 }).sort({ when: -1 }).limit(10).toArray((err, docs) => {
			if (err) {
				console.log('getRecords find error', error);
				throw error;
			}
			if (!docs.length) {
				res.send('No recent searches available');
			} else {
				res.send(docs);	
			}
			db.close();
		});
	});
}

module.exports = {
	createRecord: createRecord,
	getRecords: getRecords,
}