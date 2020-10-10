import fetch from 'node-fetch';


const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
const arr = [1, 2, 3];
const urls = ['https://www.cesasdfasdfglobal.com', 'https://www.google.com', 'http://www.j4development.com', 'http://www.brarchitects.com', 'http://www.cesglobal.com', 'https://www.google.com', 'http://www.j4development.com', 'http://www.cesglobal.com', 'https://www.google.com', 'http://www.j4development.com', 'http://www.cesglobal.com', 'https://www.google.com', 'http://www.j4development.com', 'http://www.cesglobal.com', 'https://www.google.com', 'http://www.j4development.com', 'http://www.cesglobal.com', 'https://www.google.com', 'http://www.j4development.com', 'http://www.cesglobal.com', 'https://www.google.com', 'http://www.j4development.com', 'http://www.cesglobal.com', 'https://www.google.com', 'http://www.j4development.com', 'http://www.cesglobal.com', 'https://www.google.com', 'http://www.j4development.com', 'http://www.cesglobal.com', 'https://www.google.com', 'http://www.j4development.com'];

// urls.forEach(url => {
//   console.log(url);
//   }
// )

async function asyncForEach(array, cb) {
  for (let index = 0; index < array.length; index++) {
    await cb(array[index], index, array);
  }
}

async function start(arr) {
  await asyncForEach(arr, async (num) => {
    
    console.log(num);
    await waitFor(500);
  });
  console.log('Done');
}

// start(arr);


async function getStatus(urls) {
  await asyncForEach(urls, async (url) => {
    console.log(url)
    var get_url = await fetch(url)
    console.log(url, get_url.status)
    await waitFor(1000);
  });
}

// getStatus(urls);

async function getStatusBetter(urls) {
  await Promise.all(urls.map(async (url) => {
    const url_res = await fetch(url)
    console.log(url, url_res.status)
  }));
}

getStatusBetter(urls);


