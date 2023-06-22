import { useState } from "react";
import Row from "../../../component/Row";
import Select2 from "../../../component/Select2";
import { ButtonGroup } from "../../../component/Button";
import { androidKeys } from "../data/data";

export default function PressKeyStep({_step, _stepChange}){

  const [keyTypes, setKeyTypes] = useState([
    {
      _color: 'primary',
      _text: '返回键',
      _value: 'back',
      checked: _step.keyType === 'back'
    },
    {
      _color: 'primary',
      _text: '菜单键',
      _value: 'menu',
      checked: _step.keyType === 'menu'
    },
    {
      _color: 'primary',
      _text: '普通按键',
      _value: 'key',
      checked: _step.keyType === 'key'
    }
  ])

  function keyTypeChange(item){
    keyTypes.forEach(a => a.checked = a._value === item._value)
    setKeyTypes([...keyTypes])
    _step.keyType = item._value;
    _stepChange({..._step})
  }

  function valueChange(event){
    _step[event.target.name] = event.target.value;
    _stepChange({..._step})
  }

  return (
    <Row>
      <ButtonGroup groupType="radio" list={keyTypes} size="sm" valuecheck={keyTypeChange} />
      {
        keyTypes.some(a => a._value === 'key' && !!a.checked) &&
          <Select2 style={{marginLeft: '10px'}} size="sm" list={androidKeys} name="key" onChange={valueChange} />
      }
    </Row>
  )
}