const fetch = require('node-fetch');

const cheerio = require('cheerio');


// "Connection": "keep-alive",
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36",
  "Referer": "https://www.google.com",
  "Accept-Language": "en-US,en;q=0.9"
};

// port: 443
// path: ''
const FETCH_OPTIONS = {
  method: 'GET',
  headers: HEADERS,
  timeout: 8 * 1000,
  rejectUnauthorized: false
};


async function searchText(words, source) {
  try {

    return ({words, source});

  } catch (err) {
    console.log(err)
    throw err;
  }
}

// get html from url as text
async function fetchHtml(url) {
  try {
    const res = await fetch(url, FETCH_OPTIONS)
    const html = await res.text();

    return html;
  } catch (err) {
    throw err;
  }
}

// parse raw html
async function parseHtml(source) {
  page_links = []

  const CHEERIO_OPTIONS = {
    normalizeWhitespace: true,
    decodeEntities: false
  };

  // initialize cheerio obj
  const $ = cheerio.load(source, CHEERIO_OPTIONS)

  // find all text data and remove white spaces
  var page_text = $.text().replace(/\s+/g, " ");

  // console.log($('a').attr('href'))
  links = $('div a');
  $(links).each((i, link) => {
    page_links.push($(link).attr('href'));
  });

  return {"page text": page_text, "page links": page_links}
}


// add space between list items
async function testFetch(url_list) {
  for (const url of url_list) {
    try {
      const raw_html = await fetchHtml(url);

      const parsed_html = await parseHtml(raw_html);

      page_text = parsed_html["page text"];
      page_links = parsed_html["page links"];

      console.log('page text', page_text);
      console.log('page links', page_links);

      // todo -> analyze text
      // const word_count = await(searchText(['the', '2'], raw_html))
      // console.log(word_count)

      return raw_html;
    } catch (err) {
      console.error(err.message)
      if (url !== urls[url_list.length - 1]) continue;
    }
  }
}

// const urls = ['http://cesglobal.com', 'google.com', 'http://j4development.com', 'http://brarchitects.com', 'http://asdfljnasdlkfbalsdkjf.com']
// const urls = ['http://cesglobal.com', 'https://cesglobal.com', 'http://www.cesglobal.com', 'https://cesglobal.com']
// const urls = ['https://www.cesglobal.com/about-us']
const urls = ['https://www.a-p.com/']
// const urls = ['http://www.capitalconstructionmemphis.com/']

testFetch(urls);
