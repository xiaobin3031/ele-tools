const { contextBridge } = require('electron')
const fs = require('fs')

const dirPrefix = 'data/';
const dirList = [dirPrefix + 'httpReq'];

checkAndCreateDir();

// 检查文件夹是否存在
function checkAndCreateDir(){
  dirList.forEach(a => fs.mkdir(a, {recursive: true}, (err) => {
    console.log('create dir', a, err)
  }));
}
/**
 * 
 * @param {
 *  path: '',
 *  content: ''
 * } _contents 
 */
function saveHttpReq(_contents){
  fs.writeFile(dirList[0] + '/reqList.json', new Uint8Array(Buffer.from(JSON.stringify(_contents))), (err) => {
    //todo log
  })
}
let initHttpReq = [];
fs.readFile(dirList[0] + '/reqList.json', (err, _data) => {
  if(err){
    return;
  }else{
    initHttpReq = JSON.parse(_data.toString());
  }
})
function readHttpReq(){
  return initHttpReq;
}

contextBridge.exposeInMainWorld('fileOp', {
  saveHttpReq: saveHttpReq,
  readHttpReq: readHttpReq
});