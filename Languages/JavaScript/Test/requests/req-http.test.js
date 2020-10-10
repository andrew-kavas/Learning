const http = require('http');
const https = require('https');


const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36",
  "Referer": "https://www.google.com",
  "Accept-Language": "en-US,en;q=0.9"
}

const OPTIONS = {
  method: 'GET',
  host: 'brarchitects.com',
  headers: HEADERS,
  timeout: 2 * 1000
};

// const req = http.request(options, (res) => {
//   console.log(res.statusCode);
//   // console.log(res);
//   // console.log(JSON.stringify(res.headers))
// });

// req.end();

const req = http.request(OPTIONS, (res) => {
  console.log(res.statusCode)
  console.log(res.headers.location);
  // console.log(res);
  // console.log(JSON.stringify(res.headers))

});

req.on('error', function(e) {
  console.log('ERROR: ', OPTIONS.host)
  console.error('message: ', e);
});

req.on('timeout', () => {
  console.log('Request TIMEOUT: ', OPTIONS.host)
  req.abort();
});

req.end();

// 'cesglobal.com'
// 'www.a-p.com',
// 'j4development.com',