// 日历，用来展示一些任务安排
import './calendar.css'
import { useRef } from "react"

let weekId= 1;
let dayId = 1;
function Week(){

  const weekPrefix = "星期";
  const weekContentList = ['日', '一', '二', '三', '四', '五', '六'];

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
function Day({dayChange, year, month, day}){
  console.log('year', year, month, day)
  const calendar = new Date();
  calendar.setFullYear(year);
  calendar.setMonth(month - 1);
  calendar.setDate(day);

  console.log('calendar', calendar);

  const dateList = [];
  dateList.push(
    {
      day: day,
      thisMonth: true
    }
  );
  for(let i = day - 1;i>=1;i--){
    dateList.unshift({
      day: i,
      thisMonth: true
    })
    calendar.setDate(i);
  }
  console.log('dateList1', dateList);
  // 说明不是周日，继续减
  console.log('calendar.day', calendar.getDay());
  while(calendar.getDay() > 0){
    calendar.setDate(calendar.getDate() - 1);
    dateList.unshift({
      day: calendar.getDate(),
      thisMonth: false
    })
    console.log('calendar.day', calendar.getDay());
  }
  console.log('dateList2', dateList);
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
  console.log('dateList3', dateList);
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
  console.log('dateList4', dateList);
  return (
    <div className='x-calendar-day'>
      {
        dateList.map(a => {
          return (
            <div key={`day-id-${dayId++}`} className={a.thisMonth ? '': 'not-current-month'}>{a.day}</div>
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