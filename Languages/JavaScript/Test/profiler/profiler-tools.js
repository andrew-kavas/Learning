const fetch = require('node-fetch');
const cheerio = require('cheerio');


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


// initialize parameters
function paramInit(req) {
  const default_depth = 1;
  const default_timeout = 60;

  var params = {};
  params["status"] = 'SUCCESS';

  // check for url
  if (typeof req.body.url != 'string') {
    params["status"] = 'Invalid: input must include url as string';
    return params;
  } else { 
    params["raw url"] = req.body.url;
  };
  
  // check for word list
  if (Array.isArray(req.body.words) == false) {
    params["status"] = 'Invalid: input must include words as list';
    return params;
  } else { 
    params["words"] = req.body.words.map(String) ;
  };
  
  // check for depth
  if (typeof req.body.depth == 'undefined') {
    params["depth"] = default_depth;
  } else if (typeof req.body.depth == 'number') {
    params["depth"] = Math.round(req.body.depth);
  } else { 
    params["status"] = 'Invalid: input must include depth as int';
    return params;
  }

  // check for timeout
  if (typeof req.body.timeout == 'undefined') {
    params["timeout"] = default_timeout;
  } else if (typeof req.body.timeout == 'number') {
    params["timeout"] = Math.round(req.body.timeout);
  } else { 
    params["status"] = 'Invalid: input must include timeout as int';
    return params;
  }

  return params;
}

// initialize lead profile
async function leadInit(initial_params) {
  lead_profile = initial_params;
  var d = new Date();
  lead_profile["start time"] = d.getTime();

  try {
    const host = getHost(lead_profile["raw url"]);
    lead_profile["host"] = host;

    const url = "http://www." + host;
    const valid_url = await fetchStatus(url);
    lead_profile["valid url"] = valid_url.split(/[?#]/)[0];
    lead_profile["prev links"] = [lead_profile["valid url"]]
    // lead_profile["num links processed"] = 1

    // get entire page html as text
    const raw_html = await fetchHtml(url);
    // parse
    const parsed_html = await parseHtml(raw_html);

    // lead_profile["all text"] = parsed_html["page text"];
    // lead_profile["all links"] = parsed_html["page links"];

    // initialize word counts to 0
    var word_count = {};
    lead_profile["words"].forEach(word => {
      word_count[word] = 0;
    })
    
    // analyze text
    lead_profile["word count"] = await searchText(parsed_html["page text"], word_count);
    // const sorted_words = sortProperties(lead_profile["word_count"]);
    // console.log('sorted_words', sorted_words)
    // lead_profile["sorted_words"] = sorted_words;

    // todo -> analyze links
    processed_links = await processLinks(parsed_html["page links"], lead_profile["valid url"]);
    // console.log('processed_links', processed_links);

    // dedupe and assign
    lead_profile["emails"] = processed_links["emails"];
    lead_profile["phones"] = processed_links["phones"];
    lead_profile["social media"] = processed_links["social media"];
    lead_profile["next links"] = processed_links["next links"];

    // process layers
    if (lead_profile["depth"] > 0) {
      for (layer = 1; layer < lead_profile["depth"]+1; layer++) {
        console.log((`layer: ${layer} / ${lead_profile["depth"]}`));
        lead_profile = await deepProfiler(lead_profile);
      }
    };

    lead_profile["emails"] = Array.from(new Set(lead_profile["emails"]));
    lead_profile["phones"] = Array.from(new Set(lead_profile["phones"]));
    lead_profile["social media"] = Array.from(new Set(lead_profile["social media"]));

    // console.log('next links', lead_profile["next links"]);
    lead_profile["num links"] = lead_profile["prev links"].length

    var f = new Date();
    duration = f.getTime() - lead_profile["start time"]
    lead_profile["duration"] = duration/1000;
    
    return lead_profile;
  
  } catch (e) {
    console.error(e);
    lead_profile['status'] = 'Invalid URL';

    return lead_profile;
  }
}

// go deeper -> profile each layer
async function deepProfiler(lead_profile) {
  // iterate for each layer (of depth)
  var next_links = lead_profile["next links"]
  var new_text = []
  var new_links = []
  var prev_links = []

  for (next_link of next_links) {
    if (lead_profile["prev links"].includes(next_link)) {
      console.log('Link in prev links, skipping: ', next_link)
      continue;
    } else {
      lead_profile["prev links"].push(next_link)
      try {
        const new_html = await fetchHtml(next_link)
        const parsed_html = await parseHtml(new_html)

        new_text.push(parsed_html["page text"])
        new_links.push(...parsed_html["page links"])

      } catch (err) {
        console.error(err)
        throw err;
      }
    }
  }
  var all_text = new_text.join(' ');
  lead_profile["word count"] = await searchText(all_text, lead_profile["word count"])

  new_links = Array.from(new Set(new_links));
  var processed_links = await processLinks(new_links, lead_profile["valid url"]);
  // console.log('processed_links', processed_links);

  lead_profile["emails"].push(...processed_links["emails"]);
  lead_profile["phones"].push(...processed_links["phones"]);
  lead_profile["social media"].push(...processed_links["social media"]);
  lead_profile["next links"] = processed_links["next links"];

  // console.log(lead_profile["next links"])

  // console.log('new_text: ', new_text);
  // console.log('new_links: ', new_links);
  return lead_profile;
}

// get emails, phone numbers, social media, and next links from list
async function processLinks(link_list, valid_url) {
  social_media_sites = ['www.angieslist', 'www.buildzoom', 'www.facebook', 'www.flickr', 'www.homeadvisor', 'www.houzz', 'www.instagram', 'www.linkedin', 'www.manta', 'www.pinterest', 'www.porch', 'www.thumbtack', 'www.twitter', 'www.vimeo', 'www.yellowpages', 'www.yelp', 'www.youtube']         

  // console.log('processing links: ', link_list);
  var social_media = []
  var emails = []
  var phones = []
  var next_links = []

  try {
    for (link of link_list) {
      if (link === undefined) {
        console.log('link undefined, skipping')
        continue;
      }
      else if (link.startsWith('/')) {
        next_links.push(valid_url.concat(link.replace('/', '')))
        continue;
      }
      else if (link.includes(valid_url)) {
        next_links.push(link)
        continue;
      }
      else if (link.startsWith('mailto:')) {
        emails.push(link.replace("mailto:", ""))
        continue;
      }
      else if (link.startsWith('tel:')) {
        phones.push(link.replace("tel:", ""))
        continue;
      }
      // todo -> better method for list comprehension?
      else {
        for (media of social_media_sites) {
          if (link.includes(media)) {
            social_media.push(link)
            continue;
          }
        }
      }
    }
    // dedupe and set to obj
    var link_obj = {}
    link_obj["social media"] = Array.from(new Set(social_media))
    link_obj["emails"] = Array.from(new Set(emails))
    link_obj["phones"] = Array.from(new Set(phones))
    link_obj["next links"] = Array.from(new Set(next_links))
    
    // console.log('link_obj: ', link_obj);
    return link_obj;
  } catch (err) {
    console.error(err)
    throw err;
  }
}

// counts word occurrence from text
async function searchText(source, word_count) {
  try {
    for (var word in word_count) {
      const n = source.match(new RegExp(word, 'gi'))
      if (n === null) {
        word_count[word] += 0;
      } else {
        word_count[word] += n.length;
      }
    };

    // todo -> email regex
    // var new_emails = extractEmails(source);
    // console.log('new_emails', new_emails);

    return word_count
  } catch (err) {
    throw err;
  }
}

// email regex
// var text = 'sdabhikagathara@rediffmail.com, "assdsdf" <dsfassdfhsdfarkal@gmail.com>, "rodnsdfald ferdfnson" <rfernsdfson@gmal.com>, "Affdmdol Gondfgale" <gyfanamosl@gmail.com>, "truform techno" <pidfpinfg@truformdftechnoproducts.com>, "NiTsdfeSh ThIdfsKaRe" <nthfsskare@ysahoo.in>, "akasdfsh kasdfstla" <akashkatsdfsa@yahsdfsfoo.in>, "Bisdsdfamal Prakaasdsh" <bimsdaalprakash@live.com>,; "milisdfsfnd ansdfasdfnsftwar" <dfdmilifsd.ensfdfcogndfdfatia@gmail.com>';    
// todo -> make this better
function extractEmails(source) {
  const regex = /([a-zA-Z0-9._+-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi
  return source.match(regex)
}

// sort dictionary by values -> returns 2d array
  // const sorted_words = await sortProperties(word_count);
  // lead_profile["sorted_words"] = sorted_words;
function sortProperties(obj) {
  // convert object into array
  var sortable=[];
  for (var key in obj)
    if (obj.hasOwnProperty(key))
      sortable.push([key, obj[key]]); // each item is an array in format [key, value]
  
  // sort items by value
  sortable.sort((a, b) => {
    return a[1]-b[1]; // compare numbers
  });
  sortable.reverse();
  // sortable = sortable.filter(val => val[1] !== 0)
  // console.log('sortable', sortable)

  return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}

// format url -> example.com 
function getHost(url) {
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

// return url if valid
async function fetchStatus(url) {
  try {
    const res = await fetch(url, FETCH_OPTIONS)

    if (res.status === 200) {
      return res.url;
    }

  } catch (err) {
    console.error(err.message)
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
  var page_text = $.text().trim().replace(/\s+/g, " ");

  // console.log($('a').attr('href'))
  links = $('div a');
  $(links).each((i, link) => {
    page_links.push($(link).attr('href'));
  });
  // console.log('page text: ', page_text);
  // console.log('page links: ', page_links);

  return {"page text": page_text, "page links": page_links}
}


module.exports = { paramInit, leadInit, deepProfiler, processLinks, searchText, extractEmails, sortProperties, getHost, fetchStatus, fetchHtml, parseHtml };