import { useState } from 'react'
import SvgIcon from '../../component/SvgIcon';
import globalId from '../../util/globalId';
// import './todo2.css'
import Input from '../../component/Input';
import Row from '../../component/Row';
import DateTimePicker from '../../component/DateTimePicker';

function ViewCard({item}){

  function valueChange(event){
    
  }

  const showCount = !!item.completeCount && !!item.totalCount;
  return (
    <div className='card'>
      <div className='head'>
        <Row>
          <Input name='title' 
            placeholder='请输入标题'
            onChange={valueChange} 
            value={!!item.title ? item.title : ''} style={{ width: '100%' }}/>
        </Row>
        <Row>
          <DateTimePicker name='endTime' defaultValue={!item.endTime ? '' : item.endTime} style={{width: '100%'}}/>
        </Row>
      </div>
      <Row className='content'>
        <Input 
          name="description"
          multiline={1}
          placeholder="请输入描述"
          onChange={valueChange}
          value={!!item.content ? item.content: ''}
          style={{
            width: '100%',
            resize: 'none'
          }}
        />
      </Row>
      <Row className='foot'>
        <span style={{display: 'flex'}}>
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
      </Row>
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