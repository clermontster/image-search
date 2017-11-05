const express = require('express');
const https = require('https');
const searchApi = express.Router();
const validUrl = require('valid-url');
const {
  API_KEY,
  CUSTOM_SEARCH_ID,
} = process.env;

const dbUtils = require('../utils/db.js');
const ENDPOINT='www.googleapis.com'
const PATH='/customsearch/v1';
const FIELDS='&fields=items(link,title,formattedUrl,pagemap(cse_thumbnail/src,cse_image/src))';
const QUERY_PREFIX='&q=';

function getImage(item) {
  return item.pagemap.cse_image ? item.pagemap.cse_image[0].src : '';
} 

function getThumbnail(item) {
  return item.pagemap.cse_thumbnail ? item.pagemap.cse_thumbnail[0].src : '';
} 

function returnData(data) {
  body = JSON.parse(data);
  // const items = body.map((item) => {
  //   return ({
  //     location: item.location,
  //     location_description: item.location_description,
  //     primary_type: item.primary_type,
  //   });
  // });
    const items = body.items.map((item) => {
    console.log('item',item);
    return ({
      url: getImage(item),
      snippet: item.title,
      thumbnail: getThumbnail(item),
      context:item.formattedUrl,
    });
  });

  return items;
}

searchApi.get('/:search', (req, res) => {
  console.log(req.params.search, req.params.search.toString());
  if(req.params.search === 'favicon.ico'){
    return;
  }
  const searchQuery = encodeURIComponent(req.params.search);
  const options = {
    host: ENDPOINT,
    path: `${PATH}${API_KEY}${CUSTOM_SEARCH_ID}${FIELDS}${QUERY_PREFIX}${searchQuery}`,
  };
  let body ='';

  const url = 'http://data.cityofchicago.org/resource/6zsd-86xi.json';

  var request = https.get(options, (response) => {
    response.setEncoding('utf8');
    response.on('data', function(data) {
      body+=data;
    });

    response.on('end', function() {
      const items = returnData(body);
      res.send(items);
      dbUtils.createRecord(searchQuery);
    });
  });
});

module.exports = searchApi;