const fs = require('fs')
const path = require('path')

function read(type){
  const data = fs.readFileSync(getPath(type), {encoding: 'utf-8'});
  if(!data) return [];
  return JSON.parse(data.toString())
}

function sync(type, list){
  fs.writeFile(getPath(type), JSON.stringify(list), {encoding: 'utf-8'})
}

function getPath(type){
  return path.join(__dirName, type)
}

module.exports = {
  read: read,
  sync: sync
}