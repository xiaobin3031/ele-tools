import { useRef, useState } from 'react';
import '../css/dateTimePicker.css'
import { Button } from './Button';
import Icon from './Icon';
import SvgIcon from './SvgIcon'

let weekId= 1;
let dayId = 1;
const weekPrefix = "周";
const weekContentList = ['日', '一', '二', '三', '四', '五', '六'];

function getDayData(year, month, day){
  let calendar = new Date();
  calendar.setFullYear(year);
  calendar.setMonth(month - 1);
  calendar.setDate(day);

  const dateList = [];
  dateList.push(
    {
      day: day,
      thisMonth: true,
      selected: true
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
  calendar.setDate(day);
  calendar.setFullYear(year);
  calendar.setMonth(month - 1);
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
  if(calendar.getDay() != 0){
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

function formatDateValue(_dateFormat, year, month, day){
  let _value = '';
  for(let i=0;i<_dateFormat.length;i++){
    let _c = _dateFormat.charAt(i);
    if(_c === 'y'){
      let _len = 1;
      while(_dateFormat.charAt(i + 1) === 'y'){
        _len++;
        i++;
      }
      _len = Math.min(_len, 4);
      _value += (year + '').substring(-_len);
    }else if(_c === 'M'){
      if(_dateFormat.charAt(i + 1) === 'M'){
        if(month < 10){
          _value += '0';
        }
        i++;
      }
      _value += month;
    }else if(_c === 'd'){
      if(_dateFormat.charAt(i + 1) === 'd'){
        if(day < 10){
          _value += '0';
        }
        i++;
      }
      _value += day;
    }else{
      _value += _c;
    }
  }
  return _value;
}

function getDateValue(_dateFormat, _defaultValue){
  const dateValue = {};
  let index;
  for(let i=0;i<_dateFormat.length;i++){
    let _c = _dateFormat.charAt(i);
    if(_c === 'y'){
      index = i;
      let _len = 1;
      while(_dateFormat.charAt(i + 1) === 'y'){
        _len++;
        i++;
      }
      _len = Math.min(_len, 4);
      dateValue.year = +_defaultValue.substring(index, index + _len);
    }else if(_c === 'M'){
      index = i;
      if(_dateFormat.charAt(i + 1) === 'M'){
        dateValue.month = +_defaultValue.substring(index, 2 + index);
        i++;
      }else{
        dateValue.month = +_defaultValue.substring(index, 1 + index);
      }
    }else if(_c === 'd'){
      index = i;
      if(_dateFormat.charAt(i + 1) === 'd'){
        dateValue.date = +_defaultValue.substring(index, 2 + index);
        i++;
      }else{
        dateValue.date = +_defaultValue.substring(index, 1 + index);
      }
    }
  }
  return dateValue;
}

function CalendarSelect({_valueChange, _dateFormat = 'yyyy-MM-dd', _defaultValue, ...props}){

  const now = new Date();
  const dateVal = {
    year: now.getFullYear(),
    month: (now.getMonth() + 1),
    date: now.getDate(),
    currentValue: _defaultValue
  };
  if(!!_defaultValue){
    const dateValue = getDateValue(_dateFormat, _defaultValue);
    dateVal.year = dateValue.year;
    dateVal.month = dateValue.month;
    dateVal.date = dateValue.date;
  }

  const [currentRef, setCurrentRef] = useState(dateVal)

  function changeYearMonth(_year, _month, date){
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
    setCurrentRef({...currentRef, month: _month, year: _year, date: date})
  }

  const weekData = weekContentList.map(a => weekPrefix + a);
  const trDataList = getDayData(currentRef.year, currentRef.month, currentRef.date);

  function selectDayDiv(event, item, year, month){
    // 是否是本月
    let _value = formatDateValue(_dateFormat, year, month, item.day);
    if(item.thisMonth){
      _value = formatDateValue(_dateFormat, year, month, item.day);
      setCurrentRef({...currentRef, currentValue: _value, date: item.day, month: month, year: year, date: item.day})
    }else{
      let _month;
      if(!!item.thisMonth){
        _month = month;
      }else{
        if(item.day <= 7){
          _month = month + 1;
        }else{
          _month = month - 1;
        }
      }
      _value = formatDateValue(_dateFormat, year, _month, item.day);
      changeYearMonth(year, _month, item.day);
    }
    _valueChange(_value);
  }

  return (
    <div className='picker-region' {...props}>
      <table>
        <thead>
          <tr>
            <th colSpan={7}>
              <div className='year-month-ctrl'>
                <span><Icon onClick={() => changeYearMonth(currentRef.year - 1, currentRef.month, currentRef.date)} iconType="arrow-double-left" style={{width: '15px', height: '15px'}}/></span>
                <span><Icon onClick={() => changeYearMonth(currentRef.year, currentRef.month - 1, currentRef.date)} iconType="arrow-right" style={{ rotate: '180deg',width: '15px', height: '15px' }}/></span>
                <span onClick={() => changeYearMonth(now.getFullYear(), now.getMonth() + 1, now.getDate())}>{currentRef.year} - {currentRef.month}</span>
                <span><Icon onClick={() => changeYearMonth(currentRef.year, currentRef.month + 1, currentRef.date)} iconType="arrow-right" style={{width: '15px', height: '15px'}}/></span>
                <span><Icon onClick={() => changeYearMonth(currentRef.year + 1, currentRef.month, currentRef.date)} iconType="arrow-double-right" style={{width: '15px', height: '15px'}}/></span>
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
                      if(b.selected){
                        _class.push('selected')
                      }
                      return (
                        <td key={`day-id-${b.day}`} onClick={event => selectDayDiv(event, b, currentRef.year, currentRef.month)} className={_class.join(' ')}>
                          <div>
                            {b.day}
                          </div>
                        </td>
                      )
                    })
                  }
                </tr>
              )
            })
          }
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={7}>
              <div>
                <div>
                  <Button size='sm' onClick={() => _valueChange('')}>清除</Button>
                </div>
                <div>
                  <Button size='sm' color='primary' 
                    onClick={event => selectDayDiv(event, {day: now.getDate(), thisMonth: true}, now.getFullYear(), now.getMonth() + 1)}>
                      今天
                  </Button>
                </div>
                <div></div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default function DateTimePicker({showOnFocus=false, dateFormat, value, dateChange, ...props}){

  const pickerRef = useRef(null);
  const dateInputRef = useRef(null);
  const blurOnCloseSelect = useRef(true);

  function showPicker(){
    if(pickerRef.current.classList.contains('show')){
      pickerRef.current.classList.remove('show');
    }else{
      const height = pickerRef.current.offsetHeight;
      const left = pickerRef.current.offsetLeft;
      const top = pickerRef.current.offsetTop;
      pickerRef.current.classList.add('show');
      pickerRef.current.getElementsByClassName('picker-region')[0].style.left = `${left}px`
      pickerRef.current.getElementsByClassName('picker-region')[0].style.top = `${top + height}px`
    }
  }

  function showPickerAlways(){
    if(pickerRef.current.classList.contains('show')){
      return;
    }else{
      const height = pickerRef.current.offsetHeight;
      const left = pickerRef.current.offsetLeft;
      const top = pickerRef.current.offsetTop;
      pickerRef.current.classList.add('show');
      pickerRef.current.getElementsByClassName('picker-region')[0].style.left = `${left}px`
      pickerRef.current.getElementsByClassName('picker-region')[0].style.top = `${top + height}px`
    }
  }

  function selectDate(_value){
    dateInputRef.current.value = _value;
    closeSelect();
    dateChange(_value);
  }
  function closeSelect(){
    pickerRef.current.classList.remove('show');
  }
  function inputBlur(){
    if(blurOnCloseSelect.current){
      closeSelect();
    }
  }

  function getDefaultValue(){
    return !!dateInputRef.current ? dateInputRef.current.value : value;
  }

  const _inputClass = ['date-time'];
  if(props.borderclear === 1){
    _inputClass.push('border-less')
  }

  return (
    <div className='x-date-time-picker' ref={pickerRef}>
      <input className={_inputClass.join(' ')} type='text' name={props.name} 
        onClick={showPickerAlways} 
        ref={dateInputRef} 
        onBlur={inputBlur}
        onChange={() => {}}
        placeholder={props.placeholder || ''}
        value={value}/>
      <span className='icon' onClick={showPicker}>
        <SvgIcon iconType='calendar' />
      </span>
      <CalendarSelect 
        onMouseEnter={() => blurOnCloseSelect.current = false}
        onMouseLeave={() => blurOnCloseSelect.current = true}
        _valueChange={selectDate} _dateFormat={dateFormat} _defaultValue={getDefaultValue()}/>
    </div>
  )
}