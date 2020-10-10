const fetch = require('node-fetch');

// "Connection": "keep-alive",
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36",
  "Referer": "https://www.google.com",
  "Accept-Language": "en-US,en;q=0.9"
};

// port: 443
// path: ''
const OPTIONS = {
  method: 'GET',
  headers: HEADERS,
  timeout: 8 * 1000,
  rejectUnauthorized: false
};


async function fetchStatus(url) {
  try {
    const res = await fetch(url, OPTIONS)
    if (res.status === 200) {
      return res.url;
    }
  } catch (err) {
    // console.error(err.message)
    throw err;
  }
}

// get html from url as text
async function fetchText(url) {
  try {
    const res = await fetch(url, OPTIONS)
    const text = await res.text();

    return text;
  } catch (err) {
    throw err;
  }
}


async function testFetch(url_list) {
  for (const url of url_list) {
    try {
      //const valid_url = await fetchStatus(url);
      // console.log('valid_url', valid_url);

      const res_text = await fetchText(url);
      // console.log(res_text);

      return res_text;
    } catch (err) {
      console.error(err.message)
      if (url !== urls[url_list.length - 1]) continue;
    }
  }
}

// const urls = ['http://cesglobal.com', 'google.com', 'http://j4development.com', 'http://brarchitects.com', 'http://asdfljnasdlkfbalsdkjf.com']
// const urls = ['http://cesglobal.com', 'https://cesglobal.com', 'http://www.cesglobal.com', 'https://cesglobal.com']
const urls = ['https://www.cesglobal.com/about-us']

testFetch(urls);
