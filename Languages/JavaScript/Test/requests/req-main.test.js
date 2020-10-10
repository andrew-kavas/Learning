const fetch = require('node-fetch');


// "Connection": "keep-alive",
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36",
  "Referer": "https://www.google.com",
  "Accept-Language": "en-US,en;q=0.9"
}

const OPTIONS = {
  port: 443,
  path: '',
  method: 'GET',
  headers: HEADERS,
  timeout: 8 * 1000,  //msec
  rejectUnauthorized: false
};


// format url -> example.com 
function cleanUrl(url) {
  url = url.toLowerCase().trim();
  // remove http/https, parameters, and trailing slash
  var urlParts = url.replace('http://','').replace('https://','').split(/[/?#]/);
  url = urlParts[0]

  // todo -> check if necessary
  if (url.startsWith("www.")) {
    url = url.replace("www.", "")
  }

  return url;
}

async function fetchUrl(abs_url) {
  // todo -> update
  try {
    const res = await fetch(abs_url, OPTIONS);
    console.log('status:', res.status, abs_url);
    // console.log(res);

    // if valid, return url
    if (res.status === 200) return res.url;
    
    // if redirect, return location
    else if (res.status === 301 || res.status === 302) return res.headers.location;

    // if bad
  }
  catch (e) {
    throw e;
  }
}

// todo -> check if valid for non www.
async function getDomain(url) {
  var url = cleanUrl(url);

  try {
    var abs_url = "https://www." + url;
    var domain = await fetchUrl(abs_url);
    // console.log(domain);
    
    return domain;
  }
  catch (err) {
    console.error(err.message)

    var abs_url = "http://www." + url;
    var domain = await fetchUrl(abs_url);

    // todo -> is this how you pass errors?
    return domain;
  }
}

async function testGetDomain(url) {
  const domain = await getDomain(url)
    .then(data => console.log(`FINAL domain: ${url} \n ${data} \n`))
    .catch(reason => console.log(reason.message));
}

// const data = await res.text();
// console.log(data)
const VALID_LEADS = ['mtsi.com/', 'brarchitects.com', 'skilesgroup.com', 'www.emergentcontech.com', 'www.transomremodeling.com', 'http://www.cesglobal.com/', 'deebrown.com ', 'SHEILSWINNUBST.COM', 'https://rockportconstructiongroup.com', 'chesmar.com', 'http://www.brownroofingsolutions.com', 'http://www.dietrichsonfinehomes.com', 'j4development.com', 'https://shortandassociates.org/', 'ROMACKCO.COM', 'http://www.strategicconstruction.com'];
const BAD_LEADS = ['puravidacon.com', 'http://www.texasskyexteriors.com', 'http://www.khconstruction.us', 'a-p.com']
const REFUSED_LEADS = ['a-p.com']
const INVALID_LEADS = ['jksdnfkjsandfkjn.com', 'cesglobal.com']

const url_1 = 'cesglobal.com';
const url_2 = 'https://brarchitects.com/';
const url_3 = 'www.invalidurlsafasf.com';
const url_4 = 'asdnfskjndfkjsndf';
const url_5 = 'www.example.com/index.html';


// VALID_LEADS.forEach(element => testGetDomain(element));
// BAD_LEADS.forEach(element => testGetDomain(element));
// REFUSED_LEADS.forEach(element => testGetDomain(element));
INVALID_LEADS.forEach(element => testGetDomain(element));

// testGetDomain(LEADS[1]);
// testGetDomain(LEADS[2]);
// testGetDomain(LEADS[3]);
// testGetDomain(LEADS[4]);
// testGetDomain(LEADS[5]);
