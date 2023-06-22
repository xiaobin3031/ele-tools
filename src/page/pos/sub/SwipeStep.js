import { useState } from "react";
import Row from "../../../component/Row";
import Label from "../../../component/Label";
import { ButtonGroup } from "../../../component/Button";

export default function SwipeStep({_step, _stepChange}){
  const [directions, setDirections] = useState([
    {
      _color: 'primary',
      _text: '上',
      _value: 'up',
      checked: _step.direction === 'up'
    },
    {
      _color: 'primary',
      _text: '右',
      _value: 'right',
      checked: _step.direction === 'right'
    },
    {
      _color: 'primary',
      _text: '下',
      _value: 'down',
      checked: _step.direction === 'down'
    },
    {
      _color: 'primary',
      _text: '左',
      _value: 'left',
      checked: _step.direction === 'left'
    }
  ])

  function directionChange(item){
    directions.forEach(a => a.checked = a._value === item._value)
    setDirections([...directions])
    _step.direction = item._value;
    _stepChange({..._step})
  }

  return (
    <Row>
      <Label>滑动方向</Label>
      <ButtonGroup size="sm" groupType="radio" list={directions} valuecheck={directionChange} />
    </Row>
  )
}