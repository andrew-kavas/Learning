//#region imports/constants
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const profilerTools = require('../profiler/profiler-tools');

// "Connection": "keep-alive",
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36",
  "Referer": "https://www.google.com",
  "Accept-Language": "en-US,en;q=0.9"
}

// port: 443
// path: ''
const FETCH_OPTIONS = {
  method: 'GET',
  headers: HEADERS,
  timeout: 8 * 1000,
  rejectUnauthorized: false
};
//#endregion

//#region ptools
async function testFetchHtml() {
  // const urls = ['http://www.cesglobal.com', 'https://www.google.com', 'http://j4development.com', 'http://www.brarchitects.com']
  const urls = ['http://j4development.com']
  
  for (const url of urls) {
    try {
      var html_test = await profilerTools.fetchHtml(url)
      console.log(html_test.length);

    } catch (err) {
      console.error(err.message)
      if (url !== urls[url_list.length - 1]) continue;
    }
  }
}

// adding li comprehension
async function testParseHtml() {
  const source_0 = await profilerTools.fetchHtml('http://j4development.com')
  const test_0 = await profilerTools.parseHtml(source_0);
  console.log(test_0["page text"])
  // console.log(test_0["page links"]);
}

// testFetchHtml();
// testParseHtml();
//#endregion ptools


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
async function parseBetter(source) {
  page_links = []

  const CHEERIO_OPTIONS = {
    normalizeWhitespace: true,
    decodeEntities: false
  };

  // initialize cheerio obj
  const $ = cheerio.load(source, CHEERIO_OPTIONS)


  $("table > tbody > tr > td").each((index, element) => {
    console.log($(element).text());
  });

  $("table > tbody > tr > td").each((index, element) => {
    console.log($(element).text());
  });


  var page_text = $.text()
  page_text += " ############ "

  // add table elements 1 by 1
  $("table > tbody > tr > td").each((index, element) => {
    page_text += (' ' + $(element).text() + ' ');
    console.log($(element).text());
  });

  // find all text data and remove white spaces
  page_text = page_text.trim().replace(/\s+/g, " ");

  // console.log($('a').attr('href'))
  links = $('div a');
  $(links).each((i, link) => {
    page_links.push($(link).attr('href'));
  });
  // console.log('page text: ', page_text);
  // console.log('page links: ', page_links);

  return {"page text": page_text, "page links": page_links}
}

async function testParseBetter() {
  const source = await fetchHtml('https://j4development.com/')
  // const source = await fetchHtml('https://rockportconstructiongroup.com/')
  const page_text = await parseBetter(source)

  console.log(page_text["page text"]);
}

testParseBetter();

