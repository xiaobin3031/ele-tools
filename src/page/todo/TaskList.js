import React, { useEffect, useRef, useState } from 'react';
import { globalId } from '../../util/global';
import SvgIcon from '../../component/SvgIcon';
import CreateTask from './CreateTask';

export default function TaskList({_groupId, _groupName, _clickTask, _hideTaskDetail}){

  const [todoList, setTodoList] = useState([])
  const [uncompleteTodoList, setUncompleteTodoList] = useState([]);
  const [completeTodoList, setCompleteTodoList] = useState([]);
  const [completeCount, setCompleteCount] = useState(0);
  const taskListsRef = useRef(null)
  const showCompleteList = useRef(false);

  useEffect(() => {
    const _todoList = window.todoDb.readTaskList({type: 'task', groupId: _groupId});
    setTodoList(_todoList);
    refreshList(_todoList);
  }, [_groupId])

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
      setTodoList([ ...todoList, newItem ])
      setUncompleteTodoList([ ...uncompleteTodoList, newItem ])
      event.target.value = '';
      window.todoDb.saveOrUpdateTask({
        item: newItem,
        type: 'task',
        groupId: _groupId
      })
      event.target.blur();
    }
  }

  function taskComplete(event, item){
    event.stopPropagation();
    item.complete = !item.complete;
    const _list = todoList.map(a => a._id === item._id ? item : a);
    setTodoList(_list)
    refreshList(_list)
    window.todoDb.saveOrUpdateTask({item: item, type: 'task', groupId: item.pId})
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

  function removeTask(event, item){
    event.stopPropagation();
    if(window.confirm(`是否删除该任务?`)){
      const _item = {...item, deleted: 1}
      window.todoDb.saveOrUpdateTask({
        item: _item, type: 'task', groupId: _groupId
      })
      const _list = todoList.filter(a => a._id !== item._id); 
      setTodoList(_list);
      refreshList(_list)
    }
  }

  function clickTaskList(){
    _hideTaskDetail();
    clearTaskSelectStatus();
  }

  function refreshList(_todoList){
    setUncompleteTodoList(_todoList.filter(a => !a.complete))
    if(showCompleteList.current){
      const completeList = _todoList.filter(a => !!a.complete);
      setCompleteTodoList(completeList)
      setCompleteCount(completeList.length)
    }else{
      setCompleteCount(_todoList.filter(a => !!a.complete).length)
    }
  }

  function toggleCompleteList(){
    if(completeCount > 0){
      showCompleteList.current = !showCompleteList.current;
      if(showCompleteList.current){
        setCompleteTodoList(todoList.filter(a => !!a.complete))
      }else{
        setCompleteTodoList([])
      }
    }
  }

  return (
    <div className="task-list" onClick={clickTaskList}>
      <div className='task-list-list' ref={taskListsRef}>
        {
          uncompleteTodoList.length > 0 &&
            uncompleteTodoList.map((a, index) => {
              return (
                <div att={a._id} key={a._id} className='item' onClick={event => clickTask(event, a)}>
                  <div className="checkbox" onClick={(event) => taskComplete(event, a)}></div>
                  <span>{a.content}</span>
                  {
                    !a.complete && <SvgIcon iconType='ashbin' color='rgba(255, 127, 88, 0.8)' onClick={event => removeTask(event, a)} className='remove'/>
                  }
                </div>
              )
            })
        }
        <div style={{ borderBottom: '1px solid #c3c3c3c3' }}>
          <label className='task-list-complete-list' onClick={toggleCompleteList}>已完成   ({completeCount})</label>
        </div>
        {
          completeTodoList.length > 0 &&
            completeTodoList.map((a, index) => {
              return (
                <div att={a._id} key={a._id} className='item' onClick={event => clickTask(event, a)}>
                  <div className="checkbox complete" onClick={(event) => taskComplete(event, a)}></div>
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
        <CreateTask _onKeyDown={createNewTask} _name='content' _placeholder="添加任务" />
      </div>
    </div>
  )
}