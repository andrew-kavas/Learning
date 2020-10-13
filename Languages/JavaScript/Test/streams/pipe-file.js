//https://www.freecodecamp.org/news/node-js-streams-everything-you-need-to-know-c9141306be93/
// access in cli with
// curl localhost:8000

const fs = require('fs');
const server = require('http').createServer();
const path = require('path');


const file_path = path.join(__dirname, 'leads_test.csv');

// efficient method!
server.on('request', (req, res) => {
  const src = fs.createReadStream(file_path);
  src.pipe(res);
});

server.listen(8000);