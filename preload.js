const { contextBridge } = require('electron')
const fs = require('fs')

const dirPrefix = 'data/';
const dirList = [dirPrefix + 'httpReq', dirPrefix + 'calendar/todo'];

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
function readCalendarTodo(year, month){
  return new Promise((resolve, reject) => {
    fs.readFile(dirList[1] + `/${year}-${month}.json`, (err, _data) => {
      if(err){
        // todo log
        return;
      }else{
        if(!_data){
          resolve([]);
        }else{
          resolve(JSON.parse(_data.toString()))
        }
      }
    })
  })
}
function updateOrSaveCalendarTodo(item, year, month){
  return new Promise((resolve, reject) => {
    fs.exists(dirList[1] + `/${year}-${month}.json`, (exist) => {
      if(exist){
        readCalendarTodo(year, month).then(_list => {
          let exist = false;
          for(let i in _list){
            if(_list[i]._id === item._id){
              _list[i] = {...item};
              exist = true;
              break;
            }
          }
          if(!exist){
            _list.push(item);
          }
          writeCalendarTodo(_list, year, month).then(_res => resolve(_res)).catch(_err => reject(_err));
        }).catch(_err => reject(_err));
      }else{
        writeCalendarTodo([item], year, month).then(_res => resolve(_res)).catch(_err => reject(_err));
      }
    })
  });
}
function writeCalendarTodo(_list, year, month){
  return new Promise((resolve, reject) => {
    fs.writeFile(dirList[1] + `/${year}-${month}.json`, new Uint8Array(Buffer.from(JSON.stringify(_list))), (err) => {
      if(err){
        reject(err);
      }else{
        resolve('');
      }
    })
  })
}
contextBridge.exposeInMainWorld('fileOp', {
  saveHttpReq: saveHttpReq,
  readHttpReq: readHttpReq,
  readCalendarTodo: readCalendarTodo,
  updateOrSaveCalendarTodo: updateOrSaveCalendarTodo
});