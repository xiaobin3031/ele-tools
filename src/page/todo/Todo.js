import { useEffect, useState } from 'react';
import Icon from '../../component/Icon';
import './todo.css'
import globalId from '../../util/globalId';

function TaskGroup({_list = [], _selectGroup}){

  const [groupList, setGroupList] = useState(_list.concat());

  function createNewGroup(event){
    if(event.keyCode === 13){
      // enter
      const newGroup = event.target.value;
      if(!newGroup){
        return;
      }
      const newItem = {_id: globalId(), name: newGroup};
      setGroupList([
        ...groupList,
        newItem
      ])
      event.target.value = '';
      _selectGroup(newItem)
      window.fileOp.saveOrUpdateTask({
        item: newItem,
        type: 'group'
      })
    }
  }
  return (
    <div className="task-group">
      <div className='task-group-list'>
        {
          groupList.length > 0 &&
            groupList.map(a => {
              return (
                <div key={a._id} className='item' onClick={() => _selectGroup(a)}>
                  <Icon iconType='menu' />
                  <span>{a.name}</span>
                </div>
              )
            })
        }
      </div>
      <div className='task-group-create'>
        <input name='listName' placeholder='新增列表' onKeyDown={createNewGroup}/>
      </div>
      <hr/>
    </div>
  )
}

function TaskList({_list = [], _groupId, _groupName}){

  const [todoList, setTodoList] = useState([])
  useEffect(() => {
    // 直接用useState无法生效，只能用这种方式
    setTodoList(window.fileOp.readTask({type: 'task', groupId: _groupId}));
  }, [_list]);

  function createNewTask(event){
    if(event.keyCode === 13){
      if(!_groupId){
        return;
      }
      const taskContent = event.target.value;
      if(!taskContent){
        return;
      }
      const newItem = {_id: globalId(), content: taskContent, pId: _groupId};
      setTodoList([
        ...todoList,
        newItem
      ])
      event.target.value = '';
      window.fileOp.saveOrUpdateTask({
        item: newItem,
        type: 'task',
        groupId: _groupId
      })
    }
  }

  let groupName;
  if(!!_groupName && !!_groupId){
    groupName = `新增[${_groupName}]的任务`
  }else{
    groupName = '未选择列表';
  }

  function taskComplete(event, item){
    item.complete = !item.complete;
    setTodoList(todoList.map(a => a._id === item._id ? item : a))
    if(item.complete){
      event.target.classList.add('complete')
    }else{
      event.target.classList.remove('complete')
    }
  }

  return (
    <div className="task-list">
      <div className='task-list-list'>
          {
            todoList.length > 0 &&
              todoList.map(a => {
                return (
                  <div key={a._id} className='item'>
                    <div className='checkbox' onClick={(event) => taskComplete(event, a)}></div>
                    <span>{a.content}</span>
                  </div>
                )
              })
          }
        </div>
        <div className='task-list-create'>
          <input name='content' placeholder={groupName} onKeyDown={createNewTask} disabled={!_groupName || !_groupId}/>
        </div>
    </div>
  )
}

function TaskDetail({}){

  return (
    <div className="task-detail">

    </div>
  )
}

export default function Todo({}){

  const [selectGroup, setSelectGroup] = useState({});
  const [taskList, setTaskList] = useState([]);
  const groupList = window.fileOp.readTask({type: 'group'});

  function clickGroup(item){
    setSelectGroup({
      ...selectGroup,
      _id: item._id,
      name: item.name
    })
    const _list = window.fileOp.readTask({type: 'task', groupId: item._id})
    setTaskList([..._list]);
  }

  return (
    <div className="x-todo">
      <TaskGroup _selectGroup={clickGroup} _list={groupList}/>
      <TaskList _groupId={selectGroup._id} _groupName={selectGroup.name} _list={taskList}/>
      {/* <TaskDetail /> */}
    </div>
  )
}