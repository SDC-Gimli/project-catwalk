const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();
const port = 3000;
const key = require(path.join(__dirname, '../auth.js'));
// console.log(__dirname);
// console.log(path.join(__dirname, '../auth.js'));
// console.log(path.join(__dirname, '../client/dist/'));
let apiUrl = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/';
const QAUrl = 'http://3.134.109.207/';

app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist/')));

// add token to requests
app.get('/api/*', (req, res) => {
  // console.log('get api: ');
  // console.log(req.originalUrl);
  let postfix = req.originalUrl.replace('/api/', '');
  let prefix = apiUrl;

  if (req.originalUrl.indexOf('questions') !== -1) {
    prefix = QAUrl;
    postfix = req.originalUrl.replace('/api/qa/', '');
  }

  axios({
    method: 'get',
    url: prefix + postfix,
    headers: {'Authorization': key, 'Accept-encoding': 'gzip, deflate'},
    data: req.body,
  }).then((results) => {
    // console.log(results.data);
    res.json((results.data));
  }).catch((error) => {
    res.status(error.response.status);
    // console.log(error.response.data);
    res.json(error.response.data);
  });
});

app.post('/api/*', (req, res) => {
  console.log('post api: ');
  console.log(req.originalUrl);
  console.log(req.body);
  let postfix = req.originalUrl.replace('/api/', '');
  let prefix = apiUrl;
  if (req.originalUrl.indexOf('questions') !== -1) {
    prefix = QAUrl;
    if(postfix.indexOf('answers') !== -1) {
      postfix = `answers`;
    } else {
      postfix = req.originalUrl.replace('/api/qa/', '');
    }
    console.log(prefix + postfix);
  }
  axios({
    method: 'post',
    url: prefix + postfix,
    headers: {'Authorization': key},
    data: req.body,
  }).then((results) => {
    // console.log(results.data);
    res.status(201);
    res.json((results.data));
  }).catch((error) => {
    console.log('post error');
    res.status(error.response.status);
    console.log(error.response.data);
    res.json(error.response.data);
  });
});

app.put('/api/*', (req, res) => {
  console.log('put api: ');
  console.log(req.originalUrl);
  console.log(req.body);
  let postfix = req.originalUrl.replace('/api/', '');
  let prefix = apiUrl;
  if (req.originalUrl.indexOf('questions') !== -1) {
    prefix = QAUrl;
      postfix = 'questions/helpfulness';

    console.log(prefix + postfix);
  } else if (postfix.indexOf('answers') !== -1) {
    prefix = QAUrl;
    postfix = `answers/helpfulness`;
    console.log(prefix + postfix);
  }
  axios({
    method: 'put',
    url: prefix + postfix,
    headers: {'Authorization': key},
    data: req.body,
  }).then((results) => {
    // console.log(results.data);
    res.status(204);
    res.json((results.data));
  }).catch((error) => {
    // console.log(error);
    res.status(error.response.status);
    // console.log(error.response.data);
    res.json(error.response.data);
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

