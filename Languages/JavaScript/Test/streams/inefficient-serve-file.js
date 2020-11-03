// inefficient memory

const fs = require('fs');
const server = require('http').createServer();
const path = require('path');

const file_path = path.join(__dirname, 'leads_test.csv');

server.on('request', (req, res) => {
  fs.readFile(file_path, (err, data) => {
    if (err) throw err;
  
    res.end(data);
  });
});

server.listen(8000);