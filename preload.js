const { contextBridge } = require('electron')
// const electron = require('electron')
const fs = require('fs')
const path = require('path')
const todoOp = require('./fileop/todo.op.js')
const posautoOp = require('./fileop/posauto.db.js')
const posRemote = require('./remote/pos/posAutoTest.js')
const setting = require('./fileop/setting.db.js')
const { execSync } = require('child_process')

const dirPrefix = 'data/';
const dirObj = {
  'httpReq': dirPrefix + 'httpReq',
  'calendarTodo': dirPrefix + 'calendar/todo'
}

checkAndCreateDir();

// 检查文件夹是否存在
function checkAndCreateDir(){
  Object.keys(dirObj)
    .forEach(key => {
      fs.mkdir(dirObj[key], {recursive: true}, (err) => {
        console.log('create dir', dirObj[key], err)
      })
    })
}
/**
 * 
 * @param {
 *  path: '',
 *  content: ''
 * } _contents 
 */
function saveHttpReq(_contents){
  fs.writeFile(dirObj.httpReq + '/reqList.json', new Uint8Array(Buffer.from(JSON.stringify(_contents))), (err) => {
    //todo log
  })
}
let initHttpReq = [];
fs.readFile(dirObj.httpReq + '/reqList.json', (err, _data) => {
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
    fs.readFile(dirObj.calendarTodo + `/${year}-${month}.json`, (err, _data) => {
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
    fs.exists(dirObj.calendarTodo + `/${year}-${month}.json`, (exist) => {
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
    fs.writeFile(dirObj.calendarTodo + `/${year}-${month}.json`, new Uint8Array(Buffer.from(JSON.stringify(_list))), (err) => {
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

contextBridge.exposeInMainWorld('todoDb', todoOp);
contextBridge.exposeInMainWorld('posDb', posautoOp);
contextBridge.exposeInMainWorld('posRemote', posRemote)
contextBridge.exposeInMainWorld('setting', setting)



function deviceList(){
  //todo 这里会获取不到adb命令，需要获取绝对路径
  const adbPath = "/Users/lixiaolin/Library/Android/sdk/platform-tools"
  const adb = `${adbPath}/adb`
  const data = execCmdSync(`${adb} devices -l`);
  // BH9027W372             device usb:337903616X product:G8232 model:G8232 device:G8232 transport_id:3
  // 192.168.31.151:5555    device                product:G8232 model:G8232 device:G8232 transport_id:6
  const clientString = data.toString();
  const clients = clientString.split('\n');
  const clientArray = []
  if(clients.length > 1){
    for(let i = 1;i<clients.length; i++){
      if(!clients[i]) continue;
      const infoString = clients[i].split(/\s+/g); 
      const info = {};
      info.clientId = infoString[0];
      for(let j=1;j<infoString.length;j++){
        if(infoString[j].indexOf(':') > -1){
          const infos = infoString[j].split(':')
          info[infos[0]] = infos[1];
        }
      }
      clientArray.push(info);
    }
  }
  return clientArray;
}

function execCmdSync(cmd, ops = {}){
  return execSync(cmd, ops);
}

contextBridge.exposeInMainWorld('adb', {
  deviceList: deviceList
})