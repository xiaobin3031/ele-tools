// 日历，用来展示一些任务安排
import ToDo from './ToDo';
import ReactDOM from 'react-dom/client';
import './calendar.css'
import { useRef } from "react"
import Row from '../../component/Row';
import Label from '../../component/Label';
import Input from '../../component/Input';

let weekId= 1;
let dayId = 1;
const weekPrefix = "周";
const weekContentList = ['日', '一', '二', '三', '四', '五', '六'];
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
function showToView(event){
  const _todoView = <ToDo />
}

function TodoAdd({left, top}){

  const _values = useRef({});

  function valueChange(event){
    _values.current[event.target.name] = event.target.value;
  }

  const _style = {
    position: 'absolute',
    left: left,
    top: top
  }

  return (
    <div className='x-calendar-todo-add' style={_style}>
      <Row>
        <Label>标题</Label>
        <Input name="title" value={!_values.current.title ? '' : _values.current.title} onChange={valueChange}/>
      </Row>
    </div>
  )
}

function Day({dayChange, year, month, day}){
  const calendar = new Date();
  calendar.setFullYear(year);
  calendar.setMonth(month - 1);
  calendar.setDate(day);

  const dateList = [];
  dateList.push(
    {
      day: day,
      thisMonth: true,
      today: true
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
    if(calendar.getMonth() === month){
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
  function selectDayDiv(event){
    console.log('select day', event.target);
    let $dom = event.target;
    Array.from($dom.parentElement.children)
      .filter(a => a.classList.contains('selected'))
      .forEach(a => a.classList.remove('selected'))
    if(!$dom.classList.contains('today') && !$dom.classList.contains('not-current-month')){
      $dom.classList.add('selected')
    }
  }
  function clickDay(event){
    event.stopPropagation();
    const todoView = <TodoAdd left={event.target.offsetLeft} top={event.target.offsetTop} />
    const $todoViewDom = document.createElement('div');
    $todoViewDom.id = 'x-calendar-todo-view';
    document.body.appendChild($todoViewDom);
    ReactDOM.createRoot($todoViewDom).render(todoView);
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
          return (
            <div onClick={selectDayDiv} key={`day-id-${dayId++}`} className={_class.join(' ')}>
              <span onClick={clickDay}>{a.day}</span>
            </div>
          )
        })
      }
    </div>
  )
}
function Month({monthChange}){

}
function Year({yearChange}){
  
}
export default function Calendar({
  year, month, date
}){

  const now = new Date();

  const currentRef = useRef({
    year: year || now.getFullYear(),
    month: month || (now.getMonth() + 1),
    date: date || now.getDate()
  })

  console.log('currentRef', currentRef);

  function yearChange(_year){

  }
  function monthChange(_month){

  }
  function dateChange(_date){

  }

  return (
    <div className='x-calendar'>
      <Week />
      <Day 
        year={currentRef.current.year}
        month={currentRef.current.month}
        day={currentRef.current.date}
        />
    </div>
  )
}