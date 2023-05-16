import React, { useEffect, useRef, useState } from 'react';
import Icon from '../../component/Icon';
import './todo.css'
import globalId from '../../util/globalId';
import DateTimePicker from '../../component/DateTimePicker';
import Input from '../../component/Input'
import SvgIcon from '../../component/SvgIcon';
import Row from '../../component/Row';
import ReactDOM from 'react-dom/client';

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

function subPrepareAddGroup(event){
  let $target;
  if(event.target.tagName === 'INPUT'){
    $target = event.target.previousElementSibling;
  }else{
    $target = event.currentTarget;
    event.currentTarget.nextElementSibling.focus();
  }
  $target.style.opacity = 0;
}

function subFinishAddGroup(event){
  let $target;
  if(event.target.tagName === 'INPUT'){
    $target = event.target.previousElementSibling;
  }else{
    $target = event.target;
  }
  $target.style.opacity = 1;
}

function hideContextMenu(){
  document.getElementById('todo-context-menu').classList.remove('show')
}

function TaskGroup({_list = [], _selectGroup, _renameGroupId, _setGroupList}){
  const [groupList, setGroupList] = useState(_list.concat());

  const [renameGroupId, setRenameGroupId] = useState(-1)

  useEffect(() => {
    setRenameGroupId(_renameGroupId);
  }, [_renameGroupId])

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
      window.todoDb.saveOrUpdateTask({
        item: newItem,
        type: 'group'
      })
      event.target.blur();
    }
  }

  function selectGroup(event, item){
    event.stopPropagation();
    Array.from(event.currentTarget.parentElement.children)
      .filter(a => a.classList.contains("select")).forEach(a => a.classList.remove('select'))
    if(!event.currentTarget.classList.contains('select')){
      event.currentTarget.classList.add('select')
      _selectGroup(item);
    }
  }

  function changeGroupName(event, item){
    if(!event.target.value){
      return;
    }
    item.name = event.target.value;
    setGroupList(groupList.map(a => a._id === item._id ? item : a))
  }
  
  function saveToFile(event, item){
    if(event.keyCode === 13){
      window.todoDb.saveOrUpdateTask({item: item})
      setRenameGroupId(-1)
    }
  }

  return (
    <div className="task-group">
      <div className='task-group-list'>
        {
          groupList.length > 0 &&
            groupList.map(a => {
              return (
                <div groupid={a._id} key={a._id} className='group-item' onClick={event => selectGroup(event, a)}>
                  {
                    a._id === +renameGroupId && 
                      <Input value={a.name} onChange={event => changeGroupName(event, a)} onKeyDown={event => saveToFile(event, a)}/>
                  }
                  {
                    a._id !== +renameGroupId && 
                      <>
                        <Icon iconType='menu' />
                        <span>{a.name}</span>
                      </>
                  }
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

function TaskList({_list = [], _groupId, _groupName, _clickTask, _hideTaskDetail}){

  const [todoList, setTodoList] = useState([])
  const taskListsRef = useRef(null)
  useEffect(() => {
    // 直接用useState无法生效，只能用这种方式
    setTodoList(window.todoDb.readTaskList({type: 'task', groupId: _groupId}));
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
      window.todoDb.saveOrUpdateTask({
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
    event.stopPropagation();
    // todo 修改点击样式
    if(!event.currentTarget.classList.contains("select")){
      clearTaskSelectStatus();
      event.currentTarget.classList.add('select');
    }
    _clickTask(item);
  }

  function clearTaskSelectStatus(){
    Array.from(taskListsRef.current.children).filter(a => a.classList.contains('select')).forEach(a => a.classList.remove('select'))
  }

  function removeTask(event, item, index){
    event.stopPropagation();
    if(window.confirm(`是否删除该任务?`)){
      if(!item._id){
        todoList[index]._id = globalId();
        todoList[index].deleted = 1;
        window.todoDb.refreshTaskList({list: todoList, groupId: _groupId})
      }else{
        const _item = {...item, deleted: 1}
        window.todoDb.saveOrUpdateTask({
          item: _item, type: 'task', groupId: _groupId
        })
      }
      setTodoList(todoList.filter((a, i) => index !== i));
    }
  }

  function clickTaskList(){
    _hideTaskDetail();
    clearTaskSelectStatus();
  }

  return (
    <div className="task-list" onClick={clickTaskList}>
      <div className='task-list-list' ref={taskListsRef}>
        {
          todoList.length > 0 &&
            todoList.map((a, index) => {
              return (
                <div att={a._id} key={a._id} className='item' onClick={event => clickTask(event, a)}>
                  <div className='checkbox' onClick={(event) => taskComplete(event, a)}></div>
                  <span>{a.content}</span>
                  {
                    !a.complete && <SvgIcon iconType='ashbin' color='rgba(255, 127, 88, 0.8)' onClick={event => removeTask(event, a, index)} className='remove'/>
                  }
                </div>
              )
            })
        }
      </div>
      <div className='task-list-create'>
        <SvgIcon iconType='add' onClick={prepareAddGroup} style={{cursor: 'pointer'}}/>
        <input name='content' placeholder="添加任务" 
          onKeyDown={createNewTask}
          onFocus={prepareAddGroup} 
          onBlur={finishAddGroup}/>
      </div>
    </div>
  )
}

function TaskDetail({_item, _saveOrUpdateTask}){

  const [task, setTask] = useState(() => {
    let item = {..._item}
    if(!item.taskInfo){
      item.taskInfo = {};
    }
    if(!item.taskInfo.subTasks){
      item.taskInfo.subTasks = [];
    }
    return item;
  });

  function subTaskComplete(event, item){
    event.stopPropagation();
    item.complete = !item.complete;
    task.taskInfo.subTasks = task.taskInfo.subTasks.map(a => a._id === item._id ? item : a);
    if(item.complete){
      event.target.classList.add('complete')
    }else{
      event.target.classList.remove('complete')
    }
    updateTask({...task});
  }

  function createNewSubTask(event){
    if(event.keyCode === 13){
      const _val = event.target.value;
      if(!_val){
        return;
      }
      const _newItem = {_id: globalId(), content: _val}
      task.taskInfo.subTasks.push(_newItem);
      event.target.value = '';
      updateTask({...task});
      event.target.blur();
    }
  }

  function updateTask(item){
    setTask(item)
    window.todoDb.saveOrUpdateTask({
      item: item, type: 'task', groupId: item.pId
    })
  }

  function taskInfoChange(event){
    const _task = {...task}
    _task.taskInfo[event.target.name] = event.target.value;
    updateTask(_task);
  }

  function taskChange(event){
    setTask({
      ...task, 
      [event.target.name]: event.target.value
    })
  }

  function updateTaskInfo(event){
    if(event.type === 'blur'){
      _saveOrUpdateTask(task);
      console.log('blur');
    }else if(event.type === 'keydown' && event.keyCode === 13){
      _saveOrUpdateTask(task);
      event.target.blur();
    }
  }

  return (
    <div className="task-detail">
      <form disabled>
        <Row className='title'>
          <Input
            borderclear={1}
            value={!!task.content ? task.content: ''}
            name='content'
            onChange={taskChange}
            onKeyDown={updateTaskInfo}
            onBlur={updateTaskInfo}
            style={{
              width: '80%'
            }}
           />
        </Row>
        <Row className='sub-task'>
          {
            !!task.taskInfo.subTasks && task.taskInfo.subTasks.length > 0 &&
              task.taskInfo.subTasks.map(a => {
                return (
                  <Row className='sub-task-list flex' key={a._id}>
                    <div className='checkbox sm' onClick={event => subTaskComplete(event, a)}></div>
                    <span>{a.content}</span>
                  </Row>
                )
              })
          }
          <Row className='flex'>
            <SvgIcon iconType='add' onClick={subPrepareAddGroup}/>
            <input placeholder='添加子任务' 
              onKeyDown={createNewSubTask}
              onFocus={subPrepareAddGroup}
              onBlur={subFinishAddGroup}
              />
          </Row>
        </Row>
        <Row className='dead-time'>
          <SvgIcon iconType='notification'/>
          <DateTimePicker placeholder='提醒我' borderclear={1}/>
        </Row>
        <Row className='description'>
          <Input 
            value={!task.taskInfo.description ? '' : task.taskInfo.description}
            multiline={1}
            borderclear={1}
            rows={10}
            onChange={taskInfoChange}
            name="description"
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

function GroupListContextMenu({_renameGroup, _removeGroup}){

  function renameGroup(event){
    const groupId = document.getElementById('todo-context-menu')?.getAttribute('groupid');
    if(!groupId){
      return;
    }
    _renameGroup(groupId);
    hideContextMenu();
  }

  function removeGroup(event){
    const groupId = document.getElementById('todo-context-menu')?.getAttribute('groupid');
    if(!groupId){
      return;
    }
    if(window.confirm('是否删除')){
      _removeGroup(groupId)
      hideContextMenu();
    }
  }

  return (
    <div>
      <ul>
        <li onClick={renameGroup} className='pointer'>
          <SvgIcon iconType='pen'>
            <span style={{marginLeft: '5px'}}>重命名</span>
          </SvgIcon>
        </li>
        <li onClick={removeGroup} className='pointer'>
          <SvgIcon iconType='ashbin' color='rgba(255, 127, 88, 0.8)'>
            <span style={{
              color: 'var(--color-danger)',
              marginLeft: '5px'
            }}>删除</span>
          </SvgIcon>
        </li>
      </ul>
    </div>
  )
}

export default function Todo({}){

  const [selectGroup, setSelectGroup] = useState({});
  const [task, setTask] = useState({})
  const [taskList, setTaskList] = useState([]);
  const taskDetailRef = useRef(null);
  const [groupList, setGroupList] = useState(window.todoDb.readTaskList({type: 'group'}));
  const [renameGroupId, setRenameGroupId] = useState(-1);

  useEffect(() => {
    const contextMenuClick = (event) => {
      event.stopPropagation();
      let $target = event.target;
      if($target.tagName !== 'DIV' || !$target.classList.contains('group-item')){
        $target = $target.parentElement;
      }
      if($target.tagName !== 'DIV' || !$target.classList.contains('group-item')){
        // 不是目标
        return;
      }
      const groupId = $target.getAttribute('groupid');

      let $todoContextMenu = document.getElementById('todo-context-menu');
      if(!$todoContextMenu){
        $todoContextMenu = document.createElement('div');
        $todoContextMenu.id = 'todo-context-menu'
        document.body.appendChild($todoContextMenu);
        const $reactDom = ReactDOM.createRoot($todoContextMenu);
        $reactDom.render(
          <GroupListContextMenu _removeGroup={removeGroup} _renameGroup={renameGroup}/>
        )
      }
      if(!$todoContextMenu.classList.contains('show')){
        $todoContextMenu.classList.add('show');
      }
      $todoContextMenu.style.left = `${event.clientX}px`
      $todoContextMenu.style.top = `${event.clientY}px`
      $todoContextMenu.setAttribute('groupid', groupId);
    }
    window.addEventListener('contextmenu', contextMenuClick);

    const bodyClick = () => {
      hideContextMenu();
    }
    document.body.addEventListener('click', bodyClick);

    return () => {
      window.removeEventListener('contextmenu', contextMenuClick);
      document.body.removeEventListener('click', bodyClick);
    }
  }, []);
  function clickGroup(item){
    setSelectGroup({
      ...selectGroup,
      _id: item._id,
      name: item.name
    })
    const _list = window.todoDb.readTaskList({type: 'task', groupId: item._id})
    setTaskList([..._list]);
    hideTaskDetail();
  }

  function saveOrUpdateTask(item){
    if(!item._id){
      item._id = globalId();
    }
    setTask(item);
    setTaskList(taskList.map(a => a._id === item._id ? item : a))
    window.todoDb.saveOrUpdateTask({item: item, type: 'task', groupId: selectGroup._id})
  }

  function clickTask(item){
    setTask({...item});
    if(taskDetailRef.current.classList.contains('show')) return;
    taskDetailRef.current.classList.add('show')
  }

  function hideTaskDetail(){
    if(!taskDetailRef.current.classList.contains('show')) return;
    const animationEnd = (event) => {
      event.target.classList.remove('hide');
      event.target.removeEventListener('animationend', animationEnd);
    }
    taskDetailRef.current.addEventListener('animationend', animationEnd);
    taskDetailRef.current.classList.remove('show');
    taskDetailRef.current.classList.add('hide');
  }

  function renameGroup(groupId){
    setRenameGroupId(groupId);
  }
  function removeGroup(groupId){
    const _group = groupList.filter(a => a._id === +groupId)[0];
    if(!!_group){
      _group.deleted = 1;
      setGroupList(groupList.filter(a => a._id !== +groupId))
      window.todoDb.saveOrUpdateTask({item: _group});
    }
  }

  return (
    <div className="x-todo">
      <div className="x-todo-container">
        <TaskGroup _selectGroup={clickGroup} _list={groupList} _renameGroupId={renameGroupId}/>
        <TaskList key={selectGroup._id} _groupId={selectGroup._id} 
          _groupName={selectGroup.name} _list={taskList} 
          _hideTaskDetail={hideTaskDetail}
          _clickTask={clickTask}/>
      </div>
      <div ref={taskDetailRef} className='task-detail-container'>
        <TaskDetail key={task._id} _item={task} _saveOrUpdateTask={saveOrUpdateTask}/>
      </div>
    </div>
  )
}