import fetch from 'node-fetch';

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36",
  "Referer": "https://www.google.com",
  "Accept-Language": "en-US,en;q=0.9"
};

const OPTIONS = {
  method: 'GET',
  timeout: 2 * 1000
};


async function getFetch(url) {
  try {
    const res = await fetch(url, OPTIONS)

    if (res.status === 200) {
      return res;
    }

  } catch (err) {
    // console.error(err.message)
    throw err;
  }
}

async function testFetch(url_list) {
  for (const url of url_list) {
    try {
      const res = await getFetch(url);
      // console.log(res.status, res.url);
      console.log(res)
    } catch (err) {
      console.error(err.message)
      if (url !== urls[url_list.length - 1]) continue;
    }
  }
}

const urls = ['http://cesglobal.com', 'google.com', 'http://www.j4development.com', 'http://brarchitects.com', 'http://asdfljnasdlkfbalsdkjf.com']
// const urls = ['http://cesglobal.com', 'https://cesglobal.com', 'http://www.cesglobal.com', 'https://cesglobal.com']

testFetch(urls);
