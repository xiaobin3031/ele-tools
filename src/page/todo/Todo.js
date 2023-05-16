import React, { useEffect, useRef, useState } from 'react';
import './todo.css'
import globalId from '../../util/globalId';
import SvgIcon from '../../component/SvgIcon';
import ReactDOM from 'react-dom/client';
import TaskList from './TaskList';
import TaskDetail from './TaskDetail';
import TaskGroup from './TaskGroup';

function hideContextMenu(){
  document.getElementById('todo-context-menu')?.classList.remove('show')
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
    const _group = window.todoDb.readGroup({_id: groupId});
    if(!_group){
      return;
    }
    if(window.confirm(`是否删除清单[${_group.name}]`)){
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
    window.todoDb.removeGroupOrTask({_id: groupId});
    setGroupList(window.todoDb.readTaskList({type: 'group'}));
  }

  function addGroup(item){
    if(!item._id){
      item._id = globalId();
    }
    setSelectGroup(item);
    setGroupList([...groupList, item])
    window.todoDb.saveOrUpdateTask({item: item})
  }
  function updateGroup(item){
    if(!item._id) return;
    setGroupList(groupList.map(a => a._id === item._id ? item : a))
    window.todoDb.saveOrUpdateTask({item: item})
  }

  return (
    <div className="x-todo">
      <div className="x-todo-container">
        <TaskGroup _selectGroup={clickGroup} _list={groupList} _renameGroupId={renameGroupId} _addGroup={addGroup} _updateGroup={updateGroup}/>
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