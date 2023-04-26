import { useRef } from 'react';
import '../css/alert.css'
import Icon from './Icon'
import Row from './Row';

let clickStart = 0, time;
function mouseDown(){
  clickStart = new Date().getTime();
}

function mouseUp(event){
  time = new Date().getTime() - clickStart;
  if(time > 500){
    event.stopPropagation();
  }
}

function stopClick(event){
  if(time > 500){
    event.stopPropagation();
  }
}

function AlertHeader({titleIcon, title, subTitle, closeable, closeAlert}){

  return (
    <div className='header'>
      {
        !!titleIcon && <span className='title-icon'>{titleIcon}</span>
      }
      <span className='title' onMouseDown={mouseDown} onMouseUp={event => mouseUp(event)} onClick={event => stopClick(event)}>{title}</span>
      {
        !!subTitle && <span className='sub-title' onMouseDown={mouseDown} onMouseUp={event => mouseUp(event)} onClick={event => stopClick(event)}>{subTitle}</span>
      }
      {
        !!closeable && <Icon className="close-icon" iconType='close' onClick={closeAlert}/>
      }
    </div>
  )
}

function AlertContent({content, closeable, closeAlert}){

  return (
    <div className='content'>
      <Row onMouseDown={mouseDown} onMouseUp={event => mouseUp(event)} onClick={event => stopClick(event)}>
        {content}
      </Row>
      {
        !!closeable &&
          <span className='close-icon' onClick={closeAlert}><Icon iconType='close'/></span>
      }
    </div>
  )
}

export default function Alert({
  color, titleIcon, title, subTitle, content, closeable=true, clickToClose=false
}){

  const _alertRef = useRef(null);
  let _classList = color;
  if(!!closeable){
    _classList += ' close-auto';
  }
  if(!!clickToClose){
    _classList += ' click-to-close';
  }

  function closeAlert(){
    _alertRef.current.classList.add('close-focus');
  }

  function removeNode(){
    _alertRef.current.parentNode.removeChild(_alertRef.current);
  }

  function mouseEnterAlert(){
    _alertRef.current.classList.remove('close-auto');
  }

  function mouseLeaveAlert(){
    if(_classList.indexOf('close-auto') > -1){
      _alertRef.current.classList.add('close-auto');
    }
  }

  return (
    <div className={`x-alert ${_classList}`} ref={_alertRef} 
      onAnimationEnd={removeNode} 
      onMouseEnter={mouseEnterAlert}
      onMouseLeave={mouseLeaveAlert}
      onClick={() => !!clickToClose ? closeAlert() : ''}>
      {
        !!title &&
          <AlertHeader titleIcon={titleIcon} title={title} subTitle={subTitle} closeable={closeable} closeAlert={closeAlert}/>
      }
      { 
        !!content && 
          <AlertContent content={content} closeable={!title && closeable ? true : false} closeAlert={closeAlert}/>
      }
    </div>
  )
}