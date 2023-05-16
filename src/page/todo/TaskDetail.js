import React, { useState } from 'react';
import './todo.css'
import globalId from '../../util/globalId';
import SvgIcon from '../../component/SvgIcon';
import Input from '../../component/Input';
import Row from '../../component/Row';
import DateTimePicker from '../../component/DateTimePicker';

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

export default function TaskDetail({_item, _saveOrUpdateTask}){

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

  function timeChange(_value){
    const _task = {...task}
    _task.taskInfo.notifyTime = _value;
    updateTask(_task);
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
          <DateTimePicker placeholder='提醒我' borderclear={1} name='notifyTime' dateChange={timeChange} value={task.taskInfo.notifyTime}/>
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