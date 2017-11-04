require('dotenv').config()
const {
	API_KEY,
	CUSTOM_SEARCH_ID,
} = process.env;
console.log(process.env);
const express = require('express');
const app = express();
const https = require('https');
// const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

const ENDPOINT='www.googleapis.com'
const PATH='/customsearch/v1';

const QUERY_PREFIX='&q=';

let body ='';

function returnData(data) {
	const body = JSON.parse(data);
	const items = body.items.map((item) => {
		return ({
			url: item.link,
    	snippet: item.title,
    	thumbnail: item.pagemap.cse_thumbnail,
    	context:item.formattedUrl,
		});
	});
	return items;
}

app.get('/:query', (req, res) => {
	if(req.params.query === 'favicon.ico'){
		return;
	}
	const options = {
	  host: ENDPOINT,
	  path: `${PATH}${API_KEY}${CUSTOM_SEARCH_ID}${QUERY_PREFIX}${req.params.query}`,
	};
	const url = 'http://data.cityofchicago.org/resource/6zsd-86xi.json';
	var request = https.get(options, (response) => {
		response.setEncoding('utf8');
	  response.on('data', function(data) {
	  	body+=data.toString();
	  });

	  response.on('end', function() {
	  	// const parsed = JSON.parse(body)[2];
	  	const items = returnData(body);
	  	res.send(items);
		});
	});
	request.end();
	
	
});

app.listen(port, () => console.log(`Listening on port ${port}`));