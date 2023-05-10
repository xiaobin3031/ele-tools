import { useState } from 'react'
import SvgIcon from '../../component/SvgIcon';
import globalId from '../../util/globalId';
import './todo2.css'

function ViewCard({item}){

  const showCount = !!item.completeCount && !!item.totalCount;
  return (
    <div className='card'>
      <div className='head'>
        <div>{item.title}</div>
        {
          !!item.endTime && <div>{item.endTime}</div>
        }
      </div>
      <div className='content'>
        {item.description}
      </div>
      <div className='foot'>
        <span>
          <SvgIcon iconType='check'/>
          {
            showCount && 
            [
              <span>{item.completeCount}</span>
              /
              <span>{item.totalCount}</span>
            ]
          }
        </span>
        <SvgIcon iconType='menu' />
      </div>
    </div>
  )
}

export default function Todo2({}){
  const [todoList, setTodoList] = useState([]);

  function addTodo(){
    setTodoList([
      ...todoList,
      {_id: globalId()}
    ])
  }
  return (
    <div className="x-todo">
      <div className='tasks'>
        {
          todoList.length > 0 &&
            todoList.map(a => {
              return <ViewCard key={a._id} item={a} />
            })
        }
      </div>
      <div style={{display: 'flex', cursor: 'pointer'}} onClick={addTodo}>
        <SvgIcon iconType='add'/>
        <span>添加任务</span>
      </div>
    </div>
  )
}