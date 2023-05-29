import { useEffect, useRef, useState } from "react";
import Icon from "../../component/Icon";
import Input from "../../component/Input";
import { globalId } from '../../util/global';
import CreateTask from "./CreateTask";
import './todo.css'

export default function TaskGroup({_list = [], _selectGroup, _renameGroupId, _addGroup, _updateGroup, _finishRenameGroup}){

  const [values, setValues] = useState({})

  useEffect(() => {
    const __list = _list.filter(a => a._id === +_renameGroupId);
    setValues({
      name: !!__list && __list.length > 0 ? __list[0].name : ''
    })
  }, [_list, _renameGroupId])

  function createNewGroup(event){
    if(event.keyCode === 13){
      // enter
      const newGroup = event.target.value;
      if(!newGroup){
        return;
      }
      const newItem = {_id: globalId(), name: newGroup};
      _addGroup(newItem);
      event.target.value = '';
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

  function changeGroupName(event){
    if(!event.target.value){
      return;
    }
    setValues({...values, name: event.target.value})
  }
  
  function saveToFile(event, item){
    if(event.keyCode === 13){
      item.name = values.name;
      _updateGroup(item);
      _finishRenameGroup();
    }
  }

  return (
    <div className="task-group">
      <div className='task-group-list'>
        {
          _list.length > 0 &&
            _list.map(a => {
              return (
                <div groupid={a._id} key={a._id} className='group-item' onClick={event => selectGroup(event, a)}>
                  {
                    a._id === +_renameGroupId && 
                      <Input autoFocus={true} value={values.name} 
                        onBlur={_finishRenameGroup}
                        onChange={event => changeGroupName(event)} 
                        onKeyDown={event => saveToFile(event, a)}/>
                  }
                  {
                    a._id !== +_renameGroupId && 
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
        <CreateTask _onKeyDown={createNewGroup} _placeholder='新建清单' _name='name' />
     </div>
    </div>
  )
}