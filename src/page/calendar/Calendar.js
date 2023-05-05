// 日历，用来展示一些任务安排
import ToDo from './ToDo';
import './calendar.css'
import { useRef } from "react"

let weekId= 1;
let dayId = 1;
const notInMonthClass = ['not-current-month', 'last-day-in-line'];
const lastDayInLineClass = ['last-day-in-line'];
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

function TodoAdd(event){

  return (
    <div className='x-calendar-todo-add'>

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
  function selectADay(event){
    Array.from(event.target.parentElement.children)
      .filter(a => a.classList.contains('selected'))
      .forEach(a => a.classList.remove('selected'))
    if(!event.target.classList.contains('today') && !event.target.classList.contains('not-current-month')){
      event.target.classList.add('selected')
    }
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
            <div onClick={selectADay} key={`day-id-${dayId++}`} className={_class.join(' ')}><span>{a.day}</span></div>
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