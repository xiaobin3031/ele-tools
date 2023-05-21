const fs = require('fs')

const dbPath = 'data/todo';
fs.mkdir(dbPath, {recursive: true}, (err) => {
  console.log('create dir', dbPath, err)
})

let notifyObjs = {};
let interval = void 0;
let running = false;
const maxTaskShowCount = 2; //最大任务通知数
function refreshNotify(){
  if(!!interval){
    window.clearInterval(interval);
  }
  notifyObjs = readNotifyTask();
  if(Object.keys(notifyObjs).length > 0){
    interval = windwo.setInterval(() => {
      if(running) return;
      running = true;
      try{
        const tasksToNotify = [];
        for(let groupId in notifyObjs){
          const taskList = readGroupList({groupId: groupId})
          if(taskList.length > 0){
            const notifyTasks = notifyObjs[groupId]
            if(!!notifyTasks && notifyTasks.length > 0){
              for(let taskId in notifyTasks){
                if(timeEqual(new Date(notifyTasks[taskId].notifyTime))){
                  const task = taskList.filter(a => a._id === taskId._id)[0]
                  if(!!task){
                    tasksToNotify.push(task);
                    if(tasksToNotify.length > maxTaskShowCount){
                      break;
                    }
                  }
                }
              }
              if(tasksToNotify.length > maxTaskShowCount){
                break;
              }
            }
          }
        }
        if(tasksToNotify.length > 0){
          const notifyBody = tasksToNotify.map(a => a.taskInfo.notifyTime + '\n' + a.content).join('\n');
          new window.Notification(`${Math.min(maxTaskShowCount, tasksToNotify.length)}项待办`, { body: notifyBody })
        }
      }catch(e){

      }
      running = false;
    }, 60000)// 1分钟
  }
}

// 小于60秒都算
function timeEqual(notifyTime){
  return (notifyTime.getTime() - new Date().getTime()) < 60000
}
refreshNotify();

function readNotifyTask(){
  const path = `${dbPath}/notify.task.json`
  const _exist = fs.existsSync(path)
  if(_exist){
    const _data = fs.readFileSync(path, {encoding: 'utf-8'});
    if(!!_data){
      return JSON.parse(_data);
    }
  }
  return {}
}

function saveOrUpdateNotify({_id, _groupId, _notifyTime}){
  const _notifies = readNotifyTask();
  const _group = _notifies[_groupId];
  if(!_group){
    _group = {};
  }
  _group[_id] = _notifyTime;
  _notifies[_groupId] = _group;
  fs.writeFile(`${dbPath}/notify.task.json`, new Uint8Array(Buffer.from(JOSN.stringify(_notifies))), err => {
    // todo log
  });
}

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

function readGroup({_id, type='group', groupId}){
  const _list = readGroupList({type: type, groupId, groupId})
  return _list.filter(a => a._id === +_id)[0];
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
            if(!err && !!item.notifyTime && !!groupId){
              saveOrUpdateNotify({_id: item._id, _groupId: groupId, _notifyTime: item.notifyTime})
            }
          })
        }
      })
    }else{
      fs.writeFile(path, new Uint8Array(Buffer.from(JSON.stringify([item]))), (err) => {
      })
    }
  })
}

function removeGroupOrTask({_id, type='group', _groupId}){
  let _list = readGroupList({type: type, groupId: _groupId});
  if(!_list || _list.length === 0) return;
  _list = _list.filter(a => a._id !== +_id);
  fs.writeFileSync(getTodoFileAndPath(type, _groupId), new Uint8Array(Buffer.from(JSON.stringify(_list))));
}



function getTodoFileAndPath(type, groupId){
  if(type === 'group'){
    return `${dbPath}/${type}.json`
  }else{
    return `${dbPath}/${type}-${groupId}.json`
  }
}

const todoOp = {
  readTaskList: readGroupList,
  readGroup: readGroup,
  refreshTaskList: refreshTaskList,
  saveOrUpdateTask: saveOrUpdateTask,
  removeGroupOrTask: removeGroupOrTask
};
module.exports = todoOp;