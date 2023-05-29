// 日历，用来展示一些任务安排
import ReactDOM from 'react-dom/client';
import './calendar.css'
import { useRef, useState } from "react"
import Row from '../../component/Row';
import Input from '../../component/Input';
import { Button } from '../../component/Button';
import { globalId } from '../../util/global';
import Icon from '../../component/Icon';

let weekId= 1;
let dayId = 1;
const weekPrefix = "周";
const weekContentList = ['日', '一', '二', '三', '四', '五', '六'];
const todoViewId = 'x-calendar-todo-view';
function Week(){

  return (
    <div className='x-calendar-week'>
      {
        weekContentList.map(a => {
          return (
            <div key={`week-id-${weekId++}`}>{weekPrefix + a}</div>
          )
        })
      }
    </div>
  )
}

function selectDayDiv(event){
  let $dom = event.target;
  Array.from($dom.parentElement.children)
    .filter(a => a.classList.contains('selected'))
    .forEach(a => a.classList.remove('selected'))
  if(!$dom.classList.contains('today') && !$dom.classList.contains('not-current-month')){
    $dom.classList.add('selected')
  }
}

function clickDay(event, item, year, month){
  if(!item.thisMonth){
    return;
  }
  const width = 240;  //元素展示后的实际尺寸
  const height = 175;//元素展示后的实际尺寸
  let $todoViewDom = document.getElementById(todoViewId);
  if(!!$todoViewDom){
    $todoViewDom.style.display = 'block';
  }else{
    const todoView = <TodoAdd year={year} month={month} day={item.day}/>
    $todoViewDom = document.createElement('div');
    $todoViewDom.id = todoViewId;
    $todoViewDom.style.position = 'absolute';
    $todoViewDom.style.width = `${width}px`
    $todoViewDom.style.height = `${height}px`
    document.body.appendChild($todoViewDom);
    ReactDOM.createRoot($todoViewDom).render(todoView);
  }
  // 计算view的位置
  const pos = {};
  pos.left = event.target.offsetLeft;
  pos.top = event.target.offsetTop;
  pos.width = event.target.offsetWidth;
  pos.height = event.target.offsetHeight;

  let posClass = '';
  if(pos.top > height){
    pos.top -= height - pos.height; // top
    posClass = 'bottom';
  }else{
    // bottom
    posClass = 'top';
  }
  if(width > pos.left){
    pos.left += pos.width + 10; //在右边
    posClass += '-left';
  }else{
    pos.left -= width + 10;  //在左边
    posClass += '-right';
  }
  $todoViewDom.style.top = `${pos.top}px`
  $todoViewDom.style.left = `${pos.left}px`
  Array.from($todoViewDom.classList)
    .forEach(a => $todoViewDom.classList.remove(a));
  $todoViewDom.classList.add(posClass);
}

function TodoAdd({year, month, day}){

  const [values, setValues] = useState({_id: globalId()});
  const _form = useRef(null);

  function valueChange(event){
    values[event.target.name] = event.target.value;
    setValues({...values});
  }

  function closeTodoView(){
    _form.current.reset();
    setValues({_id: globalId()});
    document.getElementById(todoViewId).style.display = 'none';
  }

  function saveTodo(){
    const _item = {...values};
    _item.day = day;
    window.fileOp.updateOrSaveCalendarTodo(_item, year, month)
      .then(res => closeTodoView());
  }

  return (
    <div className='x-calendar-todo-add'>
      <form ref={_form}>
        <Row>
          <Input 
            name="title" 
            borderclear={1}
            value={!values.title ? '' : values.title} 
            placeholder='请输入任务标题'
            onChange={valueChange}
            style={{
              width: '100%'
            }}
          />
        </Row>
        <Row>
          <Input
            multiline={1}
            borderclear={1}
            name='description'
            value={!values.description ? '' : values.description}
            onChange={valueChange}
            placeholder='请输入任务描述'
            rows="5"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              resize: 'none'
            }}
          />
        </Row>
        <Row>
          <Button size='sm' onClick={closeTodoView}>关闭</Button>
          <Button color='primary' size='sm' style={{float: 'right'}} onClick={saveTodo}>保存</Button>
        </Row>
      </form>
    </div>
  )
}

let reading = 0;
function Day({year, month, day, isToday}){
  const [todoList, setTodoList] = useState([]);
  if(reading === 0){
    reading = 1;
    window.fileOp.readCalendarTodo(year, month).then(_todoList => {
      setTodoList(_todoList);
    }).catch(_err => reading = 0);
  }
  const calendar = new Date();
  calendar.setFullYear(year);
  calendar.setMonth(month - 1);
  calendar.setDate(day);

  const dateList = [];
  dateList.push(
    {
      day: day,
      thisMonth: true,
      today: isToday === 1
    }
  );
  for(let i = day - 1;i>=1;i--){
    dateList.unshift({
      day: i,
      thisMonth: true
    })
    calendar.setDate(i);
  }
  // 说明不是周日，继续减
  while(calendar.getDay() > 0){
    calendar.setDate(calendar.getDate() - 1);
    dateList.unshift({
      day: calendar.getDate(),
      thisMonth: false
    })
  }
  calendar.setFullYear(year);
  calendar.setMonth(month - 1);
  calendar.setDate(day);
  for(let i = day + 1;;i++){
    calendar.setDate(i);
    if(calendar.getMonth() !== (month - 1)){ // 可能过会跨年
      break;
    }
    dateList.push({
      day: calendar.getDate(),
      thisMonth: true
    })
  }
  while(true){
    // 说明不是周六，继续加
    dateList.push({
      day: calendar.getDate(),
      thisMonth: false
    })
    if(calendar.getDay() === 6){
      break;
    }
    calendar.setDate(calendar.getDate() + 1);
  }
  return (
    <div className='x-calendar-day'>
      {
        dateList.map((a, index) => {
          const _notInMonth = !a.thisMonth;
          const _lastDayInLineFlag = index > 0 && index % 7 === 6;
          let _class = [];
          if(a.today){
            _class.push('today')
          }
          if(_notInMonth && _lastDayInLineFlag){
            _class.push('not-current-month', 'last-day-in-line')
          }else if(_lastDayInLineFlag){
            _class.push('last-day-in-line')
          }else if(_notInMonth){
            _class.push('not-current-month')
          }
          const _todoList = todoList.filter(b => b.day === a.day);
          return (
            <div onClick={selectDayDiv} key={`day-id-${dayId++}`} className={_class.join(' ')}>
              <span onClick={event => clickDay(event, a, year, month)}>{a.day}</span>
              {
                _todoList.length > 0 &&
                  _todoList.forEach(b => {
                    return (
                      <div key={`cal-todo-${b._id}`}>{b.description}</div>
                    )
                  })
              }
            </div>
          )
        })
      }
    </div>
  )
}

function Head({year, month, _changeYearMonth}){

  return (
    <div className='x-calendar-head'>
      <div></div>
      <div style={{
        textAlign: 'center'
      }}>
        <table align='center'>
          <thead>
            <tr>
              <th><Icon onClick={() => _changeYearMonth(year - 1, month)} iconType="arrow-double-left"/></th>
              <th><Icon onClick={() => _changeYearMonth(year, month - 1)} iconType="arrow-right" style={{
                rotate: '180deg'
              }}/></th>
              <th style={{
                fontSize: '2em'
              }} onClick={() => _changeYearMonth(new Date().getFullYear(), new Date().getMonth() + 1)}>{year} - {month}</th>
              <th><Icon onClick={() => _changeYearMonth(year, month + 1)} iconType="arrow-right" /></th>
              <th><Icon onClick={() => _changeYearMonth(year + 1, month)} iconType="arrow-double-right" /></th>
            </tr>
          </thead>
        </table>
      </div>
      <div></div>
    </div>
  )
}

export default function Calendar({
  year, month, date
}){

  const now = new Date();

  const [currentRef, setCurrentRef] = useState({
    year: year || now.getFullYear(),
    month: month || (now.getMonth() + 1),
    date: date || now.getDate()
  })

  function changeYearMonth(_year, _month){
    if(_month > 12){
      _month -= 12;
      _year++;
    } else if(_month <= 0){
      _month += 12;
      _year--
    }
    if(_year <= 0 || _year > 9999){
      return;
    }
    setCurrentRef({...currentRef, month: _month, year: _year})
  }

  function dateChange(_date){

  }

  return (
    <div className='x-calendar'>
      <Head 
        _changeYearMonth={changeYearMonth}
        year={currentRef.year} 
        month={currentRef.month}/>
      <Week />
      <Day 
        year={currentRef.year}
        month={currentRef.month}
        day={currentRef.date}
        isToday={
          now.getFullYear() === currentRef.year 
            && (now.getMonth() + 1) === currentRef.month 
            && now.getDate() === currentRef.date
          ? 1 : 0
          }
        />
    </div>
  )
}