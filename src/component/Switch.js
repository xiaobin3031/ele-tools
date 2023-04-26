import { useRef } from "react"
import '../css/switch.css'

const comBtnBorderClass = 'x-switch-button-border', comBtnClass = 'x-switch-button', comLabelClass = "x-switch-label";
export default function Switch({
  trueName="ok", 
  trueColor="green", 
  falseName="cancel", 
  falseColor="red", 
  okValue="1",
  cancelValue="0",
  currentValue="1",
  switchChange}
){

  const _borderRef = useRef(null);
  const _buttonRef = useRef(null);
  const _labelOkRef = useRef(null);
  const _labelCancelRef = useRef(null);
  const _animation = useRef(false);

  const curVal = useRef(currentValue);
  let _btnClass, _borderClass, _labelOkClass, _labelCancelClass;
  if(curVal.current === okValue){
    _btnClass = [comBtnClass, 'x-switch-button-ok'];
    _borderClass = [comBtnBorderClass, 'x-switch-button-border-ok'];
    _labelOkClass = [comLabelClass, 'x-switch-label-ok'];
    _labelCancelClass = [comLabelClass];
  }else{
    _btnClass = [comBtnClass, 'x-switch-button-cancel'];
    _borderClass = [comBtnBorderClass, 'x-switch-button-border-cancel'];
    _labelOkClass = [comLabelClass];
    _labelCancelClass = [comLabelClass, 'x-switch-label-cancel'];
  }

  function toggleSwitch(){
    if(_animation.current){
      return;
    }
    if(curVal.current === okValue){
      curVal.current = cancelValue;
    }else{
      curVal.current = okValue;
    }
    if(curVal.current === okValue){
      setAnimation(_buttonRef.current, 'x-switch-button-ok-animation')
      setAnimation(_labelOkRef.current, 'x-switch-label-ok-animation')
    }else{
      setAnimation(_buttonRef.current, 'x-switch-button-cancel-animation')
      setAnimation(_labelCancelRef.current, 'x-switch-label-cancel-animation')
    }
  }

  function setAnimation($dom, name){
    $dom.style.animation = `${name} .3s cubic-bezier(0.95, 0.1, 0.95, 0.1)`;
    $dom.style.animationFillMode = 'forwards';
  }

  function buttonAnimationEnd(){
    if(curVal.current === okValue){
      _labelOkRef.current.classList.add('x-switch-label-ok');
      _labelCancelRef.current.classList.remove('x-switch-label-cancel')
      _borderRef.current.classList.add('x-switch-button-border-ok')
      _borderRef.current.classList.remove('x-switch-button-border-cancel')
    }else{
      _labelOkRef.current.classList.remove('x-switch-label-ok');
      _labelCancelRef.current.classList.add('x-switch-label-cancel')
      _borderRef.current.classList.remove('x-switch-button-border-ok')
      _borderRef.current.classList.add('x-switch-button-border-cancel')
    }
    _animation.current = false;
    if(!!switchChange && typeof switchChange === 'function'){
      switchChange(curVal.current);
    }
  }

  function buttonAnimationStart(){
    _animation.current = true;
  }

  return (
    <div className="x-switch">
      <div className={_labelOkClass.join(' ')} color={trueColor} ref={_labelOkRef}>{trueName}</div>
      <div className={_borderClass.join(' ')} ref={_borderRef}>
        <div className={_btnClass.join(' ')} 
          onClick={toggleSwitch} ref={_buttonRef} 
          onAnimationEnd={buttonAnimationEnd}
          onAnimationStart={buttonAnimationStart}
        ></div>
      </div>
      <div className={_labelCancelClass.join(' ')} color={falseColor} ref={_labelCancelRef}>{falseName}</div>
    </div>
  )
}