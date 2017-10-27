const express = require('express');
const app = express();
const https = require('https');
const port = process.env.PORT || 3000;

const ENDPOINT='www.googleapis.com'
const PATH='/customsearch/v1';
const API_KEY='?key=AIzaSyBh0fQ9Sy4Ly_w5Qlrv8aakh4GtxHaVeEo';
const CUSTOM_SEARCH_ID='&cx=009228922841197772232:ytpzunobqs4';
const QUERY_PREFIX='&q=';


app.get('/:query', (req, res) => {
	if (req.params.length) {
		res.send(req.params.query);
	}

	const options = {
	  host: ENDPOINT,
	  path: `${PATH}${API_KEY}${CUSTOM_SEARCH_ID}${QUERY_PREFIX}${req.params.query}`,
	  prettyPrint: true,
	  searchType: 'image',
	  cr: 'countryUS',
	};

	const imageRequest = https.get(options, (response) => {
	 	let body;
 		response.setEncoding('utf8');

	  response.on('data', (data) => {
	  	body += data;
	  }).on('end', () => {
	  	// console.log(body['items']);
	  	// const results = body.items.reduce((results, item) =>{
	  	// 	return {
	  	// 		url: item.link,
	  	// 		snippet: item.title,
	  	// 		thumbnail: item.pagemap.cse_thumbnail,
	  	// 		context:item.formatted.url,
	  	// 	};
	  	// });
	  	 // const responseBody = { headers, method, url, body };

    	// res.write(JSON.stringify(responseBody));
	  	res.setHeader('Content-Type', 'application/json');

	  	res.send(body);
	  });
	});

	imageRequest.on('error', (e)=> {
		console.log('Request error:', e.message);
	});

	imageRequest.end();
});

app.listen(port, () => console.log(`Listening on port ${port}`));