import he from 'he';
import fetch from 'node-fetch';
import cheerio from 'cheerio';


const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36",
  "Referer": "https://www.google.com",
  "Accept-Language": "en-US,en;q=0.9"
};

const FETCH_OPTIONS = {
  method: 'GET',
  headers: HEADERS,
  timeout: 8 * 1000,
  rejectUnauthorized: false
};

const CHEERIO_OPTIONS = {
  normalizeWhitespace: true,
  decodeEntities: false
};

const HE_OPTIONS = {
  'isAttributeValue': false
};

// get html from url as text
async function getHtml(url) {
  try {
    const res = await fetch(url, FETCH_OPTIONS)
    const html = await res.text();

    return html;
  } catch (err) {
    console.log('err');
    return 'Bad Url';
  }
}

// get all text from html page
async function getText(source) {
  // initialize cheerio obj
  const $ = cheerio.load(source, CHEERIO_OPTIONS);

  // todo -> encode/decode methods? utf8/ascii?

  // find all text data and remove white spaces
  var page_text = $.text().trim().replace(/\s+/g, " ");
  page_text = he.decode(page_text, HE_OPTIONS);

  return page_text;
}

async function testFetch(url_list) {
  for (const url of url_list) {
    try {
      const html = await getHtml(url);
      const res = await getText(html);
      // console.log(res.status, res.url);
      console.log(res)
    } catch (err) {
      console.error(err.message)
      if (url !== urls[url_list.length - 1]) continue;
    }
  }
}

const urls =  ['http://www.capitalconstructionmemphis.com/'] //['http://cesglobal.com']  // , 'google.com', 'http://www.j4development.com', 'http://brarchitects.com', 'http://asdfljnasdlkfbalsdkjf.com']
// const urls = ['http://cesglobal.com', 'https://cesglobal.com', 'http://www.cesglobal.com', 'https://cesglobal.com']

testFetch(urls);

console.log('okokok')