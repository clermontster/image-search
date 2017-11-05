require('dotenv').config()
const {
  API_KEY,
  CUSTOM_SEARCH_ID,
} = process.env;
const express = require('express');
const app = express();
const https = require('http');
// const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

const ENDPOINT='www.googleapis.com'
const PATH='/customsearch/v1';
const FIELDS='&fields=items(link,title,formattedUrl,pagemap/cse_thumbnail/src)';
const QUERY_PREFIX='&q=';

function getThumbnail(item) {
  return item.pagemap ? item.pagemap.cse_thumbnail[0].src : '';
} 

function returnData(data) {
  body = JSON.parse(data);
  console.log(typeof body);  
  const items = body.map((item) => {
    return ({
      location: item.location,
      location_description: item.location_description,
      primary_type: item.primary_type,
    });
  });
  //   const items = body.items.map((item) => {
  //   return ({
  //     url: item.link,
  //     snippet: item.title,
  //     thumbnail: getThumbnail(item),
  //     context:item.formattedUrl,
  //   });
  // });
  return items;
}

app.get('/:search', (req, res) => {
  const options = {
    host: ENDPOINT,
    path: `${PATH}${API_KEY}${CUSTOM_SEARCH_ID}${FIELDS}${QUERY_PREFIX}${req.params.search}`,
  };
  let body ='';


  if(req.params.search === 'favicon.ico' || req.query.offet === 'favicon.ico'){
    return;
  }

  const url = 'http://data.cityofchicago.org/resource/6zsd-86xi.json';
  var request = https.get(url, (response) => {
    res.setHeader('Content-Type', 'application/json')
    response.setEncoding('utf8');
    response.on('data', function(data) {
      body+=data;
    });

    response.on('end', function() {
      const items = returnData(body);
      res.send(items);
    });
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));