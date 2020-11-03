const fs = require('fs');
const zlib = require('zlib');
// const file = process.argv[2];
const path = require('path');


const file_path = path.join(__dirname, 'big.file');

const { Transform } = require('stream');

const reportProgress = new Transform({
  transform(chunk, encoding, callback) {
    process.stdout.write('.');
    callback(null, chunk);
  }
});

fs.createReadStream(file_path)
  .pipe(zlib.createGzip())
  .pipe(reportProgress)
  .pipe(fs.createWriteStream(file_path + '.zz'))
  .on('finish', () => console.log('Done'));