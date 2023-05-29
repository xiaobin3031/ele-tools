import React, { useEffect, useRef, useState } from 'react';
import { globalId } from '../../util/global';
import SvgIcon from '../../component/SvgIcon';
import CreateTask from './CreateTask';

export default function TaskList({_list = [], _groupId, _groupName, _clickTask, _hideTaskDetail}){

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
              const _class = ['checkbox'];
              if(!!a.complete){
                _class.push('complete')
              }
              return (
                <div att={a._id} key={a._id} className='item' onClick={event => clickTask(event, a)}>
                  <div className={_class.join(' ')} onClick={(event) => taskComplete(event, a)}></div>
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