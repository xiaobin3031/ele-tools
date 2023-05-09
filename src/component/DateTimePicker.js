import { useRef, useState } from 'react';
import '../css/dateTimePicker.css'
import Icon from './Icon';
import SvgIcon from './SvgIcon'

let weekId= 1;
let dayId = 1;
const weekPrefix = "周";
const weekContentList = ['日', '一', '二', '三', '四', '五', '六'];

function getDayData(year, month ,day, isToday){
  const calendar = new Date();
  calendar.setFullYear(year);
  calendar.setMonth(month - 1);
  calendar.setDate(day);

  const dateList = [];
  dateList.push(
    {
      day: day,
      thisMonth: true,
      today: isToday
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
  let i = 0;
  while(i++ < 31){
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
  const trDataList = [];
  dateList.forEach((a, index) => {
    if(index % 7 === 0){
      trDataList.push([]);
    }
    trDataList[trDataList.length - 1].push(a);
  })

  return trDataList;
}

function CalendarSelect({year, month, date}){

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

  const weekData = weekContentList.map(a => weekPrefix + a);
  const trDataList = getDayData(currentRef.year, currentRef.month, currentRef.date, 
    now.getFullYear() === currentRef.year && (now.getMonth() + 1) === currentRef.month && now.getDate() === currentRef.date);

    console.log('trDataList', trDataList);
  function selectDayDiv(){

  }

  return (
    <div className='picker-region'>
      <table>
        <thead>
          <tr>
            <th colSpan={7}>
              <div className='year-month-ctrl'>
                <span><Icon onClick={() => changeYearMonth(year - 1, month)} iconType="arrow-double-left" style={{width: '15px', height: '15px'}}/></span>
                <span><Icon onClick={() => changeYearMonth(year, month - 1)} iconType="arrow-right" style={{ rotate: '180deg',width: '15px', height: '15px' }}/></span>
                <span onClick={() => changeYearMonth(now.getFullYear(), now.getMonth() + 1)}>{currentRef.year} - {currentRef.month}</span>
                <span><Icon onClick={() => changeYearMonth(year, month + 1)} iconType="arrow-right" style={{width: '15px', height: '15px'}}/></span>
                <span><Icon onClick={() => changeYearMonth(year + 1, month)} iconType="arrow-double-right" style={{width: '15px', height: '15px'}}/></span>
              </div>
            </th>
          </tr>
          <tr className='week' key={`week-tr-id-${dayId++}`}>
            {
              weekData.map(a => {
                return (
                  <th key={`week-id-${weekId++}`}>{a}</th>
                )
              })
            }
          </tr>
        </thead>
        <tbody>
          {
            trDataList.map(a => {
              return (
                <tr key={`day-tr-id-${dayId++}`} className='day'>
                  {
                    a.map(b => {
                      const _notInMonth = !b.thisMonth;
                      let _class = [];
                      if(b.today){
                        _class.push('today')
                      }
                      if(_notInMonth){
                        _class.push('not-current-month')
                      }
                      return (
                        <td onClick={event => selectDayDiv(event, a, year, month)} className={_class}>{b.day}</td>
                      )
                    })
                  }
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
}

export default function DateTimePicker({showOnFocus=false}){

  const pickerRef = useRef(null);

  function showPicker(){
    const height = pickerRef.current.offsetHeight;
    const left = pickerRef.current.offsetLeft;
    const top = pickerRef.current.offsetTop;
    pickerRef.current.classList.add('show');
    pickerRef.current.getElementsByClassName('picker-region')[0].style.left = `${left}px`
    pickerRef.current.getElementsByClassName('picker-region')[0].style.top = `${top + height}px`
  }

  return (
    <div className='x-date-time-picker' ref={pickerRef}>
      <input className='date-time' type='text' onClick={event => showOnFocus ? showPicker(event) : ''}/>
      <span className='icon' onClick={showPicker}>
        <SvgIcon iconType='calendar' />
      </span>
      <CalendarSelect/>
    </div>
  )
}