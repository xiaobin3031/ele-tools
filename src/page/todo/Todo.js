import { useEffect, useRef, useState } from 'react';
import Icon from '../../component/Icon';
import './todo.css'
import globalId from '../../util/globalId';
import DateTimePicker from '../../component/DateTimePicker';
import Input from '../../component/Input'
import Container from '../../component/Container';
import SvgIcon from '../../component/SvgIcon';
import Row from '../../component/Row';

function prepareAddGroup(event){
  let $target;
  if(event.target.tagName === 'INPUT'){
    $target = event.target.previousElementSibling;
  }else{
    $target = event.currentTarget;
    event.currentTarget.nextElementSibling.focus();
  }
  $target.style.display = 'none';
}

function finishAddGroup(event){
  let $target;
  if(event.target.tagName === 'INPUT'){
    $target = event.target.previousElementSibling;
  }else{
    $target = event.target;
  }
  $target.style.display = 'inline';
}

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
      event.target.blur();
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
        <span className='flex'>
          <SvgIcon iconType='add' onClick={prepareAddGroup}/>
          <input className='input' placeholder='新建清单' 
            onKeyDown={createNewGroup}
            onFocus={prepareAddGroup} 
            onBlur={finishAddGroup}/>
        </span>
     </div>
    </div>
  )
}

function TaskList({_list = [], _groupId, _groupName, _clickTask}){

  const [todoList, setTodoList] = useState([])
  useEffect(() => {
    // 直接用useState无法生效，只能用这种方式
    setTodoList(window.fileOp.readTaskList({type: 'task', groupId: _groupId}));
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
      event.target.blur();
    }
  }

  let groupName;
  if(!!_groupName && !!_groupId){
    groupName = `新增[${_groupName}]的任务`
  }else{
    groupName = '未选择列表';
  }

  function taskComplete(event, item){
    event.stopPropagation();
    item.complete = !item.complete;
    setTodoList(todoList.map(a => a._id === item._id ? item : a))
    if(item.complete){
      event.target.classList.add('complete')
    }else{
      event.target.classList.remove('complete')
    }
  }

  function clickTask(event, item){
    // todo 修改点击样式
    _clickTask(item);
  }

  return (
    <div className="task-list">
      <div className='task-list-list'>
        {
          todoList.length > 0 &&
            todoList.map(a => {
              return (
                <div key={a._id} className='item' onClick={event => clickTask(event, a)}>
                  <div className='checkbox' onClick={(event) => taskComplete(event, a)}></div>
                  <span>{a.content}</span>
                </div>
              )
            })
        }
      </div>
      <div className='task-list-create'>
        <SvgIcon iconType='add' onClick={prepareAddGroup} style={{cursor: 'pointer'}}/>
        <input name='content' placeholder={groupName} 
          onKeyDown={createNewTask}
          onFocus={prepareAddGroup} 
          onBlur={finishAddGroup}/>
      </div>
    </div>
  )
}

function TaskDetail({_item, _saveOrUpdateTask}){

  const [taskInfo, setTaskInfo] = useState({});
  useEffect(() => {
    const _taskInfo = _item.taskInfo || {};
    setTaskInfo(_taskInfo);
  }, [_item])

  function subTaskComplete(event, item){
    event.stopPropagation();
    item.complete = !item.complete;
    const _taskInfo = {...taskInfo};
    _taskInfo.subTasks = _taskInfo.subTasks.map(a => a._id === item._id ? item : a);
    setTaskInfo(_taskInfo);
    if(item.complete){
      event.target.classList.add('complete')
    }else{
      event.target.classList.remove('complete')
    }
    updateTask({..._item, taskInfo: _taskInfo});
  }

  function createNewSubTask(event){
    if(event.keyCode === 13){
      const _val = event.target.value;
      if(!_val){
        return;
      }
      const _taskInfo = {...taskInfo}
      const _newItem = {_id: globalId(), content: _val}
      if(!_taskInfo.subTasks){
        _taskInfo.subTasks = [_newItem]
      }else{
        _taskInfo.subTasks.push(_newItem);
      }
      event.target.value = '';
      setTaskInfo(_taskInfo)
      updateTask({..._item, taskInfo: _taskInfo});
      event.target.blur();
    }
  }

  function updateTask(item){
    window.fileOp.saveOrUpdateTask({
      item: item, type: 'task', groupId: item.pId
    })
  }

  function taskInfoChange(event){

  }

  return (
    <div className="task-detail">
      <form disabled>
        <Row className='title'>
          {_item.content}
        </Row>
        <Row className='sub-task'>
          {
            !!taskInfo.subTasks && taskInfo.subTasks.length > 0 &&
              taskInfo.subTasks.map(a => {
                return (
                  <div className='sub-task-list flex' key={a._id}>
                    <div className='checkbox sm' onClick={event => subTaskComplete(event, a)}></div>
                    <span>{a.content}</span>
                  </div>
                )
              })
          }
          <div className='flex'>
            <SvgIcon iconType='add' onClick={prepareAddGroup}/>
            <input placeholder='添加子任务' 
              onKeyDown={createNewSubTask}
              onFocus={prepareAddGroup}
              onBlur={finishAddGroup}
              />
          </div>
        </Row>
        <Row className='dead-time'>
          <DateTimePicker defaultValue='2023-04-11'/>
        </Row>
        <Row className='description'>
          <Input 
            value={!taskInfo.description ? '' : taskInfo.description}
            multiline={1}
            rows={10}
            onChange={taskInfoChange}
            placeholder='请输入描述'
            style={{
              width: '90%',
              resize: 'none'
            }}
          />
        </Row>
      </form>
    </div>
  )
}

export default function Todo({}){

  const [selectGroup, setSelectGroup] = useState({});
  const [task, setTask] = useState({})
  const [taskList, setTaskList] = useState([]);
  const groupList = window.fileOp.readTaskList({type: 'group'});

  function clickGroup(item){
    setSelectGroup({
      ...selectGroup,
      _id: item._id,
      name: item.name
    })
    const _list = window.fileOp.readTaskList({type: 'task', groupId: item._id})
    setTaskList([..._list]);
  }

  function clickTask(item){
    setTask({...item})
  }

  return (
    <div className="x-todo">
      <div className="x-todo-container">
        <TaskGroup _selectGroup={clickGroup} _list={groupList}/>
        <TaskList _groupId={selectGroup._id} _groupName={selectGroup.name} _list={taskList} _clickTask={clickTask}/>
        <TaskDetail _item={task}/>
      </div>
    </div>
  )
}