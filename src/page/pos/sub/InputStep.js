import { useRef, useState } from "react";
import Row from "../../../component/Row";
import { ButtonGroup } from "../../../component/Button";
import Input from "../../../component/Input";
import Select2 from "../../../component/Select2";

function getType(_step){
  if(!!_step.text){
    return 'text';
  }
  if(!!_step.randomMax && !!_step.randomMin && _step.randomMax > 0 && _step.randomMin > 0){
    return 'random'
  }
  if(!!_step.cacheKey){
    return 'cache'
  }
  return null;
}

export default function InputStep({_step, _stepChange}){

  const _type = getType(_step);
  const [inputTypes, setInputTypes] = useState([
    {
      _color: 'primary',
      _text: '文本',
      _value: 'text',
      checked: _type === 'text'
    },
    {
      _color: 'primary',
      _text: '随机数字',
      _value: 'random',
      checked: _type === 'random'
    },
    {
      _color: 'primary',
      _text: '缓存',
      _value: 'cache',
      checked: _type === 'cache'
    }
  ])

  const inputType = useRef(() => {
    const item = inputTypes.filter(a => !!a.checked)[0]
    return !!item ? item._value : null
  });

  function typeChange(item){
    inputTypes.forEach(a => a.checked = a._value === item._value)
    setInputTypes([...inputTypes])
    inputType.current = item._value;
  }

  function valueChange(event){
    _step[event.target.name] = event.target.value;
    _stepChange({..._step})
  }

  return (
    <Row>
      <ButtonGroup groupType="radio" size="sm" list={inputTypes} valuecheck={typeChange} />
      {
        inputType.current === 'text' && 
          <Input size="sm" name="text" placeholder="请输入文本内容" style={{
            width: '200px',
            marginLeft: '10px'
          }} onChange={valueChange}/>
      }
      {
        inputType.current === 'random' &&
          <>
            <Input style={{width: '100px', marginLeft: '10px'}} placeholder="最大值" name="randomMax" size="sm" onChange={valueChange} />
            <Input style={{width: '100px', marginLeft: '10px'}} placeholder="最小值" name="randomMin" size="sm" onChange={valueChange} />
            <Select2 showSelect={false} style={{marginLeft: '10px'}} list={[{name: 0}, {name: 1}, {name: 2}]} name="scale" size="sm" onChange={valueChange}/>
          </>
      }
      {
        inputType.current === 'cache' &&
          <Input size="sm" name="cacheKey" placeholder="请输入缓存的key" style={{
            width: '200px',
            marginLeft: '10px'
          }} onChange={valueChange}/>
      }
    </Row>
  )
}