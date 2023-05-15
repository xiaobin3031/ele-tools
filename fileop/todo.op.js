const fs = require('fs')
const path = require('path')

const dbPath = 'data/todo';

fs.mkdir(dbPath, {recursive: true}, (err) => {
  console.log('create dir', dbPath, err)
})

function readGroupList({type = 'task', groupId}){
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

function readGroup({groupId, name}){

}

function refreshTaskList({list, groupId}){
  const path = getTodoFileAndPath('task', groupId);
  fs.writeFile(path, new Uint8Array(Buffer.from(JSON.stringify(list))), err => {
    // log
  });
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
function getTodoFileAndPath(type, groupId){
  if(type === 'group'){
    return `${dbPath}/${type}.json`
  }else{
    return `${dbPath}/${type}-${groupId}.json`
  }
}

const todoOp = {
  readGroupList: readGroupList,
  readGroup: readGroup,
  refreshTaskList: refreshTaskList,
  saveOrUpdateTask: saveOrUpdateTask,
  dbPath: dbPath
};
module.exports = todoOp;