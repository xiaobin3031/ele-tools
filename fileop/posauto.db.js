const fs = require('fs')

const dbPath = 'data/posauto';
fs.mkdir(dbPath, {recursive: true}, (err) => {
  console.log('create dir', dbPath, err)
})