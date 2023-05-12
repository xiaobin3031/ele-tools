const { contextBridge } = require('electron')
const { readFile, exists, writeFile } = require('node:fs/promises')
const fs = require('fs')
const path = require('path')

const dirPrefix = 'data/';
const dirObj = {
  'httpReq': dirPrefix + 'httpReq',
  'calendarTodo': dirPrefix + 'calendar/todo',
  'todo': dirPrefix + 'todo'
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

function saveOrUpdateTask({item, type = 'group', groupId}){
  const path = getTodoFileAndPath(type, groupId);
  fs.exists(path, _exist => {
    if(_exist){
      fs.readFile(path, {encoding: 'utf-8'}, (err, _data) => {
        if(err){
          return;
        }
        if(!_data){
          _data = [item];
        }else{
          _data = JSON.parse(_data);
          let pushed = false;
          for(let i in _data){
            if(_data[i]._id === item._id){
              _data[i] = item;
              pushed = true;
              break;
            }
          }
          if(!pushed){
            _data.push(item);
          }
          fs.writeFile(path, new Uint8Array(Buffer.from(JSON.stringify(_data))), (err) => {
          })
        }
      })
    }else{
      fs.writeFile(path, new Uint8Array(Buffer.from(JSON.stringify([item]))), (err) => {
      })
    }
  })
}

function refreshTaskList({list, groupId}){
  const path = getTodoFileAndPath('task', groupId);
  fs.writeFile(path, new Uint8Array(Buffer.from(JSON.stringify(list))), err => {
    // log
  });
}

function readTaskList({type = 'group', groupId}){
  if(!groupId && type !== 'group'){
    return [];
  }
  const path = getTodoFileAndPath(type, groupId);
  if(fs.existsSync(path)){
    const _data = fs.readFileSync(path, {encoding: 'utf-8'});
    if(!!_data){
      const list = JSON.parse(_data);
      return list.filter(a => !a.deleted);
    }
  }
  return [];
}
function getTodoFileAndPath(type, groupId){
  if(type === 'group'){
    return path.join(__dirname, `${dirObj.todo}/${type}.json`)
  }else{
    return path.join(__dirname, `${dirObj.todo}/${type}-${groupId}.json`)
  }
}

contextBridge.exposeInMainWorld('fileOp', {
  saveHttpReq: saveHttpReq,
  readHttpReq: readHttpReq,
  readCalendarTodo: readCalendarTodo,
  updateOrSaveCalendarTodo: updateOrSaveCalendarTodo,
  saveOrUpdateTask: saveOrUpdateTask,
  readTaskList: readTaskList,
  refreshTaskList: refreshTaskList
});